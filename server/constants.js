//the data as string .. was generated by the code below:

export const stepOneData = [
  {
    payoff: {
      A: { 101: 53, 102: 77, 103: 75, 104: 36, 105: 24 },
      B: { 101: 44, 102: 39, 103: 66, 104: 44, 105: 39 },
      C: { 101: 31, 102: 35, 103: 65, 104: 21, 105: 76 },
      D: { 101: 48, 102: 66, 103: 30, 104: 37, 105: 80 },
      E: { 101: 66, 102: 78, 103: 27, 104: 74, 105: 48 },
      F: { 101: 82, 102: 31, 103: 67, 104: 76, 105: 37 },
      G: { 101: 56, 102: 25, 103: 37, 104: 47, 105: 24 },
      H: { 101: 73, 102: 55, 103: 42, 104: 69, 105: 34 }
    },
    _id: "0",
    difficulty: "Training - Hard",
    students: ["A", "B", "C", "D", "E", "F", "G", "H"],
    rooms: [101, 102, 103, 104, 105],
    constraints: [
      {
        _id: 0,
        type: 1,
        pair: ["C", "D"],
        text: "can't live in the same room"
      },
      { _id: 1, type: 2, pair: ["D", "E"], text: "must be neighbors" },
      {
        _id: 2,
        type: 3,
        pair: ["E", "H"],
        text: "can't live in the same room or be neighbors"
      },
      {
        _id: 3,
        type: 1,
        pair: ["F", "H"],
        text: "can't live in the same room"
      }
    ],
    optimal: 567,
    computeTime: 2.99,
    usedIn: "step1",
    study: "pilot2"
  },
  {
    payoff: {
      A: { 101: 46, 102: 55, 103: 36, 104: 23 },
      B: { 101: 32, 102: 53, 103: 46, 104: 67 },
      C: { 101: 29, 102: 37, 103: 40, 104: 53 },
      D: { 101: 62, 102: 79, 103: 78, 104: 56 },
      E: { 101: 22, 102: 46, 103: 60, 104: 36 },
      F: { 101: 60, 102: 30, 103: 59, 104: 28 }
    },
    _id: "1",
    difficulty: "Easy",
    students: ["A", "B", "C", "D", "E", "F"],
    rooms: [101, 102, 103, 104],
    constraints: [
      {
        _id: 0,
        type: 0,
        pair: ["C", "F"],
        text: "must live in the same room"
      },
      {
        _id: 1,
        type: 3,
        pair: ["D", "E"],
        text: "can't live in the same room or be neighbors"
      }
    ],
    optimal: 343,
    computeTime: 2.07,
    usedIn: "step1",
    study: "pilot2"
  }
];

export const stepTwoData = [
  {
    payoff: {
      A: { 101: 61, 102: 24, 103: 57, 104: 69, 105: 30, 106: 55 },
      B: { 101: 76, 102: 60, 103: 11, 104: 71, 105: 65, 106: 26 },
      C: { 101: 29, 102: 55, 103: 40, 104: 53, 105: 16, 106: 20 },
      D: { 101: 13, 102: 37, 103: 17, 104: 11, 105: 33, 106: 31 },
      E: { 101: 32, 102: 36, 103: 19, 104: 46, 105: 51, 106: 27 },
      F: { 101: 25, 102: 45, 103: 10, 104: 41, 105: 32, 106: 52 },
      G: { 101: 56, 102: 52, 103: 23, 104: 74, 105: 58, 106: 34 },
      H: { 101: 77, 102: 53, 103: 44, 104: 67, 105: 70, 106: 20 },
      I: { 101: 58, 102: 59, 103: 65, 104: 72, 105: 28, 106: 50 }
    },
    _id: "0",
    difficulty: "Training - Hard",
    students: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
    rooms: [101, 102, 103, 104, 105, 106],
    constraints: [
      {
        _id: 0,
        type: 3,
        pair: ["A", "I"],
        text: "can't live in the same room or be neighbors"
      },
      { _id: 1, type: 2, pair: ["B", "I"], text: "must be neighbors" },
      {
        _id: 2,
        type: 1,
        pair: ["C", "F"],
        text: "can't live in the same room"
      },
      { _id: 3, type: 2, pair: ["C", "G"], text: "must be neighbors" },
      { _id: 4, type: 2, pair: ["D", "G"], text: "must be neighbors" },
      {
        _id: 5,
        type: 3,
        pair: ["D", "I"],
        text: "can't live in the same room or be neighbors"
      },
      {
        _id: 6,
        type: 3,
        pair: ["E", "G"],
        text: "can't live in the same room or be neighbors"
      },
      {
        _id: 7,
        type: 0,
        pair: ["G", "H"],
        text: "must live in the same room"
      }
    ],
    optimal: 526,
    computeTime: 22.75,
    usedIn: "step2",
    study: "pilot2"
  },
  {
    payoff: {
      A: { 101: 10, 102: 47, 103: 32, 104: 20 },
      B: { 101: 78, 102: 65, 103: 46, 104: 37 },
      C: { 101: 35, 102: 59, 103: 41, 104: 53 },
      D: { 101: 40, 102: 65, 103: 12, 104: 43 },
      E: { 101: 18, 102: 39, 103: 40, 104: 78 },
      F: { 101: 22, 102: 51, 103: 57, 104: 40 }
    },
    _id: "1",
    difficulty: "Easy",
    students: ["A", "B", "C", "D", "E", "F"],
    rooms: [101, 102, 103, 104],
    constraints: [
      {
        _id: 0,
        type: 2,
        pair: ["B", "E"],
        text: "must be neighbors"
      },
      {
        _id: 1,
        type: 3,
        pair: ["C", "F"],
        text: "can't live in the same room or be neighbors"
      }
    ],
    optimal: 340,
    computeTime: 1.31,
    usedIn: "step2",
    study: "pilot2"
  }
];
