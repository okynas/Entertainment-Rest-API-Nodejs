const Sequelize = require("sequelize");

// const sequelize = new Sequelize(
//   "test_db",
//   "admin",
//   "admin", {
//     dialect: "mysql",
//     host: "mysql"
//   }
// );

// const sequelize = new Sequelize("sqlite::memory:");
// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite'
});

sequelize
  .authenticate()
  .then( () => console.log("Connection established successfully") )
  .catch( err => console.error("Unable to connect to database: ", err) );

// ==================================
//    CREATING AUTHENTICATION
// ==================================

const User = sequelize.define("user_details", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoincrement: true,
    unique: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 40],
    }
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [5, 40],
    }
  },
  gender: {
    type: Sequelize.ENUM('Male', 'Frmale'),
    allowNull: false,
    validate: {
      isIn: [['Male', 'Female']]
    }

  },
  password: {
    type: Sequelize.STRING,
    validate: {
      min: 8,
      max: 50
    }
  }
})

const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true,
    unique: true
  },
  name: {
    type: Sequelize.ENUM('Admin', 'Moderator', 'User'),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['Admin', 'Moderator', 'User']]
    }
  },
  level: {
    type: Sequelize.INTEGER,
    validate:{
      min: 1,
      max: 3
    }
  }
});

Role.hasMany(User, {
  as: "users"
});

User.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role"
});

// ==================================
//    CREATING ENTERTAINMENT
// ==================================

const Actor = sequelize.define("actor", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true,
    unique: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: Sequelize.STRING,
    validate:{
      len: [2, 100]
    }
  },
  birthdate: {
    type: Sequelize.DATE,
    validate:{
      isAfter: "1900-01-01",
    }
  }
});

const Entertainment = sequelize.define("entertainment", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true,
    unique: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  poster: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.STRING,
    validate:{
      len: [2, 100]
    }
  },
  releasedate: {
    type: Sequelize.DATE,
    validate:{
      isAfter: "1900-01-01",
    }
  },
  trailer: {
    type: Sequelize.STRING
  }
});

const Language = sequelize.define("language", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true
  },
  language: {
    type: Sequelize.STRING
  }
});

const Genre = sequelize.define("genre", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true
  },
  genre: {
    type: Sequelize.STRING
  }
});

const Entertainmens_has_actors = sequelize.define("entertainmens_has_actors", {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  role: {
      type: Sequelize.STRING
  }
});

// User.belongsToMany(Role, { as: 'Roles', through: { model: UserRole, unique: false }, foreignKey: 'user_id' });

Entertainment.belongsToMany(Actor, { as: 'Actors', through: {model: Entertainmens_has_actors, unique: false}, foreignKey: 'actor_id'});
Actor.belongsToMany(Entertainment, { as: 'Entertainments', through: {model: Entertainmens_has_actors, unique: false}, foreignKey: 'entertainment_id'});

Entertainment.belongsTo(Language, {
  foreignKey: "languageId",
  as: "language"
});

Language.hasMany(Entertainment, {as: "entertainmentsL"});

Entertainment.belongsTo(Genre, {
  foreignKey: "genreId",
  as: "genre"
});

Genre.hasMany(Entertainment, {as: "entertainmentsG"});

// USE FOR TESTING, AND INITIALIZATION
// try {

// }
// catch(err) {
//   console.error(err, "Cant create test-data")
// }

sequelize.sync({fouce: true})
.then( () => {
  // Role.create({
  //   "id": 1,
  //   "name": "User",
  //   "level": 1
  // });
  // Role.create({
  //   "id": 2,
  //   "name": "Moderator",
  //   "level": 2
  // });
  // Role.create({
  //   "id": 3,
  //   "name": "Admin",
  //   "level": 3
  // });

  // Actor.create({
  //   "id": 1,
  //   "first_name": "Stian",
  //   "last_name": "Martinsen",
  //   "bio": "HI' im me 🔥",
  //   "birthdate": Date.now()
  // });

  // User.create({
  //   "username": "admin",
  //   "email": "admin@gmail.com",
  //   "first_name": "stian",
  //   "last_name": "martinsen",
  //   "gender": "Male",
  //   // "password_in_plane_text": "admin",
  //   "password": "d8da308ccd0cf4c331521fc8f8771507e65e9981de1959e0c76e035291024b1e6b18b9623f751acb470e2b38506066e216a5259f530817674f19f24501ca10342536df7bc27901001890b87e429007d6e5e4a937776d44145a9df54631fde19a6aa5baf9c9fe",
  //   "createdAt": Date.now(),
  //   "updatedAt": Date.now(),
  //   "roleId": 3
  // });
  // Language.create({
  //   "id": 1,
  //   "language": "English"
  // })

  // Genre.create({
  //   "id": 1,
  //   "genre": "Action"
  // })

  // Entertainment.create({
  //   "id": 1,
  //   "title": "Game of Thrones",
  //   "poster": "POSTER",
  //   "description": "A very good show",
  //   "releasedate": Date.now(),
  //   "trailer": "https://www.google.com",
  //   "languageId": 1,
  //   "genreId": 1,
  // });


  // Entertainmens_has_actors.create({
  //   "id": 1,
  //   "entertainment_id": 1,
  //   "actor_id": 1,
  //   "role": "Jon Snow"
  // })

  console.log("Database & tables created!")
});

module.exports = {sequelize, User, Role, Actor, Entertainment, Language, Entertainmens_has_actors, Genre};