import Mailjet from "node-mailjet";
import { NextResponse } from "next/server";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
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

    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const subject = String(body?.subject ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const service = String(body?.service ?? "").trim();
    const budget = String(body?.budget ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error: "Missing fields",
          message: "Name, email, and message are required.",
        },
        { status: 400 }
      );
    }

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
    const errObj = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      {
        error: "Error sending email",
        message: errObj?.message || "Unknown error occurred",
      },
      { status: errObj?.statusCode || 500 }
    );
  }
}
