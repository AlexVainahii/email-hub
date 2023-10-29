const { EmailService } = require("@services");

const getEmailsFromBox = async (req, res) => {
  const { _id, path } = req.query;
  console.log("343 :>> ");

  EmailService.getEmailList(_id, path)
    .then((listEmail) => {
      console.log("Список електронних листів:");

      res.json({ data: listEmail, status: 200 });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.json({ error, status: 500 });
    });
};

module.exports = { getEmailsFromBox };
