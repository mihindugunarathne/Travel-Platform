"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a listing");
      router.push("/login");
    }
  }, [router]);

  const [title,setTitle] = useState("");
  const [location,setLocation] = useState("");
  const [image,setImage] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/listings",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({
        title,
        location,
        image,
        description,
        price
      })
    });

    if(res.ok){
      router.push("/");
    } else {
      alert("Error creating listing");
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <form onSubmit={handleSubmit} className="space-y-4 w-96">

        <h1 className="text-2xl font-bold">Create Experience</h1>

        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={image}
          onChange={(e)=>setImage(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />

        <button className="bg-black text-white p-2 w-full">
          Create Listing
        </button>

      </form>

    </div>
  );
}