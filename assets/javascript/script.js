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
var playersconnectedRef = playersRef.ref(".info/connected");
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

var rpsGame = {
  playersHandler: function(event) {
    event.preventDefault();
    console.log(gameTurns);
    if (event.data.newPlayer) {    
      p1name = $("#player-name").val().trim();    
      playersdbRef.child('1').set({      
        losses: 0,
        name: p1name,
        wins: 0
      });
      
      $("#player2-messages").hide();
      $("#form-entry").html("Hi " + p1name + "! You are Player 1");           
    
    } else {

    p2name = $("#player-name").val().trim();    
    playersdbRef.child('2').set({      
      losses: 0,
      name: p2name,
      wins: 0
    });   
    playersRef.ref().update({      
      turn: gameTurns
    });      
          
    $("#player1Choice").hide();
    $("#player1-messages").hide();
    $("#button-player1").hide();
    $("#button-player2").show(); 
    $("#form-entry").html("Hi " + p2name + "! You are Player 2"); 

    }  
  },
  buttonsHandler: function(event) {
    event.preventDefault();
    if (event.data.newMessage) {
      var messageText = $("#message-input").val();
      chatdbRef.push({
        name: p1name, 
        message: messageText
      });
      $("#message-input").val("");
    } else {
      var messageText = $("#message-input").val();
      chatdbRef.push({
        name: p2name, 
        message: messageText
      });
      $("#message-input").val("");
    }
  }
};

playersconnectedRef.on("value", function(snap) {
  console.log(snap.val());
});

function resetGame() {  
  playersRef.ref().remove();
  $("#add-player2").hide();  
  $("#button-player2").hide(); 
  playersEntry();
};

function playersEntry() {
  $("#add-player1").click({newPlayer: true}, rpsGame.playersHandler);
  $("#add-player2").click({newPlayer: false}, rpsGame.playersHandler);
};

function startOver(){    
  gameTurns = 1;   
  setTimeout(nextGame, 3000);
};

function nextGame() {  

  $("#player1Choice").hide();
  playersRef.ref().update({      
    turn: gameTurns
  });  
           
};

function firstplayerChoice() {

  for(var i = 0; i < gameChoices.length; i++) {
    $("#player1Choice").append("<li>" + gameChoices[i] + "</li>");
  }

  $("li").on("click", function(event) {
    event.preventDefault();
    gameTurns++;
    console.log(gameTurns);
    p1choice = $(this).html();
    playersRef.ref("players/1/").update({
      choice: p1choice
    });
    playersRef.ref().update({      
      turn: gameTurns
    });    

  $("#player2Choice").hide();

  });  
};

function secondplayerChoice() {
  
  for(var j = 0; j < gameChoices.length; j++) {
    $("#player2Choice").append("<li>" + gameChoices[j] + "</li>");
  }
  
  $("li").on("click", function(event) {
    event.preventDefault();
    gameTurns++;
    p2choice = $(this).html();
    playersRef.ref("players/2/").update({
      choice: p2choice
    });        

    evaluation(p1choice, p2choice); 
    console.log(p1choice)
    console.log(p2choice)

  });  

};

function evaluation(x, y) {    

  if ((x === "Rock") || (x === "Paper") || (x === "Scissors")) {
    if ((x === "Rock") && (y === "Scissors")) {
      p1wins++;
      p2losses++;           
    } else if ((x === "Rock") && (y === "Paper")) {
      p2wins++;
      p1losses++;       
    } else if ((x === "Scissors") && (y === "Rock")) {
      p2wins++;
      p1losses++;      
    } else if ((x === "Scissors") && (y === "Paper")) {
      p1wins++;
      p2losses++;      
    } else if ((x === "Paper") && (y === "Rock")) {
      p1wins++;
      p2losses++;     
    } else if ((x === "Paper") && (y === "Scissors")) {
      p2wins++;
      p1losses++;      
    } 
  }

  playersRef.ref().update({      
    turn: gameTurns
  });  

  $("#p1wins").html(p1wins); 
  playersRef.ref("players/1/").update({
    wins: p1wins
  });    

  $("#p1losses").html(p1losses);   
  playersRef.ref("players/1/").update({
    losses: p1losses
  });
 
  $("#p2wins").html(p2wins);  
  playersRef.ref("players/2/").update({
    wins: p2wins
  });  

  $("#p2losses").html(p2losses);  
  playersRef.ref("players/2/").update({
    losses: p2losses
  });     
  
  startOver();
};

playersRef.ref("players/1/name").on("value", function(snapshot) { 
  if (snapshot.val()) {
    console.log(snapshot.val());
    $("#player1").html(snapshot.val());
    p1name = snapshot.val();  
    $("#add-player1").hide();
    $("#add-player2").show();    
  }        
});   

playersRef.ref("players/2/name").on("value", function(snapshot) {
  if (snapshot.val()) {
    console.log(snapshot.val());        
    $("#player2").html(snapshot.val());
    p2name = snapshot.val();    

    playersRef.ref().update({      
      turn: gameTurns
    });  
  }
});    

playersRef.ref("players/1/choice").on("value", function(snapshot) {  
  if (snapshot.val()) {
    console.log(snapshot.val()); 
    $("#player1Choice").html("<span class='highLight'>" + snapshot.val() + "</span>");
    p1choice = snapshot.val();      
  }  
});

playersRef.ref("players/2/choice").on("value", function(snapshot) {      
  if (snapshot.val()) {
    console.log(snapshot.val());
    $("#player2Choice").html("<span class='highLight'>" + snapshot.val() + "</span>");
    p2choice = snapshot.val(); 
      
    if (p1choice === p2choice) {
      $("#player").html("Tie");
      $("#results").html("Game!");
    }     
  }    
});

playersRef.ref("players/1/wins").on("value", function(snapshot) {
  if (snapshot.val()) {
    console.log(snapshot.val());        
    $("#p1wins").html(snapshot.val());    
    p1wins = snapshot.val();        
  }

  if (snapshot.val()) {
    $("#player").html(p1name);
    $("#results").html("Wins!");
  }
  
});  

playersRef.ref("players/1/losses").on("value", function(snapshot) {
  if (snapshot.val()) {
    console.log(snapshot.val());           
    $("#p1losses").html(snapshot.val());   
    p1losses = snapshot.val();   
  }  

  if (snapshot.val()) {
    $("#player").html(p2name);
    $("#results").html("Wins!");
  }

});  

playersRef.ref("players/2/wins").on("value", function(snapshot) {
  if (snapshot.val()) {
    console.log(snapshot.val());        
    $("#p2wins").html(snapshot.val());    
    p2wins = snapshot.val();         
  }

});   

playersRef.ref("players/2/losses").on("value", function(snapshot) {
  if (snapshot.val()) {
    console.log(snapshot.val());    
    $("#p2losses").html(snapshot.val());         
    p2losses = snapshot.val();     
  }

});

playersRef.ref("turn").on("value", function(snapshot) {
  console.log(snapshot.val());  
   
  if (snapshot.val() === 1) {

    $("#player1Choice").empty();
    $("#player2Choice").empty();
    $("#player").empty();
    $("#results").empty(); 
    $("#player1-messages").html("It's Your Turn!");   
    $("#player2-messages").html("Waiting for " + p1name + " to choose");
    gameTurns = snapshot.val();
    firstplayerChoice(); 
  }

  if (snapshot.val() === 2) {
    $("#player2-messages").html("It's Your Turn!");   
    $("#player1-messages").html("Waiting for " + p2name + " to choose");
    gameTurns = snapshot.val();
    secondplayerChoice();
  }

  if (snapshot.val() === 3) {
    $("#player1Choice").show();
    $("#player2Choice").show();
    gameTurns = snapshot.val();
  }

});   

$(function() {

  $("#button-player1").click({newMessage: true}, rpsGame.buttonsHandler);
  $("#button-player2").click({newMessage: false}, rpsGame.buttonsHandler);   
  
  chatdbRef.limitToLast(7).on("child_added", function (snapshot) {
    var messagefire = snapshot.val();
    var messageElement = $("<div/>").text(messagefire.name + ": " + messagefire.message);
    messageElement.appendTo("#messageDisplay");
    $("#messageDisplay").scrollTop($("#messageDisplay")[0].scrollHeight);
  });

});

resetGame();




  