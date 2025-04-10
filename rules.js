//global variables defined here.
let lightLevel = -1;
let setOrder = 0;

//this is for the items
let batteryCount = 0;
let fireAxe = false;
let IDCard = false;
let gasMask = false;
let egg = false;
let secret = false;
let deadMonster = false;

//handler for the monster
let monsterActive = false;
let monsterDistance = 4;

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); 
        this.engine.addChoice("Wake Up");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.lightRead();
        if(lightLevel > 0) {
            this.engine.show(locationData.Body);
        }
        
        if(locationData.Choices?.length >= 1) {
            for(let choice of locationData.Choices) {
                console.log(choice.Text, choice.Target);
                if(choice.Type == "Item") {
                    if(!choice.Enabled) {
                        continue;
                    }
                }
                if(choice.Type == "Door" && lightLevel > 0) {
                    this.engine.addChoice(choice.Text, choice);
                } else if(choice.Type == "Station") {
                    if(!choice.Enabled) {
                        continue;
                    }
                } else if (choice.Type == "Door" && lightLevel < 0) {
                    let temp;
                    let num;
                    while(!temp) {
                        num = Math.ceil(Math.random() * (locationData.Choices.length - 1));
                        if(locationData.Choices[num].Type != "Item" && locationData.Choices[num].Enabled || locationData.Choices[num].Type != "Item") {
                            console.log("found a choice", [num].Text, num);
                            temp = locationData.Choices[num];
                        }
                    }
                    if(setOrder == 0) {
                        this.engine.addChoice("Randomly Explore", locationData.Choices[2]);
                        setOrder++;
                    } else if(setOrder == 1) {
                        this.engine.addChoice("Randomly Explore", locationData.Choices[1]);
                        setOrder++;
                    } else if (setOrder == 2) {
                        this.engine.addChoice("Randomly Explore", locationData.Choices[1]);
                        setOrder++;
                    } else {
                        this.engine.addChoice("Randomly Explore", temp);
                    }
                }
            }
        } 
    }

    handleChoice(choice) {
        if (choice.Type == "Door")
        {
            if(choice.Target != "Warden")
            {
                this.engine.show("&gt; "+choice.Text);
                if(lightLevel >= 1) LightLevel--;
                if(lightLevel == 0) monsterDistance--;
                this.engine.gotoScene(Location, choice.Target);
            } else {
                if(IDCard) {
                    this.engine.show("&gt; "+choice.Text);
                    if(lightLevel >= 1) LightLevel--;
                    if(lightLevel == 0) monsterDistance--;
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.show("&gt; "+choice.FailText);
                    this.engine.gotoScene(Location, choice.Location);
                }
            }
            
        }
        else if (choice.Type == "Station")
        {
            if(choice.Station == "Generator") {
                if(batteryCount > 0) {
                    this.engine.show("&gt; "+choice.ActiveResponse);
                    batteryCount--;
                    if(lightLevel < 0) {
                        lightLevel = 10;
                    } else {
                        lightLevel += 10;
                    }
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    if(lightLevel >= 1) LightLevel++;
                    if(lightLevel == 0) monsterDistance++;
                }
            } else if(choice.Station == "Lab") {
                if(egg) {
                    this.engine.show("&gt; "+choice.ActiveResponse);
                    choice.Enabled = false;
                    secret = true;
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    this.engine.gotoScene(Location, choice.Location);
                    if(lightLevel >= 1) LightLevel++;
                    if(lightLevel == 0) monsterDistance++;
                }
            } else if(choice.Station == "Monster") {
                if(fireAxe) {
                    this.engine.show("&gt; "+choice.ActiveResponse);
                    egg = false;
                    choice.Enabled = false;
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    this.engine.gotoScene(Location, choice.Location);
                    if(lightLevel >= 1) LightLevel++;
                    if(lightLevel == 0) monsterDistance++;
                }
            } else if (choice.Station == "Smash") {
                this.engine.show("&gt; "+choice.ActiveResponse);
                choice.Enabled = false;
                this.engine.storyData.Locations[Nest].Choices[2].Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            }
        }
        else if (choice.Type == "Item")
        {
            if(choice.Item == "Battery") {
                batteryCount++;
                this.engine.show("&gt; "+choice.Response);
                choice.Enabled = false;
                this.engine.show("&gt; You have " + batteryCount + " batteries left.");
                this.engine.gotoScene(Location, choice.Location);
            } else if (choice.Item == "Fireaxe") {
                fireAxe = true;
                this.engine.show("&gt; "+choice.Response);
                choice.Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            } else if (choice.Item == "ID") {
                IDCard = true;
                this.engine.show("&gt; "+choice.Response);
                choice.Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            }
            else if (choice.Item == "Gas") {
                gasMask = true;
                this.engine.show("&gt; "+choice.Response);
                choice.Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            } else if (choice.Item == "Egg") {
                egg = true;
                this.engine.show("&gt; "+choice.Response);
                choice.Enabled = false;
                this.engine.storyData.Locations[Nest].Choices[4].Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            } else {
                this.engine.show("&gt; "+this.engine.storyData.ItemError);
            }
        }
        else if (choice.Type == "Journal")
        {
            if(batteryCount > 0) {
                this.engine.show("&gt; I have " + batteryCount + " batteries left.");
            }
            if(fireAxe) {
                this.engine.show("&gt; I have a fire axe.");
            }
            if(IDCard) {
                this.engine.show("&gt; I have a warden's ID card.");
            }
            if(gasMask) {
                this.engine.show("&gt; I have a gas mask.");
            }
            if(egg) {
                this.engine.show("&gt; I have a strange egg.");
            }
            if(lightLevel >= 1) LightLevel++;
            if(lightLevel == 0) monsterDistance++;
            this.engine.gotoScene(Location, choice.Location);
        }
        else
        {
            this.engine.gotoScene(End);
        }
    }
    lightRead() {
        if(lightLevel == -1) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[4]);
        }
        else if(lightlevel >= 7) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[0]);
        } else if (lightlevel >= 4) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[1]);
        }
        else if (lightlevel >= 2) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[2]);
        } else {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[3]);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show("&gt; You have escaped the facility, taking a deep breath of the outside air.<br>");
        if(gasMask) {
            this.engine.show("&gt; The mask filters the putrid scent, allowing your lungs a quaint respite.<br> Onward you go, into the desolate world beyond.<br>");
        } else {
            this.engine.show("&gt; The putrid scent fills your lungs, making you gag. You feel holes forming in your lungs, and you begin to cough up the blood that seeps into them.<br> You Die.");
        }
        if(secret) {
            this.engine.show("&gt; You have discovered the secret of the facility, and the truth of the monster their experiments wrought.<br>");
        }
        if(deadMonster) {
            this.engine.show("&gt; You have slain the monster, regardless of if it was once human or not.<br>");
        }



        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'lostMinds.json');