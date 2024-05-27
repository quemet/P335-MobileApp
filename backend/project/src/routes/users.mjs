import express from "express";
import { User } from "../db/sequelize.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const usersRouter = express();

usersRouter.get("/", auth, (req, res) => {
  if (req.query.username) {
    if (req.query.username.length < 4) {
      const message = `Le terme de la recherche doit contenir au moins 4 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 6;
    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
    }
    return User.findAll({
      where: { username: { [Op.like]: `%${req.query.username}%` } },
      order: ["username"],
      limit: limit,
    }).then((Users) => {
      const message = `Il y a ${Users.count} utilisateur qui correspondant au treme de la recherche`;
      res.json(sucess(message, Users));
    });
  }
  User.findAll({ order: ["username"] })
    .then((Users) => {
      const message = "La liste des utilisateurs a bien été récupérée. ";
      res.json(sucess(message, Users));
    })
    .catch((error) => {
      const message =
        "La liste des utilisateurs n'a pas été récupérée. Merci de réessayer dans quelque instants.";
      res.status(500).json({ message, data: error });
    });
});

usersRouter.get("/:id", auth, (req, res) => {
  User.findByPk(req.params.id)
    .then((Users) => {
      if (Users === null) {
        const message =
          "Le utilisateur demandé n'existe pas. Merci de réessayer avec une autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `L'utilisateur' dont l'id vaut ${Users.id} a bien été récupérée`;
      res.json(sucess(message, Users));
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

usersRouter.post("/", auth, (req, res) => {
  User.create(req.body)
    .then((createdUser) => {
      const message = `Le utilisateur ${createdUser.username} a bien été crée !`;
      res.json(sucess(message, createdUser));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "Le utilisateur n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

usersRouter.put("/:id", auth, (req, res) => {
  const UserId = req.params.id;
  User.update(req.body, { where: { id: UserId } })
    .then((_) => {
      return User.findByPk(UserId).then((updateUser) => {
        if (updateUser === null) {
          const message =
            "Le utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `Le utilisateur ${updateUser.username} a bien été modifié`;
        res.json(sucess(message, updateUser));
      });
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

usersRouter.delete("/:id", auth, (req, res) => {
  User.findByPk(req.params.id)
    .then((deleteUser) => {
      if (deleteUser == null) {
        const message =
          "Le utilisateur demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return User.destroy({
        where: { id: deleteUser.id },
      }).then((_) => {
        const message = `Le utilisateur ${deleteUser.username} a bien été supprimé`;
        res.json(sucess(message, deleteUser));
      });
    })
    .catch((error) => {
      const message =
        "Le utilisateur n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { usersRouter };
