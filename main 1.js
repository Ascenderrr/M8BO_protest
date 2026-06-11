const perfText = document.getElementById("Preformace");
const hitZone = document.getElementById("time");
const scoreText = document.getElementById("scoreText");
const comboText = document.getElementById("comboText");
const healthContainer = document.getElementById("healthContainer");
const startScreen = document.getElementById("startScreen"); // New start screen
const startScoreText = document.getElementById("startScoreText");
const startComboText = document.getElementById("startComboText");

// Track image reset timeout so we can clear it before setting a new one
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

    // Clear any pending revert so fast inputs don't cut the animation short
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
    
    // Cancel pending spawn
    if (spawnTimeoutId) clearTimeout(spawnTimeoutId);
    
    // Reset difficulty for next game
    currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
    currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
    blockSpeed = INITIAL_BLOCK_SPEED;
    
    // Save final scores
    const finalScore = score;
    const finalCombo = highestCombo;
    
    perfText.innerText = "GAME OVER!";
    perfText.style.color = "red";
    perfText.style.fontSize = "4rem";
    
    // Show restart screen immediately
    perfText.innerText = `Score: ${finalScore} | Highest Combo: x${finalCombo}\nRestarting in 5...`;
    perfText.style.fontSize = "2rem";
    
    // Update start screen stats
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
    
    // Wait 5 seconds before allowing restart with countdown
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
let gameStarted = false; // New state definition
let health = 5;
let maxHealth = 5;
let gameOver = false;

// --- GAME SETTINGS ---
const MIN_BLOCKS_PER_WAVE = 1; // Minimum blocks that fall at once
const MAX_BLOCKS_PER_WAVE = 3; // Maximum blocks that fall at once

// Difficulty modifiers (start values)
const INITIAL_BASE_SPAWN_TIME = 1000;
const INITIAL_RANDOM_SPAWN_TIME = 1500;
let currentBaseSpawnTime = INITIAL_BASE_SPAWN_TIME;
let currentRandomSpawnTime = INITIAL_RANDOM_SPAWN_TIME;
const MIN_BASE_SPAWN_TIME = 350; // Fastest they will ever spawn

const INITIAL_BLOCK_SPEED = 8;
let blockSpeed = INITIAL_BLOCK_SPEED; // Starting move speed
const MAX_BLOCK_SPEED = 18; // Maximum move speed

let spawnTimeoutId = null;

// Initialize health blocks on page load
initHealthBlocks();

// Initialize start screen stats
startScoreText.innerText = `Score: 0`;
startComboText.innerText = `Highest Combo: x0`;

// --- CONTROLS ---
document.addEventListener('keydown', e => {
    // Start game logic
    if (!gameStarted && !gameOver) {
        gameStarted = true;
        gameOver = false;
        startScreen.classList.add("hidden"); // Hide the start screen
        perfText.style.fontSize = "3rem";

        // 3... 2... 1... countdown
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

        return; // Prevent triggering an immediate hit when starting
    }

    if (e.key.toLowerCase() === 'f' && blocks.length > 0 && !gameOver) {
        const b = blocks.shift(); // Get and remove the lowest block
        const bRect = b.element.getBoundingClientRect();
        const zRect = hitZone.getBoundingClientRect();
        
        // Check if touching
        const isHit = bRect.left < zRect.right && bRect.right > zRect.left;
        
        perfText.innerText = isHit ? "Hit!" : "Miss!";
        perfText.style.color = isHit ? "green" : "red";

        if (isHit) {
            combo++;
            if (combo > highestCombo) highestCombo = combo;
            
            // Regen 1 HP for every 10 hits in a row
            if (combo % 10 === 0) {
                heal(1);
                perfText.innerText = "Hit! +HP";
                perfText.style.color = "gold";
            }
            
            score += 100 * combo; // Combo multiplier
            scoreText.innerText = `Score: ${score}`;
            comboText.innerText = `Combo: x${combo}`;

            hitZone.classList.add("hit-anim");
            setTimeout(() => hitZone.classList.remove("hit-anim"), 150);

            setCharacterImage("./img/angrymferop.png", 200);
        } else {
            combo = 0; // Reset combo on miss
            comboText.innerText = `Combo: 0`;
            takeDamage(1); // Lose 1 health on miss

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);
        }

        b.element.remove();
    }
});

document.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'f') {
        // Clear any pending perf text reset and set a fresh one
        if (perfResetTimeout) clearTimeout(perfResetTimeout);
        perfResetTimeout = setTimeout(() => perfText.innerText = "", 500);
    }
});

// --- GAME LOOP & SPAWNER ---
function gameLoop() {
    if (gameOver) return; // Stop loop if game is over
    
    // Move blocks & remove missed ones using .filter()
    blocks = blocks.filter(b => {
        b.x -= blockSpeed; // Move left speed
        b.element.style.left = b.x + "px";
        
        if (b.x < -200) {
            b.element.remove();
            perfText.innerText = "Miss!";
            perfText.style.color = "red";
            
            // Reset combo on passed block
            combo = 0;
            comboText.innerText = `Combo: 0`;
            
            // Take damage when block passes
            takeDamage(1);
            
            // Flash red on miss
            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            setCharacterImage("./img/missed.png", 200);

            return false; // Deletes from list
        }
        return true; // Keeps in list
    });
    
    requestAnimationFrame(gameLoop);
}

function spawnBlock() {
    if (gameOver) return; // Don't spawn if game is over
    
    // Determine how many blocks to spawn at once based on settings
    let blocksToSpawn = Math.floor(Math.random() * (MAX_BLOCKS_PER_WAVE - MIN_BLOCKS_PER_WAVE + 1)) + MIN_BLOCKS_PER_WAVE;
    
    for (let i = 0; i < blocksToSpawn; i++) {
        // Stagger their X position slightly if spawning multiple 
        // to avoid them completely overlapping
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
            
            // Random spin direction and speed
            const direction = Math.random() > 0.5 ? "spinClockwise" : "spinCounterClockwise";
            const spinSpeed = (Math.random() * 2) + 1; // Between 1s and 3s
            el.style.animation = `${direction} ${spinSpeed}s linear infinite`;
            
            document.body.appendChild(el);
            blocks.push({ element: el, x: window.innerWidth + 100 });
        }, i * (100 + currentBaseSpawnTime * 0.1));
    }
    
    // Spawn the next block based on current difficulty timers
    spawnTimeoutId = setTimeout(spawnBlock, Math.random() * currentRandomSpawnTime + currentBaseSpawnTime); 

    // Step up the difficulty slightly each wave!
    if (currentBaseSpawnTime > MIN_BASE_SPAWN_TIME) {
        currentBaseSpawnTime *= 0.98; // Spawn gap gets shorter by 2%
        currentRandomSpawnTime *= 0.98; 
    }
    
    if (blockSpeed < MAX_BLOCK_SPEED) {
        blockSpeed += 0.05; // Travel speed gets slightly faster 
    }
}

// Ensure the game doesn't auto-start immediately
// spawnBlock() and gameLoop() are now called after the countdown.