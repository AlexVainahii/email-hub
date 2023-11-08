const Joi = require("joi");
const { emailRegexp } = require("@helpers");

const editImapSchema = Joi.object({
  NumId: Joi.number().default(1),
  iconBox: Joi.string().default("Mail"),
  color: Joi.string().default("#000000"),
  email: Joi.string().trim().pattern(emailRegexp),

  pass: Joi.string(),
  port: Joi.number(),
  host: Joi.string(),
  smtpPort: Joi.number(),
  smtpHost: Joi.string(),
  secure: Joi.boolean(),
  smtpSecure: Joi.boolean(),
  owner: Joi.string(),
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

module.exports = { editImapSchema };
