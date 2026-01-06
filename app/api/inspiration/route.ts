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

    const articles = await prisma.inspiration.findMany({
      where: { brandId: user.brandId! },
      orderBy: {
        relevanceScore: "desc",
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inspiration" }, { status: 500 });
  }
}
