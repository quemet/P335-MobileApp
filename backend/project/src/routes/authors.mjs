import express from "express";
import { Author, Book } from "../db/sequelize.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const authorsRouter = express();

/**
 * @swagger
 * /api/authors/:
 *  get:
 *    tags: [Authors]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve all authors.
 *    description: Retrieve all authors. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All authors
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The author ID.
 *                      example: 1
 *                    firstname:
 *                      type: string
 *                      description: The author's firstname
 *                      example: Jules
 *                    lastname:
 *                      type: string
 *                      description: The author's lastname
 *                      example: Verne
 */

authorsRouter.get("/", auth, (req, res) => {
  if (req.query.lastname) {
    if (req.query.lastname.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
    }
    return Author.findAll({
      where: { note: { [Op.like]: `%${req.query.lastname}%` } },
      order: ["lastname"],
      limit: limit,
    }).then((authors) => {
      const message = `Il y a ${authors.count} auteur qui correspondant au treme de la recherche`;
      res.json(sucess(message, authors));
    });
  }
  Author.findAll({ order: ["lastname"] })
    .then((authors) => {
      const message = "La liste des auteur a bien été récupérée. ";
      res.json(sucess(message, authors));
    })
    .catch((error) => {
      const message =
        "La liste des auteur n'a pas été récupérée. Merci de réessayer dans quelque instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/authors/:id:
 *  get:
 *    tags: [Authors]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve one authors.
 *    description: Retrieve one authors. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One Author
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The author ID.
 *                      example: 1
 *                    firstname:
 *                      type: string
 *                      description: The author's firstname
 *                      example: Jules
 *                    lastname:
 *                      type: number
 *                      description: The author's lastname
 *                      example: Verne
 */
authorsRouter.get("/:id", auth, (req, res) => {
  Author.findByPk(req.params.id)
    .then((author) => {
      if (author === null) {
        const message =
          "L'auteur demandé n'existe pas. Merci de réessayer avec une autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `L'auteur dont l'id vaut ${author.id} a bien été récupérée`;
      res.json(sucess(message, author));
    })
    .catch((error) => {
      const message =
        "L'auteur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

authorsRouter.get("/:id/book", auth, async (req, res) => {
  const authorId = req.params.id;
  Author.findByPk(authorId).then((author) => {
    Book.findAll({
      where: { author: { [Op.eq]: author.id } },
    }).then((books) => {
      const message = `Voici tout les livres de l'auteur : ${author.firstname} ${author.lastname}`;
      res.json({ message, author: author, books: books });
    });
  });
});

/**
 * @swagger
 * /api/products/:id:
 *  post:
 *    tags: [Authors]
 *    security :
 *      - bearerAuth: []
 *    summary: Add a author into the db.
 *    description: Add a author into the db.
 *    responses:
 *      200:
 *        description: One Author.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  propreties:
 *                    id:
 *                      type: integer
 *                      description: The author ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The author's firstname
 *                      example: Jules
 *                    price:
 *                      type: number
 *                      description: The author's lastname
 *                      example: Verne
 */
authorsRouter.post("/", auth, (req, res) => {
  Author.create(req.body)
    .then((createdAuthor) => {
      const message = `L'auteur' ${createdAuthor.lastname} a bien été crée !`;
      res.json(sucess(message, createdAuthor));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "L'auteur n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/products/:id
 * put:
 *  tags: [Authors]
 *  security:
 *    - bearerAuth: []
 *  summary: Change a author.
 *  description: Change a author. That cahnged also in the database.
 *  responses:
 *    200:
 *
 */
authorsRouter.put("/:id", auth, (req, res) => {
  const authorId = req.params.id;
  Author.update(req.body, { where: { id: authorId } })
    .then((_) => {
      return Author.findByPk(authorId).then((updateAuthor) => {
        if (updateAuthor === null) {
          const message =
            "L'auteur n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `L'auteur ${updateAuthor.lastname} a bien été modifié`;
        res.json(sucess(message, updateAuthor));
      });
    })
    .catch((error) => {
      const message =
        "L'auteur' n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

authorsRouter.delete("/:id", auth, (req, res) => {
  Author.findByPk(req.params.id)
    .then((deleteAuthor) => {
      if (deleteAuthor == null) {
        const message =
          "L'auteur' demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return Author.destroy({
        where: { id: deleteAuthor.id },
      }).then((_) => {
        const message = `L'auteur' ${deleteAuthor.lastname} a bien été supprimé`;
        res.json(sucess(message, deleteAuthor));
      });
    })
    .catch((error) => {
      const message =
        "L'auteur' n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { authorsRouter };
