"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomePage() {

  const pathname = usePathname();
  const [listings, setListings] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", "1");
      params.set("limit", "6");
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setHasMore(data.hasMore || false);
      setPage(1);
      setLoading(false);
    };
    fetchListings();
  }, [search]);

  useEffect(() => {
    if (page <= 1) return;
    const fetchMore = async () => {
      setLoadingMore(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "6");
      const res = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings((prev) => [...prev, ...(data.listings || [])]);
      setHasMore(data.hasMore || false);
      setLoadingMore(false);
    };
    fetchMore();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    queueMicrotask(() => setLoggedIn(!!token));
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400">Loading experiences...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search by location or title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setSearchInput(""); }}
              className="px-4 py-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </form>
        <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            {search ? `No results for "${search}"` : "No travel experiences yet"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {search ? "Try a different search." : "Be the first to create one!"}
          </p>
        </div>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero + Search */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Travel Experiences
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Discover unique adventures around the world
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 w-48 sm:w-56 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Search
              </button>
            </form>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                Clear
              </button>
            )}
            {loggedIn && (
              <Link href="/create">
                <button className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/25">
                  + Create Listing
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Listing grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {listings.map((listing) => (
          <Link key={listing._id} href={`/listing/${listing._id}`}>
            <article className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">
                    {listing.title}
                  </h2>
                  {listing.price && (
                    <span className="shrink-0 text-teal-600 dark:text-teal-400 font-semibold">
                      ${listing.price}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {listing.location}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 line-clamp-2">
                  {listing.description.slice(0, 80)}...
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400 dark:text-slate-500">
                  <span>By {listing.userName}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {(listing.likedBy || []).length}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}

      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

    </div>

  );
}
