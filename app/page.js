"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HomePage() {

  const pathname = usePathname();
  const [listings, setListings] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/listings");
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    queueMicrotask(() => setLoggedIn(!!token));
  }, [pathname]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">
          No travel experiences yet
        </h2>
        <p className="text-gray-500 mt-2">
          Be the first to create one!
        </p>
      </div>
    );
  }

  return (

    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">Travel Experiences</h1>

        {loggedIn && (
          <Link href="/create">
            <button className="bg-black text-white px-4 py-2">
              Create Listing
            </button>
          </Link>
        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {listings.map((listing)=>(

          <Link key={listing._id} href={`/listing/${listing._id}`}>

            <div className="border rounded-lg overflow-hidden cursor-pointer">

              <img
                src={listing.image}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">

                <h2 className="text-xl font-semibold">
                  {listing.title}
                </h2>

                <p className="text-gray-500">
                  {listing.location}
                </p>

                <p className="text-sm mt-2">
                  {listing.description.slice(0,80)}...
                </p>

                <p className="text-sm mt-3 text-gray-600">
                  By {listing.userName}
                </p>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );
}