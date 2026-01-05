# BrandCat - Brand Management Platform

A comprehensive platform for companies to manage their brand voice centrally and enable individuals to create content within brand guidelines.

## Features

### Brand Management
- **Brand Voice Survey**: Type-form style survey to define brand voice, tone, humor level, vocabulary, and guidelines
- **Document Upload**: Upload brand documents and reference materials
- **Brand Guidelines**: Define words to use/avoid, brand values, and key messages

### Personal Profiles
- **Personal Voice Survey**: Individuals can define their personal writing preferences
- **Expertise & Interests**: Capture areas of expertise and preferred topics
- **Writing Style**: Customize writing style, tone, and perspective preferences

### Content Creation
- **Create Posts**: AI-assisted post creation with topic, context, and style controls
- **Length & Style Options**: Choose between short/medium/long posts and various writing styles
- **Context Integration**: Add URLs for contextual reference
- **Draft Management**: Save drafts and refine content before publishing

### Content Management
- **Posts View**: View all posts in table or calendar format
- **Role-Based Access**: Brand owners see all posts, individuals see only their own
- **Post Scheduling**: Schedule posts for future publication
- **Status Tracking**: Track draft, scheduled, and published posts

### Inspiration Feed
- **RSS Integration**: Pull in articles from Google News RSS feeds
- **Relevance Scoring**: Articles rated 1-10 for relevance to your brand
- **One-Click Post Creation**: Create posts directly from inspiration articles
- **Multiple Sources**: Add multiple RSS feeds for diverse content ideas

### User Management (Brand Owners)
- **Add Team Members**: Create accounts for team members
- **Role Assignment**: Assign brand owner or user roles
- **Team Overview**: View all team members and their activity
- **Access Control**: Manage who can access brand settings

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **RSS Parsing**: rss-parser library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brandcat.git
cd brandcat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string and secrets:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/brandcat?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### First-Time Setup

1. **Create a Brand Owner Account**:
   - Navigate to the login page
   - Enter any email and password (first user will be created automatically)
   - You'll be logged in as a brand owner

2. **Set Up Brand Voice**:
   - Go to "Brand Voice" from the navigation
   - Complete the 3-step survey to define your brand guidelines

3. **Add Team Members**:
   - Go to "Users" from the navigation
   - Add team members with their email and password
   - Assign appropriate roles

4. **Add RSS Feeds**:
   - Go to "Inspiration"
   - Add Google News RSS feeds or other industry-relevant feeds
   - Click "Refresh" to fetch the latest articles

5. **Create Your First Post**:
   - Go to "Posts" > "Create Post"
   - Enter a topic and customize the style
   - Click "Generate Content" to get AI-assisted writing
   - Save as draft or publish

## Project Structure

```
brandcat/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   └── login/
│   ├── (dashboard)/      # Main application pages
│   │   ├── dashboard/
│   │   ├── brand-voice/
│   │   ├── profile/
│   │   ├── posts/
│   │   ├── inspiration/
│   │   └── users/
│   ├── api/              # API routes
│   │   ├── auth/
│   │   ├── brand-voice/
│   │   ├── personal-voice/
│   │   ├── posts/
│   │   ├── inspiration/
│   │   └── users/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # UI components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma    # Database schema
├── types/
│   └── next-auth.d.ts   # TypeScript definitions
└── package.json
```

## Database Schema

### Models

- **Brand**: Company/organization information
- **User**: User accounts with roles
- **BrandVoice**: Brand voice guidelines and preferences
- **PersonalVoice**: Individual writing preferences
- **Post**: Content posts with metadata
- **Inspiration**: RSS feed articles with relevance scores

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out

### Brand Voice
- `GET /api/brand-voice` - Get brand voice settings
- `POST /api/brand-voice` - Create/update brand voice

### Personal Voice
- `GET /api/personal-voice` - Get personal voice settings
- `POST /api/personal-voice` - Create/update personal voice

### Posts
- `GET /api/posts` - Get all posts (filtered by role)
- `POST /api/posts` - Create a new post
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/generate` - Generate post content with AI

### Inspiration
- `GET /api/inspiration` - Get all inspiration articles
- `POST /api/inspiration/refresh` - Refresh RSS feeds
- `POST /api/inspiration/add-feed` - Add new RSS feed

### Users
- `GET /api/users` - Get all users (brand owners only)
- `POST /api/users` - Create new user (brand owners only)
- `DELETE /api/users/[id]` - Delete user (brand owners only)

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

## Future Enhancements

- [ ] AI integration for content generation (OpenAI, Claude, etc.)
- [ ] Social media platform integrations
- [ ] Content calendar with drag-and-drop scheduling
- [ ] Analytics and engagement tracking
- [ ] Multi-brand support
- [ ] Template library
- [ ] Approval workflows
- [ ] Content versioning
- [ ] Export to various formats (PDF, DOCX, etc.)
- [ ] Collaboration features (comments, suggestions)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.
