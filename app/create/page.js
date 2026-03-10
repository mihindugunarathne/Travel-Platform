"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {

  const router = useRouter();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a listing");
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, GIF, or WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
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
        setImagePreview(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload an image");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("/api/listings", {
      method: "POST",
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
      router.push("/");
    } else {
      alert("Error creating listing");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Experience
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Share your travel adventure with the world
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
                {uploading ? "Uploading..." : image ? "Change image" : "Upload image"}
              </button>
              {imagePreview && (
                <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                  <img
                    src={imagePreview}
                    alt="Preview"
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
              disabled={uploading || !image}
              className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              Create Listing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
