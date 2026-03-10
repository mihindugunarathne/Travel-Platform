# Travel Explorer

Discover and share unique travel experiences around the world.

## Project Structure

```
travel-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Login, register
│   │   ├── listings/      # CRUD, like, upload
│   │   └── upload/        # Image upload
│   ├── create/            # Create listing page
│   ├── edit/[id]/         # Edit listing page
│   ├── listing/[id]/      # Listing detail page
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── icon.svg           # Favicon
│   └── layout.js
├── components/
│   └── Navbar.js
├── lib/
│   ├── mongodb.js         # DB connection
│   └── time.js            # timeAgo helper
├── models/
│   ├── Listing.js
│   └── User.js
├── public/
│   └── uploads/           # User-uploaded images (gitignored)
├── scripts/
│   └── seed.js            # Seed database
└── package.json
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Seed the database (with dev server running):

   ```bash
   npm run seed
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run seed` — Add sample listings to database
