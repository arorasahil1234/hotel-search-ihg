'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const skilldata =[
        {
            hotelname:"Cassa Hotel Times Square",
            country:"U.S.A",
            state:"New York",
            style:["luxury"],
            star:"5 star",
            ammenities:["Restaurant"],
            price:"hundred dollar"
        },
        {
            hotelname:"ABC Hotel",
            country:"U.S.A",
            state:"New York",
            style:["business"],
            star:"5 star",
            ammenities:["Restaurant"],
            price:"thousand dollar"
        }
];
const pricedata =[
        {
            hotelname:"Cassa Hotel Times Square",
            country:"U.S.A",
            night:"2 night",
            roomtype:"queen",
            ammenities:["Restaurant"],
            price:"hundred dollar",
        },
        {
            hotelname:"Cassa Hotel Times Square",
            country:"U.S.A",
            night:"2 night",
            roomtype:"superior",
            ammenities:["Restaurant"],
            price:"thousand dollar"
        }
];
const handlers = {
   'LaunchRequest': function () {
        const welcomeOutput = "Let's plan your stay. Where would you like to stay?";
        const welcomeReprompt = "Let me know where would you like to stay";
        this.response.speak(welcomeOutput).listen(welcomeReprompt);
        this.emit(':responseReady');
    },
    'TypeIntent': function () {
        this.emit('NameIntent');
    },
    'NameIntent': function(){
        var filledSlots = delegateSlotCollection.call(this);
        var state  =this.event.request.intent.slots.state.value;
        var style =this.event.request.intent.slots.style.value;
        if(style ==="luxury"){
            var hotelname=gethotelnamebystyle(skilldata,'style','state',style,state).hotelname;
            this.response.speak(" The best suitable match for your stay is " + hotelname + ". You wish to know the price range of the hotel").listen();
            this.emit(':responseReady');
        }
    },
    'PriceIntent': function(){
         var filledSlots = delegateSlotCollection.call(this);
         var travelDate=this.event.request.intent.slots.travelDate.value;
         var roomtype=this.event.request.intent.slots.roomtype.value;
         var night  =this.event.request.intent.slots.night.value;
         var price =getprice(pricedata,'night','roomtype',night,roomtype).price;
         this.response.speak(" The best suitable hotel which cost is " + price +" you want to know about the amenities as well").listen();
         this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = skilldata;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
function gethotelnamebystyle(data,propstyle,propname,propvalue,stylevalue){
    for(var i=0;i<data.length;i++){
        if(data[i][propname && propstyle] ==propvalue && stylevalue){
            return data[i];
        }
    }
}
function getprice(dataprice,propstyle,propname,propvalue,stylevalue){
    for(var i=0;i<dataprice.length;i++){
        if(dataprice[i][propname && propstyle] ==propvalue && stylevalue){
            return dataprice[i];
        }
    }
}
function delegateSlotCollection(){
    if (this.event.request.dialogState === "STARTED") {
        var updatedIntent=this.event.request.intent;
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        this.emit(":delegate");
    } else {
        return this.event.request.intent;
    }
}
