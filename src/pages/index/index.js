const $ = require('jquery');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randChance(chance) {
    if (randomNumber(1, 100) < chance) {
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
        high: randomNumber(15, 20),
        chance: 5,
        armor: 20,
        dodgeChance: 5
    };
}
function showTurn(GAME) {
    $('#turn').html('<h1>' + GAME.attacker.name + "'s turn </h1>");
}

function attack(GAME) {
    hitdamage = randomNumber(GAME.attacker.low, GAME.attacker.high);
    damage = hitdamage - Math.round(hitdamage * (GAME.defender.armor / 100));

    if ($('#perks').val() === 'iattack') {
        damage += damage * 0.5;
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s attack increased by 5%"
        );
    }
    if ($('#perks').val() === 'iarmor') {
        GAME.attacker.armor += Math.round(GAME.attacker.armor * 0.5);
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s armor increased by 5%"
        );
    }
    if ($('#perks').val() === 'icritical') {
        GAME.attacker.chance += Math.round(GAME.attacker.chance * 0.5);
        $('#activeperk').html(
            GAME.attacker.name + "'s critical chance increased by 5%"
        );
    }
    if ($('#perks').val() === 'iswiftness') {
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s dodge chance increased by 5%"
        );
    }
    if (randChance(GAME.defender.dodgeChance)) {
        damage = 0;
        $('#crit').html('<br>');
        $('#damage').html(GAME.defender.name + ' succesfully dodged!');
    }

    if (randChance(GAME.attacker.chance)) {
        damage *= 2;
        $('#crit').html(
            '<p><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Hit was Critical<i class="fa fa-exclamation-circle" aria-hidden="true"></i></p>'
        );
        GAME.attacker.rage = 0;
        GAME.attacker.chance = 5;
    } else {
        GAME.attacker.rage += 10;
        GAME.attacker.chance += 10;
        $('#crit').html('<br>');
        $('#damage').html('<p>Damage: ' + damage + '</p>');

        GAME.defender.health -= damage;
    }
}
function heal(GAME) {
    if ($('#perks').val() === 'icritical') {
        GAME.defender.chance -= Math.round(GAME.defender.chance * 0.5);
        $('#activeperk').html(
            GAME.defender.name + "'s critical chance decreased by 5%"
        );
    }
    if ($('#perks').val() == 'iattack') {
        GAME.attacker.health += 5;
        $('#activeperk').html(
            GAME.attacker.name + "'s health was increased by 5 points"
        );
    }

    if ($('#perks').val() === 'iarmor') {
        GAME.attacker.armor += Math.round(GAME.attacker.armor * 0.5);
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s armor increased by 5%"
        );
    }

    if ($('#perks').val() === 'iswiftness') {
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s dodge chance increased by 5%"
        );
    }

    GAME.attacker.health += 10;
    GAME.attacker.rage -= 5;
    GAME.attacker.chance -= 5;
}
function superattack(GAME) {
    damage = randomNumber(GAME.attacker.low, GAME.attacker.high) * 2;
    if ($('#perks').val() === 'iattack') {
        damage += damage * 0.5;
        $('#activeperk').html(GAME.attacker.name + "'s attack increased by 5%");
    }
    if ($('#perks').val() === 'iarmor') {
        GAME.attacker.armor += Math.round(GAME.attacker.armor * 0.5);
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s armor increased by 5%"
        );
    }

    if ($('#perks').val() === 'iswiftness') {
        $('#activeperk').html(
            String(GAME.attacker.name) + "'s dodge chance increased by 5%"
        );
    }
    if ($('#perks').val() === 'icritical') {
        GAME.defender.chance -= Math.round(GAME.defender.chance * 0.5);
        $('#activeperk').html(
            GAME.defender.name + "'s critical chance decreased by 5%"
        );
    }
    $('#crit').html('<br>');
    $('#damage').html('<p>Damage: ' + damage + '</p>');
    GAME.attacker.rage -= 10;
    GAME.attacker.chance -= 10;
    GAME.defender.health -= damage;
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
    $('#superattack').on('click', function() {
        superattack(GAME), draw(GAME);
    });
}

function showStatus(GAME) {
    $('#status').html(
        '<table><tr><td>Player 1</td><td>Player 2</td></tr>' +
            "<tr><td><div id='health' class='progress'><div class='progress-bar progress-bar-success' aria-valuemax='100' style='width: " +
            GAME.g1.health +
            "%'>" +
            GAME.g1.health +
            '  Health</div></div></td>' +
            "<td><div id='health' class='progress'><div class='progress-bar progress-bar-success' aria-valuemax='100' style='width: " +
            GAME.g2.health +
            "%'>" +
            GAME.g2.health +
            '  Health</div></div></td></tr>' +
            "<tr><td><div id='rage' class='progress'><div class='progress-bar progress-bar-info' aria-valuemax='100' style='width: " +
            GAME.g1.rage +
            "%'>" +
            GAME.g1.rage +
            '  Rage</div></div></td>' +
            "<td><div id='rage' class='progress'><div class='progress-bar progress-bar-info' aria-valuemax='100' style='width: " +
            GAME.g2.rage +
            "%'>" +
            GAME.g2.rage +
            '  Rage</div></div></td>' +
            "<tr><td><div id='armor' class='progress'><div class='progress-bar progress-bar-warning' aria-valuemax='100' style='width: " +
            GAME.g1.armor +
            "%'>" +
            GAME.g1.armor +
            '  Armor</div></div></td>' +
            "<td><div id='armor' class='progress'><div class='progress-bar progress-bar-warning' aria-valuemax='100' style='width: " +
            GAME.g2.armor +
            "%'>" +
            GAME.g2.armor +
            '  Armor</div></div></td></tr>' +
            "<tr><td><div id='critical' class='progress'><div class='progress-bar progress-bar-danger' aria-valuemax='100' style='width: " +
            GAME.g1.chance +
            "%'>" +
            GAME.g1.chance +
            '  Critical Chance</div></div></div></td>' +
            "<td><div id='critical' class='progress'><div class='progress-bar progress-bar-danger' aria-valuemax='100' style='width: " +
            GAME.g2.chance +
            "%'>" +
            GAME.g2.chance +
            '  Critical chance</div></div></div></div><td></tr>'
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
    } else if (GAME.defender.rage >= 5 && GAME.defender.health + 10 < 100) {
        $('#heal').removeAttr('disabled');
    }
    if (GAME.defender.rage < 10 || GAME.defender.rage === 0) {
        $('#superattack').attr('disabled', true);
    } else if (GAME.defender.rage >= 10) {
        $('#superattack').removeAttr('disabled');
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
    $('#superattack').attr('disabled', true);
}
g1 = newGladiator('Player 1');
g2 = newGladiator('Player 2');
attacker = g1;
defender = g2;
GAME = { attacker: attacker, defender: defender, g1: g1, g2: g2, turn: 0 };
start(GAME);
