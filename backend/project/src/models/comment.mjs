export const CommentModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le prénom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le prénom est une propriété obligatoire",
          },
        },
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          isFloat: {
            msg: "La note doit être un nombre comme 4,0.",
          },
          notEmpty: {
            msg: "La note ne peut pas être vide",
          },
          notNull: {
            msg: "La note est une propriété obligatoire",
          },
        },
      },
      book: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );
};
