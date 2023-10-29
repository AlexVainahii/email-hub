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

  // async getEmailList(_id, boxName = false) {
  //   const user = await User.findById({ _id });

  //   const listImap = await ImapEmail.find({ owner: user._id });
  //   console.log("listImap  :>> ", listImap);
  //   const imapEmail = boxName
  //     ? listImap.find((item) => item.titleBox === boxName)
  //     : listImap[0];
  //   console.log("imapEmail :>> ", imapEmail);
  //   const imapConfig = this.createImapConfig(imapEmail);
  //   const imap = new Imap(imapConfig);
  //   const emailList = [];
  //   let countPage = 0;
  //   if (imapEmail.mailboxes.length === 0)
  //     imapEmail.mailboxes.push(await this.getBox(imapConfig));

  //   function openInbox(box, cb) {
  //     console.log("box :>> ", box);
  //     imap.openBox("Sent", true, cb);
  //   }
  //   await new Promise((resolve, reject) => {
  //     imap.once("ready", function () {
  //       openInbox(
  //         boxName || imapEmail.mailboxes[0].description || "INBOX",
  //         function (err, box) {
  //           if (err) return reject(err);
  //           const f = imap.seq.fetch(`1:*`, {
  //             bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE TEXT)",

  //             struct: true,
  //           });
  //           console.log("f :>> ", f);
  //           imap.search(["UNSEEN"], (err, uids) => {
  //             if (err) return reject(err);
  //             console.log("hello :>> ", err);
  //             countPage = Math.floor(uids.length / user.itemPerPage);

  //             const start =
  //               uids.length - user.itemPerPage <= 0
  //                 ? 1
  //                 : uids.length - user.itemPerPage;
  //             const end = uids.length;
  //             const f = imap.seq.fetch(`${start}:${end}`, {
  //               bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE TEXT)",

  //               struct: true,
  //             });

  //             f.on("message", function (msg, seqno) {
  //               const emailData = {};

  //               msg.on("body", function (stream, info) {
  //                 let buffer = "";
  //                 stream.on("data", function (chunk) {
  //                   buffer += chunk.toString("utf8");
  //                 });
  //                 stream.once("end", function () {
  //                   const headers = Imap.parseHeader(buffer);
  //                   emailData.headers = headers;
  //                 });
  //               });

  //               msg.once("attributes", function (attrs) {
  //                 emailData.attributes = attrs;
  //               });

  //               msg.once("end", function () {
  //                 emailList.push(emailData);
  //               });
  //             });

  //             f.once("error", function (err) {
  //               reject(err);
  //             });

  //             f.once("end", function () {
  //               resolve();
  //             });
  //           });
  //         }
  //       );
  //     });

  //     imap.once("error", function (err) {
  //       reject(err);
  //     });

  //     imap.once("end", function () {
  //       console.log("Connection ended");
  //     });

  //     imap.connect();
  //   });

  //   return {
  //     emailList: [
  //       ...emailList.sort(
  //         (firstE, secondE) => secondE.attributes.date - firstE.attributes.date
  //       ),
  //     ],
  //     countPage,
  //     listImap,
  //     boxName,
  //   };
  // }

  // getBox(obj) {
  //   console.log("obj :>> ", obj);
  //   return new Promise((resolve, reject) => {
  //     const imap = new Imap(obj);

  //     imap.once("ready", () => {
  //       imap.getBoxes((error, mailboxTree) => {
  //         if (error) {
  //           imap.end();
  //           reject(error);
  //         } else {
  //           const mailboxes = [];
  //           console.log("mailboxTree :>> ", mailboxTree);
  //           const convertMaiLBox = (mailboxTree, host) => {
  //             const processMailboxTree = (mailboxTree, parentMailbox = "") => {
  //               for (const name in mailboxTree) {
  //                 let nameEn, nameUa, description;
  //                 const mailbox = mailboxTree[name];
  //                 if (name === "INBOX") {
  //                   nameEn = name;
  //                   nameUa = "Вхідні";
  //                   description = name;
  //                   mailboxes.push({
  //                     nameEn,
  //                     nameUa,
  //                     description,
  //                   });
  //                 } else {
  //                   for (const namech in mailbox.children) {
  //                     const child = mailbox.children[namech];

  //                     nameEn = child.special_use_attrib.substring(1);
  //                     nameUa = namech;
  //                     description = `${name}/${namech}`;
  //                     const mailboxInfo = {
  //                       nameEn,
  //                       nameUa,
  //                       description,
  //                     };
  //                     mailboxes.push(mailboxInfo);
  //                   }
  //                 }
  //               }
  //             };
  //             const otherGmail = (mailboxTree) => {
  //

  //               let nameEn, nameUa, description;
  //               for (const name in mailboxTree) {
  //                 nameEn = name;
  //                 nameUa = convertUa(name);
  //                 description = name;
  //                 const mailboxInfo = {
  //                   nameEn,
  //                   nameUa,
  //                   description,
  //                 };
  //                 mailboxes.push(mailboxInfo);
  //               }
  //             };

  //             if (host === "imap.gmail.com") {
  //               processMailboxTree(mailboxTree);
  //             } else {
  //               otherGmail(mailboxTree);
  //             }
  //           };
  //           convertMaiLBox(mailboxTree, obj.host);

  //           imap.end();

  //           resolve(mailboxes);
  //         }
  //       });
  //     });

  //     imap.once("error", (error) => {
  //       imap.end();
  //       reject(error);
  //     });

  //     imap.connect();
  //   });
  // }

  async allMailBox(_id, itemPerPage, email = false) {
    const listImap = email
      ? await ImapEmail.find({ email: email })
      : await ImapEmail.find({ owner: _id });

    if (listImap.length === 0) return { listImap, isMailImap: false };
    const imapEmail = listImap[0];

    const { mailboxes } = imapEmail;
    console.log("mailboxes :>> ", mailboxes);
    const imapConfig = this.createImapConfig(imapEmail);

    const client = new ImapFlow(imapConfig);

    await client.connect();

    const updatedMailboxes = mailboxes.map(async (mailbox) => {
      const status = await client.status(mailbox.path, { messages: true });
      console.log("mailbox :>> ", mailbox);
      const updatedMailbox = {
        ...mailbox.toObject(),
        countMail: status.messages, // Оновлене значення countMail
      };
      console.log("updatedMailbox :>> ", updatedMailbox);
      return updatedMailbox;
    });

    // Очікування, поки всі обіцянки завершаться
    const listMailBox = await Promise.all(updatedMailboxes);
    const lock = await client.getMailboxLock(listMailBox[0].path);

    const listMail = [];
    try {
      for await (const message of client.fetch(
        `${
          listMailBox[0].countMail - itemPerPage < 1
            ? 1
            : listMailBox[0].countMail - itemPerPage
        }:${listMailBox[0].countMail}`,
        { envelope: true }
      )) {
        listMail.push({
          id: message.uid,
          from: message.envelope.from[1],
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

    if (email)
      return {
        listMailBox:
          imapConfig.host === "imap.gmail.com"
            ? listMailBox.filter((box) => box.path !== "[Gmail]")
            : listMailBox,
        listMail,
        isMailImap: true,
      };
    else
      return {
        listImap,
        listMailBox:
          imapConfig.host === "imap.gmail.com"
            ? listMailBox.filter((box) => box.path !== "[Gmail]")
            : listMailBox,
        listMail,
        isMailImap: true,
      };
  }

  async addMailBox(obj, itemPerPage) {
    const { email, pass } = obj;
    const imapEmail = await ImapEmail.findOne({ email });
    helpers.CheckByError(imapEmail, 409, "Provided email already exists");

    const encryptedPassword = this.encrypt(pass);
    let listboxes = [];
    try {
      listboxes = await this.getMailboxes(
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
    const mailBox = await ImapEmail.create({
      ...obj,
      pass: encryptedPassword,
      mailboxes: [...listboxes.listMailBox],
    });

    return mailBox;
  }
  async getMailboxes(imapConfig, itemPerPage = 30) {
    function convertUa(name) {
      const translations = {
        Sent: "Відправлені",
        Drafts: "Чернетки",
        Spam: "Спам",
        Trash: "Смітник",
      };
      return translations[name] || name;
    }

    const client = new ImapFlow(imapConfig);

    await client.connect();

    const list = await client.list();

    const listMailBox = await Promise.all(
      list.map(async (mailbox) => {
        const status = await client.status(mailbox.path, { messages: true });
        console.log("mailbox :>> ", mailbox);
        return {
          nameEn:
            mailbox.specialUse?.slice(1) ||
            Array.from(mailbox.flags)[1].slice(1),
          nameUa:
            imapConfig.host === "imap.gmail.com"
              ? mailbox.name
              : convertUa(mailbox.name),
          path: mailbox.path,
          countMail: status.messages,
        };
      })
    );
    const lock = await client.getMailboxLock(listMailBox[0].path);
    const listMail = [];
    try {
      // fetch latest message source
      // client.mailbox includes information about currently selected mailbox
      // "exists" value is also the largest sequence number available in the mailbox

      // const message = await client.fetchOne(client.mailbox.exists, {
      //   source: true,
      // });
      // console.log(message.source.toString());

      // list subjects for all messages
      // uid value is always included in FETCH response, envelope strings are in unicode.

      for await (const message of client.fetch(
        `${
          listMailBox[0].countMail - itemPerPage < 1
            ? 1
            : listMailBox[0].countMail - itemPerPage
        }:${listMailBox[0].countMail}`,
        { envelope: true }
      )) {
        console.log(`${message.uid}: ${message.envelope.subject}`);
        listMail.push({
          id: message.uid,
          tema: { ...message, modseq: Number(message.modseq) },
        });
      }
    } finally {
      // Make sure lock is released, otherwise next `getMailboxLock()` never returns
      lock.release();
    }

    await client.logout();
    await client.close();

    return {
      listMailBox:
        imapConfig.host === "imap.gmail.com"
          ? listMailBox.filter((box) => box.path !== "[Gmail]")
          : listMailBox,
      listMail,
    };

    // try {
    // fetch latest message source
    // client.mailbox includes information about currently selected mailbox
    // "exists" value is also the largest sequence number available in the mailbox

    // const message = await client.fetchOne(client.mailbox.exists, {
    //   source: true,
    // });
    // console.log(message.source.toString());

    // list subjects for all messages
    // uid value is always included in FETCH response, envelope strings are in unicode.
    //   for await (const message of client.fetch("1", { envelope: true })) {
    //     console.log(`${message.uid}: ${message.envelope.subject}`);
    //     listMail.push({
    //       id: message.uid,
    //       tema: { ...message, modseq: Number(message.modseq) },
    //     });
    //     console.log(message);
    //   }
    // } finally {
    //   // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    //   lock.release();
    // }

    // log out and close connection
  }
}
module.exports = new EmailService();
