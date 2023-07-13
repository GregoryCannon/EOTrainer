console.log("Hi");

const randomizeBtn = document.getElementById("random");
const checkButton = document.getElementById("check");
const scrambleType = document.getElementById("scramble-type");
const image = document.getElementById("image");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const scrambleDiv = document.getElementById("scramble");
const scrambleLength = document.getElementById("scramble-length");
const showScramble = document.getElementById("show-scramble");
const SHOW_CONTROL = false;

const SNIPPETS = ["R U'", "R' U2", "U' R2", "U R", "U' R", "U2 R'", "F' U2 F", "B U B'", "F' U F", "B U2 B'", "F R' F'", "B' R B", "F' B U' F B'", "F B' R F' B"];
const SCRAMBLE_LENGTH = 8;
const cube = new Cube();

function isBeginnerAPB(){
    return scrambleType.value == "apb-beginner";
}

function getPetrusScramble(){
    let scramble = "";
    console.log("length:", scrambleLength.value);
    for (let i = 0; i < scrambleLength.value; i++) {
        const index = Math.floor(Math.random() * SNIPPETS.length);
        scramble += SNIPPETS[index];
        scramble += " ";
    }
    return scramble;
}

function getBeginnerAPBScramble(){
    const testCube = new Cube();
    let scramble = getPetrusScramble();
    testCube.reset();
    testCube.doScramble(scramble);

    // Move BR edge to UR position
    const UR_EDGE_INDEX = 1;
    for (const move of "UUURRR"){
        if (testCube.isBREdge(UR_EDGE_INDEX)){
            break;
        }
        testCube.doTurn(move);
        scramble += move + " ";
    }
    if (testCube.edges[UR_EDGE_INDEX] == 'b'){
        testCube.doTurn("R");
        scramble += "R ";
    } else {
        testCube.doScramble("B U' B'");
        scramble += "B U' B' ";
    }

    return scramble;
}

function annotationToCount(annotation){
    if (annotation == "2"){
        return 2;
    } else if (annotation == "'"){
        return -1;
    } else {
        return 1;
    }
}

function countToAnnotation(count){
    switch (count){
        case 3: return "'";
        case 2: return "2";
        case 1: return "";
    }
}

function cleanScrambleInternal(scramble) {
    let totalTurns = 0;
    let cleanScramble = "";
    const moves = scramble.trim().split(" ");
    for (let i = 0; i < moves.length; i++){
        const move = moves[i];
        const face = move[0];
        const amount = annotationToCount(move[1]);
        const nextFace = i == moves.length - 1 ? null : moves[i+1][0];

        if (i == moves.length - 1 || face !== nextFace){
            // Add a new move to the final scramble
            const finalCount = (totalTurns + amount + 44) % 4;
            totalTurns = 0;
            if (finalCount > 0){
                cleanScramble += face + countToAnnotation(finalCount) + " "
            }
        } else {
            // Keep tallying
            totalTurns += amount;
        }
    }
    return cleanScramble;
}

function cleanScramble(scramble) {
    console.log("original scramble:", scramble);
    
    let prevIteration = null;
    let result = scramble;
    while (result !== prevIteration){
        console.log("Recursing...");
        prevIteration = result;
        result = cleanScrambleInternal(prevIteration);
    }
    console.log("clean scramble:", cleanScramble);
    return result;
}

function randomize() {
    console.log("Random clicked");

    const scramble = isBeginnerAPB() ? getBeginnerAPBScramble() : getPetrusScramble();

    console.log(scramble);
    if (SHOW_CONTROL){
        image.src = `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&alg=${scramble}&bg=t`
    } else {
        image.style = "display: none";
    }

    cube.reset();
    cube.doScramble(scramble);
    image2.src = cube.getSource(isBeginnerAPB());
    scrambleDiv.innerHTML = cleanScramble(scramble);

    image3.style.display = "none";
    image3.src = cube.getOrientedMask();
}

function showAnswer(){
    image3.style.display = "block";
}

function test() {
    cube.reset();
    cube.doScramble("F B' R F' B");
    image.src = cube.getSource(isBeginnerAPB());
}

showScramble.addEventListener("change", () => {
    scrambleDiv.style.display = showScramble.checked ? "block" : "none";
})
randomizeBtn.addEventListener("click", randomize);
checkButton.addEventListener("click", showAnswer);

// randomize();
// test();

const testResult = cleanScramble("U R B' R B R' U2 U2 R' U R R' U2 R U' F R' F'");
console.log(testResult);