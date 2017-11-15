
# raspberry pi gate counter
Ivy Tech Community College | Lawrence Library's raspberry pi gate counter project

> Disclaimer: I am not a programmer by trade; I am a librarian with some web dev skills.  There are probably better ways to accomplish this task, but this is how I did it with the tools and skills available to me. The following code/instructions are an amalgamation of google/stack overflow copy pasta and some basic javascript.

**table of contents**

 1. [why?](#why)
 2. [equipment](#equipment)
 3. [raspberry pi](#raspi)
 4. [google form](#google)
 5. [node.js](#node)
 6. [further reading](#reading)

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

<a name="raspi"></a>
## raspberry pi
### getting started
There are many options for selecting and installing an OS. I'm using Raspbian. [Installation documentation](https://www.raspberrypi.org/documentation/installation/) can help you choose and get started.

### network
I'm currently running the raspi on the staff wifi in my building. This is not an ideal setup. Getting the college to run an extra data drop is not very likely to happen, so I'm going to have to work with IT on a better wireless solution. 

Getting the wifi set up correctly was challenging because of the network security or something. It took some googling, but I eventually found some raspi forum where a student had figured out what to include in the wpa config file to get on the university wifi, and this bit of network code ended up working for me at my institution (ymmv):

1. Open the wpa-supplicant file using nano:
`sudo nano /etc/wpa_supplicant/wpa_supplicant.conf`

2. Paste this in:
`network={
        ssid="network name" //mine is IVYStaff
        key_mgmt=WPA-EAP
        eap=PEAP
        identity="user@ivytech.edu"
        password="password"
        phase2="auth=MSCHAPv2"
}
`
3. `sudo reboot`

I'm not familiar with networking, so I don't actually understand what most of this means. You're on your own to figure your system out!

Raspberry Pi [wifi configuration docs](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

### PIR sensor
Now for the fun stuff!



<a name="google"></a>
## google form
> You can collect the data however you want, but I'd rather all those numbers go to a spreadsheet in the cloud. Google Sheets to the rescue!

My form collects six pieces of input data as well as the timestamp. Because my team plans on using this program/device in multiple libraries, `LOCATION` and `DOOR` are important pieces of data for us. You might only have one location and one door. Feel free to remove those and any associated code. 

The most important data is `COUNT`. The code runs a cron job that submits the count every 10 minutes. Again, feel free to change this in the code if that is too frequent.

The last three inputs are all time-related. If the timestamp is sufficient for your needs, feel free to remove these from the code. `MONTH` is helpful to divide the form data into different spreadsheets by month without too much trouble in the spreadsheet logic department. `DATE` is similarly helpful and is useful when summing the daily count. `TIME` is useful for counting which hours have the most traffic. 

I'm sure all of this can be done using only the timestamp, but this was easier for me.

### form URL

During a previous project, I realized you can send data to google form without ever needing to see or use the ugly form page. Each form input has a unique entry ID, and when those IDs and corresponding responses are appended to the form's URL string, google posts that information to the form responses. These can then go straight into a spreadsheet.

Use your browser's handy-dandy inspector tools on each input of your form to find the unique ID number (it will look like `entry.039480298`). Swap out the URL of the form (everything except the `viewform` bit at the end-- don't forget the last slash!) and entry variables in `gate-counter.js` and you should be good to go!

[image of form url]
[image of entry id #]

[My spreadsheet](https://docs.google.com/spreadsheets/d/1X7p5venJ61yVd6fyzJkJJAzVwMIyXJD4Db2249MfIVw/edit#gid=587752914) has some logic and math built in to separate the data from the form by month and count it up in different ways. This is by no means an elegant solution, but it is free and it works. Feel free to make a copy! **File > Make a copy**

> In case you are interested in embedding google forms in your site without inserting the ugly form itself, there's a really neat tool that can build out the html of a custom google form for you: [Google Forms HTML Exporter](http://stefano.brilli.me/google-forms-html-exporter/)

## node.js
Most of the examples of IR sensor people counters I found via google were built with python. I'm a javascript girl. For the sake of the raspi, I attempted to learn python, but I struggled to debug in a new language, so I switched to javascript. See the [further reading](#reading) section below to see what other raspi-ers accomplished using python.

### johnny-five
### request
### moment

## now, put it all together
My plan is to eventually create an npm package that will do all of this, but I haven't gotten that far. Until then, this should work as long as you replace the google form URL.

`npm install --save request moment node-schedule raspi-io johnny-five`

`sudo node gate-counter.js`

<a name="reading"></a>
## further reading
As with most of my coding projects, I couldn't have gotten here without the previous work of fellow raspi enthusiasts. Here's a list of articles/blog posts/stack overflow responses I found to be the most helpful during my quest.

### inspiration
My first google after thinking *"I bet I could do this with a raspi..."* turned up some interesting stuff.

- [Building a People Counter with Raspberry Pi and Ubidots](https://ubidots.com/blog/building-a-people-counter-with-raspberry-pi-and-ubidots/)
- [Building a People Counter with a PIR sensor](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=91902&sid=319eac22b1fb3235cd73de4a0944fd7b)
- [Footfall](https://github.com/WatershedArts/Footfall)

### technical 
