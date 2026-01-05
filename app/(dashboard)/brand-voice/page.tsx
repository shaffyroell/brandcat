"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X } from "lucide-react";

interface BrandVoiceData {
  tone: string[];
  humor: string;
  formality: string;
  vocabulary: string;
  doWords: string[];
  dontWords: string[];
  targetAudience: string;
  brandValues: string[];
  keyMessages: string[];
}

export default function BrandVoicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newDoWord, setNewDoWord] = useState("");
  const [newDontWord, setNewDontWord] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [formData, setFormData] = useState<BrandVoiceData>({
    tone: [],
    humor: "",
    formality: "",
    vocabulary: "",
    doWords: [],
    dontWords: [],
    targetAudience: "",
    brandValues: [],
    keyMessages: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user.role !== "BRAND_OWNER") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleToneToggle = (tone: string) => {
    setFormData(prev => ({
      ...prev,
      tone: prev.tone.includes(tone)
        ? prev.tone.filter(t => t !== tone)
        : [...prev.tone, tone]
    }));
  };

  const addToList = (field: keyof BrandVoiceData, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter("");
    }
  };

  const removeFromList = (field: keyof BrandVoiceData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/brand-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Brand voice saved successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to save brand voice");
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

  const toneOptions = ["Professional", "Friendly", "Humorous", "Authoritative", "Casual", "Empathetic"];

  const steps = [
    {
      title: "Brand Personality",
      description: "Define how your brand communicates"
    },
    {
      title: "Language Guidelines",
      description: "Set vocabulary and language rules"
    },
    {
      title: "Brand Values",
      description: "Define your core values and messages"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Brand Voice Survey</h1>
        <p className="text-muted-foreground mt-2">
          Define your brand voice to guide content creation
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="mt-2 text-sm">
                <div className="font-medium">{step.title}</div>
                <div className="text-muted-foreground">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 0: Brand Personality */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Brand Personality</CardTitle>
              <CardDescription>
                How would you describe your brand&apos;s communication style?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Brand Tone (Select all that apply)</Label>
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
                <Label htmlFor="humor">Level of Humor</Label>
                <Select value={formData.humor} onValueChange={(val) => setFormData(prev => ({ ...prev, humor: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select humor level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None - Serious and professional</SelectItem>
                    <SelectItem value="subtle">Subtle - Occasional wit</SelectItem>
                    <SelectItem value="playful">Playful - Regular humor</SelectItem>
                    <SelectItem value="comedic">Comedic - Humor-focused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="formality">Formality Level</Label>
                <Select value={formData.formality} onValueChange={(val) => setFormData(prev => ({ ...prev, formality: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select formality level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal - Business professional</SelectItem>
                    <SelectItem value="conversational">Conversational - Friendly but professional</SelectItem>
                    <SelectItem value="casual">Casual - Relaxed and informal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vocabulary">Vocabulary Level</Label>
                <Select value={formData.vocabulary} onValueChange={(val) => setFormData(prev => ({ ...prev, vocabulary: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vocabulary level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple - Easy to understand</SelectItem>
                    <SelectItem value="moderate">Moderate - Balanced</SelectItem>
                    <SelectItem value="advanced">Advanced - Technical/sophisticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Language Guidelines */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Language Guidelines</CardTitle>
              <CardDescription>
                Define words and phrases to use or avoid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  placeholder="Describe your target audience..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Words/Phrases to Use</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a word or phrase..."
                    value={newDoWord}
                    onChange={(e) => setNewDoWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('doWords', newDoWord, setNewDoWord))}
                  />
                  <Button type="button" onClick={() => addToList('doWords', newDoWord, setNewDoWord)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.doWords.map((word, index) => (
                    <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {word}
                      <button type="button" onClick={() => removeFromList('doWords', index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Words/Phrases to Avoid</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a word or phrase..."
                    value={newDontWord}
                    onChange={(e) => setNewDontWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('dontWords', newDontWord, setNewDontWord))}
                  />
                  <Button type="button" onClick={() => addToList('dontWords', newDontWord, setNewDontWord)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.dontWords.map((word, index) => (
                    <div key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {word}
                      <button type="button" onClick={() => removeFromList('dontWords', index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Brand Values */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Brand Values & Messages</CardTitle>
              <CardDescription>
                Define your core values and key messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Brand Values</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a brand value..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('brandValues', newValue, setNewValue))}
                  />
                  <Button type="button" onClick={() => addToList('brandValues', newValue, setNewValue)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.brandValues.map((value, index) => (
                    <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {value}
                      <button type="button" onClick={() => removeFromList('brandValues', index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Key Messages</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a key message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('keyMessages', newMessage, setNewMessage))}
                  />
                  <Button type="button" onClick={() => addToList('keyMessages', newMessage, setNewMessage)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.keyMessages.map((message, index) => (
                    <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                      {message}
                      <button type="button" onClick={() => removeFromList('keyMessages', index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Brand Voice"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
