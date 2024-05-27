import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import { EPub } from "epub2";

//import des models
import { UserModel } from "../models/user.mjs";
import { BookModel } from "../models/books.mjs";
import { AuthorModel } from "../models/author.mjs";
import { CategoryModel } from "../models/category.mjs";
import { CommentModel } from "../models/comment.mjs";
import { EditorModel } from "../models/editor.mjs";

//import des mocks
import { users } from "./mock-users.mjs";
import { books } from "./mock-books.mjs";

import bcrypt from "bcrypt";

const sequelize = new Sequelize("db_ouvrage", "root", "root", {
  host: "localhost",
  port: "6033",
  dialect: "mysql",
  logging: false,
});

export const Book = BookModel(sequelize, DataTypes);
export const User = UserModel(sequelize, DataTypes);
export const Author = AuthorModel(sequelize, DataTypes);
export const Category = CategoryModel(sequelize, DataTypes);
export const Comment = CommentModel(sequelize, DataTypes);
export const Editor = EditorModel(sequelize, DataTypes);

let initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    importBooks();
    importUsers();
    console.log("La base de données db_ouvrage a bien été synchronisée");
  });
};

const importUsers = () => {
  users.map((user) => {
    bcrypt.hash(user.password, 10).then((hash) => {
      User.create({
        username: user.username,
        password: hash,
        firstname: user.firstname,
        lastname: user.lastname,
      }).then((user) => console.log(user.toJSON()));
    });
  });
};

const importBooks = () => {
  books.map(async (book) => {
    let ep = await EPub.createAsync(book.path);
    Book.create({
      id: book.id,
      title: ep.metadata.title,
      creator: ep.metadata.creator,
      epub: fs.readFileSync(book.path),
      date: ep.metadata.date,
    });
  });
};

export { sequelize, initDb };
