INSERT INTO departments (department_name)
VALUES ("Human Resources"),
("Accounting"),
("Software Development"),
("Legal");


INSERT INTO roles (title, salary, department_id)
VALUES ("Human Resources Manager", 100000, 1),
("Chief Accountant", 100000.00, 2),
("Accounts Receivable Analyst", 60000.00, 2),
("Accounts Payables Analyst", 60000.00, 2),
("Software Development Manager", 150000.00, 3),
("Full Stack Developer", 100000.00, 3),
("Database Administrator", 100000.00, 3),
("Webmaster", 75000.00, 3),
("Chief Legal Counsel", 200000.00, 4),
("Associate Legal Counsel", 150000.00, 4),
("Legal Assistant", 75000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Natasha", "Romanov", 1, NULL),
("Steve", "Rogers", 2, NULL),
("Bucky", "Barnes", 3, 2),
("Justin", "Hammer", 4, 2),
("Tony", "Stark", 5, NULL),
("Bruce", "Banner", 6, 5),
("Donald", "Blake", 6, 5),
("Sam", "Wilson", 7, 5),
("Peter", "Parker", 8, 5),
("Jennifer", "Walters", 9, NULL),
("Everett", "Ross", 10, 10),
("Matthew", "Murdock", 10, 10),
("Jerry", "McLeod", 11, 10),
("Justin", "Hammer", 11, 10);


SELECT departments.department_name, employees.first_name, employees.last_name, roles.title, roles.salary, employees.manager_id
FROM departments d, roles r, employees e
JOIN departments ON (departments.department_id = roles.department_id and 
ON departments.department_id = roles.department_id
JOIN 

-- View all employees
SELECT * from employees
order by role_id;

-- View all employees by department
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN roles r 
ON e.role_id = r.role_id
JOIN departments d 
ON d.department_id = r.department_id
ORDER BY d.department_name;



