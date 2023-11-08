const Joi = require("joi");

const deleteEmailsSchema = Joi.object({
  path: Joi.string()
    .required()
    .messages({ "any.required": "fromPath is required" }),
  _id: Joi.string().required().messages({ "any.required": "Id is required" }),
  mailList: Joi.array()
    .items(Joi.number())
    .min(1) // Мінімум 1 елемент
    .required()
    .messages({ "any.required": "Array mail is required" }),
});

module.exports = { deleteEmailsSchema };
