const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsListByDistance = function (req, res) { 
	const lng = parseFloat(req.query.lng);
	const lat = parseFloat(req.query.lat);
	const point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	Loc.aggregate(
        [
            {
                '$geoNear': {
                    'near': point,
                    'spherical': true,
                    'distanceField': 'distance',
                    'maxDistance': 5000
                }
            }
        ],
        function(err, results) {
					let locations = [];
					results.forEach((doc) => {
						locations.push({
							distance: doc.distance,
							name: doc.name,
							address: doc.address,
							rating: doc.rating,
							facilities: doc.facilities,
							_id: doc._id
				});
		});
		res
			.status(200)
			.json(locations);
	});		
};

const locationsCreate = function (req, res) { 
	res
		.status(200)
		.json({"status" : "success"})
};

const locationsReadOne = function (req, res) { 
	if (req.params && req.params.locationid) {
		Loc
			.findById(req.params.locationid)
			.exec((err, location) => {	
				if (!location) {
					res
						.status(404)
						.json({
							"message" : "locationid not found"
						});
					return;
				} else if (err) {
					res
						.status(404)
						.json(err);
					return;
				}
				res
					.status(200)
					.json(location);	
		});
 } else {
		res
			.status(404)
			.json({
				"message": "No locationid in request"
			});
	}
};

const locationsUpdateOne = function (req, res) { 
	res
		.status(200)
		.json({"status" : "success"})
};

const locationsDeleteOne = function (req, res) {	
	res
		.status(200)
		.json({"status" : "success"})
};

module.exports = {
	locationsListByDistance,
	locationsCreate,
	locationsReadOne,
	locationsUpdateOne,
	locationsDeleteOne
};