import { loginUser } from "@/controller/auth.contorller";
export async function POST(req) {
  return await loginUser(req);
}