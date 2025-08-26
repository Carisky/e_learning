import { Router } from "express";
import { asyncHandler as ah } from "../../lib/asyncHandler";
import * as ctrl from "./auth.controller";

const router = Router();

router.post("/login", ah(ctrl.login));

export default router;
