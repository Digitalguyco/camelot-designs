"use server";

import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export type ContactFormState = { error?: string; success?: boolean };

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function notifyByEmail(fields: { name: string; email: string; phone: string; message: string }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_NOTIFY_EMAIL } = process.env;
  // Email is optional — a submission is always saved to the DB regardless.
  // Wire up SMTP_* to also get notified by email; see .env.example.
  if (!SMTP_HOST || !CONTACT_NOTIFY_EMAIL) return;

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
    });
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: CONTACT_NOTIFY_EMAIL,
      replyTo: fields.email,
      subject: `New enquiry from ${fields.name}`,
      text: `${fields.message}\n\nFrom: ${fields.name} <${fields.email}>${fields.phone ? `\nPhone: ${fields.phone}` : ""}`,
    });
  } catch (err) {
    // Best-effort — the message is already saved, so a mail failure isn't fatal.
    console.error("Contact notification email failed:", err);
  }
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and a message are required." };
  }
  if (!isEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  await db.insert(contactMessages).values({ name, email, phone: phone || null, message });
  await notifyByEmail({ name, email, phone, message });

  return { success: true };
}
