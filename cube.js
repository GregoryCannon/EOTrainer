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
const DISPLAYED_EDGES = [0, 1, 2, 3, 8, 9, 12, 13, 14, 15];

const COLOR_SCHEME_LOOKUP = {}
COLOR_SCHEME_LOOKUP[CN_WB_ONLY] = ["ygrwbo"];
COLOR_SCHEME_LOOKUP[CN_WHITE_ONLY] = [
    "yrbwog",
    "ybowgr",
    "yogwrb",
    "ygrwbo"
]
COLOR_SCHEME_LOOKUP[CN_X2Y] = [
    "yrbwog",
    "ybowgr",
    "yogwrb",
    "ygrwbo",
    "wbrygo",
    "wrgyob",
    "wgoybr",
    "wobyrg",
]

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

    getCharForEdge(edgeIndex) {
        return this.isOriented(edgeIndex) ? "o" : "n";
    }

    getPartner(edgeIndex) {
        switch(edgeIndex){
            case 0: return 16;
            case 1: return 12;
            case 2: return 8;
            case 3: return 4;
            case 8: return 2;
            case 9: return 15;
            case 12: return 1;
            case 13: return 19;
            case 14: return 21;
            case 15: return 9;
        }
    }
    
    isBREdge(edgeIndex){
        const sticker = this.edges[edgeIndex];
        const pSticker = this.edges[this.getPartner(edgeIndex)];
        return (sticker == 'b' && pSticker == 'r') || (sticker == 'r' && pSticker == 'b');
    }

    isFREdge(edgeIndex){
        const sticker = this.edges[edgeIndex];
        const pSticker = this.edges[this.getPartner(edgeIndex)];
        return (sticker == 'f' && pSticker == 'r') || (sticker == 'r' && pSticker == 'f');
    }

    isF2LEdge(edgeIndex){
        return this.isFREdge(edgeIndex) || this.isBREdge(edgeIndex);
    }

    isOriented(edgeIndex){
        const sticker = this.edges[edgeIndex];
        const partnerIndex = this.getPartner(edgeIndex);
        const pSticker = this.edges[partnerIndex];

        // TOP EDGE
        if (edgeIndex <= 3){
            // Obvious cases
            if(sticker == 'u' || sticker == 'd'){
                return true;
            }
            if (sticker == 'r' || sticker == "l"){
                return false;
            }
            // If F/B sticker on top, it's good iff it's an F2L piece
            return (pSticker == 'l' || pSticker == 'r')
        }

        // RIGHT EDGE
        if (edgeIndex >= 12){
            if(sticker == 'u' || sticker == 'd'){
                return false;
            }
            if (sticker == 'r' || sticker == "l"){
                return true;
            }
            // If F/B sticker on top, it's good iff it's a top layer piece
            return (pSticker == 'u' || pSticker == 'd')
        }
        
        // FRONT EDGE (recurse on partner sticker)
        return this.isOriented(partnerIndex);
    }

    getOrientedMask(){
        let str = "oooouooooooooroooooooffoffo".split("");

        for (const edgeIndex of DISPLAYED_EDGES){
            str[this.getVcStringIndexForEdge(edgeIndex)] = this.getCharForEdge(edgeIndex);
        }

        return `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&fd=${str.join("")}&bg=t`
    }

    getVcStringIndexForEdge(edgeIndex) {
        // This mapping is super manual because the internal model of the edges
        // follows BLD standard ordering, and VisualCube uses a weird order I don't like
        switch (edgeIndex){
            // U edges
            case 0: return 1;
            case 1: return 5;
            case 2: return 7;
            case 3: return 3;
            // R edges
            case 12: return 10;
            case 13: return 14;
            case 14: return 16;
            case 15: return 12;
            // F edges
            case 8: return 19;
            case 9: return 23;
        }
    }

    getArrowStringForEdge(edgeIndex) {
        // This mapping is super manual because the internal model of the edges
        // follows BLD standard ordering, and VisualCube uses a weird order I don't like
        switch (edgeIndex){
            // U edges
            case 0: return "U1U1";
            // case 1: return "U5U5"; // redundant
            case 2: return "U7U7";
            case 3: return "U3U3";
            // R edges
            case 12: return "R1R1";
            case 13: return "R5R5";
            case 14: return "R7R7";
            case 15: return "R3R3";
            // F edges
            // case 8: return "F1F1"; // redundant
            // case 9: return "F5F5"; // redundant
        }
    }

    getSource(caseGroup, colorNeutralType, showArrows){
        console.log("Case group:", caseGroup);
        let vcStringRaw = "oooouooooooooroooooooffoffo";

        switch(caseGroup){
            case CASE_BEGINNER_INSERTED:
                vcStringRaw = "oooouooooooooroooroooffoffo"; break;
            case CASE_ORIENTED_R:
                vcStringRaw = "oooouooodroooroooooobffoffo"; break;
            case CASE_ORIENTED_U:
                vcStringRaw = "oooouooobdoooroooooorffoffo"; break;
            case CASE_BAD_R:
                vcStringRaw = "oodouooooooboroooroooffoffo"; break;
            case CASE_BAD_U:
                vcStringRaw = "oorouoooooodoroooroooffoffo"; break;

        }

        const vcStringArray = vcStringRaw.split("");
        // This mapping is super manual because the internal model of the edges
        // follows BLD standard ordering, and VisualCube uses a weird order I don't like

        for (const edgeIndex of DISPLAYED_EDGES){
            vcStringArray[this.getVcStringIndexForEdge(edgeIndex)] = this.edges[edgeIndex];
        }

        // Select a random x2/y neutral color scheme
        let colorSchemes = COLOR_SCHEME_LOOKUP[colorNeutralType];
        if (!colorSchemes){
            console.log("ERROR: no color schemes found for color neutral type", colorNeutralType);
        }
        const selectedScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

        // Add arrows for f2l edges
        let arrows = [];
        if (showArrows){
            for (const edgeIndex of DISPLAYED_EDGES){
                if (this.isF2LEdge(edgeIndex)){
                    arrows.push(this.getArrowStringForEdge(edgeIndex));
                }
            }
        }

        return `https://visualcube.api.cubing.net/visualcube.php?fmt=svg&r=y35x-30&fd=${vcStringArray.join("")}&bg=t&sch=${selectedScheme}&arw=${arrows.join(",")}&ac=fff`;
    }
}