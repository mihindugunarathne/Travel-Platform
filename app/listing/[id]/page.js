"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { timeAgo } from "@/lib/time";

export default function ListingDetailPage() {

  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);

  const fetchListing = async () => {
    const res = await fetch(`/api/listings/${params.id}`);
    const data = await res.json();
    setListing(data);
  };

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const isCreator = listing && typeof window !== "undefined" &&
    String(listing.userId) === localStorage.getItem("userId");

  const likedBy = listing?.likedBy || [];
  const likeCount = likedBy.length;
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const hasLiked = currentUserId && likedBy.some((id) => String(id) === String(currentUserId));

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to like");
      return;
    }
    try {
      const res = await fetch(`/api/listings/${params.id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setListing((prev) => ({
          ...prev,
          likedBy: data.likedBy || prev?.likedBy || [],
        }));
      } else {
        alert(data.error || "Failed to like");
        fetchListing();
      }
    } catch (err) {
      alert("Failed to like");
      fetchListing();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/listings/${params.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }
  };

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (

    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      <article className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="aspect-video overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <span>{listing.location}</span>
            <span>•</span>
            <span>Posted {timeAgo(listing.createdAt)}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {listing.title}
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            {listing.description}
          </p>

          {listing.price && (
            <p className="mt-4 text-xl font-semibold text-teal-600 dark:text-teal-400">
              ${listing.price}
            </p>
          )}

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Created by <span className="font-medium text-slate-700 dark:text-slate-300">{listing.userName}</span>
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {hasLiked ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            </button>
          </div>

          {isCreator && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3">
              <Link href={`/edit/${params.id}`}>
                <button className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </article>

    </div>

  );
}
