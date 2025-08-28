import { Router } from "express";
import { asyncHandler } from "../../lib/asyncHandler";
import {
  authMiddleware,
  requireRole,
  optionalAuth,
} from "../../lib/auth";
import * as controller from "./course.controller";

const router = Router();

router.get("/", asyncHandler(controller.listCourses));
router.get("/:id", optionalAuth, asyncHandler(controller.getCourse));
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  asyncHandler(controller.createCourse)
);

export default router;
