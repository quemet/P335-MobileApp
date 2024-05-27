import express from "express";
import { Editor } from "../db/sequelize.mjs";
import { Book } from "../db/sequelize.mjs";
import { sucess } from "./helper.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";

const editorsRouter = express();

/**
 * @swagger
 * /api/editors/:
 *  get:
 *    tags: [Edirors]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve all editors.
 *    description: Retrieve all editorss. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: All editors
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
 *                      description: The editor ID.
 *                      example: 1
 *                    nameEdit:
 *                      type: string
 *                      description: The editor's name
 *                      example: Kana
 */
editorsRouter.get("/", auth, (req, res) => {
  if (req.query.nameEdit) {
    if (req.query.nameEdit.length < 2) {
      const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
      return res.status(400).json({ message });
    }
    let limit = 3;
    if (req.query.limit) {
      limit = parseInt(req.query.limit, 10);
    }
    return Editor.findAll({
      where: { note: { [Op.like]: `%${req.query.editor}%` } },
      order: ["nameEdit"],
      limit: limit,
    }).then((editors) => {
      const message = `Il y a ${editors.count} éditeur qui correspondant au treme de la recherche`;
      res.json(sucess(message, editors));
    });
  }
  Editor.findAll({ order: ["id"] })
    .then((editors) => {
      const message = "La liste des éditeurs a bien été récupérée. ";
      res.json(sucess(message, editors));
    })
    .catch((error) => {
      const message =
        "La liste des éditeurs n'a pas été récupérée. Merci de réessayer dans quelque instants.";
      res.status(500).json({ message, data: error });
    });
});

/**
 * @swagger
 * /api/editors/:id:
 *  get:
 *    tags: [Editors]
 *    security :
 *      - bearerAuth: []
 *    summary: Retrieve one editor.
 *    description: Retrieve one editor. Can be used to populate a select HTML tag.
 *    responses:
 *      200:
 *        description: One Editor
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
 *                      description: The editor ID.
 *                      example: 1
 *                    nameEdit:
 *                      type: string
 *                      description: The editor's name
 *                      example: Kana
 */
editorsRouter.get("/:id", auth, (req, res) => {
  Editor.findByPk(req.params.id)
    .then((editor) => {
      if (editor === null) {
        const message =
          "L'éditeur demandé n'existe pas. Merci de réessayer avec une autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `L'éditeur dont l'id vaut ${editor.id} a bien été récupérée`;
      res.json(sucess(message, editor));
    })
    .catch((error) => {
      const message =
        "L'éditeur n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

editorsRouter.get("/:id/books", auth, async (req, res) => {
  const editorId = req.params.id;
  Editor.findByPk(editorId).then((editor) => {
    Book.findAll({
      where: { editor: { [Op.eq]: editor.id } },
    }).then((books) => {
      const message = `L'editeur du livre ${editor.nameEdit}`;
      res.json({ message, editor: editor, book: books });
    });
  });
});

editorsRouter.post("/", auth, (req, res) => {
  Editor.create(req.body)
    .then((createdEditor) => {
      const message = `L' éditeur ${createdEditor.nameEdit} a bien été crée !`;
      res.json(sucess(message, createdEditor));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "L'éditeur n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

editorsRouter.put("/:id", auth, (req, res) => {
  const editorId = req.params.id;
  Editor.update(req.body, { where: { id: editorId } })
    .then((_) => {
      return Editor.findByPk(editorId).then((updateEditor) => {
        if (updateEditor === null) {
          const message =
            "L'éditeur n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `L'éditeur ${updateEditor.nameEdit} a bien été modifié`;
        res.json(sucess(message, updateEditor));
      });
    })
    .catch((error) => {
      const message =
        "L'éditeur n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

editorsRouter.delete("/:id", auth, (req, res) => {
  Editor.findByPk(req.params.id)
    .then((deleteEditor) => {
      if (deleteEditor == null) {
        const message =
          "L'éditeur demandé n'existe pas. Merci de réessayer avec un autre identifiant";
        return res.status(404).json({ message });
      }
      return Editor.destroy({
        where: { id: deleteEditor.id },
      }).then((_) => {
        const message = `L'éditeur ${deleteEditor.nameEdit} a bien été supprimé`;
        res.json(sucess(message, deleteEditor));
      });
    })
    .catch((error) => {
      const message =
        "L'éditeur n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

export { editorsRouter };
