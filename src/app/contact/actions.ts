"use server";

import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { getProductBySlug } from "@/lib/data/products";

export type ContactFormState = { error?: string; success?: boolean };

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function notifyByEmail(fields: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, CONTACT_NOTIFY_EMAIL } = process.env;
  // Email is optional — a submission is always saved to the DB regardless.
  // Wire up SMTP_* to also get notified by email; see .env.example.
  if (!SMTP_HOST || !CONTACT_NOTIFY_EMAIL) return;

  try {
    const port = Number(SMTP_PORT) || 587;
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      // 465 is implicit TLS (e.g. Zoho's smtp.zoho.com:465); 587 upgrades via STARTTLS.
      secure: port === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
    });
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to: CONTACT_NOTIFY_EMAIL,
      replyTo: fields.email,
      subject: fields.subject,
      text: `${fields.message}\n\nFrom: ${fields.name} <${fields.email}>${fields.phone ? `\nPhone: ${fields.phone}` : ""}`,
    });
  } catch (err) {
    // Best-effort — the message is already saved, so a mail failure isn't fatal.
    console.error("Contact notification email failed:", err);
  }
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = text(formData, "name");
  const email = text(formData, "email");
  const phone = text(formData, "phone");
  let message = text(formData, "message");
  let subject = `New enquiry from ${name}`;

  // A product enquiry (from a shop item's Enquire button) also collects
  // delivery details. They're folded into the stored message as labelled
  // lines, which the admin inbox and the email both show as-is.
  const productSlug = text(formData, "product");
  if (productSlug) {
    const product = await getProductBySlug(productSlug);
    if (!product) return { error: "That product is no longer available — please use the general enquiry form." };

    const option = text(formData, "option");
    const address = text(formData, "address");
    const city = text(formData, "city");
    const state = text(formData, "state");
    const postalCode = text(formData, "postalCode");
    const country = text(formData, "country");
    const quantity = Math.max(1, Math.floor(Number(text(formData, "quantity")) || 1));

    if (!name || !email || !phone || !address || !city || !state || !country) {
      return { error: "Please fill in your name, email, phone number and delivery address." };
    }
    if (!isEmail(email)) {
      return { error: "Enter a valid email address." };
    }

    const sku = product.variants.find((v) => (v.label || v.sku) === option)?.sku ?? product.variants[0]?.sku;
    message = [
      `Product: ${product.name}${option ? ` (${option})` : ""}${sku ? ` — SKU ${sku}` : ""}`,
      `Quantity: ${quantity}`,
      "",
      "Delivery details",
      `Phone: ${phone}`,
      `Address: ${address}`,
      `City: ${city}`,
      `State / Region: ${state}`,
      ...(postalCode ? [`Postal / ZIP code: ${postalCode}`] : []),
      `Country: ${country}`,
      ...(message ? ["", "Notes", message] : []),
    ].join("\n");
    subject = `Product enquiry: ${product.name} — ${name}`;
  } else {
    if (!name || !email || !message) {
      return { error: "Name, email, and a message are required." };
    }
    if (!isEmail(email)) {
      return { error: "Enter a valid email address." };
    }
  }

  await db.insert(contactMessages).values({ name, email, phone: phone || null, message });
  await notifyByEmail({ name, email, phone, message, subject });

  return { success: true };
}
