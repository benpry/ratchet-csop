import React from "react";
import { Meteor }  from "meteor/meteor";
import { ChainCollection } from "../../shared/ChainCollection";
import { withTracker } from "meteor/react-meteor-data";

export default class PassMessage extends React.Component { 
  render() {
    return (
      <div className="nullContainer">
        <PassMessageContents {...this.props}/>
      </div>
    )
  }
}

class PassMessagePage extends React.Component {

  state = {message: "", populated: false};

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { player } = this.props;
    player.round.set("passedMessage", this.state.message);
    player.stage.submit();
  };

  componentDidUpdate() {
    const { game, player, loading, chains } = this.props;
    const { message, populated } = this.state;
    if (!loading && !populated) {
      this.setState({populated: true})
    }
  }

  render() {
    const { game, player, round, chains, loading } = this.props;
    const { message, populated } = this.state;

    if (loading) {
      return <div>Loading...</div>
    } else {

      const myChain = chains.filter(x => x.idx === player.round.get("chainIdx") && x.taskId === round.get("taskId"))[0]
      let receivedMessage;
      if (myChain.messageHistory.length > 0 && myChain.messageHistory[myChain.messageHistory.length - 1]) {
        receivedMessage = myChain.messageHistory[myChain.messageHistory.length - 1]
      }

      return (
        <div className="pass-message">
          <div className="instruction-message">
            Now, you can send a message to the next participant who tries this task to help them do as well as possible.<br/>
            Remember that you will receive a bonus based on the next player's performance.<br/>
            The next person will only be able to see your message, not the message you saw at the beginning of the task.<br/>

            {receivedMessage && receivedMessage.length > 0 ? 
              <p>The message you received was <br/>"{receivedMessage}".</p>
            : null }
          </div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <textarea
                id="message"
                type="text"
                dir="auto"
                name="message"
                value={message}
                onChange={this.handleChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }
  }
}

PassMessageContents = withTracker(rest => {
  const loading = !Meteor.subscribe("chains").ready()
  if (loading) {
    return { loading }
  }

  // get the chains
  const chains = ChainCollection.find({}).fetch()

  return {
    chains
  }
})(PassMessagePage);
