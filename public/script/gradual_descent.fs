{
  "comment": [
    "Will transit from the outermost context",
    "to a new location specified by the caller"
  ],
  "imports": ["startup", "go_to", "play_sound"],
  "inputs": {
    "TO_LOCATION": ["@0", "@1"],
    "TO_SCOPE": "@"
  },
  "declares": {
    "STARTING_POINT": [-1.25, 0],
    "ZOOM_SCOPES": [3.0, "@TO_SCOPE"],
    "AWARD": "tada.wav"
  },
  "steps": [
    {
      "comment": "Fade in at the starting location ( scope index 0)",
      "call": {
        "script": "startup",
        "inputs": {
          "scope": ["@ZOOM_SCOPES", 0],
          "focal_point": "@STARTING_POINT",
          "fade_in_ms": 1000
        }
      }
    },
    {
      "comment": "Transit to the ending location (scope index 1)",
      "call": {
        "script": "go_to",
        "inputs": {
          "scope": ["@ZOOM_SCOPES", 1],
          "focal_point": "@TO_LOCATION"
        }
      }
    },
    {
      "comment": "Play a sound to indicate completion",
      "call": {
        "script": "play_sound",
        "inputs": {"filename": "@AWARD"}
      }
    }
  ]
}
