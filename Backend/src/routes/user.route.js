import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { fetchUser, login, signup } from "../controllers/user.controller.js";

const router = Router()

router.route("/sign-up").post(signup)
router.route("/login").post(login)
router.route("/fetch-user").get(verifyJWT, fetchUser)

export default router