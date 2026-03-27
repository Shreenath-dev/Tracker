import express from "express"
import authRoutes from "./auth";
import v1 from "./v1";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/v1", v1);
export default router;
