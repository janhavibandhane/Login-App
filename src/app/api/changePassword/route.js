import { changePassword } from "@/controller/auth.contorller";
export async function POST(req) {
  return await changePassword(req);
}

