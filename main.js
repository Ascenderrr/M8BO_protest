<<<<<<< HEAD
const perfText = document.getElementById("Preformace");
const hitZone = document.getElementById("time");
const scoreText = document.getElementById("scoreText");
const comboText = document.getElementById("comboText");
const bgVideo = document.getElementById("bg-video");
const healthContainer = document.getElementById("healthContainer");
const startScreen = document.getElementById("startScreen");
const startScoreText = document.getElementById("startScoreText");
const startComboText = document.getElementById("startComboText");
=======
const perfText = document.getElementById("Preformace"), hitZone = document.getElementById("time"), scoreText = document.getElementById("scoreText"), comboText = document.getElementById("comboText"), healthContainer = document.getElementById("healthContainer"), startScreen = document.getElementById("startScreen"), startScoreText = document.getElementById("startScoreText"), startComboText = document.getElementById("startComboText"), charImg = document.getElementById("Richepicdudebro99");
let imgResetTimeout, perfResetTimeout, healthBlocks = [], blocks = [], score = 0, combo = 0, highestCombo = 0, gameStarted = false, health = 5, maxHealth = 5, gameOver = false, rAFId, spawnTimeoutId;
let hitZoneLeft, hitZoneRight, blockWidth = 150;
const IMAGES = { idle: "./img/richmfer.webp", hit: "./img/angrymferop.webp", miss: "./img/missed.webp", tomato: "./img/Tomaatje.webp" };
Object.values(IMAGES).forEach(src => { const i = new Image(); i.src = src; });
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e

const updateCachedRects = () => {
    const zr = hitZone.getBoundingClientRect();
    hitZoneLeft = zr.left; hitZoneRight = zr.right;
    blockWidth = window.innerWidth <= 600 ? 100 : 150;
};
updateCachedRects();
window.onresize = updateCachedRects;

<<<<<<< HEAD
function updateBackgroundVideo() {
    const targetSrc = combo > 5 ? "Screenidlecombo.mp4" : "Screenidle.mp4";
    if (!bgVideo.src.endsWith(targetSrc)) {
        bgVideo.src = targetSrc;
        bgVideo.load();
    }
}

function initHealthBlocks() {
    healthContainer.innerHTML = "";
=======
const updateHealth = () => healthBlocks.forEach((b, i) => b.classList.toggle("empty", i >= health));
const initHealth = () => {
    healthContainer.innerHTML = ""; healthBlocks = [];
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
    for (let i = 0; i < maxHealth; i++) {
        const b = document.createElement("div"); b.className = "healthBlock";
        healthBlocks.push(b); healthContainer.appendChild(b);
    }
    updateHealth();
};
const setCharImg = (src, ms) => {
    charImg.src = src;
    if (imgResetTimeout) clearTimeout(imgResetTimeout);
    if (ms) imgResetTimeout = setTimeout(() => charImg.src = IMAGES.idle, ms);
};

const endGame = () => {
    gameOver = true; gameStarted = false;
    if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
<<<<<<< HEAD
    if (rAFId) { cancelAnimationFrame(rAFId); rAFId = null; }
    
    currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
    currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
    blockSpeed = INITIAL_BLOCK_SPEED;
    
    document.getElementById("Richepicdudebro99").src = "./img/richmfer.png";

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
=======
    if (rAFId) cancelAnimationFrame(rAFId);
    rAFId = null;
    currentBaseSpawnTime = 1000; currentRandomSpawnTime = 1500; blockSpeed = 8;
    perfText.innerText = `Score: ${score} | Highest Combo: x${highestCombo}\nRestarting in 5...`;
    perfText.style.cssText = "font-size: 2rem; color: red;";
    startScoreText.innerText = `Score: ${score}`;
    startComboText.innerText = `Highest Combo: x${highestCombo}`;
    startScreen.classList.remove("hidden");
    blocks.forEach(b => b.element.remove());
    blocks = []; score = 0; combo = 0; health = maxHealth;
    initHealth();
    scoreText.innerText = "Score: 0"; comboText.innerText = "Combo: 0";
    let count = 5;
    const disp = document.querySelector("#startScreen > p");
    const interval = setInterval(() => {
        if (--count > 0) disp.innerText = count;
        else { clearInterval(interval); gameOver = false; disp.innerText = "Press any button to continue"; }
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
    }, 1000);
};

let currentBaseSpawnTime = 1000, currentRandomSpawnTime = 1500, blockSpeed = 8;
initHealth();
startScoreText.innerText = "Score: 0"; startComboText.innerText = "Highest Combo: x0";

document.onvisibilitychange = () => {
    if (document.hidden) { if (spawnTimeoutId) clearTimeout(spawnTimeoutId); }
    else if (gameStarted && !gameOver) { blocks.forEach(b => b.element.remove()); blocks = []; spawnBlock(); }
};

<<<<<<< HEAD
const MIN_BLOCKS_PER_WAVE = 1;
const MAX_BLOCKS_PER_WAVE = 3;

const INITIAL_BASE_SPAWN_TIME = 1500;
const INITIAL_RANDOM_SPAWN_TIME = 1500;
let currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
let currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
const MIN_BASE_SPAWN_TIME = 500;

const INITIAL_BLOCK_SPEED = 8;
let blockSpeed = INITIAL_BLOCK_SPEED;
const MAX_BLOCK_SPEED = 16;

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
=======
document.onkeydown = e => {
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
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
<<<<<<< HEAD

    if (e.repeat) return;
    if (e.key.toLowerCase() === 'f' && blocks.length > 0 && !gameOver) {
        if (perfResetTimeout) { clearTimeout(perfResetTimeout); perfResetTimeout = null; }
=======
    if (e.repeat) return;
    if (e.key.toLowerCase() === "f" && blocks.length > 0 && !gameOver) {
        if (perfResetTimeout) clearTimeout(perfResetTimeout);
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
        const b = blocks.shift();
        const isHit = (b.x + blockWidth) > hitZoneLeft && b.x < hitZoneRight;
        perfText.innerText = isHit ? "Hit!" : "Miss!";
        perfText.style.color = isHit ? "green" : "red";
        if (isHit) {
<<<<<<< HEAD
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

            setCharacterImage("./img/angrymferop.png", 200);
        } else {
            combo = 0;
            updateBackgroundVideo();
            comboText.innerText = `Combo: 0`;
            takeDamage(1);

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);
=======
            combo++; if (combo > highestCombo) highestCombo = combo;
            if (combo % 10 === 0) { health = Math.min(maxHealth, health + 1); updateHealth(); perfText.innerText = "Hit! +HP"; perfText.style.color = "gold"; }
            score += 100 * combo;
            scoreText.innerText = `Score: ${score}`; comboText.innerText = `Combo: x${combo}`;
            hitZone.classList.add("hit-anim"); setTimeout(() => hitZone.classList.remove("hit-anim"), 150);
            setCharImg(IMAGES.hit, 200);
        } else {
            combo = 0; comboText.innerText = "Combo: 0";
            health--; updateHealth(); if (health <= 0) endGame();
            hitZone.classList.add("miss-anim"); setTimeout(() => hitZone.classList.remove("miss-anim"), 150);
            setCharImg(IMAGES.miss, 200);
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
        }
        b.element.remove();
    }
};

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
<<<<<<< HEAD
            perfText.innerText = "Miss!";
            perfText.style.color = "red";
            
            combo = 0;
            updateBackgroundVideo();
            comboText.innerText = `Combo: 0`;
            
            takeDamage(1);
            
            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);

=======
            perfText.innerText = "Miss!"; perfText.style.color = "red";
            combo = 0; comboText.innerText = "Combo: 0";
            health--; updateHealth(); if (health <= 0) endGame();
            hitZone.classList.add("miss-anim"); setTimeout(() => hitZone.classList.remove("miss-anim"), 150);
            setCharImg(IMAGES.miss, 200);
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
            return false;
        }
        return true;
    });
<<<<<<< HEAD
    
    if (!gameOver) {
        rAFId = requestAnimationFrame(gameLoop);
    }
=======
    rAFId = requestAnimationFrame(gameLoop);
>>>>>>> 71935c02d6d073e6b15bda22d06172eea330a52e
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
