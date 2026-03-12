import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const config = {
  api: {
    bodyParser: true,
  },
};

type UploadPayload = {
  full_name?: string;
  email_address?: string;
  phone_number?: string;
  material_location?: string;
  terms_accepted?: boolean | string;
  form_type?: string;
  name?: string;
  email?: string;
};

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const parsed: UploadPayload = clientPayload
          ? JSON.parse(clientPayload)
          : {};

        const fullName = (parsed.full_name || parsed.name || "").trim();
        const emailAddress = (
          parsed.email_address ||
          parsed.email ||
          ""
        ).trim().toLowerCase();
        const phoneNumber = (parsed.phone_number || "").trim();
        const materialLocation = (parsed.material_location || "").trim();
        const termsAccepted =
          parsed.terms_accepted === true ||
          String(parsed.terms_accepted).toLowerCase() === "true";

        if (!fullName || !emailAddress) {
          throw new Error("Name and email are required");
        }

        if (!phoneNumber || !materialLocation) {
          throw new Error("Phone and material location are required");
        }

        if (!termsAccepted) {
          throw new Error("Terms must be accepted");
        }

        return {
          allowedContentTypes: ["image/jpeg", "image/png"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            full_name: fullName,
            email_address: emailAddress,
            phone_number: phoneNumber,
            material_location: materialLocation,
            terms_accepted: termsAccepted,
            form_type: parsed.form_type || "visual_pre_assessment",
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const parsed = JSON.parse(tokenPayload || "{}");

          console.log("photo check upload completed", {
            url: blob.url,
            pathname: blob.pathname,
            full_name: parsed.full_name,
            email_address: parsed.email_address,
          });
        } catch (error) {
          console.error("photo check upload completion parse error:", error);
          throw new Error("Could not process uploaded file");
        }
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}