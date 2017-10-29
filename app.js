/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);
// var intents = new builder.IntentDialog({ recognizers: [recognizer] })

// .onDefault((session) => {
//     session.send('Sorry, I did not understand \'%s\'.', session.message.text);
// });

// bot.dialog('/', intents);

bot.dialog('Score', function (session) {
    session.endDialog('Hello. Thanks for using this chatbot \'%s\'.', session.message.text);
}).triggerAction({
    matches: 'Score'
});

var request = require('request');

function GetChargeState(){
    request({
        method: 'GET',
        url: 'https://owner-api.teslamotors.com/api/1/vehicles/48566444687533804/data_request/charge_state',
        headers: {
            'Authorization': 'Bearer 2c28647c1b8bc15012876e77ce3f6ea1e58a11efed9eeba9f66fdb755c3fbfab'
        }
    }, function (error, response, body) {
        console.log('Status:', response.statusCode);
        //console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
        return 5;//JSON.parse(body).response;
    });
}
bot.dialog('ChargeState', function(session) {
    session.endDialog('Hey there nice to meet you, my name is \'%s\'.', GetChargeState());
}).triggerAction({
    matches: 'Greeting'
});