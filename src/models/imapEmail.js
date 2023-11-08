const { Schema, model } = require("mongoose");
const helpers = require("@helpers");

const imapConfigShema = new Schema(
  {
    NumId: {
      type: Number,
      unique: true,
      default: 1,
    },

    iconBox: {
      type: String,
      default: "Mail",
    },
    color: {
      type: String,
      default: "'#000000'",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [helpers.emailRegexp, "Invalid email format."],
    },

    pass: {
      type: String,
      required: [true, "Address Password is required"],
    },

    port: {
      type: Number,
      required: [true, "Port is required"],
      default: 993,
    },
    host: {
      type: String,
      required: [true, "Host is required"],
    },
    smtpPort: {
      type: Number,
      required: [true, "smtpPort is required"],
      default: 587,
    },
    smtpHost: {
      type: String,
      required: [true, "smtpHost is required"],
    },
    secure: {
      type: Boolean,
      required: [true, "Secure is required"],
      default: true,
    },
    secureSmtp: {
      type: Boolean,
      required: [true, "smtpSecure is required"],
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    mailboxes: [
      {
        nameEn: String,
        nameUa: String,
        path: String,
        countMail: Number,
        countMailUnseen: Number,
        mailList: [
          {
            id: Number,
            from: {
              name: String,
              address: String,
            },
            date: Date,
            subject: String,
            unseen: String,
          },
        ],
      },
    ],
  },
  { versionKey: false }
);
imapConfigShema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const lastRecord = await ImapEmail.findOne(
        {},
        {},
        { sort: { NumId: -1 } }
      );
      if (lastRecord) {
        this.NumId = lastRecord.NumId + 1;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});
imapConfigShema.post("save", helpers.handleMongooseError);

const ImapEmail = model("imap", imapConfigShema);

module.exports = { ImapEmail };
