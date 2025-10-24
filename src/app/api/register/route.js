import { registerUser } from "@/controller/auth.contorller";

export async function POST(req) {
  return await registerUser(req);
}