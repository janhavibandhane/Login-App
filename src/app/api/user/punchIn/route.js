import { verifyToken } from "@/backend/middlewares/verifyToken";
import { punchIn } from "@/backend/controller/user.contorller";

export const POST = verifyToken(async (req) => {
    return await punchIn(req);
})