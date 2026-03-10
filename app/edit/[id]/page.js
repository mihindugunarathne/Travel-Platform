"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditListingPage() {

  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to edit a listing");
      router.push("/login");
      return;
    }

    const fetchListing = async () => {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();

      if (res.ok) {
        const userId = localStorage.getItem("userId");
        if (String(data.userId) !== userId) {
          alert("You can only edit your own listings");
          router.push(`/listing/${params.id}`);
          return;
        }
        setTitle(data.title || "");
        setLocation(data.location || "");
        setImage(data.image || "");
        setDescription(data.description || "");
        setPrice(data.price !== undefined && data.price !== null ? String(data.price) : "");
      } else {
        alert("Listing not found");
        router.push("/");
      }
      setLoading(false);
    };

    fetchListing();
  }, [params.id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/listings/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        location,
        image,
        description,
        price: price === "" ? undefined : Number(price),
      }),
    });

    if (res.ok) {
      router.push(`/listing/${params.id}`);
    } else {
      const data = await res.json();
      alert(data.error || "Error updating listing");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Edit Experience
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Update your listing details
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              className={inputClass}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className={inputClass}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <input
              className={inputClass}
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <textarea
              className={inputClass + " min-h-[100px] resize-y"}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className={inputClass}
              type="number"
              placeholder="Price (optional)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
