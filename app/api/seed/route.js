import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Listing from "@/models/Listing";
import User from "@/models/User";

const DUMMY_LISTINGS = [
  { title: "Sunset Boat Tour", location: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", description: "Enjoy a beautiful sunset while sailing along the coastline. Perfect for couples and photographers.", price: 45, userName: "Mihindu" },
  { title: "Temple Hopping Adventure", location: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", description: "Explore ancient temples and traditional gardens in the heart of Kyoto. Guided tour included.", price: 65, userName: "Sarah" },
  { title: "Cooking Class in Tuscany", location: "Florence, Italy", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800", description: "Learn to make authentic Italian pasta and tiramisu from a local chef in a vineyard farmhouse.", price: 120, userName: "Marco" },
  { title: "Desert Safari", location: "Dubai, UAE", image: "https://images.unsplash.com/photo-1451337516015-6b6e9f44aeea?w=800", description: "Thrilling dune bashing, camel rides, and a traditional Bedouin camp dinner under the stars.", price: 95, userName: "Ahmed" },
  { title: "Great Barrier Reef Diving", location: "Cairns, Australia", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", description: "Discover the world's largest coral reef system. Snorkeling and diving for all skill levels.", price: 180, userName: "Emma" },
  { title: "Northern Lights Chase", location: "Tromsø, Norway", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", description: "Hunt for the Aurora Borealis in one of the best spots on Earth. Hot chocolate and warm gear provided.", price: 150, userName: "Lars" },
  { title: "Rice Terrace Trekking", location: "Ubud, Bali", image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800", description: "Walk through emerald green rice paddies and learn about traditional Balinese farming.", price: 35, userName: "Putu" },
  { title: "Street Food Tour", location: "Bangkok, Thailand", image: "https://images.unsplash.com/photo-1529006557810-274b9a2dc465?w=800", description: "Sample the best pad thai, mango sticky rice, and local delicacies with a food expert guide.", price: 40, userName: "Nong" },
  { title: "Hot Air Balloon Ride", location: "Cappadocia, Turkey", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", description: "Float over fairy chimneys at sunrise. Breathtaking views and a champagne breakfast.", price: 220, userName: "Mehmet" },
  { title: "Safari in Serengeti", location: "Tanzania", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800", description: "See the Big Five and witness the Great Migration. Full-day safari with expert tracker.", price: 350, userName: "Juma" },
  { title: "Cable Car to Table Mountain", location: "Cape Town, South Africa", image: "https://images.unsplash.com/photo-1580060835134-6d5e6879fbca?w=800", description: "Ride to the top of Table Mountain for panoramic views of Cape Town and the Atlantic.", price: 55, userName: "Thabo" },
  { title: "Kayaking in Ha Long Bay", location: "Vietnam", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800", description: "Paddle through limestone karsts and hidden lagoons. Overnight junk boat option available.", price: 85, userName: "Linh" },
  { title: "Walking Tour of Old Town", location: "Prague, Czech Republic", image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", description: "Discover cobblestone streets, medieval architecture, and the famous Astronomical Clock.", price: 25, userName: "Petr" },
  { title: "Wine Tasting in Mendoza", location: "Argentina", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800", description: "Visit renowned Malbec vineyards at the foot of the Andes. Four wineries with lunch.", price: 110, userName: "Carlos" },
  { title: "Machu Picchu Day Trip", location: "Peru", image: "https://images.unsplash.com/photo-1587595431973-160b9e1a4063?w=800", description: "Explore the ancient Incan citadel with a knowledgeable guide. Train ride through Sacred Valley.", price: 250, userName: "Rosa" },
  { title: "Santorini Sunset Cruise", location: "Greece", image: "https://images.unsplash.com/photo-1533105079780-4b6bde0dc445?w=800", description: "Sail around the caldera, swim in hot springs, and watch the iconic Oia sunset from the water.", price: 130, userName: "Nikos" },
  { title: "Iceland Glacier Hike", location: "Reykjavik, Iceland", image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800", description: "Trek across a blue ice glacier with crampons. Suitable for beginners with all gear provided.", price: 165, userName: "Björn" },
  { title: "Rajasthan Palace Tour", location: "Jaipur, India", image: "https://images.unsplash.com/photo-1565653179596-5ce81db98a0c?w=800", description: "Visit the Pink City's forts and palaces. Includes entrance fees and traditional lunch.", price: 75, userName: "Raj" },
  { title: "Amalfi Coast Boat Trip", location: "Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800", description: "Cruise along dramatic cliffs, visit Positano and Amalfi. Swim stops and limoncello tasting.", price: 140, userName: "Giulia" },
  { title: "Patagonia Trekking", location: "Chile", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800", description: "Hike through Torres del Paine. Stunning granite towers and turquoise lakes.", price: 280, userName: "Pablo" },
  { title: "Moroccan Souk Experience", location: "Marrakech", image: "https://images.unsplash.com/photo-1489749798305-4fea3f63c082?w=800", description: "Navigate the maze of Jemaa el-Fnaa with a local. Bargaining tips and tea ceremony included.", price: 50, userName: "Youssef" },
  { title: "New York City Helicopter Tour", location: "USA", image: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800", description: "Soar over Manhattan, the Statue of Liberty, and Brooklyn Bridge. 15-minute scenic flight.", price: 240, userName: "Mike" },
];

export async function POST() {
  try {
    await connectDB();

    const count = await Listing.countDocuments();
    if (count >= 20) {
      return Response.json({
        message: `Database already has ${count} listings. No seed needed.`,
      });
    }

    let user = await User.findOne({ email: "mihindu@example.com" });
    if (!user) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      user = await User.create({
        name: "Mihindu",
        email: "mihindu@example.com",
        password: hashedPassword,
      });
    }
    const userId = user._id.toString();

    const listingsToInsert = DUMMY_LISTINGS.map((l) => ({
      ...l,
      userId,
    }));

    await Listing.insertMany(listingsToInsert);

    return Response.json({
      message: `Added ${listingsToInsert.length} listings. Log in as mihindu@example.com / password123 to see the Delete button.`,
    });
  } catch (error) {
    console.error("Seed failed:", error);
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
