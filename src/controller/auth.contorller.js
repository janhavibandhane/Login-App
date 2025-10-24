import { User } from "@/model/use.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/utils/db";

connectDB();

// register api
export const registerUser = async (req) => {
  try {
    // what we want from user
    const { username, email, password, role } = await req.json();
    //validation
    if (!username || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }

    // check if user alrdy exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    //hash password
    const newUser = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    });

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in register api", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

//login api
export const loginUser = async (req) => {
  try {
    const { email, password } = await req.json();

    // validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ Error: "All fields are required" }),
        { status: 400 }
      );
    }
    //check user is exist or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(JSON.stringify({ Error: "User not found" }), {
        status: 400,
      });
    }
    //check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ Error: "Invalid credentials" }), {
        status: 400,
      });
    }
  } catch (error) {
    console.log("Error in register api", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
