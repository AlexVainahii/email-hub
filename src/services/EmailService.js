const CryptoJS = require("crypto-js");
const helpers = require("@helpers");
const { ImapEmail, User } = require("@models");
const { ImapFlow } = require("imapflow");
const nodemailer = require("nodemailer");

const { simpleParser } = require("mailparser");

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
    const { email, pass, addressPass } = obj;
    const imapEmail = await ImapEmail.findOne({ email });
    helpers.CheckByError(imapEmail, 409, "Provided email already exists");

    const encryptedPassword = this.encrypt(pass);
    const encryptedAddressPassword = this.encrypt(addressPass);
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
      addressPass: encryptedAddressPassword,
      mailboxes: [...listboxes.listMailBox],
    });

    return mailBoxImap;
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
      ImapEmail.findByIdAndUpdate(_id, { $set: { mailboxes: list } });
    }
    return list.filter((item) => item.path !== "[Gmail]");
  }

  async getListFromBox(client, path, status, itemPerPage, page, uid = 0) {
    if (path === "[Gmail]")
      return {
        listEmail: [],
        countMail: null,
        countMailUnseen: null,
      };
    console.log("uid :>> ", uid);
    const lock = await client.getMailboxLock(path);
    const list = await client.search({ seen: false });
    const listMail = [];
    try {
      console.log("status :>> ", status);
      for await (const message of client.fetch(
        uid === 0
          ? `${
              status.messages - (itemPerPage * page + 1) < 1
                ? 1
                : status.messages - itemPerPage * page + 1
            }:${status.messages - itemPerPage * (page - 1)}`
          : `${uid}:*`,
        { envelope: true }
      )) {
        console.log("message :>> ", message);
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

  async deleteBoxImap(_id, userId) {
    const imapEmail = await ImapEmail.findById(_id);
    helpers.CheckByError(
      imapEmail.owner._id.toString() !== userId.toString(),
      404
    );
    const result = await ImapEmail.findByIdAndRemove(_id);
    helpers.CheckByError(!result, 404);
    return result;
  }

  async editBoxImap(id, userId, body) {
    const imapEmail = await ImapEmail.findById(id);
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
      pass: pass ? this.encrypt(pass) : ImapEmail.pass,
      mailboxes: listboxes.length
        ? [...listboxes.listMailBox]
        : ImapEmail.mailboxes,
    };
    console.log("ne :>> ", newImapEmail);
    const result = await ImapEmail.findByIdAndUpdate(id, newImapEmail, {
      new: true,
    });
    helpers.CheckByError(!result, 404);
    return result;
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
    console.log("listEmailObj :>> ", listEmailObj);
    await client.logout();
    await client.close();
    if (page === "1") {
      await ImapEmail.updateOne(
        { _id: imapModel._id },
        {
          $set: {
            "mailboxes.$[mb].countMail": listEmailObj.countMail,
            "mailboxes.$[mb].countMailUnseen": listEmailObj.countMailUnseen,
            "mailboxes.$[mb].mailList":
              listEmailObj.listEmail.length > 100
                ? listEmailObj.listEmail.slice(0, 100)
                : listEmailObj.listEmail,
          },
        },
        {
          arrayFilters: [{ "mb.path": path }],
        }
      );
    }

    return listEmailObj;
  }

  async getMailOne({ id, path, uid }) {
    const imapModel = await ImapEmail.findById(id);

    const imapConfig = this.createImapConfig(imapModel);

    const client = new ImapFlow(imapConfig);
    try {
      // Встановлення з'єднання
      await client.connect();

      await client.mailboxOpen(path);

      // Завантаження вмісту повідомлення
      const { source } = await client.fetchOne(uid, { source: true });
      const mailObject = await simpleParser(source);
      const htmlContent = mailObject.html;
      console.log(htmlContent);
      // Обробка або виведення вмісту повідомлення
      return { htmlContent: htmlContent };
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Завершення роботи з IMAP-сервером
      await client.logout();
    }
  }

  async getEmailListSearch({ _id, path, search }) {
    const imapModel = await ImapEmail.findOne({ _id });
    helpers.CheckByError(!imapModel, 404, "Imap settings not found");

    const imapConfig = this.createImapConfig(imapModel);
    const client = new ImapFlow(imapConfig);
    await client.connect();

    await client.mailboxOpen(path);

    const lock = await client.getMailboxLock(path);
    const searchResults = await client.search({
      or: [
        { subject: search },
        { body: search },
        { from: search },
        { to: search },
      ],
    });
    const listMail = [];
    try {
      const list = await client.search({
        seq: searchResults.join(","),
        seen: false,
      });
      console.log("list :>> ", list);
      for await (const message of client.fetch(searchResults.join(","), {
        envelope: true,
      })) {
        console.log("message :>> ", message);
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
    await client.logout();
    await client.close();

    return {
      listEmail: listMail.sort((a, b) => b.id - a.id),
    };
  }

  async sendMailNew(obj) {
    const { _id, recipient, subject, text } = obj;
    const imapEmail = await ImapEmail.findById(_id);

    const transporter = nodemailer.createTransport({
      host: imapEmail.smtpHost,
      port: 465,
      secure: true,

      auth: {
        user: imapEmail.email,
        pass: this.decrypt(imapEmail.pass),
      },
    });

    const mailOptions = {
      from: imapEmail.email,
      to: recipient,
      subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("info :>> ", info);
    return info;
  }

  async moveMails(obj) {
    const { _id, fromPath, toPath, mailList } = obj;
    const imapEmail = await ImapEmail.findById(_id);
    const imapConfig = this.createImapConfig(imapEmail);
    const client = new ImapFlow(imapConfig);
    await client.connect();
    await client.mailboxOpen(fromPath);
    console.log("object :>> ");
    // move all messages to a mailbox called "Trash" (must exist)
    const result = await client.messageMove(mailList.join(","), toPath);
    console.log("Moved %s messages", result);
    await client.logout();
    await client.close();

    return { newMailList: mailList };
  }

  async deleteMails(obj) {
    const { _id, path, mailList } = obj;
    const imapEmail = await ImapEmail.findById(_id);
    const imapConfig = this.createImapConfig(imapEmail);
    const client = new ImapFlow(imapConfig);
    await client.connect();
    await client.mailboxOpen(path);

    const result = await client.messageDelete(mailList.join(","));
    console.log("delete %s messages", result);
    await client.logout();
    await client.close();

    return { newMailList: mailList };
  }

  async flagsMails(obj) {
    const { _id, path, mailList, seen } = obj;
    const imapEmail = await ImapEmail.findById(_id);
    const imapConfig = this.createImapConfig(imapEmail);
    const client = new ImapFlow(imapConfig);
    await client.connect();
    await client.mailboxOpen(path);
    console.log("path,seen :>> ", path, seen);
    const result = seen
      ? await client.messageFlagsRemove(mailList.join(","), ["\\Seen"])
      : await client.messageFlagsSet(mailList.join(","), ["\\Seen"]);
    console.log("flags %s messages", result);
    await client.logout();
    await client.close();

    return { newMailList: mailList };
  }

  async getNewEmailList({ _id, path, page, uid }) {
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
      itemPerPage,
      page,
      uid
    );
    await client.logout();
    await client.close();
    if (page === "1") {
      await ImapEmail.updateOne(
        { _id: imapModel._id },
        {
          $set: {
            "mailboxes.$[mb].countMail": listEmailObj.countMail,
            "mailboxes.$[mb].countMailUnseen": listEmailObj.countMailUnseen,
            "mailboxes.$[mb].mailList":
              listEmailObj.listEmail.length > 100
                ? listEmailObj.listEmail.slice(0, 100)
                : listEmailObj.listEmail,
          },
        },
        {
          arrayFilters: [{ "mb.path": path }],
        }
      );
    }

    return listEmailObj;
  }
}
module.exports = new EmailService();
