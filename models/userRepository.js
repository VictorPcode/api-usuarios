// models/userRepository.js
const User = require("./userModel");

let users = [
  new User(1, "Demo User", "demo@example.com", "$2a$10$hashedpass", "user"),
];

function getAll() {
  return users;
}

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

function add(user) {
  users.push(user);
  return user;
}

module.exports = { getAll, findByEmail, add };
