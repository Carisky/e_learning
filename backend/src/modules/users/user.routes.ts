import { Router } from "express";
import * as ctrl from "./user.controller";
import { asyncHandler as ah } from "../../lib/asyncHandler";
import {
  authMiddleware,
  requireRole,
  requireSelfOrRole,
} from "../../lib/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin"), ah(ctrl.list));
router.get("/:id", requireSelfOrRole("admin"), ah(ctrl.get));
router.post("/", requireRole("admin"), ah(ctrl.create));
router.put("/:id", requireSelfOrRole("admin"), ah(ctrl.update));
router.delete("/:id", requireRole("admin"), ah(ctrl.remove));

export default router;
