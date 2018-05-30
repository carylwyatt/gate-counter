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

