var config = {
    apiKey: "AIzaSyDYXoKct-N1GG2aGWgjbTNY1NPKbKeW7xs",
    authDomain: "rps-firebase-8f52c.firebaseapp.com",
    databaseURL: "https://rps-firebase-8f52c.firebaseio.com",
    projectId: "rps-firebase-8f52c",
    storageBucket: "rps-firebase-8f52c.appspot.com",
    messagingSenderId: "374666921232"
  };

firebase.initializeApp(config);

var playersRef = firebase.database();
var playersdbRef = playersRef.ref().child("players");
var chatdbRef = playersRef.ref().child("chat");
var gameChoices = ["Rock", "Paper", "Scissors"];
var p1name = "";
var p2name = "";
var p1choice = "";
var p2choice = "";
var p1wins = 0;
var p1losses = 0;
var p2wins = 0;
var p2losses = 0;
var gameTurns = 1;
var player_1;
var player_2;
var choice;
var losses;
var name;
var wins;

function firstPlayer(){  
  $("#add-player").on("click", function(event){
    event.preventDefault();
    p1name = $("#player-name").val().trim();    
    playersdbRef.child('1').set({
      choice: "",
      losses: 0,
      name: p1name,
      wins: 0
    });
    playersRef.ref("players/1/").on("value", function(snapshot) { 
      console.log(snapshot.val().name);
      $("#player1").html(snapshot.val().name);
      p1name = snapshot.val().name;          
    });         
    $("#player-name").val("");  
    $("#add-player").off("click");
    secondPlayer(); 
  });    
};

function secondPlayer(){
  $("#add-player").on("click", function(event){
    event.preventDefault();
    p2name = $("#player-name").val().trim();    
    playersdbRef.child('2').set({
      choice: "",
      losses: 0,
      name: p2name,
      wins: 0
    });
    playersRef.ref("players/2/").on("value", function(snapshot) {
      console.log(snapshot.val().name);        
      $("#player2").html(snapshot.val().name);
      p2name = snapshot.val().name;     
    });    
    $("#player-name").val("");  
    $("#add-player").off("click");
    newGame();  
  });  
};

function startOver(){
  gameTurns++;
  setTimeout(newGame, 3000);
};

function evaluation(x, y) {
  var p1iteration = false;
  var p2iteration = false;
  if ((x === "Rock") || (x === "Paper") || (x === "Scissors")) {
    if ((x === "Rock") && (y === "Scissors")) {
      p1wins++;
      p2losses++;  
      p1iteration = true;        
    } else if ((x === "Rock") && (y === "Paper")) {
      p2wins++;
      p1losses++;
      p2iteration = true; 
    } else if ((x === "Scissors") && (y === "Rock")) {
      p2wins++;
      p1losses++;
      p2iteration = true;
    } else if ((x === "Scissors") && (y === "Paper")) {
      p1wins++;
      p2losses++;
      p1iteration = true; 
    } else if ((x === "Paper") && (y === "Rock")) {
      p1wins++;
      p2losses++;
      p1iteration = true; 
    } else if ((x === "Paper") && (y === "Scissors")) {
      p2wins++;
      p1losses++;
      p2iteration = true;
    } else if (x === y) {
      $("#player").html("Tie");
      $("#results").html("Game!");
    }
  }

  $("#p1wins").html(p1wins); 
  playersRef.child("player_1").update({
    wins: p1wins
  });  

  $("#p1losses").html(p1losses);   
  playersRef.child("player_1").update({
    losses: p1losses
  });
 
  $("#p2wins").html(p2wins);  
  playersRef.child("player_2").update({
    wins: p2wins
  });  

  $("#p2losses").html(p2losses);  
  playersRef.child("player_2").update({
    losses: p2losses
  }); 

  if (p1iteration === true) {
    $("#player").html(p1name);
    $("#results").html("Wins!");
  }
  if (p2iteration === true) {
    $("#player").html(p2name);
    $("#results").html("Wins!");
  }
  startOver();
};

function newGame(){
  $("#player1Choice").empty();
  $("#player2Choice").empty();
  $("#player").empty();
  $("#results").empty();

  for(var i = 0; i < gameChoices.length; i++) {
    $("#player1Choice").append("<li>" + gameChoices[i] + "</li>");
  }
  $("li").on("click", function(event) {
    event.preventDefault();
    p1choice = $(this).html();
    playersRef.child("player_1").update({
      choice: p1choice
    });
    playersRef.child("player_1/choice").on("value", function(snapshot) {
      $("#player1Choice").html("<span class='highLight'>" + snapshot.val() + "</span>");
      p1choice = snapshot.val();     
    });

    for(var j = 0; j < gameChoices.length; j++) {
      $("#player2Choice").append("<li>" + gameChoices[j] + "</li>");
    }
    $("li").on("click", function(event) {
      event.preventDefault();
      p2choice = $(this).html();
      playersRef.child("player_2").update({
        choice: p2choice
      });
      playersRef.child("player_2/choice").on("value", function(snapshot) {        
        $("#player2Choice").html("<span class='highLight'>" + snapshot.val() + "</span>");
        p2choice = snapshot.val();     
      });
      evaluation(p1choice, p2choice);
    });
  });        
};

$(function() {

  $("#button").on("click", function (event) {    
    event.preventDefault();
    var messageNew = $("#message-input").val();
    chatdbRef.push({name:p1name, message:messageNew});
    $("#message-input").val("");
  });

  chatdbRef.limitToLast(7).on("child_added", function (snapshot) {
      var messagefire = snapshot.val();
      var messageElement = $("<div/>").text(messagefire.name + ": " + messagefire.message);
      messageElement.appendTo("#messageDisplay");
      $("#messageDisplay").scrollTop($("#messageDisplay")[0].scrollHeight);
  });
});

firstPlayer();




  