"use strict";

const { dbUserTable } = require("./constants");
const { connection } = require("./db");

const numQuestions = 10; //Questions per round

//Get questions
async function getQuestions(res) {
  try {
    const [row] = await connection.execute("SELECT * FROM QUESTION");
    return res.send(row);
  } catch (error) {
    console.error(error);
    res.send({ status: 500, message: "Internal server error." });
  }
}

//Get choices
async function getChoices(questionID, res) {
  try {
    var [row] = await connection.execute(
      "SELECT * FROM CHOICE WHERE question_id = " + questionID
    );
    if (row == 0) {
      return res.send({ status: 200, message: "No choice found." });
    }
    res.send(row);
  } catch (error) {
    console.error(error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

//Get choice by choice_id
async function getChoiceByID(choice_id, res) {
  try {
    var [row] = await connection.execute(
      "SELECT * FROM CHOICE WHERE id = " + choice_id
    );
    if (row == 0) {
      return res.send({ status: 200, message: "No choice found." });
    }
    res.send(row);
  } catch (error) {
    console.error(error);
    return callback({ status: 500, message: "Internal server error." });
  }
}

//Add or update new question
async function updateQuestion(questionText, questionID, callback) {
  try {
    if (!questionText) {
      return callback({
        status: 400,
        message: "No question typed in.",
      });
    }
    var checkQuestionID = "SELECT * FROM QUESTION WHERE id = ? LIMIT 1;";
    var checkQuestionText =
      "SELECT * FROM QUESTION WHERE question = ? LIMIT 1;";
    var updateQuestion = "UPDATE QUESTION SET question = ? WHERE id = ?";
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
async function updateChoice(questionID, optionID, text, envi, comf, callback) {
  try {
    if (!questionID) {
      return callback({
        status: 400,
        message: "No question selected.",
      });
    }
    if (!envi || !comf || !text) {
      return callback({
        status: 400,
        message: "Input is not complete.",
      });
    }
    var checkOption = "SELECT * FROM CHOICE WHERE question_id = ? AND id = ?";
    var updateOption =
      "UPDATE CHOICE SET text = ?, env_pt = ?, com_pt = ? WHERE question_id = ? AND id = ?";
    var insertOption =
      "INSERT CHOICE (question_id, text, env_pt, com_pt) values (?, ?, ?, ?)";
    var [existingOption] = await connection.query(checkOption, [
      questionID,
      optionID,
    ]);
    if (existingOption.length == 1) {
      await connection.query(updateOption, [
        text,
        envi,
        comf,
        questionID,
        optionID,
      ]);
      return callback({
        status: 200,
        message: "Choice updated.",
      });
    }
    await connection.query(insertOption, [questionID, text, envi, comf]);
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
  try {
    if (!optionID) {
      // To solve FK constraints, cascade delete
      let [row] = await connection.execute(
        "SELECT * FROM PLAYTHROUGH_QUESTION WHERE question_id = " + questionID
      );
      for (let i = 0; i < row.length; i++) {
        await connection.execute(
          "UPDATE PLAYTHROUGH SET current_question_id = NULL WHERE current_question_id = " +
          row[i].id
        );
        await connection.execute(
          "DELETE FROM PLAYTHROUGH_QUESTION WHERE id = " + row[i].id
        );
      }
      await connection.execute(
        "DELETE FROM PLAYTHROUGH_QUESTION WHERE question_id = " + questionID
      );

      await connection.execute(
        "DELETE FROM CHOICE WHERE question_id = " + questionID
      );
      await connection.execute("DELETE FROM QUESTION WHERE id = " + questionID);
      return res.send({ status: 204, message: "Question deleted." });
    }
    await connection.execute(
      "DELETE FROM PLAYTHROUGH_QUESTION WHERE question_id = " +
      questionID +
      " AND selected_choice_id = " +
      optionID
    ); //To solve FK constraints, cascade delete
    await connection.execute(
      "DELETE FROM CHOICE WHERE question_id = " +
      questionID +
      " AND id = " +
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

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

async function getPlaythrough(uuid, callback) {
  try {
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[user]] = await connection.query(getUserByUUIDQuery, uuid);
    const getLatestPlaythroughQuery = `SELECT * FROM PLAYTHROUGH WHERE user_id = ? ORDER BY ID DESC LIMIT 1 `;
    const [[playthrough]] = await connection.query(getLatestPlaythroughQuery, [
      user.id,
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
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[user]] = await connection.query(getUserByUUIDQuery, uuid);
    const insertPlaythroughQuery = `INSERT INTO PLAYTHROUGH (user_id) VALUES (?)`;
    const [{ insertId: playthroughId }] = await connection.query(
      insertPlaythroughQuery,
      [user.id]
    );
    // Insert randomized questions into playthrough questions
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

async function savePlaythroughProgress(
  playthroughId,
  questionId,
  choiceId,
  callback
) {
  try {
    // Update playthrough question
    const updatePlaythroughQuestionQuery = `UPDATE PLAYTHROUGH_QUESTION SET selected_choice_id = ? WHERE id = ?`;
    await connection.query(updatePlaythroughQuestionQuery, [
      choiceId,
      questionId,
    ]);
    // Get next playthrough question
    const nextPlaythroughQuestionQuery = `SELECT * FROM PLAYTHROUGH_QUESTION WHERE id = ? AND playthrough_id = ?`;
    const nextQuestionId = +questionId + 1;
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
    return callback({
      status: 200,
      message: "Successfully saved playthrough progress.",
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

async function getPlaythroughQuestions(uuid, playthroughId, callback) {
  try {
    // Get latest playthrough for user
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[user]] = await connection.query(getUserByUUIDQuery, uuid);
    const getPlaythroughQuery = `SELECT id, current_question_id FROM PLAYTHROUGH WHERE id = ? AND user_id = ? ORDER BY ID DESC LIMIT 1`;
    const [[playthrough]] = await connection.query(getPlaythroughQuery, [
      playthroughId,
      user.id,
    ]);
    // Get playthrough questions with question text
    const getPlaythroughQuestionsQuery = `
      SELECT PTQ.selected_choice_id, PTQ.id as id, Q.id as question_id, Q.question as text
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

async function saveEnding(uuid, callback) {
  try {
    // Get user's latest completed playthrough with total points
    const getUserByUUIDQuery = `SELECT id FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [[{ id: user_id }]] = await connection.query(getUserByUUIDQuery, [
      uuid,
    ]);
    const query = `
    SELECT SUM(env_pt) as env_pts, SUM(com_pt) as com_pts, playthrough_id
    FROM PLAYTHROUGH_QUESTION, CHOICE 
    WHERE selected_choice_id = CHOICE.id AND playthrough_id = (
      SELECT id FROM PLAYTHROUGH 
      WHERE is_complete = 1 AND user_id = ?
      ORDER BY id DESC LIMIT 1)
    GROUP BY playthrough_id;`;
    const [[{ env_pts, com_pts, playthrough_id }]] = await connection.query(
      query,
      [user_id]
    );
    // Get the first endings in each category which had their threshold exceeded
    const getEndingsQuery = "SELECT * FROM ENDING ORDER BY threshold ASC";
    const [endings] = await connection.query(getEndingsQuery);
    const comfortEnding = endings.find(
      (ending) => ending.type === "comfort" && ending.threshold > com_pts
    );
    const environmentEnding = endings.find(
      (ending) => ending.type === "environment" && ending.threshold > env_pts
    );
    // Format data for insertion into earned_endings
    // user_id | playthrough_id | ending_id | earned_points
    const earnedEndings = [
      [user_id, playthrough_id, comfortEnding.id, 50 + parseInt(com_pts)],
      [user_id, playthrough_id, environmentEnding.id, 50 + parseInt(env_pts)],
    ];
    const insertEndingsQuery =
      "INSERT INTO EARNED_ENDING (user_id, playthrough_id, ending_id, earned_points) VALUES ?";
    await connection.query(insertEndingsQuery, [earnedEndings]);

    return callback({
      status: 200,
      message: "Successfully saved ending.",
    });
  } catch (error) {
    console.error("Error saving the ending: ", error);
    return callback({
      status: 500,
      message: "Internal error while attempting to save ending.",
    });
  }
}

async function getLatestEndings(uuid, callback) {
  try {
    const query = `
    SELECT * 
    FROM earned_ending, ending 
    WHERE user_id = (
	    SELECT id
	    FROM ${dbUserTable}
      WHERE uuid = ?
    )
    AND ending_id = ending.id
    ORDER BY playthrough_id DESC LIMIT 2
    `;
    const [endings] = await connection.query(query, [uuid]);
    return callback({
      status: 200,
      message: "Successfully retrieved endings.",
      endings,
    });
  } catch (error) {
    console.error("Error retrieving the latest endings: ", error);
    return callback({
      status: 500,
      message:
        "Internal error while attempting to retrieve the latest endings.",
    });
  }
}

//Return endings the user has earned.
async function endingsEarned(uuid, callback) {
  try {
    const getUserByIdQuery = `SELECT * FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [users] = await connection.query(getUserByIdQuery, [uuid]);
    const [endings] = await connection.execute(
      "SELECT DISTINCT ending_id, type, threshold, text FROM EARNED_ENDING, ENDING WHERE ending_id = ending.id AND user_id = " +
      users[0].id
    );
    return callback({
      status: 200,
      message: "Successfully retrieved earned endings.",
      endings,
    });
  } catch (error) {
    console.error("Error retrieving earned endings: ", error);
    return callback({
      status: 500,
      message: "Internal error while attempting to retrieve earned endings.",
    });
  }
}

//Return endings the user has earned.
async function endingsEarned(uuid, callback) {
  try {
    const getUserByIdQuery = `SELECT * FROM ${dbUserTable} WHERE uuid = ? LIMIT 1;`;
    const [users] = await connection.query(getUserByIdQuery, [uuid]);
    const [endings] = await connection.execute(
      "SELECT DISTINCT ending_id, type, threshold, text FROM EARNED_ENDING, ENDING WHERE ending_id = ending.id AND user_id = " +
      users[0].id
    );
    return callback({
      status: 200,
      message: "Successfully retrieved earned endings.",
      endings,
    });
  } catch (error) {
    console.error("Error retrieving earned endings: ", error);
    return callback({
      status: 500,
      message: "Internal error while attempting to retrieve earned endings.",
    });
  }
}

module.exports = {
  getQuestions,
  getChoices,
  getChoiceByID,
  updateQuestion,
  updateChoice,
  deleteQuestion,
  getPlaythrough,
  startPlaythrough,
  savePlaythroughProgress,
  getPlaythroughQuestions,
  saveEnding,
  getLatestEndings,
  endingsEarned,
};
