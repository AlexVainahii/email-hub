const Joi = require("joi");
const helpers = require("@helpers");
const itemPerPageSchema = Joi.object({
  itemPerPage: Joi.number()
    .valid(...helpers.itemsPerPageEnum)
    .default(10),
});

module.exports = { itemPerPageSchema };
