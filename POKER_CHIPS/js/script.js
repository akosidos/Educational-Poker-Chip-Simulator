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

const setupPokerTable =
    document.getElementById("setupPokerTable");

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


const tablePotDisplay =
    document.getElementById("tablePotDisplay");

const tableStageDisplay =
    document.getElementById("tableStageDisplay");


const playersContainer =
    document.getElementById("playersContainer");


const activePlayer =
    document.getElementById("activePlayer");

const currentTurnDisplay =
    document.getElementById("currentTurnDisplay");

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

const resultsBalance =
    document.getElementById("resultsBalance");


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

    currentPlayerId: null,

    log: []

};


// =========================================================
// CREATE SETUP PLAYER SEATS
// =========================================================

function createSetupPlayerSeats() {

    /*
        Save existing names before rebuilding
        the setup table.
    */

    const previousInputs =
        document.querySelectorAll(
            ".player-name-input"
        );


    const previousNames =
        [...previousInputs].map(
            input => input.value
        );


    /*
        Remove only the player seats.

        The actual poker table remains.
    */

    document
        .querySelectorAll(
            ".setup-player-seat"
        )
        .forEach(
            seat => seat.remove()
        );


    /*
        Generate one name input for
        every selected player.
    */

    for (
        let i = 0;
        i < setupPlayerCount;
        i++
    ) {

        const seat =
            document.createElement("div");


        seat.className =
            `setup-player-seat setup-seat-${i + 1}`;


        const input =
            document.createElement("input");


        input.type = "text";

        input.className =
            "player-name-input";


        input.maxLength = 20;


        /*
            Keep previous name if available.
        */

        if (
            previousNames[i] !== undefined
        ) {

            input.value =
                previousNames[i];

        } else {

            input.value =
                `Player ${i + 1}`;

        }


        input.placeholder =
            `Player ${i + 1}`;


        seat.appendChild(input);

        setupPokerTable.appendChild(seat);

    }


    playerCountDisplay.textContent =
        setupPlayerCount;


    updatePlayerCountButtons();

}


// =========================================================
// PLAYER COUNT BUTTONS
// =========================================================

function updatePlayerCountButtons() {

    removePlayerButton.disabled =
        setupPlayerCount <= MIN_PLAYERS;


    addPlayerButton.disabled =
        setupPlayerCount >= MAX_PLAYERS;

}


// =========================================================
// ADD PLAYER
// =========================================================

function addPlayer() {

    if (
        setupPlayerCount >= MAX_PLAYERS
    ) {

        return;

    }


    setupPlayerCount++;


    createSetupPlayerSeats();

}


// =========================================================
// REMOVE PLAYER
// =========================================================

function removePlayer() {

    if (
        setupPlayerCount <= MIN_PLAYERS
    ) {

        return;

    }


    setupPlayerCount--;


    createSetupPlayerSeats();

}


// =========================================================
// RESET SETUP
// =========================================================

function resetSetup() {

    anteAmount.value = 1;

    setupPlayerCount = 4;


    document
        .querySelectorAll(
            ".setup-player-seat"
        )
        .forEach(
            seat => seat.remove()
        );


    createSetupPlayerSeats();

}


// =========================================================
// START GAME
// =========================================================

function startGame() {

    const ante =
        Number(anteAmount.value);


    // Validate ante.

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


    /*
        Safety check.

        There must always be between
        2 and 8 players.
    */

    if (
        nameInputs.length < MIN_PLAYERS ||
        nameInputs.length > MAX_PLAYERS
    ) {

        alert(
            "Poker requires between 2 and 8 players."
        );

        return;

    }


    game = {

        players: [],

        pot: 0,

        currentBet: 0,

        ante: ante,

        handNumber: 1,

        stageIndex: 0,

        roundComplete: false,

        potAwarded: false,

        currentPlayerId: null,

        log: []

    };


    nameInputs.forEach(
        (input, index) => {

            let name =
                input.value.trim();


            /*
                Blank names automatically
                become Player 1, Player 2, etc.
            */

            if (name === "") {

                name =
                    `Player ${index + 1}`;

            }


            game.players.push({

                id: index,

                name: name,

                /*
                    Total amount this player
                    has contributed throughout
                    the entire game.
                */

                totalContributed: 0,

                /*
                    Total amount this player
                    has won throughout the game.
                */

                totalWon: 0,

                /*
                    Amount contributed during
                    the current betting round.
                */

                roundBet: 0,

                /*
                    Folded for current hand.
                */

                folded: false,

                /*
                    Whether the player has
                    responded since the latest
                    bet or raise.
                */

                acted: false

            });

        }
    );


    addLog(
        `Game started with ${game.players.length} players.`
    );


    addLog(
        `Ante set to ₱${game.ante}.`
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


    /*
        Reset player hand information.

        Total contributed and total won
        are NOT reset because those are
        tracked for the entire game.
    */

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


    /*
        Start action with the first player.
    */

    const firstPlayer =
        game.players.find(
            player =>
                !player.folded
        );


    if (firstPlayer) {

        game.currentPlayerId =
            firstPlayer.id;

    }

}


// =========================================================
// COLLECT ANTE
// =========================================================

function collectAnte() {

    if (game.ante <= 0) {

        addLog(
            "No ante was collected."
        );

        return;

    }


    let totalAnte = 0;


    game.players.forEach(
        player => {

            player.totalContributed +=
                game.ante;


            game.pot +=
                game.ante;


            totalAnte +=
                game.ante;

        }
    );


    addLog(
        `₱${game.ante} ante collected from each player. ` +
        `₱${totalAnte} added to the pot.`
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

    setupScreen.classList.add(
        "hidden"
    );


    gameScreen.classList.add(
        "hidden"
    );


    resultsScreen.classList.remove(
        "hidden"
    );

}


// =========================================================
// UPDATE ENTIRE GAME UI
// =========================================================

function updateGame() {

    updateActivePlayerSelect();

    renderPlayers();

    updateGameInfo();

    updateWinnerSelect();

    updateActionMessage();

    updateActionButtons();

    renderLog();

}


// =========================================================
// UPDATE GAME INFORMATION
// =========================================================

function updateGameInfo() {

    potDisplay.textContent =
        `₱${game.pot}`;


    currentBetDisplay.textContent =
        `₱${game.currentBet}`;


    handDisplay.textContent =
        `Hand #${game.handNumber}`;


    const stage =
        STAGES[game.stageIndex] ||
        "Showdown";


    stageDisplay.textContent =
        stage;


    tablePotDisplay.textContent =
        `₱${game.pot}`;


    tableStageDisplay.textContent =
        stage;


    const remainingPlayers =
        getRemainingPlayers();


    playersRemainingDisplay.textContent =
        remainingPlayers.length;


    const currentPlayer =
        getCurrentPlayer();


    if (currentPlayer) {

        currentTurnDisplay.textContent =
            currentPlayer.name;

    } else {

        currentTurnDisplay.textContent =
            "—";

    }

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
// GET CURRENT PLAYER
// =========================================================

function getCurrentPlayer() {

    return game.players.find(
        player =>
            player.id ===
            game.currentPlayerId
    );

}


// =========================================================
// UPDATE HIDDEN ACTIVE PLAYER SELECT
// =========================================================

function updateActivePlayerSelect() {

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


    if (
        game.currentPlayerId !== null
    ) {

        activePlayer.value =
            game.currentPlayerId;

    }

}


// =========================================================
// RENDER GAME TABLE PLAYERS
// =========================================================

function renderPlayers() {

    /*
        Remove old player seats.

        The table itself remains.
    */

    document
        .querySelectorAll(
            ".game-player-seat"
        )
        .forEach(
            seat => seat.remove()
        );


    game.players.forEach(
        (player, index) => {

            const seat =
                document.createElement("div");


            seat.className =
                `game-player-seat game-seat-${index + 1}`;


            /*
                Highlight ONLY the player
                whose turn it currently is.
            */

            if (
                player.id ===
                    game.currentPlayerId &&
                !player.folded &&
                !game.roundComplete &&
                game.stageIndex <
                    STAGES.length
            ) {

                seat.classList.add(
                    "active"
                );

            }


            /*
                Folded appearance.
            */

            if (player.folded) {

                seat.classList.add(
                    "folded"
                );

            }


            /*
                Player has already responded.
            */

            if (
                player.acted &&
                !player.folded
            ) {

                seat.classList.add(
                    "acted"
                );

            }


            let status =
                "Waiting";


            if (player.folded) {

                status =
                    "Folded";

            } else if (
                player.id ===
                    game.currentPlayerId &&
                !game.roundComplete
            ) {

                status =
                    "Your Turn";

            } else if (
                player.acted
            ) {

                status =
                    "Acted";

            }


            seat.innerHTML = `

                <h3>
                    ${escapeHTML(player.name)}
                </h3>


                <div class="seat-bet">

                    Round Bet:

                    <strong>
                        ₱${player.roundBet}
                    </strong>

                </div>


                <div class="seat-total">

                    Total Put In:
                    ₱${player.totalContributed}

                </div>


                <span class="player-seat-status">

                    ${status}

                </span>

            `;


            playersContainer.appendChild(
                seat
            );

        }
    );

}


// =========================================================
// UPDATE WINNER SELECT
// =========================================================

function updateWinnerSelect() {

    const previousValue =
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


    const stillExists =
        [...winnerSelect.options]
            .some(
                option =>
                    option.value ===
                    previousValue
            );


    if (stillExists) {

        winnerSelect.value =
            previousValue;

    }

}


// =========================================================
// CHECK ACTION
// =========================================================

function check() {

    const player =
        getCurrentPlayer();


    if (!player) {

        return;

    }


    /*
        You may only check if you have
        matched the current bet.
    */

    if (
        player.roundBet !==
        game.currentBet
    ) {

        const needed =
            game.currentBet -
            player.roundBet;


        alert(
            `${player.name} cannot check. ` +
            `₱${needed} is needed to call.`
        );


        return;

    }


    player.acted = true;


    addLog(
        `${player.name} checked.`
    );


    afterAction(
        player.id
    );

}


// =========================================================
// BET ACTION
// =========================================================

function bet() {

    const player =
        getCurrentPlayer();


    const amount =
        Number(
            betAmount.value
        );


    if (!player) {

        return;

    }


    /*
        Bet is only available when
        no bet currently exists.
    */

    if (
        game.currentBet !== 0
    ) {

        alert(
            "A bet already exists. Use Call or Raise."
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
        Everyone else must now respond
        to this bet.
    */

    resetActedAfterAggression(
        player.id
    );


    player.acted = true;


    addLog(
        `${player.name} bet ₱${amount}.`
    );


    betAmount.value = "";


    afterAction(
        player.id
    );

}


// =========================================================
// CALL ACTION
// =========================================================

function call() {

    const player =
        getCurrentPlayer();


    if (!player) {

        return;

    }


    const amountNeeded =
        game.currentBet -
        player.roundBet;


    if (
        amountNeeded <= 0
    ) {

        alert(
            `${player.name} does not need to call.`
        );


        return;

    }


    player.roundBet +=
        amountNeeded;


    player.totalContributed +=
        amountNeeded;


    game.pot +=
        amountNeeded;


    player.acted = true;


    addLog(
        `${player.name} called ₱${amountNeeded}.`
    );


    afterAction(
        player.id
    );

}


// =========================================================
// RAISE ACTION
// =========================================================

function raiseBet() {

    const player =
        getCurrentPlayer();


    const raiseAmount =
        Number(
            betAmount.value
        );


    if (!player) {

        return;

    }


    if (
        game.currentBet === 0
    ) {

        alert(
            "There is no existing bet. Use Bet instead."
        );


        return;

    }


    if (!validAmount(raiseAmount)) {

        return;

    }


    /*
        First determine how much this
        player still needs to call.
    */

    const callAmount =
        game.currentBet -
        player.roundBet;


    /*
        Example:

        Current bet = 10
        Player currently has = 0
        Raise amount = 5

        Player contributes:
        10 call + 5 raise = 15

        New current bet = 15
    */

    const totalContribution =
        callAmount +
        raiseAmount;


    player.roundBet +=
        totalContribution;


    player.totalContributed +=
        totalContribution;


    game.pot +=
        totalContribution;


    game.currentBet =
        player.roundBet;


    /*
        A raise means everybody else
        must respond again.
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


    afterAction(
        player.id
    );

}


// =========================================================
// RESET ACTED AFTER BET / RAISE
// =========================================================

function resetActedAfterAggression(
    aggressorId
) {

    game.players.forEach(
        player => {

            if (
                !player.folded &&
                player.id !==
                    aggressorId
            ) {

                player.acted = false;

            }

        }
    );

}


// =========================================================
// FOLD ACTION
// =========================================================

function fold() {

    const player =
        getCurrentPlayer();


    if (!player) {

        return;

    }


    player.folded = true;

    player.acted = true;


    addLog(
        `${player.name} folded.`
    );


    const remainingPlayers =
        getRemainingPlayers();


    /*
        If only one player remains,
        that player automatically wins.
    */

    if (
        remainingPlayers.length === 1
    ) {

        finishByFold(
            remainingPlayers[0]
        );


        return;

    }


    afterAction(
        player.id
    );

}


// =========================================================
// AFTER PLAYER ACTION
// =========================================================

function afterAction(
    lastPlayerId
) {

    /*
        Check whether everyone has now
        completed the betting round.
    */

    if (
        isBettingRoundComplete()
    ) {

        completeBettingRound();

        return;

    }


    /*
        Otherwise automatically find
        the next player who must act.
    */

    selectNextPlayer(
        lastPlayerId
    );


    updateGame();

}


// =========================================================
// IS BETTING ROUND COMPLETE?
// =========================================================

function isBettingRoundComplete() {

    const remainingPlayers =
        getRemainingPlayers();


    if (
        remainingPlayers.length <= 1
    ) {

        return true;

    }


    /*
        Everyone still in the hand
        must have acted.
    */

    const everyoneActed =
        remainingPlayers.every(
            player =>
                player.acted
        );


    /*
        Everyone still in the hand
        must have matched the current bet.
    */

    const everyoneMatched =
        remainingPlayers.every(
            player =>
                player.roundBet ===
                game.currentBet
        );


    return (
        everyoneActed &&
        everyoneMatched
    );

}


// =========================================================
// SELECT NEXT PLAYER
// =========================================================

function selectNextPlayer(
    currentPlayerId
) {

    const playerCount =
        game.players.length;


    /*
        Find the array index of the
        current player.

        This is safer than assuming
        player ID always equals array index.
    */

    const currentIndex =
        game.players.findIndex(
            player =>
                player.id ===
                currentPlayerId
        );


    /*
        Move clockwise through players.
    */

    for (
        let offset = 1;
        offset <= playerCount;
        offset++
    ) {

        const index =
            (
                currentIndex +
                offset
            ) %
            playerCount;


        const player =
            game.players[index];


        /*
            Skip folded players.

            A player needs action if:
            - they have not acted yet
            OR
            - they haven't matched
              the latest bet/raise.
        */

        if (
            !player.folded &&
            (
                !player.acted ||
                player.roundBet <
                    game.currentBet
            )
        ) {

            game.currentPlayerId =
                player.id;


            return;

        }

    }


    game.currentPlayerId =
        null;

}


// =========================================================
// COMPLETE BETTING ROUND
// =========================================================

function completeBettingRound() {

    game.roundComplete = true;

    game.currentPlayerId = null;


    const currentStage =
        STAGES[
            game.stageIndex
        ];


    addLog(
        `${currentStage} betting round completed.`
    );


    actionPanel.classList.add(
        "hidden"
    );


    roundMessage.classList.remove(
        "hidden"
    );


    /*
        River completed.
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


    /*
        New betting round:
        reset only round-specific information.
    */

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
// SELECT FIRST AVAILABLE PLAYER
// =========================================================

function selectFirstAvailablePlayer() {

    const firstPlayer =
        game.players.find(
            player =>
                !player.folded
        );


    if (firstPlayer) {

        game.currentPlayerId =
            firstPlayer.id;

    } else {

        game.currentPlayerId =
            null;

    }

}


// =========================================================
// SHOWDOWN
// =========================================================

function showShowdown() {

    game.stageIndex =
        STAGES.length;


    game.roundComplete = true;

    game.currentPlayerId = null;


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

function finishByFold(
    winner
) {

    const winnings =
        game.pot;


    winner.totalWon +=
        winnings;


    game.pot = 0;

    game.potAwarded = true;

    game.currentPlayerId = null;


    addLog(
        `${winner.name} won Hand #${game.handNumber} ` +
        `because all other players folded. ` +
        `Pot awarded: ₱${winnings}.`
    );


    updateGame();


    setTimeout(
        function () {

            alert(
                `${winner.name} wins ₱${winnings}!\n\n` +
                `Everyone else folded.`
            );


            startNextHand();

        },
        100
    );

}


// =========================================================
// AWARD POT AT SHOWDOWN
// =========================================================

function awardPot() {

    if (
        game.pot <= 0
    ) {

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


    updateGame();


    setTimeout(
        function () {

            alert(
                `${winner.name} wins ₱${winnings}!`
            );


            startNextHand();

        },
        100
    );

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


    betAmount.value = "";


    startNewHand();


    updateGame();

}


// =========================================================
// ACTION MESSAGE
// =========================================================

function updateActionMessage() {

    if (
        game.roundComplete
    ) {

        return;

    }


    const player =
        getCurrentPlayer();


    if (!player) {

        actionMessage.textContent =
            "Waiting for the next round.";

        return;

    }


    const amountNeeded =
        game.currentBet -
        player.roundBet;


    /*
        Player needs to respond
        to a bet or raise.
    */

    if (
        amountNeeded > 0
    ) {

        actionMessage.textContent =
            `${player.name}'s turn — ` +
            `Call ₱${amountNeeded}, Raise, or Fold.`;


        return;

    }


    /*
        Nobody has bet yet.
    */

    if (
        game.currentBet === 0
    ) {

        actionMessage.textContent =
            `${player.name}'s turn — Check or Bet.`;


        return;

    }


    /*
        Player has already matched
        current bet.
    */

    actionMessage.textContent =
        `${player.name}'s turn — ` +
        `current bet is ₱${game.currentBet}. ` +
        `Check or Raise.`;

}


// =========================================================
// UPDATE ACTION BUTTONS
// =========================================================

function updateActionButtons() {

    const buttons = [
        checkButton,
        callButton,
        betButton,
        raiseButton,
        foldButton
    ];


    /*
        Disable all buttons first.
    */

    buttons.forEach(
        button => {

            button.disabled = true;

            button.classList.remove(
                "available"
            );

        }
    );


    if (
        game.roundComplete
    ) {

        return;

    }


    const player =
        getCurrentPlayer();


    if (
        !player ||
        player.folded
    ) {

        return;

    }


    const amountNeeded =
        game.currentBet -
        player.roundBet;


    /*
        No bet currently exists.

        CHECK
        BET
        FOLD
    */

    if (
        game.currentBet === 0
    ) {

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
        Player must respond to
        an existing bet.

        CALL
        RAISE
        FOLD
    */

    if (
        amountNeeded > 0
    ) {

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
        Player already matched
        the current bet.

        CHECK
        RAISE
        FOLD
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
// ENABLE ACTION BUTTON
// =========================================================

function enableAction(
    button
) {

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
        If there is still an active pot,
        the accounting won't balance because
        those chips have been contributed
        but not awarded.
    */

    if (
        game.pot > 0
    ) {

        const continueEnding =
            confirm(
                `There is still ₱${game.pot} in the pot.\n\n` +
                `For accurate results, finish the current hand ` +
                `and award the pot first.\n\n` +
                `Show results anyway?`
            );


        if (!continueEnding) {

            return;

        }

    }


    renderResults();


    showResults();

}


// =========================================================
// RENDER RESULTS
// =========================================================

function renderResults() {

    resultsList.innerHTML = "";


    let totalNet = 0;


    game.players.forEach(
        player => {

            /*
                NET RESULT

                Total received
                -
                Total contributed
            */

            const net =
                player.totalWon -
                player.totalContributed;


            totalNet +=
                net;


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


            if (
                net > 0
            ) {

                resultClass =
                    "win";


                resultText =
                    `+₱${net}`;

            } else if (
                net < 0
            ) {

                resultClass =
                    "loss";


                resultText =
                    `-₱${Math.abs(net)}`;

            }


            card.innerHTML = `

                <div>

                    <h3>
                        ${escapeHTML(player.name)}
                    </h3>


                    <div class="result-details">

                        Total Put In:
                        ₱${player.totalContributed}

                        <br>

                        Total Won:
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


    /*
        If every pot has been awarded,
        everybody's net results should
        add up to exactly zero.
    */

    if (
        totalNet === 0
    ) {

        resultsBalance.className =
            "results-balance balanced";


        resultsBalance.textContent =
            "✓ Results balanced — total wins and losses equal ₱0.";

    } else {

        resultsBalance.className =
            "results-balance unbalanced";


        resultsBalance.textContent =
            `Unawarded balance: ₱${Math.abs(totalNet)}. ` +
            `A pot may not have been awarded before ending the game.`;

    }

}


// =========================================================
// VALIDATE AMOUNT
// =========================================================

function validAmount(
    amount
) {

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount greater than 0."
        );


        return false;

    }


    return true;

}


// =========================================================
// ADD GAME LOG ENTRY
// =========================================================

function addLog(
    message
) {

    game.log.unshift(
        message
    );


    /*
        Prevent unlimited log growth.
    */

    if (
        game.log.length > 200
    ) {

        game.log.pop();

    }

}


// =========================================================
// RENDER GAME LOG
// =========================================================

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
// CLEAR GAME LOG
// =========================================================

function clearGameLog() {

    const confirmed =
        confirm(
            "Clear the game log?"
        );


    if (!confirmed) {

        return;

    }


    game.log = [];


    renderLog();

}


// =========================================================
// ESCAPE PLAYER NAMES
// =========================================================

function escapeHTML(
    text
) {

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
    clearGameLog
);


// =========================================================
// INITIALIZE
// =========================================================

createSetupPlayerSeats();
