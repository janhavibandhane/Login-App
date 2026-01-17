import axios from "axios";
import { authHeaders } from "@/Utils/authHeaders";

export async function login(email, password) {
  const response = await axios.post("/api/login", {
    email,
    password,
  });

  return response.data;
}
export async function changePassword(email, newPassword) {
  const res = await axios.post("/api/changePassword", {
    email,
    newPassword,
  });
  return res.data;
}

// Register a new user
export const registerUsers = async (userData) => {
  const res = await axios.post("/api/register", userData);
  return res.data;
};

// Get all users
export const getAllUserss = async () => {
  const res = await axios.get("/api/getAllUsers", {
    headers: authHeaders(),
  });
  return res.data;
};