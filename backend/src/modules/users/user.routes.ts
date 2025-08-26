import { Router } from "express";
import * as ctrl from "./user.controller";
import { asyncHandler as ah } from "../../lib/asyncHandler";

const router = Router();

router.get("/", ah(ctrl.list));
router.get("/:id", ah(ctrl.get));
router.post("/", ah(ctrl.create));
router.put("/:id", ah(ctrl.update));
router.delete("/:id", ah(ctrl.remove));

export default router;
