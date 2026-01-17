import { verifyToken } from "@/backend/middlewares/verifyToken";
import { getAllPunchRecord } from "@/backend/controller/user.contorller";

export const GET = verifyToken(async (req) => {
    return await getAllPunchRecord(req);
});
