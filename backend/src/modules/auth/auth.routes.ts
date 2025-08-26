import { Router } from "express";
import { asyncHandler as ah } from "../../lib/asyncHandler";
import * as ctrl from "./auth.controller";
import { authMiddleware } from "../../lib/auth";

const router = Router();

router.post("/login", ah(ctrl.login));
router.post("/register", ah(ctrl.register));
router.get("/me", authMiddleware, ah(ctrl.me));

export default router;
