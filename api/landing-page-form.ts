import { neon } from "@neondatabase/serverless";

function sanitizeInput(input: string): string {
  return String(input).replace(/[<>"'`]/g, "").trim();
}

const sql = neon(process.env.DATABASE_URL!);

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: any, res: any) {
  const allowedOrigins = [
    "https://australiasafe.com.au",
    "https://www.australiasafe.com.au",
    "http://localhost:3000",
    "http://localhost:5173",
  ];

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const formType = sanitizeInput(body.form_type || "");

    // =========================
    // PHOTO CHECK
    // =========================
    if (formType === "visual_pre_assessment") {
      const fullName = sanitizeInput(body.full_name || body.name || "");
      const phoneNumber = sanitizeInput(body.phone_number || body.phone || "");
      const emailAddress = sanitizeInput(
        body.email_address || body.email || ""
      ).toLowerCase();
      const materialLocation = sanitizeInput(
        body.material_location || body.location || ""
      );
      const imageUrl = sanitizeInput(body.image_url || "");
      const imagePathname = sanitizeInput(body.image_pathname || "");
      const mimeType = sanitizeInput(body.mime_type || "");
      const imageSizeBytes = Number(body.image_size_bytes || 0);
      const termsAccepted =
        body.terms_accepted === true ||
        String(body.terms_accepted).toLowerCase() === "true";

      if (
        !fullName ||
        !phoneNumber ||
        !emailAddress ||
        !materialLocation ||
        !imageUrl
      ) {
        return res.status(400).json({
          error: "Missing required Photo Check fields.",
          debug: {
            fullName,
            phoneNumber,
            emailAddress,
            materialLocation,
            imageUrl,
          },
        });
      }

      if (!termsAccepted) {
        return res.status(400).json({
          error: "Terms must be accepted.",
        });
      }

      const result = await sql`
        insert into photo_checks (
          full_name,
          phone_number,
          email_address,
          material_location,
          image_url,
          image_pathname,
          image_size_bytes,
          mime_type,
          terms_accepted,
          status
        )
        values (
          ${fullName},
          ${phoneNumber},
          ${emailAddress},
          ${materialLocation},
          ${imageUrl},
          ${imagePathname || null},
          ${imageSizeBytes || null},
          ${mimeType || null},
          ${termsAccepted},
          ${"new"}
        )
        returning id
      `;

      return res.status(200).json({
        success: true,
        message: "Photo Check submitted successfully.",
        id: result?.[0]?.id ?? null,
      });
    }

    // =========================
    // REQUEST QUOTE
    // =========================
    const fullName = sanitizeInput(body.full_name || "");
    const phoneNumber = sanitizeInput(body.phone_number || "");
    const emailAddress = sanitizeInput(body.email_address || "").toLowerCase();
    const serviceType = sanitizeInput(body.service_type || "");
    const description = sanitizeInput(body.description || "");

    if (!fullName || !phoneNumber || !emailAddress || !description) {
      return res.status(400).json({
        error: "Missing required Request Quote fields.",
      });
    }

    const quoteResult = await sql`
      insert into contact_requests (
        full_name,
        phone_number,
        email_address,
        service_type,
        description
      )
      values (
        ${fullName},
        ${phoneNumber},
        ${emailAddress},
        ${serviceType || null},
        ${description}
      )
      returning id
    `;

    return res.status(200).json({
      success: true,
      message: "Request Quote submitted successfully.",
      id: quoteResult?.[0]?.id ?? null,
    });
  } catch (error: any) {
    console.error("landing-page-form error:", error);

    return res.status(500).json({
      error: error?.message || "Internal server error.",
      detail:
        error?.stack?.split("\n").slice(0, 5).join("\n") || null,
    });
  }
}