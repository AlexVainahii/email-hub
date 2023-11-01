const { EmailService } = require("@services");

const editBoxImap = async (req, res) => {
  const { id } = req.params;

  const result = await EmailService.editBoxImap(id, req.user._id, req.body);

  res.json({ data: result, status: 200 });
};

module.exports = { editBoxImap };
