# How to Disable Demo Mode

Once your database is connected, you can switch from demo mode to real authentication:

## Steps:

1. Open `components/providers/session-provider.tsx`

2. Change line 22:
   ```typescript
   const DEMO_MODE = false;  // Change from true to false
   ```

3. Commit and deploy:
   ```bash
   git add components/providers/session-provider.tsx
   git commit -m "Disable demo mode - use real authentication"
   git push
   ```

## After Disabling Demo Mode:

- Users must log in with real credentials
- First user to sign up becomes Brand Owner automatically
- All API calls will work with the database
- You can add team members through the Users page

## Seed the Database (Recommended):

To populate with the dummy data (Acme Design Co., posts, users, etc.):

```bash
npx prisma db seed
```

This creates:
- Acme Design Co. brand with complete brand voice
- 3 users (passwords: "demo123")
  - demo@brandcat.app (Brand Owner)
  - sarah@acme.com (User)
  - marcus@acme.com (User)
- 4 sample posts
- 5 inspiration articles
- Personal voice profiles

## To Keep Demo Mode:

If you want to keep demo mode enabled but still use the database:
- API calls will fail gracefully
- UI will still be fully explorable
- You can manually populate data through the UI
