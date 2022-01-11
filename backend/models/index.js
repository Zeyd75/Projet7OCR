const dbConfig = require("../db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.posts = require("./post.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);

db.users.hasOne(db.posts, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.posts.belongsTo(db.users);

db.users.hasOne(db.comments, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.comments.belongsTo(db.users);

db.posts.hasOne(db.comments, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
db.comments.belongsTo(db.posts);

module.exports = db;
