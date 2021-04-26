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
("Legal Assistant", 75000, 4),
("Quality Assurance Analyst", 80000.00, 3),
("Project Manager", 90000, 3),
("Human Resources Analyst", 75000, 1);


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
("Justin", "Hammer", 11, 10),
("Clint", "Barton",  12, 5),
("Carol", "Danvers", 13, 5),
("James", "Howlett",14, 1),
("Charles", "Xavier", 3, 2);

