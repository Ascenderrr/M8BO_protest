const perfText = document.getElementById("Preformace");
const hitZone = document.getElementById("time");
const scoreText = document.getElementById("scoreText");
const comboText = document.getElementById("comboText");
const bgVideo = document.getElementById("bg-video");
const healthContainer = document.getElementById("healthContainer");
const startScreen = document.getElementById("startScreen");
const startScoreText = document.getElementById("startScoreText");
const startComboText = document.getElementById("startComboText");
const charImg = document.getElementById("Richepicdudebro99");

let imgResetTimeout, perfResetTimeout, healthBlocks = [], blocks = [], score = 0, combo = 0, highestCombo = 0, gameStarted = false, health = 5, maxHealth = 5, gameOver = false, rAFId;
let hitZoneLeft, hitZoneRight, blockWidth = 150;
const IMAGES = { idle: "./img/richmfer.webp", hit: "./img/angrymferop.webp", miss: "./img/missed.webp", tomato: "./img/Tomaatje.webp" };
Object.values(IMAGES).forEach(src => { const i = new Image(); i.src = src; });

const updateCachedRects = () => {
    const zr = hitZone.getBoundingClientRect();
    hitZoneLeft = zr.left; hitZoneRight = zr.right;
    blockWidth = window.innerWidth <= 600 ? 100 : 150;
};
updateCachedRects();
window.onresize = updateCachedRects;

function updateBackgroundVideo() {
    if (!bgVideo) return;
    const targetSrc = combo > 5 ? "Screenidlecombo.mp4" : "Screenidle.mp4";
    const source = bgVideo.querySelector("source");
    if (!source) return;
    if (!source.src.endsWith(targetSrc)) {
        source.src = targetSrc;
        bgVideo.load();
        bgVideo.play().catch(() => {});
    }
}

const updateHealth = () => healthBlocks.forEach((b, i) => b.classList.toggle("empty", i >= health));

function initHealthBlocks() {
    healthContainer.innerHTML = "";
    healthBlocks = [];
    for (let i = 0; i < maxHealth; i++) {
        const b = document.createElement("div"); b.className = "healthBlock";
        healthBlocks.push(b); healthContainer.appendChild(b);
    }
    updateHealth();
}

function heal(amount) {
    health = Math.min(maxHealth, health + amount);
    updateHealth();
}

function takeDamage(amount) {
    health -= amount;
    updateHealth();
    if (health <= 0) endGame();
}

function setCharacterImage(src, ms) {
    charImg.src = src;
    if (imgResetTimeout) clearTimeout(imgResetTimeout);
    if (ms) imgResetTimeout = setTimeout(() => charImg.src = IMAGES.idle, ms);
}

const endGame = () => {
    gameOver = true; gameStarted = false;
    if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
    if (rAFId) { cancelAnimationFrame(rAFId); rAFId = null; }

    currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
    currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
    blockSpeed = INITIAL_BLOCK_SPEED;

    charImg.src = IMAGES.idle;

    const finalScore = score;
    const finalCombo = highestCombo;

    perfText.innerText = `Score: ${finalScore} | Highest Combo: x${finalCombo}\nRestarting in 5...`;
    perfText.style.fontSize = "2rem";
    perfText.style.color = "red";

    startScoreText.innerText = `Score: ${finalScore}`;
    startComboText.innerText = `Highest Combo: x${finalCombo}`;

    startScreen.classList.remove("hidden");
    blocks.forEach(b => b.element.remove());
    blocks = [];
    score = 0;
    combo = 0;
    updateBackgroundVideo();
    health = maxHealth;
    initHealthBlocks();
    scoreText.innerText = `Score: 0`;
    comboText.innerText = `Combo: 0`;

    let countdown = 5;
    const countdownDisplay = document.querySelector("#startScreen > p");
    countdownDisplay.innerText = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.innerText = countdown;
        } else {
            clearInterval(countdownInterval);
            gameOver = false;
            countdownDisplay.innerText = "Press any button to continue";
        }
    }, 1000);
};

const INITIAL_BASE_SPAWN_TIME = 1500;
const INITIAL_RANDOM_SPAWN_TIME = 1500;
let currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
let currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;

const INITIAL_BLOCK_SPEED = 8;
let blockSpeed = INITIAL_BLOCK_SPEED;

let spawnTimeoutId = null;

initHealthBlocks();

startScoreText.innerText = `Score: 0`;
startComboText.innerText = `Highest Combo: x0`;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (spawnTimeoutId) {
            clearTimeout(spawnTimeoutId);
            spawnTimeoutId = null;
        }
    } else if (gameStarted && !gameOver) {
        blocks.forEach(b => b.element.remove());
        blocks = [];
        spawnBlock();
    }
});

document.addEventListener('keydown', e => {
    if (!gameStarted && !gameOver) {
        gameStarted = true; gameOver = false;
        startScreen.classList.add("hidden");
        const disp = document.querySelector("#startScreen > p");
        disp.innerText = "Press Any Key to Start";
        perfText.style.cssText = "font-size: 3rem; color: white;";
        perfText.innerText = "Starting in 3...";
        setTimeout(() => perfText.innerText = "Starting in 2...", 1000);
        setTimeout(() => perfText.innerText = "Starting in 1...", 2000);
        setTimeout(() => {
            perfText.innerText = "GO!";
            setTimeout(() => { if (perfText.innerText === "GO!") perfText.innerText = ""; }, 1000);
            spawnBlock(); gameLoop();
        }, 3000);
        return;
    }

    if (e.repeat) return;
    if (e.key.toLowerCase() === 'f' && blocks.length > 0 && !gameOver) {
        if (perfResetTimeout) { clearTimeout(perfResetTimeout); perfResetTimeout = null; }
        const b = blocks.shift();
        const isHit = (b.x + blockWidth) > hitZoneLeft && b.x < hitZoneRight;
        perfText.innerText = isHit ? "Hit!" : "Miss!";
        perfText.style.color = isHit ? "green" : "red";
        if (isHit) {
            combo++;
            updateBackgroundVideo();
            if (combo > highestCombo) highestCombo = combo;

            if (combo % 10 === 0) {
                heal(1);
                perfText.innerText = "Hit! +HP";
                perfText.style.color = "gold";
            }

            score += 100 * combo;
            scoreText.innerText = `Score: ${score}`;
            comboText.innerText = `Combo: x${combo}`;

            if (score > 100000) {
                window.location.href = 'win.html';
            }

            hitZone.classList.add("hit-anim");
            setTimeout(() => hitZone.classList.remove("hit-anim"), 150);

            setCharacterImage(IMAGES.hit, 200);
        } else {
            combo = 0;
            updateBackgroundVideo();
            comboText.innerText = `Combo: 0`;
            takeDamage(1);

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage(IMAGES.miss, 200);
        }
        b.element.remove();
    }
});

document.onkeyup = e => {
    if (e.key.toLowerCase() === "f") perfResetTimeout = setTimeout(() => perfText.innerText = "", 500);
};

function gameLoop() {
    if (gameOver) return;
    blocks = blocks.filter(b => {
        b.x -= blockSpeed;
        b.rotation += b.spinDir * b.spinSpeed;
        b.element.style.transform = `translateX(${b.x}px) translateY(-50%) rotate(${b.rotation}deg)`;
        if (b.x < -200) {
            b.element.remove();
            perfText.innerText = "Miss!";
            perfText.style.color = "red";

            combo = 0;
            updateBackgroundVideo();
            comboText.innerText = `Combo: 0`;

            takeDamage(1);

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage(IMAGES.miss, 200);
            return false;
        }
        return true;
    });

    if (!gameOver) {
        rAFId = requestAnimationFrame(gameLoop);
    }
}

function spawnBlock() {
    if (gameOver) return;
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement("img");
            el.className = "block";
            el.src = IMAGES.tomato;
            document.body.appendChild(el);
            blocks.push({ element: el, x: window.innerWidth + 100, rotation: Math.random() * 360, spinDir: Math.random() > 0.5 ? 1 : -1, spinSpeed: Math.random() * 2 + 1 });
        }, i * 150);
    }
    spawnTimeoutId = setTimeout(spawnBlock, Math.random() * currentRandomSpawnTime + currentBaseSpawnTime);
    currentBaseSpawnTime = Math.max(350, currentBaseSpawnTime * 0.98);
    currentRandomSpawnTime *= 0.98;
    blockSpeed = Math.min(18, blockSpeed + 0.05);
}
