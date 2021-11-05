const express = require("express");
const router = express.Router();
const db = require("../models/index");
const User = db.sequelize.models.User;

/////////////////////////////////////////////////////////////////////GET

router.get("/:id", async (req, res) => {
  try {
    const { firstName, lastName, email } = await User.findOne({
      where: { userId: req.params.id },
    });

    const response = { firstName, lastName, email };

    res.send(response);
  } catch (e) {
    res.status(403).send({ message: e.message });
  }
});

/////////////////////////////////////////////////////////////////////PUT

router.put("/:id", async (req, res) => {
  try {
    const response = await User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      {
        where: { userId: req.params.id },
      }
    );
    res.send(response);
  } catch (e) {
    res.status(403).send({ message: e.message });
  }
});

/////////////////////////////////////////////////////////////////////DELETE
//Borrado logico, paranoid configurado en models

router.delete("/:id", async (req, res) => {
  try {
    let query = await User.findOne({
      where: { userId: req.params.id },
    });

    if (!query) {
      //Si no encuentra el usuario no existe
      throw new Error(
        "El usuario que intenta eliminar no existe en la base de datos"
      );
    }
    const response = await User.destroy({
      where: { userId: req.params.id },
    });
    res.send(response);
  } catch (e) {
    res.status(403).send({ message: e.message });
  }
});

module.exports = router;
