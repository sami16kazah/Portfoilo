/* eslint-disable @typescript-eslint/no-explicit-any */
import Mailjet from "node-mailjet";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
  });
  
  const { email, subject, name, message,service,budget } = await req.json();

  try {
    // Attempt to send the email
    const result = await mailjet.post("send", { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: name,
          },
          To: [
            {
              Email: "samkazah444@gmail.com",
              Name: "me",
            },
          ],
          Subject: subject,
          TextPart: message,
          HTMLPart: `<h3>My Name is  ${name} i need a ${subject} ${service} with a budget of ${budget} . <br> </h3><p>${message}</p> <br> my email ${email}`,
        },
      ],
    });

    return NextResponse.json({ status: 'Email sent successfully!', result:result.body });
    
  } catch (error:any) {
    console.error('Error details:', error);  // Log the full error for server-side debugging

    // Extract the error message and status code (if available)
    const errorMessage = error?.message || 'Unknown error occurred';
    const errorStatusCode = error?.statusCode || 500;

    // Return only the simplified error details, not the entire object
    return NextResponse.json({
      error: 'Error sending email',
      message: errorMessage,
    }, { status: errorStatusCode });
  }
}
