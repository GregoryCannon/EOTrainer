const randomizeBtn = document.getElementById("random");
const checkButton = document.getElementById("check");
const scrambleType = document.getElementById("scramble-type");
const image = document.getElementById("image");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const scrambleDiv = document.getElementById("scramble");
const scrambleDisclaimer = document.getElementById("scramble-disclaimer");
const scrambleLength = document.getElementById("scramble-length");
const sliderContainer = document.getElementById("slider-container")
const showScramble = document.getElementById("show-scramble");
const showArrows = document.getElementById("show-arrows");
const cnType = document.getElementById("cn-type");


function isBeginnerAPB(){
    return scrambleType.value == "apb-beginner";
}

function isAdvancedAPB(){
    return scrambleType.value == "apb-full";
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
    if (isAdvancedAPB()){
        const response = getAdvancedAPBScramble();
        console.log(response);
        [scramble, caseGroup] = response;
    } else if (isBeginnerAPB()){
        scramble = getBeginnerAPBScramble();
        caseGroup = CASE_BEGINNER_INSERTED;
    } else {
        scramble = getPetrusScramble();
        caseGroup = CASE_PETRUS;
    }

    console.log(scramble);
    if (SHOW_CONTROL){
        image.src = `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&alg=${scramble}&bg=t`
    } else {
        image.style = "display: none";
    }

    const cube = new Cube();
    cube.doScramble(scramble);
    image2.src = cube.getSource(caseGroup, getColorNeutralType(), shouldShowArrows());
    scrambleDiv.innerHTML = cleanScramble(scramble);

    image3.style.display = "none";
    image3.src = cube.getOrientedMask();
}

function showAnswer(){
    image3.style.display = "block";
}

function updateScrambleVisibility(){
    sliderContainer.style.display = showScramble.checked ? "flex" : "none";
    scrambleDiv.style.display = showScramble.checked ? "block" : "none";
    scrambleDisclaimer.style.display = showScramble.checked ? "block" : "none";
}

// function test() {
//     const cube = new Cube();
//     cube.doScramble("F B' R F' B");
//     image.src = cube.getSource(CASE_PETRUS);
// }

showScramble.addEventListener("change", updateScrambleVisibility);
randomizeBtn.addEventListener("click", randomize);
checkButton.addEventListener("click", showAnswer);

updateScrambleVisibility();
randomize();
// test();

// const testResult = cleanScramble("U R B' R B R' U2 U2 R' U R R' U2 R U' F R' F'");
// console.log(testResult);