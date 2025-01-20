const { EmailService } = require("@services");
const getEmailBox = async (req, res) => {
  const imapConfig = {
    auth: { user: "sanjaksms@gmail.com", pass: "raidisperkjmnssw" },
    host: "imap.gmail.com",
    port: 993,
    secure: true,
  };
  try {
    const mailboxTree = await EmailService.getMailboxes(imapConfig, 30);
    console.log("mailboxTree :>> ", mailboxTree);
    res.json({ data: mailboxTree, status: 200 });
  } catch (error) {
    console.error("Помилка при отриманні інформації про поштові ящики:", error);
    res.status(500).json({ error: "Помилка при отриманні поштових ящиків" });
  }
};

module.exports = { getEmailBox };
