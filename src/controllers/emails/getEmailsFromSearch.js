const { EmailService } = require("@services");

const getEmailsFromSearch = async (req, res) => {
  console.log("req.query :>> ", req.query);
  EmailService.getEmailListSearch(req.query)
    .then((fullEmails) => {
      console.log("Список електронних листів:");

      res.status(200).json({
        searchResults: fullEmails,
        ...req.query,
        status: 200,
      });
    })
    .catch((error) => {
      console.error("Помилка при отриманні списку електронних листів:", error);
      res.status(500).json({ error, status: 500 });
    });
};

module.exports = { getEmailsFromSearch };
