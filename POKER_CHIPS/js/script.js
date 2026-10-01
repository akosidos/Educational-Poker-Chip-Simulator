// =========================================================
// BSIT POKER CALCULATOR
// =========================================================


// =========================================================
// ELEMENTS
// =========================================================

const setupScreen =
    document.getElementById("setupScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultsScreen =
    document.getElementById("resultsScreen");


const anteAmount =
    document.getElementById("anteAmount");

const playerSeats =
    document.getElementById("playerSeats");

const playerCountDisplay =
    document.getElementById("playerCountDisplay");


const addPlayerButton =
    document.getElementById("addPlayerButton");

const removePlayerButton =
    document.getElementById("removePlayerButton");

const resetSetupButton =
    document.getElementById("resetSetupButton");

const startGameButton =
    document.getElementById("startGameButton");

const endGameButton =
    document.getElementById("endGameButton");

const newGameButton =
    document.getElementById("newGameButton");

const backToGameButton =
    document.getElementById("backToGameButton");


const potDisplay =
    document.getElementById("potDisplay");

const currentBetDisplay =
    document.getElementById("currentBetDisplay");

const playersRemainingDisplay =
    document.getElementById("playersRemainingDisplay");

const handDisplay =
    document.getElementById("handDisplay");

const stageDisplay =
    document.getElementById("stageDisplay");


const playersContainer =
    document.getElementById("playersContainer");


const activePlayer =
    document.getElementById("activePlayer");

const betAmount =
    document.getElementById("betAmount");


const checkButton =
    document.getElementById("checkButton");

const callButton =
    document.getElementById("callButton");

const betButton =
    document.getElementById("betButton");

const raiseButton =
    document.getElementById("raiseButton");

const foldButton =
    document.getElementById("foldButton");


const actionMessage =
    document.getElementById("actionMessage");


const roundMessage =
    document.getElementById("roundMessage");

const roundMessageTitle =
    document.getElementById("roundMessageTitle");

const roundMessageText =
    document.getElementById("roundMessageText");

const nextRoundButton =
    document.getElementById("nextRoundButton");


const actionPanel =
    document.getElementById("actionPanel");

const winnerPanel =
    document.getElementById("winnerPanel");

const winnerSelect =
    document.getElementById("winnerSelect");

const awardPotButton =
    document.getElementById("awardPotButton");


const gameLog =
    document.getElementById("gameLog");

const clearLogButton =
    document.getElementById("clearLogButton");


const resultsList =
    document.getElementById("resultsList");


// =========================================================
// CONSTANTS
// =========================================================

const MIN_PLAYERS = 2;

const MAX_PLAYERS = 8;


const STAGES = [
    "Pre-Flop",
    "Flop",
    "Turn",
    "River"
];


// =========================================================
// SETUP STATE
// =========================================================

let setupPlayerCount = 4;


// =========================================================
// GAME STATE
// =========================================================

let game = {

    players: [],

    pot: 0,

    currentBet: 0,

    ante: 1,

    handNumber: 1,

    stageIndex: 0,

    roundComplete: false,

    potAwarded: false,

    log: []

};


// =========================================================
// CREATE PLAYER SEATS
// =========================================================

function createPlayerSeats() {

    const previousInputs =
        document.querySelectorAll(
            ".player-name-input"
        );


    const previousNames =
        [...previousInputs].map(
            input => input.value
        );


    document
        .querySelectorAll(".player-seat")
        .forEach(
            seat => seat.remove()
        );


    for (
        let i = 0;
        i < setupPlayerCount;
        i++
    ) {

        const seat =
            document.createElement("div");


        seat.className =
            `player-seat seat-${i + 1}`;


        const input =
            document.createElement("input");


        input.type = "text";

        input.className =
            "player-name-input";


        input.maxLength = 20;


        input.value =
            previousNames[i] ||
            `Player ${i + 1}`;


        input.placeholder =
            `Player ${i + 1}`;


        seat.appendChild(input);

        playerSeats.appendChild(seat);

    }


    playerCountDisplay.textContent =
        setupPlayerCount;


    updatePlayerControls();

}


// =========================================================
// PLAYER COUNT CONTROLS
// =========================================================

function updatePlayerControls() {

    removePlayerButton.disabled =
        setupPlayerCount <= MIN_PLAYERS;


    addPlayerButton.disabled =
        setupPlayerCount >= MAX_PLAYERS;

}


function addPlayer() {

    if (
        setupPlayerCount >= MAX_PLAYERS
    ) {

        return;

    }


    setupPlayerCount++;

    createPlayerSeats();

}


function removePlayer() {

    if (
        setupPlayerCount <= MIN_PLAYERS
    ) {

        return;

    }


    setupPlayerCount--;

    createPlayerSeats();

}


// =========================================================
// RESET SETUP
// =========================================================

function resetSetup() {

    anteAmount.value = 1;

    setupPlayerCount = 4;

    createPlayerSeats();

}


// =========================================================
// START GAME
// =========================================================

function startGame() {

    const ante =
        Number(anteAmount.value);


    if (
        !Number.isInteger(ante) ||
        ante < 0
    ) {

        alert(
            "Please enter a valid ante."
        );

        return;

    }


    const nameInputs =
        document.querySelectorAll(
            ".player-name-input"
        );


    game = {

        players: [],

        pot: 0,

        currentBet: 0,

        ante: ante,

        handNumber: 1,

        stageIndex: 0,

        roundComplete: false,

        potAwarded: false,

        log: []

    };


    nameInputs.forEach(
        (input, index) => {

            let name =
                input.value.trim();


            if (name === "") {

                name =
                    `Player ${index + 1}`;

            }


            game.players.push({

                id: index,

                name: name,

                /*
                    Money/chips contributed throughout
                    the ENTIRE game.
                */

                totalContributed: 0,

                /*
                    Money/chips received from winning
                    pots throughout the game.
                */

                totalWon: 0,

                /*
                    Amount contributed during the
                    CURRENT betting round.
                */

                roundBet: 0,

                folded: false,

                /*
                    Has this player responded since
                    the latest bet/raise?
                */

                acted: false

            });

        }
    );


    addLog(
        `Game started with ${game.players.length} players.`
    );


    addLog(
        `Ante is ₱${game.ante}.`
    );


    startNewHand();


    showGame();

    updateGame();

}


// =========================================================
// START NEW HAND
// =========================================================

function startNewHand() {

    game.pot = 0;

    game.currentBet = 0;

    game.stageIndex = 0;

    game.roundComplete = false;

    game.potAwarded = false;


    game.players.forEach(
        player => {

            player.roundBet = 0;

            player.folded = false;

            player.acted = false;

        }
    );


    addLog(
        `Hand #${game.handNumber} started.`
    );


    collectAnte();

}


// =========================================================
// COLLECT ANTE
// =========================================================

function collectAnte() {

    if (game.ante <= 0) {

        return;

    }


    let total = 0;


    game.players.forEach(
        player => {

            player.totalContributed +=
                game.ante;


            game.pot +=
                game.ante;


            total +=
                game.ante;

        }
    );


    addLog(
        `Ante ₱${game.ante} collected from each player. ` +
        `₱${total} added to the pot.`
    );

}


// =========================================================
// SCREEN FUNCTIONS
// =========================================================

function showGame() {

    setupScreen.classList.add(
        "hidden"
    );


    resultsScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.remove(
        "hidden"
    );

}


function showResults() {

    gameScreen.classList.add(
        "hidden"
    );


    setupScreen.classList.add(
        "hidden"
    );


    resultsScreen.classList.remove(
        "hidden"
    );

}


// =========================================================
// UPDATE GAME
// =========================================================

function updateGame() {

    renderPlayers();

    updateGameInfo();

    updatePlayerSelect();

    updateWinnerSelect();

    updateActionMessage();

    updateActionButtons();

    renderLog();

}


// =========================================================
// GAME INFO
// =========================================================

function updateGameInfo() {

    potDisplay.textContent =
        `₱${game.pot}`;


    currentBetDisplay.textContent =
        `₱${game.currentBet}`;


    handDisplay.textContent =
        `Hand #${game.handNumber}`;


    stageDisplay.textContent =
        STAGES[game.stageIndex] ||
        "Showdown";


    const remaining =
        getRemainingPlayers();


    playersRemainingDisplay.textContent =
        remaining.length;

}


// =========================================================
// GET REMAINING PLAYERS
// =========================================================

function getRemainingPlayers() {

    return game.players.filter(
        player =>
            !player.folded
    );

}


// =========================================================
// RENDER PLAYERS
// =========================================================

function renderPlayers() {

    playersContainer.innerHTML = "";


    const selectedId =
        Number(activePlayer.value);


    game.players.forEach(
        player => {

            const card =
                document.createElement("div");


            card.className =
                "player-card";


            if (
                player.id === selectedId
            ) {

                card.classList.add(
                    "active"
                );

            }


            if (player.folded) {

                card.classList.add(
                    "folded"
                );

            }


            if (
                player.acted &&
                !player.folded
            ) {

                card.classList.add(
                    "acted"
                );

            }


            let status = "Waiting";


            if (player.folded) {

                status = "Folded";

            } else if (player.acted) {

                status = "Acted";

            }


            card.innerHTML = `

                <h3>
                    ${escapeHTML(player.name)}
                </h3>

                <p>
                    Round Bet:
                    <strong>
                        ₱${player.roundBet}
                    </strong>
                </p>

                <p>
                    Total Put In:
                    <strong>
                        ₱${player.totalContributed}
                    </strong>
                </p>

                <span class="player-status">
                    ${status}
                </span>

            `;


            card.addEventListener(
                "click",
                function () {

                    if (
                        !player.folded &&
                        !game.roundComplete
                    ) {

                        activePlayer.value =
                            player.id;


                        updateGame();

                    }

                }
            );


            playersContainer.appendChild(
                card
            );

        }
    );

}


// =========================================================
// UPDATE PLAYER SELECT
// =========================================================

function updatePlayerSelect() {

    const previousValue =
        activePlayer.value;


    activePlayer.innerHTML = "";


    game.players.forEach(
        player => {

            if (!player.folded) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    player.id;


                option.textContent =
                    player.name;


                activePlayer.appendChild(
                    option
                );

            }

        }
    );


    const exists =
        [...activePlayer.options]
            .some(
                option =>
                    option.value ===
                    previousValue
            );


    if (exists) {

        activePlayer.value =
            previousValue;

    }

}


// =========================================================
// WINNER SELECT
// =========================================================

function updateWinnerSelect() {

    const previous =
        winnerSelect.value;


    winnerSelect.innerHTML = "";


    getRemainingPlayers()
        .forEach(
            player => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    player.id;


                option.textContent =
                    player.name;


                winnerSelect.appendChild(
                    option
                );

            }
        );


    const exists =
        [...winnerSelect.options]
            .some(
                option =>
                    option.value ===
                    previous
            );


    if (exists) {

        winnerSelect.value =
            previous;

    }

}


// =========================================================
// ACTIVE PLAYER
// =========================================================

function getActivePlayer() {

    const id =
        Number(activePlayer.value);


    return game.players.find(
        player =>
            player.id === id
    );

}


// =========================================================
// CHECK
// =========================================================

function check() {

    const player =
        getActivePlayer();


    if (!player) {

        return;

    }


    if (
        player.roundBet !==
        game.currentBet
    ) {

        alert(
            `${player.name} cannot check. ` +
            `They need ₱${
                game.currentBet -
                player.roundBet
            } to call.`
        );

        return;

    }


    player.acted = true;


    addLog(
        `${player.name} checked.`
    );


    afterAction(player.id);

}


// =========================================================
// BET
// =========================================================

function bet() {

    const player =
        getActivePlayer();


    const amount =
        Number(betAmount.value);


    if (!player) {

        return;

    }


    if (game.currentBet !== 0) {

        alert(
            "There is already a bet. Use Call or Raise."
        );

        return;

    }


    if (!validAmount(amount)) {

        return;

    }


    player.roundBet +=
        amount;


    player.totalContributed +=
        amount;


    game.pot +=
        amount;


    game.currentBet =
        player.roundBet;


    /*
        A new bet means everybody else
        must respond.
    */

    resetActedAfterAggression(
        player.id
    );


    player.acted = true;


    addLog(
        `${player.name} bet ₱${amount}.`
    );


    betAmount.value = "";


    afterAction(player.id);

}


// =========================================================
// CALL
// =========================================================

function call() {

    const player =
        getActivePlayer();


    if (!player) {

        return;

    }


    const needed =
        game.currentBet -
        player.roundBet;


    if (needed <= 0) {

        alert(
            `${player.name} does not need to call.`
        );

        return;

    }


    player.roundBet +=
        needed;


    player.totalContributed +=
        needed;


    game.pot +=
        needed;


    player.acted = true;


    addLog(
        `${player.name} called ₱${needed}.`
    );


    afterAction(player.id);

}


// =========================================================
// RAISE
// =========================================================

function raiseBet() {

    const player =
        getActivePlayer();


    const raiseAmount =
        Number(betAmount.value);


    if (!player) {

        return;

    }


    if (game.currentBet === 0) {

        alert(
            "There is no bet to raise. Use Bet."
        );

        return;

    }


    if (!validAmount(raiseAmount)) {

        return;

    }


    const callAmount =
        game.currentBet -
        player.roundBet;


    const totalAmount =
        callAmount +
        raiseAmount;


    player.roundBet +=
        totalAmount;


    player.totalContributed +=
        totalAmount;


    game.pot +=
        totalAmount;


    game.currentBet =
        player.roundBet;


    /*
        Because somebody raised,
        everybody else must respond again.
    */

    resetActedAfterAggression(
        player.id
    );


    player.acted = true;


    addLog(
        `${player.name} raised by ₱${raiseAmount}. ` +
        `Current bet is now ₱${game.currentBet}.`
    );


    betAmount.value = "";


    afterAction(player.id);

}


// =========================================================
// RESET ACTION AFTER BET / RAISE
// =========================================================

function resetActedAfterAggression(
    aggressorId
) {

    game.players.forEach(
        player => {

            if (
                !player.folded &&
                player.id !== aggressorId
            ) {

                player.acted = false;

            }

        }
    );

}


// =========================================================
// FOLD
// =========================================================

function fold() {

    const player =
        getActivePlayer();


    if (!player) {

        return;

    }


    player.folded = true;

    player.acted = true;


    addLog(
        `${player.name} folded.`
    );


    const remaining =
        getRemainingPlayers();


    /*
        If only one player remains,
        the hand immediately ends.
    */

    if (remaining.length === 1) {

        finishByFold(
            remaining[0]
        );

        return;

    }


    afterAction(player.id);

}


// =========================================================
// AFTER EVERY ACTION
// =========================================================

function afterAction(lastPlayerId) {

    /*
        First check if the betting round
        is now finished.
    */

    if (isBettingRoundComplete()) {

        completeBettingRound();

        return;

    }


    /*
        Otherwise automatically move the
        selection to the next player who
        still needs to act.
    */

    selectNextPlayer(
        lastPlayerId
    );


    updateGame();

}


// =========================================================
// CHECK BETTING ROUND COMPLETE
// =========================================================

function isBettingRoundComplete() {

    const remaining =
        getRemainingPlayers();


    if (remaining.length <= 1) {

        return true;

    }


    /*
        Every remaining player must have
        acted.
    */

    const everyoneActed =
        remaining.every(
            player =>
                player.acted
        );


    /*
        Every remaining player must also
        have matched the current bet.
    */

    const betsMatched =
        remaining.every(
            player =>
                player.roundBet ===
                game.currentBet
        );


    return (
        everyoneActed &&
        betsMatched
    );

}


// =========================================================
// SELECT NEXT PLAYER
// =========================================================

function selectNextPlayer(
    currentId
) {

    const count =
        game.players.length;


    for (
        let offset = 1;
        offset <= count;
        offset++
    ) {

        const index =
            (currentId + offset) %
            count;


        const player =
            game.players[index];


        if (
            !player.folded &&
            (
                !player.acted ||
                player.roundBet <
                game.currentBet
            )
        ) {

            activePlayer.value =
                player.id;

            return;

        }

    }

}


// =========================================================
// COMPLETE BETTING ROUND
// =========================================================

function completeBettingRound() {

    game.roundComplete = true;


    addLog(
        `${STAGES[game.stageIndex]} betting round completed.`
    );


    roundMessage.classList.remove(
        "hidden"
    );


    actionPanel.classList.add(
        "hidden"
    );


    /*
        River completed.
        Time for showdown.
    */

    if (
        game.stageIndex ===
        STAGES.length - 1
    ) {

        roundMessageTitle.textContent =
            "River Complete!";


        roundMessageText.textContent =
            "All betting rounds are finished. Proceed to showdown.";


        nextRoundButton.textContent =
            "Go to Showdown";

    } else {

        const nextStage =
            STAGES[
                game.stageIndex + 1
            ];


        roundMessageTitle.textContent =
            "Betting Round Complete!";


        roundMessageText.textContent =
            `Everyone has finished acting. Proceed to ${nextStage}.`;


        nextRoundButton.textContent =
            `Go to ${nextStage}`;

    }


    updateGame();

}


// =========================================================
// NEXT BETTING ROUND
// =========================================================

function nextBettingRound() {

    /*
        River -> Showdown
    */

    if (
        game.stageIndex ===
        STAGES.length - 1
    ) {

        showShowdown();

        return;

    }


    game.stageIndex++;


    game.currentBet = 0;

    game.roundComplete = false;


    game.players.forEach(
        player => {

            player.roundBet = 0;

            player.acted = false;

        }
    );


    roundMessage.classList.add(
        "hidden"
    );


    actionPanel.classList.remove(
        "hidden"
    );


    addLog(
        `${STAGES[game.stageIndex]} betting round started.`
    );


    selectFirstAvailablePlayer();


    updateGame();

}


// =========================================================
// SELECT FIRST PLAYER
// =========================================================

function selectFirstAvailablePlayer() {

    const player =
        game.players.find(
            player =>
                !player.folded
        );


    if (player) {

        activePlayer.value =
            player.id;

    }

}


// =========================================================
// SHOWDOWN
// =========================================================

function showShowdown() {

    game.stageIndex =
        STAGES.length;


    roundMessage.classList.add(
        "hidden"
    );


    actionPanel.classList.add(
        "hidden"
    );


    winnerPanel.classList.remove(
        "hidden"
    );


    addLog(
        `Hand #${game.handNumber} reached showdown.`
    );


    updateGame();

}


// =========================================================
// WIN BY EVERYONE ELSE FOLDING
// =========================================================

function finishByFold(winner) {

    const winnings =
        game.pot;


    winner.totalWon +=
        winnings;


    game.pot = 0;

    game.potAwarded = true;


    addLog(
        `${winner.name} won Hand #${game.handNumber} ` +
        `because all other players folded. ` +
        `Pot: ₱${winnings}.`
    );


    alert(
        `${winner.name} wins ₱${winnings}!\n` +
        `Everyone else folded.`
    );


    startNextHand();

}


// =========================================================
// AWARD POT
// =========================================================

function awardPot() {

    if (game.pot <= 0) {

        alert(
            "There are no chips in the pot."
        );

        return;

    }


    const winnerId =
        Number(
            winnerSelect.value
        );


    const winner =
        game.players.find(
            player =>
                player.id ===
                winnerId
        );


    if (!winner) {

        return;

    }


    const winnings =
        game.pot;


    winner.totalWon +=
        winnings;


    game.pot = 0;

    game.potAwarded = true;


    addLog(
        `${winner.name} won Hand #${game.handNumber} ` +
        `and received ₱${winnings}.`
    );


    alert(
        `${winner.name} wins ₱${winnings}!`
    );


    startNextHand();

}


// =========================================================
// START NEXT HAND
// =========================================================

function startNextHand() {

    game.handNumber++;


    winnerPanel.classList.add(
        "hidden"
    );


    roundMessage.classList.add(
        "hidden"
    );


    actionPanel.classList.remove(
        "hidden"
    );


    startNewHand();


    selectFirstAvailablePlayer();


    updateGame();

}


// =========================================================
// ACTION MESSAGE
// =========================================================

function updateActionMessage() {

    if (game.roundComplete) {

        return;

    }


    const player =
        getActivePlayer();


    if (!player) {

        actionMessage.textContent =
            "No player available.";

        return;

    }


    if (player.folded) {

        actionMessage.textContent =
            `${player.name} has folded.`;

        return;

    }


    const needed =
        game.currentBet -
        player.roundBet;


    if (needed > 0) {

        actionMessage.textContent =
            `${player.name} needs ₱${needed} to call.`;

        return;

    }


    if (game.currentBet === 0) {

        actionMessage.textContent =
            `${player.name} may Check or Bet.`;

        return;

    }


    actionMessage.textContent =
        `${player.name} has matched ₱${game.currentBet}. ` +
        `They may Check or Raise.`;

}


// =========================================================
// ACTION BUTTONS
// =========================================================

function updateActionButtons() {

    const buttons = [

        checkButton,
        callButton,
        betButton,
        raiseButton,
        foldButton

    ];


    buttons.forEach(
        button => {

            button.disabled = true;

            button.classList.remove(
                "available"
            );

        }
    );


    if (game.roundComplete) {

        return;

    }


    const player =
        getActivePlayer();


    if (
        !player ||
        player.folded
    ) {

        return;

    }


    const needed =
        game.currentBet -
        player.roundBet;


    /*
        No bet exists.
        Player may check or bet.
    */

    if (game.currentBet === 0) {

        enableAction(
            checkButton
        );


        enableAction(
            betButton
        );


        enableAction(
            foldButton
        );


        return;

    }


    /*
        Player hasn't matched the bet.
    */

    if (needed > 0) {

        enableAction(
            callButton
        );


        enableAction(
            raiseButton
        );


        enableAction(
            foldButton
        );


        return;

    }


    /*
        Player has already matched
        current bet.
    */

    enableAction(
        checkButton
    );


    enableAction(
        raiseButton
    );


    enableAction(
        foldButton
    );

}


// =========================================================
// ENABLE BUTTON
// =========================================================

function enableAction(button) {

    button.disabled = false;

    button.classList.add(
        "available"
    );

}


// =========================================================
// END GAME
// =========================================================

function endGame() {

    /*
        Prevent ending while chips remain
        unawarded in the pot because that
        would make the final accounting
        incorrect.
    */

    if (game.pot > 0) {

        const confirmed =
            confirm(
                `There is still ₱${game.pot} in the pot.\n\n` +
                `The pot should normally be awarded before ending.\n\n` +
                `Show results anyway?`
            );


        if (!confirmed) {

            return;

        }

    }


    renderResults();

    showResults();

}


// =========================================================
// RESULTS
// =========================================================

function renderResults() {

    resultsList.innerHTML = "";


    game.players.forEach(
        player => {

            const net =
                player.totalWon -
                player.totalContributed;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-card";


            let resultClass =
                "even";


            let resultText =
                "₱0";


            if (net > 0) {

                resultClass = "win";

                resultText =
                    `+₱${net}`;

            } else if (net < 0) {

                resultClass = "loss";

                resultText =
                    `-₱${Math.abs(net)}`;

            }


            card.innerHTML = `

                <div>

                    <h3>
                        ${escapeHTML(player.name)}
                    </h3>

                    <div class="result-details">

                        Put In:
                        ₱${player.totalContributed}

                        &nbsp; • &nbsp;

                        Won:
                        ₱${player.totalWon}

                    </div>

                </div>


                <div
                    class="result-net ${resultClass}"
                >
                    ${resultText}
                </div>

            `;


            resultsList.appendChild(
                card
            );

        }
    );

}


// =========================================================
// VALIDATE AMOUNT
// =========================================================

function validAmount(amount) {

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return false;

    }


    return true;

}


// =========================================================
// GAME LOG
// =========================================================

function addLog(message) {

    game.log.unshift(
        message
    );


    if (
        game.log.length > 150
    ) {

        game.log.pop();

    }

}


function renderLog() {

    gameLog.innerHTML = "";


    game.log.forEach(
        message => {

            const entry =
                document.createElement(
                    "div"
                );


            entry.className =
                "log-entry";


            entry.textContent =
                message;


            gameLog.appendChild(
                entry
            );

        }
    );

}


// =========================================================
// HTML SAFETY
// =========================================================

function escapeHTML(text) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    return element.innerHTML;

}


// =========================================================
// NEW GAME
// =========================================================

function newGame() {

    const confirmed =
        confirm(
            "Start a completely new game?"
        );


    if (!confirmed) {

        return;

    }


    location.reload();

}


// =========================================================
// EVENT LISTENERS
// =========================================================

addPlayerButton.addEventListener(
    "click",
    addPlayer
);


removePlayerButton.addEventListener(
    "click",
    removePlayer
);


resetSetupButton.addEventListener(
    "click",
    resetSetup
);


startGameButton.addEventListener(
    "click",
    startGame
);


activePlayer.addEventListener(
    "change",
    updateGame
);


checkButton.addEventListener(
    "click",
    check
);


callButton.addEventListener(
    "click",
    call
);


betButton.addEventListener(
    "click",
    bet
);


raiseButton.addEventListener(
    "click",
    raiseBet
);


foldButton.addEventListener(
    "click",
    fold
);


nextRoundButton.addEventListener(
    "click",
    nextBettingRound
);


awardPotButton.addEventListener(
    "click",
    awardPot
);


endGameButton.addEventListener(
    "click",
    endGame
);


backToGameButton.addEventListener(
    "click",
    showGame
);


newGameButton.addEventListener(
    "click",
    newGame
);


clearLogButton.addEventListener(
    "click",
    function () {

        game.log = [];

        renderLog();

    }
);


// =========================================================
// INITIALIZE
// =========================================================

createPlayerSeats();
