
# raspberry pi gate counter
Ivy Tech Community College | Lawrence Library's raspberry pi gate counter project

> Disclaimer: I am not a programmer by trade; I am a librarian with some web dev skills.  There are probably better ways to accomplish this task, but this is how I did it with the tools and skills available to me. The following code/instructions are an amalgamation of google/stack overflow copy pasta and some basic javascript.

**table of contents**

 1. [why?](#why)
 2. [equipment](#equipment)
 3. [raspberry pi](#raspi)
 4. [google form](#google)
 5. [node.js](#node)
 6. [run it!](#run)
 7. [further reading](#reading)

<a name="why"></a>
## why?
Ivy Tech has lots of libraries and no money. We want to be able to compare data across all 30ish libraries, but some don't have the funds for a gate counter. A raspberry pi is cheap, and with some coding magic and a little help from google's free tools, we can put gate counters in all of our libraries.

<a name="equipment"></a>
## equipment
> links to amazon

 - [raspberry pi 3, model b ($35)](https://www.amazon.com/Raspberry-Model-A1-2GHz-64-bit-quad-core/dp/B01CD5VC92/ref=pd_cp_147_1?_encoding=UTF8&pd_rd_i=B01CD5VC92&pd_rd_r=XNPP6KQ42EPDJ9TES40H&pd_rd_w=HBgL5&pd_rd_wg=TXfaq&psc=1&refRID=XNPP6KQ42EPDJ9TES40H)
 - [case ($7)](https://www.amazon.com/Raspberry-Model-Protective-Heatsinks-Clear/dp/B01D8368QA/ref=pd_sim_147_4?_encoding=UTF8&pd_rd_i=B01CDVSBPO&pd_rd_r=5H1KW6WZRX7Y41ZRN5P7&pd_rd_w=DYn2v&pd_rd_wg=U4ny1&refRID=5H1KW6WZRX7Y41ZRN5P7&th=1)
 -  [power supply ($10)](https://www.amazon.com/CanaKit-Raspberry-Supply-Adapter-Charger/dp/B00MARDJZ4/ref=sr_1_1?ie=UTF8&qid=1510761661&sr=8-1&keywords=CanaKit-Raspberry-Supply-Adapter-Charger)
 - [samsung 32gb evo plus microSD card with adapter ($13)](https://www.amazon.com/Samsung-Class-Micro-Adapter-MB-MC32DA/dp/B00WR4IJBE/ref=sr_1_1?s=electronics&ie=UTF8&qid=1510761711&sr=1-1&keywords=samsung-EVO-Plus-Adapter-MB-MC32DA)
 - [PIR sensor ($14)](https://www.amazon.com/dp/B00B8867V4/ref=psdc_7459508011_t3_B00FDPO9B8)
 - [jumper wires, female-female ($6)](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B01L5ULRUA/ref=sr_1_4?s=electronics&ie=UTF8&qid=1502224568&sr=1-4&keywords=female+female+jumper+wires)

**total: $85**

> Alternatively, it might be easier to skip the first three and get the [CanaKit](https://www.amazon.com/CanaKit-Raspberry-Clear-Power-Supply/dp/B01C6EQNNK/ref=pd_sbs_147_3?_encoding=UTF8&pd_rd_i=B01C6EQNNK&pd_rd_r=5H1KW6WZRX7Y41ZRN5P7&pd_rd_w=INDdA&pd_rd_wg=U4ny1&psc=1&refRID=5H1KW6WZRX7Y41ZRN5P7) (which includes raspi, case, and power supply) for ~$50

You'll also need some way to connect to the pi. I used an [HDMI-connected TV, extra mouse/keyboard, and ethernet cable](https://www.raspberrypi.org/learning/hardware-guide/) for initial setup, then used [VNC viewer](https://chrome.google.com/webstore/detail/vnc%C2%AE-viewer-for-google-ch/iabmpiboiopbgfabjmgeedhcmjenhbla?hl=en) from my work computer to connect [headlessly](https://www.raspberrypi.org/documentation/remote-access/ip-address.md) via [SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/README.md). 

See [Raspberry Pi docs](https://www.raspberrypi.org/help/) for all kinds of detail on how to get started.

At the moment, the PIR sensor portion of the raspi is taped to the inside of a kleenex box. I hope to move it to a less obvious-looking pvc pipe or something when I set it up in the library. The sensor is pretty sensitive (ha), and having it contained seems to keep the IR beam isolated enough to negate false positive reads.

![gate counter in the break room](https://libapps.s3.amazonaws.com/accounts/41961/images/gate-counter.jpg)

![gate counter sensor](https://libapps.s3.amazonaws.com/accounts/41961/images/gate-counter-sensor.jpg)

*My very fancy, extremely sophisticated setup in our break room.*

<a name="raspi"></a>
## raspberry pi
### getting started
There are many options for selecting and installing an OS. I'm using Raspbian. [Installation documentation](https://www.raspberrypi.org/documentation/installation/) can help you choose and get started. 

>Note: One of the npm packages I use, [raspi-io](https://github.com/nebrius/raspi-io), only runs on Raspbian Jessie and newer.

### network
I'm currently running the raspi on the staff wifi in my building. This is not an ideal setup. Getting the college to run an extra data drop is not very likely to happen, so I'm going to have to work with IT on a better wireless solution. 

Getting the wifi set up correctly was challenging because of the network security or something. It took some googling, but I eventually found some raspi forum where a student had figured out what to include in the wpa config file to get on the university wifi, and this bit of network code ended up working for me at my institution (ymmv):

1. Open the wpa-supplicant file using nano:
`sudo nano /etc/wpa_supplicant/wpa_supplicant.conf`

2. Paste this in:
```
network={
        ssid="network name" //mine is IVYStaff
        key_mgmt=WPA-EAP
        eap=PEAP
        identity="user@ivytech.edu" //school username
        password="password" //school password
        phase2="auth=MSCHAPv2"
}
```
3. `sudo reboot`

I'm not familiar with networking, so I don't actually understand what most of this means. You're on your own to figure your system out!

Raspberry Pi [wifi configuration docs](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

### PIR sensor
Now for the fun stuff!

The sensor has three pins on the back and you will use all three. Plug three jumper wires to those pins. The first time I tried this, I thought I needed to be super gentle, but these things are all that fragile, so make sure you get a snug connection! 

Hook up the other end of the wires to the following GPIO pins on the raspi motherboard (you can find the labels of PIR pins on the back next to where to pins connect to the sensor):

Ground (**GND**) 	--> 	Ground (pin 06)
V+ (**VCC**)			-->	 3.3v (pin 01)
Signal 	(**OUT**)	--> GPIO 07 (pin 26)

Use this diagram for visual of where to plug things in:

![raspi 3 model b pin diagram](https://libapps.s3.amazonaws.com/accounts/41961/images/pi3_gpio.jpg)

You can always choose a different pin for the output, but you'll need to update the code on line 41 where it says `GPIO7`.

The first time I set this up, I used the 5v power instead of 3.3v and it was giving me a false reading every minute at the same second. After reading in some forum that it might be the voltage, I set it to 3.3v. *I still sometimes get false positives, but a reboot of the pi usually fixes that.*

<a name="google"></a>
## google form
> You can collect the data however you want, but I'd rather all those numbers go to a spreadsheet in the cloud. Google Sheets to the rescue!

My form collects six pieces of input data as well as the timestamp. Because my team plans on using this program/device in multiple libraries, `LOCATION` and `DOOR` are important pieces of data for us. You might only have one location and one door. Feel free to remove those and any associated code. 

The most important data is `COUNT`. The code runs a cron job that submits the count every 10 minutes. Again, feel free to change this in the code if that is too frequent.

The last three inputs are all time-related. If the timestamp is sufficient for your needs, feel free to remove these from the code. `MONTH` is helpful to divide the form data into different spreadsheets by month without too much trouble in the spreadsheet logic department. `DATE` is similarly helpful and is useful when summing the daily count. `TIME` is useful for counting which hours have the most traffic. 

I'm sure all of this can be done using only the timestamp, but this was easier for me.

### form URL

During a previous project, I realized you can send data to google form without ever needing to see or use the ugly form page. Each form input has a unique entry ID, and when those IDs and corresponding responses are appended to the form's URL string, google posts that information to the form responses. These can then go straight into a spreadsheet.

Use your browser's handy-dandy inspector tools on each input of your form to find the unique ID number (it will look like `entry.039480298`). Swap out the URL of the form (everything except the `/viewform` bit at the end) and entry variables in `gate-counter.js` and you should be good to go!

What the form URL should look like:

![form url](https://libapps.s3.amazonaws.com/accounts/41961/images/form-url.jpg)

Where to find entry ID number in inspector:

![inspect entry id #](https://libapps.s3.amazonaws.com/accounts/41961/images/entry-id.jpg)

You can test your URL by taking the URL from the cron job section of the code and sub in all the variables (both IDs and their respective values) and popping it into your address bar. If you get the google form submission page saying you submitted a form, you win!

> In case you are interested in embedding google forms in your site without inserting the ugly form itself, there's a really neat tool that can build out the html of a custom google form for you: [Google Forms HTML Exporter](http://stefano.brilli.me/google-forms-html-exporter/)

### spreadsheet

[My spreadsheet](https://docs.google.com/spreadsheets/d/1X7p5venJ61yVd6fyzJkJJAzVwMIyXJD4Db2249MfIVw/edit#gid=587752914) has some logic and math built in to separate the data from the form by month and count it up in different ways. This is by no means an elegant solution, but it is free and it works. Feel free to make a copy! **File > Make a copy**

<a name="node"></a>
## node.js
Most of the examples of IR sensor people counters I found via google were built with python. I'm a javascript girl. For the sake of the raspi, I attempted to learn python, but I struggled to debug in a new language, so I switched to javascript. See the [further reading](#reading) section below to see what other raspi-ers accomplished using python.

The best (only?) way to use javascript on a raspberry pi is with [node.js](https://nodejs.org/en/). I used these two guides for installing node on my raspi:

- [Beginner’s Guide to Installing Node.js on a Raspberry Pi](http://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/)
- [adafruit - Node.js Embedded Development on the Raspberry Pi](https://learn.adafruit.com/node-embedded-development/why-node-dot-js)

### npm modules
[npm packages and modules](https://www.npmjs.com/) do the heavy code lifting for us. This project would not be possible without them. If you've never heard of npm, check it out and come back: [What is npm?](https://docs.npmjs.com/getting-started/what-is-npm)

#### johnny-five
The [Johnny Five](http://johnny-five.io/) platform makes coding javascript/node robotics and internet-of-things projects super easy. I wandered the internet and npm for a solid week before discovering this wonderful platform, and this essentially solved all my problems.

The API has tons of useful components, but we only need one for this project: [motion](http://johnny-five.io/api/motion/). The sensor I used is the first in the list of supported sensors, so I knew I was on the right track! You can dabble with the different events, but I've found there's not much of a difference between `motionstart` and `motionend`, and `change` was too much activity.

#### raspi-io
Johnny Five is written to be used with an arduino. Since we're using a raspi, we'll need to install a plugin that converts the bread board info to the raspi's GPIOs. [raspi-io](https://github.com/nebrius/raspi-io) is just the thing.

#### request
[Request](https://www.npmjs.com/package/request) makes http calls. In other words, it's what sends our form URL to google. It doesn't get any easier than those six lines of code.

#### moment.js
[Moment.js](https://momentjs.com/) is the easy way to deal with time in javascript. Fun fact: javascript counts time as how many milliseconds have passed since midnight of January 1, 1970! How fun is it to calculate `1510774793166 ms` into a recognizable date format? Not a whole lot, actually. Moment.js takes care of all of that for us! 

If you've decided to remove the month, date, and time variables from your form/code, you don't need moment.js. There is no need to install the module and delete it from the required modules at the top of the file. 

#### node-schedule
The easiest way to schedule our program to send our form data at a specific intervals is to set up a cron job. The best scheduler I've found for node is [node-schedule](https://www.npmjs.com/package/node-schedule). 

There are lots of timing options, so if you don't want your cron job to run every 10 minutes, just change the time intervals.

<a name="run"></a>
## run it!
Open `gate-counter.js` and replace all the variables with the appropriate values from your google form. Here's where you can tinker with what data you want to send, how often your cron job runs, etc.

> My plan is to eventually create an npm package that will do all of this, but I haven't gotten that far. Until then, this should work as long as you replace the google form URL and entry IDs with your form info.

### install packages
In your project's working directory, run:

`npm install --save request moment node-schedule raspi-io johnny-five`

This could take a few minutes.

### run program
Then:

`sudo node gate-counter.js`

If your PIR sensor is hooked up correctly and you have no syntax errors in your `gate-counter.js` file, you should get something looking like this in your console:

```
pi@raspberrypi:~/gate-counter $ sudo node gate-counter.js
1510773792422 Available RaspberryPi-IO  
1510773792696 Connected RaspberryPi-IO  
1510773792706 Repl Initialized  
>> calibrated November 15, 2017 14:23:14
```
If so, your pi is calibrated and ready to start counting!

<a name="reading"></a>
## further reading
As with most of my coding projects, I couldn't have gotten here without the previous work of fellow raspi enthusiasts. Here's a list of articles/blog posts/stack overflow responses I found to be the most helpful during my quest.

### inspiration
My first google after thinking *"I bet I could do this with a raspi..."* turned up some interesting stuff.

- [Building a People Counter with Raspberry Pi and Ubidots](https://ubidots.com/blog/building-a-people-counter-with-raspberry-pi-and-ubidots/)
- [Building a People Counter with a PIR sensor](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=91902&sid=319eac22b1fb3235cd73de4a0944fd7b)
- [Footfall](https://github.com/WatershedArts/Footfall)
