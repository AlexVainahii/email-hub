const { EmailService } = require("@services");

const getEmailsFromBox = async (req, res) => {
  console.log("req.query :>> ", req.query);
  EmailService.getEmailList(req.query)
    .then((listEmail) => {
      console.log("Список електронних листів:");

      res.json({ data: { listEmail }, status: 200 });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.status(500).json({ error, status: 500 });
    });
};

module.exports = { getEmailsFromBox };
