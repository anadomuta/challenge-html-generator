const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const emailValidator = require("email-validator");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./src/page-template.js");
const teamMembers = [];
const writeFileAsync = util.promisify(fs.writeFile);

// Function to validate email address input
const validateEmail = (email) => {
  return emailValidator.validate(email)
    ? true
    : "Please enter a valid email address.";
};

// Function to validate numeric input
const validateNumber = (num) => {
  return !isNaN(parseInt(num)) || "" ? true : "Please type in a number.";
};

// Function to validate name input
const validateName = (str) => {
  let letters = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return str !== "" && letters.test(str)
    ? true
    : "Please type in a valid name.";
};

// Array of questions for user
const managerQuestions = [
  {
    type: "input",
    name: "managerName",
    message: "Please enter the manager's first and last name.",
    validate: validateName,
  },
  {
    type: "input",
    name: "managerId",
    message: "Please enter the manager's employee id.",
    validate: validateNumber,
  },
  {
    type: "input",
    name: "managerEmail",
    message: "Please enter the manager's email address.",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Please enter the manager's office number.",
    validate: validateNumber,
  },
];

const engineerQuestions = [
  {
    type: "input",
    name: "engineerName",
    message: "Please enter the engineer's first and last name.",
    validate: validateName,
  },
  {
    type: "input",
    name: "engineerId",
    message: "Please enter the engineer's id.",
    validate: validateNumber,
  },
  {
    type: "input",
    name: "engineerEmail",
    message: "Please enter the engineer's email address.",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "engineerGitHub",
    message: "Please enter the engineer's GitHub username.",
  },
];

const internQuestions = [
  {
    type: "input",
    name: "internName",
    message: "Please enter the intern's first and last name.",
    validate: validateName,
  },
  {
    type: "input",
    name: "internId",
    message: "Please enter the intern's id.",
    validate: validateNumber,
  },
  {
    type: "input",
    name: "internEmail",
    message: "Please enter the intern's email address.",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "internSchool",
    message: "Please enter the intern's school.",
    validate: validateName,
  },
];

// Function to prompt user
const promptUser = (questions) => {
  return inquirer.prompt(questions);
};

// Function to add another employee after manager created
const addAnotherEmployee = async () => {
  return await inquirer.prompt([
    {
      type: "list",
      name: "addEmployee",
      message: "Would you like to add another employee?",
      choices: [
        "Yes, add an engineer.",
        "Yes, add an intern.",
        "No, finish building the team.",
      ],
    },
  ]);
};

// Function to create engineer
const createEngineer = async () => {
  const engineerAnswers = await promptUser(engineerQuestions);

  return new Engineer(
    engineerAnswers.engineerName,
    engineerAnswers.engineerId,
    engineerAnswers.engineerEmail,
    engineerAnswers.engineerGitHub
  );
};

// Function to create intern
const createIntern = async () => {
  const internAnswers = await promptUser(internQuestions);

  return new Intern(
    internAnswers.internName,
    internAnswers.internId,
    internAnswers.internEmail,
    internAnswers.internSchool
  );
};

// Function to build team
const buildTeam = async () => {
  const addEmployeeAnswer = await addAnotherEmployee(); // await user input whether additional employees need to be added

  // Push engineer to team members array if option selected
  if (addEmployeeAnswer.addEmployee.includes("Yes, add an engineer.")) {
    const engineer = await createEngineer();
    teamMembers.push(engineer);
    await buildTeam();

    // Push intern to team members array if option selected
  } else if (addEmployeeAnswer.addEmployee.includes("Yes, add an intern.")) {
    const intern = await createIntern();
    teamMembers.push(intern);
    await buildTeam();
  } else {
    return;
  }
};

// Function to write to HTML
const init = async () => {
  try {
    const managerAnswers = await promptUser(managerQuestions);

    // Create manager based on user input
    const manager = new Manager(
      managerAnswers.managerName,
      managerAnswers.managerId,
      managerAnswers.managerEmail,
      managerAnswers.officeNumber
    );

    teamMembers.push(manager); // add created manager to team members' array

    await buildTeam(); // call function to start building the team

    const pageTemplate = render(teamMembers); // generate HTML page using the previously created team array

    // Creates 'output' directory if it doesn't exist
    if (!fs.existsSync(`output`)) {
      fs.mkdirSync(`output`);
    }

    await writeFileAsync(outputPath, pageTemplate);

    console.info("Successfully wrote to team.html");
  } catch (err) {
    console.error(err);
  }
};

// Function call to initialize program
init();
