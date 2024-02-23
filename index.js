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

const writeFileAsync = util.promisify(fs.writeFile);

// Function to validate user email address
const validateEmail = (email) => {
  if (emailValidator.validate(email)) {
    return true;
  } else {
    return "Please enter a valid email address.";
  }
};

// Array of questions for user
const questions = [
  {
    type: "input",
    name: "managerName",
    message: "Please enter your name.",
  },
  {
    type: "input",
    name: "managerId",
    message: "Please enter your employee id.",
  },
  {
    type: "input",
    name: "managerEmail",
    message: "Please enter your email address.",
    validate: validateEmail,
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Please enter your office number.",
  },
  {
    type: "checkbox",
    name: "manageroOptions",
    message: "Please select which action you would like to perform.",
    choices: ["Add an engineer", "Add an intern", "Finish building the team"],
  },
  {
    type: "input",
    name: "engineerName",
    message: "Please enter the engineer's name.",
  },
  {
    type: "input",
    name: "engineerId",
    message: "Please enter the engineer's id.",
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
  {
    type: "input",
    name: "internName",
    message: "Please enter the intern's name.",
  },
  {
    type: "input",
    name: "internId",
    message: "Please enter the intern's id.",
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
  },
];

// Function to prompt user
const promptUser = () => {
  return inquirer.prompt(questions);
};

// Function to write to HTML
const init = async () => {
  try {
    const answers = await promptUser();

    // Create team member variables based on user input
    const manager = new Manager(
      answers.managerName,
      answers.managerId,
      answers.managerEmail,
      answers.officeNumber
    );
    const engineer = new Engineer(
      answers.engineerName,
      answers.engineerId,
      answers.engineerEmail,
      answers.engineerGitHub
    );
    const intern = new Intern(
      answers.internName,
      answers.internId,
      answers.internEmail,
      answers.internSchool
    );

    const team = [manager, engineer, intern]; // create an array of team members

    const pageTemplate = render(team); // generate HTML page using the previously created team array

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
