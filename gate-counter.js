const request = require('request');
const moment = require('moment');
const schedule = require('node-schedule');
const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi()
});



//====================================================
/*==========================
== CHANGE THESE VARIALBES ==
==       TO MATCH         == 
==   YOUR GOOGLE FORM     ==
============================*/

const location = "Location";
const door = "Front";

//form URL 
//i.e. "https://docs.google.com/forms/d/e/MJ7dywKE4O........."
const googleURL = "https://docs.google.com/forms/d/e/MJ7dywKE4O1FAIpQLSdLr4g0BYxMfnmWxNhNgd1djcYqhCzpROxy1zBA";

//entry IDs to be changed
const locationID = "1084294605";
const doorID = "1781652367";
const countID = "1464911796";
const monthID = "573363677";
const dateID = "1065875699";
const timeID = "1391727194";

//DON'T TOUCH THIS ONE
let count = 0;

//the rest is automagic!
//=====================================================

board.on("ready", function() {

  // Create a new `motion` hardware instance.
  var motion = new five.Motion('GPIO7');

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated", moment().format("MMMM D, YYYY HH:mm:ss"));
  });

 

  // "motionend" events are fired following a "motionstart" event
  // when no movement has occurred in X ms
  motion.on("motionend", function() {

     count += 1;
     console.log("movement", moment().format("hh:mm:ss a"), " The count is " + count);
     
  
  });

//cron job runs every 10 minutes 
//sends http request to google form with all data values appended to URL
//resets the count to zero
var j = schedule.scheduleJob('0,10,20,30,40,50 * * * *', function(){
      let month = moment().format("MMMM");
      let time = moment().format("HH:mm:ss");
      let date = moment().format("MM-DD");
      let url = `${googleURL}/formResponse?ifq&entry.${locationID}=${location}&entry.${doorID}=${door}&entry.${countID}=${count}&entry.${monthID}=${month}&entry.${dateID}=${date}&entry.${timeID}=${time}&submit=Submit`;

    request(url, function (error, response, body) {
      console.log('Data sent: ' + moment().format("MM-DD-YYYY HH:mm:ss"));
      console.log(url);

      //uncomment this console.log to test the form submission result	
      //console.log('body:', body); // Print the form submission result
    });
    count = 0;
  });

//run cron job
j;



});







 
