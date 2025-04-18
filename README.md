# 2048 Game in TypeScript

A classic 2048 game implementation using TypeScript, HTML, and CSS.

## Features

- Classic 2048 gameplay
- Score tracking
- Responsive design
- Smooth animations
- Game over detection

## How to Play

1. Use the arrow keys to move tiles:
   - ↑ (Up Arrow): Move all tiles up
   - ↓ (Down Arrow): Move all tiles down
   - ← (Left Arrow): Move all tiles left
   - → (Right Arrow): Move all tiles right

2. When two tiles with the same number collide, they merge into one tile with the sum of their values.

3. After each move, a new tile (either 2 or 4) appears in a random empty cell.

4. The game ends when:
   - You reach the 2048 tile (win)
   - No more moves are possible (game over)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:1234`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT 