import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();

    const listing = await Listing.findById(id);

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    if (String(listing.userId) !== String(decoded.userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, location, image, description, price } = body;
    const priceVal = price === "" || price == null ? null : Number(price);
    const updated = await Listing.findByIdAndUpdate(
      id,
      {
        title: title ?? listing.title,
        location: location ?? listing.location,
        image: image ?? listing.image,
        description: description ?? listing.description,
        price: priceVal === null ? null : (Number.isNaN(priceVal) ? listing.price : priceVal),
      },
      { new: true }
    );

    return Response.json(updated);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const listing = await Listing.findById(id);

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    if (String(listing.userId) !== String(decoded.userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Listing.findByIdAndDelete(id);

    return Response.json({ message: "Listing deleted" });

  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    return Response.json(listing);

  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}