import { verifyToken } from "@/middlewares/verifyToken";
import { punchIn } from "@/controller/user.contorller";

export const POST = verifyToken(async (req) => {
    return await punchIn(req);
})