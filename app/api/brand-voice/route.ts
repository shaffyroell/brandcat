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

    const brandVoice = await prisma.brandVoice.findUnique({
      where: { brandId: user.brandId! },
    });

    return NextResponse.json(brandVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brand voice" }, { status: 500 });
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

    const brandVoice = await prisma.brandVoice.upsert({
      where: { brandId: user.brandId! },
      update: data,
      create: {
        ...data,
        brandId: user.brandId!,
      },
    });

    return NextResponse.json(brandVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save brand voice" }, { status: 500 });
  }
}
