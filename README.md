# raspberry pi gate counter
Ivy Tech Community College | Lawrence Library's raspberry pi gate counter project
> Disclaimer: I am not a programmer by trade; I am a librarian with some web dev skills.  There are probably better ways to accomplish this task, but this is how I did it with the tools and skills available to me. The following code/instructions are an amalgamation of google/stack overflow copy pasta and some basic javascript.

**table of contents**

 1. why?
 2. equipment
 3. raspberry pi
 4. google form
 5. node.js
 6. further reading

## why?
Ivy Tech has lots of libraries and no money. We want to be able to compare data across all 40ish libraries, but some don't have the funds for a gate counter. A raspberry pi is cheap, and with some coding magic and a little help from google's free tools, we can put gate counters in all of our libraries.

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

## raspberry pi
### setup
### network
[wifi](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)


## google form

## node.js
### johnny-five
### request
### moment

## now, put it all together
`npm install --save request moment node-schedule raspi-io johnny-five`

`sudo node gate-counter.js`

## further reading
As with most of my coding projects, I couldn't have gotten here without the previous work of fellow raspi enthusiasts. Here's a list of articles/blog posts/stack overflow responses I found to be the most helpful during my quest.

