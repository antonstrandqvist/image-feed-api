## Image Feed API (Next.js App Router + Supabase)

### Env Vars
Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# For local seeding and server actions you can also provide service role (optional)
SUPABASE_SERVICE_ROLE_KEY=your-service-role
```

### Database Schema (Supabase SQL)

```
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.images(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.images(id) on delete cascade,
  commenter_name text not null,
  comment text not null,
  created_at timestamp with time zone default now()
);
```

### Seed
- POST `/api/seed` once to insert up to 200 images (uses Picsum).

### CORS
All API endpoints have CORS enabled with `Access-Control-Allow-Origin: *`, allowing requests from any origin.

### Endpoints

#### GET `/api/images?page=1`
Returns paginated list of images with likes and comments.

**Query Parameters:**
- `page` (optional): Page number (default: 1, max: 20)

**Response:**
```json
{
  "page": 1,
  "total_pages": 20,
  "data": [
    {
      "id": "uuid",
      "image_url": "https://your-api.com/api/images/proxy?url=...",
      "likes_count": 5,
      "comments": [
        {
          "commenter_name": "John",
          "comment": "Great photo!"
        }
      ]
    }
  ]
}
```

#### GET `/api/images/[id]`
Returns a specific image with its likes and comments.

**Response:**
```json
{
  "id": "uuid",
  "image_url": "https://your-api.com/api/images/proxy?url=...",
  "likes_count": 5,
  "comments": [
    {
      "commenter_name": "John",
      "comment": "Great photo!"
    }
  ]
}
```

#### POST `/api/images/[id]/like`
Adds a like to an image.

**Response:**
```json
{
  "success": true,
  "likes_count": 6
}
```

#### DELETE `/api/images/[id]/like`
Removes the most recent like from an image.

**Response:**
```json
{
  "success": true,
  "likes_count": 5
}
```

#### POST `/api/images/[id]/comment`
Adds a comment to an image.

**Request Body:**
```json
{
  "commenter_name": "John",
  "comment": "Great photo!"
}
```

**Response:**
```json
{
  "success": true,
  "image_id": "uuid",
  "comment": {
    "commenter_name": "John",
    "comment": "Great photo!"
  }
}
```

#### GET `/api/images/proxy?url=<encoded-url>`
Proxies external images through the API to avoid CORS issues. Used automatically by the main endpoints.

**Query Parameters:**
- `url` (required): Encoded URL of the image to proxy

### Run
```
npm i
npm run dev
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
