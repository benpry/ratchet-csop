import React from "react";
import { Meteor }  from "meteor/meteor"
import { ChainCollection } from "../../shared/ChainCollection";
import { withTracker } from "meteor/react-meteor-data"

export default class SeeMessage extends React.Component {
  render() {
    return (
      <div className="nullContainer">
        <SeeMessageContents {...this.props}/>
      </div>
    )
  }
}

class SeeMessagePage extends React.Component {

  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  render() {
    const { player, game, round, chains, loading, onNext, hasNext } = this.props;

    if (loading) {
      return <div>Loading...</div>
    } else {

      const myChain = chains.filter(x => x.idx === player.round.get("chainIdx") && x.taskId === round.get("taskId"))[0]
      return (
        <div className="see-message">
          Today, you will assign students to rooms and try to maximize their happiness with the rooms they were assigned.
          {myChain.messageHistory.length === 0 ? 
            <div className="messageContent">
              You are the first player to try this task, so nobody else has left a message for you! 
            </div>
        :
            <div className="messageContent">
              Here is a message from a previous participant to help you solve the task:

              <div className="messageText">
                {myChain.messageHistory[myChain.messageHistory.length - 1]}
              </div>
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
}

SeeMessageContents = withTracker(rest => {
  const loading = !Meteor.subscribe("chains").ready()
  if (loading) {
    return { loading }
  }

  // get the chains
  const chains = ChainCollection.find({}).fetch()

  return {
    chains
  }
})(SeeMessagePage);