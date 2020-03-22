var showTime = 1000;

var id2html = {};
var translator = {};
var foundIds = [];
var showed = 0;
var remained = 0;
var attempts = 0;

function game(images, secret) {
    createGameBoard(images);
    console.log(atob(secret));
};


function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};


String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

function createGameBoard(images) {
    $('#attemptsCounter').html('Attempts counter: 0');
    processImages(images);
};

function updateRemained() {
    $('#gameTitle').text(remained + ' words remained.');
};

function processImages(images) {
    remained = images.length;
    updateRemained();
    var myIds = [];
    var words = [];
    for (var i = 0; i < images.length; i++) {
        var name = images[i].split('.')[0].split('/').last();
        words.push(name);

        myIds.push(name);
        myIds.push(name + '_image');
    };
    myIds = shuffle(myIds);
    for (var i = 1; i <= myIds.length; i++) {
        $('#gameBoard').append('<div class="cube" id="' + i + '" onclick="playCard($(this));">' + i + '<\/div>');
        if (myIds[i - 1].endsWith('_image')) {
            translator[i] = 1 + myIds.indexOf(myIds[i - 1].replace('_image', ''));
            id2html[i] = '<img src="' + images[words.indexOf(myIds[i - 1].replace('_image', ''))] + '"/>';
        } else {
            translator[i] = 1 + myIds.indexOf(myIds[i - 1] + '_image');
            id2html[i] = myIds[i - 1].capitalizeFirstLetter();
        }
    }
};


function playCard(card) {
    if (!card.hasClass('correct')) {
        $('#attemptsCounter').html('Attempts counter: ' + attempts);
        card.hide().html(id2html[card.prop('id')]).fadeIn(300);
        if (showed === 0) {
            attempts += 1;
            showed = card.prop('id');
        } else {
            if (translator[card.prop('id')] == showed) {
                card.addClass('correct');
                $('#' + showed).addClass('correct');
                remained -= 1;
                updateRemained();
                showed = 0;
                if (remained == 0) {
                    $('#gameTitle').html('You won!');
                }
            } else {
                setTimeout(function() {
                    card.html(card.prop('id'));
                    $('#' + showed).html(showed);
                    showed = 0;
                }, showTime);
            }
        }
    }
};