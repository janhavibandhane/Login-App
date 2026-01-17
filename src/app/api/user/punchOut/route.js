import { verifyToken } from "@/backend/middlewares/verifyToken";
import { punchOut } from "@/backend/controller/user.contorller";

export const PUT = verifyToken(async (req) => {
    return await punchOut(req);
});
