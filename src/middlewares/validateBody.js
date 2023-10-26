const helpers = require("@helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    helpers.CheckByError(
      error,
      400,
      `missing required field ${error?.message}`
    );
    next();
  };

  return func;
};

module.exports = validateBody;
