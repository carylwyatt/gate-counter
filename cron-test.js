const request = require('request');
const moment = require('moment');
const schedule = require('node-schedule');
const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi()
});



let location = "Lawrence";
let door = "Front";
let count = 0;


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
     console.log("motionend", moment().format("hh:mm:ss a"), " The count is " + count);
     
  
  });

var j = schedule.scheduleJob('0,10,20,30,40,50 * * * *', function(){
      let month = moment().format("MMMM");
      let time = moment().format("HH:mm:ss");
      let date = moment().format("MM-DD");
      let url = `https://docs.google.com/forms/d/e/1FAIpQLSdLrMJ7dywKE4O4g0BYxMfnmWxNhNgd1djcYqhCzpROxy1zBA/formResponse?ifq&entry.1084294605=${location}&entry.1781652367=${door}&entry.1464911796=${count}&entry.573363677=${month}&entry.1065875699=${date}&entry.1391727194=${time}&submit=Submit`;

    request(url, function (error, response, body) {
      console.log('Data sent: ' + moment().format("MM-DD HH:mm:ss"));
      console.log(url);
      //console.log('body:', body); // Print the HTML for the Google homepage.
    });
    count = 0;
  });

j;



});





 