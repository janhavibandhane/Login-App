import { changePassword } from "@/backend/controller/auth.contorller";
export async function POST(req) {
  return await changePassword(req);
}

