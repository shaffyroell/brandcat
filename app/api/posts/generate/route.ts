import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, contextUrl, length, style, inspirationId } = await req.json();

    // Fetch brand voice
    const brandVoice = session.user.brandId
      ? await prisma.brandVoice.findUnique({
          where: { brandId: session.user.brandId },
        })
      : null;

    // Fetch personal voice
    const personalVoice = await prisma.personalVoice.findUnique({
      where: { userId: session.user.id },
    });

    // Fetch inspiration article if provided
    let inspirationArticle = null;
    if (inspirationId) {
      inspirationArticle = await prisma.inspiration.findUnique({
        where: { id: inspirationId },
      });
    }

    // Generate content based on the parameters
    // In a real application, you would call an AI service here (OpenAI, Claude, etc.)
    // For now, we'll create a template-based response

    const wordCount = length === "short" ? 150 : length === "medium" ? 400 : 800;

    let content = `# ${topic}\n\n`;

    if (inspirationArticle) {
      content += `Inspired by: ${inspirationArticle.title}\n\n`;
    }

    content += `This is a ${style} post about ${topic}.\n\n`;

    if (brandVoice) {
      content += `Written with a ${brandVoice.tone.join(", ")} tone, `;
      content += `${brandVoice.formality} formality level, `;
      content += `and ${brandVoice.humor || "no"} humor.\n\n`;
    }

    if (personalVoice) {
      content += `Author expertise: ${personalVoice.expertise.join(", ")}\n`;
      content += `Writing style: ${personalVoice.writingStyle || "standard"}\n\n`;
    }

    content += `[This is a placeholder for AI-generated content. In a production environment, this would be replaced with actual AI-generated content based on the brand voice, personal voice, and topic provided.]\n\n`;

    content += `Target length: approximately ${wordCount} words.\n\n`;

    if (contextUrl) {
      content += `Reference: ${contextUrl}\n`;
    }

    // Generate a title
    const title = `${topic.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;

    return NextResponse.json({
      content,
      title,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
