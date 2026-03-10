"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { timeAgo } from "@/lib/time";

export default function ListingDetailPage() {

  const params = useParams();
  const [listing,setListing] = useState(null);

  useEffect(()=>{

    const fetchListing = async () => {

      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();

      setListing(data);
    };

    fetchListing();

  },[params.id]);

  if(!listing){
    return <p className="p-8">Loading...</p>;
  }

  return (

    <div className="p-8 max-w-3xl mx-auto">

      <img
        src={listing.image}
        className="w-full h-80 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-6">
        {listing.title}
      </h1>

      <p className="text-gray-500 mt-2">
        {listing.location}
      </p>

      <p className="mt-4">
        {listing.description}
      </p>

      {listing.price && (
        <p className="mt-4 font-semibold">
          Price: ${listing.price}
        </p>
      )}

      <p className="mt-4 text-gray-600">
        Created by {listing.userName}
      </p>
      
      <p className="text-xs text-gray-500 mt-2">
        Posted {timeAgo(listing.createdAt)}
      </p>
    </div>
  );
}