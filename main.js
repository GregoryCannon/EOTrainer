console.log("Hi");

const randomizeBtn = document.getElementById("random");
const checkButton = document.getElementById("check");
const image = document.getElementById("image");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");

const SHOW_CONTROL = false;

const SNIPPETS = ["R", "R'", "R2", "U", "U'", "U2", "F' U F", "B U2 B'", "F R' F'", "B' R B", "F' B U' F B'", "F B' R F' B"];
const cube = new Cube();

function randomize(){
    console.log("Random clicked");

    let scramble = "";
    for (let i = 0; i < 8; i++) {
        const index = Math.floor(Math.random() * SNIPPETS.length);
        scramble += SNIPPETS[index];
        scramble += " ";
    }

    console.log(scramble);
    if (SHOW_CONTROL){
        image.src = `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&alg=${scramble}&bg=t`
    } else {
        image.style = "display: none";
    }

    cube.reset();
    cube.doScramble(scramble);
    image2.src = cube.getSource();

    image3.style.display = "none";
    image3.src = cube.getOrientedMask();
}

function showAnswer(){
    image3.style.display = "block";
}

function test() {
    cube.reset();
    cube.doScramble("F B' R F' B");
    image.src = cube.getSource();
}

randomizeBtn.addEventListener("click", randomize);
checkButton.addEventListener("click", showAnswer);

randomize();
// test();

