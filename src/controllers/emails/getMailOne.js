const { EmailService } = require("@services");

const getMailOne = async (req, res) => {
  const { id } = req.params;

  EmailService.getMailOne({ id, ...req.query })
    .then((mail) => {
      console.log("Список електронних листів:");

      res.json({
        mail,
        mailInfo: { ...req.query },

        status: 200,
      });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.status(500).json({ error, status: 500 });
    });
};

module.exports = { getMailOne };
