CREATE DATABASE "budget-app";

--\c into the DB and run the command bellow to install the extension on our DB
create extension if not exists "uuid-ossp";

CREATE TABLE users(
  user_id UUID DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  constraint budget check (budget >= 0),
  PRIMARY KEY (user_id)
);

CREATE TABLE expenses(
  expense_id SERIAL,
  user_id UUID,
  description VARCHAR(255) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  constraint amount check (amount >= 0),
  category VARCHAR(255) NOT NULL,
  PRIMARY KEY (expense_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

--insert fake user data
INSERT INTO users (user_name, user_email, user_password, budget) VALUES ('Mads', 'mads@gmail.com', 'dark', 0);
INSERT INTO users (user_name, user_email, user_password, budget) VALUES ('Ulrich', 'ulrich@gmail.com', 'dark', 0);

--insert fake expense
INSERT INTO expenses (user_id, description, amount, category) VALUES ('3e701c31-b517-4c14-8dfe-783e2d96b9ca', 'Rent', '380', 'Housing');

--get user data and their expenses
SELECT * FROM users LEFT JOIN expenses ON users.user_id = expenses.user_id;