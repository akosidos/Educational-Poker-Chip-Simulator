// =========================================================
// POKER CHIP CALCULATOR
// script.js
// =========================================================


// =========================================================
// ELEMENTS
// =========================================================

const setupScreen =
    document.getElementById("setupScreen");

const gameScreen =
    document.getElementById("gameScreen");


const startingChips =
    document.getElementById("startingChips");

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

const continueGameButton =
    document.getElementById("continueGameButton");

const newGameButton =
    document.getElementById("newGameButton");


const potDisplay =
    document.getElementById("potDisplay");

const currentBetDisplay =
    document.getElementById("currentBetDisplay");

const playersRemainingDisplay =
    document.getElementById("playersRemainingDisplay");

const handDisplay =
    document.getElementById("handDisplay");


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

const allInButton =
    document.getElementById("allInButton");

const foldButton =
    document.getElementById("foldButton");


const actionMessage =
    document.getElementById("actionMessage");

const winnerSelect =
    document.getElementById("winnerSelect");

const awardPotButton =
    document.getElementById("awardPotButton");

const gameLog =
    document.getElementById("gameLog");

const clearLogButton =
    document.getElementById("clearLogButton");


// =========================================================
// SETUP STATE
// =========================================================

let setupPlayerCount = 4;

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;


// =========================================================
// GAME STATE
// =========================================================

let game = {

    players: [],

    pot: 0,

    currentBet: 0,

    ante: 1,

    handNumber: 1,

    potAwarded: false,

    log: []

};


// =========================================================
// CREATE PLAYER SEATS
// =========================================================

function createPlayerSeats() {

    /*
        Save names before rebuilding the seats so increasing
        or decreasing the player count doesn't erase them.
    */

    const oldInputs =
        document.querySelectorAll(
            ".player-name-input"
        );

    const oldNames =
        [...oldInputs].map(
            input => input.value
        );


    /*
        Remove only old player seats.

        The poker table background stays inside playerSeats.
    */

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


        input.placeholder =
            `Player ${i + 1}`;


        input.maxLength = 20;


        if (oldNames[i]) {

            input.value =
                oldNames[i];

        } else {

            input.value =
                `Player ${i + 1}`;

        }


        seat.appendChild(input);

        playerSeats.appendChild(seat);

    }


    playerCountDisplay.textContent =
        setupPlayerCount;


    updatePlayerControlButtons();

}


// =========================================================
// UPDATE PLAYER +/- BUTTONS
// =========================================================

function updatePlayerControlButtons() {

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

    createPlayerSeats();

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

    createPlayerSeats();

}


// =========================================================
// RESET SETUP
// =========================================================

function resetSetup() {

    const confirmed =
        confirm(
            "Reset the game setup?"
        );


    if (!confirmed) {

        return;

    }


    startingChips.value = 50;

    anteAmount.value = 1;

    setupPlayerCount = 4;

    createPlayerSeats();

}


// =========================================================
// START GAME
// =========================================================

function startGame() {

    const chips =
        Number(startingChips.value);


    const ante =
        Number(anteAmount.value);


    // Validate starting chips

    if (
        !Number.isInteger(chips) ||
        chips <= 0
    ) {

        alert(
            "Please enter a valid starting chip amount."
        );

        return;

    }


    // Validate ante

    if (
        !Number.isInteger(ante) ||
        ante < 0
    ) {

        alert(
            "Please enter a valid ante amount."
        );

        return;

    }


    if (ante > chips) {

        alert(
            "The ante cannot be greater than the starting chips."
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

                chips: chips,

                roundBet: 0,

                folded: false,

                allIn: false

            });

        }
    );


    addLog(
        `Game started with ${game.players.length} players.`
    );


    addLog(
        `Starting chips: ₱${chips} per player.`
    );


    addLog(
        `Ante: ₱${game.ante} per hand.`
    );


    addLog(
        `Hand #${game.handNumber} started.`
    );


    collectAnte();


    saveGame();

    showGame();

    updateGame();

}


// =========================================================
// COLLECT ANTE
// =========================================================

function collectAnte() {

    /*
        Ante of 0 means nothing needs to be collected.
    */

    if (game.ante <= 0) {

        addLog(
            "No ante collected for this hand."
        );

        return;

    }


    let totalAnte = 0;

    let playersWhoPaid = 0;


    game.players.forEach(
        player => {

            /*
                Players with no chips cannot pay an ante.
            */

            if (player.chips <= 0) {

                return;

            }


            /*
                Normally the player pays the full ante.

                If they have fewer chips than the ante,
                all remaining chips are contributed instead.
            */

            const payment =
                Math.min(
                    game.ante,
                    player.chips
                );


            player.chips -= payment;

            game.pot += payment;

            totalAnte += payment;

            playersWhoPaid++;


            /*
                Ante does NOT count toward roundBet.

                This is important because an ante is part
                of the pot but is not a normal bet that
                other players must match.
            */


            if (player.chips === 0) {

                player.allIn = true;

            }

        }
    );


    addLog(
        `₱${game.ante} ante collected from ` +
        `${playersWhoPaid} player(s). ` +
        `₱${totalAnte} added to the pot.`
    );

}


// =========================================================
// DISPLAY SCREENS
// =========================================================

function showGame() {

    setupScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

}


function showSetup() {

    gameScreen.classList.add(
        "hidden"
    );

    setupScreen.classList.remove(
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

    saveGame();

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


            let status = "Playing";


            if (player.folded) {

                status = "Folded";

            } else if (player.allIn) {

                status = "All-In";

            } else if (player.chips === 0) {

                status = "Out";

            }


            card.innerHTML = `

                <h3>
                    ${escapeHTML(player.name)}
                </h3>

                <p>
                    Chips:
                    <strong>
                        ₱${player.chips}
                    </strong>
                </p>

                <p>
                    Current Bet:
                    <strong>
                        ₱${player.roundBet}
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
                        !player.allIn &&
                        player.chips > 0
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
// UPDATE GAME INFORMATION
// =========================================================

function updateGameInfo() {

    potDisplay.textContent =
        `₱${game.pot}`;


    currentBetDisplay.textContent =
        `₱${game.currentBet}`;


    handDisplay.textContent =
        `Hand #${game.handNumber} • Ante ₱${game.ante}`;


    const remainingPlayers =
        game.players.filter(
            player =>
                !player.folded &&
                (
                    player.chips > 0 ||
                    player.allIn
                )
        );


    playersRemainingDisplay.textContent =
        remainingPlayers.length;

}


// =========================================================
// UPDATE ACTIVE PLAYER SELECT
// =========================================================

function updatePlayerSelect() {

    const previousValue =
        activePlayer.value;


    activePlayer.innerHTML = "";


    game.players.forEach(
        player => {

            if (
                !player.folded &&
                !player.allIn &&
                player.chips > 0
            ) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    player.id;


                option.textContent =
                    `${player.name} - ₱${player.chips}`;


                activePlayer.appendChild(
                    option
                );

            }

        }
    );


    const stillExists =
        [...activePlayer.options]
            .some(
                option =>
                    option.value ===
                    previousValue
            );


    if (stillExists) {

        activePlayer.value =
            previousValue;

    }

}


// =========================================================
// UPDATE WINNER SELECT
// =========================================================

function updateWinnerSelect() {

    const previousValue =
        winnerSelect.value;


    winnerSelect.innerHTML = "";


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


                winnerSelect.appendChild(
                    option
                );

            }

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
// GET ACTIVE PLAYER
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
            `You cannot check. ` +
            `${player.name} needs ₱${
                game.currentBet -
                player.roundBet
            } to call.`
        );

        return;

    }


    addLog(
        `${player.name} checked.`
    );


    updateGame();

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


    if (game.currentBet > 0) {

        alert(
            "There is already a bet. Use Raise or Call."
        );

        return;

    }


    if (!validAmount(amount)) {

        return;

    }


    if (amount > player.chips) {

        alert(
            `${player.name} does not have enough chips.`
        );

        return;

    }


    player.chips -= amount;

    player.roundBet += amount;

    game.pot += amount;

    game.currentBet =
        player.roundBet;


    if (player.chips === 0) {

        player.allIn = true;

    }


    addLog(
        `${player.name} bet ₱${amount}.`
    );


    betAmount.value = "";

    updateGame();

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


    const amountNeeded =
        game.currentBet -
        player.roundBet;


    if (amountNeeded <= 0) {

        alert(
            `${player.name} has already matched the current bet.`
        );

        return;

    }


    const actualCall =
        Math.min(
            amountNeeded,
            player.chips
        );


    player.chips -= actualCall;

    player.roundBet += actualCall;

    game.pot += actualCall;


    if (player.chips === 0) {

        player.allIn = true;


        addLog(
            `${player.name} called ALL-IN for ₱${actualCall}.`
        );

    } else {

        addLog(
            `${player.name} called ₱${actualCall}.`
        );

    }


    updateGame();

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
            "There is no existing bet. Use Bet instead."
        );

        return;

    }


    if (!validAmount(raiseAmount)) {

        return;

    }


    const callAmount =
        Math.max(
            0,
            game.currentBet -
            player.roundBet
        );


    const totalRequired =
        callAmount +
        raiseAmount;


    if (totalRequired > player.chips) {

        alert(
            `${player.name} does not have enough chips to make this raise.`
        );

        return;

    }


    player.chips -= totalRequired;

    player.roundBet += totalRequired;

    game.pot += totalRequired;

    game.currentBet =
        player.roundBet;


    if (player.chips === 0) {

        player.allIn = true;

    }


    addLog(
        `${player.name} raised by ₱${raiseAmount}. ` +
        `Current bet is now ₱${game.currentBet}.`
    );


    betAmount.value = "";

    updateGame();

}


// =========================================================
// ALL-IN
// =========================================================

function allIn() {

    const player =
        getActivePlayer();


    if (!player) {

        return;

    }


    if (player.chips <= 0) {

        return;

    }


    const amount =
        player.chips;


    player.chips = 0;

    player.roundBet += amount;

    game.pot += amount;

    player.allIn = true;


    if (
        player.roundBet >
        game.currentBet
    ) {

        game.currentBet =
            player.roundBet;


        addLog(
            `${player.name} went ALL-IN for ₱${amount} ` +
            `and raised the current bet to ₱${game.currentBet}.`
        );

    } else {

        addLog(
            `${player.name} went ALL-IN for ₱${amount}.`
        );

    }


    updateGame();

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


    addLog(
        `${player.name} folded.`
    );


    updateGame();


    const remaining =
        game.players.filter(
            player =>
                !player.folded &&
                (
                    player.chips > 0 ||
                    player.allIn
                )
        );


    if (remaining.length === 1) {

        actionMessage.textContent =
            `${remaining[0].name} is the only remaining player. ` +
            `Award them the pot.`;

    }

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


    if (game.potAwarded) {

        alert(
            "The pot has already been awarded."
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


    winner.chips += winnings;

    game.pot = 0;

    game.potAwarded = true;


    addLog(
        `${winner.name} won Hand #${game.handNumber} ` +
        `and received ₱${winnings}!`
    );


    updateGame();


    setTimeout(
        function () {

            const next =
                confirm(
                    `${winner.name} won ₱${winnings}!\n\n` +
                    `Start the next hand?`
                );


            if (next) {

                nextHand();

            }

        },
        100
    );

}


// =========================================================
// NEXT HAND
// =========================================================

function nextHand() {

    game.handNumber++;

    game.pot = 0;

    game.currentBet = 0;

    game.potAwarded = false;


    game.players.forEach(
        player => {

            player.roundBet = 0;

            player.folded = false;

            player.allIn = false;

        }
    );


    addLog(
        `Hand #${game.handNumber} started.`
    );


    /*
        Automatically collect the configured ante
        at the beginning of the new hand.
    */

    collectAnte();


    updateGame();

}


// =========================================================
// UPDATE ACTION MESSAGE
// =========================================================

function updateActionMessage() {

    const player =
        getActivePlayer();


    if (!player) {

        actionMessage.textContent =
            "No player available.";

        return;

    }


    const amountNeeded =
        game.currentBet -
        player.roundBet;


    if (amountNeeded > 0) {

        actionMessage.textContent =
            `${player.name} needs ₱${amountNeeded} to call.`;

    } else if (
        game.currentBet === 0
    ) {

        actionMessage.textContent =
            `${player.name} may check or place the first bet.`;

    } else {

        actionMessage.textContent =
            `${player.name} has matched the current bet ` +
            `and may check or raise.`;

    }

}


// =========================================================
// UPDATE ACTION BUTTONS
// =========================================================

function updateActionButtons() {

    const player =
        getActivePlayer();


    const buttons = [

        checkButton,
        callButton,
        betButton,
        raiseButton,
        allInButton,
        foldButton

    ];


    /*
        Disable everything first.
    */

    buttons.forEach(
        button => {

            button.disabled = true;

            button.classList.remove(
                "available"
            );

        }
    );


    if (!player) {

        return;

    }


    if (
        player.folded ||
        player.allIn ||
        player.chips <= 0
    ) {

        return;

    }


    const amountToCall =
        game.currentBet -
        player.roundBet;


    // =====================================
    // NO CURRENT BET
    // =====================================

    if (game.currentBet === 0) {

        enableAction(checkButton);

        enableAction(betButton);

        enableAction(allInButton);

        enableAction(foldButton);

        return;

    }


    // =====================================
    // PLAYER MUST CALL
    // =====================================

    if (amountToCall > 0) {

        enableAction(callButton);

        enableAction(raiseButton);

        enableAction(allInButton);

        enableAction(foldButton);

        return;

    }


    // =====================================
    // PLAYER MATCHED BET
    // =====================================

    if (amountToCall === 0) {

        enableAction(checkButton);

        enableAction(raiseButton);

        enableAction(allInButton);

        enableAction(foldButton);

    }

}


// =========================================================
// ENABLE ACTION
// =========================================================

function enableAction(button) {

    button.disabled = false;

    button.classList.add(
        "available"
    );

}


// =========================================================
// GAME LOG
// =========================================================

function addLog(message) {

    game.log.unshift(
        message
    );


    if (game.log.length > 100) {

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
// SAVE GAME
// =========================================================

function saveGame() {

    localStorage.setItem(
        "pokerChipSimulator",
        JSON.stringify(game)
    );

}


// =========================================================
// LOAD GAME
// =========================================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "pokerChipSimulator"
        );


    if (!saved) {

        return;

    }


    try {

        game =
            JSON.parse(saved);


        /*
            Compatibility with an older saved game
            that did not have an ante property.
        */

        if (
            !Number.isInteger(game.ante) ||
            game.ante < 0
        ) {

            game.ante = 1;

        }


        showGame();

        updateGame();

    } catch (error) {

        console.error(
            "Could not load saved game.",
            error
        );

    }

}


// =========================================================
// NEW GAME
// =========================================================

function newGame() {

    const confirmed =
        confirm(
            "Start a new game? The current game will be deleted."
        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        "pokerChipSimulator"
    );


    location.reload();

}


// =========================================================
// VALIDATE CHIP AMOUNT
// =========================================================

function validAmount(amount) {

    if (
        !Number.isInteger(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid chip amount."
        );


        return false;

    }


    return true;

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


continueGameButton.addEventListener(
    "click",
    loadGame
);


newGameButton.addEventListener(
    "click",
    newGame
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


allInButton.addEventListener(
    "click",
    allIn
);


foldButton.addEventListener(
    "click",
    fold
);


awardPotButton.addEventListener(
    "click",
    awardPot
);


clearLogButton.addEventListener(
    "click",
    function () {

        game.log = [];

        updateGame();

    }
);


// =========================================================
// INITIALIZE
// =========================================================

createPlayerSeats();


const savedGame =
    localStorage.getItem(
        "pokerChipSimulator"
    );


if (savedGame) {

    continueGameButton.classList.remove(
        "hidden"
    );

}
