const { Schema, model } = require("mongoose");
const helpers = require("@helpers");

const imapConfigShema = new Schema(
  {
    NumId: {
      type: Number,
      unique: true,
      default: 1,
    },

    titleBox: {
      type: String,
      default: "another mail",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      match: [helpers.emailRegexp, "Invalid email format."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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
    tls: {
      type: Boolean,
      required: [true, "tls is required"],
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
        description: String,
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
