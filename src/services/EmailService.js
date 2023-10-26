const Imap = require("node-imap");
const CryptoJS = require("crypto-js");
const helpers = require("@helpers");
const { ImapEmail, User } = require("@models");
class EmailService {
  encrypt(password) {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
    ).toString();
    return encryptedPassword;
  }

  decrypt(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.SECRET_KEY
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
  }

  createImapConfig(model) {
    return {
      user: model.email,
      password: this.decrypt(model.password),
      host: model.host,
      port: model.port,
      tls: model.tls,
    };
  }

  async addMailBox(obj) {
    const { password, email, port, host, tls } = obj;
    const imapEmail = await ImapEmail.findOne({ email });
    helpers.CheckByError(imapEmail, 409, "Provided email already exists");
    const encryptedPassword = this.encrypt(password); // Зашифруйте пароль перед збереженням
    this.getBox({ user: email, password, port, host, tls });
    let listboxes = [];
    try {
      listboxes = await this.getBox({ user: email, password, port, host, tls });
    } catch (error) {
      console.error(
        "Помилка при отриманні інформації про поштові ящики:",
        error
      );
      helpers.CreateError(400, error);
    }
    const mailBox = await ImapEmail.create({
      ...obj,
      password: encryptedPassword,
      mailboxes: [...listboxes],
    });

    return mailBox;
  }

  async changePerPage(_id, obj) {
    const user = await User.findByIdAndUpdate(_id, obj, { new: true });

    return {
      _id: user._id,
      username: user.username,
      itemPerPage: user.itemPerPage,
    };
  }

  async getEmailList(_id, boxName = false) {
    const user = await User.findById({ _id });
    console.log("user :>> ", _id);
    const imapEmail = await ImapEmail.findOne({ owner: user._id });

    const imapConfig = this.createImapConfig(imapEmail);
    const imap = new Imap(imapConfig);
    const emailList = [];
    let countPage = 0;
    console.log("imapEmail :>> ", imapEmail);
    function openInbox(box, cb) {
      imap.openBox(`${box}`, true, cb);
    }
    await new Promise((resolve, reject) => {
      imap.once("ready", function () {
        openInbox(
          boxName || imapEmail.mailboxes[0].description,
          function (err, box) {
            if (err) return reject(err);
            imap.search(["ALL"], (err, uids) => {
              if (err) return reject(err);
              countPage = Math.floor(uids.length / user.itemPerPage);

              const start =
                uids.length - user.itemPerPage <= 0
                  ? 1
                  : uids.length - user.itemPerPage;
              const end = uids.length;
              const f = imap.seq.fetch(`${start}:${end}`, {
                bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE TEXT)",

                struct: true,
              });

              f.on("message", function (msg, seqno) {
                const emailData = {};

                msg.on("body", function (stream, info) {
                  let buffer = "";
                  stream.on("data", function (chunk) {
                    buffer += chunk.toString("utf8");
                  });
                  stream.once("end", function () {
                    const headers = Imap.parseHeader(buffer);
                    emailData.headers = headers;
                  });
                });

                msg.once("attributes", function (attrs) {
                  emailData.attributes = attrs;
                });

                msg.once("end", function () {
                  emailList.push(emailData);
                });
              });

              f.once("error", function (err) {
                reject(err);
              });

              f.once("end", function () {
                resolve();
              });
            });
          }
        );
      });

      imap.once("error", function (err) {
        reject(err);
      });

      imap.once("end", function () {
        console.log("Connection ended");
      });

      imap.connect();
    });

    return { emailList, countPage, listBox: imapEmail.mailboxes, boxName };
  }

  getBox(obj) {
    return new Promise((resolve, reject) => {
      const imap = new Imap(obj);

      imap.once("ready", () => {
        imap.getBoxes((error, mailboxTree) => {
          if (error) {
            imap.end();
            reject(error);
          } else {
            const mailboxes = [];

            const processMailboxTree = (mailboxTree, parentMailbox = "") => {
              for (const name in mailboxTree) {
                let nameEn, nameUa, description;
                const mailbox = mailboxTree[name];

                if (name === "INBOX") {
                  nameEn = name;
                  nameUa = "Вхідні";
                  description = name;
                  mailboxes.push({
                    nameEn,
                    nameUa,
                    description,
                  });
                } else {
                  for (const namech in mailbox.children) {
                    const child = mailbox.children[namech];

                    nameEn = child.special_use_attrib.substring(1);
                    nameUa = namech;
                    description = `${name}/${namech}`;
                    const mailboxInfo = {
                      nameEn,
                      nameUa,
                      description,
                    };
                    mailboxes.push(mailboxInfo);
                  }
                }
              }
            };

            processMailboxTree(mailboxTree);

            imap.end();

            resolve(mailboxes);
          }
        });
      });

      imap.once("error", (error) => {
        imap.end();
        reject(error);
      });

      imap.connect();
    });
  }

  async allMailBox(_id) {
    return await this.getEmailList(_id);
  }
}
module.exports = new EmailService();
