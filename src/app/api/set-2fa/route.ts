import { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/FireBase/FireBaseConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { uid, is2FAEnabled } = req.body;

  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { is2FAEnabled });

    return res.status(200).json({ message: "2FA enabled successfully." });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return res.status(500).json({ message: "Failed to enable 2FA" });
  }
}
