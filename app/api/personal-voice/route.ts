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

    const personalVoice = await prisma.personalVoice.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(personalVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch personal voice" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const personalVoice = await prisma.personalVoice.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        ...data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(personalVoice);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save personal voice" }, { status: 500 });
  }
}
