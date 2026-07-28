import { body } from "express-validator";

export const createSkillValidation = [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("category")
    .isIn(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "TOOLS", "LANGUAGES", "SOFT_SKILLS", "OTHER"])
    .withMessage("Invalid category"),
  body("proficiency")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Proficiency must be 0-100"),
];
