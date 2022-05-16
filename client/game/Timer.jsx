import React from "react";

import {StageTimeWrapper} from "meteor/empirica:core";
import Timer from "./Timer.jsx";

class timer extends React.Component {
  render() {
    const { remainingSeconds, stage } = this.props;
    const minutes = ("0" + Math.floor(remainingSeconds / 60)).slice(-2);
    const seconds = ("0" + (remainingSeconds - minutes * 60)).slice(-2);
    const duration = stage.durationInSeconds
    const propDone = Math.round((1 - remainingSeconds / duration) * 100)
      
    const classes = ["timer"];
    if (remainingSeconds <= 5) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 10) {
      classes.push("lessThan10");
    }

    return (
      <div className={classes.join(" ")}>
        <h5 className='bp3-heading'>Timer</h5>
        <span className="seconds">{minutes}:{seconds}</span>
        <div className="progress-bar-outline">
          <div
           className="progress-bar"
           style={{width: `${propDone}%`}}
          />
        </div>
      </div>
    );
  }
}

export default (Timer = StageTimeWrapper(timer));
