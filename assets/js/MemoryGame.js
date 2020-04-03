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

var memory_game = function (id, feedbackid, secret, imagePaths) {
    var match = function (id1, id2) { return (id1 !== id2) && (id1.split("-")[1] === id2.split("-")[1]); };
    var board = document.getElementById(id);
    var timeoutMs = 2000;
    var left = imagePaths.length;
    var open = [];
    var t1 = null;
    var clickcallback = function (event) {
        event.preventDefault();
        var t = event.target;
        if (open.length >= 2) {
            return;
        }
        if (open.includes(t.dataset.index)) {
            return;
        }
        if (open.length === 0) {
            t.classList.remove("notyet");
            open.push(t.dataset.index);
            t1 = setTimeout(function () {
                t.classList.add("notyet");
                open = open.filter(function (i) { return i !== t.dataset.index; });
            }, timeoutMs);
        }
        else {
            t.classList.remove("notyet");
            if (match(open[0], t.dataset.index)) {
                t.classList.add("done");
                var a = board.querySelector("div[data-index=\"" + open[0] + "\"]");
                a.classList.add("done");
                a.onclick = null;
                var b = board.querySelector("div[data-index=\"" + t.dataset.index + "\"]");
                b.classList.add("done");
                b.onclick = null;
                clearTimeout(t1);
                open = [];
                left--;
                if (left === 0) {
                    var feedback = document.getElementById(feedbackid);
                    feedback.innerText = "You won! The secret phrase is \"" + atob(secret) + "\"";
                    feedback.classList.add("correct");
                }
            }
            else {
                open.push(t.dataset.index);
                t1 = setTimeout(function () {
                    t.classList.add("notyet");
                    open = open.filter(function (i) { return i !== t.dataset.index; });
                }, timeoutMs);
            }
        }
    };
    var blocks = [];
    imagePaths.forEach(function (path, index) {
        var word = path.split("/").slice(-1)[0].split(".")[0];
        var imgdiv = document.createElement("div");
        imgdiv.className = "mg-tile notyet";
        imgdiv.style.backgroundImage = "url(" + path + ")";
        imgdiv.dataset.index = "a-" + index;
        imgdiv.onclick = clickcallback;
        blocks.push(imgdiv);
        var textdiv = document.createElement("div");
        textdiv.className = "mg-tile notyet";
        textdiv.innerText = word.split("_").join(" ");
        textdiv.dataset.index = "b-" + index;
        textdiv.onclick = clickcallback;
        blocks.push(textdiv);
    });
    shuffle(blocks);
    blocks.forEach(function (b) { return board.appendChild(b); });
};