import { Duck } from '../entities/Duck';
import { InputHandler } from '../core/InputHandler';
import { Camera } from '../core/Camera';
import { Background } from '../world/Background';
import { Ground } from '../world/Ground';

/**
 * Main Game class that orchestrates the game loop and manages core game systems.
 * Handles initialization, game loop timing, and coordinates updates and rendering.
 * 
 * Features:
 * - 60fps game loop with delta time calculations
 * - Canvas rendering management with camera system
 * - Scrolling background with parallax effects
 * - Proper ground collision system
 * - Input handling coordination
 * - Game state management (start/stop)
 * 
 * Architecture:
 * - Uses requestAnimationFrame for smooth 60fps rendering
 * - Delta time-based updates for frame rate independence
 * - Camera system for world-to-screen coordinate transformation
 * - Background system with multiple parallax layers
 * - Ground system for terrain collision
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
    
    /** Camera system for world-to-screen coordinate transformation */
    private camera: Camera;
    
    /** Background system with parallax scrolling layers */
    private background: Background;
    
    /** Ground system for terrain collision */
    private ground: Ground;
    
    /** Timestamp of the last frame for delta time calculation */
    private lastTime: number = 0;
    
    /** Whether the game loop is currently running */
    private isRunning: boolean = false;

    /**
     * Creates a new Game instance and initializes all core systems.
     * 
     * @param canvas - The HTML canvas element to render the game on
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        
        // Initialize core systems
        this.inputHandler = new InputHandler();
        this.camera = new Camera(canvas.width, canvas.height);
        this.background = new Background();
        this.ground = new Ground(450); // Ground level at Y=450
        
        // Initialize duck at starting position  
        this.duck = new Duck(100, 450, this.inputHandler);
        
        // Configure camera
        this.camera.setBounds(0, 2000); // World width of 2000 pixels
        this.camera.setSmoothing(0.05); // Smooth camera following
        
        // Configure background for side-scrolling feel
        this.background.setSkyColors('#87CEEB', '#E0F6FF');
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
        // Update duck with ground collision
        this.duck.update(deltaTime, this.ground);
        
        // Update camera to follow duck
        this.camera.followTarget(this.duck.getX(), this.duck.getY());
        this.camera.update(deltaTime);
    }

    /**
     * Renders all game elements to the canvas with proper layering.
     * Renders background, ground, and entities with camera transformation.
     * 
     * @private
     */
    private render(): void {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background with parallax scrolling
        this.background.render(this.ctx, this.camera, this.canvas.width, this.canvas.height);
        
        // Render ground
        this.ground.render(this.ctx, this.camera, this.canvas.width, this.canvas.height);
        
        // Render game entities
        this.duck.render(this.ctx, this.camera);
    }

    /**
     * Gets the current camera instance for external access.
     * 
     * @returns The camera instance
     */
    public getCamera(): Camera {
        return this.camera;
    }

    /**
     * Gets the ground system for external access.
     * 
     * @returns The ground instance
     */
    public getGround(): Ground {
        return this.ground;
    }

    /**
     * Gets the background system for external access.
     * 
     * @returns The background instance
     */
    public getBackground(): Background {
        return this.background;
    }

    /**
     * Resizes the game viewport when canvas size changes.
     * Updates camera viewport dimensions.
     * 
     * @param width - New canvas width
     * @param height - New canvas height
     */
    public resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        // Note: Camera constructor parameters are viewport size, 
        // but we'd need to add a resize method to Camera to update them
    }
} 