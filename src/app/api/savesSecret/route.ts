// /app/api/saveSecret/route.ts
import { db } from "@/FireBase/FireBaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

interface SaveSecretRequest {
  userId: string;
  secret: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body: SaveSecretRequest = await req.json();

  if (!body.userId || !body.secret) {
    return NextResponse.json({ error: "userId and secret are required" }, { status: 400 });
  }

  try {
    await setDoc(doc(db, "users", body.userId), { totpSecret: body.secret }, { merge: true });
    return NextResponse.json({ message: "Secret saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, {
      status: 500,
    });
  }
}
