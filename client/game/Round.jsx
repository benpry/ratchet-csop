import React from "react";
import PassMessage from "./PassMessage.jsx";
import SeeMessage from "./SeeMessage.jsx";

import SocialInteractions from "./SocialInteractions.jsx";
import Task from "./Task.jsx";

const roundSound = new Audio("experiment/round-sound.mp3");
const gameSound = new Audio("experiment/bell.mp3");

export default class Round extends React.Component {
  componentDidMount() {
    const { game } = this.props;
    if (game.get("justStarted")) {
      //play the bell sound only once when the game starts
      gameSound.play();
      game.set("justStarted", false);
    } else {
      roundSound.play();
    }
  }

  render() {
    const { stage, round, player, game } = this.props;

    return (
      <div className="round">
        {stage.name == "seeMessage" ? (
          <SeeMessage stage={stage} round={round} player={player} game={game} />
        ) : stage.name == "passMessage" ? (
          <PassMessage stage={stage} round={round} player={player} game={game} />
        ) : (
          <Task stage={stage} round={round} player={player} game={game} />
        )}
        {/*game.player.length is a better check for social interaction than 'game.treatment.playerCount > 1' because of the lobby --> ignor settings*/}
        {game.players.length > 1 ? (
          <SocialInteractions game={game} stage={stage} player={player} />
        ) : null}
      </div>
    );
  }
}
