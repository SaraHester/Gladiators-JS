const $ = require('jquery');
const other = require('../../lib/other');
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function critical(GAME) {
    if (randomNumber(1, 100) < GAME.attacker.rage) {
        return true;
    } else {
        return false;
    }
}
function newGladiator(name) {
    return {
        name: name,
        health: 100,
        rage: 0,
        low: randomNumber(10, 15),
        high: randomNumber(15, 20)
    };
}
function showTurn(GAME) {
    $('#turn').html('<h1>' + GAME.attacker.name + "'s turn </h1>");
}

function attack(GAME) {
    damage = randomNumber(GAME.attacker.low, GAME.attacker.high);
    if (critical(GAME)) {
        damage *= 2;
        $('#crit').html(
            '<p><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Hit was Critical<i class="fa fa-exclamation-circle" aria-hidden="true"></i></p>'
        );
        GAME.attacker.rage = 0;
    } else {
        $('#crit').html('<br>');
        $('#damage').html(
            '<p>Damage: ' + damage + '</p>',
            (GAME.attacker.rage += 10)
        );
        $('health');
        GAME.defender.health -= damage;
    }
}
function heal(GAME) {
    GAME.attacker.health += 10;
    GAME.attacker.rage -= 5;
}
function changeTurn(GAME) {
    if (GAME.turn === 0) {
        (GAME.attacker = g2), (GAME.defender = g1), (GAME.turn = 1);
    } else if (GAME.turn === 1) {
        (GAME.attacker = g1), (GAME.defender = g2), (GAME.turn = 0);
    }
}

function attachHandlers(GAME) {
    $('#buttons').html(
        "<button id='attack'></button>&emsp;&emsp;&emsp;&emsp;<button id='heal'></button>"
    );
    $('#attack').on('click', function() {
        attack(GAME), draw(GAME);
    });

    $('#heal').on('click', function() {
        heal(GAME), draw(GAME);
    });
}

function showStatus(GAME) {
    $('#status').html(
        "Player 1<div id='health' class='progress'><div class='progress-bar progress-bar-success' aria-valuemax='100' style='width: " +
            GAME.g1.health +
            "%'>" +
            GAME.g1.health +
            '  Health</div></div>' +
            "<div id='rage' class='progress'><div class='progress-bar progress-bar-danger' aria-valuemax='100' style='width: " +
            GAME.g1.rage +
            "%'>" +
            GAME.g1.rage +
            '  Rage</div></div>' +
            "Player 2<br><div id='health' class='progress'><div class='progress-bar progress-bar-success' aria-valuemax='100' style='width: " +
            GAME.g2.health +
            "%'>" +
            GAME.g2.health +
            '  Health</div></div>' +
            "<div id='rage' class='progress'><div class='progress-bar progress-bar-danger' aria-valuemax='100' style='width: " +
            GAME.g2.rage +
            "%'>" +
            GAME.g2.rage +
            '  Rage</div></div>' +
            '<hr>'
    );
}
function draw(GAME) {
    if (GAME.g1.health <= 0) {
        $('body').html(
            "<center><h1>Gladiator 2 is the winner!!!!!!</h1><hr><button id='restart' onclick='document.location.reload()'><i class='fa fa-repeat' aria-hidden='true'></i>   Restart</button></center>"
        );
    } else if (GAME.g2.health <= 0) {
        $('body').html(
            "<center><h1>Gladiator 1 is the winner!!!!!!</h1><hr><button id='restart' onclick='document.location.reload()'><i class='fa fa-repeat' aria-hidden='true'></i>   Restart</button></center>"
        );
    }

    if (GAME.defender.rage < 5 || GAME.defender.health + 10 > 100) {
        $('#heal').attr('disabled', true);
    } else if (GAME.defender.rage >= 5) {
        $('#heal').removeAttr('disabled');
    }
    changeTurn(GAME);
    showTurn(GAME);
    showStatus(GAME);
}

function start() {
    $('#go').html('');
    showTurn(GAME);
    showStatus(GAME);
    attachHandlers(GAME);
    $('#heal').attr('disabled', true);
}
g1 = newGladiator('Player 1');
g2 = newGladiator('Player 2');
attacker = g1;
defender = g2;
GAME = { attacker: attacker, defender: defender, g1: g1, g2: g2, turn: 0 };
start(GAME);
