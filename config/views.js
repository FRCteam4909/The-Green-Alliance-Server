module.exports= {
	views: [{
		"name": "Team Averages",
		"view": "teamAverages"
	},{
		"name": "Raw Match Data",
		"view": "matches"
	}],
	
	matches: function (mongoCollection, callback) {
		mongoCollection
			.find()
			.sort({"_id": -1})
			.toArray(function (err, matches) {
				callback([
					{
							name: "Matches",
							headers: [
                                {
                                    text: "Team", 
                                    value: "team"	
                                },
                                {
                                    text: "Crossed Baseline", 
                                    value: "baseline"	
                                },
                                {
                                    text: "Auto. Low Goal kPa",
                                    value: "auto-low-kPa"
                                },
                                {
                                    text: "Auto. High Goal kPa",
                                    value: "auto-high-kPa"
                                },
                                {
                                    text: "Auto. Gears Placed",
                                    value: "auto-gears"
                                },
                                {
                                    text: "Teleop. Low Goal kPa",
                                    value: "teleop-low-kPa"
                                },
                                {
                                    text: "Teleop. High Goal kPa",
                                    value: "teleop-high-kPa"
                                },
                                {
                                    text: "Teleop. Gears Placed",
                                    value: "teleop-gears"
                                },
                                {
                                    text: "Pressed Touchpad",
                                    value: "touchpad"
                                },
                                {
                                    text: "Comments", 
                                    value: "comments"	
                                },
                                {
                                    text: "Do Not Pick", 
                                    value: "do-not-pick"	
                                }
                            ],
							data: matches
					}
				]);

				db.close();
			});
	},
    
    teamAverages: function (mongoCollection, callback) {
        mongoCollection.aggregate([
          {
              $group: {
                  _id: '$team',
                  
                  "baseline": { $avg: '$baseline' },
                  
                  "auto-low-kPa": { $avg: '$auto-low-kPa' },
                  "auto-high-kPa": { $avg: '$auto-high-kPa' },
                  "auto-gears": { $avg: '$auto-gears' },
                  
                  "teleop-low-kPa": { $avg: '$teleop-low-kPa' },
                  "teleop-high-kPa": { $avg: '$teleop-high-kPa' },
                  "teleop-gears": { $avg: '$teleop-gears' },
                  
                  "touchpad": { $avg: '$touchpad' },
                  
                  "do-not-pick": { $avg: '$do-not-pick' }
              }
          }
        ]).toArray(function(err, matches) {
            callback([
                {
                        name: "Matches",
                        headers: [
                            {
                                text: "Team", 
                                value: "_id"	
                            },
                            {
                                text: "Crossed Baseline", 
                                value: "baseline"	
                            },
                            {
                                text: "Auto. Low Goal kPa",
                                value: "auto-low-kPa"
                            },
                            {
                                text: "Auto. High Goal kPa",
                                value: "auto-high-kPa"
                            },
                            {
                                text: "Auto. Gears Placed",
                                value: "auto-gears"
                            },
                            {
                                text: "Teleop. Low Goal kPa",
                                value: "teleop-low-kPa"
                            },
                            {
                                text: "Teleop. High Goal kPa",
                                value: "teleop-high-kPa"
                            },
                            {
                                text: "Teleop. Gears Placed",
                                value: "teleop-gears"
                            },
                            {
                                text: "Pressed Touchpad",
                                value: "touchpad"
                            },
                            {
                                text: "Do Not Pick", 
                                value: "do-not-pick"	
                            }
                        ],
                        data: matches
                }
            ]);
            
            db.close();
        });
	}
};

