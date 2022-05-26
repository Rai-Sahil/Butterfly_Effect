"use strict";

require("dotenv").config();
const bcrypt = require("bcrypt");

const dbName = process.env.DB_NAME || "COMP2800";

const dbUserTable = "BBY_32_USER";

const connectionParams = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: dbName,
};

const saltRounds = 10;

// name | email | password | role
const users = [
  [
    "Thomas Anderson",
    "admin@bby32.com",
    bcrypt.hashSync(process.env.ADMIN_PASSWORD, saltRounds),
    "admin",
  ],
  [
    "John Doe",
    "user@bby32.com",
    bcrypt.hashSync(process.env.USER_PASSWORD, saltRounds),
    "user",
  ],
];

//question
const questions = [
  ["Should I turn on the A/C?"],
  ["Should I go there?"],
  ["What is carbon sink?"],
];

//question_id | text | environment | comfort | next_question
const choices = [
  [1, "Yes", -5, 5, 2],
  [1, "No", 0, -5, 2],
  [2, "Yes", 5, 5, 3],
  [2, "No", 0, -5, 3],
  [3, "Forest", 2, 0, 1],
  [3, "Soil", 2, 0, 1],
  [3, "Ocean", 2, 0, 1],
  [3, "All", 6, 0, 1],
];

// type | threshold | text
const endings = [
  ["comfort", 0, "You have sacrificed a lot to save earth and the world! As long as it does not lower your happiness too much, keep up the good work! You are the part of the solution."],
  ["comfort", 50, "You reasonably compromised between your living comfort and care for earth. Remember. Small changes make a big difference. Look for more changes you can make for the better future."],
  ["comfort", 100, "It is time to take action for climate change. Living comfort that you are enjoying right now might not be available within few years. To keep our happy life, we need to make some small changes in our daily life choices. Is there anything you can help to mitigate climate change?"],
  ["environment", 0, "Earth is in danger, and human race is also in danger. Sea level has risen tremendously with increased acidity. 60% of all fish species have been wiped out. The Maldives, Kiribati, Tuvalu, Solomon Islands, and more countries have sunk in the ocean. More frequent wildfires, longer periods of drought, intense tropical storms are happening. People are exposed to extreme heat waves every 5 years and are in risk of injury, disease, and death."],
  ["environment", 50, "It is not late to mitigate the climate change. Earth is still slowly going for the dead-end. Due to the research, we have about 10 years to cut emissions to avoid dire climate scenarios. Take the action now for our future."],
  ["environment", 100, "Earth is breathing. Overall risks have been lowered. As 196 countries signed and promised on Paris Agreement, we have successfully avoided more dire impacts of climate change by limiting global warming to well below 2° C (3.6° F)—or even 1.5° C."],
];

module.exports = {
  dbName,
  dbUserTable,
  connectionParams,
  saltRounds,
  users,
  questions,
  choices,
  endings,
};