import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

type QuoteBody = {
  full_name?: string;
  phone_number?: string;
  email_address?: string;
  service_type?: string;
  description?: string;
  form_type?: string;
};

type PhotoCheckBody = {
  full_name?: string;
  phone_number?: string;
  email_address?: string;
  material_location?: string;
  image_url?: string;
  image_pathname?: string;
  image_size_bytes?: number;
  mime_type?: string;
  terms_accepted?: boolean;
  form_type?: string;
};

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();

    if (body.form_type === "visual_pre_assessment") {
      const photoBody = body as PhotoCheckBody;

      const fullName = String(photoBody.full_name || "").trim();
      const phoneNumber = String(photoBody.phone_number || "").trim();
      const emailAddress = String(photoBody.email_address || "")
        .trim()
        .toLowerCase();
      const materialLocation = String(photoBody.material_location || "").trim();
      const imageUrl = String(photoBody.image_url || "").trim();
      const imagePathname = String(photoBody.image_pathname || "").trim();
      const imageSizeBytes = Number(photoBody.image_size_bytes || 0);
      const mimeType = String(photoBody.mime_type || "").trim();
      const termsAccepted = Boolean(photoBody.terms_accepted);

      if (
        !fullName ||
        !phoneNumber ||
        !emailAddress ||
        !materialLocation ||
        !imageUrl
      ) {
        return Response.json(
          { error: "Missing required Photo Check fields." },
          { status: 400 }
        );
      }

      await sql`
        insert into photo_checks (
          full_name,
          phone_number,
          email_address,
          material_location,
          image_url,
          image_pathname,
          image_size_bytes,
          mime_type,
          terms_accepted
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
          ${termsAccepted}
        )
      `;

      return Response.json({
        success: true,
        message: "Photo Check submitted successfully.",
      });
    }

    const quoteBody = body as QuoteBody;

    const fullName = String(quoteBody.full_name || "").trim();
    const phoneNumber = String(quoteBody.phone_number || "").trim();
    const emailAddress = String(quoteBody.email_address || "")
      .trim()
      .toLowerCase();
    const serviceType = String(quoteBody.service_type || "").trim();
    const description = String(quoteBody.description || "").trim();

    if (!fullName || !phoneNumber || !emailAddress || !description) {
      return Response.json(
        { error: "Missing required Request Quote fields." },
        { status: 400 }
      );
    }

    await sql`
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
    `;

    return Response.json({
      success: true,
      message: "Request Quote submitted successfully.",
    });
  } catch (error) {
    console.error("landing-page-form API error:", error);
    return Response.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}