const Joi = require("joi");
const { emailRegexp } = require("@helpers");

const sendSchema = Joi.object({
  recipient: Joi.string()
    .trim()
    .pattern(emailRegexp)
    .required()
    .messages({ "any.required": "Email is required" }),
  _id: Joi.string().required().messages({ "any.required": "Id is required" }),
}).unknown(true);

module.exports = { sendSchema };
