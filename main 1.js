const perfText = document.getElementById("Preformace");
const hitZone = document.getElementById("time");
const scoreText = document.getElementById("scoreText");
const comboText = document.getElementById("comboText");
const startScreen = document.getElementById("startScreen"); // New start screen
let blocks = [];

let score = 0;
let combo = 0;
let gameStarted = false; // New state definition

// --- GAME SETTINGS ---
const MIN_BLOCKS_PER_WAVE = 1; // Minimum blocks that fall at once
const MAX_BLOCKS_PER_WAVE = 3; // Maximum blocks that fall at once

// Difficulty modifiers (start values)
let currentBaseSpawnTime = 1000;
let currentRandomSpawnTime = 1500;
const MIN_BASE_SPAWN_TIME = 350; // Fastest they will ever spawn

let blockSpeed = 8; // Starting move speed
const MAX_BLOCK_SPEED = 18; // Maximum move speed

// --- CONTROLS ---
document.addEventListener('keydown', e => {
    // Start game logic
    if (!gameStarted) {
        gameStarted = true;
        startScreen.classList.add("hidden"); // Hide the start screen

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

    if (e.key.toLowerCase() === 'f' && blocks.length > 0) {
        const b = blocks.shift(); // Get and remove the lowest block
        const bRect = b.element.getBoundingClientRect();
        const zRect = hitZone.getBoundingClientRect();
        
        // Ckeck if touching
        const isHit = bRect.left < zRect.right && bRect.right > zRect.left;
        
        perfText.innerText = isHit ? "Hit!" : "Miss!";
        perfText.style.color = isHit ? "green" : "red";

        if (isHit) {
            combo++;
            score += 100 * combo; // Combo multiplier
            scoreText.innerText = `Score: ${score}`;
            comboText.innerText = `Combo: x${combo}`;

            hitZone.classList.add("hit-anim");
            setTimeout(() => hitZone.classList.remove("hit-anim"), 150);
        } else {
            combo = 0; // Reset combo on miss
            comboText.innerText = `Combo: 0`;

            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);
        }

        b.element.remove();
    }
});

document.addEventListener('keyup', e => {
    if (e.key.toLowerCase() === 'f') setTimeout(() => perfText.innerText = "", 500);
});

// --- GAME LOOP & SPAWNER ---
function gameLoop() {
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
            
            // Flash red on miss
            hitZone.classList.add("miss-anim");
            setTimeout(() => hitZone.classList.remove("miss-anim"), 150);

            return false; // Deletes from list
        }
        return true; // Keeps in list
    });
    
    requestAnimationFrame(gameLoop);
}

function spawnBlock() {
    // Determine how many blocks to spawn at once based on settings
    let blocksToSpawn = Math.floor(Math.random() * (MAX_BLOCKS_PER_WAVE - MIN_BLOCKS_PER_WAVE + 1)) + MIN_BLOCKS_PER_WAVE;
    
    for (let i = 0; i < blocksToSpawn; i++) {
        // Stagger their X position slightly if spawning multiple 
        // to avoid them completely overlapping
        setTimeout(() => {
            const el = document.createElement("div");
            el.className = "block";
            document.body.appendChild(el);
            blocks.push({ element: el, x: window.innerWidth + 100 });
        }, i * (100 + currentBaseSpawnTime * 0.1));
    }
    
    // Spawn the next block based on current difficulty timers
    setTimeout(spawnBlock, Math.random() * currentRandomSpawnTime + currentBaseSpawnTime); 

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


