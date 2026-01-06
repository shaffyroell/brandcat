import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Demo mode: use hardcoded demo user if no session
    const user = session?.user || {
      id: "demo-user-id",
      email: "demo@brandcat.app",
      role: "BRAND_OWNER",
      brandId: "demo-brand-id",
    };

    const personalVoice = await prisma.personalVoice.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json(personalVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch personal voice" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Demo mode: use hardcoded demo user if no session
    const user = session?.user || {
      id: "demo-user-id",
      email: "demo@brandcat.app",
      role: "BRAND_OWNER",
      brandId: "demo-brand-id",
    };

    const data = await req.json();

    const personalVoice = await prisma.personalVoice.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        ...data,
        userId: user.id,
      },
    });

    return NextResponse.json(personalVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save personal voice" }, { status: 500 });
  }
}
