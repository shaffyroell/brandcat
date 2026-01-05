import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.brandId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.inspiration.findMany({
      where: { brandId: session.user.brandId },
      orderBy: {
        relevanceScore: "desc",
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inspiration" }, { status: 500 });
  }
}
