
drop database if exists test_db;
create database if not exists `test_db`;
use `test_db`;

CREATE TABLE IF NOT EXISTS `roles` (`id` INTEGER UNIQUE , `name` VARCHAR(255) NOT NULL UNIQUE, `level` INTEGER, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `user_details` (`id` INTEGER UNIQUE , `username` VARCHAR(255) NOT NULL UNIQUE, `email` VARCHAR(255) NOT NULL UNIQUE, `first_name` VARCHAR(255) NOT NULL, `last_name` VARCHAR(255) NOT NULL, `gender` ENUM('Male', 'Frmale') NOT NULL, `password` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `roleId` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `actors` (`id` BIGINT(15) UNIQUE , `first_name` VARCHAR(255) NOT NULL, `last_name` VARCHAR(255), `bio` VARCHAR(255), `birthdate` DATETIME, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `languages` (`id` BIGINT(15) , `language` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `films` (`id` BIGINT(15) , `title` VARCHAR(255) NOT NULL UNIQUE, `poster` VARCHAR(255), `description` VARCHAR(255), `releasedate` DATETIME, `trailer` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `languageId` BIGINT(15), PRIMARY KEY (`id`), FOREIGN KEY (`languageId`) REFERENCES `languages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `shows` (`id` BIGINT(15) UNIQUE , `title` VARCHAR(255) NOT NULL UNIQUE, `poster` VARCHAR(255), `description` VARCHAR(255), `releasedate` DATETIME, `trailer` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, `languageId` BIGINT(15), PRIMARY KEY (`id`), FOREIGN KEY (`languageId`) REFERENCES `languages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `genres` (`id` BIGINT(15) , `genre` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `film_has_actors` (`actorId` BIGINT(15) , `filmId` BIGINT(15) , `role` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`actorId`, `filmId`), FOREIGN KEY (`actorId`) REFERENCES `actors` (`id`), FOREIGN KEY (`filmId`) REFERENCES `films` (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `film_has_genres` (`filmId` BIGINT(15) , `genreId` BIGINT(15) , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`filmId`, `genreId`), FOREIGN KEY (`filmId`) REFERENCES `films` (`id`), FOREIGN KEY (`genreId`) REFERENCES `genres` (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `show_has_actors` (`actorId` BIGINT(15) NOT NULL , `showId` BIGINT(15) NOT NULL , `role` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`actorId`, `showId`), FOREIGN KEY (`actorId`) REFERENCES `actors` (`id`), FOREIGN KEY (`showId`) REFERENCES `films` (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `show_has_genres` (`showId` BIGINT(15) , `genreId` BIGINT(15) , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`showId`, `genreId`), FOREIGN KEY (`showId`) REFERENCES `shows` (`id`), FOREIGN KEY (`genreId`) REFERENCES `genres` (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `seasons` (`id` BIGINT(15) , `title` VARCHAR(255), `releasedate` DATETIME, `description` VARCHAR(255), `showId` BIGINT(15), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`showId`) REFERENCES `shows` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `episodes` (`id` BIGINT(15) , `title` VARCHAR(255), `releasedate` DATETIME, `description` VARCHAR(255), `length` INTEGER, `seasonId` BIGINT(15), `showId` BIGINT(15), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`seasonId`) REFERENCES `seasons` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE, FOREIGN KEY (`showId`) REFERENCES `shows` (`id`)) ENGINE=InnoDB;

INSERT INTO `roles` (`id`,`name`,`level`,`createdAt`,`updatedAt`) 
VALUES (1,"User",1,now(),now()),
(2,"Moderator",2,now(),now()),
(3,"Admin",3,now(),now());

INSERT IGNORE INTO `actors` (`id`,`first_name`,`last_name`,`bio`,`birthdate`,`createdAt`,`updatedAt`) 
VALUES (2,"Leo","Di Caprio","I am me","10.02.2000",now(),now());

INSERT IGNORE INTO `languages` (`id`,`language`,`createdAt`,`updatedAt`) 
VALUES (1,"English",now(),now());

INSERT IGNORE INTO `genres` (`id`,`genre`,`createdAt`,`updatedAt`)
VALUES (1,"Action",now(),now()), 
(2,"Comedy",now(),now());

INSERT IGNORE INTO `films` (`id`,`title`,`poster`,`description`,`releasedate`,`trailer`,`createdAt`,`updatedAt`,`languageId`) 
VALUES (1,"Fast and Furious 5","https://www.google.com","A film about cars",now(),"https://www.google.com",now(),now(),1);
INSERT IGNORE INTO `shows` (`id`,`title`,`poster`,`description`,`releasedate`,`trailer`,`createdAt`,`updatedAt`,`languageId`) 
VALUES (1,"Game of thrones","https://www.google.com","A show about adventure",now(),"https://www.google.com",now(),now(),1);
INSERT IGNORE INTO `seasons` (`id`,`title`,`releasedate`,`description`,`showId`,`createdAt`,`updatedAt`) 
VALUES (1,"Seasion 1 - GOT",now(),"First season about GOT",1,now(),now());
INSERT IGNORE INTO `episodes` (`id`,`title`,`releasedate`,`description`,`length`,`seasonId`,`showId`,`createdAt`,`updatedAt`) 
VALUES (1,"E1S1 - GOT",now(),"First epostode Season 1 - GOT",340,1,1,now(),now());


INSERT IGNORE INTO `film_has_actors` (`actorId`,`filmId`,`role`,`createdAt`,`updatedAt`) 
VALUES (2,1,"Jon Snow",now(),now());

INSERT IGNORE INTO `film_has_genres` (`filmId`,`genreId`,`createdAt`,`updatedAt`) 
VALUES (1,1,now(),now());

INSERT IGNORE INTO `show_has_actors` (`actorId`,`showId`,`role`,`createdAt`,`updatedAt`) 
VALUES (2,1,"Dom",now(),now());


INSERT IGNORE INTO `show_has_genres` (`showId`,`genreId`,`createdAt`,`updatedAt`) 
VALUES (1,1,now(),now());

INSERT IGNORE INTO `user_details` (`id`, `username`, `email`, `first_name`, `last_name`,`gender`, `password`,`createdAt`, `updatedAt`, `roleId`) 
values(1, "admin", "admin@gmail.com","stian", "martinsen","Male","d8da308ccd0cf4c331521fc8f8771507e65e9981de1959e0c76e035291024b1e6b18b9623f751acb470e2b38506066e216a5259f530817674f19f24501ca10342536df7bc27901001890b87e429007d6e5e4a937776d44145a9df54631fde19a6aa5baf9c9fe", now(), now(), 3);
