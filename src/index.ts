import { Game } from './game/core/Game';

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;
    
    const game = new Game(canvas);
    game.start();
}); 