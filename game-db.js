"use strict";

const mysql = require("mysql2/promise");
const { dbName, dbUserTable, connectionParams } = require("./constants");

//Get questions
async function getQuestions(res) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const [row] = await connection.execute("SELECT * FROM QUESTION");
    return res.send(row);
  } catch (error) {
    console.error(error);
    res.send({ status: 500, message: "Internal server error." });
  }
}

//Get choices
async function getChoices(questionID, res) {
  const connection = await mysql.createConnection(connectionParams);
  var [row] = await connection.execute(
    "SELECT * FROM CHOICE WHERE question_id = " + questionID
  );
  if (row == 0) {
    return res.send({ status: 200, message: "No choice found." });
  }
  res.send(row);
}

//Add or update new question
async function updateQuestion(questionText, questionID, callback) {
  const connection = await mysql.createConnection(connectionParams);
  try {
    if (!questionText) {
      return callback({
        status: 400,
        message: "No question typed in.",
      });
    }
    var checkQuestionID = "SELECT * FROM QUESTION WHERE ID = ? LIMIT 1;";
    var checkQuestionText =
      "SELECT * FROM QUESTION WHERE question = ? LIMIT 1;";
    var updateQuestion = "UPDATE QUESTION SET question = ? WHERE ID = ?";
    var insertQuestion = "INSERT QUESTION (question) values (?)";
    var [existingQuestionID] = await connection.query(checkQuestionID, [
      questionID,
    ]);
    var [existingQuestionText] = await connection.query(checkQuestionText, [
      questionText,
    ]);
    if (existingQuestionID.length == 1) {
      await connection.query(updateQuestion, [questionText, questionID]);
      return callback({
        status: 200,
        message: "Question updated.",
      });
    }
    if (existingQuestionID.length == 0 && existingQuestionText.length == 1) {
      return callback({
        status: 400,
        message: "Question already exsits.",
      });
    }
    await connection.query(insertQuestion, [questionText]);
    return callback({
      status: 200,
      message: "New question added.",
    });
  } catch (error) {
    console.error(error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

//Add or update choice
async function updateChoice(
  questionID,
  optionID,
  text,
  envi,
  comf,
  nextQuestion,
  callback
) {
  const connection = await mysql.createConnection(connectionParams);
  try {
    if (!questionID) {
      return callback({
        status: 400,
        message: "No question selected.",
      });
    }
    if (!envi || !comf || !nextQuestion || !text) {
      return callback({
        status: 400,
        message: "Input is not complete.",
      });
    }
    var checkOption = "SELECT * FROM CHOICE WHERE question_id = ? AND ID = ?";
    var updateOption =
      "UPDATE CHOICE SET text = ?, env_pt = ?, com_pt = ?, next_q = ? WHERE question_id = ? AND ID = ?";
    var insertOption =
      "INSERT CHOICE (question_id, text, env_pt, com_pt, next_q) values (?, ?, ?, ?, ?)";
    var [existingOption] = await connection.query(checkOption, [
      questionID,
      optionID,
    ]);
    if (existingOption.length == 1) {
      await connection.query(updateOption, [
        text,
        envi,
        comf,
        nextQuestion,
        questionID,
        optionID,
      ]);
      return callback({
        status: 200,
        message: "Choice updated.",
      });
    }
    await connection.query(insertOption, [
      questionID,
      text,
      envi,
      comf,
      nextQuestion,
    ]);
    return callback({
      status: 200,
      message: "Choice inserted.",
    });
  } catch (error) {
    console.error(error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

//Delete question or choice
async function deleteQuestion(questionID, optionID, res) {
  const connection = await mysql.createConnection(connectionParams);
  try {
    if (!optionID) {
      await connection.execute("DELETE FROM QUESTION WHERE ID = " + questionID);
      await connection.execute(
        "DELETE FROM CHOICE WHERE question_id = " + questionID
      );
      return res.send({ status: 204, message: "Question deleted." });
    }
    await connection.execute(
      "DELETE FROM CHOICE WHERE question_id = " +
        questionID +
        " AND ID = " +
        optionID
    );
    return res.send({ status: 204, message: "Choice deleted." });
  } catch (error) {
    console.error(error);
    return res.send({ status: 500, message: "Internal server error." });
  }
}

// Fisher-Yates Shuffle
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

async function getPlaythrough(uuid, callback) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    const getLatestPlaythroughQuery = `SELECT * FROM PLAYTHROUGH WHERE uuid = ? ORDER BY ID DESC LIMIT 1 `;
    const [[playthrough]] = await connection.query(getLatestPlaythroughQuery, [
      uuid,
    ]);
    return callback({
      status: 200,
      message: "Successfully retrieved playthrough.",
      playthrough,
    });
  } catch (error) {
    console.error("Error retrieving playthrough: ", error);
    return callback({
      status: 500,
      message: "Internal error while attempting to retrieve playthrough.",
    });
  }
}

async function startPlaythrough(uuid, callback) {
  try {
    // Create new playthrough
    const connection = await mysql.createConnection(connectionParams);
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[user]] = await connection.query(getUserByUUIDQuery, uuid);
    const insertPlaythroughQuery = `INSERT INTO PLAYTHROUGH (user_id) VALUES (?)`;
    const [{ insertId: playthroughId }] = await connection.query(
      insertPlaythroughQuery,
      [user.id]
    );
    // Insert randomized questions into playthrough questions
    const numQuestions = 3;
    const [questions] = await connection.query("SELECT id FROM QUESTION");
    const selectedQuestions = shuffle(questions).slice(0, numQuestions);
    const insertPlaythroughQuestionsQuery = `INSERT INTO PLAYTHROUGH_QUESTION (playthrough_id, question_id) VALUES ?`;
    const [{ insertId: questionId }] = await connection.query(
      insertPlaythroughQuestionsQuery,
      [selectedQuestions.map(({ id }) => [playthroughId, id])]
    );
    // Set first question as current playthrough question
    const setPlaythroughQuestionQuery = `UPDATE PLAYTHROUGH SET current_question_id = ? WHERE id = ?;`;
    await connection.query(setPlaythroughQuestionQuery, [
      questionId,
      playthroughId,
    ]);

    return callback({
      status: 200,
      message: "Successfully started playthrough.",
      playthroughId,
      questionId,
    });
  } catch (error) {
    console.error("Error starting playthrough: ", error);
    return callback({
      status: 500,
      message: "Internal error while attempting to start playthrough.",
    });
  }
}

async function savePlaythroughProgress(playthroughId, questionId, choiceId, callback) {
  try {
    // Update playthrough question 
    const connection = await mysql.createConnection(connectionParams);
    const updatePlaythroughQuestionQuery = `UPDATE PLAYTHROUGH_QUESTION SET selected_choice_id = ? WHERE id = ?`;
    await connection.query(updatePlaythroughQuestionQuery, [choiceId, questionId]);
    // Get next playthrough question
    const nextPlaythroughQuestionQuery = `SELECT * FROM PLAYTHROUGH_QUESTION WHERE id = ? AND playthrough_id = ?`;
    const nextQuestionId = (+questionId) + 1;
    const [[nextQuestion]] = await connection.query(
      nextPlaythroughQuestionQuery,
      [nextQuestionId, playthroughId]
    );
    // Update playthrough with next question (null if no more questions)
    const updatePlaythroughQuery = `UPDATE PLAYTHROUGH SET current_question_id = ?, is_complete = ? WHERE id = ?`;
    await connection.query(updatePlaythroughQuery, [
      nextQuestion ? nextQuestion.id : null,
      nextQuestion ? 0 : 1,
      playthroughId,
    ]);
  } catch (error) {
    console.error("Error retrieving playthrough questions: ", error);
    return callback({
      status: 500,
      message:
        "Internal error while attempting to retrieve playthrough questions.",
    });
  }
}

async function getPlaythroughQuestions(uuid, playthroughId, callback) {
  try {
    const connection = await mysql.createConnection(connectionParams);
    // Get latest playthrough for user
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[user]] = await connection.query(getUserByUUIDQuery, uuid);
    const getPlaythroughQuery = `SELECT id, current_question_id FROM PLAYTHROUGH WHERE id = ? AND user_id = ? ORDER BY ID DESC LIMIT 1`;
    const [[playthrough]] = await connection.query(getPlaythroughQuery, [
      playthroughId,
      user.id
    ]);
    // Get playthrough questions with question text
    const getPlaythroughQuestionsQuery = `
      SELECT PTQ.id as id, Q.id as question_id, Q.question as text
      FROM PLAYTHROUGH_QUESTION AS PTQ, QUESTION AS Q 
      WHERE PTQ.playthrough_id = ? AND PTQ.question_id = Q.id
      ORDER BY id ASC
    `;
    const [questions] = await connection.query(getPlaythroughQuestionsQuery, [
      playthrough.id,
    ]);
    return callback({
      status: 200,
      message: "Successfully retrieved playthrough questions",
      playthrough,
      questions,
    });
  } catch (error) {
    console.error("Error retrieving playthrough questions: ", error);
    return callback({
      status: 500,
      message:
        "Internal error while attempting to retrieve playthrough questions.",
    });
  }
}

module.exports = {
  getQuestions,
  getChoices,
  updateQuestion,
  updateChoice,
  deleteQuestion,
  getPlaythrough,
  startPlaythrough,
  savePlaythroughProgress,
  getPlaythroughQuestions,
};
