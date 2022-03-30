--
-- Database: `samplevideo_db`
--

-- ------------------------
-- -- For å endre tilgang:

-- ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'admin';
-- flush privileges;

-- ------------------------

-- CREATE TABLE IF NOT EXISTS `roles` (
--   `id` INTEGER , 
--   `name` VARCHAR(255), 
--   `createdAt` DATETIME NOT NULL, 
--   `updatedAt` DATETIME NOT NULL, 
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB;

-- CREATE TABLE IF NOT EXISTS `user_details` (
--   `id` INTEGER AUTO_INCREMENT, 
--   `username` VARCHAR(255), 
--   `email` VARCHAR(255), 
--   `first_name` VARCHAR(50), 
--   `last_name` VARCHAR(50), 
--   `gender` VARCHAR(10), 
--   `password` VARCHAR(255), 
--   `status` TINYINT, 
--   `createdAt` DATETIME NOT NULL, 
--   `updatedAt` DATETIME NOT NULL, 
--   `roleId` INTEGER, 
--   PRIMARY KEY (`id`), 
--   FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
-- ) ENGINE=InnoDB;

-- -- ALTER TABLE `user_details`
-- -- CHANGE `id` `id` int(11) NOT NULL AUTO_INCREMENT FIRST;


-- INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES 
-- (1, 'guest', now(), now()), 
-- (2, 'user', now(), now()),
-- (3, 'admin', now(), now()),
-- (4, 'owner', now(), now());


-- INSERT INTO `user_details` (`id`, `username`, `email`, `first_name`, `last_name`, `gender`, `password`, `status`, `createdAt`,`updatedAt`, `roleId`) VALUES
-- (1001, 'stianmar', 'admin@dockerpersonalwebsite.com', 'stian', 'martinsen', 'Male', 'password', 1, now(), now(), 4);

-- SELECT * FROM user_details INNER JOIN roles ON user_details.roleId=roles.id;

-- CREATE TABLE favorite_colors (
--   name VARCHAR(20),
--   color VARCHAR(10)
-- );

-- INSERT INTO favorite_colors
--   (name, color)
-- VALUES
--   ('Lancelot', 'blue'),
--   ('Galahad', 'yellow');