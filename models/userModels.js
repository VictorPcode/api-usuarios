// models/userModel.js
class User {
  constructor(id, name, email, password, role = "user") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password; // debería estar encriptada
    this.role = role;
  }
}

export default User;