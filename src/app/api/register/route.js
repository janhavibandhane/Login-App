import { registerUser } from "@/backend/controller/auth.contorller";

export async function POST(req) {
  return await registerUser(req);
}