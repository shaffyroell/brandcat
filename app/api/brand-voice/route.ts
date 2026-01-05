import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandVoice = await prisma.brandVoice.findUnique({
      where: { brandId: session.user.brandId! },
    });

    return NextResponse.json(brandVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brand voice" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "BRAND_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const brandVoice = await prisma.brandVoice.upsert({
      where: { brandId: session.user.brandId! },
      update: data,
      create: {
        ...data,
        brandId: session.user.brandId!,
      },
    });

    return NextResponse.json(brandVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save brand voice" }, { status: 500 });
  }
}
