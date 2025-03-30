{
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
  "comment": [
    "Will transit from the outermost context",
    "to a new location specified by the caller"
  ],
  "steps": [
    {
      "call": "startup",
      "takes": {
        "scope": ["@ZOOM_SCOPES", 0],
        "focal_point": "@STARTING_POINT",
        "fade_in_ms": 1000
      }
    },
    {
      "call": "go_to",
      "takes": {
        "scope": ["@ZOOM_SCOPES", 1],
        "focal_point": "@TO_LOCATION",
      }
    },
    {
      "call": "play_sound",
      "takes": {"filename": "@AWARD"}
    }
  ]
}
