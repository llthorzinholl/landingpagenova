import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const config = {
  api: {
    bodyParser: true,
  },
};

const allowedOrigins = [
  "https://australiasafe.com.au",
  "https://www.australiasafe.com.au",
  "http://localhost:3000",
  "http://localhost:5173",
];

function setCors(req: any, res: any) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function isValidEmail(email: string) {
  return /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 11 && digits.length <= 12;
}

export default async function handler(req: any, res: any) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL is not configured" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const formType = String(body.form_type || "").trim();

    if (!formType) {
      return res.status(400).json({ error: "form_type is required" });
    }

    if (formType === "quote") {
      const fullName = String(body.full_name || "").trim();
      const phoneNumber = String(body.phone_number || "").trim();
      const emailAddress = String(body.email_address || "")
        .trim()
        .toLowerCase();
      const serviceType = String(body.service_type || "").trim();
      const description = String(body.description || "").trim();

      if (!fullName || fullName.length < 2) {
        return res.status(400).json({ error: "Invalid full_name" });
      }

      if (!isValidEmail(emailAddress)) {
        return res.status(400).json({ error: "Invalid email_address" });
      }

      if (!isValidPhone(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone_number" });
      }

      if (!serviceType) {
        return res.status(400).json({ error: "service_type is required" });
      }

      if (!description || description.length < 10) {
        return res.status(400).json({ error: "description is too short" });
      }

      await sql`
        INSERT INTO landing_page_leads (
          full_name,
          phone_number,
          email_address,
          service_type,
          description,
          form_type
        )
        VALUES (
          ${fullName},
          ${phoneNumber},
          ${emailAddress},
          ${serviceType},
          ${description},
          ${formType}
        )
      `;

      return res.status(200).json({
        success: true,
        message: "Quote form submitted successfully",
      });
    }

    if (formType === "visual_pre_assessment") {
      const fullName = String(body.full_name || "").trim();
      const phoneNumber = String(body.phone_number || "").trim();
      const emailAddress = String(body.email_address || "")
        .trim()
        .toLowerCase();
      const materialLocation = String(body.material_location || "").trim();
      const imageUrl = String(body.image_url || "").trim();
      const imagePathname = String(body.image_pathname || "").trim();
      const mimeType = String(body.mime_type || "").trim();
      const imageSizeBytes = Number(body.image_size_bytes || 0);
      const termsAccepted =
        body.terms_accepted === true ||
        String(body.terms_accepted).toLowerCase() === "true";

      if (!fullName || fullName.length < 2) {
        return res.status(400).json({ error: "Invalid full_name" });
      }

      if (!isValidEmail(emailAddress)) {
        return res.status(400).json({ error: "Invalid email_address" });
      }

      if (!isValidPhone(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone_number" });
      }

      if (!materialLocation || materialLocation.length < 5) {
        return res.status(400).json({ error: "Invalid material_location" });
      }

      if (!imageUrl) {
        return res.status(400).json({ error: "image_url is required" });
      }

      if (!["image/jpeg", "image/png"].includes(mimeType)) {
        return res.status(400).json({ error: "Invalid mime_type" });
      }

      if (!termsAccepted) {
        return res.status(400).json({ error: "Terms must be accepted" });
      }

      await sql`
        INSERT INTO photo_check_submissions (
          full_name,
          phone_number,
          email_address,
          material_location,
          image_url,
          image_pathname,
          image_size_bytes,
          mime_type,
          terms_accepted,
          form_type
        )
        VALUES (
          ${fullName},
          ${phoneNumber},
          ${emailAddress},
          ${materialLocation},
          ${imageUrl},
          ${imagePathname},
          ${imageSizeBytes},
          ${mimeType},
          ${termsAccepted},
          ${formType}
        )
      `;

      return res.status(200).json({
        success: true,
        message: "Photo check submitted successfully",
      });
    }

    return res.status(400).json({
      error: "Unsupported form_type",
    });
  } catch (error: any) {
  console.error("landing-page-form error full:", error);

  return res.status(500).json({
    error: "Failed to save form submission",
    detail: error?.message || String(error) || null,
    stack: error?.stack || null,
  });
}
}