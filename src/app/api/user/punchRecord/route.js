import { verifyToken } from "@/backend/middlewares/verifyToken";
import { getPunchRecords } from "@/backend/controller/user.contorller";

export const GET = verifyToken(async (req) => {
    return await getPunchRecords(req);
});
