const { EmailService } = require("@services");
const getAllBox = async (req, res) => {
  const { _id: owner, itemPerPage } = req.user;

  const partData = await EmailService.allMailBox(owner, itemPerPage);

  res.status(201).json({ data: partData, status: 200 });
};

module.exports = { getAllBox };
