/**
 * Main entry point for the Parker Duck game.
 * Initializes the game canvas and starts the game loop when the page loads.
 * 
 * Game Configuration:
 * - Canvas size: 800x600 pixels
 * - Target framerate: 60fps
 * - Rendering: HTML5 Canvas 2D context
 * 
 * @fileoverview Entry point for Parker Duck - a 2D platformer game featuring
 * a duck character with walking and jumping animations, physics-based movement,
 * and sprite mirroring for directional movement.
 */

import { Game } from './game/core/Game';

/**
 * Initialize the game when the page finishes loading.
 * Sets up the canvas dimensions and starts the game loop.
 */
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;
    
    const game = new Game(canvas);
    game.start();
}); 