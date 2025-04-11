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
let monsterDistance = 3;
let monsterText = [true, true, true];
let killed = false;

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
        if(monsterDistance == 0) {
            this.engine.show("&gt; The adrenaline pumping through you momentarily numbs you. The only way you realize that your leg has been torn off is by your head slamming against the tile floor.<br>");
            this.engine.show("&gt; You feel the monster creeping up behind you, prepared for the feast. If only the fall had killed you.<br>");
            killed = true;
            this.engine.gotoScene(End);
            return;
        }
        let locationData = this.engine.storyData.Locations[key];
        this.lightRead();
        if(lightLevel > 0 && !locationData.Visited) {
            this.engine.show(locationData.Body);
            locationData.Visited = true;
        }
        console.log(lightLevel);
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                if
                (choice.Type == "Door" && lightLevel > 0)
                {
                    if(this.engine.storyData.Locations[choice.Target]?.Visited)
                    {
                        this.engine.addChoice(choice.KnownText, choice);
                    }
                    else
                    {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
                else if (choice.Type == "End" && lightLevel > 0)
                {
                    this.engine.addChoice(choice.Text, choice);
                }
                else if
                (choice.Type == "Item" && lightLevel > 0)
                {
                    if(choice.Enabled) {
                        this.engine.addChoice(choice.Text, choice);
                    }
                }
                else if
                (choice.Type == "Station")
                {
                    if(choice.Enabled) {
                        this.engine.addChoice(choice.Text, choice);
                        console.log("added station", choice.Text, choice.Station);
                    }
                }
                else if
                (choice.Type == "Journal")
                {
                    this.engine.addChoice(choice.Text, choice);
                }
                else if
                (choice.Type == "Door" && lightLevel <= 0)
                {
                    var temp;
                    let num;
                    if(temp) continue;
                    while(!temp) {
                        num = Math.ceil(Math.random() * (locationData.Choices.length - 1));
                        if(locationData.Choices[num].Type != "Item" && locationData.Choices[num].Enabled || locationData.Choices[num].Type != "Item") {
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
                        this.engine.addChoice("Randomly Explore", locationData.Choices[3]);
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
                if(lightLevel >= 1) lightLevel--;
                if(lightLevel == 0) monsterDistance--;
                this.engine.gotoScene(Location, choice.Target);
            } else {
                if(IDCard) {
                    this.engine.show("&gt; "+choice.Text);
                    if(lightLevel >= 1) lightLevel--;
                    if(lightLevel == 0) monsterDistance--;
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.show("&gt; "+choice.FailText);
                    this.engine.gotoScene(Location, "Center");
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
                        monsterActive = true;
                    } else {
                        lightLevel += 10;
                    }
                    monsterDistance = 3;
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    // if(lightLevel >= 1) lightLevel++;
                    // if(lightLevel == 0) monsterDistance++;
                    this.engine.gotoScene(Location, choice.Location);
                }
            } else if(choice.Station == "Lab") {
                if(egg) {
                    this.engine.show("&gt; "+choice.ActiveResponse);
                    choice.Enabled = false;
                    secret = true;
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    // if(lightLevel >= 1) lightLevel++;
                    // if(lightLevel == 0) monsterDistance--;
                    this.engine.gotoScene(Location, choice.Location);
                }
            } else if(choice.Station == "Monster") {
                if(fireAxe) {
                    this.engine.show("&gt; "+choice.ActiveResponse);
                    choice.Enabled = false;
                    this.engine.storyData.Locations.Nest.Choices[2].Enabled = true;
                    this.engine.storyData.Locations.Nest.Choices[4].Enabled = true;
                    deadMonster = true;
                    monsterActive = false;
                    choice.Enabled = false;
                    this.engine.gotoScene(Location, choice.Location);
                } else {
                    this.engine.show("&gt; "+choice.InactiveResponse);
                    // if(lightLevel >= 1) lightLevel++;
                    // if(lightLevel == 0) monsterDistance++;
                    this.engine.gotoScene(Location, choice.Location);
                }
            } else if (choice.Station == "Smash") {
                this.engine.show("&gt; "+choice.ActiveResponse);
                choice.Enabled = false;
                this.engine.storyData.Locations.Nest.Choices[2].Enabled = false;
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
                this.engine.storyData.Locations.Nest.Choices[3].Enabled = true;
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
                this.engine.storyData.Locations.Nest.Choices[4].Enabled = false;
                this.engine.gotoScene(Location, choice.Location);
            } else {
                this.engine.show("&gt; "+this.engine.storyData.ItemError);
            }
        }
        else if (choice.Type == "Journal")
        {
            if(batteryCount > 0) {
                this.engine.show("&gt; You have " + batteryCount + " batteries left.");
            }
            if(fireAxe) {
                this.engine.show("&gt; You have a fire axe.");
            }
            if(IDCard) {
                this.engine.show("&gt; You have a warden's ID card.");
            }
            if(gasMask) {
                this.engine.show("&gt; You have a gas mask.");
            }
            if(egg) {
                this.engine.show("&gt; You have a strange egg.");
            }
            if(secret) {
                this.engine.show("&gt; You figured out the dark secret of the facility.");
            }
            if(deadMonster) {
                this.engine.show("&gt; You have slain the monster.");
            }
            if(!(batteryCount > 0 || fireAxe || IDCard || gasMask || egg)) {
                this.engine.show("&gt; You have nothing.");
            }
            // if(lightLevel >= 1) lightLevel++;
            // if(lightLevel == 0) monsterDistance++;
            this.engine.gotoScene(Location, choice.Target);
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
        else if(lightLevel >= 7) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[0]);
        } else if (lightLevel >= 4) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[1]);
            if(monsterActive && monsterText[0]) {
                this.engine.show("&gt; "+this.engine.storyData.MonsterDesc[0]);
                monsterText[0] = false;
            }
        }
        else if (lightLevel >= 1) {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[2]);
            if(monsterActive && monsterText[1]) {
                monsterText[1] = false;
                this.engine.show("&gt; "+this.engine.storyData.MonsterDesc[1]);
            }
        } else {
            this.engine.show("&gt; "+this.engine.storyData.LightDesc[3]);
            if(monsterActive && monsterText[2]) {
                monsterText[2] = false;
                this.engine.show("&gt; "+this.engine.storyData.MonsterDesc[2]);
            }
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        if(killed) {
            this.engine.show("&gt; You have died. <br>");
        } else {
            this.engine.show("&gt; You have escaped the facility, taking a deep breath of the outside air.<br>");
            if(gasMask) {
                this.engine.show("&gt; The mask filters the putrid scent, allowing your lungs a quaint respite.<br> Onward you go, into the desolate world beyond.<br>");
            } else {
                this.engine.show("&gt; A putrid, rotten scent makes you gag. You feel holes forming in your lungs, and you begin to cough up the blood that seeps into them.<br> You Die.");
            }
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