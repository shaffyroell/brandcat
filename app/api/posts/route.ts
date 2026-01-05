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

    const isBrandOwner = session.user.role === "BRAND_OWNER";

    const posts = await prisma.post.findMany({
      where: isBrandOwner
        ? { brandId: session.user.brandId }
        : { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        brandId: session.user.brandId,
        title: data.title,
        topic: data.topic,
        content: data.content,
        length: data.length,
        style: data.style,
        contextUrl: data.contextUrl,
        inspirationId: data.inspirationId,
        status: "DRAFT",
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
