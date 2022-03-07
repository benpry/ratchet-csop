import React from "react";
import ReadOnlyTask from "./ReadOnlyTask";

export default class PassMessage extends React.Component {

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
    const { game, player, round} = this.props;
    const { message, populated } = this.state;

    const receivedMessage = player.round.get("receivedMessage");
    const assignment = player.round.get("finalAssignment")

    console.log("assignment")
    console.log(assignment)

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

        <div className="solutionReminder">
          <h2>Here is your solution again:</h2>
          <ReadOnlyTask 
            rooms={assignment.rooms}
            constraints={assignment.constraints}
            score={assignment.score}
            payoff={assignment.payoff}
          />
        </div>
      </div>
    )
  }
}
