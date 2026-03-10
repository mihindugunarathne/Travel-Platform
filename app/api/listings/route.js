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

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + listings.length < total;

    return Response.json({ listings, total, hasMore });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}