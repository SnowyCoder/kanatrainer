DEFAULT_OPTIONS = {
    "katakana": false,
    "rows": {
      "vowels": true,
      "k": true,
      "s": true,
      "t": true,
      "n": true,
      "h": true,
      "m": true,
      "y": true,
      "r": true,
      "w": true,
    },
    "diatrics": true,
    "digraphs": true,
    "diatrics_digraphs": true,
    "length": 3,
    "obsolete": false,
};

ROWS_ALPHABET = {
  "vowels": "あいうえお",
  "k": ["か", "き", "く", "け", "こ"],
  "s": ["さ", "し", "す", "せ", "そ"],
  "t": ["た", "ち", "つ", "て", "と"],
  "n": ["な", "に", "ぬ", "ね", "の"],
  "h": ["は", "ひ", "ふ", "へ", "ほ"],
  "m": ["ま", "み", "む", "め", "も"],
  "y": ["や", "ゆ", "よ"],
  "r": ["ら", "り", "る", "れ", "ろ"],
  "w": ["わ", "を", "ん"],
};

DIGRAPHS_ALPHABET = {
  "k": ["きゃ", "きゅ", "きょ"],
  "s": ["しゃ", "しゅ", "しょ"],
  "t": ["ちゃ", "ちゅ", "ちょ"],
  "n": ["にゃ", "にゅ", "にょ"],
  "h": ["ひゃ", "ひゅ", "ひょ"],
  "m": ["みゃ", "みゅ", "みょ"],
  "r": ["りゃ", "りゅ", "りょ"],
};

DIATRICS_ALPHABET = {
  "k": ["が", "ぎ", "ぐ", "げ", "ご"],// g
  "s": ["ざ", "じ", "ず", "ぜ", "ぞ"],// z
  "t": ["だ", "ぢ", "づ", "で", "ど"],// d
  "h": ["ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],// b + p
};

DIGRAPHS_DIATRICS_ALPHABET = {
  "k": ["ぎゃ", "ぎゅ", "ぎょ"],
  "s": ["じゃ", "じゅ", "じょ"],
  "t": ["ぢゃ", "ぢゅ", "ぢょ"],// Non-common writing for jo (じ conflicts with ぢ)
  "h": ["びゃ", "びゅ", "びょ", "ぴゃ", "ぴゅ", "ぴょ"],
}


function generateAlphabet(options) {
  alphabet = [];

  rows = options["rows"];
  diatrics = options["diatrics"];
  digraphs = options["digraphs"];
  // Diatrics with diagraphs
  diatricsDiagraphs = options["diatrics_digraphs"];

  if (options["obsolete"]) {
    alphabet.push("ゐ", "ゑ");
  }

  Object.entries(rows).forEach(function(entry) {
    let row = entry[0];
    let used = entry[1];
    if (!used) return;
    alphabet.push(...ROWS_ALPHABET[row]);
    if (diatrics && row in DIATRICS_ALPHABET) {
      alphabet.push(...DIATRICS_ALPHABET[row]);
    }
    if (digraphs && row in DIGRAPHS_ALPHABET) {
      alphabet.push(...DIGRAPHS_ALPHABET[row])
    }
    if (diatricsDiagraphs && row in DIGRAPHS_DIATRICS_ALPHABET) {
      alphabet.push(...DIGRAPHS_DIATRICS_ALPHABET[row]);
    }
  });
  if (options['katakana']) {
    alphabet = alphabet.map(wanakana.toKatakana);
  }
  console.log("Alphabet: ", options, alphabet);
  return alphabet;
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function generateKana(alphabet, options) {
  if (alphabet == []) return "";
  res = "";
  for (let i = 0; i < options["length"]; i++) {
    res += choose(alphabet);
  }
  return res;
}
