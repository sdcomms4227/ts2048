interface Tile {
    value: number;
    row: number;
    col: number;
}

class Game2048 {
    private grid: number[][];
    private score: number;
    private bestScore: number;
    private gridContainer: HTMLElement;
    private scoreElement: HTMLElement;
    private bestScoreElement: HTMLElement;
    private newGameButton: HTMLElement;
    private tryAgainButton: HTMLElement;
    private gameOverElement: HTMLElement;
    private isGameOver: boolean;

    constructor() {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore') || '0', 10);
        this.isGameOver = false;
        
        this.gridContainer = document.getElementById('grid-container')!;
        this.scoreElement = document.getElementById('score')!;
        this.bestScoreElement = document.getElementById('best-score')!;
        this.newGameButton = document.getElementById('new-game')!;
        this.tryAgainButton = document.getElementById('try-again')!;
        this.gameOverElement = document.getElementById('game-over')!;

        this.initializeGame();
        this.setupEventListeners();
        this.updateBestScore();
    }

    private initializeGame(): void {
        // Clear the grid container
        this.gridContainer.innerHTML = '';
        
        // Create grid cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                this.gridContainer.appendChild(cell);
            }
        }

        // Reset game state
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.isGameOver = false;

        // Add initial tiles
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    private setupEventListeners(): void {
        // Remove any existing listeners
        const newGameButton = document.getElementById('new-game');
        if (newGameButton) {
            const newGameClone = newGameButton.cloneNode(true);
            newGameButton.parentNode?.replaceChild(newGameClone, newGameButton);
            this.newGameButton = newGameClone as HTMLElement;
        }

        // Add keyboard event listener
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Add new game button listener
        this.newGameButton.addEventListener('click', () => {
            this.initializeGame();
        });

        // Touch support
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent);
                else this.handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent);
            } else {
                if (dy > 0) this.handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent);
                else this.handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent);
            }
        });
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (this.isGameOver) return;
        
        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
            default:
                return;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            if (this.checkGameOver()) {
                this.showGameOver();
            }
        }
    }

    private moveUp(): boolean {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            for (let row = 1; row < 4; row++) {
                if (this.grid[row][col] !== 0) {
                    let currentRow = row;
                    while (currentRow > 0 && this.grid[currentRow - 1][col] === 0) {
                        this.grid[currentRow - 1][col] = this.grid[currentRow][col];
                        this.grid[currentRow][col] = 0;
                        currentRow--;
                        moved = true;
                    }
                    if (currentRow > 0 && this.grid[currentRow - 1][col] === this.grid[currentRow][col]) {
                        this.grid[currentRow - 1][col] *= 2;
                        this.score += this.grid[currentRow - 1][col];
                        this.grid[currentRow][col] = 0;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    private moveDown(): boolean {
        let moved = false;
        for (let col = 0; col < 4; col++) {
            for (let row = 2; row >= 0; row--) {
                if (this.grid[row][col] !== 0) {
                    let currentRow = row;
                    while (currentRow < 3 && this.grid[currentRow + 1][col] === 0) {
                        this.grid[currentRow + 1][col] = this.grid[currentRow][col];
                        this.grid[currentRow][col] = 0;
                        currentRow++;
                        moved = true;
                    }
                    if (currentRow < 3 && this.grid[currentRow + 1][col] === this.grid[currentRow][col]) {
                        this.grid[currentRow + 1][col] *= 2;
                        this.score += this.grid[currentRow + 1][col];
                        this.grid[currentRow][col] = 0;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    private moveLeft(): boolean {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 1; col < 4; col++) {
                if (this.grid[row][col] !== 0) {
                    let currentCol = col;
                    while (currentCol > 0 && this.grid[row][currentCol - 1] === 0) {
                        this.grid[row][currentCol - 1] = this.grid[row][currentCol];
                        this.grid[row][currentCol] = 0;
                        currentCol--;
                        moved = true;
                    }
                    if (currentCol > 0 && this.grid[row][currentCol - 1] === this.grid[row][currentCol]) {
                        this.grid[row][currentCol - 1] *= 2;
                        this.score += this.grid[row][currentCol - 1];
                        this.grid[row][currentCol] = 0;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    private moveRight(): boolean {
        let moved = false;
        for (let row = 0; row < 4; row++) {
            for (let col = 2; col >= 0; col--) {
                if (this.grid[row][col] !== 0) {
                    let currentCol = col;
                    while (currentCol < 3 && this.grid[row][currentCol + 1] === 0) {
                        this.grid[row][currentCol + 1] = this.grid[row][currentCol];
                        this.grid[row][currentCol] = 0;
                        currentCol++;
                        moved = true;
                    }
                    if (currentCol < 3 && this.grid[row][currentCol + 1] === this.grid[row][currentCol]) {
                        this.grid[row][currentCol + 1] *= 2;
                        this.score += this.grid[row][currentCol + 1];
                        this.grid[row][currentCol] = 0;
                        moved = true;
                    }
                }
            }
        }
        return moved;
    }

    private addRandomTile(): void {
        const emptyCells: { row: number; col: number }[] = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    private updateDisplay(): void {
        // Clear existing tiles
        const existingTiles = document.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());

        // Update score
        this.scoreElement.textContent = this.score.toString();
        this.updateBestScore();

        // Add new tiles
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = 'tile';
                    tile.textContent = this.grid[row][col].toString();
                    tile.setAttribute('data-value', this.grid[row][col].toString());
                    
                    // Position the tile
                    const tileSize = 100; // Matches CSS var(--tile-size)
                    const gridSpacing = 15; // Matches CSS var(--grid-spacing)
                    const offset = -15; // Offset to align with grid cells
                    const x = col * (tileSize + gridSpacing) + gridSpacing + offset;
                    const y = row * (tileSize + gridSpacing) + gridSpacing + offset;
                    
                    tile.style.transform = `translate(${x}px, ${y}px)`;
                    this.gridContainer.appendChild(tile);
                }
            }
        }
    }

    private checkGameOver(): boolean {
        // Check for empty cells
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.grid[row][col] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const current = this.grid[row][col];
                if (
                    (row < 3 && current === this.grid[row + 1][col]) ||
                    (col < 3 && current === this.grid[row][col + 1])
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    private showGameOver(): void {
        this.isGameOver = true;
        this.gameOverElement.style.display = 'flex';
    }

    private updateBestScore(): void {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore.toString());
        }
        this.bestScoreElement.textContent = this.bestScore.toString();
    }

    private resetGame(): void {
        this.grid = Array(4).fill(null).map(() => Array(4).fill(0));
        this.score = 0;
        this.isGameOver = false;
        this.gameOverElement.style.display = 'none';
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new Game2048();
}); 