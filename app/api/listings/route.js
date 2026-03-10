import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { title, location, image, description, price } = await req.json();

    const listing = await Listing.create({
      title,
      location,
      image,
      description,
      price,
      userId: decoded.userId,
      userName: decoded.name,
    });

    return Response.json(listing, { status: 201 });

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const listings = await Listing.find().sort({ createdAt: -1 });

    return Response.json(listings);

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}