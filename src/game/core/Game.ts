import { Duck } from '../entities/Duck';
import { AngryBread } from '../entities/AngryBread';
import { InputHandler } from '../core/InputHandler';
import { Camera } from '../core/Camera';
import { Background } from '../world/Background';
import { Ground } from '../world/Ground';
import { DebugConfig } from '../core/DebugConfig';

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
 * - Entity management (Duck and AngryBread enemies)
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
    
    /** Array of angry bread enemies */
    private enemies: AngryBread[] = [];
    
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
        this.ground = new Ground(820); // Ground level at Y=850 (near bottom of screen)
        
        // Initialize duck at starting position  
        this.duck = new Duck(100, 865, this.inputHandler);
        
        // Initialize test enemies
        this.initializeEnemies();
        
        // Configure camera
        this.camera.setBounds(0, 8000); // World width of 8000 pixels (4x longer)
        this.camera.setSmoothing(0.05); // Smooth camera following
        
        // Configure background for side-scrolling feel
        this.background.setSkyColors('#87CEEB', '#E0F6FF');
        
        // Initialize debug system with keyboard shortcuts
        DebugConfig.setupKeyboardShortcuts();
    }

    /**
     * Initializes enemy positions throughout the world.
     * Creates test enemies at various positions for gameplay testing.
     * 
     * @private
     */
    private initializeEnemies(): void {
        // Create test enemies at various positions across the world
        // Spread them out across the 8000px world width
        
        // First group - early encounter
        this.enemies.push(new AngryBread(800, 800, 150));   // x: 800, y: 800, patrol: 150px
        this.enemies.push(new AngryBread(1200, 800, 100));  // x: 1200, y: 800, patrol: 100px
        
        // Second group - mid section
        this.enemies.push(new AngryBread(2500, 800, 200));  // x: 2500, y: 800, patrol: 200px
        this.enemies.push(new AngryBread(3000, 800, 120));  // x: 3000, y: 800, patrol: 120px
        this.enemies.push(new AngryBread(3500, 800, 180));  // x: 3500, y: 800, patrol: 180px
        
        // Third group - later section
        this.enemies.push(new AngryBread(5000, 800, 160));  // x: 5000, y: 800, patrol: 160px
        this.enemies.push(new AngryBread(5800, 800, 140));  // x: 5800, y: 800, patrol: 140px
        
        // Final group - end area
        this.enemies.push(new AngryBread(7200, 800, 200));  // x: 7200, y: 800, patrol: 200px
        this.enemies.push(new AngryBread(7800, 800, 100));  // x: 7800, y: 800, patrol: 100px
        
        console.log(`Initialized ${this.enemies.length} angry bread enemies`);
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
        
        // Update all enemies
        for (const enemy of this.enemies) {
            enemy.update(deltaTime, this.ground);
        }
        
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
        
        // Render all enemies
        for (const enemy of this.enemies) {
            enemy.render(this.ctx, this.camera);
        }
        
        // Render duck (on top of enemies)
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
     * Gets the array of enemies for external access.
     * 
     * @returns Array of AngryBread enemies
     */
    public getEnemies(): AngryBread[] {
        return this.enemies;
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