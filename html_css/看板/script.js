document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('puzzle-board');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const message = document.getElementById('message');
    
    const size = 3; // 3x3 网格
    const pieceSize = 100; // 每个拼图块的像素大小
    let pieces = []; // 存储拼图块对象的数组
    let emptyPosition = { row: size - 1, col: size - 1 }; // 初始空白块位置 (右下角)
    let isShuffling = false; // 防止在打乱过程中点击

    // 初始化游戏
    function initGame() {
        board.innerHTML = '';
        pieces = [];
        message.textContent = '';
        // 创建 (size*size - 1) 个拼图块
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (row === size - 1 && col === size - 1) continue; // 留出最后一个作为空白

                const piece = document.createElement('div');
                piece.classList.add('puzzle-piece');
                // 设置背景图片偏移，以显示图片的正确部分
                piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
                // 设置初始位置
                piece.style.top = `${row * pieceSize}px`;
                piece.style.left = `${col * pieceSize}px`;
                
                // 存储拼图块的当前位置和它应该在的正确位置
                piece.dataset.currentRow = row;
                piece.dataset.currentCol = col;
                piece.dataset.correctRow = row;
                piece.dataset.correctCol = col;

                piece.addEventListener('click', movePiece);
                board.appendChild(piece);
                pieces.push(piece);
            }
        }
        shuffle(); // 初始打乱
    }

    // 点击移动拼图块
    function movePiece(event) {
        if (isShuffling) return;

        const piece = event.target;
        const currentRow = parseInt(piece.dataset.currentRow);
        const currentCol = parseInt(piece.dataset.currentCol);

        // 检查被点击块的上下左右是否有空白块
        const isAdjacentToEmpty = (
            (currentRow === emptyPosition.row && Math.abs(currentCol - emptyPosition.col) === 1) ||
            (currentCol === emptyPosition.col && Math.abs(currentRow - emptyPosition.row) === 1)
        );

        if (isAdjacentToEmpty) {
            // 交换位置数据
            piece.dataset.currentRow = emptyPosition.row;
            piece.dataset.currentCol = emptyPosition.col;
            
            // 更新视觉位置
            piece.style.top = `${emptyPosition.row * pieceSize}px`;
            piece.style.left = `${emptyPosition.col * pieceSize}px`;

            // 更新空白块位置
            emptyPosition = { row: currentRow, col: currentCol };

            // 每次移动后检查是否胜利
            setTimeout(checkWin, 250); // 等待动画完成后检查
        }
    }

    // 随机打乱拼图
    function shuffle() {
        isShuffling = true;
        message.textContent = '正在打乱...';
        const moves = 100; // 打乱的步数
        let count = 0;

        const interval = setInterval(() => {
            const movablePieces = pieces.filter(piece => {
                const row = parseInt(piece.dataset.currentRow);
                const col = parseInt(piece.dataset.currentCol);
                return (
                    (row === emptyPosition.row && Math.abs(col - emptyPosition.col) === 1) ||
                    (col === emptyPosition.col && Math.abs(row - emptyPosition.row) === 1)
                );
            });

            if (movablePieces.length > 0) {
                const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
                // 模拟点击事件来移动
                randomPiece.click();
            }

            count++;
            if (count >= moves) {
                clearInterval(interval);
                isShuffling = false;
                message.textContent = '开始拼图吧！';
            }
        }, 50); // 每 50ms 移动一次
    }

    // 检查是否拼成功
    function checkWin() {
        if (isShuffling) return;

        const isWin = pieces.every(piece => {
            return piece.dataset.currentRow === piece.dataset.correctRow &&
                   piece.dataset.currentCol === piece.dataset.correctCol;
        });

        if (isWin) {
            message.textContent = "恭喜！你成功拼完了！🎉";
            message.style.color = "#28a745";
        }
    }

    // 绑定按钮事件
    shuffleBtn.addEventListener('click', () => {
        if (!isShuffling) {
            shuffle();
            message.style.color = "#d9534f"; // 重置消息颜色
        }
    });

    // 启动游戏
    initGame();
});