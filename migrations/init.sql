CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    birthDate VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    postalCode VARCHAR(255) NOT NULL
);

INSERT INTO User (birthDate, email, name, surname, city, postalCode)
VALUES ('1990-05-20', 'john@example.com', 'John', 'Doe', 'New York', '10001');

INSERT INTO User (birthDate, email, name, surname, city, postalCode)
VALUES ('1985-10-15', 'jane@example.com', 'Jane', 'Smith', 'Los Angeles', '90001');