// Each turn spins the stickers on that face
const SPINS = {
    R: [12, 13, 14, 15],
    U: [0, 1, 2, 3],
    F: [8, 9, 10, 11],
    B: [16, 17, 18, 19]
}
// Each turn also slices stickers on adjacent faces
const SLICES = {
    R: [1, 19, 21, 9],
    U: [16, 12, 8, 4],
    F: [2, 15, 20, 5],
    B: [0, 7, 22, 13]
}


class Cube {
    constructor(){
        this.reset();
    }

    reset(){
        this.edges = "uuuullllffffrrrrbbbbdddd".split("");
    }

    doScramble(scramble){
        for (const turn of scramble.trim().split(" ")){
            this.doTurn(turn);
        }
    }
    
    doTurn(turn){
        const face = turn[0];
        const type = turn[1];

        // Support prime and double turns
        let numTurns = 1;
        if (type === "'"){
            numTurns = 3;
        } else if (type === "2"){
            numTurns = 2;
        }

        for (let i = 0; i < numTurns; i++){
            this.doTurnInternal(face);
        }
    }

    doTurnInternal(turn){
        this.cycleStickers(SLICES[turn]);
        this.cycleStickers(SPINS[turn]);
    }

    cycleStickers(stickerArray){
        const [a, b, c, d] = stickerArray;
        let temp = this.edges[d];
        this.edges[d] = this.edges[c];
        this.edges[c] = this.edges[b];
        this.edges[b] = this.edges[a];
        this.edges[a] = temp;
    }

    getSource(){
        let str = "oooouooooooooroooooooffoffo".split("");

        // This mapping is super manual because the internal model of the edges
        // follows BLD standard ordering, and VisualCube uses a weird order I don't like

        // U edges
        str[1] = this.edges[0];
        str[3] = this.edges[3];
        str[5] = this.edges[1];
        str[7] = this.edges[2];
        // R edges
        str[10] = this.edges[12];
        str[12] = this.edges[15];
        str[14] = this.edges[13];
        str[16] = this.edges[14];
        // F edges
        str[19] = this.edges[8];
        str[23] = this.edges[9];

        return `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&fd=${str.join("")}&bg=t`
    }
}