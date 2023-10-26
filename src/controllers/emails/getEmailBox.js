const { EmailService } = require("@services");
const getEmailBox = async (req, res) => {
  const imapConfig = {
    user: "sanjaksms@gmail.com",
    password: "tkzgzsufzflckgny",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  };
  try {
    const mailboxTree = await EmailService.getBox(imapConfig);
    res.json({ data: mailboxTree, status: 200 });
  } catch (error) {
    console.error("Помилка при отриманні інформації про поштові ящики:", error);
    res.status(500).json({ error: "Помилка при отриманні поштових ящиків" });
  }
};

module.exports = { getEmailBox };
