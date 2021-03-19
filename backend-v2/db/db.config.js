const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "test_db", 
  "admin", 
  "admin", {
    dialect: "mysql",
    host: "mysql"
  }
);

sequelize
  .authenticate()
  .then( () => console.log("Connection established successfully") )
  .catch( err => console.error("Unable to connect to database: ", err) );

const User = sequelize.define("user_details", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoincrement: true
  },
  username: Sequelize.STRING,
  email: Sequelize.STRING,
  first_name: Sequelize.STRING(50),
  last_name: Sequelize.STRING(50),
  gender: Sequelize.STRING(10),
  password: Sequelize.STRING(),
  status: Sequelize.TINYINT,
})

const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  }
})

Role.hasMany(User, {as: "users"})

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role"
});

sequelize.sync({fouce: true})
.then( () => {
  console.log("Database & tables created!") 
});

module.exports = {sequelize, User, Role};