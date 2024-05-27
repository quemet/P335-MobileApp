export const UserModel = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      is: {
        args: /^[^?!]+$/,
        msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
      },
      unique: {
        msg: "Ce username est déjà pris.",
      },
      notEmpty: {
        msg: "Le prénom ne peut pas être vide.",
      },
      notNull: {
        msg: "Le prénom est une propriété obligatoire",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,

      notEmpty: {
        msg: "Le prénom ne peut pas être vide.",
      },
      notNull: {
        msg: "Le prénom est une propriété obligatoire",
      },
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[^?!]+$/,
          msg: "Les caractères spéciaux comme ?! ne sont pas autorisés, à l'exception des espaces, - et _.",
        },
        notEmpty: {
          msg: "Le nom de famille ne peut pas être vide.",
        },
        notNull: {
          msg: "Le nom de famille est une propriété obligatoire",
        },
      },
    },
  });
};
