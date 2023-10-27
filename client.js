/* 
metrochat client / server
*/
var hostname = "broker.hivemq.com";
var clientId = "metrousr";
var port = 8000
var idNum = Math.floor(100000 + Math.random() * 900000);
clientId += idNum;

mqttClient = new Paho.MQTT.Client("broker.hivemq.com",port,clientId);
mqttClient.onMessageArrived =  MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

// input field
msgInput = document.getElementById("msgInput");

// connect function, firefox says that its unsafe or stuff
function Connect(){
	mqttClient.connect({
		onSuccess: Connected,
		onFailure: ConnectionFailed
	});
}

// event listener for the input field
msgInput.addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
        sendMessage()
    }
})

// function for sending messages because client/server are 1 file
function sendMessage() {
    mqttClient.send("metrochat/main", msgInput.value);
}

// if connection was sucessful
function Connected() {
    console.log("connected to " + hostname + ":" + port + " with clientId " + clientId);
    document.getElementById("logger").innerHTML = "connected w/ ID " + idNum;
    mqttClient.subscribe("metrochat/main");
}

// if connection is failed
function ConnectionFailed(res) {
    console.log("Connect failed:" + res.errorMessage);
    document.getElementById("logger").innerHTML = "failed to connect: " + res.errorMessage;
}

// if connection is lost
function ConnectionLost(res) {
    if (res.errorCode != 0) {
        console.log("Connection lost:" + res.errorMessage);
        document.getElementById("logger").innerHTML = "connection lost: " + res.errorMessage;
        Connect();
    }
}

// message handling
function MessageArrived(message) {
    if (document.getElementById("content").innerHTML == "nothing to see here") {
        document.getElementById("content").innerHTML = message.payloadString + "<br>";
    }
    else {
        document.getElementById("content").innerHTML += message.payloadString + "<br>";
    }
}