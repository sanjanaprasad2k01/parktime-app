const { Park } = require('../models');
const fetch = require('node-fetch');
const fs = require('fs');

const limit = 999; // how many parks we should return on fetch

// gets the park data as json
const getParkData = async () => {
  let apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=" + limit;
  const response = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
    }
  });
  const data = await response.json();

  // these format the json so it has just a "parks" array
  let tempData = await JSON.stringify(data, null, "\t");
  let changedJson = await `{"parks"` + tempData.substr(tempData.indexOf(`"data"`)+6);
  let formattedData = await JSON.parse(changedJson);

  return formattedData;
}

// creates the park data file - data/parks.json
const writeToFile = (fileName, data) => {
  fs.writeFile(fileName, data, err => {
    if (err) {
      console.log("JSON generation failed.");
      return console.error(err);
    } else {
      console.log("JSON generated successfully!");
    }
  });
}

// gets all the park ids and adds them into an array with a mysql id so we can reference the park later
const generateSqlArray = (parkData) => {
  let formattedSql = [];
  let parks = parkData.parks;
  for (let x = 0; x < parks.length; x++) {
    formattedSql.push({id: x + 1, park_id: parks[x].id})
  }
  return formattedSql;
}

const seedParks = async () => {
  const parkData = await getParkData();
  // update parks.json file with categories 
  for (let park of parkData.parks) {
    updateActivitiesArray(park.activities);
  }
  writeToFile("./data/parks.json", JSON.stringify(parkData))

  const parkSql = generateSqlArray(parkData);

  await Park.bulkCreate(parkSql);
  console.log('Parks seeded!');
}

var rangerProgram = ["Junior Ranger Program"];
var wildlifeWatching = ["Wildlife Watching", "Birdwatching", "Scenic Driving"];
var artsAndScience = ["Stargazing", "Hands-On", "Park Film", "Arts and Crafts", "Live Music", "Arts and Culture", "Theater", "Astronomy", "Citizen Science", "Planetarium"];
var historyAndCulture = ["Museum Exhibits", "Living History", "Cultural Demonstrations", "Historic Weapons Demonstration", "Craft Demonstrations", "First Person Interpretation", "Reenactments"];
var waterActivities = ["Fishing", "Paddling", "Boating", "Kayaking", "Canoeing", "Boat Tour", "Freshwater Fishing", "Swimming", "Stand Up Paddleboarding", "Fly Fishing", "Saltwater Fishing", "Motorized Boating", "Saltwater Swimming", "Freshwater Swimming", "SCUBA Diving", "Tubing", 'Sailing', "Whitewater Rafting", "Snorkeling", "Surfing", "River Tubing", "Water Skiing", "Jet Skiing", "Pool Swimming"];
var shopping = ["Shopping", "Bookstore and Park Store", "Gift Shop and Souvenirs"];
var hikingAndClimbing = ["Hiking", "Front-Country Hiking", "Backcountry Hiking", "Off-Trail Permitted Hiking", "Climbing", "Rock Climbing", "Mountain Climbing"];
var tours = ["Guided Tours", "Self-Guided Tours - Walking", "Self-Guided Tours - Auto", "Bus/Shuttle Guided Tour"];
var foodAndDining = ["Picnicking", "Food", "Dining"];
var biking = ["Road Biking", "Mountain Biking", "Biking"];
var camping = ["Horse Camping (see also Horse/Stock Use)", "Horse Camping (see also camping)", "Camping", "Backcountry Camping", "Car or Front Country Camping", "Canoe or Kayak Camping", "Group Camping", "RV Camping"];
var winterActivities = ["Skiing", "Snowshoeing", "Cross-Country Skiing", "Snow Play", "Snowmobiling", "Downhill Skiing", "Snow Tubing", "Ice Climbing", "Dog Sledding", "Ice Skating"];

var updateActivitiesArray = function (activities) {
  for (var activity of activities) {

    if (rangerProgram.includes(activity.name)) {
      activity["category"] = "Junior Ranger Program";
    }
    if (wildlifeWatching.includes(activity.name)) {
      activity["category"] = "Wildlife Watching";
    }
    if (artsAndScience.includes(activity.name)) {
      activity["category"] = "Arts and Science";
    }
    if (historyAndCulture.includes(activity.name)) {
      activity["category"] = "History and Culture";
    }
    if (waterActivities.includes(activity.name)) {
      activity["category"] = "Water Activities";
    }
    if (shopping.includes(activity.name)) {
      activity["category"] = "Shopping";
    }
    if (hikingAndClimbing.includes(activity.name)) {
      activity["category"] = "Hiking and Climbing";
    }
    if (tours.includes(activity.name)) {
      activity["category"] = "Tours";
    }
    if (foodAndDining.includes(activity.name)) {
      activity["category"] = "Food and Dining";
    }
    if (biking.includes(activity.name)) {
      activity["category"] = "Biking";
    }
    if (camping.includes(activity.name)) {
      activity["category"] = "Camping";
    }
    if (winterActivities.includes(activity.name)) {
      activity["category"] = "Winter Activities";
    }
  }
}



module.exports = seedParks;
