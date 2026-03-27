import express from "express";
import * as controller from "@/controllers"
import { userAuthenticate as userAuth } from "@/security/passport";


const router = express.Router();

router.route("/get-admin-info").get(
    userAuth,
    controller.v1.users.getAdminProfile)

export default router