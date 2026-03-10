import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import jwt from "jsonwebtoken";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ error: "Login to like" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = String(decoded.userId);

    const listing = await Listing.findById(id);

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    const currentLikedBy = listing.likedBy || [];
    const alreadyLiked = currentLikedBy.some((id) => String(id) === userId);

    let updated;
    if (alreadyLiked) {
      updated = await Listing.findByIdAndUpdate(
        id,
        { $pull: { likedBy: userId } },
        { new: true }
      );
    } else {
      updated = await Listing.findByIdAndUpdate(
        id,
        { $addToSet: { likedBy: userId } },
        { new: true }
      );
    }

    const likedBy = (updated.likedBy || []).map((id) => String(id));
    const likeCount = likedBy.length;
    const liked = likedBy.includes(userId);

    return Response.json({ liked, likeCount, likedBy });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
