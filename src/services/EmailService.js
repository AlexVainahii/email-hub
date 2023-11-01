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

  async getListFromBox(client, path, status, itemPerPage, page) {
    if (path === "[Gmail]")
      return {
        listEmail: [],
        countMail: null,
        countMailUnseen: null,
      };

    const lock = await client.getMailboxLock(path);
    const list = await client.search({ seen: false });
    const listMail = [];
    try {
      for await (const message of client.fetch(
        `${
          status.messages - (itemPerPage * page + 1) < 1
            ? 1
            : status.messages - itemPerPage * page + 1
        }:${status.messages - itemPerPage * (page - 1)}`,
        { envelope: true }
      )) {
        listMail.push({
          id: message.seq,
          from: message.envelope.from[0],
          date: message.envelope.date,
          subject: message.envelope.subject,
          unseen: list.includes(message.seq),
        });
      }
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }

    return {
      listEmail: listMail.sort((a, b) => b.id - a.id),
      countMail: status.messages,
      countMailUnseen: status.unseen,
    };
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
      true,
      itemPerPage
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

  async deleteBoxImap(_id, userId) {
    console.log("_id :>> ", _id);
    const imapEmail = await ImapEmail.findById(_id);
    console.log("imapEmail :>> ", imapEmail);
    helpers.CheckByError(
      imapEmail.owner._id.toString() !== userId.toString(),
      404
    );
    const result = await ImapEmail.findByIdAndRemove(_id);
    helpers.CheckByError(!result, 404);
    return result;
  }

  async editBoxImap(_id, userId, body) {
    const imapEmail = await ImapEmail.findById(_id);

    helpers.CheckByError(
      imapEmail.owner._id.toString() !== userId.toString(),
      404
    );

    const { host, port, email, user, pass, secure } = body;
    let listboxes = [];
    if (host || port || email || user || pass || secure) {
      try {
        listboxes = await this.getMailBoxes(
          this.createImapConfig({ ...body, pass: this.encrypt(pass) }),
          250
        );
      } catch (error) {
        console.error(
          "Помилка при отриманні інформації про поштові ящики:",
          error
        );
        helpers.CreateError(400, error);
      }
    }

    const newImapEmail = {
      ...body,
      pass: pass ? this.encrypt(pass) : body.pass,
      mailboxes: listboxes.length
        ? [...listboxes.listMailBox]
        : [body.mailboxes],
    };
    const result = await ImapEmail.findByIdAndUpdate(_id, newImapEmail, {
      new: true,
    });
    helpers.CheckByError(!result, 404);
    return result;
  }

  async getCreateOrUpdateCountMail(
    client,
    { mailboxes, _id },
    isUpdate = false,
    itemPerPage
  ) {
    const updatedMailboxes = mailboxes.map(async (mailbox) => {
      const status = await client.status(mailbox.path, {
        messages: true,
        unseen: true,
      });
      if (mailbox.countMail === status.messages) return mailbox;

      const { listEmail, countMail, countMailUnseen } =
        await this.getListFromBox(client, mailbox.path, status, itemPerPage, 1);

      const updatedMailbox = isUpdate
        ? {
            ...mailbox.toObject(),
            countMail,
            countMailUnseen,
            mailList: listEmail, // Оновлене значення countMail
          }
        : {
            nameEn:
              mailbox.specialUse?.slice(1) ||
              Array.from(mailbox.flags)[1].slice(1),
            nameUa: this.convertUa(mailbox.name),
            path: mailbox.path,
            countMail,
            countMailUnseen,
            mailList: listEmail,
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

    const listMailBox = await this.getCreateOrUpdateCountMail(
      client,
      {
        mailboxes: list,
      },
      false,
      250
    );
    console.log("listMailBox:>> ", listMailBox);
    await client.logout();
    await client.close();

    return {
      listMailBox,
    };
  }

  async getEmailList({ _id, path, page }) {
    const imapModel = await ImapEmail.findOne({ _id });

    const { itemPerPage } = await User.findById({ _id: imapModel.owner });

    helpers.CheckByError(!imapModel, 404, "Imap settings not found");

    const imapConfig = this.createImapConfig(imapModel);
    const client = new ImapFlow(imapConfig);
    await client.connect();
    const status = await client.status(path, {
      messages: true,
      unseen: true,
    });
    const listEmailObj = await this.getListFromBox(
      client,
      path,
      status,
      itemPerPage * 10,
      page
    );
    await client.logout();
    await client.close();
    return listEmailObj;
  }
}
module.exports = new EmailService();
