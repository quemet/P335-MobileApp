import express from "express";
import { Category, Book } from "../db/sequelize.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const categorysRouter = express();

/**
 * @swagger
 * /api/categorys/:
 *  get:
 *    tags: [Categorys]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve all categories.
 *    description: Retrieve all categories. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All categories
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
 *                      description: The category ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The category's name
 *                      example: shōnen
 *                    description:
 *                      type: string
 *                      description: The category's description
 *                      example: Le shōnen manga (少年漫画?, litt. « bande dessinée pour jeune garçon ») est une ligne éditoriale de manga qui vise un public composé d'adolescents, allant des dernières années de l'école primaire (environ 10-12 ans) jusqu'aux lycéens (environ 15-18 ans). Il est souvent opposé au shōjo manga (少女漫画?) qui se veut être une ligne éditoriale pour un public féminin du même âge
 */
categorysRouter.get("/", auth, (req, res) => {
  if (req.query.name) {
    if (req.query.name.length < 4) {
      const message = `Le terme de la recherche doit contenir au moins 4 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 6;
    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
    }
    return Category.findAll({
      where: { name: { [Op.like]: `%${req.query.name}%` } },
      order: ["name"],
      limit: limit,
    }).then((Category) => {
      const message = `Il y a ${Category.count} categorie qui correspondant au thème de la recherche`;
      res.json(sucess(message, Category));
    });
  }
  Category.findAll({ order: ["name"] })
    .then((Category) => {
      const message = "La liste des categorie a bien été récupérée. ";
      res.json(sucess(message, Category));
    })
    .catch((error) => {
      const message =
        "La liste des categorie n'a pas été récupérée. Merci de réessayer dans quelque instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/categorys/:id:
 *  get:
 *    tags: [Categorys]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve one category.
 *    description: Retrieve one category. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One Category
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
 *                      description: The category ID.
 *                      example: 1
 *                    name:
 *                      type: string
 *                      description: The category's name
 *                      example: shōnen
 *                    description:
 *                      type: string
 *                      description: The category's description
 *                      example: Le shōnen manga (少年漫画?, litt. « bande dessinée pour jeune garçon ») est une ligne éditoriale de manga qui vise un public composé d'adolescents, allant des dernières années de l'école primaire (environ 10-12 ans) jusqu'aux lycéens (environ 15-18 ans). Il est souvent opposé au shōjo manga (少女漫画?) qui se veut être une ligne éditoriale pour un public féminin du même âge
 */
categorysRouter.get("/:id", auth, (req, res) => {
  Category.findByPk(req.params.id)
    .then((Category) => {
      if (Category === null) {
        const message =
          "Le categorie demandé n'existe pas. Merci de réessayer avec une autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `Le categorie dont l'id vaut ${Category.id} a bien été récupérée`;
      res.json(sucess(message, Category));
    })
    .catch((error) => {
      const message =
        "Le categorie n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

// Cette route permet de récupérer tous les livres de la catégorie ayant pour id
categorysRouter.get("/:id/book", auth, async (req, res) => {
  const categoryId = req.params.id;
  Category.findByPk(categoryId).then((category) => {
    Book.findAll({
      where: { category: { [Op.eq]: category.id } },
    }).then((books) => {
      const message = `Categorie du livre : ${category.name}`;
      res.json({ message, category: category, book: books });
    });
  });
});

categorysRouter.post("/", auth, (req, res) => {
  Category.create(req.body)
    .then((createdCategory) => {
      const message = `Le categorie ${createdCategory.name} a bien été crée !`;
      res.json(sucess(message, createdCategory));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "Le categorie n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

categorysRouter.put("/:id", auth, (req, res) => {
  const BookId = req.params.id;
  Category.update(req.body, { where: { id: BookId } })
    .then((_) => {
      return Category.findByPk(BookId).then((updateCategory) => {
        if (updateCategory === null) {
          const message =
            "Le categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `Le categorie ${updateCategory.name} a bien été modifié`;
        res.json(sucess(message, updateCategory));
      });
    })
    .catch((error) => {
      const message =
        "Le categorie n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

categorysRouter.delete("/:id", auth, (req, res) => {
  Category.findByPk(req.params.id)
    .then((deleteCategory) => {
      if (deleteCategory == null) {
        const message =
          "Le categorie demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return Category.destroy({
        where: { id: deleteCategory.id },
      }).then((_) => {
        const message = `Le categorie ${deleteCategory.name} a bien été supprimé`;
        res.json(sucess(message, deleteCategory));
      });
    })
    .catch((error) => {
      const message =
        "Le categorie n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { categorysRouter };
