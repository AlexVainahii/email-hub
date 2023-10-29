const Joi = require("joi");
const { emailRegexp } = require("@helpers");

const imapSchema = Joi.object({
  NumId: Joi.number().default(1),
  iconBox: Joi.string().default("Mail"),
  color: Joi.string().default("#000000"),
  email: Joi.string()
    .trim()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "Email is required" }),
  pass: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  port: Joi.number()
    .required()
    .messages({ "any.required": "Port is required" }),
  host: Joi.string()
    .required()
    .messages({ "any.required": "Host is required" }),
  secure: Joi.boolean()
    .required()
    .messages({ "any.required": "tls is required" }),
  owner: Joi.string().messages({ "any.required": "Owner is required" }),
  mailboxes: Joi.array()
    .items(
      Joi.object({
        nameEn: Joi.string(),
        nameUa: Joi.string(),
        path: Joi.string(),
        countNumber: Joi.number(),
      })
    )
    .default([]),
});

module.exports = { imapSchema };
