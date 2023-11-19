/* 
metrochat client / server
*/
var hostname = "broker.hivemq.com";
var clientId = "metrousr";
var port = 8884
var idNum = Math.floor(100000 + Math.random() * 900000);
clientId += idNum;

mqttClient = new Paho.MQTT.Client(hostname,port,clientId);
mqttClient.onMessageArrived =  MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

// input field
msgInput = document.getElementById("msgInput");

// connect function, firefox says that its unsafe or stuff
function Connect(){
	mqttClient.connect({
		onSuccess: Connected,
		onFailure: ConnectionFailed,
        useSSL: true
	});
}

// event listener for the input field
msgInput.addEventListener("keypress", function(event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
})

// function for sending messages because client/server are 1 file
function sendMessage() {
    if (msgInput.value != "") {
        mqttClient.send("metrochat/main", msgInput.value);
        msgInput.value = ""
    }
}

// if connection was sucessful
function Connected() {
    console.log("connected to " + hostname + ":" + port + " with id " + clientId);
    document.getElementById("statusText").innerHTML = "connected"
    document.getElementById("idText").innerHTML = "id: " + idNum
    mqttClient.subscribe("metrochat/main");
}

// if connection is failed
function ConnectionFailed(res) {
    console.log("Connect failed:" + res.errorMessage);
    document.getElementById("statusText").innerHTML = "failed to connect: " + res.errorMessage
}

// if connection is lost
function ConnectionLost(res) {
    if (res.errorCode != 0) {
        console.log("Connection lost:" + res.errorMessage);
        document.getElementById("statusText").innerHTML = "connection lost: " + res.errorMessage
        Connect();
    }
}

// message handling
function MessageArrived(message) {
    document.getElementById("content").innerHTML += message.payloadString + "<br>";
}