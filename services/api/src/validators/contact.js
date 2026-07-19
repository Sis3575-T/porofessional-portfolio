import { body } from "express-validator";

export const createContactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("message")
    .trim()
    .notEmpty()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];
