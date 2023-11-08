const Joi = require("joi");

const moveEmailsSchema = Joi.object({
  fromPath: Joi.string()
    .required()
    .messages({ "any.required": "fromPath is required" }),
  toPath: Joi.string()
    .required()
    .messages({ "any.required": "toPath is required" }),
  _id: Joi.string().required().messages({ "any.required": "Id is required" }),
  mailList: Joi.array()
    .items(Joi.number())
    .min(1) // Мінімум 1 елемент
    .required()
    .messages({ "any.required": "Array mail is required" }),
}).custom((value, helpers) => {
  // Перевірка, що fromPath і toPath не рівні
  if (value.fromPath === value.toPath) {
    return helpers.message('"fromPath" should not be equal to "toPath"');
  }
  return value;
});

module.exports = { moveEmailsSchema };
