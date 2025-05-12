{
  "comment": "Will transit slowly from one fp/scope to another",
  "declares": {
    "STARTING_POINT": [-1.25, 0],
    "STARTING_SCOPE": [3.0],
    "ENDING_POINT": [-1.95, 0],
    "ENDING_SCOPE": [0.125],
    "DURATION_MS": 100000
  },
  "steps": [
    {
      "comment": "Initialize starting position",
      "invoke": {
        "method": "set_position",
        "inputs": {
          "scope": "@STARTING_SCOPE",
          "focal_point": "@STARTING_POINT"
        }
      }
    },
    {
      "comment": "Move to the ending point",
      "invoke": {
        "method": "move_to",
        "inputs": {
          "scope": "@ENDING_SCOPE",
          "focal_point": "@ENDING_POINT",
          "duration": "@DURATION_MS"
        }
      }
    }
  ]
}
