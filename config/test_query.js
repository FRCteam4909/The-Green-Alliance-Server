db.getCollection('matches').aggregate([
  {
      $match: {"competition": 2017}
  },
  {
      $group: {
          _id: {
              "team": '$team',
              "event": '$event'
          },

          "baseline": { $avg: '$baseline' },

          "auto-low-kPa": { $avg: '$auto-low-kPa' },
          "teleop-low-kPa": { $avg: '$teleop-low-kPa' },

          "auto-high-kPa": { $avg: '$auto-high-kPa' },
          "teleop-high-kPa": { $avg: '$teleop-high-kPa' },

          "auto-gears": { $avg: '$auto-gears' },
          "teleop-gears": { $avg: '$teleop-gears' },

          "auto-max-gears": { $max: '$auto-gears' },
          "teleop-max-gears": { $max: '$teleop-gears' },

          "auto-drop-gears": { $avg: '$auto-drop-gears' },
          "teleop-drop-gears": { $avg: '$teleop-drop-gears' },

          "touchpad": { $avg: '$touchpad' },
          "touchpad-attempted": { $avg: '$touchpad-attempted' }      
      }
  },
  {
     $addFields: {
       "touchpad-success": { 
           $cond: [
               { "$eq": ["$touchpad", 0] },
               0, 
               { "$divide": ['$touchpad', '$touchpad-attempted']}
           ]
       },
       "auto-success-gears": { 
           $cond: [
               { "$eq": ["$auto-gears", 0] },
               0, 
               { "$divide": ['$auto-gears', { "$sum": ["$auto-gears", "$auto-drop-gears"]}]}
           ]
       },
       "teleop-success-gears": { 
           $cond: [
               { "$eq": [{ "$sum": ["$teleop-gears", "$teleop-gears-dropped"]}, 0] },
               0, 
               { "$divide": ['$teleop-gears', { "$sum": ["$teleop-gears", "$teleop-drop-gears"]}]}
           ]
       }
     }
  },
  {
     $addFields: {
       "total-gears-score": {
            "$multiply": [
                { "$sum": ["$auto-gears", "$teleop-gears"] },
                12.3
            ]
       },

       "total-kPa": { "$sum": [
            "$auto-low-kPa", "$teleop-low-kPa","$auto-high-kPa","teleop-high-kPa"
       ]},

       "total-gears": { "$sum": [
            "$auto-gears", "$teleop-gears"
       ]},
       "total-max-gears": { "$sum": [
            "$auto-max-gears", "$teleop-max-gears"
       ]},
       "total-drop-gears": { "$sum": [
            "$auto-drop-gears", "$teleop-drop-gears"
       ]},
     }
  },
  {
     $addFields: {
        "total-score": { "$sum": [
                {"$multiply": [5, "$baseline"]},
                "$total-gears-score",
                "$total-kPa",
                {"$multiply": [50, "$touchpad"]},
        ]}
     }
  },
  {
     $addFields: {
       "team": {"$substr":["$_id.team", 0, -1 ]},
       "event": "$_id.event",
       "baseline": { "$divide": [ { "$trunc": { "$multiply": ["$baseline", 20] } }, 20] },
       "auto-low-kPa": { "$divide": [ { "$trunc": { "$multiply": ["$auto-low-kPa", 20] } }, 20] },
       "teleop-low-kPa": { "$divide": [ { "$trunc": { "$multiply": ["$teleop-low-kPa", 20] } }, 20] },
       "auto-high-kPa": { "$divide": [ { "$trunc": { "$multiply": ["$auto-high-kPa", 20] } }, 20] },
       "teleop-high-kPa": { "$divide": [ { "$trunc": { "$multiply": ["$teleop-high-kPa", 20] } }, 20] },
       "total-kPa": { "$divide": [ { "$trunc": { "$multiply": ["$total-kPa", 20] } }, 20] },
       "auto-gears": { "$divide": [ { "$trunc": { "$multiply": ["$auto-gears", 20] } }, 20] },
       "teleop-gears": { "$divide": [ { "$trunc": { "$multiply": ["$teleop-gears", 20] } }, 20] },
       "auto-drop-gears": { "$divide": [ { "$trunc": { "$multiply": ["$auto-drop-gears", 20] } }, 20] },
       "teleop-drop-gears": { "$divide": [ { "$trunc": { "$multiply": ["$teleop-drop-gears", 20] } }, 20] },
       "total-drop-gears": { "$divide": [ { "$trunc": { "$multiply": ["$total-drop-gears", 20] } }, 20] },
       "auto-success-gears": { "$divide": [ { "$trunc": { "$multiply": ["$auto-drop-gears", 20] } }, 20] },
       "teleop-success-gears": { "$divide": [ { "$trunc": { "$multiply": ["$teleop-drop-gears", 20] } }, 20] },
       "total-gears-score": { "$divide": [ { "$trunc": { "$multiply": ["$total-gears-score", 20] } }, 20] },
       "total-gears": { "$divide": [ { "$trunc": { "$multiply": ["$total-gears", 20] } }, 20] },
       "total-max-gears": { "$divide": [ { "$trunc": { "$multiply": ["$total-max-gears", 20] } }, 20] },
       "total-score": { "$divide": [ { "$trunc": { "$multiply": ["$total-score", 20] } }, 20] },
       "touchpad": { "$divide": [ { "$trunc": { "$multiply": ["$touchpad", 20] } }, 20] },
       "touchpad-attempted": { "$divide": [ { "$trunc": { "$multiply": ["$touchpad-attempted", 20] } }, 20] },
       "touchpad-success": { "$divide": [ { "$trunc": { "$multiply": ["$touchpad-success", 20] } }, 20] }
     }
  },
  {
      $project: {
          "_id": 0,
          "team": 1,
          "event": 1,
          "auto-gears": 1, // Avg. Auto Gears / Match
          "total-gears": 1, // Avg. Gears / Match
          "total-max-gears": 1, // Max. Gears / Match
          "total-drop-gears": 1, // Dropped Gears / Match
          "total-kPa": 1, // Avg. kPa / Match
          "touchpad": 1, // Avg. Climb / Match
          "touchpad-success": 1, // Avg. Climb / Attempt
          "total-score": 1 // Calculated Score
      }
  }
]);