const connection = require('./connection')

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findDepartment() {
    return this.connection.promise().query(
      'SELECT * FROM department;'
    )
  };

  findRoles() {
    return this.connection.promise().query(
      'SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department ON roles.department_id = department.id;'
    )
  };

  findEmployees() {
    return this.connection.promise().query(
      'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;'
    )
  };

  createEmployee(newEmployee) {
    return this.connection.promise().query(
      'INSERT INTO employee SET ?', newEmployee
    )
  };

  createDepartment(departmentName) {
    return this.connection.promise().query(
      'INSERT INTO department (name) VALUES (?)' , departmentName
    )
  };

  createRoles(roles) {
    return this.connection.promise().query(
      'INSERT INTO roles SET ?', roles
    )
  };

  updateEmployeeRole(role_id, employee) {
    return this.connection.promise().query(
      'UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee]
    )
  }
}

module.exports = new DB(connection);