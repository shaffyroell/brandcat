"use client";

import { useState, useEffect } from "react";
import { useMockSession } from "@/components/providers/session-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface PersonalVoiceData {
  expertise: string[];
  interests: string[];
  writingStyle: string;
  preferredTopics: string[];
  tone: string[];
  perspective: string;
  bio: string;
  jobTitle: string;
}

export default function ProfilePage() {
  const session = useMockSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const [formData, setFormData] = useState<PersonalVoiceData>({
    expertise: [],
    interests: [],
    writingStyle: "",
    preferredTopics: [],
    tone: [],
    perspective: "",
    bio: "",
    jobTitle: "",
  });

  useEffect(() => {
  }, [status, router]);

  const handleToneToggle = (tone: string) => {
    setFormData(prev => ({
      ...prev,
      tone: prev.tone.includes(tone)
        ? prev.tone.filter(t => t !== tone)
        : [...prev.tone, tone]
    }));
  };

  const addToList = (field: keyof PersonalVoiceData, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter("");
    }
  };

  const removeFromList = (field: keyof PersonalVoiceData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/personal-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile saved successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };


  const toneOptions = ["Professional", "Friendly", "Analytical", "Creative", "Direct", "Empathetic"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Personal Voice Profile</h1>
        <p className="text-muted-foreground mt-2">
          Customize your writing preferences and expertise
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
            <CardDescription>
              Tell us about your professional background
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Marketing Manager"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label>Areas of Expertise</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add an area of expertise..."
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('expertise', newExpertise, setNewExpertise))}
                />
                <Button type="button" onClick={() => addToList('expertise', newExpertise, setNewExpertise)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.expertise.map((item, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeFromList('expertise', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Writing Preferences</CardTitle>
            <CardDescription>
              Define your personal writing style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Personal Tone (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {toneOptions.map((tone) => (
                  <Button
                    key={tone}
                    type="button"
                    variant={formData.tone.includes(tone) ? "default" : "outline"}
                    onClick={() => handleToneToggle(tone)}
                  >
                    {tone}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="writingStyle">Writing Style</Label>
              <Select value={formData.writingStyle} onValueChange={(val) => setFormData(prev => ({ ...prev, writingStyle: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="descriptive">Descriptive - Rich details and imagery</SelectItem>
                  <SelectItem value="concise">Concise - Short and to the point</SelectItem>
                  <SelectItem value="storytelling">Storytelling - Narrative approach</SelectItem>
                  <SelectItem value="analytical">Analytical - Data-driven and logical</SelectItem>
                  <SelectItem value="conversational">Conversational - Dialogue-like</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="perspective">Perspective</Label>
              <Select value={formData.perspective} onValueChange={(val) => setFormData(prev => ({ ...prev, perspective: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred perspective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-person">First Person (I, we)</SelectItem>
                  <SelectItem value="second-person">Second Person (you)</SelectItem>
                  <SelectItem value="third-person">Third Person (they, it)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests & Topics</CardTitle>
            <CardDescription>
              What do you like to write about?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Interests</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add an interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('interests', newInterest, setNewInterest))}
                />
                <Button type="button" onClick={() => addToList('interests', newInterest, setNewInterest)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.interests.map((item, index) => (
                  <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeFromList('interests', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Preferred Topics</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a topic..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('preferredTopics', newTopic, setNewTopic))}
                />
                <Button type="button" onClick={() => addToList('preferredTopics', newTopic, setNewTopic)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.preferredTopics.map((item, index) => (
                  <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeFromList('preferredTopics', index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
