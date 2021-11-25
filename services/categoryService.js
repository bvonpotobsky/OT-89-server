const db = require("../models/index");
const categories = db.sequelize.models.category;

const update = async (id, dataBody) => {
  const data = {
    name: dataBody.name,
    description: dataBody.description,
  };
  const byEntry = await getByentryId(id);
  try {
    return await categories.update(data, {
      returning: true,
      where: {
        id: id,
      },
    });
  } catch (e) {
    res.status(404).json({ message: "Cant make this request" });
  }
};

module.exports = {
  update,
};
