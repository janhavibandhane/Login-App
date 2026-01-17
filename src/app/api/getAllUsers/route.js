import { getAllUsers } from "@/backend/controller/auth.contorller";
import { verifyToken } from "@/backend/middlewares/verifyToken";

export const GET = verifyToken(async (req) => {
    return await getAllUsers(req);
});