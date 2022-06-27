const inquirer = require('inquirer');

const db = require("./db");

require("console.table");

init();

function init() {
  promptQuestions();
}

// Prompts user to list of options and sends to function needed based on their choice
function promptQuestions() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Which of the following would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit'],
        name: 'options',
      },
    ])
    .then((answers) => {
      console.log(answers.options);
      switch (answers.options) {
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addNewEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        default:
          exit();
      }
    })
}

// Displays all employee table
function viewAllEmployees() {
  db.findEmployees()
    .then(([employees]) => {
      console.table(employees);
    })
    .then(() => {
      promptQuestions();
    })
};

// Displays roles table
function viewAllRoles() {
  db.findRoles()
    .then(([roles]) => {
      console.table(roles);
    })
    .then(() => {
      promptQuestions();
    })
}

// Displays department table
function viewAllDepartments() {
  db.findDepartment()
    .then(([departments]) => {
      console.table(departments)
    })
    .then(() => {
      promptQuestions();
    })
}

// Prompts user the name of new department and adds it to table
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the name of the department?",
        name: 'departmentName'
      }
    ])
    .then((answers) => {
      let departmentName = answers.departmentName;
      db.createDepartment(departmentName)
      console.log(`Added ${answers.departmentName} to the database.`)
    })
    .then(() => {
      promptQuestions();
    })
}

// Prompts user for the department name, salary, and new role name to input into role table
function addRole() {
  db.findDepartment()
    .then(([departments]) => {
      const allDepartments = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));
      inquirer
        .prompt([
          {
            type: 'list',
            message: "What is the name of the department?",
            name: 'departmentName',
            choices: allDepartments
          },
          {
            type: 'input',
            message: "What is the new role called?",
            name: 'roleName',
          },
          {
            type: 'input',
            message: "What is the salary of this role?",
            name: 'salary'
          }
        ])
        .then((answers) => {
          let newRole = {
            title: answers.roleName,
            salary: answers.salary,
            department_id: answers.departmentName
          }
          db.createRoles(newRole);
          console.log(`Added ${answers.roleName} to the database.`)
        })
        .then(() => {
          promptQuestions();
        })
    });
}

// Adds new employee to table
function addNewEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName',
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastName',
      }
    ])
    .then((answers) => {
      let firstName = answers.firstName;
      let lastName = answers.lastName;
      db.findRoles()
        .then(([roles]) => {
          const options = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }))
          inquirer.prompt([
            {
              type: 'list',
              message: 'Choose one of the following roles for the new employee.',
              choices: options,
              name: 'role'
            }
          ])
            .then((answers) => {
              let role_id = answers.role;

              db.findEmployees()
                .then(([employees]) => {
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }))
                  inquirer.prompt([
                    {
                      type: 'list',
                      message: "Choose the new employee's manager.",
                      choices: managerChoices,
                      name: 'manager'
                    }
                  ])
                    .then((answers) => {
                      let newEmployee = {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: role_id,
                        manager_id: answers.manager
                      }
                      db.createEmployee(newEmployee);
                      console.log(`Added ${firstName} ${lastName} to the database.`)
                      promptQuestions();
                    })
                })
            })
        })
    })
}

// Allows user to update an employee's role
function updateEmployeeRole() {
  db.findEmployees()
    .then(([employees]) => {
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }))
      inquirer.prompt([
        {
          type: 'list',
          message: "Choose an employee to update.",
          choices: employeeChoices,
          name: 'employee'
        }
      ])
        .then((answers) => {
          let employee_id = answers.employee;

          db.findRoles()
            .then(([roles]) => {
              const roleId = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }))
              inquirer.prompt([
                {
                  type: 'list',
                  message: 'Choose one of the following roles.',
                  choices: roleId,
                  name: 'role'
                }
              ])
                .then((answers) => {
                  let role_id = answers.role;
                  db.updateEmployeeRole(role_id, employee_id);
                  console.log(`Employee role was updated in the database.`)
                  promptQuestions();
                });
            })
        })
    })
}

// Exits the application
function exit() {
  process.exit();
}
