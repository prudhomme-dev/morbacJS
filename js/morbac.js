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
let winLine = document.querySelector(".win-line")

const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
]

let choices = {
    player_1: [],
    player_2: []
}
let score = [0, 0]
let winner = 0

const choicePlayer = (e) => {
    winnerDiv.innerHTML = ""
    const activeEl = [...players].find(p => p.classList.contains("active"))
    const playerActive = activeEl ? activeEl.dataset.player : "0"

    choices["player_" + playerActive].push(e.target.dataset.case)
    cases[e.target.dataset.case].classList.add("choicePlayer" + playerActive)
    cases[e.target.dataset.case].removeEventListener("click", choicePlayer)

    const gameOver = controlWinner()
    if (!gameOver) {
        togglePlayer()
    }
}


// Recherche d'une combinaison gagnante pour un joueur
const findWinningCombo = (playerChoices) => {
    return WIN_COMBOS.find(combo =>
        combo.every(idx => playerChoices.includes(String(idx)))
    )
}

// Surligne les 3 cases gagnantes
const highlightWinningCells = (combo) => {
    combo.forEach(idx => cases[idx].classList.add("winning"))
}

// Trace la ligne gagnante entre la 1re et la 3e case de la combo
const drawWinLine = (combo) => {
    const game = document.querySelector(".game")
    const firstRect = cases[combo[0]].getBoundingClientRect()
    const lastRect = cases[combo[2]].getBoundingClientRect()
    const gameRect = game.getBoundingClientRect()

    const x1 = firstRect.left + firstRect.width / 2 - gameRect.left
    const y1 = firstRect.top + firstRect.height / 2 - gameRect.top
    const x2 = lastRect.left + lastRect.width / 2 - gameRect.left
    const y2 = lastRect.top + lastRect.height / 2 - gameRect.top

    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI

    winLine.style.setProperty("--line-length", length + "px")
    winLine.style.left = x1 + "px"
    winLine.style.top = (y1 - 2) + "px"
    winLine.style.width = length + "px"
    winLine.style.transform = `rotate(${angle}deg)`
    winLine.classList.add("visible")
}

// Lance les confettis si l'API est dispo et que l'utilisateur n'a pas réduit les animations
const fireConfetti = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (window.confetti && !reduceMotion) {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ["#00ffff", "#ff00ff", "#ffff00", "#f0e6ff"]
        })
    }
}

// Contrôle du gagnant — retourne true si la partie est terminée (victoire ou nul)
const controlWinner = () => {
    let winningPlayer = 0
    let winningCombo = null

    for (let i = 1; i <= 2; i++) {
        const combo = findWinningCombo(choices["player_" + i])
        if (combo) {
            winningPlayer = i
            winningCombo = combo
            break
        }
    }

    if (winningPlayer !== 0) {
        winner = winningPlayer
        winnerDiv.innerHTML = "Le joueur " + winner + " a gagné"
        score[winner - 1]++
        cases.forEach(c => c.removeEventListener("click", choicePlayer))
        highlightWinningCells(winningCombo)
        drawWinLine(winningCombo)
        fireConfetti()
        updateScore()
        return true
    }

    const filledCount = [...cases].filter(c =>
        c.classList.contains("choicePlayer1") || c.classList.contains("choicePlayer2")
    ).length
    if (filledCount === 9) {
        winnerDiv.innerHTML = "Match nul"
        return true
    }

    return false
}

// Changement du joueur actif
const togglePlayer = () => {
    players.forEach(p => p.classList.toggle("active"))
}


// Activation des cases au click
const activateCase = () => {
    let myCase = document.querySelectorAll(".case")
    for (let i = 0; i < myCase.length; ++i) {
        myCase[i].dataset.case = i
        myCase[i].addEventListener("click", choicePlayer)
    }
}

// Choix aléatoire du premier joueur
const firstPlayerRandom = () => {
    const firstPlayer = random(1, 1, 2)
    players.forEach(p => {
        if (p.dataset.player == firstPlayer) {
            p.classList.add("active")
        } else {
            p.classList.remove("active")
        }
    })
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
        cases[i].classList.remove("winning")
        cases[i].removeEventListener("click", choicePlayer)
    }
    winLine.classList.remove("visible")
    winLine.style.width = "0"
    winLine.style.transform = ""
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