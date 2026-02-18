import { neon } from "@neondatabase/serverless";

export default async function handler(req: any, res: any) {
  // CORS (não atrapalha mesmo-origin e evita OPTIONS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const env = process.env.VERCEL_ENV ?? "unknown";
    const hasDbUrl = !!process.env.DATABASE_URL;

    // ✅ DEBUG: abra /api/landing-page-form?debug=1 no browser
    if (req.method === "GET" && req.query?.debug === "1") {
      if (!hasDbUrl) {
        return res.status(200).json({
          ok: false,
          env,
          hasDatabaseUrl: false,
          error: "DATABASE_URL is missing in Vercel environment variables",
        });
      }

      const sql = neon(process.env.DATABASE_URL!);

      const t = await sql`SELECT to_regclass('public.landing_page_uploads') AS table_name`;
      const table = t?.[0]?.table_name ?? null;

      let totalRows: number | null = null;
      if (table) {
        const c = await sql`SELECT COUNT(*)::int AS total FROM landing_page_uploads`;
        totalRows = c?.[0]?.total ?? null;
      }

      return res.status(200).json({
        ok: true,
        env,
        hasDatabaseUrl: true,
        table,
        totalRows,
        contentType: req.headers["content-type"] ?? null,
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!hasDbUrl) {
      return res.status(500).json({
        error: "DATABASE_URL is missing in Vercel environment variables",
      });
    }

    // ✅ Body robusto (pode vir string)
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});

    const { full_name, phone_number, email_address, service_type, description } = body;

    if (!full_name || !email_address) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // (Opcional) garante que a tabela existe e retorna erro mais claro
    const t = await sql`SELECT to_regclass('public.landing_page_uploads') AS table_name`;
    if (!t?.[0]?.table_name) {
      return res.status(500).json({
        error:
          "Table landing_page_uploads does not exist in this database/branch. Create it in Neon (same env/branch).",
      });
    }

    await sql`
      INSERT INTO landing_page_uploads
        (full_name, phone_number, email_address, service_type, description)
      VALUES
        (${full_name}, ${phone_number || null}, ${email_address}, ${service_type || null}, ${description || null})
    `;

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("FUNCTION ERROR:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      details: err?.message ?? String(err),
    });
  }
}
