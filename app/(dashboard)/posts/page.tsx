"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon, Table as TableIcon, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string | null;
  topic: string | null;
  content: string;
  status: string;
  length: string | null;
  style: string | null;
  publishDate: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function PostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
        alert("Post deleted successfully");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  const isBrandOwner = session?.user.role === "BRAND_OWNER";

  // Group posts by date for calendar view
  const postsByDate = posts.reduce((acc, post) => {
    const date = post.publishDate
      ? format(new Date(post.publishDate), "yyyy-MM-dd")
      : format(new Date(post.createdAt), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-200 text-gray-800";
      case "SCHEDULED":
        return "bg-blue-200 text-blue-800";
      case "PUBLISHED":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isBrandOwner ? "All Posts" : "My Posts"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isBrandOwner
              ? "View and manage all team posts"
              : "View and manage your posts"}
          </p>
        </div>
        <Link href="/posts/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="table">
            <TableIcon className="mr-2 h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Link href="/posts/create">
                  <Button>Create your first post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-lg border">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Topic
                    </th>
                    {isBrandOwner && (
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Author
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {post.title || "Untitled"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {post.topic || "-"}
                      </td>
                      {isBrandOwner && (
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {post.user.name || post.user.email}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/posts/${post.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          {Object.keys(postsByDate).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Link href="/posts/create">
                  <Button>Create your first post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {Object.entries(postsByDate)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, datePosts]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {format(new Date(date), "EEEE, MMMM d, yyyy")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {datePosts.map((post) => (
                          <div
                            key={post.id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-medium">
                                  {post.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {post.topic}
                                </p>
                                {isBrandOwner && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    By: {post.user.name || post.user.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                                  {post.status}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/posts/${post.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
