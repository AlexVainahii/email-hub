const Joi = require("joi");
const { emailRegexp } = require("@helpers");

const sendSchema = Joi.object({
  recipient: Joi.string()
    .trim()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "Email is required" }),
  subject: Joi.string().default(""),
  text: Joi.string().default(""),
  _id: Joi.string().default(""),
});

module.exports = { sendSchema };
