
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

function runningCount() {
  
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
//return count;

  });
};



module.exports.runningCount = runningCount;




