import Mailjet from "node-mailjet";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/security";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EmailSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(5000),
  service: z.string().trim().max(120).optional().default(""),
  budget: z.string().trim().max(120).optional().default(""),
  website: z.string().optional().default(""), // optional honeypot
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Too many messages",
          message: `Too many requests. Please wait ${Math.ceil(rate.retryAfterSeconds / 60)} minute(s) or email samkazah444@gmail.com directly.`,
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.MJ_APIKEY_PUBLIC;
    const apiSecret = process.env.MJ_APIKEY_PRIVATE;
    const senderEmail = process.env.MAILJET_SENDER_EMAIL;

    if (!apiKey || !apiSecret || !senderEmail) {
      return NextResponse.json(
        {
          error: "Email service is not configured",
          message:
            "Email delivery is currently unavailable. Please email samkazah444@gmail.com directly.",
        },
        { status: 503 }
      );
    }

    const rawBody = await req.json();
    const parsed = EmailSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please provide a valid name, email address, and message.",
        },
        { status: 400 }
      );
    }

    // Silent success for automated honeypot bots
    if (parsed.data.website.trim()) {
      return NextResponse.json({ status: "Email sent successfully!" });
    }

    const { name, email, subject, message, service, budget } = parsed.data;
    const mailjet = new Mailjet({ apiKey, apiSecret });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "Portfolio Inquiry");
    const safeService = escapeHtml(service || "General");
    const safeBudget = escapeHtml(budget || "Not specified");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: senderEmail,
            Name: name,
          },
          To: [
            {
              Email: "samkazah444@gmail.com",
              Name: "Sami Kazah",
            },
          ],
          ReplyTo: {
            Email: email,
            Name: name,
          },
          Subject: subject || `Portfolio Contact from ${name}`,
          TextPart: `Name: ${name}\nEmail: ${email}\nService: ${service || "General"}\nBudget: ${budget || "Not specified"}\n\n${message}`,
          HTMLPart: `
            <div style="font-family:sans-serif;line-height:1.6;color:#111827">
              <h2>New Portfolio Inquiry</h2>
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> ${safeEmail}</p>
              <p><strong>Subject:</strong> ${safeSubject}</p>
              <p><strong>Service:</strong> ${safeService}</p>
              <p><strong>Budget:</strong> ${safeBudget}</p>
              <hr/>
              <p>${safeMessage}</p>
            </div>
          `,
        },
      ],
    });

    return NextResponse.json({
      status: "Email sent successfully!",
      result: result.body,
    });
  } catch (error: unknown) {
    console.error("Email route error:", error);
    return NextResponse.json(
      {
        error: "Error sending email",
        message: "Failed to deliver email. Please contact samkazah444@gmail.com directly.",
      },
      { status: 500 }
    );
  }
}
