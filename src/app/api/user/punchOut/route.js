import { verifyToken } from "@/middlewares/verifyToken";
import { punchOut } from "@/controller/user.contorller";

export const PUT = verifyToken(async (req) => {
    return await punchOut(req);
});
