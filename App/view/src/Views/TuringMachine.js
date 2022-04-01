// important variables for a web based implementation
var tapelength = 5;
var leftmost = 1000;

// read the user's rules
var turingMachineRules = [];

// TM parts tracker
var currentState = "I";
var accept = false;
var halt = false;

var fuelLevel = 0;
var autoSpeed = 100;
var autoRunning = false;

// move the current head to the left and prepend cells if necessary
function moveL() {
  var element = document.getElementsByClassName("head")[0];
  if (Number(element.id) - 1 >= leftmost) {
    element.classList.remove("head");
    var next = Number(element.id) - 1;
    var nextel = document.getElementById(next);
    nextel.classList.add("head");
  } else {
    // add 4 cells to the beginning
    prependCell();
    prependCell();
    prependCell();
    prependCell();
    moveL();
  }
}

// move the current head to the right and append cells if necessary
function moveR() {
  var element = document.getElementsByClassName("head")[0];
  if (Number(element.id) + 1 < leftmost + tapelength) {
    element.classList.remove("head");
    var next = Number(element.id) + 1;
    var nextel = document.getElementById(next);
    nextel.classList.add("head");
  } else {
    // add 4 cells to the end
    appendCell();
    appendCell();
    appendCell();
    appendCell();
    moveR();
  }
}

function move(direction) {
  if (direction == "L") moveL();
  if (direction == "R") moveR();
}

// write a value to the current head
function tmWriter(ele) {
  var head = document.getElementsByClassName("head")[0];
  head.innerHTML = ele;
}

// get the value from the current head
function tmReader() {
  var head = document.getElementsByClassName("head")[0];
  return head.innerHTML;
}

// add a cell at the left end of the machine
function prependCell() {
  var machine = document.getElementById("machine");
  var baby = document.createElement("DIV");
  baby.id = String(leftmost - 1);
  baby.classList.add("cell");
  machine.prepend(baby);
  leftmost -= 1;
  tapelength += 1;
}

// add a cell at the right end of the machine
function appendCell() {
  var machine = document.getElementById("machine");
  var baby = document.createElement("DIV");
  baby.id = String(leftmost + tapelength);
  baby.classList.add("cell");
  machine.append(baby);
  tapelength += 1;
}

function updateState() {
  document.getElementById("state").innerHTML = currentState;
}

function setup() {
  cleartm();
  // get starting string
  // put it in the tape
  var startingString = document.getElementById("startString").value;
  for (var i = 0; i < startingString.length; i++) {if (window.CP.shouldStopExecution(0)) break;
    tmWriter(startingString[i]);
    moveR();
  }
  // set the head back to leftmost
  window.CP.exitedLoop(0);var element = document.getElementsByClassName("head")[0];
  element.classList.remove("head");
  var nextel = document.getElementById(leftmost);
  nextel.classList.add("head");

  // get user's TM description
  var markdown = document.getElementById("markdown").value.toUpperCase();
  markdown = markdown.replace(/\n\s*\n/g, "\n"); // ignore duplicate newlines
  var rules = markdown.split("\n");
  for (var i = 0; i < rules.length; i++) {if (window.CP.shouldStopExecution(1)) break;
    parseRule(rules[i]);
  }

  // set current state
  window.CP.exitedLoop(1);document.getElementById("state").innerHTML = currentState;

  // prependCell();
  moveR();
}

function findComment(element) {
  return element == "!";
}

// add each rule to the list of rules
function parseRule(e) {
  if (e.charAt(0) != "!") {
    // ignore comments
    e = e.replace(/ +(?= )/g, ""); // ignore duplicate spaces
    var parts = e.split(" ");
    var commentPosition = parts.findIndex(findComment); // finding more comments
    if (commentPosition >= 0) {
      parts.length = commentPosition;
    }
    turingMachineRules.push(parts);
  }
}

function cleartm() {
  // document.location.reload(true);
  // document.getElementById("markdown").value = "";
  // document.getElementById("startString").value = "";
  document.getElementById("state").innerHTML = "";
  document.getElementById("machine").innerHTML = "";

  leftmost = 1000;
  turingMachineRules = [];
  currentState = "I";
  accept = false;
  halt = false;

  var baby = document.createElement("DIV");
  baby.id = String(leftmost);
  baby.classList.add("cell");
  baby.classList.add("head");

  document.getElementById("machine").append(baby);
  tapelength = 1;

  appendCell();
  appendCell();
  appendCell();
  prependCell();
}

function same(ele, read) {
  if (ele == "_" && read == "") {
    return true;
  } else if (ele == read) {
    return true;
  } else {
    return false;
  }
}

function step() {
  if (!halt) {
    var notfound = true;
    for (var i = 0; i < turingMachineRules.length; i++) {if (window.CP.shouldStopExecution(2)) break;
      var element = turingMachineRules[i];
      if (element[0] == currentState && same(element[1], tmReader())) {
        currentState = element[2];
        tmWriter(element[3]);
        move(element[4]);
        notfound = false;
        break;
      }
    }window.CP.exitedLoop(2);

    if (notfound) {
      halt = true;
    }

    if (halt) {
      if (currentState == "ACCEPT") {
        accept = true;
        document.getElementById("state").innerHTML = "ACC";
      } else {
        accept = false;
        document.getElementById("state").innerHTML = "HALT";
      }
    }
    updateState();
  } // if you've halted then clicking "step" does nothing.
}

function run() {
  // set "fuel"
  fuelLevel = document.getElementById("fuelLevel").value;
  autoSpeed = document.getElementById("autoSpeed").value;

  if (!autoRunning) {
    autoRunning = true;
    setup();
    setTimeout(function () {
      stepWithFuel();
    }, 200);
  }
}

function stepWithFuel() {
  if (fuelLevel > 0 && !halt) {
    document.getElementById("stepbutton").click();
    fuelLevel -= 1;
    document.getElementById("remainingFuel").innerHTML = fuelLevel;
    setTimeout(function () {
      stepWithFuel();
    }, autoSpeed);
  } else if (!halt) {
    halt = true;
    accept = false;
    document.getElementById("state").innerHTML = "NO FUEL";
    autoRunning = false;
  } else {
    // done
    autoRunning = false;
  }
}

/*
TMState:
Head:
Tape:

Syntax
Current State, Data on tape, Data to write, Move, Next State
use a dictionary based on current state?
currentstate read nextstate write move
<q, s, q', s', r>
crnwm
*/

function addMachine1() {
  var markdownBox = document.getElementById("markdown");
  var startStringBox = document.getElementById("startString");
  markdownBox.value =
  "! Slightly Busy Beaver\n\ni 0 i 0 r\ni 1 back 0 l\n\nback 0 back 1 l\nback _ i _ r\n\ni _ accept _ s";
  startStringBox.value = "000001";
}

function addMachine2() {
  var markdownBox = document.getElementById("markdown");
  var startStringBox = document.getElementById("startString");
  markdownBox.value =
  "! Type in your Turing Machine Markdown here:\n! CurrentState Read NextState Write Move\n! EXAMPLE 1\n! starting string: 0101010101\n! this is a comment\ni 0 i 0 r\ni 1 q2 0 l\nq2 0 q2 0 l ! you can write whatever you want here\nq2 1 i 0 r\n\n! final states\nq1 _ accept  _ s\nq2 _ accept  _ s ! with a comment in the line";
  startStringBox.value = "0101010101";
}

function addMachine3() {
  var markdownBox = document.getElementById("markdown");
  var startStringBox = document.getElementById("startString");
  markdownBox.value =
  "! EXAMPLE 2\n! starting string: 00001\ni 0 i 1 r\ni 1 back 0 l\n\nback 1 back 1 l\nback _ i _ r\n\ni _ accept _ s";
  startStringBox.value = "00001";
}