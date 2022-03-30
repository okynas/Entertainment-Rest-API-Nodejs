const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "test_db",
  "admin",
  "admin", {
    dialect: "mysql",
    host: "mysql"
  }
);

// const sequelize = new Sequelize("sqlite::memory:");
// Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: '../database.sqlite'
// });

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
    type: Sequelize.ENUM('Male', 'Female'),
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
    // type: Sequelize.ENUM('Admin', 'Moderator', 'User'),
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   isIn: [['Admin', 'Moderator', 'User']]
    // }
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
    type: Sequelize.BIGINT(15),
    primaryKey: true,
    unique: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  last_name: {
    type: Sequelize.STRING,
  },
  bio: {
    type: Sequelize.STRING,
  },
  birthdate: {
    type: Sequelize.DATE,
  }
});

const Film = sequelize.define("film", {
  id: {
    type: Sequelize.BIGINT(15),
    primaryKey: true,
    unique: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  poster: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
    // validate:{
    //   len: [2, 100]
    // }
  },
  releasedate: {
    type: Sequelize.DATE,
    // validate:{
    //   isAfter: "1900-01-01",
    // }
  },
  trailer: {
    type: Sequelize.STRING
  }
});

const Show = sequelize.define("show", {
  id: {
    type: Sequelize.BIGINT(15),
    primaryKey: true,
    unique: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  poster: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
    // validate:{
    //   len: [2, 100]
    // }
  },
  releasedate: {
    type: Sequelize.DATE,
    // validate:{
    //   isAfter: "1900-01-01",
    // }
  },
  trailer: {
    type: Sequelize.STRING
  }
});


const Language = sequelize.define("language", {
  id: {
    type: Sequelize.BIGINT(15),
    primaryKey: true,
    autoincrement: true
  },
  language: {
    type: Sequelize.STRING
  }
});

const Genre = sequelize.define("genre", {
  id: {
    type: Sequelize.BIGINT(15),
    primaryKey: true,
  },
  genre: {
    type: Sequelize.STRING
  }
});

const Film_has_actors = sequelize.define("film_has_actors", {
  actorId: {
    type: Sequelize.BIGINT(15),
    references: {
      model: Actor,
      key: 'id'
    }
  },
  filmId:{
    type: Sequelize.BIGINT(15),
    references: {
      model: Film,
      key: 'id'
    }
  },
  role: {
      type: Sequelize.STRING
  }
});

const Film_has_genre = sequelize.define("film_has_genre", {
  filmId:{
    type: Sequelize.BIGINT(15),
    references: {
      model: Film,
      key: 'id'
    }
  },
  genreId:{
    type: Sequelize.BIGINT(15),
    references: {
      model: Genre,
      key: 'id'
    }
  },
});

const Show_has_actors = sequelize.define("show_has_actors", {
  actorId: {
    allowNull: false,
    type: Sequelize.BIGINT(15),
    references: {
      model: Actor,
      key: 'id'
    }
  },
  showId:{
    allowNull: false,
    type: Sequelize.BIGINT(15),
    references: {
      model: Film,
      key: 'id'
    }
  },
  role: {
      type: Sequelize.STRING
  }
});

const Show_has_genre = sequelize.define("show_has_genre", {
  showId:{
    type: Sequelize.BIGINT(15),
    references: {
      model: Show,
      key: 'id'
    }
  },
  genreId:{
    type: Sequelize.BIGINT(15),
    references: {
      model: Genre,
      key: 'id'
    }
  },
});

const Season = sequelize.define("seasons", {
  id: {
    type: Sequelize.BIGINT(15),
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
    type: Sequelize.BIGINT(15),
    references: {
      model: Show,
      key: 'id'
    }
  }
});

const Episode = sequelize.define("episodes", {
  id: {
    type: Sequelize.BIGINT(15),
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
  length: {
    type: Sequelize.INTEGER
  },
  seasonId: {
    type: Sequelize.BIGINT(15),
    references: {
      model: Season,
      key: 'id'
    }
  },
  showId: {
    type: Sequelize.BIGINT(15),
    references: {
      model: Show,
      key: 'id'
    }
  }
});

// ======== >= <= ========
//        RELATIONS
// ======== >= <= ========

// FILM
Film.belongsToMany(Actor, { as: 'Actors', through: {model: Film_has_actors, unique: false}, foreignKey: 'filmId', constraints: false});
Actor.belongsToMany(Film, { as: 'Film', through: {model: Film_has_actors, unique: false}, foreignKey: 'actorId', constraints: false});

Film.belongsToMany(Genre, { as: 'Genre', through: {model: Film_has_genre, unique: false}, foreignKey: 'filmId', constraints: false});
Genre.belongsToMany(Film, { as: 'Film', through: {model: Film_has_genre, unique: false}, foreignKey: 'genreId', constraints: false});

Film.belongsTo(Language, {foreignKey: "languageId", as: "language"});
Language.hasMany(Film, {as: "filmLanguage"});

// SHOW
Show.belongsToMany(Actor, { as: 'Actors', through: {model: Show_has_actors, unique: false}, foreignKey: 'showId', constraints: false});
Actor.belongsToMany(Show, { as: 'Show', through: {model: Show_has_actors, unique: false}, foreignKey: 'actorId', constraints: false});

Show.belongsToMany(Genre, { as: 'Genre', through: {model: Show_has_genre, unique: false}, foreignKey: 'showId', constraints: false});
Genre.belongsToMany(Show, { as: 'Show', through: {model: Show_has_genre, unique: false}, foreignKey: 'genreId', constraints: false});

Show.belongsTo(Language, {foreignKey: "languageId", as: "language"});
Language.hasMany(Show, {as: "showLanguage"});

Season.belongsTo(Show, {foreignKey: "showId", as: "shows"});
Show.hasMany(Season, {as: 'seasons'});

Episode.belongsTo(Season, {foreignKey: "seasonId", as: "seasons"});
Season.hasMany(Episode, {as: 'episodes'});

sequelize.sync({fouce: true})
.then( () => {
  console.log("Database & tables created!")
});

module.exports = {
  sequelize,
  User,
  Role,
  Actor,
  Language,
  Film_has_actors,
  Film_has_genre,
  Genre,
  Film,
  Show,
  Show_has_actors,
  Show_has_genre,
  Season,
  Episode
};