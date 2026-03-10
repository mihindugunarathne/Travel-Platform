import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";

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