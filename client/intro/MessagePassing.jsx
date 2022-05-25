import React from "react";

import { Centered } from "meteor/empirica:core";

export default class MessagePassing extends React.Component {
  render() {
    const { hasPrev, hasNext, onNext, onPrev, treatment } = this.props;
    const social = treatment.playerCount > 1;
    
  return (
      <Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Message Passing </h1>

          <p>
            Before each task, you may see a message from a previous participant. <strong>This participant completed the same
            task as you and wrote the message to help you do well on the task</strong>. You will be able to see this message
            as you work on the task, do don't worry about memorizing it before starting. 
          </p>

          <p>
            After completing the task, you will be prompted to write a message to the next player who attempts the task.
            Your goal is to help them do as well on the task as possible. <strong>The next participant's bonus will be added to your bonus</strong>,
            so make sure you send a good message! <strong>You can write anything you want</strong> and there is no limit to the length of your message. 
            The next participant will only be able to see your message, not the message that the previous participant left for you.  
          </p>

          <button
            type="button"
            className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-align-right" />
          </button>
        </div>
      </Centered>
    );
  }
}
