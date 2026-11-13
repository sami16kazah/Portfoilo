import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import mongoose, { type Model, type SortOrder } from "mongoose";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";
import { sanitizeUrl, stripUnsafeKeys } from "@/lib/security";

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Verifies an active authenticated NextAuth session with admin role AND
 * checks JWT sessionVersion against MongoDB to allow immediate revocation.
 */
export async function requireAdmin(): Promise<
  | {
      ok: true;
      user: {
        id: string;
        email: string;
        role: string;
        sessionVersion: number;
      };
    }
  | { ok: false; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    await connectToDatabase();
    const dbUser = await User.findOne({ email: session.user.email.toLowerCase() })
      .select("_id email role sessionVersion")
      .lean<{ _id: unknown; email: string; role?: string; sessionVersion?: number } | null>();

    if (!dbUser || dbUser.role !== "admin") {
      return {
        ok: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    const tokenVersion = session.user.sessionVersion ?? 0;
    const dbVersion = dbUser.sessionVersion ?? 0;
    if (tokenVersion !== dbVersion) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Session revoked. Please sign in again." },
          { status: 401 }
        ),
      };
    }

    return {
      ok: true,
      user: {
        id: String(dbUser._id),
        email: dbUser.email,
        role: dbUser.role,
        sessionVersion: dbVersion,
      },
    };
  } catch (error) {
    console.error("Admin session verification error:", error);
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication check failed" }, { status: 500 }),
    };
  }
}

export interface SanitizeModelOptions {
  allowedFields: string[];
  urlFields?: string[];
  safeIconFields?: string[];
  arrayObjectUrlFields?: { arrayField: string; urlKey: string }[];
}

function sanitizeIconValue(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[A-Za-z0-9_-]{1,64}$/.test(trimmed)) return trimmed;
  return sanitizeUrl(trimmed);
}

/**
 * Restricts payload to allowed fields, removes MongoDB operators ($...) and
 * prototype pollution keys, and sanitizes URL properties.
 */
export function sanitizeModelInput(
  rawBody: unknown,
  options: SanitizeModelOptions
): Record<string, unknown> {
  const cleanObject = stripUnsafeKeys(rawBody);
  if (!cleanObject || typeof cleanObject !== "object" || Array.isArray(cleanObject)) {
    return {};
  }

  const input = cleanObject as Record<string, unknown>;
  const urlSet = new Set(options.urlFields || []);
  const iconSet = new Set(options.safeIconFields || []);
  const result: Record<string, unknown> = {};

  for (const field of options.allowedFields) {
    if (!(field in input)) continue;
    const val = input[field];
    if (urlSet.has(field)) {
      result[field] = sanitizeUrl(val);
    } else if (iconSet.has(field)) {
      result[field] = sanitizeIconValue(val);
    } else {
      result[field] = val;
    }
  }

  if (options.arrayObjectUrlFields) {
    for (const { arrayField, urlKey } of options.arrayObjectUrlFields) {
      const list = result[arrayField];
      if (!Array.isArray(list)) continue;
      result[arrayField] = list.map((entry) => {
        if (!entry || typeof entry !== "object") return entry;
        const record = { ...(entry as Record<string, unknown>) };
        if (urlKey in record) {
          record[urlKey] = sanitizeUrl(record[urlKey]);
        }
        return record;
      });
    }
  }

  return result;
}

export function revalidatePortfolioPaths(): void {
  const paths = ["/", "/en", "/de", "/ar", "/llms.txt", "/llms-full.txt", "/sitemap.xml"];
  for (const path of paths) {
    revalidatePath(path);
  }
}

interface CrudFactoryConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  entityName: string;
  sanitize: SanitizeModelOptions;
  sort?: Record<string, SortOrder>;
  requiredOnCreate?: string[];
}

export function createCollectionHandlers(config: CrudFactoryConfig) {
  async function GET() {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    try {
      await connectToDatabase();
      const query = config.model.find();
      if (config.sort) query.sort(config.sort);
      const items = await query;
      return NextResponse.json(items);
    } catch (error) {
      console.error(`Failed to fetch ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${config.entityName}` },
        { status: 500 }
      );
    }
  }

  async function POST(req: Request) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    try {
      await connectToDatabase();
      const rawBody = await req.json();
      const sanitized = sanitizeModelInput(rawBody, config.sanitize);

      for (const reqField of config.requiredOnCreate || []) {
        const val = sanitized[reqField];
        if (typeof val === "string" ? !val.trim() : val === undefined || val === null) {
          return NextResponse.json(
            { error: `Missing required field: ${reqField}` },
            { status: 400 }
          );
        }
      }

      const created = await config.model.create(sanitized);
      revalidatePortfolioPaths();
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.error(`Failed to create ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to create ${config.entityName}` },
        { status: 500 }
      );
    }
  }

  return { GET, POST };
}

export function createItemHandlers(config: CrudFactoryConfig) {
  async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    try {
      const { id } = await params;
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }

      await connectToDatabase();
      const item = await config.model.findById(id);
      if (!item) {
        return NextResponse.json({ error: `${config.entityName} not found` }, { status: 404 });
      }
      return NextResponse.json(item);
    } catch (error) {
      console.error(`Failed to fetch ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${config.entityName}` },
        { status: 500 }
      );
    }
  }

  async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    try {
      const { id } = await params;
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }

      await connectToDatabase();
      const rawBody = await request.json();
      const sanitized = sanitizeModelInput(rawBody, config.sanitize);

      const updated = await config.model.findByIdAndUpdate(
        id,
        { $set: sanitized },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return NextResponse.json({ error: `${config.entityName} not found` }, { status: 404 });
      }

      revalidatePortfolioPaths();
      return NextResponse.json(updated);
    } catch (error) {
      console.error(`Failed to update ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to update ${config.entityName}` },
        { status: 500 }
      );
    }
  }

  async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const adminCheck = await requireAdmin();
    if (!adminCheck.ok) return adminCheck.response;

    try {
      const { id } = await params;
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }

      await connectToDatabase();
      const deleted = await config.model.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ error: `${config.entityName} not found` }, { status: 404 });
      }

      revalidatePortfolioPaths();
      return NextResponse.json({ message: `${config.entityName} deleted` });
    } catch (error) {
      console.error(`Failed to delete ${config.entityName}:`, error);
      return NextResponse.json(
        { error: `Failed to delete ${config.entityName}` },
        { status: 500 }
      );
    }
  }

  return { GET, PUT, DELETE };
}
