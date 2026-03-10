"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { error: showError } = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please login to edit a listing");
      router.push("/login");
      return;
    }

    const fetchListing = async () => {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();

      if (res.ok) {
        const userId = localStorage.getItem("userId");
        if (String(data.userId) !== userId) {
          showError("You can only edit your own listings");
          router.push(`/listing/${params.id}`);
          return;
        }
        setTitle(data.title || "");
        setLocation(data.location || "");
        setImage(data.image || "");
        setDescription(data.description || "");
        setPrice(data.price !== undefined && data.price !== null ? String(data.price) : "");
      } else {
        showError("Listing not found");
        router.push("/");
      }
      setLoading(false);
    };

    fetchListing();
  }, [params.id, router, showError]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please select an image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImage(data.url);
      } else {
        showError(data.error || "Upload failed");
      }
    } catch {
      showError("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      showError("Please upload an image");
      return;
    }

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
      showError(data.error || "Error updating listing");
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

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-500 transition-colors text-slate-600 dark:text-slate-400 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Change image"}
              </button>
              {image && (
                <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                  <img
                    src={image}
                    alt="Current"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

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
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              Update Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
