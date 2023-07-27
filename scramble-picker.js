
const SNIPPETS = ["R U'", "R' U2", "U' R2", "U R", "U' R", "U2 R'", "F' U2 F", "B U B'", "F' U F", "B U2 B'", "F R' F'", "B' R B", "F' B U' F B'", "F B' R F' B"];
// Split the scramble data into its 5 subsets
const [PAIR_SOLVED_EO, ORIENTED_U, ORIENTED_R, MISORIENTED_U, MISORIENTED_R] = SCRAMBLE_DATA;


function getPetrusScramble(){
    let scramble = "";
    console.log("length:", scrambleLength.value);
    for (let i = 0; i < scrambleLength.value; i++) {
        const index = Math.floor(Math.random() * SNIPPETS.length);
        scramble += SNIPPETS[index];
        scramble += " ";
    }
    // Remove any redundancies
    scramble = cleanScramble(scramble);
    return [scramble, SUBSET_PETRUS, ""];
}

function randomFromList(list){
    return list[Math.floor(Math.random() * list.length)];
}

/** 
 * Gets a scramble for the APB method. 
 * Takes as an argument an inclusion array, which specifies which of the 5 sets should be included.
 * e.g. Beginner APB = [1, 0, 0, 0, 0], just misoriented U = [0, 1, 0, 0, 0], and all full APB sets would be [0, 1, 1, 1, 1].
 */
function getApbScramble(inclusionArray){
    if (inclusionArray.join("") == "00000"){
        console.error("Tried to get APB scramble with no subsets selected.");
        return ["", ""];
    }

    // Pick a subset
    let chosenSubset = null;
    while (chosenSubset == null){
        const subset = Math.floor(Math.random() * 5);
        if (inclusionArray[subset] == 1){
            chosenSubset = subset;
        }
    }

    // Pick a case
    const caseList = SCRAMBLE_DATA[chosenSubset].cases;
    const chosenCase = randomFromList(caseList);

    // Pick a scramble
    const scramble = randomFromList(chosenCase.scrambles); 
    
    return [scramble, chosenSubset, chosenCase.alg]
}

function cleanScrambleInternal(scramble) {
    let totalTurns = 0;
    let cleanScramble = "";
    const moves = scramble.trim().split(" ");
    for (let i = 0; i < moves.length; i++){
        console.log("in progress clean scramble", cleanScramble);
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
    console.log("completed scramble internal", cleanScramble);
    return cleanScramble;
}

function cleanScramble(scramble) {
    console.log("original scramble:", scramble);
    
    let prevIteration = null;
    let result = scramble;
    while (result !== prevIteration && result){
        console.log("Cleaning...");
        prevIteration = result;
        result = cleanScrambleInternal(prevIteration);
    }
    console.log("clean scramble:", result);
    return result;
}