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
  },
  birthdate: {
    type: Sequelize.DATE,
    validate:{
      isAfter: "1900-01-01",
    }
  }
}, {
  timestamps: false
});

const Film = sequelize.define("film", {
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
}, {
  timestamps: false
});

const Show = sequelize.define("show", {
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
}, {
  timestamps: false
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
}, {
  timestamps: false
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
}, {
  timestamps: false
});

const Film_has_actors = sequelize.define("film_has_actors", {
  actorId: {
    type: Sequelize.INTEGER,
    references: {
      model: Actor,
      key: 'id'
    }
  },
  filmId:{
    type: Sequelize.INTEGER,
    references: {
      model: Film,
      key: 'id'
    }
  },
  role: {
      type: Sequelize.STRING
  }
}, {
  timestamps: false
});

const Film_has_genre = sequelize.define("film_has_genre", {
  filmId:{
    type: Sequelize.INTEGER,
    references: {
      model: Film,
      key: 'id'
    }
  },
  genreId:{
    type: Sequelize.INTEGER,
    references: {
      model: Genre,
      key: 'id'
    }
  },
}, {
  timestamps: false
});

const Show_has_actors = sequelize.define("show_has_actors", {
  actorId: {
    type: Sequelize.INTEGER,
    references: {
      model: Actor,
      key: 'id'
    }
  },
  showId:{
    type: Sequelize.INTEGER,
    references: {
      model: Film,
      key: 'id'
    }
  },
  role: {
      type: Sequelize.STRING
  }
}, {
  timestamps: false
});

const Show_has_genre = sequelize.define("show_has_genre", {
  showId:{
    type: Sequelize.INTEGER,
    references: {
      model: Film,
      key: 'id'
    }
  },
  genreId:{
    type: Sequelize.INTEGER,
    references: {
      model: Genre,
      key: 'id'
    }
  },
}, {
  timestamps: false
});

const Season = sequelize.define("seasons", {
  seasonNumber: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  releasedate: {
    type: Sequelize.DATE
  },
  description: {
    type: Sequelize.STRING
  },
  showId: {
    type: Sequelize.INTEGER,
    references: {
      model: Show,
      key: 'id'
    }
  }
}, {
  timestamps: false
});

// ======== >= <= ========
//        RELATIONS
// ======== >= <= ========

// FILM
Film.belongsToMany(Actor, { as: 'Actors', through: {model: Film_has_actors, unique: false}, foreignKey: 'actorId'});
Actor.belongsToMany(Film, { as: 'Film', through: {model: Film_has_actors, unique: false}, foreignKey: 'filmId'});

Film.belongsToMany(Genre, { as: 'Genre', through: {model: Film_has_genre, unique: false}, foreignKey: 'genreId'});
Genre.belongsToMany(Film, { as: 'Film', through: {model: Film_has_genre, unique: false}, foreignKey: 'filmId'});

Film.belongsTo(Language, {foreignKey: "languageId", as: "language"});
Language.hasMany(Film, {as: "filmLanguage"});

// SHOW
Show.belongsToMany(Actor, { as: 'Actors', through: {model: Show_has_actors, unique: false}, foreignKey: 'actorId'});
Actor.belongsToMany(Show, { as: 'Show', through: {model: Show_has_actors, unique: false}, foreignKey: 'showId'});

Show.belongsToMany(Genre, { as: 'Genre', through: {model: Show_has_genre, unique: false}, foreignKey: 'genreId'});
Genre.belongsToMany(Show, { as: 'Show', through: {model: Show_has_genre, unique: false}, foreignKey: 'showId'});

Show.belongsTo(Language, {foreignKey: "languageId", as: "language"});
Language.hasMany(Show, {as: "showLanguage"});

Season.belongsTo(Show, {foreignKey: "showId", as: "shows"});
Show.hasMany(Season, {as: 'seasonInShow'});

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
  // });

  // Genre.create({
  //   "id": 2,
  //   "genre": "Comedy"
  // });

  // Film.create({
  //   "id": 1,
  //   "title": "Game of Thrones",
  //   "poster": "POSTER",
  //   "description": "A very good show",
  //   "releasedate": Date.now(),
  //   "trailer": "https://www.google.com",
  //   "languageId": 1,
  //   "genreId": 1,
  // });

  // Show.create({
  //   "id": 1,
  //   "title": "Game of Thrones",
  //   "poster": "POSTER",
  //   "description": "A very good show",
  //   "releasedate": Date.now(),
  //   "trailer": "https://www.google.com",
  //   "languageId": 1,
  //   "genreId": 1,
  // });

  // Season.create({
  //   seasonNumber: 1,
  //   title: "Season 1",
  //   releasedate: Date.now(),
  //   description: "beskrivelse",
  //   showId: 1,
  // });

  // Film_has_actors.create({
  //   "filmId": 1,
  //   "actorId": 1,
  //   "role": "Jon Snow"
  // });

  // Film_has_genre.create({
  //   "filmId": 1,
  //   "genreId": 1,
  // });

  // Show_has_actors.create({
  //   "showId": 1,
  //   "actorId": 1,
  //   "role": "Jon Snow"
  // });

  // Show_has_genre.create({
  //   "showId": 1,
  //   "genreId": 1,
  // });

  console.log("Database & tables created!")
});

module.exports = {
  sequelize,
  User,
  Role,
  Actor,
  Language,
  // Film_has_actors,
  // Film_has_genre,
  Genre,
  Film,
  Show,
  // Show_has_actors,
  // Show_has_genre,
  Season
};