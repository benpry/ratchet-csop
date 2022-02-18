import Empirica from "meteor/empirica:core";

import "./callbacks.js";
import "./bots.js";
import { stepOneData, stepTwoData } from "./constants";

// imports for dealing with chains
import { ChainCollection } from "../shared/ChainCollection";
import { Meteor } from "meteor/meteor";


// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.

// the number of chains to use per concept
N_CHAINS = 1;

const createConditionChain = (condition) => {
  const createChain = (chainIdx) => {
    ChainCollection.insert({
      idx: chainIdx,
      condition: condition,
      messageHistory: [],
      nCompletions: 0,
      busy: false
    });
  };
  return createChain;
};

const setBusy = (currChain) => {
  ChainCollection.update(currChain._id, {
    $set: {
      busy: true
    }
  })
};

// publish the chains
Meteor.publish("chains", function publishChains() {
  return ChainCollection.find({})
})

Empirica.gameInit((game, treatment) => {
  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
    _.pluck(game.players, "id")
  );

  //initiate the cumulative score for this game (because everyone will have the same score, we can save it at the game object
  game.set("cumulativeScore", 0); // the total score at the end of the game
  game.set("nOptimalSolutions", 0); // will count how many times they've got the optimal answer
  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  game.set("team", game.players.length > 1);

  const useChain = game.treatment.useChain;
  const condition = parseInt(game.treatment.condition);
  game.set("useChain", useChain)
  game.set("condition", condition)

  // If there are no chains for this condition, initialize some
  if (useChain && ChainCollection.find({condition: condition}).count() === 0 ) {
    [...Array(N_CHAINS).keys()].forEach(createConditionChain(condition))
  }

  if (useChain) {
    game.players.forEach((player, i) => {
      const conditionChains = ChainCollection.find({condition: condition, busy: false}, {sort: {nCompletions: 1}}).fetch();
      const minCompletions = Math.min(...conditionChains.map(x => x.nCompletions));
      const minCompletionChains = conditionChains.filter(x => x.nCompletions === minCompletions);
      const assignedChain = minCompletionChains[Math.floor(Math.random()*minCompletionChains.length)];
      setBusy(assignedChain);
      player.set("chainPosition", assignedChain.nCompletions)
      player.set("chainIdx", assignedChain.idx);
    });  
  }

  //we don't know the sequence yet
  let taskSequence = game.treatment.stepOne ? stepOneData : stepTwoData;

  if (game.treatment.shuffleTaskOrder) {
    //TODO: I need to make sure that I keep the first task fixed (if it has training)
    //taskSequence = _.shuffle(taskSequence); //this is full shuffle
    taskSequence = customShuffle(taskSequence); //this is with keeping the first practice round fixed
  }

  //we'll have 1 round, each task is one stage
  const round = game.addRound();
  const practiceStage = round.addStage({
    name: "practice",
    displayName: "Practice Round",
    durationInSeconds: 300
  });
  if (useChain) {
    round.addStage({
      name: "seeMessage",
      displayName: "Instructional Message",
      durationInSeconds: 9999999999
    });  
  }
  practiceStage.set("task", taskSequence[0])
  const testStage = round.addStage({
    name: "test",
    displayName: "Main Round",
    displayName: "Main",
    durationInSeconds: game.treatment.stageDuration
  });
  if (useChain) {
    round.addStage({
      name: "passMessage",
      displayName: "Write a Message",
      durationInSeconds: 9999999999
    });  
  }
  testStage.set("task", taskSequence[1])
});

// fix the first practice task and shuffle the rest
//to learn more:
//https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
function customShuffle(taskSequence) {
  // Find and remove first and last:
  const practiceTask = taskSequence[0];

  const firstIndex = taskSequence.indexOf(practiceTask);

  if (firstIndex !== -1) {
    taskSequence.splice(firstIndex, 1);
  }

  // Normal shuffle with the remaining elements using ES6:
  for (let i = taskSequence.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));

    [taskSequence[i], taskSequence[j]] = [taskSequence[j], taskSequence[i]];
  }

  // Add them back in their new position:
  if (firstIndex !== -1) {
    taskSequence.unshift(practiceTask);
  }

  return taskSequence;
}
