// src/middlewares/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (handler) => {
  return async (req) => {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Optionally attach user data to req
      req.user = decoded;

      // ✅ Correctly call your handler
      return handler(req);
    } catch (error) {
      console.error("verifyToken error:", error);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 403,
      });
    }
  };
};
