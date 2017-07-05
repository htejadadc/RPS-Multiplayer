var gameChoices = ["Rock", "Paper", "Scissors"];
var p1name = "";
var p2name = "";
var p1choice = "";
var p2choice = "";
var p1wins = 0;
var p1losses = 0;
var p2wins = 0;
var p2losses = 0;
var turns = 1;

function firstPlayer(){  
  $("#add-player").on("click", function(event){
    event.preventDefault();
    p1name = $("#player-name").val().trim();
    console.log("This is p1: " + p1name)
    $("#player1").text(p1name);          
    $("#player-name").val("");  
    $("#add-player").off("click");
    secondPlayer(); 
  });    
};

function secondPlayer(){
  $("#add-player").on("click", function(event){
    event.preventDefault();
    p2name = $("#player-name").val().trim();
    console.log("This is p2: " + p2name)
    $("#player2").text(p2name);
    $("#player-name").val("");  
    $("#add-player").off("click");
    newGame();  
  });  
};

function startOver(){
  turns++;
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
  $("#p1losses").html(p1losses);   
  $("#p2wins").html(p2wins);
  $("#p2losses").html(p2losses); 

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
    console.log(p1choice);
    $("#player1Choice").html("<span class='highLight'>" + p1choice + "</span>");

    for(var j = 0; j < gameChoices.length; j++) {
      $("#player2Choice").append("<li>" + gameChoices[j] + "</li>");
    }
    $("li").on("click", function(event) {
      event.preventDefault();
      p2choice = $(this).html();
      console.log(p2choice);
      $("#player2Choice").html("<span class='highLight'>" + p2choice + "</span>");
      evaluation(p1choice, p2choice);
    });
  });        
};

firstPlayer();


  

  