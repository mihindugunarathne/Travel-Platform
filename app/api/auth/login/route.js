import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEmailError, getPasswordError } from "@/lib/validations";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);
    if (emailError || passwordError) {
      return Response.json(
        { error: emailError || passwordError },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}