var express = require ("express");
var router = express.Router();


router.get('/', function(req, res){
	var data = 	{ // Change it
		Content: [				// ADD PHOTO HERE !!
		{
			username: "Vamshi",
			latitude: 27.11,
			longitude: 19.92,
			text: "Cloud!"
		},
		{
			username: Arjun",
			latitude: 6.10,
			longitude: 19.89,
			text: "Big Data!"
		}
		]
	};
	return res.render('index', data);
});

router.get('/map', function(req,res){
	return res.render('map',{});
});

router.get('/heatmap', function(req,res){
	return res.render('heatmap',{});
});

module.exports = router;