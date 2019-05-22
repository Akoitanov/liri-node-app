require("dotenv").config();

var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
// var bandsintown = require('bandsintown')('trilogy');
var fs = require('fs');
var axios = require('axios')
var moment = require('moment')

var spotify = new Spotify(keys.spotify);
var command = process.argv[2]
var Input = process.argv.slice(3,process.argv.length)
    Input = Input.join(" ")
switch(command){
    case "concert-this":
    concertInTown()
    break;
    case "spotify-this-song":
    SpotifyThisMusic()
    break;
    case "movie-this":
    OMDBthisMovie()
    break;
    case "do-what-it-says":
    DoWhatItSays()
    break;
    default:
    console.log("This is WRONG COMMAND DUDEEEEE!!!!!!!")
    break;
} 


if(command === "do-what-it-says") {
    console.log(command)
    readFile()
} else {
    liri(command, Input);
}


function SpotifyThisMusic(){
    var MySong;
    if (Input.length > 0) {
    MySong = Input;
 } else {
     MySong = "The Sign"
 } 
    spotify
    .search({type: 'track', query: MySong})
    .then(function(response){
        var tracks = response.tracks.items[0]
        console.log(`
 Artists: ${tracks.artists[0].name}
 Songs: ${tracks.name}
 Link: ${tracks.preview_url}
 Album: ${tracks.album.name}`)
 console.log(`******************************`)
}) 
    .catch(function(err) {
        console.log(err)
    })
}

function concertInTown(){
    
    var MyTown;
    if (Input.length > 0) {
        MyTown = Input;
        var TownUrl = "https://rest.bandsintown.com/"
        var Url = `${TownUrl}artists/${MyTown}/events?app_id=${keys.band.BandsInTown}`
     
        axios.get(Url)
        .then(function (response) {
            // console.log(response.data[0])
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city);
        var date = moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a');
        console.log(date)
    })
    .catch(function (error) {
        console.log(error);
       });
    } else {
      console.log("Please type artist name!!!")
    }
    
} 

function OMDBthisMovie() {
       if(Input.length > 0) {
         var baseURL = `http://www.omdbapi.com/?`
         var movieTitle = Input;
        //  var queryURL = `http://www.omdbapi.com/?apikey=b818ac3d&t=avatar&t=`
         var queryURL = `${baseURL}t=${movieTitle}&apikey=b818ac3d`
    
         axios.get(queryURL)
         .then(movies => {
             var movieResults = movies.data;
             
             console.log(`**********************`);
             console.log(`Movie Title: ${movieResults.Title}`);
             console.log(`Movie Year:${movieResults.Year}`);
             console.log(`IMDB Rating:${movieResults.imdbRating}`);
             console.log(`Rotten Tomato:${movieResults.Ratings[1].Value}`);
             console.log(`Movie Country:${movieResults.Country}`);
             console.log(`Language:${movieResults.Language}`);
             console.log(`Plot:${movieResults.Plot}`);
             console.log(`Actors:${movieResults.Actors}`);

         }).catch(function(err) {
             console.log(err)
         });
     } else {
         OMDBthisMovie("Mr.Nobody");
     }
     

     
}

function readFile() {
    fs = require('fs');
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log (err);
        }
        var tArray = data.split(',');
        var comm = tArray[0];
        var inp = tArray[1];
        console.log(comm, inp)
        liri(comm, inp);
    })
}