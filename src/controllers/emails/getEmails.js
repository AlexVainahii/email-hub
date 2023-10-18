const { EmailService } = require("@services");

// // Функція для декодування тексту з QUOTED-PRINTABLE
// function decodeQuotedPrintable(text) {
//   return decodeURIComponent(
//     text.replace(/=([0-9A-F]{2})/g, (match, p1) =>
//       String.fromCharCode(parseInt(p1, 16))
//     )
//   );
// }

// // Функція для отримання тексту з частини повідомлення
// function getTextFromPart(partData) {
//   console.log("partData :>> ", partData);
//   if (partData.encoding === "QUOTED-PRINTABLE") {
//     return decodeQuotedPrintable(partData.textContent);
//   }
//   return partData.textContent;
// }
const getEmails = async (req, res) => {
  const imapConfig = {
    user: "sanjaksms@gmail.com",
    password: "biybapkalynbjgej",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  };
  console.log("343 :>> ");
  EmailService.getEmailList(imapConfig, 50)
    .then(({ emailList }) => {
      console.log("Список електронних листів:");
      console.log(emailList);
      const message = emailList[0];

      // Виводимо заголовок повідомлення
      console.log("Заголовок:", message.headers.subject[0]);

      // Виводимо відправника
      console.log("Від:", message.headers.from[0]);

      // Виводимо дату повідомлення
      console.log("Дата:", message.headers.date[0]);

      // Виводимо текст повідомлення
      console.log("Текст повідомлення:");
      console.log(message.attributes.struct[1][0]); // Перший текстовий варіант

      // Отримуємо інші дані про повідомлення, якщо потрібно
      const uid = message.attributes.uid;
      const messageId = message.attributes["x-gm-msgid"];
      const threadId = message.attributes["x-gm-thrid"];
      const modseq = message.attributes.modseq;

      // Виводимо інші дані
      console.log("UID:", uid);
      console.log("Message ID:", messageId);
      console.log("Thread ID:", threadId);
      console.log("Modification Sequence:", modseq);

      res.json({ data: emailList, status: 200 });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.json({ error, status: 500 });
    });
};

module.exports = { getEmails };
