"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lightbulb, Users, Settings, Plus } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const isBrandOwner = session.user.role === "BRAND_OWNER";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name || session.user.email}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isBrandOwner
            ? "Manage your brand and oversee content creation."
            : "Create content aligned with your brand voice."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create Post
            </CardTitle>
            <CardDescription>
              Write new content within brand guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/posts/create">
              <Button className="w-full">Start Writing</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Your Posts
            </CardTitle>
            <CardDescription>
              View and manage your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/posts">
              <Button variant="outline" className="w-full">View Posts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Inspiration
            </CardTitle>
            <CardDescription>
              Get ideas from trending topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/inspiration">
              <Button variant="outline" className="w-full">Browse Ideas</Button>
            </Link>
          </CardContent>
        </Card>

        {isBrandOwner && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Team Management
                </CardTitle>
                <CardDescription>
                  Add and manage team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/users">
                  <Button variant="outline" className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Brand Voice
                </CardTitle>
                <CardDescription>
                  Configure your brand guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/brand-voice">
                  <Button variant="outline" className="w-full">Edit Brand Voice</Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}

        {!isBrandOwner && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Personal Voice
              </CardTitle>
              <CardDescription>
                Customize your writing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
