{
  "comment": "Will transit slowly from one fp/scope to another",
  "declares": {
    "starting_point": {"type": "FocalPoint", "value": {"r": -1.25, "i": 0}},
    "starting_scope": {"type": "Scope", "value": 3.0},
    "ending_point": {"type": "FocalPoint", "value": {"r": -1.95, "i": 0}},
    "ending_scope": {"type": "Scope", "value": 0.125},
    "duration": {"type": "TimeMs", "value": 100000}
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
