import { verifyToken } from "@/middlewares/verifyToken";
import { getAllPunchRecord } from "@/controller/user.contorller";

export const GET = verifyToken(async (req) => {
    return await getAllPunchRecord(req);
});
