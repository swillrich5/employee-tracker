const mysql = require('mysql');
const conTable = require('console.table');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'mysql@16309',
  database: 'employeeTrackerDB',
});



connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  runTracker();
});

const runTracker = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'View Employee Roles',
        'View All Departments',
        'Add an Employee',
        'Add an Employee Role',
        'Add a Department',
        'Update Employee Roles',
        'EXIT'
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewEmployees();
          break;

        case 'View All Employees by Department':
          viewEmployeesByDept();
          break;

        case 'EXIT':
          console.log("\n     +++++++++++++++++++++++++++++++++++++++++");
          console.log("     +                                       +");
          console.log("     + Thank you for using Employee Tracker! +")
          console.log("     +                                       +");
          console.log("     +++++++++++++++++++++++++++++++++++++++++\n");
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};


const viewEmployees = () => {
  let query = 'SELECT e.first_name "FIRST NAME", e.last_name "LAST NAME", ';
  query += 'd.department_name DEPARTMENT, r.title TITLE, ';
  query += 'LPAD(FORMAT(r.salary, 2), 10, " ") SALARY, ';
  query += 'CONCAT(m.first_name, " ", m.last_name) MANAGER ';
  query += 'FROM employees e JOIN roles r ON e.role_id = r.role_id ';
  query += 'JOIN departments d ON d.department_id = r.department_id ';
  query += 'LEFT JOIN employees m ON m.employee_id = e.manager_id ';
  query += 'ORDER BY d.department_name';
  
  connection.query(query, (err, res) => {
    if (err) console.log(err);
    console.log("\n");            
    console.table(res);  
    runTracker();
  });
}

