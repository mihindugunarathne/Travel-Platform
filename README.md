# Travel Explorer

Discover and share unique travel experiences around the world.

---

## Project Overview

Travel Explorer is a simple platform where users can discover and share travel experiences.

Users can create an account, log in, and publish their own travel listings with details like title, location, description, price, and an image. Other users can browse the public feed, view listing details, and like listings they find interesting.

The goal of this project was to build a small full-stack application that demonstrates authentication, CRUD operations, and a public listing feed.

---

## Tech Stack

I chose the following technologies for this project:

**Frontend**

- Next.js (App Router)
- React
- Tailwind CSS for styling

**Backend**

- Next.js API routes

**Database**

- MongoDB
- Mongoose for schema and database interaction

**Authentication**

- JSON Web Token for stateless authentication
- bcrypt for password hashing

---

## Setup Instructions

To run the project locally:

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a `.env.local` file** in the project root:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the project in your browser:**

   http://localhost:3000

5. **(Optional)** You can run the seed script to add sample listings.

   ```bash
   npm run seed
   ```

---

## Features Implemented

### Authentication

- User registration with name, email, and password
- Secure password hashing using bcrypt
- Login with JSON Web Token authentication
- Logout functionality

### Travel Listings

- Create a new travel experience listing
- View all listings in a public feed
- View detailed information for each listing
- Edit listings created by the user
- Delete listings created by the user

### User Interaction

- Like / unlike travel listings
- Display total like count for each listing

### Search & Browsing

- Search listings by title or location
- Listings sorted by newest first
- Pagination with "Load More" for better performance

### Image Handling

- Upload images for listings (JPEG, PNG, GIF, WebP)
- Basic file validation (size and type)

### UI & Experience

- Responsive layout for mobile and desktop
- Dark mode based on system preference
- Toast notifications for success and error messages
- Simple navigation with user profile dropdown

---

## Architecture & Key Decisions

### Why this tech stack?

I used Next.js because it allows building both the frontend and backend in a single project using API routes, which simplifies development and deployment.

MongoDB works well for this type of application since listings are document-based data and the schema is flexible.

Tailwind CSS helped speed up UI development and made it easier to build a responsive layout quickly.

### How authentication works

Users register with their name, email, and password. Passwords are hashed using bcrypt before being stored in the database.

When a user logs in, the server generates a JWT token that is returned to the client. The client stores this token in localStorage and sends it with requests to protected API routes using the Authorization header.

The server verifies the token before allowing actions like creating, editing, deleting, or liking listings.

### How listings are stored

Travel listings are stored as documents in MongoDB. Each listing contains fields such as title, location, description, price, image, and information about the user who created it.

Listings also store an array of user IDs (likedBy) to track which users liked the listing.

Listings are sorted by createdAt so the newest listings appear first in the feed.

### One improvement I would add with more time

If I had more time, I would improve image handling by integrating a cloud storage service like Cloudinary or Amazon S3.

Right now images are stored locally, which works for a small demo but wouldn't scale well for a production system.

---

## Product Thinking: Scaling to 10,000 Listings

If this platform grew to around 10,000 listings, several improvements would help maintain performance and user experience.

First, I would add proper database indexes on fields like createdAt, title, and location so sorting and searching remain fast.

I would also move from simple offset pagination to cursor-based pagination or infinite scroll, which performs better with large datasets.

Search could be improved using MongoDB Atlas Search or another full-text search engine instead of regex queries.

To reduce server load, frequently accessed listing feeds could be cached using a caching layer like Redis or Next.js caching features.

Finally, images should be served through a CDN with automatic resizing and compression to reduce page load times.

---

## Project Structure

```
travel-platform/
├── app/
│   ├── api/
│   │   ├── auth/           # Login and register routes
│   │   ├── listings/       # CRUD, like, and upload routes
│   │   └── upload/         # Image upload route
│   ├── create/            # Create listing page
│   ├── edit/[id]/         # Edit listing page
│   ├── listing/[id]/      # Listing detail page
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── icon.svg           # Favicon
│   └── layout.js
├── components/
│   ├── Navbar.js
│   └── ToastProvider.js
├── lib/
│   ├── mongodb.js         # Database connection
│   ├── validations.js     # Email and password validation
│   └── time.js            # timeAgo helper
├── models/
│   ├── Listing.js
│   └── User.js
├── public/
│   └── uploads/           # User-uploaded images (gitignored)
├── scripts/
│   └── seed.js            # Seed database with sample listings
└── package.json
```
