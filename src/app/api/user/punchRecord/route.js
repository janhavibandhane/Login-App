import { verifyToken } from "@/middlewares/verifyToken";
import { getPunchRecords } from "@/controller/user.contorller";

export const GET = verifyToken(async (req) => {
    return await getPunchRecords(req);
});
