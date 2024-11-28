import { NextApiRequest, NextApiResponse } from "next";
import speakeasy from "speakeasy";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { uid } = req.body;

  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `MyApp (${uid})`,
      algorithm: "sha256",
    });

    return res.status(200).json({ secret: secret.base32, otpauthUrl });
  } catch (error) {
    console.error("Error generating 2FA secret:", error);
    return res.status(500).json({ message: "Failed to generate 2FA secret" });
  }
}
