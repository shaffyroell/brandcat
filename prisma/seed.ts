import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Brand
  const brand = await prisma.brand.upsert({
    where: { id: 'demo-brand-id' },
    update: {},
    create: {
      id: 'demo-brand-id',
      name: 'Acme Design Co.',
    },
  });

  console.log('✅ Created brand:', brand.name);

  // Create Brand Voice
  const brandVoice = await prisma.brandVoice.upsert({
    where: { brandId: brand.id },
    update: {},
    create: {
      brandId: brand.id,
      tone: ['Professional', 'Friendly', 'Empathetic'],
      humor: 'subtle',
      formality: 'conversational',
      vocabulary: 'moderate',
      doWords: ['innovative', 'creative', 'transform', 'elevate', 'partner'],
      dontWords: ['cheap', 'basic', 'simple', 'just', 'obviously'],
      targetAudience: 'Creative professionals and design-forward businesses seeking premium branding solutions',
      brandValues: ['Innovation', 'Quality', 'Authenticity', 'Sustainability'],
      keyMessages: [
        'Design that tells your story',
        'Elevating brands through thoughtful creativity',
        'Your vision, our expertise'
      ],
      examplePosts: [],
    },
  });

  console.log('✅ Created brand voice');

  // Create Users
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'demo@brandcat.app' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@brandcat.app',
      name: 'Demo User',
      password: hashedPassword,
      role: 'BRAND_OWNER',
      brandId: brand.id,
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@acme.com' },
    update: {},
    create: {
      email: 'sarah@acme.com',
      name: 'Sarah Chen',
      password: hashedPassword,
      role: 'USER',
      brandId: brand.id,
    },
  });

  const marcus = await prisma.user.upsert({
    where: { email: 'marcus@acme.com' },
    update: {},
    create: {
      email: 'marcus@acme.com',
      name: 'Marcus Johnson',
      password: hashedPassword,
      role: 'USER',
      brandId: brand.id,
    },
  });

  console.log('✅ Created 3 users');

  // Create Personal Voices
  await prisma.personalVoice.upsert({
    where: { userId: sarah.id },
    update: {},
    create: {
      userId: sarah.id,
      expertise: ['Brand Strategy', 'Content Marketing', 'Social Media'],
      interests: ['Design Trends', 'Storytelling', 'Digital Innovation'],
      writingStyle: 'storytelling',
      preferredTopics: ['Brand Identity', 'Creative Process', 'Industry Insights'],
      tone: ['Friendly', 'Creative', 'Empathetic'],
      perspective: 'first-person',
      bio: 'Brand strategist passionate about helping businesses find their authentic voice.',
      jobTitle: 'Senior Brand Strategist',
    },
  });

  await prisma.personalVoice.upsert({
    where: { userId: marcus.id },
    update: {},
    create: {
      userId: marcus.id,
      expertise: ['Design Systems', 'UX Writing', 'Visual Communication'],
      interests: ['Minimalism', 'Typography', 'User Experience'],
      writingStyle: 'concise',
      preferredTopics: ['Design Philosophy', 'User Experience', 'Innovation'],
      tone: ['Professional', 'Direct', 'Analytical'],
      perspective: 'third-person',
      bio: 'Design director with a focus on creating cohesive brand experiences.',
      jobTitle: 'Creative Director',
    },
  });

  console.log('✅ Created personal voices');

  // Create Inspiration Articles
  const inspirationArticles = [
    {
      brandId: brand.id,
      title: 'The Rise of Minimalist Design in 2026',
      description: 'How leading brands are embracing simplicity and white space to create powerful visual identities.',
      url: 'https://example.com/minimalist-design',
      source: 'Design Weekly',
      relevanceScore: 9,
      publishedDate: new Date('2026-01-02'),
    },
    {
      brandId: brand.id,
      title: 'Building Brand Trust Through Authentic Storytelling',
      description: 'A deep dive into how authentic narratives are shaping consumer connections in the digital age.',
      url: 'https://example.com/authentic-storytelling',
      source: 'Marketing Today',
      relevanceScore: 10,
      publishedDate: new Date('2026-01-04'),
    },
    {
      brandId: brand.id,
      title: 'Color Psychology: What Your Palette Says About Your Brand',
      description: 'Understanding the emotional impact of color choices in brand identity and consumer perception.',
      url: 'https://example.com/color-psychology',
      source: 'Brand Insights',
      relevanceScore: 8,
      publishedDate: new Date('2026-01-03'),
    },
    {
      brandId: brand.id,
      title: 'The Future of AI in Creative Design',
      description: 'How artificial intelligence is augmenting human creativity and transforming the design process.',
      url: 'https://example.com/ai-creative',
      source: 'Tech Trends',
      relevanceScore: 7,
      publishedDate: new Date('2026-01-01'),
    },
    {
      brandId: brand.id,
      title: 'Sustainable Branding: More Than Just a Trend',
      description: 'Why environmental consciousness is becoming a core component of successful brand strategies.',
      url: 'https://example.com/sustainable-branding',
      source: 'Eco Business',
      relevanceScore: 9,
      publishedDate: new Date('2026-01-05'),
    },
  ];

  for (const article of inspirationArticles) {
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

  console.log('✅ Created 5 inspiration articles');

  // Create Posts
  const posts = [
    {
      userId: sarah.id,
      brandId: brand.id,
      title: 'Why Your Brand Story Matters More Than Ever',
      topic: 'Brand Storytelling',
      content: `In today's crowded marketplace, your brand story isn't just a nice-to-have—it's essential.

At Acme Design Co., we believe that every brand has a unique narrative waiting to be told. Your story is what sets you apart, creates emotional connections, and builds lasting relationships with your audience.

But here's the thing: authenticity is key. Your audience can spot inauthenticity from a mile away. That's why we work closely with our partners to uncover their true essence and craft narratives that resonate.

Ready to elevate your brand story? Let's create something remarkable together.`,
      length: 'medium',
      style: 'storytelling',
      status: 'PUBLISHED',
      publishDate: new Date('2026-01-04'),
      publishedAt: new Date('2026-01-04'),
    },
    {
      userId: marcus.id,
      brandId: brand.id,
      title: 'The Power of Minimalist Design',
      topic: 'Design Philosophy',
      content: `Less is more. This timeless principle has never been more relevant than in today's design landscape.

Minimalist design isn't about removing features—it's about removing distractions. It's about creating clarity, focus, and impact.

At Acme Design Co., we've seen how stripping away the unnecessary can reveal the essential. White space becomes a design element. Typography becomes art. Every element serves a purpose.

The result? Brands that communicate clearly, resonate deeply, and stand the test of time.`,
      length: 'short',
      style: 'professional',
      status: 'PUBLISHED',
      publishDate: new Date('2026-01-03'),
      publishedAt: new Date('2026-01-03'),
    },
    {
      userId: sarah.id,
      brandId: brand.id,
      title: 'Building Emotional Connections Through Color',
      topic: 'Color Psychology',
      content: `Color is emotion. Color is memory. Color is brand.

The palette you choose for your brand isn't just about aesthetics—it's about psychology. Each hue triggers specific emotional responses and associations in your audience's mind.

Blue evokes trust and stability. Red ignites passion and energy. Green suggests growth and harmony.

At Acme Design Co., we don't just pick colors that look good together. We select palettes that tell your story, reflect your values, and connect with your audience on a deeper level.

What emotions does your brand want to evoke? Let's explore that together.`,
      length: 'medium',
      style: 'educational',
      status: 'SCHEDULED',
      publishDate: new Date('2026-01-08'),
    },
    {
      userId: marcus.id,
      brandId: brand.id,
      title: 'Crafting Cohesive Brand Experiences',
      topic: 'Brand Consistency',
      content: `Your brand touchpoints should feel like chapters of the same story.

From your website to your social media, from your packaging to your customer service—every interaction is an opportunity to reinforce your brand identity.

Consistency builds recognition. Recognition builds trust. Trust builds loyalty.

Draft notes: Need to expand on practical implementation strategies and include case study examples.`,
      length: 'short',
      style: 'professional',
      status: 'DRAFT',
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('✅ Created 4 posts');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
