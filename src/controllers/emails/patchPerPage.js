const { EmailService } = require("@services");
const helpers = require("@helpers");
const patchPerPage = async (req, res) => {
  const { _id } = req.user;
  const { itemPerPage } = req.body;
  console.log("object :>> ");
  console.log("helpers.itemsPerPageEnum:>> ", helpers.itemsPerPageEnum);
  helpers.CheckByError(
    !helpers.itemsPerPageEnum.includes(itemPerPage),
    400,
    "itemPerPagenot valid in [10,20,30,50]"
  );
  const newUserChange = await EmailService.changePerPage(_id, req.body);

  res.status(201).json({ data: newUserChange, status: 201 });
};

module.exports = { patchPerPage };
