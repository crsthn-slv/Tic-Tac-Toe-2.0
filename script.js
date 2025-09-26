class UltimateTicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.nextBoard = null; // null means any board
        this.boards = Array(9).fill().map(() => Array(9).fill(''));
        this.boardWinners = Array(9).fill('');
        this.gameWinner = '';
        this.gameActive = true;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createMainBoard();
        this.updateGameStatus();
        this.updateNextBoardInfo();
    }

    createMainBoard() {
        const mainBoard = document.getElementById('main-board');
        mainBoard.innerHTML = '';

        for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
            const miniBoard = document.createElement('div');
            miniBoard.className = 'mini-board';
            miniBoard.dataset.boardIndex = boardIndex;
            
            // Create cells for this mini-board
            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.cellIndex = cellIndex;
                miniBoard.appendChild(cell);
            }

            // Add click event to mini-board
            miniBoard.addEventListener('click', (e) => this.handleBoardClick(e, boardIndex));
            
            mainBoard.appendChild(miniBoard);
        }
    }

    handleBoardClick(e, boardIndex) {
        if (!this.gameActive) return;
        if (this.boardWinners[boardIndex] !== '') return;
        if (this.nextBoard !== null && this.nextBoard !== boardIndex) return;

        // Set this as the current board to play in
        this.nextBoard = boardIndex;

        // Open modal for this board
        this.openBoardModal(boardIndex);
    }

    openBoardModal(boardIndex) {
        const modal = document.getElementById('board-modal');
        const modalBoardNumber = document.getElementById('modal-board-number');
        const modalBoard = document.getElementById('modal-board');
        const modalCurrentPlayer = document.getElementById('modal-current-player');

        // Randomly change the current player when opening modal
        this.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';

        if (modalBoardNumber) {
            modalBoardNumber.textContent = boardIndex + 1;
        }
        
        if (modalCurrentPlayer) {
            modalCurrentPlayer.textContent = this.currentPlayer;
        }
        
        // Create the modal board
        modalBoard.innerHTML = '';
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.cellIndex = cellIndex;
            
            // Set existing content
            const cellValue = this.boards[boardIndex][cellIndex];
            if (cellValue) {
                // Create the appropriate icon instead of text
                if (cellValue === 'X') {
                    cell.innerHTML = '<div class="x-icon"></div>';
                    cell.classList.add('x');
                } else if (cellValue === 'O') {
                    cell.innerHTML = '<div class="o-icon"></div>';
                    cell.classList.add('o');
                }
            }
            
            // Add click event
            cell.addEventListener('click', () => this.handleCellClick(boardIndex, cellIndex));
            
            // Add hover effects for empty cells
            if (!cellValue) {
                cell.addEventListener('mouseenter', () => this.showHoverPreview(cell, this.currentPlayer));
                cell.addEventListener('mouseleave', () => this.clearHoverPreview(cell));
            }
            
            modalBoard.appendChild(cell);
        }

        modal.style.display = 'block';
    }

    handleCellClick(boardIndex, cellIndex) {
        if (!this.gameActive) return;
        if (this.boards[boardIndex][cellIndex] !== '') return;
        if (this.boardWinners[boardIndex] !== '') return;

        // Make the move
        this.boards[boardIndex][cellIndex] = this.currentPlayer;
        
        // Update the modal display
        const modalBoard = document.getElementById('modal-board');
        const cell = modalBoard.children[cellIndex];
        
        // Create the appropriate icon instead of text
        if (this.currentPlayer === 'X') {
            cell.innerHTML = '<div class="x-icon"></div>';
            cell.classList.add('x');
        } else if (this.currentPlayer === 'O') {
            cell.innerHTML = '<div class="o-icon"></div>';
            cell.classList.add('o');
        }

        // Check if this mini-board is won
        const boardWinner = this.checkBoardWinner(boardIndex);
        if (boardWinner) {
            this.boardWinners[boardIndex] = boardWinner;
            this.updateMainBoardDisplay();
            
            // Check if game is won
            const gameWinner = this.checkGameWinner();
            if (gameWinner) {
                this.gameWinner = gameWinner;
                this.gameActive = false;
                this.updateGameStatus();
                this.closeModal();
                
                // Launch confetti animation for the winner
                setTimeout(() => {
                    if (window.launchConfetti) {
                        window.launchConfetti(gameWinner);
                    }
                }, 300); // Small delay to ensure DOM is updated
                
                return;
            }
            
            // Mini-board is won, close modal and allow selection of any board
            this.nextBoard = null;
            this.closeModal();
            this.updateMainBoardDisplay();
            this.updateGameStatus();
            return;
        }

        // Check if board is full (draw)
        if (this.isBoardFull(boardIndex) && !boardWinner) {
            this.boardWinners[boardIndex] = 'DRAW';
            this.updateMainBoardDisplay();
            
            // Mini-board is drawn, close modal and allow selection of any board
            this.nextBoard = null;
            this.closeModal();
            this.updateMainBoardDisplay();
            this.updateGameStatus();
            return;
        }

        // Switch player and continue in the same board
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        // Update modal player display
        const modalCurrentPlayer = document.getElementById('modal-current-player');
        if (modalCurrentPlayer) {
            modalCurrentPlayer.textContent = this.currentPlayer;
        }
        
        // Update hover effects for remaining empty cells
        this.updateModalHoverEffects(boardIndex);
        
        // Update displays
        this.updateMainBoardDisplay();
        this.updateGameStatus();
        
        // Modal stays open - players continue in this board
    }

    checkBoardWinner(boardIndex) {
        const board = this.boards[boardIndex];
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    checkGameWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.boardWinners[a] && 
                this.boardWinners[a] !== 'DRAW' &&
                this.boardWinners[a] === this.boardWinners[b] && 
                this.boardWinners[a] === this.boardWinners[c]) {
                return this.boardWinners[a];
            }
        }
        return null;
    }

    isBoardFull(boardIndex) {
        return this.boards[boardIndex].every(cell => cell !== '');
    }

    updateMainBoardDisplay() {
        const mainBoard = document.getElementById('main-board');
        const miniBoards = mainBoard.children;

        for (let i = 0; i < miniBoards.length; i++) {
            const miniBoard = miniBoards[i];
            const winner = this.boardWinners[i];
            
            // Remove all winner classes
            miniBoard.classList.remove('won-x', 'won-o', 'draw', 'active', 'disabled');
            
            // Add appropriate class based on winner
            if (winner === 'X') {
                miniBoard.classList.add('won-x');
                // Recreate cells with blur effect
                miniBoard.innerHTML = '';
                for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    const cellValue = this.boards[i][cellIndex];
                    if (cellValue) {
                        if (cellValue === 'X') {
                            cell.innerHTML = '<div class="x-icon"></div>';
                            cell.classList.add('x');
                        } else if (cellValue === 'O') {
                            cell.innerHTML = '<div class="o-icon"></div>';
                            cell.classList.add('o');
                        }
                    }
                    miniBoard.appendChild(cell);
                }
                // Add large X overlay
                const overlay = document.createElement('div');
                overlay.className = 'winner-overlay x';
                overlay.innerHTML = '<div class="x-icon"></div>';
                miniBoard.appendChild(overlay);
            } else if (winner === 'O') {
                miniBoard.classList.add('won-o');
                // Recreate cells with blur effect
                miniBoard.innerHTML = '';
                for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    const cellValue = this.boards[i][cellIndex];
                    if (cellValue) {
                        if (cellValue === 'X') {
                            cell.innerHTML = '<div class="x-icon"></div>';
                            cell.classList.add('x');
                        } else if (cellValue === 'O') {
                            cell.innerHTML = '<div class="o-icon"></div>';
                            cell.classList.add('o');
                        }
                    }
                    miniBoard.appendChild(cell);
                }
                // Add large O overlay
                const overlay = document.createElement('div');
                overlay.className = 'winner-overlay o';
                overlay.innerHTML = '<div class="o-icon"></div>';
                miniBoard.appendChild(overlay);
            } else if (winner === 'DRAW') {
                miniBoard.classList.add('draw');
                miniBoard.innerHTML = '<div class="winner-overlay">-</div>';
            } else {
                // Recreate cells for unfinished boards
                miniBoard.innerHTML = '';
                for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    const cellValue = this.boards[i][cellIndex];
                    if (cellValue) {
                        // Create the appropriate icon instead of text
                        if (cellValue === 'X') {
                            cell.innerHTML = '<div class="x-icon"></div>';
                            cell.classList.add('x');
                        } else if (cellValue === 'O') {
                            cell.innerHTML = '<div class="o-icon"></div>';
                            cell.classList.add('o');
                        }
                    }
                    miniBoard.appendChild(cell);
                }
            }

            // Highlight active board
            if (this.nextBoard === null) {
                if (winner === '') {
                    miniBoard.classList.add('active');
                }
            } else if (this.nextBoard === i && winner === '') {
                miniBoard.classList.add('active');
            } else if (winner === '') {
                miniBoard.classList.add('disabled');
            }
        }
    }

    updateGameStatus() {
        const gameResult = document.getElementById('game-result');
        const resultText = document.getElementById('result-text');

        if (this.gameWinner) {
            if (gameResult) {
                gameResult.style.display = 'block';
                if (resultText) {
                    if (this.gameWinner === 'X') {
                        resultText.textContent = 'Xiszinho ganhou';
                    } else {
                        resultText.textContent = 'Bolinha ganhou';
                    }
                }
            }
        } else if (this.isGameDraw()) {
            if (gameResult) {
                gameResult.style.display = 'block';
                if (resultText) {
                    resultText.textContent = 'Jogo empatado!';
                }
                
                // Launch confetti for draw (can use either X or O style)
                setTimeout(() => {
                    if (window.launchConfetti) {
                        window.launchConfetti('O'); // Use O style for draws
                    }
                }, 300);
            }
        } else {
            if (gameResult) {
                gameResult.style.display = 'none';
            }
        }
    }

    updateNextBoardInfo() {
        // This method can be kept for future use but is not needed for the current UI
    }

    isGameDraw() {
        return this.boardWinners.every(winner => winner !== '') && !this.gameWinner;
    }

    closeModal() {
        const modal = document.getElementById('board-modal');
        modal.style.display = 'none';
    }

    resetGame() {
        this.currentPlayer = 'X';
        this.nextBoard = null;
        this.boards = Array(9).fill().map(() => Array(9).fill(''));
        this.boardWinners = Array(9).fill('');
        this.gameWinner = '';
        this.gameActive = true;
        
        this.createMainBoard();
        this.updateGameStatus();
        this.updateNextBoardInfo();
        this.closeModal();
    }

    setupEventListeners() {
        // Reset button (if exists)
        const resetButton = document.getElementById('reset-game');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetGame();
            });
        }

        // Modal close button (if exists)
        const closeButton = document.getElementById('close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('board-modal');
            if (modal && e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showHoverPreview(cell, player) {
        if (cell.innerHTML !== '') return; // Don't show preview on occupied cells
        
        const preview = document.createElement('div');
        preview.className = 'hover-preview';
        preview.style.opacity = '0.3';
        
        if (player === 'X') {
            preview.innerHTML = '<div class="x-icon"></div>';
            preview.classList.add('x');
        } else {
            preview.innerHTML = '<div class="o-icon"></div>';
            preview.classList.add('o');
        }
        
        cell.appendChild(preview);
    }

    clearHoverPreview(cell) {
        const preview = cell.querySelector('.hover-preview');
        if (preview) {
            cell.removeChild(preview);
        }
    }

    updateModalHoverEffects(boardIndex) {
        const modalBoard = document.getElementById('modal-board');
        if (!modalBoard) return;
        
        // Remove old event listeners and add new ones with current player
        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
            const cell = modalBoard.children[cellIndex];
            if (cell && this.boards[boardIndex][cellIndex] === '') {
                // Clone node to remove all event listeners
                const newCell = cell.cloneNode(true);
                cell.parentNode.replaceChild(newCell, cell);
                
                // Add back the click event
                newCell.addEventListener('click', () => this.handleCellClick(boardIndex, cellIndex));
                
                // Add hover effects with current player
                newCell.addEventListener('mouseenter', () => this.showHoverPreview(newCell, this.currentPlayer));
                newCell.addEventListener('mouseleave', () => this.clearHoverPreview(newCell));
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new UltimateTicTacToe();
});