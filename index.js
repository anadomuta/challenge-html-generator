const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

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
