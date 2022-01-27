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

const choicePlayer = (e) => {
    console.log(e.target.dataset.case)
    let playerActive=0
    console.log(cases[e.target.dataset.case])
    console.log(players[0].children[0].classList)
    for (let i = 0; i < document.querySelectorAll(".player").length; ++i) {
        if (players[i].children[0].classList.contains("playerActive"))
        {
            playerActive= players[i].children[0].dataset.player
        }
    }
    cases[e.target.dataset.case].classList.add("choicePlayer"+playerActive)
    cases[e.target.dataset.case].removeEventListener("click", choicePlayer)
    togglePlayer()

}

// Changement du joueur actif
const togglePlayer=() =>
{
    for (let i=0; i<players.length; ++i)
    {
        players[i].children[0].classList.toggle("playerActive")
    }
}

// Mise à jour de la hauteur des cases
const updateHeight = (e) => {
    let myCase = document.querySelectorAll(".case")
    for (let i = 0; i < myCase.length; ++i) {
        myCase[i].style.height = myCase[i].clientWidth + "px"
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
}



window.addEventListener("resize", updateHeight)
updateHeight()
firstPlayerRandom()