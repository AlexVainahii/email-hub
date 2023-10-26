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
  const { _id: owner } = req.user;
  console.log("343 :>> ");
  EmailService.getEmailList(owner)
    .then(({ emailList }) => {
      console.log("Список електронних листів:");

      res.json({ data: emailList, status: 200 });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.json({ error, status: 500 });
    });
};

module.exports = { getEmails };
