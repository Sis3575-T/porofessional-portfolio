import { body } from "express-validator";

export const createProjectValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("slug")
    .trim()
    .notEmpty()
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must be lowercase alphanumeric with hyphens"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .isIn(["FRONTEND", "BACKEND", "FULLSTACK", "MOBILE", "UIUX", "AI", "OTHER"])
    .withMessage("Invalid category"),
  body("liveUrl").optional().isURL().withMessage("Must be a valid URL"),
  body("githubUrl").optional().isURL().withMessage("Must be a valid URL"),
];
