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
  addressPass: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  smtpPort: Joi.number()
    .required()
    .messages({ "any.required": "Port is required" }),
  smtpHost: Joi.string()
    .required()
    .messages({ "any.required": "Host is required" }),
  secure: Joi.boolean()
    .required()
    .messages({ "any.required": "secure is required" }),
  owner: Joi.string().messages({ "any.required": "Owner is required" }),
  mailboxes: Joi.array()
    .items(
      Joi.object({
        nameEn: Joi.string(),
        nameUa: Joi.string(),
        path: Joi.string(),
        countMail: Joi.number(),
        countMailUnseen: Joi.number(),
        mailList: Joi.array().items(
          Joi.object({
            id: Joi.number(),
            from: Joi.object({
              name: Joi.string(),
              address: Joi.string(),
            }),
            date: Joi.string(),
            subject: Joi.string(),
            unseen: Joi.string(),
          })
        ),
      })
    )
    .default([]),
});

module.exports = { imapSchema };
