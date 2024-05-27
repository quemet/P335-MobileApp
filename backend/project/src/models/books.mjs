export const BookModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Ce nom est déjà pris.",
        },
        validate: {
          is: {
            args: /^[^?!]+$/,
            msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
          },
          notEmpty: {
            msg: "Le nom ne peut pas être vide.",
          },
          notNull: {
            msg: "Le nom est une propriété obligatoire",
          },
        },
      },
      creator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      epub: {
        type: DataTypes.BLOB("medium"),
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updateAt: false,
    }
  );

  Book.associate = () => {
    Book.hasmany(note, { foreignKey: "note" });
    Book.hasmany(comment, { foreignKey: "comment" });
  };

  return Book;
};
