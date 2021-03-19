-- 
-- CREATING TABLES TO ENTERTAINMENT
-- 

CREATE TABLE IF NOT EXISTS `genre` (
  `id` INTEGER , 
  `genre` VARCHAR(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `person` (
  `id` INTEGER AUTO_INCREMENT, 
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `biography` TEXT,
  `birth_date` DATE NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `actor` (
  `person_id`INT,
  PRIMARY KEY (`person_id`),
  FOREIGN KEY (`person_id`) REFERENCES person(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `reviewer` (
  `person_id`INT,
  PRIMARY KEY (`person_id`),
  FOREIGN KEY (`person_id`) REFERENCES person(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `director` (
  `person_id`INT,
  PRIMARY KEY (`person_id`),
  FOREIGN KEY (`person_id`) REFERENCES person(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `language` (
  `id`INT AUTO_INCREMENT,
  `language` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `award` (
  `id`INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Actor_has_Award` (
  `award_id`INT,
  `actor_id` INT,
  `number_of_prices` INT NOT NULL,
  PRIMARY KEY (`award_id`, `actor_id`),
  FOREIGN KEY (`award_id`) REFERENCES award(id),
  FOREIGN KEY (`actor_id`) REFERENCES actor(person_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `entertainment` (
  `id`INT,
  `title` VARCHAR(255) NOT NULL,
  `poster` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `release_date` DATE NOT NULL,
  `trailer_link` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`) 
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Entertainment_has_Actor` (
  `entertainment_id`INT,
  `actor_id` INT,
  `role` VARCHAR(255),
  PRIMARY KEY (`entertainment_id`, `actor_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id),
  FOREIGN KEY (`actor_id`) REFERENCES actor(person_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Entertainment_has_Director` (
  `entertainment_id`INT,
  `director_id` INT,
  PRIMARY KEY (`entertainment_id`, `director_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id),
  FOREIGN KEY (`director_id`) REFERENCES director(person_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Entertainment_has_Reviewer` (
  `entertainment_id`INT,
  `review_id` INT,
  `number_of_review` INT NOT NULL,
  `score` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`entertainment_id`, `review_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id),
  FOREIGN KEY (`review_id`) REFERENCES reviewer(person_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Entertainment_has_Genre` (
  `entertainment_id`INT,
  `genre_id` INT,
  PRIMARY KEY (`entertainment_id`, `genre_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id),
  FOREIGN KEY (`genre_id`) REFERENCES genre(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `movie` (
  `entertainment_id` INT NOT NULL,
  `length` INT(3),
  PRIMARY KEY (`entertainment_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `serie` (
  `entertainment_id` INT NOT NULL,
  PRIMARY KEY (`entertainment_id`),
  FOREIGN KEY (`entertainment_id`) REFERENCES entertainment(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `season` (
  `number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `release_year` INT(4) NOT NULL,
  `description` MEDIUMTEXT NULL,
  `serie_id` INT NOT NULL,
  PRIMARY KEY (`serie_id`, `number`),
  FOREIGN KEY (`serie_id`) REFERENCES serie(entertainment_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `episode` (
  `id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `release_date` DATE NOT NULL,
  `description` MEDIUMTEXT NULL,
  `length` INT NOT NULL,
  `season_id` INT NOT NULL,
  `season_number` INT NOT NULL,
  PRIMARY KEY (`season_id`, `id`),
  FOREIGN KEY (`season_id`, `season_number`) REFERENCES season(serie_id, number)
) ENGINE=InnoDB;

-- ########################################
-- QUERYING DATA FROM ENTERTAINMENT MODEL!
-- ########################################

-- select movie from entertainment and its length:
-- SELECT * FROM entertainment INNER JOIN movie ON movie.entertainment_id = entertainment.id;

-- ########################################
-- INSERTING DATA INTO ENTERTAINMENT MODEL!
-- ########################################



INSERT IGNORE INTO `genre` (`id`, `genre`) VALUES
(1, 'Adventure'),
(2, 'Comedy'),
(3, 'Drama'),
(4, 'Thriller'),
(5, 'Romance'),
(6, 'Fantasy'),
(7, 'Animation'),
(8, 'Action'),
(9, 'Sci-Fy'),
(10, 'Crime');

INSERT IGNORE INTO `language` (`id`, `language`) VALUES
(1, 'English'),
(2, 'Norwegian'),
(3, 'Spanish'),
(4, 'German'),
(5, 'Italian'),
(6, 'Russian'),
(7, 'Swedish'),
(8, 'Chineese'),
(9, 'Indian'),
(10, 'Romanian');

INSERT IGNORE INTO `entertainment` (`id`, `title`, `poster`, `description`, `release_date`, `trailer_link`) VALUES
(1, 'Breaking Bad', 'https://m.media-amazon.com/images/M/MV5BMjhiMzgxZTctNDc1Ni00OTIxLTlhMTYtZTA3ZWFkODRkNmE2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR5,0,182,268_AL_.jpg', 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his familys future.', '2008-01-20', 'https://www.imdb.com/video/imdb/vi338798873?playlistId=tt0903747&ref_=tt_ov_vi'),
(2, 'Chernobyl', 'https://m.media-amazon.com/images/M/MV5BZGQ2YmMxZmEtYjI5OS00NzlkLTlkNTEtYWMyMzkyMzc2MDU5XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_UX182_CR0,0,182,268_AL_.jpg', 'In April 1986, an explosion at the Chernobyl nuclear power plant in the Union of Soviet Socialist Republics becomes one of the worlds worst man-made catastrophes.', '2019-05-06', 'https://www.imdb.com/video/imdb/vi3724524825?playlistId=tt7366338&ref_=tt_ov_vi'),
(3, 'Game of Thrones', 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_UY268_CR7,0,182,268_AL_.jpg', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', '2011-05-04', 'https://www.imdb.com/video/imdb/vi1509866521?playlistId=tt0944947&ref_=tt_ov_vi'),
(4, 'The Shawshank Redemption', 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '1995-1-6', 'https://www.imdb.com/video/imdb/vi3877612057?playlistId=tt0111161&ref_=tt_ov_vi'),
(5, "Barry", "https://m.media-amazon.com/images/M/MV5BMmY1NTk5N2QtYWQyOS00NjhiLWFhZmYtYWZmZGFlMjEzY2E2XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_UX182_CR0,0,182,268_AL_.jpg", "A hit man from the Midwest moves to Los Angeles and gets caught up in the city's theatre arts scene.", "2018-5-25", "https://www.imdb.com/video/imdb/vi3276978713?playlistId=tt5348176&ref_=tt_ov_vi"),
(6, "Joker", "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_UX182_CR0,0,182,268_AL_.jpg", "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.", "2019-10-4", "https://www.imdb.com/video/imdb/vi1723318041?playlistId=tt7286456&ref_=tt_ov_vi"),
(7, "Forest Gump", "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_UY268_CR1,0,182,268_AL_.jpg", "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.", "1994-9-30", "https://www.imdb.com/video/imdb/vi3567517977?playlistId=tt0109830&ref_=tt_ov_vi"),
(8, "Star Wars: Episode V - Imperiet slår tilbake", "https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX182_CR0,0,182,268_AL_.jpg", "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued by Darth Vader and a bounty hunter named Boba Fett all over the galaxy.", "1980-8-10", "https://www.imdb.com/video/imdb/vi221753881?playlistId=tt0080684&ref_=tt_ov_vi"),
(9, "The Matrix", "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_UX182_CR0,0,182,268_AL_.jpg", "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", "1999-7-9", "https://www.imdb.com/video/imdb/vi1032782617?playlistId=tt0133093&ref_=tt_ov_vi"),


INSERT IGNORE INTO `movie` (`entertainment_id`, `length`) VALUES
(4, 144),
(6, 122),
(7, 144),
(8, 124),
(9, 136);

INSERT IGNORE INTO `serie` (`entertainment_id`) VALUES
(1),
(2),
(3),
(5);


INSERT IGNORE INTO `person` (`id`, `first_name`, `last_name`, `biography`, `birth_date`) VALUES
-- GOT
(1, "Daniel", "Portman", "Daniel was born in Glasgow on 13 February 1992 and is the son of the actor Ron Donachie. Brought up in Strathbungo, Glasgow, he attended Shawlands Academy, where he was head boy, before gaining an HNC in acting at Reid Kerr Colege, Paisley. Aged sixteen he had his first role in supernatural thriller 'Outcast', starring James Nesbitt and then had ...", "1992-2-13"), 
(2, "Ben", "Crompton", "Ben Crompton was born in 1974 in Stockport, Greater Manchester, England. He is an actor and director, known for Kill List (2011), Game of Thrones (2011) and 102 Dalmatians (2000). He has been married to Liv Lorent since 2008. They have two children.", "1974-0-0"), 
(3, "Hannah", "Murray", "Hannah Murray is an English actress known for portraying Gilly in the HBO series Game of Thrones (2011) and Cassie Ainsworth in the E4 teen drama series Skins (2007), from 2007 to 2008 (and again in 2013). In 2014, Murray starred in God Help the Girl (2014). In 2015, she played Sara in the Danish film Bridgend (2015). Hannah was born in Bristol, ...", "1989-7-1"), 
(4, "Isaac", "Hempstead", "Isaac has been acting since he was age 11. Currently, he is still studying at school and balancing acting jobs. Isaac Hempstead-Wright is an English actor. Beginning his professional acting career at the age of eleven, Hempstead-Wright is best known for his role as Bran Stark on the HBO series Game of Thrones, which earned him a Young Artist Award ...", "1999-4-9"), 
(5, "Aidan", "Gillen", "Aidan Gillen is an Irish actor. He is best known for portraying Petyr 'Littlefinger' Baelish in the HBO series Game of Thrones (2011), CIA operative Bill Wilson in The Dark Knight Rises (2012), Stuart Alan Jones in the Channel 4 series Queer as Folk (1999), John Boy in the RTÉ Television series Love/Hate (2010), and Tommy Carcetti in the HBO ...", "1968-4-24"), 
(6, "Jerome", "Flynn", "Jerome Patrick Flynn (born 16 March 1963) is an English actor and singer. He is best known for his roles as Paddy Garvey of the King's Fusiliers in the ITV series Soldier Soldier, Fireman Kenny 'Rambo' Baines in the pilot of London's Burning, Bronn in the hit HBO series Game of Thrones, and Bennet Drake in Ripper Street. He and his Soldier Soldier ...", "1963-3-16"), 
(7, "Sophie", "Turner", "Sophie Belinda Jonas (née Turner; born February 21, 1996) is an English actress. Turner made her professional acting debut as Sansa Stark on the HBO fantasy television series Game of Thrones (2011) (2011-2019), which brought her international recognition and critical praise. For her performance, she has received four nominations for Screen Actors ...", "1996-2-21"), 
(8, "Peter", "Dinklage", "Peter Dinklage is an American actor. Since his breakout role in Et slags vennskap (2003), he has appeared in numerous films and theatre plays. Since 2011, Dinklage has portrayed Tyrion Lannister in the HBO series Game of Thrones (2011) . For this he won an Emmy for Outstanding Supporting Actor in a Drama Series and a Golden Globe Award for Best ...", "1969-6-11"), 
(9, "Julian", "Glover", "Julian Wyatt Glover was born on March 27, 1935 in Hampstead, London, England, to Honor Ellen Morgan (Wyatt), a BBC journalist, and Claude Gordon Glover, a BBC radio producer. He is of English, Scottish and Welsh ancestry. Primarily a classical stage actor, Glover trained at the National Youth Theatre, performed with the Royal Shakespeare Company ...", "1935-3-27"), 
(10, "Jacob", "Anderson", "Jacob Anderson was born on June 18, 1990 in London, England. He is an actor, known for Game of Thrones (2011), Overlord (2018) and 4.3.2.1. (2010).", "1990-6-18"), 
(12, "Lena", "Headey", "Lena Headey is a Bermudian-British actress. Headey is best known for her role as 'Cersei Lannister' in Game of Thrones (2011) (2011-2019) and Brødrene Grimm (2005), Possession (2002), and Resten av dagen (1993). Headey stars as 'Queen Gorgo', a heroic Spartan woman in the period film, 300 (2006), by director Zack Snyder. Headey was born in ...", "1973-10-3"), 
(11, "Kit", "Harington", "Kit Harington was born Christopher Catesby Harington in Acton, London, to Deborah Jane (Catesby), a former playwright, and David Richard Harington, a businessman. His mother named him after 16th century British playwright and poet Christopher Marlowe, whose first name was shortened to Kit, a name Harington prefers. Harington's uncle is Sir ...", "1986-12-26"), 
(13, "Rory", "McCann", "Six foot six inches tall, with brown eyes and dark hair, Rory McCann from Glasgow began his working life at the top - as a painter on the Forth Bridge in Scotland. He came to notice in a television commercial for Scotts' Porridge Oats, in which he appeared as a scantily-clad hunk in a vest and kilt and little else wandering snowbound streets but ...", "1969-4-24"), 
(14, "John", "Bradley", "John was born as John Bradley-West in 1988. Brought up in Wythenshawe, South Manchester, he attended St Paul's High School and Loreto College, Hulme before going on to Manchester Metropolitan University from where he graduated in 2010 with a B.A. degree in acting. It was via his college website that he obtained his first big television role in the...", "1988-9-15"), 
(15, "Maisie", "Williams", "Margaret Constance 'Maisie' Williams (born 15 April 1997) is an English actress. She made her professional acting debut as Arya Stark in the HBO fantasy television series Game of Thrones, for which she won the EWwy Award for Best Supporting Actress in a Drama, the Portal Award for Best Supporting Actress - Television and Best Young Actor, and the ...", "1997-4-15"), 
(16, "Gwendoline", "Christie", "Gwendoline Christie was born in Worthing, West Sussex, England and trained in dance and gymnastics as a child. She graduated from Drama Centre London with a First Class BA (Hons) in 2005 and her first job was with Declan Donellan in 'Great Expectations' at the Royal Shakespeare Company that autumn. She then went on to work in regional theatre, ...", "1978-10-28"), 
(17, "Emilia", "Clarke", "British actress Emilia Clarke was born in London and grew up in Oxfordshire, England. Her father was a theatre sound engineer and her mother is a businesswoman. Her father was working on a theatre production of 'Show Boat' and her mother took her along to the performance. This is when, at the age of 3, her passion for acting began. From 2000 to ...", "1986-10-23"), 
(18, "Conleth", "Hill", "Conleth Hill was born on November 24, 1964 in Ballycastle, County Antrim, Northern Ireland. His great work of exquisite artistic generosity, intelligence, sensation and insights both on stage and screen reflects the wide range of his unique acting qualities as a superb 'chameleon' in memorable tour-de-force transformations of charisma, subtlety ... ", "1964-11-24"), 
(19, "Nathalie", "Emmanuel", "Nathalie Emmanuel is an English actress, known for her role as Missandei on the HBO fantasy series Game of Thrones (2011) and Ramsey in Fast & Furious 7 (2015). Nathalie was born in Southend-on-Sea, Essex, England, to a father of Saint Lucian and English descent and a mother of Dominican origin. Nathalie credits her mother for the initial ...", "1989-3-2"), 
(20, "Charles", "Dance", "Charles Dance is an English actor, screenwriter, and film director. Dance typically plays assertive bureaucrats or villains. Some of his most high-profile roles are Tywin Lannister in HBO's Game of Thrones (2011), Guy Perron in The Jewel in the Crown (1984), Sardo Numspa in Den utvalgte (1986), Dr. Jonathan Clemens in Alien³ (1992), Benedict ... ", "1946-10-10"), 
(21, "Iain", "Glen", "Iain Glen is a Scottish actor, born June 24, 1961, in Edinburgh, Scotland. He was educated at the Edinburgh Academy, an independent school for boys (now co-educational), followed by the University of Aberdeen. He graduated from the Royal Academy of Dramatic Art, where he was the winner of the Bancroft Gold Medal. He and his first wife, Susannah ...  ", "1961-6-24"), 
(22, "Liam", "Cunningham", "Irish actor Liam Cunningham was an electrician in the mid 80's. He saw an ad for an acting school and he decided to give acting a try. His first film role was as a policeman in 'Into the West.' Since then, he has been involved in many films and theater productions on both sides of the Atlantic.", "1961-6-2"), 
(23, "Alfie", "Allen", "Alfie Evan Allen (born 12 September 1986) is an English actor. He is best known for playing Theon Greyjoy in the HBO series Game of Thrones (2011-2019). Allen was born in Hammersmith, London, the son of film producer Alison Owen and Welsh-born actor Keith Allen. His older sister is singer Lily Allen; her song 'Alfie' is about him. He went to ...", "1986-9-12"), 
(24, "Kristofer", "Hivju", "A second-generation Norwegian actor, Kristofer Hivju was born on 7 December, 1978 in Oslo. He is the son of actors Lieselotte Holmene and Erik Hivju, a prominent character actor who appeared with his son in the short film Flax, where Kristofer shared screenwriting credit with director Bård Ivar Engelsås. Kristofer made his American Film debut in ...", "1978-12-7"), 
(25, "Carice", "van Houten", "One of Europe's most celebrated actresses, Carice van Houten is perhaps best known as 'Melisandre' in the iconic TV show Game of Thrones, a performance for which she has been recognized with an Emmy Award nomination in 2019. Other projects include Paul Verhoeven's award-winning Black Book and Bryan Singer's Valkyrie opposite Tom Cruise and as ...", "1976-9-5"), 
(26, "Nikolaj", "Coster-Waldau", "Nikolaj Coster-Waldau (born 27 July 1970) is a Danish actor, producer and screenwriter. He graduated from the Danish National School of Theatre in Copenhagen in 1993. Coster-Waldau's breakthrough performance in Denmark was his role in the film Nightwatch (1994). Since then he has appeared in numerous films in his native Scandinavia and Europe in ...", "1970-7-27"),
-- Barry
(27, "Bill", "Hader", "Bill Hader was born on June 7, 1978 in Tulsa, Oklahoma, USA. He is an actor and writer, known for The Skeleton Twins (2014), Innsiden ut (2015) and Trainwreck (2015). He was previously married to Maggie Carey.", "1978-6-7"),
-- Shawnshank Redemption
(28, "Morgan", "Freeman", "With an authoritative voice and calm demeanor, this ever popular American actor has grown into one of the most respected figures in modern US cinema. Morgan was born on June 1, 1937 in Memphis, Tennessee, to Mayme Edna (Revere), a teacher, and Morgan Porterfield Freeman, a barber. The young Freeman attended Los Angeles City College before serving", "1937-6-1"),
-- The Matrix
(29, "Keanu", "Reeves", "Keanu Charles Reeves, whose first name means (cool breeze over the mountains) in Hawaiian, was born September 2, 1964 in Beirut, Lebanon. He is the son of Patricia Taylor, a showgirl and costume designer, and Samuel Nowlin Reeves, a geologist. Keanu's father was born in Hawaii, of British, Portuguese, Native Hawaiian, and Chinese ancestry, and ...", "1962-9-2"),
-- The Joker
(30, "Joaquin", "Phoenix", "Joaquin Phoenix was born Joaquin Rafael Bottom in San Juan, Puerto Rico, to Arlyn (Dunetz) and John Bottom, and is the middle child in a brood of five. His parents, from the continental United States, were then serving as Children of God missionaries. His mother is from a Jewish family from New York, while his father, from California, is of mostly...", "1974-10-28"),
-- Forest Gump
(31, "Tom", "Hanks", "Thomas Jeffrey Hanks was born in Concord, California, to Janet Marylyn (Frager), a hospital worker, and Amos Mefford Hanks, an itinerant cook. His mother's family, originally surnamed "Fraga", was entirely Portuguese, while his father was of mostly English ancestry. Tom grew up in what he has called a (fractured) family. He moved around a great ...", "1956-7-9");

INSERT IGNORE INTO `Entertainment_has_Actor` (`entertainment_id`, `actor_id`, `role`) VALUES
-- GOT
(3, 17, 'Daenerys Targaryen'),
(3, 8, 'Tyrion Lannister'),
(3, 12, 'Cersei Lannister'),
(3, 11, 'Jon Snow'),
(3, 7, 'Sansa Stark'),
(3, 15, 'Arya Stark'),
(3, 26, 'Jaime Lannister'),
(3, 21, 'Jorah Mormont'),
(3, 14, 'Samwell Tarly'),
(3, 23, 'Theon Greyjoy'),
(3, 18, 'Lord Varys'),
(3, 22, 'Davos Seaworth'),
(3, 16, 'Brienne of Tarth'),
(3, 5, 'Petyr (Littlefinger) Baelish'),
(3, 6, 'Bronn'),
(3, 1, 'Podrick Payne'),
(3, 4, 'Bran Stark'),
(3, 2, 'Eddison Tollett'),
(3, 24, 'Tormund Giantsbane'),
(3, 9, 'Grand Maester Pycelle'),
(3, 13, 'Sandor (The Hound) Clegane'),
(3, 20, 'Tywin Lannister'),
(3, 3, 'Gilly'),
(3, 10, 'Grey Worm'),
(3, 25, 'Melisandre'),
(3, 19, 'Missandei'),
-- BARRY
(5, 27, "Barry Berkman"),
-- Shawshank Redemption
(4, 28, "Ellis Boyd (Red) Redding"),
-- The Matrix
(9, 29, "Neo"),
-- Joker
(8, 30, "Joker"),
-- Forest Gump
(7, 31, "Forest Gump");

INSERT INTO `actor` (`person_id`) VALUES
(1),
(2),
(5),
(4),
(7),
(6),
(9),
(11),
(12),
(14),
(8),
(16),
(3),
(17),
(19),
(20),
(13),
(21),
(23),
(18),
(24),
(25),
(26),
(15),
(10),
(22),
(27),
(28),
(29),
(30),
(31);

INSERT IGNORE INTO `award` (`id`, `name`, `category`) VALUES
(1, 'Emmy', 'Outstanding Lead Actress in Drama Series'),
(2, 'Emmy', 'Outstanding Support Actress in Drama Series'),
(3, 'Emmy', 'Outstanding Lead Actress in Comedy Series'),
(4, 'Emmy', 'Outstanding Support Actress in Comedy Series'),
(5, 'Emmy', 'Outstanding Lead Actress in Limited Series'),
(6, 'Emmy', 'Outstanding Support Actress in Limited Series'),
(7, 'Emmy', 'Outstanding Lead Actor in Drama Series'),
(8, 'Emmy', 'Outstanding Support Actor in Drama Series'),
(9, 'Emmy', 'Outstanding Lead Actor in Comedy Series'),
(10, 'Emmy', 'Outstanding Support Actor in Comedy Series'),
(11, 'Emmy', 'Outstanding Lead Actor in Limited Series'),
(12, 'Emmy', 'Outstanding Support Actor in Limited Series'),
(13, 'Oscar', 'Best Actor in Leading Role'),
(14, 'Oscar', 'Best Actress in Leading Role'),
(15, 'Oscar', 'Best Actor in Supporting Role'),
(16, 'Oscar', 'Best Actress in Supporting Role'),
(17, 'Golden Globes', 'Best Actor in Motion Picture - Drama'),
(18, 'Golden Globes', 'Best Actor in Motion Picture - Comedy or Musical'),
(19, 'Golden Globes', 'Best Actress in Motion Picture - Drama'),
(20, 'Golden Globes', 'Best Actress in Motion Picture - Comedy or Musical'),
(21, 'Golden Globes', 'Best Actor in Television Series - Drama'),
(22, 'Golden Globes', 'Best Actor in Television Series - Comedy or Musical'),
(23, 'Golden Globes', 'Best Actress in Television Series - Drama'),
(24, 'Golden Globes', 'Best Actress in Television Series - Comedy or Musical');

INSERT IGNORE INTO `Actor_has_Award` (`award_id`, `actor_id`, `number_of_prices`) VALUES
(8, 8, 1),
(9, 27, 2),
(13, 28, 1),
(18, 28, 1),
(13, 30, 1),
(17, 30, 1),
(18, 30, 1),
(13, 31, 2),
(17, 31, 1);
