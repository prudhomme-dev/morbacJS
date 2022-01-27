let random = (nbOccurence = 5, minimum = 0, maximum = 10) => {
    if (minimum >= maximum || nbOccurence <= 0) return -1
    else {
        let resultat = []
        for (let i = 0; i < nbOccurence; ++i) {
            let calculmax = maximum - minimum + 1
            resultat.push(Math.floor(Math.random() * calculmax + minimum))
        }
        if (resultat.length == 1) return parseInt(resultat)
        else return resultat
    }
}

let cases = document.querySelectorAll(".case")
let players = document.querySelectorAll(".player")
let winnerDiv = document.querySelector(".winner h2")
let choices = {
    player_1: [],
    player_2: []
}
let score = [0, 0]
let winner = 0

const choicePlayer = (e) => {
    winnerDiv.innerHTML = ""
    let playerActive = 0
    for (let i = 0; i < document.querySelectorAll(".player").length; ++i) {
        if (players[i].children[0].classList.contains("playerActive")) {
            playerActive = players[i].children[0].dataset.player
        }
    }

    choices["player_" + playerActive].push(e.target.dataset.case)
    controlWinner()
    cases[e.target.dataset.case].classList.add("choicePlayer" + playerActive)
    cases[e.target.dataset.case].removeEventListener("click", choicePlayer)
    togglePlayer()

}


// Contrôle du gagnant
const controlWinner = () => {
    let indicePlayer = 0
    let keys = Object.keys(choices)
    for (let i of keys) {
        indicePlayer++
        if (arrayFind(choices[i], 0) && arrayFind(choices[i], 4) && arrayFind(choices[i], 8)) winner = indicePlayer
        else if (arrayFind(choices[i], 6) && arrayFind(choices[i], 4) && arrayFind(choices[i], 2)) winner = indicePlayer
        else if (arrayFind(choices[i], 0) && arrayFind(choices[i], 1) && arrayFind(choices[i], 2)) winner = indicePlayer
        else if (arrayFind(choices[i], 3) && arrayFind(choices[i], 4) && arrayFind(choices[i], 5)) winner = indicePlayer
        else if (arrayFind(choices[i], 6) && arrayFind(choices[i], 7) && arrayFind(choices[i], 8)) winner = indicePlayer
        else if (arrayFind(choices[i], 0) && arrayFind(choices[i], 3) && arrayFind(choices[i], 6)) winner = indicePlayer
        else if (arrayFind(choices[i], 1) && arrayFind(choices[i], 4) && arrayFind(choices[i], 7)) winner = indicePlayer
        else if (arrayFind(choices[i], 2) && arrayFind(choices[i], 5) && arrayFind(choices[i], 8)) winner = indicePlayer
    }
    if (winner != 0) {
        winnerDiv.innerHTML = "Le joueur " + winner + " a gagné"
        score[winner - 1]++
        // Désactivation de tous les clics possible sur les cases
        for (let i = 0; i < cases.length; ++i) {
            cases[i].removeEventListener("click", choicePlayer)
        }
        document.querySelector(".reset").style.display = "block"
    } else {
        let caseAllChecked = 0
        for (let i = 0; i < cases.length; ++i) {
            if (cases[i].classList.length == 2) {
                caseAllChecked++
            }
        }
        if (caseAllChecked == 8) {
            winnerDiv.innerHTML = "Aucun joueur ne gagne"
            document.querySelector(".reset").style.display = "block"
        }
    }
}

// Changement du joueur actif
const togglePlayer = () => {
    for (let i = 0; i < players.length; ++i) {
        players[i].children[0].classList.toggle("playerActive")
    }
}


// Recherche dand un tableau
const arrayFind = (myArray, request) => {
    for (let i = 0; i < myArray.length; ++i) {
        let indexFind = myArray.find(element => element == request)
        if (indexFind) return true
    }
}

// Activation des cases au click
const activateCase = (e) => {
    let myCase = document.querySelectorAll(".case")
    for (let i = 0; i < myCase.length; ++i) {
        myCase[i].dataset.case = i
        myCase[i].addEventListener("click", choicePlayer)
    }
}

// Choix aléatoire du premier joueur
const firstPlayerRandom = () => {
    let firstPlayer = random(1, 1, 2)
    if (firstPlayer == 1) {
        document.querySelector(".player1").classList.add("playerActive")
        document.querySelector(".player2").classList.remove("playerActive")
    } else {
        document.querySelector(".player2").classList.add("playerActive")
        document.querySelector(".player1").classList.remove("playerActive")
    }
    document.querySelector(".reset").style.display = "none"
    winnerDiv.innerHTML = "Le joueur " + firstPlayer + " commence à jouer"
}

// Relance une partie
const resetGame = () => {
    choices = {
        player_1: [],
        player_2: []
    }
    winner = 0
    for (let i = 0; i < cases.length; ++i) {
        cases[i].classList.remove("choicePlayer1")
        cases[i].classList.remove("choicePlayer2")
    }
    activateCase()
    firstPlayerRandom()
    updateScore()
}

// Mise à jour des scores
const updateScore = () => {
    let scoreH4 = document.querySelectorAll(".score")
    scoreH4[0].innerHTML = score[0]
    scoreH4[1].innerHTML = score[1]
}

document.querySelector(".reset").addEventListener("click", resetGame)
resetGame()