// Select the elements
const player = document.getElementById('player');
const healthBar = document.getElementById('health-bar');
const energyBar = document.getElementById('energy-bar');
const omnitrixSymbol = document.getElementById('omnitrix-symbol');
const villains = document.querySelectorAll('.villain'); // Get all villain elements
const scoreDisplay = document.getElementById('score-display'); // Score display element
const playButton = document.getElementById('play-button'); // Play button element

// Game variables
const maxHealth = 100;
const maxEnergy = 100;
let energy = 0; // Initial energy value
let score = 0; // Initial score
let playerSpeed = 5; // Speed of player movement
let gameStarted = false; // To track if the game has started
let villainFallingSpeed = 2; // Speed of villain fall
let omnitrixFallingSpeed = 1; // Speed of Omnitrix fall

// Game Over Message
const gameOverMessage = document.createElement('div');
gameOverMessage.id = 'game-over-message';
gameOverMessage.style.position = 'absolute';
gameOverMessage.style.top = '50%';
gameOverMessage.style.left = '50%';
gameOverMessage.style.transform = 'translate(-50%, -50%)';
gameOverMessage.style.fontSize = '30px';
gameOverMessage.style.color = 'white';
gameOverMessage.style.display = 'none'; // Initially hidden
gameOverMessage.innerHTML = 'Game Over! <br> <button id="restart-button">Restart</button>';
document.body.appendChild(gameOverMessage);

// Start the game when the Play button is clicked
playButton.addEventListener('click', () => {
    // Hide the play button
    playButton.style.display = 'none';

    // Start the game logic
    gameStarted = true;
    document.addEventListener('keydown', handleKeydown);
    spawnOmnitrix();
    villains.forEach(villain => spawnVillain(villain));
    startFalling();
});

// Health Bar: Decrease health when Ben collides with a villain
function reduceHealth() {
    const currentHealth = parseInt(healthBar.value);
    healthBar.value = Math.max(currentHealth - 10, 0); // Decrease health by 10, but not below 0

    if (healthBar.value === 0) {
        gameOver(); // Trigger game-over if health reaches 0
    }
}

// Energy Bar: Increase energy when Ben collects the Omnitrix
function increaseEnergy() {
    energy = Math.min(energy + 20, maxEnergy); // Increase by 20, but not above max
    energyBar.value = energy; // Update the energy bar

    // If the energy bar is full, trigger the ultimate move
    if (energyBar.value === maxEnergy) {
        enableUltimateMove();
    }
}

// Ultimate Move: Trigger when energy bar is full
function enableUltimateMove() {
    alert('Ultimate Move Ready! Press "U" to use it.');

    // Listen for key press to activate ultimate move
    document.addEventListener('keydown', function (event) {
        if (event.key === 'u' || event.key === 'U') {
            activateUltimateMove();
        }
    });
}

// Activate Ultimate Move: Remove all villains from the game
function activateUltimateMove() {
    alert('Ultimate Move Activated! All villains have been cleared.');

    // Remove each villain from the game area
    villains.forEach(villain => {
        villain.style.display = 'none'; // Hide the villains
    });

    // Optionally, reset energy bar after using the ultimate move
    energy = 0;
    energyBar.value = energy;

    // Disable further ultimate move activation by removing the event listener
    document.removeEventListener('keydown', activateUltimateMove);
}

// Omnitrix Collision: Detect when Ben collects the Omnitrix symbol
function checkOmnitrixCollision() {
    const playerRect = player.getBoundingClientRect();
    const omnitrixRect = omnitrixSymbol.getBoundingClientRect();

    if (
        playerRect.left < omnitrixRect.right &&
        playerRect.right > omnitrixRect.left &&
        playerRect.top < omnitrixRect.bottom &&
        playerRect.bottom > omnitrixRect.top
    ) {
        increaseEnergy(); // Collect Omnitrix and increase energy
        updateScore(); // Increase score

        omnitrixSymbol.style.display = 'none';
        setTimeout(() => {
            omnitrixSymbol.style.display = 'block';
            spawnOmnitrix();
        }, 500); // Short delay before respawning
    }
}

// Spawn the Omnitrix at a random position
function spawnOmnitrix() {
    const gameArea = document.querySelector('.game-area');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    const randomX = Math.floor(Math.random() * (gameAreaWidth - omnitrixSymbol.clientWidth));
    const randomY = -omnitrixSymbol.clientHeight; // Start from the top

    omnitrixSymbol.style.left = `${randomX}px`;
    omnitrixSymbol.style.top = `${randomY}px`;
}

// Update the score
function updateScore() {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Villain collision detection
function checkVillainCollision(villain) {
    const playerRect = player.getBoundingClientRect();
    const villainRect = villain.getBoundingClientRect();

    if (
        playerRect.left < villainRect.right &&
        playerRect.right > villainRect.left &&
        playerRect.top < villainRect.bottom &&
        playerRect.bottom > villainRect.top
    ) {
        reduceHealth();
        villain.style.display = 'none';
        setTimeout(() => {
            villain.style.display = 'block';
            spawnVillain(villain);
        }, 500); // Short delay before respawning villain
    }
}

// Spawn villains at random positions
function spawnVillain(villain) {
    const gameArea = document.querySelector('.game-area');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    const randomX = Math.floor(Math.random() * (gameAreaWidth - villain.clientWidth));
    const randomY = -villain.clientHeight; // Start from the top

    villain.style.left = `${randomX}px`;
    villain.style.top = `${randomY}px`;
}

// Start falling animation for Omnitrix and Villains
function startFalling() {
    // Update positions in a loop
    setInterval(() => {
        if (!gameStarted) return; // Stop if the game is not running

        // Move Omnitrix symbol down slowly
        let omnitrixTop = parseInt(omnitrixSymbol.style.top.replace('px', ''));
        omnitrixTop += omnitrixFallingSpeed;
        if (omnitrixTop > window.innerHeight) {
            omnitrixTop = -omnitrixSymbol.clientHeight; // Reset if it goes off-screen
            spawnOmnitrix();
        }
        omnitrixSymbol.style.top = `${omnitrixTop}px`;

        // Move villains down slowly
        villains.forEach(villain => {
            let villainTop = parseInt(villain.style.top.replace('px', ''));
            villainTop += villainFallingSpeed;
            if (villainTop > window.innerHeight) {
                villainTop = -villain.clientHeight; // Reset if it goes off-screen
                spawnVillain(villain);
            }
            villain.style.top = `${villainTop}px`;
        });

        // Check for collisions after updating positions
        checkOmnitrixCollision();
        villains.forEach(villain => checkVillainCollision(villain));
    }, 1000 / 60); // 60 FPS
}

// Handle player movement using the arrow keys
function handleKeydown(event) {
    if (!gameStarted) return; // Only proceed if the game is started

    const playerRect = player.getBoundingClientRect();
    const gameArea = document.querySelector('.game-area');
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;

    switch (event.key) {
        case 'ArrowUp':
            if (playerRect.top > 0) {
                player.style.top = `${player.offsetTop - playerSpeed}px`;
            }
            break;
        case 'ArrowDown':
            if (playerRect.bottom < gameAreaHeight) {
                player.style.top = `${player.offsetTop + playerSpeed}px`;
            }
            break;
        case 'ArrowLeft':
            if (playerRect.left > 0) {
                player.style.left = `${player.offsetLeft - playerSpeed}px`;
            }
            break;
        case 'ArrowRight':
            if (playerRect.right < gameAreaWidth) {
                player.style.left = `${player.offsetLeft + playerSpeed}px`;
            }
            break;
    }
}

// Handle game over scenario
function gameOver() {
    gameStarted = false;
    gameOverMessage.style.display = 'block'; // Show game over message
    document.removeEventListener('keydown', handleKeydown); // Stop the game logic
}

// Restart the game when the player clicks "Restart"
document.getElementById('restart-button').addEventListener('click', restartGame);

function restartGame() {
    // Reset game variables
    healthBar.value = maxHealth;
    energyBar.value = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverMessage.style.display = 'none';

    // Start the game again
    gameStarted = true;
    player.style.top = '50%'; // Reset player position
    player.style.left = '50%';

    spawnOmnitrix();
    villains.forEach(villain => spawnVillain(villain));
    startFalling();
    document.addEventListener('keydown', handleKeydown);
}
