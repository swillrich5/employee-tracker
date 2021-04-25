const mysql = require('mysql');
const conTable = require('console.table');
const inquirer = require('inquirer');
const RawListPrompt = require('inquirer/lib/prompts/rawlist');

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


// ---------------------------------------------------------------


connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  runTracker();
});


// ---------------------------------------------------------------


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
        'Total Utilized Budget By Department',
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

        case 'View All Employees by Manager':
          viewEmployeesByManager();
          break;

        case 'Add an Employee':
          addEmployee();
          break;

        case 'View All Departments':
          viewDepartments();
          break;

        case 'View Employee Roles':
          viewRoles();
          break;

        case 'Add a Department':
          addDepartment();
          break;

        case 'Add an Employee Role':
          addRoles();
          break;
  
        case 'Update Employee Roles':
          updateEmployeeRoles();
          break;

        case 'Total Utilized Budget By Department':
          budgetByDepartment();
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
          console.log("Exiting Employee Tracker...");
          connection.end();
          break;
      }
    });
};


// ---------------------------------------------------------------


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


// ---------------------------------------------------------------


const viewEmployeesByDept = () => {

  let departmentQuery = 'SELECT department_name FROM departments';
  connection.query(departmentQuery, (err, res) => {
    if (err) console.log(err);
    const depts = res.map(({ department_name }) => department_name);
    inquirer
    .prompt({
      name: 'deptChoice',
      type: 'rawlist',
      message: 'Please choose a department',
      choices: depts,
    })
    .then((answer) => {
      let query = 'SELECT e.first_name "FIRST NAME", e.last_name "LAST NAME", ';
      query += 'd.department_name DEPARTMENT, r.title TITLE, ';
      query += 'LPAD(FORMAT(r.salary, 2), 10, " ") SALARY, ';
      query += 'CONCAT(m.first_name, " ", m.last_name) MANAGER ';
      query += 'FROM employees e JOIN roles r ON e.role_id = r.role_id ';
      query += 'JOIN departments d ON d.department_id = r.department_id ';
      query += 'LEFT JOIN employees m ON m.employee_id = e.manager_id ';
      query += 'WHERE d.department_name = ?';
      connection.query(query, answer.deptChoice, (err, res) => {
        if (err) console.log(err);
        console.log("\n");            
        console.table(res);  
        runTracker();
      })
    }); 
  })   
}


// ---------------------------------------------------------------


const viewEmployeesByManager = () => {
  let managerQuery = 'SELECT CONCAT(m.first_name, " ", m.last_name) as manager_name FROM employees m WHERE m.employee_id IN (SELECT manager_id FROM employees);';
  connection.query(managerQuery, (err, res) => {
    if (err) console.log(err);
    const managers = res.map(({ manager_name }) => manager_name);
    inquirer
    .prompt({
      name: 'managerChoice',
      type: 'rawlist',
      message: 'Please choose a manager',
      choices: managers,
    })
    .then((answer) => {
      let query = 'SELECT e.first_name "FIRST NAME", e.last_name "LAST NAME", ';
      query += 'd.department_name DEPARTMENT, r.title TITLE, ';
      query += 'LPAD(FORMAT(r.salary, 2), 10, " ") SALARY, ';
      query += 'CONCAT(m.first_name, " ", m.last_name) MANAGER ';
      query += 'FROM employees e JOIN roles r ON e.role_id = r.role_id ';
      query += 'JOIN departments d ON d.department_id = r.department_id ';
      query += 'LEFT JOIN employees m ON m.employee_id = e.manager_id ';
      query += 'WHERE CONCAT(m.first_name, " ", m.last_name) = ?';
      connection.query(query, answer.managerChoice, (err, res) => {
        if (err) console.log(err);
        console.log("\n");            
        console.table(res);  
        runTracker();
      })
    }); 
  })   
}


// ---------------------------------------------------------------


const addEmployee = () => {
  const departmentQuery = 'SELECT department_name, department_id FROM departments ORDER by department_name';
  connection.query(departmentQuery, (err, res) => {
    if (err) console.log(err);
    const departments = res;
    const departmentNames = departments.map(({ department_name, department_id }) => department_name);
    inquirer
    .prompt([{
      name: 'firstName',
      type: 'input',
      message: 'Employee First Name:',
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'Employee Last Name:',
    },
    {
      name: 'department',   // need department to narrow down list of roles
      type: 'rawlist',
      message: 'Employee Department',
      choices: departmentNames,
    }])
    .then((answer) => {
      const firstName = answer.firstName;
      const lastName = answer.lastName;
      const department = answer.department
      // get the roles that are available in the department
      var deptIndex = departments.findIndex(function (dept) {
        return dept.department_name === answer.department;
      });
      const deptId = departments[deptIndex].department_id;
      let roleQuery = 'SELECT title, role_id FROM roles WHERE department_id = ?';
      connection.query(roleQuery, deptId, (err, res) => {
        if (err) console.log(err);
        const roles = res;
        const titleNames = roles.map(({ title, role_id }) => title);
        inquirer
        .prompt({
          name: 'titleChoice',
          type: 'rawlist',
          message: 'Please choose a title',
          choices: titleNames,
        })
        .then((answer) => {        
          let roleId = -1;
          roles.forEach(({ title, role_id }) => {
            if (title === answer.titleChoice) {
              roleId = role_id;
            }
          })
          // assuming anyone in a department can be a manager, pick an employee to be the new employee's manager
          // the employee doesn't necessarily have have a manager, like in a new / empty department
          let managerQuery = 'SELECT CONCAT(e.first_name, " ", e.last_name) as manager_name, e.employee_id ';
          managerQuery += 'FROM employees e '
          managerQuery += 'JOIN roles r ON r.role_id = e.role_id ';
          managerQuery += 'JOIN departments d on d.department_id = r.department_id ';
          managerQuery += 'WHERE d.department_id = ?'
          connection.query(managerQuery, deptId, (err, res) => {
            if (err) console.log(err);
            let managerNames = res.map(({ manager_name }) => manager_name);
            managers = res;
            managerNames.push('No Manager');
            inquirer
            .prompt({
              name: 'managerChoice',
              type: 'rawlist',
              message: 'Please choose a manager',
              choices: managerNames,
            })
            .then((answer) => {  
              let managerId = -1;
              if (answer.managerChoice == 'No Manager') {
                managerId = null;
              } else {
                managers.forEach(({ manager_name, employee_id }) => {
                  if (manager_name === answer.managerChoice) {
                    managerId = employee_id;
                  }
                })  
              }
              var sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id) ";
              sql += "VALUES (?)";
              values = [firstName, lastName, roleId, managerId];
              connection.query(sql, [values], (err, res) => {
                if (err) {
                  console.log(err);
                }
                else {
                  console.log("\n...Employee " + firstName + " " + lastName + " Added...");
                  runTracker();
                }
              });
            })
          })
        })
      })
    })
  }); 
}


// ---------------------------------------------------------------


const viewDepartments = () => {
  const departmentQuery = 'SELECT department_name "DEPARTMENT NAME", department_id "DEPARTMENT ID" FROM departments ORDER by department_name';
  connection.query(departmentQuery, (err, res) => {
    if (err) console.log(err);
    const departments = res;
    console.log("\n\n");
    console.table(departments);
    runTracker();
  });
}


// ---------------------------------------------------------------


const viewRoles = () => {
  let sql = 'SELECT title TITLE, salary SALARY, role_id "ROLE ID", d.department_name "DEPARTMENT NAME"'; 
  sql += 'FROM roles r '
  sql += 'JOIN departments d ON d.department_id = r.department_id ';
  sql += 'ORDER BY r.department_id, r.title';
  connection.query(sql, (err, res) => {
    if (err) console.log(err);
    console.log("\n");            
    console.table(res);  
    runTracker();
  });
}


// ---------------------------------------------------------------


const addDepartment = () => {
  inquirer
  .prompt({
    name: 'departmentName',
    type: 'input',
    message: 'Please enter the new department\'s name',
  })
  .then((answer) => {
    var sql = "INSERT INTO departments (department_name) ";
    sql += "VALUES (?)";
    values = [answer.departmentName];
    connection.query(sql, [values], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("\nDepartment: " + answer.departmentName + " successfully added. Rows Inserted: " + res.affectedRows + "\n");
      }
      runTracker();
    });
  });
}


// ---------------------------------------------------------------


const addRoles = () => {
  const departmentQuery = 'SELECT department_name, department_id FROM departments ORDER by department_name';
  connection.query(departmentQuery, (err, res) => {
    if (err) console.log(err);
    const departments = res;
    const departmentNames = departments.map(({ department_name, department_id }) => department_name);
    inquirer
    .prompt({
      name: 'departmentName',   // need department to narrow down list of roles
      type: 'rawlist',
      message: 'For which department is the role being added:',
      choices: departmentNames,
    })
    .then((answer) => { 
      departmentName = answer.departmentName;   
      inquirer
      .prompt([{
        name: 'roleName',
        type: 'input',
        message: 'Please enter the new role\'s title:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Please enter the new role\'s salary (no commas):',
      }])
      .then((answer) => {
        let departmentId = -1;
        departments.forEach(({ department_name, department_id }) => {
          if (department_name === departmentName) {
            departmentId = department_id;
          }
        });
        let sql = "INSERT INTO roles (title, salary, department_id) ";
        sql += "VALUES (?)";
        values = [answer.roleName, answer.salary, departmentId];
        connection.query(sql, [values], (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log("\nJob Title: " + answer.roleName + " successfully added. Rows Inserted: " + res.affectedRows + "\n");
          }
          runTracker();
        });
      });
    });
  });
}


// ---------------------------------------------------------------


const updateEmployeeRoles = () => {
  let sql = 'SELECT DISTINCT title, role_id, salary, department_id '; 
  sql += 'FROM roles '
  // sql += 'JOIN departments d ON d.department_id = r.department_id ';
  sql += 'ORDER BY department_id, title';
  connection.query(sql, (err, res) => {
    if (err) console.log(err);
    let roles = res;
    const roleNames = roles.map(({ title, role_id, salary, department_id }) => title);
    inquirer
    .prompt([{
      name: 'roleToUpdate',   // need department to narrow down list of roles
      type: 'rawlist',
      message: 'Which role do you wish to update:',
      choices: roleNames,
    },
    {
      name: 'newTitle',
      type: 'input',
      message: 'Enter New Title (press Enter for no change): ',
    },
    {
      name: 'newSalary',
      type: 'input',
      message: 'Enter New Salary (No commas - press Enter for no change): ',
    }
    ])
    .then((answers) => { 
      let newTitle = "";
      let newSalary = 0;
      let roleId = -1;
      roles.forEach(({ title, role_id, salary, department_id  }) => {
        if (answers.roleToUpdate == title) {
          newTitle = title;
          newSalary = salary;
          roleId = role_id;
        }
      });  
      if (answers.newSalary !== "") {
        newSalary = answers.newSalary;
      }
      if (answers.newTitle !== ""){
        newTitle = answers.newTitle;
      }
      let sql = "UPDATE roles SET title = ?, salary = ? ";
      sql += "WHERE role_id = ?";
      values = [newTitle, newSalary, roleId];
      connection.query(sql, [newTitle, newSalary, roleId], (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("\nRole: " + newTitle + " successfully Update. Rows Updated: " + res.affectedRows + "\n");
        }
        runTracker();
      });
    });
  });
}


// ---------------------------------------------------------------


const budgetByDepartment = () => {
  let sql = 'SELECT d.department_name DEPARTMENT, LPAD(FORMAT(SUM(r.salary), 2), 10, " ") "DEPT SALARY" ';
  sql += 'FROM roles r ';
  sql += 'JOIN departments d ON r.department_id = d.department_id ';
  sql += 'JOIN employees e ON r.role_id = e.role_id ';
  sql += 'GROUP BY department ';
  sql += 'ORDER BY department ';
  connection.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("\n");
      console.table(res);
    }
    let query = 'SELECT LPAD(FORMAT(SUM(r.salary), 2), 12, " ") "TOTAL SALARY" FROM roles r ';
    query += 'JOIN departments d ON r.department_id = d.department_id ';
    query += 'JOIN employees e ON e.role_id = r.role_id';
    connection.query(query, (err, res) => {
      if (err) {
        console.log(err);
      }
      else {
        console.table(res);
      } 
      runTracker();
    });
  });
}