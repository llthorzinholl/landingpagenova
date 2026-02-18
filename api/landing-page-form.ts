import { neon } from "@neondatabase/serverless";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = neon(process.env.DATABASE_URL!);

    const { full_name, phone_number, email_address, service_type, description } = req.body;

    if (!full_name || !email_address) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    await sql`
      INSERT INTO landing_page_uploads
      (full_name, phone_number, email_address, service_type, description)
      VALUES
      (${full_name}, ${phone_number}, ${email_address}, ${service_type}, ${description})
    `;

    return res.status(200).json({ success: true });

  } catch (err: any) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
