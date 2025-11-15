import { getAllUsers } from "@/controller/auth.contorller";
import { verifyToken } from "@/middlewares/verifyToken";

export const GET = verifyToken(async (req) => {
    return await getAllUsers(req);
});