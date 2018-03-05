/**
 * Get the previous charactor which relates to the charactor with given position
 * @param {CodeMirror} cm - Instance of CodeMirror
 * @param {object} curPos - Current position of the charactor
 * @param {number} curPos.line - Line number of current charactor
 * @param {number} curPos.ch - Position of the charactor in the line
 * @param {number} [distance=1] - Distance between target charactor and current charactor 
 * @returns {object} Position and value of the previous charactor
 */
function preChar(cm, curPos, distance=1) {
    if(distance < 0) return null;

    var char = curPos;
    while(distance-- > 0) { char = preOneChar(cm, char); }
    return char;
    
    function preOneChar(cm, curPos) {
        if (curPos === null) return null;
    
        var prePos = { line: curPos.line, ch: curPos.ch - 1 };
        var line = cm.getLine(prePos.line);
        if (curPos.ch === 0) {
            if (prePos.line === cm.firstLine()) return null;
            line = cm.getLine(--prePos.line);
            prePos.ch = line.length - 1;
        }
        prePos.text = line[prePos.ch];
        return prePos;
    }
}


/**
 * Get the next charactor which relates to the charactor with given position
 * @param {CodeMirror} cm - Instance of CodeMirror
 * @param {object} curPos - Current position of the charactor
 * @param {number} curPos.line - Line number of current charactor
 * @param {number} curPos.ch - Position of the charactor in the line
 * @param {number} [distance=1] - Distance between target charactor and current charactor
 * @returns {object} Position and value of the next charactor
 */
function nxtChar(cm, curPos, distance=1) {
    if(distance < 0) return null;

    var char = curPos;
    while(distance-- > 0) { char = nxtOneChar(cm, char); }
    return char;

    function nxtOneChar(cm, curPos) {
        if (curPos === null) return null;
        
        var nxtPos = { line: curPos.line, ch: curPos.ch + 1 };
        var line = cm.getLine(nxtPos.line);
        if (curPos.ch === line.length) {
            if (curPos.line === cm.lastLine()) return null;
            line = cm.getLine(++nxtPos.line);
            nxtPos.ch = 0;
        }
        nxtPos.text = line[nxtPos.ch];
        return nxtPos;
    }
}

module.exports = {
    preChar: preChar,
    nxtChar: nxtChar
}