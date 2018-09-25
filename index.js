
var Phase = Object.freeze({
  "write": 0, // Writing the translation
  "score": 1, // Checking the results
})


var currentOptions = DEFAULT_OPTIONS;
var currentAlphabet = generateAlphabet(currentOptions);

var currentPhase = Phase.score;
var currentQuestion = "?";
var currentAnswer = "?";
var playerAnswer = "?";
var isAnswerRight = false;

function printDifference(from, to)  {
  var diff = traceDiff(from, to);
  var displayf = document.getElementById('displayf');
  var displayt = document.getElementById('displayt');
  var fragf = document.createDocumentFragment();
  var fragt = document.createDocumentFragment();

  diff.forEach(function(v){
    let value, type;
    value = v[1];
    type = v[0];
    // green for additions, red for deletions, blue for substitutions
    // grey for common parts
    var colorf = 'grey', colort = 'grey';
    var textf = '', textt = '';

    if (type == CharType.inserted) {
      textf = ' ';
      textt = value;
      colort = 'green';
    } else if (type == CharType.removed) {
      textt = ' ';
      textf = value;
      colorf = 'red';
    } else if (type == CharType.changed) {
      textf = v[2];
      colorf = 'red';
      textt = v[1];
      colort = 'green';
    } else {
      textf = textt = value;
    }

    spanf = document.createElement('span');
    spanf.style.color = colorf;
    spanf.appendChild(document.createTextNode(textf));
    fragf.appendChild(spanf);

    spant = document.createElement('span');
    spant.style.color = colort;
    spant.appendChild(document.createTextNode(textt));
    fragt.appendChild(spant);
  });
  while (displayf.firstChild) {
    displayf.removeChild(displayf.firstChild);
  }
  displayf.appendChild(fragf);
  while (displayt.firstChild) {
    displayt.removeChild(displayt.firstChild);
  }
  displayt.appendChild(fragt);
}

function toggleComplexOptions(e) {
  var complex = !document.getElementById('complex-options-toggle').classList.contains("active");
  console.log("COMPLEX: ", complex);
  $('#simple-options-container').collapse(complex ? 'hide' : 'show');
  $('#complex-options-container').collapse(complex ? 'show' : 'hide');
}

function readOptions() {
  var complex = document.getElementById('complex-options-toggle').classList.contains("active");
  return complex ? readOptionsComplex() : readOptionsSimple();
}

function readOptionsSimple() {
  var difficulty = parseInt(document.getElementById("simple-options-difficulty").value);
  return {
    "katakana": document.getElementById("options-katakana").checked,
    "rows": {
      "vowels": difficulty >= 1,
      "k":      difficulty >= 2,
      "s":      difficulty >= 3,
      "t":      difficulty >= 4,
      "n":      difficulty >= 4,
      "h":      difficulty >= 5,
      "m":      difficulty >= 5,
      "y":      difficulty >= 6,
      "r":      difficulty >= 6,
      "w":      difficulty >= 7,
    },
    "diatrics": difficulty >= 8,
    "digraphs": difficulty >= 9,
    "diatrics_digraphs":  difficulty >= 10,
    "length": parseInt(document.getElementById("simple-options-length").value),
    "obsolete": false,
  };
}

function readOptionsComplex() {
  return {
    "katakana": document.getElementById("options-katakana").checked,
    "rows": {
      "vowels": document.getElementById("options-complex-row-vowels").checked,
      "k": document.getElementById("options-complex-row-k").checked,
      "s": document.getElementById("options-complex-row-s").checked,
      "t": document.getElementById("options-complex-row-t").checked,
      "n": document.getElementById("options-complex-row-n").checked,
      "h": document.getElementById("options-complex-row-h").checked,
      "m": document.getElementById("options-complex-row-m").checked,
      "y": document.getElementById("options-complex-row-y").checked,
      "r": document.getElementById("options-complex-row-r").checked,
      "w": document.getElementById("options-complex-row-w").checked,
    },
    "diatrics": document.getElementById("options-complex-diatrics").checked,
    "digraphs": document.getElementById("options-complex-diagraphs").checked,
    "diatrics_digraphs": document.getElementById("options-complex-diatrics-diagraphs").checked,
    "length": parseInt(document.getElementById("options-complex-length").value),
    "obsolete": document.getElementById("options-complex-obsolete").checked,
  };
}

function drawPhase() {
   console.log("Drawing ", currentPhase);
  if (currentPhase == Phase.write) {
    document.getElementById("game-question").innerText = currentQuestion;
    document.getElementById("game-answer").value = "";
    document.getElementById("question-container").hidden = false;
    document.getElementById("result-container").hidden = true;
  } else {
    if (isAnswerRight) {
      document.getElementById("anwser-right-question").innerText = currentQuestion;
      document.getElementById("answer-right-answer").innerText = currentAnswer;
    } else {
      document.getElementById("answer-wrong-question").innerText = currentQuestion;
      document.getElementById("answer-wrong-answer").innerText = currentAnswer;
      printDifference(playerAnswer, currentAnswer);
    }
    document.getElementById("result-wrong-container").hidden = isAnswerRight;
    document.getElementById("result-right-container").hidden = !isAnswerRight;

    document.getElementById("question-container").hidden = true;
    document.getElementById("result-container").hidden = false;
  }
}

function setPhase(phase) {
  console.log("Setting phase: ", phase);
  if (phase == Phase.score) {
    playerAnswer = document.getElementById("game-answer").value;
    isAnswerRight = playerAnswer == currentAnswer;
    console.log("Input:", playerAnswer, "vs", currentAnswer, isAnswerRight);
  } else {
    currentQuestion = generateKana(alphabet, currentOptions);
    currentAnswer = wanakana.toRomaji(currentQuestion);
    console.log("Question: ", currentQuestion, " = ", currentAnswer);
  }
  currentPhase = phase;
  drawPhase();
}

function nextPhase() {
  setPhase(currentPhase == Phase.score ? Phase.write : Phase.score);
}

window.onload = function() {
  document.getElementById('complex-options-toggle').onclick = toggleComplexOptions;
  document.getElementById('options-apply').onclick = function() {
    currentOptions = readOptions();
    currentAlphabet = generateAlphabet(currentOptions);
    console.log("Options: ", currentOptions);
  }
  // Reload sliders with output value
  document.getElementById("simple-options-difficulty").oninput();
  document.getElementById("simple-options-length").oninput();
  document.getElementById("options-complex-length").oninput();

  document.onkeydown = function (e) {
    e = e || window.event;
    if ((e.which || e.keyCode) == 13) {// 13 is the ASCII code for 'ENTER'
      nextPhase();
    }
  }
  setPhase(Phase.write);
}
