const Imap = require("node-imap");

class EmailService {
  async getEmailList(obj, countMailForPage = 1) {
    const imap = new Imap(obj);
    const emailList = [];
    let countPage = 0;
    function openInbox(cb) {
      imap.openBox("INBOX", true, cb);
    }

    await new Promise((resolve, reject) => {
      imap.once("ready", function () {
        openInbox(function (err, box) {
          if (err) return reject(err);
          imap.search(["ALL"], (err, uids) => {
            if (err) return reject(err);
            countPage = Math.floor(uids.length / countMailForPage);
            console.log("countPage :>> ", countPage);
            const start = Math.max(0, uids.length - 50) + 1;
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

                  // if (info.which === "TEXT") {
                  //   // Декодування тексту, якщо це текстова частина повідомлення
                  //   const encodedText = buffer;
                  //   const decodedText = quotedPrintable.decode(encodedText);
                  //   emailData.text = decodedText;
                  // }
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
        });
      });

      imap.once("error", function (err) {
        reject(err);
      });

      imap.once("end", function () {
        console.log("Connection ended");
      });

      imap.connect();
    });

    return { emailList, countPage };
  }
}
0.0;

module.exports = new EmailService();
