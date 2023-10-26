const { EmailService } = require("@services");
const getAllBox = async (req, res) => {
  const { _id: owner } = req.user;

  const partData = await EmailService.allMailBox(owner);

  res.status(201).json({ data: partData, status: 200 });
};

module.exports = { getAllBox };
