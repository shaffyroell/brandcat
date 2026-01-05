import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.brandId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real application, you would store RSS feed URLs in the database
    // For now, we'll use a sample Google News RSS feed
    const sampleUrl = "https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en";

    try {
      const feed = await parser.parseURL(sampleUrl);

      // Process feed items
      const articles = feed.items.slice(0, 10).map((item) => {
        // Calculate a simple relevance score (in production, use AI/ML)
        const score = Math.floor(Math.random() * 6) + 5; // Random score between 5-10

        return {
          brandId: session.user.brandId!,
          title: item.title || "Untitled",
          description: item.contentSnippet || item.content?.substring(0, 200) || null,
          url: item.link || "",
          source: feed.title || "RSS Feed",
          relevanceScore: score,
          publishedDate: item.pubDate ? new Date(item.pubDate) : null,
          imageUrl: null,
        };
      });

      // Insert articles (skip duplicates)
      for (const article of articles) {
        await prisma.inspiration.upsert({
          where: {
            brandId_url: {
              brandId: article.brandId,
              url: article.url,
            },
          },
          update: {},
          create: article,
        });
      }

      return NextResponse.json({ success: true, count: articles.length });
    } catch (feedError) {
      console.error("RSS parsing error:", feedError);
      return NextResponse.json({ error: "Failed to parse RSS feed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json({ error: "Failed to refresh inspiration" }, { status: 500 });
  }
}
