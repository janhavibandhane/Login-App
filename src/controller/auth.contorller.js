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

    // genrate token
    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // return res
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          token: token,
        },
      })
    );
  } catch (error) {
    console.log("Error in register api", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

// change passowrd
export const changePassword = async (req) => {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // check if user alrday exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User Not found" }), {
        status: 404,
      });
    }

    // hash new password
    const hashedPAssword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPAssword;
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password reset successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in reset password API", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

//get all users
// export const getAllUsers = async () => {
//   try {
//     const users = await User.find().select("-password");
//     //remove password field

//     return new Response(
//       JSON.stringify({
//         message: "Users fetched successfully",
//         users,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in getAllUsers API:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   }
// };

//get all users with pagination and search
export const getAllUsers = async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Search by username or email
    const query = {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({
        message: "Users fetched successfully",
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        users,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.log("Error in getAllUsers API", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};