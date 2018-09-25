
var CharType = Object.freeze({
  "kept": 0,
  "changed": 1,
  "inserted": 2,
  "removed": 3,
})

function traceDiff(from, to) {
  // This is an edit distance algorithm with some modifications to trace the path
  // The fuill algorithm should be O(NM) (N = from.length, M = to.length)

  var trace = [];
  // trace[x][y] = [distance, parent]
  // parent = {0: kept/changed, 1: removed, 2: inserted}

  trace[0] = [[0, 0]];
  for (var x = 1; x <= from.length; x++) {
    trace[x] = [[x, 1]];
  }
  for (var y = 1; y <= to.length; y++) {
    trace[0][y] = [y, 2];
  }

  for (var x = 1; x <= from.length; x++) {
    for (var y = 1; y <= to.length; y++) {
      var skipCost = trace[x - 1][y - 1][0];
      if (from[x - 1] != to[y - 1]) {
        skipCost += 1;
      }
      var addCost = trace[x - 1][y][0] + 1;
      var removeCost = trace[x][y - 1][0] + 1;
      if (skipCost <= addCost && skipCost <= removeCost) {
        trace[x][y] = [skipCost, 0];
      } else if (addCost <= removeCost) {
        trace[x][y] = [addCost, 1];
      } else {
        trace[x][y] = [removeCost, 2];
      }
    }
  }
  // Rebuild the path from destination to source
  path = [];
  let cx = from.length;
  let cy = to.length;
  while (cx != 0 || cy != 0) {
    op = trace[cx][cy][1];
    //console.log(op, " = ", cx, cy)
    if (op == 0) {
      cx--; cy--;
      path.push([from[cx] == to[cy] ? CharType.kept : CharType.changed, to[cy], from[cx]]);
    } else if (op == 1) {
      cx--;
      path.push([CharType.removed, from[cx]]);
    } else {
      cy--;
      path.push([CharType.inserted, to[cy]]);
    }
  }
  // Reverse the path (source->destination)
  return path.reverse();
}
