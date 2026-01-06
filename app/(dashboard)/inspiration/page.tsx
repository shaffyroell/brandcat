"use client";

import { useState, useEffect } from "react";
import { useMockSession } from "@/components/providers/session-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Plus, RefreshCw, Star } from "lucide-react";
import { format } from "date-fns";

interface InspirationArticle {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source: string | null;
  relevanceScore: number;
  publishedDate: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function InspirationPage() {
  const session = useMockSession();
  const router = useRouter();
  const [articles, setArticles] = useState<InspirationArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rssUrl, setRssUrl] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/inspiration");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/inspiration/refresh", {
        method: "POST",
      });
      if (response.ok) {
        await fetchArticles();
        alert("Articles refreshed successfully!");
      } else {
        alert("Failed to refresh articles");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddRss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rssUrl) return;

    try {
      const response = await fetch("/api/inspiration/add-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rssUrl }),
      });

      if (response.ok) {
        setRssUrl("");
        await fetchArticles();
        alert("RSS feed added successfully!");
      } else {
        alert("Failed to add RSS feed");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const isBrandOwner = session?.user.role === "BRAND_OWNER";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inspiration Feed</h1>
          <p className="text-muted-foreground mt-2">
            Discover trending topics and create content from relevant articles
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isBrandOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Add RSS Feed</CardTitle>
            <CardDescription>
              Add a Google News RSS feed or any other RSS feed related to your industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRss} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://news.google.com/rss/search?q=..."
                value={rssUrl}
                onChange={(e) => setRssUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Feed
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-2">
              Example: https://news.google.com/rss/search?q=your+industry
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No articles yet. {isBrandOwner ? "Add an RSS feed to get started." : "Ask your brand owner to add RSS feeds."}
              </p>
            </CardContent>
          </Card>
        ) : (
          articles
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .map((article) => (
              <Card key={article.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {article.imageUrl && (
                      <div className="flex-shrink-0 w-32 h-32 relative">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {article.title}
                          </h3>
                          {article.description && (
                            <p className="text-muted-foreground text-sm mb-3">
                              {article.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {article.source && (
                              <span>{article.source}</span>
                            )}
                            {article.publishedDate && (
                              <span>
                                {format(new Date(article.publishedDate), "MMM d, yyyy")}
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className={`h-4 w-4 ${getRelevanceColor(article.relevanceScore)}`} />
                              <span className={getRelevanceColor(article.relevanceScore)}>
                                {article.relevanceScore}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/posts/create?inspiration=${article.id}`}>
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Post
                          </Button>
                        </Link>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Read Article
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
