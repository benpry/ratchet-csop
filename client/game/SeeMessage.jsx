import React from "react";

export default class SeeMessage extends React.Component {

  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  render() {
    const { player, round, chains } = this.props;

    const myMessage = player.round.get("receivedMessage")
    return (
      <div className="see-message">
        Today, you will assign students to rooms and try to maximize their happiness with the rooms they were assigned.
        {myMessage ? 
          <div className="messageContent">
          Here is a message from a previous participant to help you solve the task:

          <div className="messageText">
            {myMessage}
          </div>
        </div>
        :
          <div className="messageContent">
            You are the first player to try this task, so nobody else has left a message for you! 
          </div>
        }
        <br/>
        <button type="button" onClick={this.handleSubmit}>
          Continue
        </button>
      </div>
    )
  }
}
