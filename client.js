/* 
metrochat by obsidian
you can sell it so no license
*/
var hostname = "broker.hivemq.com";
var clientId = "metrochat";
idNum = Math.floor(100000 + Math.random() * 900000);
clientId += idNum;

mqttClient = new Paho.MQTT.Client(hostname,8000,clientId);
mqttClient.onMessageArrived =  MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

msgInput = document.getElementById("msgInput");

/*Initiates a connection to the MQTT broker*/
function Connect(){
	mqttClient.connect({
		onSuccess: Connected,
		onFailure: ConnectionFailed,
		keepAliveInterval: 10
	});
}

msgInput.addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
        sendMessage()
    }
})

function sendMessage() {
    mqttClient.send("metrochat/main", msgInput.value);
}

/*Callback for successful MQTT connection */
function Connected() {
    console.log("Connected");
    document.getElementById("logger").innerHTML = "connected w/ ID " + idNum;
    mqttClient.subscribe("metrochat/main");
}

/*Callback for failed connection*/
function ConnectionFailed(res) {
    console.log("Connect failed:" + res.errorMessage);
    document.getElementById("logger").innerHTML = "failed to connect: " + res.errorMessage;
}

/*Callback for lost connection*/
function ConnectionLost(res) {
    if (res.errorCode != 0) {
        console.log("Connection lost:" + res.errorMessage);
        document.getElementById("logger").innerHTML = "connection lost: " + res.errorMessage;
        Connect();
    }
}

/*Callback for incoming message processing */
function MessageArrived(message) {
    if (document.getElementById("content").innerHTML == "nothing to see here") {
        document.getElementById("content").innerHTML = message.payloadString + "<br>";
    }
    else {
        document.getElementById("content").innerHTML += message.payloadString + "<br>";
    }
}