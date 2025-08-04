const score = document.querySelector('.score');
const highScore = document.querySelector('.highscore');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const ClickToStart = document.querySelector('.ClickToStart');

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

let player = {
    speed: 5,
    score: 0,
    highscore: 0,
    isStart: false,
    x: 0,
    y: 0,
};

ClickToStart.addEventListener('click', Start);
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

function keydown(e) {
    if (e.key in keys) {
        keys[e.key] = true;
    }
}

function keyup(e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
}

function Start() {
    gameArea.innerHTML = '';
    startScreen.classList.add('hide');

    player.isStart = true;
    player.score = 0;
    player.speed = 5;

    // Create road lines
    for (let i = 0; i < 5; i++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'roadLines');
        roadLine.y = i * 140;
        roadLine.style.top = roadLine.y + 'px';
        gameArea.appendChild(roadLine);
    }

    // Create opponent cars
    for (let i = 0; i < 3; i++) {
        let opponent = document.createElement('div');
        opponent.setAttribute('class', 'Opponents');
        opponent.y = -300 * (i + 1);
        opponent.style.top = opponent.y + 'px';
        opponent.style.left = Math.floor(Math.random() * 350) + 'px';
        opponent.style.backgroundColor = randomColor();
        gameArea.appendChild(opponent);
    }

    // Create player car
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    updateScoresUI();

    window.requestAnimationFrame(Play);
}

function randomColor() {
    const c = () => {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + hex).slice(-2);
    };
    return "#" + c() + c() + c();
}

function Play() {
    let car = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.isStart) {
        moveLines();
        moveOpponents(car);

        if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
        if (keys.ArrowDown && player.y < (road.height - 75)) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (road.width - 50)) player.x += player.speed;

        car.style.top = player.y + 'px';
        car.style.left = player.x + 'px';

        player.score++;
        // Gradually increase speed for difficulty
        player.speed += 0.001;

        if (player.score > player.highscore) {
            player.highscore = player.score;
        }

        updateScoresUI();

        window.requestAnimationFrame(Play);
    }
}

function moveLines() {
    let roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach(line => {
        if (line.y >= 700) {
            line.y -= 700;
        }
        line.y += player.speed;
        line.style.top = line.y + 'px';
    });
}

function moveOpponents(car) {
    let opponents = document.querySelectorAll('.Opponents');
    opponents.forEach(opponent => {
        if (isCollide(car, opponent)) {
            endGame();
        }
        if (opponent.y >= 750) {
            opponent.y = -300;
            opponent.style.left = Math.floor(Math.random() * 350) + 'px';
            opponent.style.backgroundColor = randomColor();
        }
        opponent.y += player.speed;
        opponent.style.top = opponent.y + 'px';
    });
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.top > bRect.bottom) ||
        (aRect.bottom < bRect.top) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function endGame() {
    player.isStart = false;
    player.speed = 5;
    startScreen.classList.remove('hide');
}

function updateScoresUI() {
    score.innerHTML = 'Score: ' + player.score;
    highScore.innerHTML = 'HighScore: ' + player.highscore;
}
