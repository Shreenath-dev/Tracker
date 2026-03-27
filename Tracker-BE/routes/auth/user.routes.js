import express from "express";
import * as controllers from "@/controllers";
import { authenticate } from "@/middleware/user.middleware";

const router = express.Router();

router.route("/signup").post(controllers.auth.users.signUp);
router.route("/verify-email").post(controllers.auth.users.verifyOtp);
router.route("/create-password").post(controllers.auth.users.createPassword);
router.route("/signin").post(controllers.auth.users.signin);
router.route("/refresh-token").post(controllers.auth.users.refreshToken);
router.route("/signout").post(authenticate, controllers.auth.users.signout);

export default router;