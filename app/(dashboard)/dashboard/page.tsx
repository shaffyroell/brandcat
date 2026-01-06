"use client";

import { useMockSession } from "@/components/providers/session-provider";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lightbulb, Users, Settings, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const session = useMockSession();
  const isBrandOwner = session.user.role === "BRAND_OWNER";

  return (
    <div className="space-y-12">
      {/* Hero Section - Apple-inspired */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-16 md:px-16 md:py-24">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Welcome to BrandCat</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
            Create content that
            <br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              resonates with your brand
            </span>
          </h1>
          <p className="mb-8 text-lg text-blue-100 md:text-xl">
            Manage your brand voice, inspire your team, and create compelling content—all in one beautifully designed platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/posts/create">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Create Your First Post
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/inspiration">
              <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                Get Inspired
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-green-900">4 Posts</CardTitle>
            <CardDescription className="text-green-700">2 published this week</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-blue-900">5 Ideas</CardTitle>
            <CardDescription className="text-blue-700">Trending in your feed</CardDescription>
          </CardHeader>
        </Card>
        {isBrandOwner && (
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-purple-900">3 Team Members</CardTitle>
              <CardDescription className="text-purple-700">Collaborating on content</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Main Actions */}
      <div>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">What would you like to do?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/posts/create" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Plus className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-blue-600 transition-colors">Create Post</CardTitle>
                <CardDescription>
                  Write new content within brand guidelines
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/posts" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-purple-600 transition-colors">Your Posts</CardTitle>
                <CardDescription>
                  View and manage your content
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/inspiration" className="group">
            <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle className="group-hover:text-amber-600 transition-colors">Inspiration</CardTitle>
                <CardDescription>
                  Get ideas from trending topics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {isBrandOwner && (
            <>
              <Link href="/users" className="group">
                <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle className="group-hover:text-green-600 transition-colors">Team Management</CardTitle>
                    <CardDescription>
                      Add and manage team members
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/brand-voice" className="group">
                <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                      <Settings className="h-6 w-6" />
                    </div>
                    <CardTitle className="group-hover:text-pink-600 transition-colors">Brand Voice</CardTitle>
                    <CardDescription>
                      Configure your brand guidelines
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {!isBrandOwner && (
            <Link href="/profile" className="group">
              <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <Settings className="h-6 w-6" />
                  </div>
                  <CardTitle className="group-hover:text-indigo-600 transition-colors">Personal Voice</CardTitle>
                  <CardDescription>
                    Customize your writing preferences
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          <Link href="/posts">
            <Button variant="ghost" className="text-blue-600">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  SC
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sarah Chen published a new post</p>
                  <p className="text-sm text-muted-foreground">&quot;Why Your Brand Story Matters More Than Ever&quot;</p>
                  <p className="mt-1 text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div className="flex-1">
                  <p className="font-medium">Marcus Johnson published a new post</p>
                  <p className="text-sm text-muted-foreground">&quot;The Power of Minimalist Design&quot;</p>
                  <p className="mt-1 text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
