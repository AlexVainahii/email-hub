const { EmailService } = require("@services");

const deleteBoxImap = async (req, res) => {
  const { id } = req.params;
  const result = await EmailService.deleteBoxImap(id, req.user._id);

  res.json({ data: result, status: 200 });
};

module.exports = { deleteBoxImap };
