const { EmailService } = require("@services");

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
