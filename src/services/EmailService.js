const CryptoJS = require("crypto-js");
const helpers = require("@helpers");
const { ImapEmail, User } = require("@models");
const { ImapFlow } = require("imapflow");

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
      auth: {
        user: model.email,
        pass: this.decrypt(model.pass),
      },
      host: model.host,
      port: model.port,
      secure: model.secure,
    };
  }

  async changePerPage(_id, obj) {
    const user = await User.findByIdAndUpdate(_id, obj, { new: true });

    return {
      _id: user._id,
      username: user.username,
      itemPerPage: user.itemPerPage,
    };
  }

  convertUa(name) {
    const translations = {
      INBOX: "Вхідні",
      Sent: "Відправлені",
      Drafts: "Чернетки",
      Spam: "Спам",
      Trash: "Смітник",
    };
    return translations[name] || name;
  }

  async getListFromBox(imapConfig, box, itemPerPage) {
    const client = new ImapFlow(imapConfig);

    await client.connect();

    const lock = await client.getMailboxLock(box.path);

    const listMail = [];
    try {
      for await (const message of client.fetch(
        `${box.countMail - itemPerPage < 1 ? 1 : box.countMail - itemPerPage}:${
          box.countMail
        }`,
        { envelope: true }
      )) {
        listMail.push({
          id: message.uid,
          from: message.envelope.from[0],
          date: message.envelope.date,
          subject: message.envelope.subject,
        });
      }
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }

    await client.logout();
    await client.close();
    return listMail;
  }

  async allMailBox(_id, itemPerPage, email = false) {
    const listImap = email
      ? await ImapEmail.find({ email: email })
      : await ImapEmail.find({ owner: _id });

    if (listImap.length === 0) return { listImap, isMailImap: false };

    const imapEmail = listImap[0];

    const imapConfig = this.createImapConfig(imapEmail);

    const client = new ImapFlow(imapConfig);

    await client.connect();

    const listMailBox = await this.getCreateOrUpdateCountMail(
      client,
      imapEmail,
      true
    );

    await client.logout();
    await client.close();

    if (email)
      return {
        listMailBox:
          imapConfig.host === "imap.gmail.com"
            ? listMailBox.filter((box) => box.path !== "[Gmail]")
            : listMailBox,
        isMailImap: true,
      };
    else
      return {
        listImap,
        listMailBox:
          imapConfig.host === "imap.gmail.com"
            ? listMailBox.filter((box) => box.path !== "[Gmail]")
            : listMailBox,
        isMailImap: true,
      };
  }

  async addMailBoxImap(obj, itemPerPage) {
    const { email, pass } = obj;
    const imapEmail = await ImapEmail.findOne({ email });
    helpers.CheckByError(imapEmail, 409, "Provided email already exists");

    const encryptedPassword = this.encrypt(pass);

    let listboxes = [];
    try {
      listboxes = await this.getMailBoxes(
        this.createImapConfig({ ...obj, pass: encryptedPassword }),
        itemPerPage
      );
    } catch (error) {
      console.error(
        "Помилка при отриманні інформації про поштові ящики:",
        error
      );
      helpers.CreateError(400, error);
    }

    const mailBoxImap = await ImapEmail.create({
      ...obj,
      pass: encryptedPassword,
      mailboxes: [...listboxes.listMailBox],
    });

    return mailBoxImap;
  }

  async getCreateOrUpdateCountMail(
    client,
    { mailboxes, _id },
    isUpdate = false
  ) {
    const updatedMailboxes = mailboxes.map(async (mailbox) => {
      const status = await client.status(mailbox.path, {
        messages: true,
        unseen: true,
      });

      const updatedMailbox = isUpdate
        ? {
            ...mailbox.toObject(),
            countMail: status.messages,
            countMailUnseen: status.unseen, // Оновлене значення countMail
          }
        : {
            nameEn:
              mailbox.specialUse?.slice(1) ||
              Array.from(mailbox.flags)[1].slice(1),
            nameUa: this.convertUa(mailbox.name),
            path: mailbox.path,
            countMail: status.messages,
            countMailUnseen: status.unseen,
          };

      return updatedMailbox;
    });
    const list = await Promise.all(updatedMailboxes);

    if (isUpdate) {
      await ImapEmail.findByIdAndUpdate(_id, { $set: { mailboxes: list } });
    }
    return list.filter((item) => item.path !== "[Gmail]");
  }

  async getMailBoxes(imapConfig, itemPerPage = 30) {
    const client = new ImapFlow(imapConfig);

    await client.connect();

    const list = await client.list();

    const listMailBox = await this.getCreateOrUpdateCountMail(client, {
      mailboxes: list,
    });

    await client.logout();
    await client.close();

    return {
      listMailBox,
    };
  }

  async getEmailList(_id, path) {
    const imapModel = await ImapEmail.findById(_id);

    const { itemPerPage } = await User.findById({ _id: imapModel.owner });

    console.log("itemPerPage :>> ", itemPerPage);

    const box = imapModel.mailboxes.find((item) => item.path === path);

    helpers.CheckByError(!imapModel, 404, "Imap settings not found");

    const imapConfig = this.createImapConfig(imapModel);

    const listEmail = await this.getListFromBox(imapConfig, box, itemPerPage);

    return listEmail;
  }
}
module.exports = new EmailService();
