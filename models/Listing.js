import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    title: String,
    location: String,
    image: String,
    description: String,
    price: Number,
    userId: String,
    userName: String,
  },
  { timestamps: true }
);

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);