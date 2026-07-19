import { body } from "express-validator";

export const updateHeroValidation = [
  body("greeting").optional().trim().isLength({ max: 200 }),
  body("name").optional().trim().isLength({ max: 200 }),
  body("title").optional().trim().isLength({ max: 300 }),
  body("description").optional().trim().isLength({ max: 1000 }),
  body("primaryCTA").optional().trim().isLength({ max: 100 }),
  body("secondaryCTA").optional().trim().isLength({ max: 100 }),
  body("profileImage").optional().isURL().withMessage("Must be a valid URL"),
  body("backgroundImage").optional().isURL().withMessage("Must be a valid URL"),
];
