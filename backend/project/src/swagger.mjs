import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API self-service-machine",
      version: "1.0.0",
      description:
        "API REST permettant de gérer l'application self-service-machine",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Author: {
          type: "object",
          required: ["firstname", "lastname", "created"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de l'auteur.",
            },
            firstname: {
              type: "string",
              description: "Le prénom de l'auteur.",
            },
            lastname: {
              type: "string",
              description: "Le nom de famille de l'auteur.",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout de l'auteur.",
            },
          },
        },
        Book: {
          type: "object",
          required: [
            "title",
            "extrait",
            "resume",
            "year",
            "editor",
            "image",
            "created",
          ],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique du livre",
            },
            title: {
              type: "string",
              description: "Le titre du livre",
            },
            extrait: {
              type: "string",
              description: "l'extratit du livre",
            },
            resume: {
              type: "string",
              description: "Le resume du livre",
            },
            year: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de la publication du livre.",
            },
            editor: {
              type: "string",
              description: "L'éditeur du livre",
            },
            image: {
              type: "string",
              description: "L'url vers l'image du livre",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout du livre.",
            },
          },
        },
        Category: {
          type: "object",
          required: ["name", "created"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de la catégorie",
            },
            name: {
              type: "string",
              description: "Le nom de la catégorie",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout de la catégorie.",
            },
          },
        },
        Comment: {
          type: "object",
          required: ["comment", "note", "created"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de la catégorie",
            },
            comment: {
              type: "string",
              description: "Un commentaires sur le livre",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout du commentaire.",
            },
          },
        },
        Editor: {
          type: "object",
          required: ["nameEdit", "created"],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de l' éditeur",
            },
            nameEdit: {
              type: "string",
              description: "Le nom de l'éditeur",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout de l'éditeur.",
            },
          },
        },
        User: {
          type: "object",
          required: [
            "username",
            "password",
            "firstname",
            "lastname",
            "created",
          ],
          properties: {
            id: {
              type: "integer",
              description: "L'identifiant unique de l'utilisateur",
            },
            username: {
              type: "string",
              description: "Le nom d'utilisateur",
            },
            password: {
              type: "string",
              description: "Le mot de passe de l'utilisateur",
            },
            firstname: {
              type: "string",
              description: "Le prénom de l'utilisateur",
            },
            lastname: {
              type: "string",
              description: "Le nom de famille de l'utilisateur",
            },
            created: {
              type: "string",
              format: "date-time",
              description: "La date et l'heure de l'ajout de l'éditeur.",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.mjs"], // Chemins vers vos fichiers de route
};
const swaggerSpec = swaggerJSDoc(options);
export { swaggerSpec };
