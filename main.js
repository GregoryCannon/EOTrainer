const randomizeBtn = document.getElementById("random");
const checkButton = document.getElementById("check");
const scrambleType = document.getElementById("scramble-type");
const image = document.getElementById("image");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const scrambleDiv = document.getElementById("scramble");
const solutionAlgDiv = document.getElementById("solution-alg");
const scrambleLength = document.getElementById("scramble-length");
const sliderContainer = document.getElementById("slider-container")
const subsetsContainer = document.getElementById("subsets-container");
const showScramble = document.getElementById("show-scramble");
const showArrows = document.getElementById("show-arrows");
const cnType = document.getElementById("cn-type");


function isPetrus(){
    return scrambleType.value == "petrus";
}

function getColorNeutralType(){
    return cnType.value;
}

function shouldShowArrows(){
    return showArrows.checked;
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

function randomize() {
    let scramble;
    let caseGroup;
    let solutionAlg;

    switch (scrambleType.value) {
        case "petrus":
            [scramble, caseGroup, _] = getPetrusScramble();
            break;

        case "apb-beginner":
            [scramble, caseGroup, solutionAlg] = getApbScramble([1, 0, 0, 0, 0]);
            break;

        case "apb-full":
            const inclusionArray = [
                0,
                document.getElementById("box-ou").checked ? 1 : 0,
                document.getElementById("box-or").checked ? 1 : 0,
                document.getElementById("box-mu").checked ? 1 : 0,
                document.getElementById("box-mr").checked ? 1 : 0,
            ];
            [scramble, caseGroup, solutionAlg] = getApbScramble(inclusionArray);
            break;
    }

    console.log("selected scramble:", scramble, "\n", caseGroup, "\n", solutionAlg);
    if (SHOW_CONTROL){
        image.src = `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&alg=${scramble}&bg=t`
    } else {
        image.style.visibility = "hidden";
    }

    // Render cube and scramble
    const cube = new Cube();
    cube.doScramble(scramble);
    image2.src = cube.getSource(caseGroup, getColorNeutralType(), shouldShowArrows());
    scrambleDiv.innerHTML = scramble;
    solutionAlgDiv.innerHTML = "Solution: " + solutionAlg;

    // Render the answer (after a delay)
    image3.style.visibility = "hidden";
    solutionAlgDiv.style.visibility = "hidden";
    setTimeout(() => {
        image3.src = cube.getOrientedMask();
    }, 400); // We add delay so main image can load first (when the VisualCube servers are slow)
}

function showAnswer(){
    image3.style.visibility = "visible";
    solutionAlgDiv.style.visibility = "visible";
}

function updateScrambleVisibility(){
    const shouldShowSlider = showScramble.checked && scrambleType.value === "petrus";
    sliderContainer.style.display = shouldShowSlider ? "flex" : "none";
    scrambleDiv.style.display = showScramble.checked ? "block" : "none";
}

function onMethodUpdated() {
    subsetsContainer.style.display = scrambleType.value === "apb-full" ? "inline-block" : "none";
    updateScrambleVisibility();
}

// function test() {
//     const cube = new Cube();
//     cube.doScramble("F B' R F' B");
//     image.src = cube.getSource(CASE_PETRUS);
// }

showScramble.addEventListener("change", updateScrambleVisibility);
scrambleType.addEventListener("change", onMethodUpdated);
randomizeBtn.addEventListener("click", randomize);
checkButton.addEventListener("click", showAnswer);

updateScrambleVisibility();
onMethodUpdated();
randomize();
// test();

const testResult = cleanScramble("F' U2 F F' U2 F ");
console.log(testResult);