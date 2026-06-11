const perfText = document.getElementById("Preformace");
const hitZone = document.getElementById("time");
const scoreText = document.getElementById("scoreText");
const comboText = document.getElementById("comboText");
const healthContainer = document.getElementById("healthContainer");
const startScreen = document.getElementById("startScreen");
const startScoreText = document.getElementById("startScoreText");
const startComboText = document.getElementById("startComboText");

let imgResetTimeout = null;
let perfResetTimeout = null;

function initHealthBlocks() {
    healthContainer.innerHTML = "";
    for (let i = 0; i < maxHealth; i++) {
        const block = document.createElement("div");
        block.className = "healthBlock";
        block.id = `health-${i}`;
        healthContainer.appendChild(block);
    }
    updateHealthBar();
}

function updateHealthBar() {
    for (let i = 0; i < maxHealth; i++) {
        const block = document.getElementById(`health-${i}`);
        if (i < health) {
            block.classList.remove("empty");
        } else {
            block.classList.add("empty");
        }
    }
}

function takeDamage(amount) {
    health -= amount;
    if (health < 0) health = 0;
    updateHealthBar();
    
    if (health <= 0) {
        endGame();
    }
}

function heal(amount) {
    health += amount;
    if (health > maxHealth) health = maxHealth;
    updateHealthBar();
}

function setCharacterImage(src, revertAfterMs) {
    const charImg = document.getElementById("Richepicdudebro99");
    charImg.src = src;

    if (imgResetTimeout) {
        clearTimeout(imgResetTimeout);
        imgResetTimeout = null;
    }

    if (revertAfterMs != null) {
        imgResetTimeout = setTimeout(() => {
            charImg.src = "./img/richmfer.png";
            imgResetTimeout = null;
        }, revertAfterMs);
    }
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    
    if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
    if (rAFId) { cancelAnimationFrame(rAFId); rAFId = null; }
    
    currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
    currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
    blockSpeed = INITIAL_BLOCK_SPEED;
    
    document.getElementById("Richepicdudebro99").src = "./img/richmfer.png";

    const finalScore = score;
    const finalCombo = highestCombo;
    
    perfText.innerText = "GAME OVER!";
    perfText.style.color = "red";
    perfText.style.fontSize = "4rem";
    
    perfText.innerText = `Score: ${finalScore} | Highest Combo: x${finalCombo}\nRestarting in 5...`;
    perfText.style.fontSize = "2rem";
    
    startScoreText.innerText = `Score: ${finalScore}`;
    startComboText.innerText = `Highest Combo: x${finalCombo}`;
    
    startScreen.classList.remove("hidden");
    blocks.forEach(b => b.element.remove());
    blocks = [];
    score = 0;
    combo = 0;
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
}
let blocks = [];

let score = 0;
let combo = 0;
let highestCombo = 0;
let gameStarted = false;
let health = 5;
let maxHealth = 5;
let gameOver = false;

let rAFId = null;

const MIN_BLOCKS_PER_WAVE = 1;
const MAX_BLOCKS_PER_WAVE = 3;

const INITIAL_BASE_SPAWN_TIME = 1000;
const INITIAL_RANDOM_SPAWN_TIME = 1500;
let currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
let currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
const MIN_BASE_SPAWN_TIME = 350;

const INITIAL_BLOCK_SPEED = 8;
let blockSpeed = INITIAL_BLOCK_SPEED;
const MAX_BLOCK_SPEED = 18;

let spawnTimeoutId = null;

initHealthBlocks();

startScoreText.innerText = `Score: 0`;
startComboText.innerText = `Highest Combo: x0`;

document.addEventListener('keydown', e => {
    if (!gameStarted && !gameOver) {
        gameStarted = true;
        gameOver = false;
        startScreen.classList.add("hidden");
        document.querySelector("#startScreen > p").innerText = "Press Any Key to Start";
        perfText.style.fontSize = "3rem";

        perfText.innerText = "Starting in 3...";
        perfText.style.color = "white";

        setTimeout(() => perfText.innerText = "Starting in 2...", 1000);
        setTimeout(() => perfText.innerText = "Starting in 1...", 2000);

        setTimeout(() => {
            perfText.innerText = "GO!";
            setTimeout(() => { if (perfText.innerText === "GO!") perfText.innerText = ""; }, 1000);
            
            spawnBlock();
            gameLoop();
        }, 3000);

        return;
    }

    if (e.key.toLowerCase() === 'f' && blocks.length > 0 && !gameOver) {
        if (perfResetTimeout) { clearTimeout(perfResetTimeout); perfResetTimeout = null; }
        const b = blocks.shift();
        const bRect = b.element.getBoundingClientRect();
        const zRect = hitZone.getBoundingClientRect();
        
        const isHit = bRect.left < zRect.right && bRect.right > zRect.left;
        
        perfText.innerText = isHit ? "Hit!" : "Miss!";
        perfText.style.color = isHit ? "green" : "red";

        if (isHit) {
            combo++;
            if (combo > highestCombo) highestCombo = combo;
            
            if (combo % 10 === 0) {
                heal(1);
                perfText.innerText = "Hit! +HP";
                perfText.style.color = "gold";
            }
            
            score += 100 * combo;
            scoreText.innerText = `Score: ${score}`;
            comboText.innerText = `Combo: x${combo}`;

            hitZone.classList.add("hit-anim");
            setTimeout(() => hitZone.classList.remove("hit-anim"), 150);

            setCharacterImage("./img/angrymferop.png", 200);
        } else {
            combo = 0;
            comboText.innerText = `Combo: 0`;
            takeDamage(1);

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);
        }

        b.element.remove();
    }
});

document.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'f') {
        if (perfResetTimeout) clearTimeout(perfResetTimeout);
        perfResetTimeout = setTimeout(() => perfText.innerText = "", 500);
    }
});

function gameLoop() {
    if (gameOver) return;
    
    blocks = blocks.filter(b => {
        b.x -= blockSpeed;
        b.element.style.left = b.x + "px";
        
        if (b.x < -200) {
            b.element.remove();
            perfText.innerText = "Miss!";
            perfText.style.color = "red";
            
            combo = 0;
            comboText.innerText = `Combo: 0`;
            
            takeDamage(1);
            
            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);

            return false;
        }
        return true;
    });
    
    rAFId = requestAnimationFrame(gameLoop);
}

function spawnBlock() {
    if (gameOver) return;
    
    let blocksToSpawn = Math.floor(Math.random() * (MAX_BLOCKS_PER_WAVE - MIN_BLOCKS_PER_WAVE + 1)) + MIN_BLOCKS_PER_WAVE;
    
    for (let i = 0; i < blocksToSpawn; i++) {
        setTimeout(() => {
            const el = document.createElement("div");
            el.className = "block";
            const img = document.createElement("img");
            img.src = "./img/Tomaatje.png";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.borderRadius = "100%";
            el.appendChild(img);
            
            const direction = Math.random() > 0.5 ? "spinClockwise" : "spinCounterClockwise";
            const spinSpeed = (Math.random() * 2) + 1;
            el.style.animation = `${direction} ${spinSpeed}s linear infinite`;
            
            document.body.appendChild(el);
            blocks.push({ element: el, x: window.innerWidth + 100 });
        }, i * (100 + currentBaseSpawnTime * 0.1));
    }
    
    spawnTimeoutId = setTimeout(spawnBlock, Math.random() * currentRandomSpawnTime + currentBaseSpawnTime); 

    if (currentBaseSpawnTime > MIN_BASE_SPAWN_TIME) {
        currentBaseSpawnTime *= 0.98;
        currentRandomSpawnTime *= 0.98; 
    }
    
    if (blockSpeed < MAX_BLOCK_SPEED) {
        blockSpeed += 0.05;
    }
}
