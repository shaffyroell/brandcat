import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Parser from "rss-parser";

const parser = new Parser();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "BRAND_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      // Parse the RSS feed
      const feed = await parser.parseURL(url);

      // Process feed items
      const articles = feed.items.slice(0, 20).map((item) => {
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
      let addedCount = 0;
      for (const article of articles) {
        try {
          await prisma.inspiration.create({
            data: article,
          });
          addedCount++;
        } catch (e) {
          // Skip duplicates
          continue;
        }
      }

      return NextResponse.json({ success: true, count: addedCount });
    } catch (feedError) {
      console.error("RSS parsing error:", feedError);
      return NextResponse.json({ error: "Failed to parse RSS feed. Please check the URL." }, { status: 400 });
    }
  } catch (error) {
    console.error("Add feed error:", error);
    return NextResponse.json({ error: "Failed to add RSS feed" }, { status: 500 });
  }
}
