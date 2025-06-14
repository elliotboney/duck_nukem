import { Duck } from '../entities/Duck';
import { InputHandler } from '../core/InputHandler';

/**
 * Main Game class that orchestrates the game loop and manages core game systems.
 * Handles initialization, game loop timing, and coordinates updates and rendering.
 * 
 * Features:
 * - 60fps game loop with delta time calculations
 * - Canvas rendering management
 * - Input handling coordination
 * - Game state management (start/stop)
 * 
 * Architecture:
 * - Uses requestAnimationFrame for smooth 60fps rendering
 * - Delta time-based updates for frame rate independence
 * - Centralized input handling through InputHandler
 * - Entity management (currently Duck)
 * 
 * @example
 * ```typescript
 * const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
 * const game = new Game(canvas);
 * game.start();
 * ```
 */
export class Game {
    /** The HTML canvas element for rendering */
    private canvas: HTMLCanvasElement;
    
    /** 2D rendering context for drawing operations */
    private ctx: CanvasRenderingContext2D;
    
    /** Input handler for processing keyboard input */
    private inputHandler: InputHandler;
    
    /** The main player character */
    private duck: Duck;
    
    /** Timestamp of the last frame for delta time calculation */
    private lastTime: number = 0;
    
    /** Whether the game loop is currently running */
    private isRunning: boolean = false;

    /**
     * Creates a new Game instance and initializes core systems.
     * 
     * @param canvas - The HTML canvas element to render the game on
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.inputHandler = new InputHandler();
        this.duck = new Duck(100, 400, this.inputHandler);
    }

    /**
     * Starts the game loop and begins rendering.
     * Initiates the requestAnimationFrame cycle for smooth 60fps gameplay.
     */
    public start(): void {
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Stops the game loop and halts rendering.
     * The game can be restarted by calling start() again.
     */
    public stop(): void {
        this.isRunning = false;
    }

    /**
     * Main game loop that handles timing, updates, and rendering.
     * Called automatically by requestAnimationFrame for smooth 60fps performance.
     * 
     * @param timestamp - High-resolution timestamp provided by requestAnimationFrame
     * @private
     */
    private gameLoop(timestamp: number): void {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Updates all game entities and systems.
     * Called once per frame with delta time for frame rate independence.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @private
     */
    private update(deltaTime: number): void {
        this.duck.update(deltaTime);
    }

    /**
     * Renders all game entities to the canvas.
     * Clears the canvas and draws all visible game elements.
     * 
     * @private
     */
    private render(): void {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the game elements
        this.duck.render(this.ctx);
    }
} 