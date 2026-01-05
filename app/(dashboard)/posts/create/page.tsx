"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inspirationId = searchParams.get('inspiration');

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    contextUrl: "",
    length: "medium",
    style: "professional",
    content: "",
    title: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleGenerate = async () => {
    if (!formData.topic) {
      alert("Please enter a topic");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formData.topic,
          contextUrl: formData.contextUrl,
          length: formData.length,
          style: formData.style,
          inspirationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          content: data.content,
          title: data.title || prev.title,
        }));
      } else {
        alert("Failed to generate content");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inspirationId,
        }),
      });

      if (response.ok) {
        alert("Post saved successfully!");
        router.push("/posts");
      } else {
        alert("Failed to save post");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/posts" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Link>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Tell us what you want to write about, and we'll help you create content aligned with your brand
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
            <CardDescription>
              What would you like to write about?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., Benefits of remote work, Product launch announcement..."
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Describe what you want to write about
              </p>
            </div>

            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="contextUrl">Context URL (Optional)</Label>
              <Input
                id="contextUrl"
                type="url"
                placeholder="https://example.com/article..."
                value={formData.contextUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, contextUrl: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Add a link to another post or article for context
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Writing Style</CardTitle>
            <CardDescription>
              Customize the length and style of your post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="length">Length</Label>
                <Select value={formData.length} onValueChange={(val) => setFormData(prev => ({ ...prev, length: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (100-200 words)</SelectItem>
                    <SelectItem value="medium">Medium (300-500 words)</SelectItem>
                    <SelectItem value="long">Long (600-1000 words)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="style">Style</Label>
                <Select value={formData.style} onValueChange={(val) => setFormData(prev => ({ ...prev, style: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !formData.topic}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Review and edit the generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Generated content will appear here, or you can write your own..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={15}
              className="font-mono"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/posts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !formData.content}>
            {loading ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
