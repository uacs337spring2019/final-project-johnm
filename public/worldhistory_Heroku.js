/*
John Merems
April 16, 2019
CSC 337
Final Project

JS for worldhistory.html


*/

(function() {
"use strict";
	
	let g_map = "";
	let g_civ = "";
	
	/**
	Loads the ancient map on startup and sets the event triggers for the map buttons
	**/
	window.onload = function() {
		LoadMap();
		
		document.getElementById("ancient").onclick = LoadMap;
		document.getElementById("medieval").onclick = LoadMap;
		document.getElementById("earlymodern").onclick = LoadMap;
	};
	
	/**
	Loads a map based on which button event was triggered
	Sets g_map based on the button id
	On load, the g_map is set to ancient
	Clears all elements on the screen
	Calls MapDescription and Highlights functions
	**/
	function LoadMap() {
		if(g_map === "") {
			g_map = "ancient";
		}
		else {
			g_map = this.id;
		}
		
		let mapdiv = document.getElementById("mapdiv");
		let mapinfo = document.getElementById("mapinfo");
		let civinfo = document.getElementById("civinfo");
		let newinfo = document.getElementById("newinfo");
		
		mapdiv.innerHTML = "";
		mapinfo.innerHTML = "";
		civinfo.innerHTML = "";
		newinfo.innerHTML = "";
		
		let map = document.createElement("img");
		map.id = "map";
		map.src = g_map + ".jpg";
		let alt = "";
		switch(g_map) {
			case "ancient":
				alt = "Ptolemy World Map";
				break;
			case "medieval":
				alt = "Tabula Rogeriana";
				break;
			case "earlymodern":
				alt = "Schagen Map";
				break;
			default:
				break;
		}	
		map.alt = alt;
		
		mapdiv.appendChild(map);
		CreateMapDescription();
		CreateHighlights();
		document.getElementById("lower").style.visibility = "hidden";
	}
	
	/**
	Creates the map description based on g_map
	Fetches the map description
	**/
	function CreateMapDescription() {
		
		let url = "";
		
		switch(g_map) {
			case "ancient":
				url = "https://worldhistory-jm.herokuapp.com:?map=ancient&mode=mapdescription"
				break;

			case "medieval":
				url = "https://worldhistory-jm.herokuapp.com:?map=medieval&mode=mapdescription"
				break;
			case "earlymodern":
				url = "https://worldhistory-jm.herokuapp.com:?map=earlymodern&mode=mapdescription"
				break;
			default:
				break;
		}	
		
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let data = JSON.parse(responseText);
				let title = document.createElement("h2");
				let description = document.createElement("p");
				let link = document.createElement("a");
				
				title.innerHTML = data["title"];
				description.innerHTML = data["description"];
				link.innerHTML = "wikipedia link";
				link.href = data["link"];
				
				document.getElementById("mapinfo").appendChild(title);
				document.getElementById("mapinfo").appendChild(description);
				document.getElementById("mapinfo").appendChild(link);
				
			})
			.catch(function(error) {
				console.log(error);
			});
		
	}
	
	/**
	Creates the civilization area highlights
	Fetches based on g_map
	Set onmouseover, onmouseleave, and onmousedown triggers for each highlight area
	**/
	function CreateHighlights() {
		
		let url = "";
		
		switch(g_map) {
			case "ancient":
				url = "https://worldhistory-jm.herokuapp.com:?map=ancient&mode=coords"				
				break;
				
			case "medieval":
				url = "https://worldhistory-jm.herokuapp.com:?map=medieval&mode=coords"
				break
				
			case "earlymodern":
				url = "https://worldhistory-jm.herokuapp.com:?map=earlymodern&mode=coords"
				break;
				
			default:
				break;
		}
		
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let data = JSON.parse(responseText);
				let civilizations = data["civilizations"];
				
				for(let i = 0; i < civilizations.length; i++) {
					let civilization = document.createElement("div");
					
					civilization.id = civilizations[i]["id"];
					civilization.style.left = civilizations[i]["xCorner"] + "%";
					civilization.style.top = civilizations[i]["yCorner"] + "%";
					civilization.style.width = civilizations[i]["width"] + "%";
					civilization.style.height = civilizations[i]["height"] + "%";
					civilization.classList.add("civilization");
					civilization.onmouseover = Highlight;
					civilization.onmouseleave = Hide;
					civilization.onmousedown = CivHandler;
					
					document.getElementById("mapdiv").appendChild(civilization);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	}
	
	/**
	Sets g_civ based on the highlight id that triggered it
	Calls CreateCivInfo
	**/
	function CivHandler() {
		g_civ = this.id;
		CreateCivInfo();//map,civ);
	}
	
	/**
	Populates the civinfo div
	Fetches data based on g_map and g_civ
	Moves the screen to have this area in view
	Calls CreateInputs
	**/
	function CreateCivInfo() {
		
		document.getElementById("lower").style.visibility = "visible";
		
		let civinfo = document.getElementById("civinfo");
		civinfo.innerHTML = "";
		let newinfo = document.getElementById("newinfo");
		newinfo.innerHTML = "";

		let url = "https://worldhistory-jm.herokuapp.com:?map=" + g_map + "&mode=info&civ=" + g_civ;
		
		let title = document.createElement("h2");
		title.innerHTML = g_civ;
		document.getElementById("civinfo").appendChild(title);
		
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let data = JSON.parse(responseText);
				let paragraphs = data["paragraph"];
				
				for (let i = 0; i < paragraphs.length; i++) {
					
					let paragraph = document.createElement("p");
					paragraph.style.overflow = "hidden";
					
					let info = document.createTextNode(paragraphs[i]["info"]);
					let image = document.createElement("img");
					
					if(i%2 == 0) {
						image.classList.add("floatleft");
					}
					else {
						image.classList.add("floatright");
					}
					
					if(paragraphs[i]["image"] != "") {
						image.src = paragraphs[i]["image"];
					}
					
					paragraph.appendChild(image);
					paragraph.appendChild(info);

					document.getElementById("civinfo").appendChild(paragraph);
				}	
			})
			.catch(function(error) {
				console.log(error);
			});
		
		CreateInputs();	
		civinfo.scrollIntoView(true);
	}
	
	/**
	Creates the new information submission form
	Creates onclick event to trigger Submit
	**/
	function CreateInputs() {
		let h2 = document.createElement("h3");
		h2.innerHTML = "Submit additional information";
		
		let textP = document.createElement("p");
		textP.innerHTML = "Enter information to add:";
		
		let text = document.createElement("textarea");
		text.id = "textinput";
		text.rows = "4";
		text.cols="10";
		
		let imageP = document.createElement("p");
		imageP.innerHTML = "Enter image link";
		
		let image = document.createElement("textarea");
		image.id = "imageinput";
		image.rows = "1";
		image.cols = "10";
		
		let submit = document.createElement("button");
		submit.id = "submit";
		submit.innerHTML = "Submit New Information";
		submit.onclick = Submit;
		
		let newinfo = document.getElementById("newinfo");
		newinfo.appendChild(h2);
		newinfo.appendChild(submit);
		newinfo.appendChild(textP);
		newinfo.appendChild(text);
		newinfo.appendChild(imageP);
		newinfo.appendChild(image);
	}
	
	/**
	Submits the new information data through a POST command
	Only will work if there is text in the field
	Does not need an image link
	**/
	function Submit() {
		let text = document.getElementById("textinput").value;
		let image = document.getElementById("imageinput").value;
		
		if(text !== "") {
			const paragraph = {map: g_map, civilization: g_civ, text: text,
					 image: image};
			const fetchOptions = {
				method : 'POST',
				headers : {
					'Accept': 'application/json',
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify(paragraph)
			};

			console.log(paragraph);

			let url = "https://worldhistory-jm.herokuapp.com:";
			fetch(url, fetchOptions)
				.then(checkStatus)
				.then(function(responseText) {
					CreateCivInfo();
				})
				.catch(function(error) {
					console.log(error);
				});
		}	
	}
	
	/**
	Area highlights onmouseover
	**/
	function Highlight() {
		this.classList.add("highlight");
	}
	
	/**
	Dehighlights the area onmouseleave 
	**/
	function Hide() {
		this.classList.remove("highlight");
	}
	
	/**
	Returns an error if status is not correct
	**/
	function checkStatus(response) { 
		if (response.status >= 200 && response.status < 300) {  
			return response.text();
		} 
		else {
			return Promise.reject(new Error(response.status+": "+response.statusText)); 
		}
	}		
})();