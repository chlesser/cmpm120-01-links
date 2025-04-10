//global variables defined here.
let lightLevel = -1;

//this is for the items
let batteryCount = 0;
let fireAxe = false;
let IDCard = false;
let gasMask = false;
let egg = false;

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
        
        if(locationData.Choices?.length >= 1 && lightLevel >= 0) {
            for(let choice of locationData.Choices) {
                console.log(choice.Text, choice.Target);
                if(choice.Type == "Item") {
                    if(!choice.Enabled) {
                        continue;
                    }
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            let temp;
            let num;
            while(!temp) {
                num = Math.ceil(Math.random() * (locationData.Choices.length - 1));
                if(locationData.Choices[num].Type == "Item" && locationData.Choices[num].Enabled || locationData.Choices[num].Type != "Item") {
                    console.log("found a choice", locationData.Choices[num].Text, num);
                    temp = locationData.Choices[num];
                }
            }
            
            this.engine.addChoice("Randomly Explore", temp);
        }
    }

    handleChoice(choice) {
        if (choice.Type == "Door")
        {
            this.engine.show("&gt; "+choice.Text);
            if(lightLevel >= 1) LightLevel--;
            if(lightLevel == 0) monsterDistance--;
            this.engine.gotoScene(Location, choice.Target);
        }
        else if (choice.Type == "Station")
        {

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
                this.engine.gotoScene(Location, choice.Location);
            } else {
                this.engine.show("&gt; "+this.engine.storyData.ItemError);
            }
        }
        else if (choice.Type == "Journal")
        {
            this.engine.show("&gt; "+this.engine.storyData);

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
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'lostMinds.json');