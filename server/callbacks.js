import Empirica from "meteor/empirica:core";
import { ChainCollection } from "../shared/ChainCollection";

const setBusy = (currChain) => {
  ChainCollection.update(currChain._id, {
    $set: {
      busy: true
    }
  })
};

const updateMessageHistory = (chainIdx, taskId, message) => {
  // get the chain
  const chain = ChainCollection.findOne({idx: chainIdx, taskId: taskId})
  // add the message to the message history
  chain.messageHistory.push(message)

  ChainCollection.update(chain._id, {
    $set: {
      messageHistory: chain.messageHistory
    }
  });
}

const completeChain = (chainIdx, taskId) => {
    // get the chain
    const chain = ChainCollection.findOne({idx: chainIdx, taskId: taskId})
    ChainCollection.update(chain._id, {
      $set: {
        nCompletions: chain.nCompletions + 1,
        busy: false
      }
    });
}

// //// Avatar stuff //////

// onGameStart is triggered opnce per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game) => {
  const players = game.players;
  console.debug("game ", game._id, " started");

  const names = [
    "Blue",
    "Green",
    "Pink",
    "Yellow",
    "Purple",
    "Red",
    "Turqoise",
    "Gold",
    "Grey",
    "Magenta",
  ]; // for the players names to match avatar color
  const avatarNames = [
    "Colton",
    "Aaron",
    "Alex",
    "Tristan",
    "Daniel",
    "Jill",
    "Jimmy",
    "Adam",
    "Flynn",
    "Annalise",
  ]; // to do more go to https://jdenticon.com/#icon-D3
  const nameColor = [
    "#3D50B7",
    "#70A945",
    "#DE8AAB",
    "#A59144",
    "#DER5F4",
    "#EB8TWV",
    "#N0WFA4",
    "#TP3BWU",
    "#QW7MI9",
    "#EB8TWj",
  ]; // similar to the color of the avatar

  players.forEach((player, i) => {
    player.set("name", names[i]);
    player.set("avatar", `/avatars/jdenticon/${avatarNames[i]}`);
    player.set("nameColor", nameColor[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
  });
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  const players = game.players;
  console.debug("Round ", stage.name, "game", game._id, " started");
  const team = game.get("team");
  console.log("is it team?", team);

  // if this is a CSOP task, set up the task
  if (stage.name === "seeMessage") {
    // Before the see message stage, assign the player to a chain
    game.players.forEach((player) => {
      const taskChains = ChainCollection.find({taskId: round.get("taskId"), busy: false}, {sort: {nCompletions: 1}}).fetch();
      const minCompletions = Math.min(...taskChains.map(x => x.nCompletions));
      const minCompletionChains = taskChains.filter(x => x.nCompletions === minCompletions);
      const assignedChain = minCompletionChains[Math.floor(Math.random()*minCompletionChains.length)];
      setBusy(assignedChain);
      player.round.set("taskId", round.get("taskId"))
      player.round.set("chainPosition", assignedChain.nCompletions);
      player.round.set("chainIdx", assignedChain.idx);
      if (assignedChain.messageHistory.length > 0) {
        player.round.set("receivedMessage", assignedChain.messageHistory[assignedChain.messageHistory.length - 1])
      } else {
        player.round.set("receivedMessage", null)
      }
    })
  } else if (stage.name === "practice" || stage.name === "test") {
    //initiate the score for this round (because everyone will have the same score, we can save it at the round object
    stage.set("score", 0);
    stage.set("chat", []); //todo: I need to check if they are in team first
    stage.set("log", [
      {
        verb: "roundStarted",
        roundId:
          stage.name === "practice"
            ? stage.name + " (will not count towards your score)"
            : stage.name,
        at: new Date(),
      },
    ]);
    stage.set("intermediateSolutions", []);

    const task = stage.get("task");
    task.students.forEach((student) => {
      stage.set(`student-${student}-room`, "deck");
      stage.set(`student-${student}-dragger`, null);
    });

    players.forEach((player) => {
      player.set("satisfied", false);
    });

    //there is a case where the optimal is found, but not submitted (i.e., they ruin things)
    stage.set("optimalFound", false); //the optimal answer wasn't found
    stage.set("optimalSubmitted", false); //the optimal answer wasn't submitted
  }
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage) => {
  console.debug("Round ", stage.name, "game", game._id, " ended");

  if (stage.name === "practice" || stage.name === "test") {
    const currentScore = stage.get("score");
    const optimalScore = stage.get("task").optimal;

    if (currentScore === optimalScore) {
      if (stage.name !== "practice") {
        game.set("nOptimalSolutions", game.get("nOptimalSolutions") + 1);
      }
      stage.set("optimalSubmitted", true);
      console.log("You found the optimal");
    }

    //add the round score to the game total cumulative score (only if it is not practice)
    if (stage.name !== "practice") {
      const cumScore = game.get("cumulativeScore") || 0;
      const scoreIncrement = currentScore > 0 ? Math.round(currentScore) : 0;
      game.set("cumulativeScore", Math.round(scoreIncrement + cumScore));
    }

    game.players.forEach(player => {
      player.round.set("timeRemaining", player.stage.get("submittedAt"))

      if (player.get("finalAssignment") == undefined) {
        // update the game state to make sure the information we save is accurate
        updateAssignment(stage)
        // build up final representation of game state
        const roomInfo = {}
        const task = stage.get("task");
        task.rooms.forEach((room) => {
          const roomStudents = []
          task.students.forEach((student) => {
            console.log(stage.get(`student-${student}-room`))
            if (stage.get(`student-${student}-room`) === room) {
              roomStudents.push(student);
            }
          });
          roomInfo[room] = roomStudents
        });
        const violatedConstraints = stage.get("violatedConstraints") || [];
        const constraints = task.constraints.map((constraint) => {
          return {
            _id: constraint._id,
            failed: violatedConstraints.includes(constraint._id),
            pair: constraint.pair,
            text: constraint.text
          }
        });
        const score = stage.get("score");

        player.round.set("finalAssignment", {rooms: roomInfo, constraints: constraints, score: score, payoff: task.payoff, optimal: task.optimal})
        player.round.set("remainingSeconds", 0)
      }
    })

  } else if (stage.name === "passMessage") {
    // After the pass message stage is over, update the chain and make it no longer busy
    game.players.forEach((player) => {
      updateMessageHistory(player.round.get("chainIdx"), round.get("taskId"), player.round.get("passedMessage"));
      completeChain(player.round.get("chainIdx"), round.get("taskId"));  
    })
  }

});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round) => {
  const conversionRate = game.treatment.conversionRate
  const optimalSolutionBonus = game.treatment.optimalSolutionBonus
  const timeConversionRate = game.treatment.timeConversionRate
  
  game.players.forEach((player) => {
    const assignment = player.round.get("finalAssignment")
    const remainingSeconds = player.round.get("remainingSeconds")
    const score = parseInt(assignment.score)

    const bonus = score > 0 ?
      (score * conversionRate +
      (+ (score === assignment.optimal)) * optimalSolutionBonus + ((remainingSeconds / 60) * timeConversionRate)).toFixed(2)
    : 0;
    
    player.round.set("roundBonus", bonus)
  })
});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game) => {
  const players = game.players;
  console.debug("The game", game._id, "has ended");
  //computing the bonus for everyone (in this game, everyone will get the same value)
  const conversionRate = game.treatment.conversionRate
    ? game.treatment.conversionRate
    : 1;

  const optimalSolutionBonus = game.treatment.optimalSolutionBonus
    ? game.treatment.optimalSolutionBonus
    : 0;

  const bonus =
    game.get("cumulativeScore") > 0
      ? (
          game.get("cumulativeScore") * conversionRate +
          game.get("nOptimalSolutions") * optimalSolutionBonus
        ).toFixed(2)
      : 0;

  players.forEach((player) => {
    if (player.get("bonus") === 0) {
      //if we never computed their bonus
      player.set("bonus", bonus);
      player.set("cumulativeScore", game.get("cumulativeScore"));
    }
  });
});

// ===========================================================================
// => onSet, onAppend and onChanged ==========================================
// ===========================================================================

// onSet, onAppend and onChanged are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
Empirica.onSet(
  (
    game,
    round,
    stage,
    player, // Player who made the change
    target, // Object on which the change was made (eg. player.set() => player)
    targetType, // Type of object on which the change was made (eg. player.set() => "player")
    key, // Key of changed value (e.g. player.set("score", 1) => "score")
    value, // New value
    prevValue // Previous value
  ) => {
    const players = game.players;
    //someone changed their satisfaction status
    console.log("key", key);
    if (key === "satisfied") {
      //check if everyone is satisfied and if so, submit their answer
      let allSatisfied = true;
      players.forEach((player) => {
        allSatisfied = player.get("satisfied") && allSatisfied;
      });
      if (allSatisfied) {
        players.forEach((player) => {
          player.stage.submit();
        });
      }
      return;
    }

    //someone placed a student to a room
    if (key.substring(0, 8) === "student-" && key.slice(-4) === "room") {
      const task = stage.get("task");
      let assignments = { deck: [] };
      task.rooms.forEach((room) => {
        assignments[room] = [];
      });

      //find the rooms for each player
      task.students.forEach((student) => {
        const room = stage.get(`student-${student}-room`);
        assignments[room].push(student);
      });

      //check for constraint violations
      const violationIds = getViolations(stage, assignments);
      stage.set("violatedConstraints", violationIds);

      //get score if there are no violations, otherwise, the score is 0
      const currentScore =
        assignments["deck"].length === 0
          ? getScore(task, assignments, violationIds.length)
          : 0;
      //console.debug("currentScore", currentScore);
      stage.set("score", currentScore || 0);

      if (currentScore === task.optimal) {
        stage.set("optimalFound", true);
      }

      //keep track of solution, scores, and violated constraints
      //TODO: eventually this should have the 'log' parameter so it is not sent to the UI
      //TODO: how about I store everything here, and that's it! less data
      stage.append("intermediateSolutions", {
        solution: assignments,
        at: new Date(),
        violatedConstraintsIds: violationIds,
        nConstraintsViolated: violationIds.length,
        score: getScore(task, assignments, violationIds.length),
        optimalFound: currentScore === task.optimal,
        completeSolution: assignments["deck"].length === 0,
        completeSolutionScore: currentScore,
      });
    }
  }
);

//helpers
function getScore(task, assignments, nViolations) {
  let score = 0;
  Object.keys(assignments).forEach((room) => {
    assignments[room].forEach((student) => {
      score += task.payoff[student][room];
    });
  });
  return score - nViolations * 100;
}

function find_room(assignments, student) {
  return Object.keys(assignments).find((room) =>
    assignments[room].includes(student)
  );
}

function getViolations(stage, assignments) {
  // console.debug("assignments ", assignments);
  const task = stage.get("task");
  const violatedConstraintsIds = [];

  task.constraints.forEach((constraint) => {
    const firstStudentRoom = find_room(assignments, constraint.pair[0]);
    const secondStudentRoom = find_room(assignments, constraint.pair[1]);

    if (firstStudentRoom !== "deck" && secondStudentRoom !== "deck") {
      switch (constraint.type) {
        case 0:
          //they are not in the same room, when they should've
          if (firstStudentRoom !== secondStudentRoom) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are not in the same room, when they should've"
            // );
            violatedConstraintsIds.push(constraint._id);
          }
          break;
        case 1:
          //they are in the same room, when they shouldn't
          if (firstStudentRoom === secondStudentRoom) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are in the same room, when they shouldn't"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;
        case 2:
          //if they are not neighbors, when they should've been
          if (Math.abs(firstStudentRoom - secondStudentRoom) !== 1) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are not neighbors, when they should've been"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;
        case 3:
          if (Math.abs(firstStudentRoom - secondStudentRoom) < 2) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "can't live in the same room or be neighbors, so why are they?"
            // );
            violatedConstraintsIds.push(constraint._id);
          }
          break;
      }
    }
  });

  return violatedConstraintsIds;
}

const updateAssignment = (stage) => {
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });

  //find the rooms for each player
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });   

  //check for constraint violations
  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);

  //get score if there are no violations, otherwise, the score is 0
  const currentScore =
    assignments["deck"].length === 0
      ? getScore(task, assignments, violationIds.length)
      : 0;
  //console.debug("currentScore", currentScore);
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
}

// // onSet is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
// });
