/*
John Merems
March 19, 2019
CSC 337
Homework #7

JS service for worldhistory.html


*/

const express = require("express");
const app = express();

const fs = require('fs');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

console.log('web service started');

/**
Basic fetch parser based on query
Calls correct function and returns json data
Responds with json data
**/
app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	let map = req.body.map;
	let civ = req.body.civilization;
	let text = req.body.text;
	let image = req.body.image;
	
	let paragraph = "\r\n" + text + ":::" + image;
	
	let path = map + "/" + civ + "/info.txt";
	
	fs.appendFile(path,paragraph,function(err) {
		if(err) {
			console.log(err);
			res.status(400);
		}
		console.log(path + " updated");
		res.send("success");
	});
})

/**
Basic fetch parser based on query
Calls correct function and returns json data
Responds with json data
**/
app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	
	let map = req.query.map;
	let mode = req.query.mode;
	let civ = req.query.civ;
	
	if(mode === "coords") {
		json = get_coords(map);
	}
	else if (mode === "mapdescription") {
		json = get_mapdescription(map);
	}
	else if (mode === "info") {
		json = get_civinfo(map,civ);
	}
	
	res.send(JSON.stringify(json));
})

/**

**/
function get_civinfo(map,civ) {
	let json = {};
	let path = map + "/" + civ + "/info.txt";
	let file = fs.readFileSync(path,'utf8');
	let lines = file.split("\r\n");

	let paragraphs = [];
	
	for (let i = 0; i < lines.length; i++) {
		let part = lines[i].split(":::");
		let paragraph = {};

		paragraph["info"] = part[0];
		paragraph["image"] = part[1];
		paragraphs.push(paragraph);
	}

	json["paragraph"] = paragraphs;

	return json;
}

/**
Gets the map description of the map
**/
function get_mapdescription(map) {
	let json = {};
	let path = map + "/mapdescription.txt";
	let file = fs.readFileSync(path,'utf8');
	let lines = file.split("\r\n");

	json["title"] = lines[0];
	json["description"] = lines[1];
	json["link"] = lines[2];

	return json;
}

/**
Gets the coordinates of the civilizations of the map
**/
function get_coords(map) {
	let json = {};
	let path = map + "/coords.txt";
	let file = fs.readFileSync(path,'utf8');
	let lines = file.split("\r\n");
	let civilizations = [];

	for (let i = 0; i < lines.length; i++) {
		let civilization = {};
		let info = lines[i].split(",");
		
		civilization["id"] = info[0];
		civilization["xCorner"] = info[1];
		civilization["yCorner"] = info[2];
		civilization["width"] = info[3];
		civilization["height"] = info[4];
		
		civilizations.push(civilization);
	}

	json["civilizations"] = civilizations;

	return json;
}

app.listen(3000);
