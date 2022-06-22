INSERT INTO department (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

SELECT * FROM department;

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

SELECT * FROM roles;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Lebron", "James", 3, NULL),
    ("Kevin", "Durant", 3, NULL),
    ("Steph", "Curry", 3, NULL),
    ("Luka", "Doncic", 4, 2),
    ("Trae", "Young", 5, 3),
    ("Ja", "Morant", 6, 3),
    ("Jayson", "Tatum", 1, 2),
    ("Lonzo", "Ball", 8, 1);

SELECT * FROM employee;