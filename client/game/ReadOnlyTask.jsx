import React from "react";
import { HTMLTable } from "@blueprintjs/core";

class ReadOnlyStudent extends React.Component {
  
    render() {
      const { student } = this.props;
  
      return (
        <div className="student">
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
              <path
                d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"
              />
            </svg>
          </span>
          <span className="letter">{student}</span>
        </div>
      );
    }
}


class ReadOnlyRoom extends React.Component {
  render() {
    const { room, students } = this.props;

    return (
      <div className="bp3-card room" >
        <h6 className="bp3-heading">Room {room}</h6>
          {students.map((student) => (
            <ReadOnlyStudent
              key={student}
              student={student}
            />
          ))}
      </div>    
    )
  }
}


export default class ReadOnlyTask extends React.Component {

  render() {
    const { rooms, constraints, score, payoff } = this.props;

    const students = {}
    Object.keys(rooms).forEach((room) => {
      rooms[room].forEach((roomStudent) => {
        students[roomStudent] = room
      })
    })

    // things I need here: passing in constraints, passing in score (this should probably be saved at the end of the task)
    return (
      <div className="task">
        <div className="left">
          <div className="score">
            <h5 className="bp3-heading">Score</h5>
            <h2 className="bp3-heading">{score}</h2>     
          </div>

          <div className="constraints">
            <h5 className="bp3-heading">Constraints</h5>
            <ul>
              {constraints.map((constraint) => {
                const failed = constraint.failed;
                return (
                  <li key={constraint._id} className={failed ? "failed" : ""}>
                    {failed ? (
                      <span className="bp3-icon-standard bp3-icon-cross" />
                    ) : (
                      <span className="bp3-icon-standard bp3-icon-dot" />
                    )}
                    {constraint.pair.join(" and ")} {constraint.text}.
                  </li>
                  );
              })}
            </ul>
          </div>

          <div className="payoff">
            <h5 className="bp3-heading">Payoff</h5>
            <HTMLTable className="bp3-table">
              <thead>
                <tr>
                  <th>Rooms</th>
                  {Object.keys(rooms).map((room) => (
                    <th key={room}>{room}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(students).sort().map((student) => (
                  <tr key={student}>
                    <th>Student {student}</th>
                    {Object.keys(rooms).map((room) => (
                      <td
                        className={
                          students[student] === room
                            ? "active"
                            : null
                        }
                        key={room}
                      >
                        {payoff[student][room]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </div>
        </div>
        <div className="board">
          <div className="all-rooms">
            <div className="rooms">
              {Object.keys(rooms).map(room => (
                <ReadOnlyRoom
                  key={room}
                  room={room}
                  students={rooms[room]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
