import { InputHandler } from '../core/InputHandler';
import { Animation } from '../utils/Animation';
import duckWalkingSprite from '../../assets/images/duck_walking.png';
import duckJumpingSprite from '../../assets/images/duck_jumping.png';

/** Animation frame duration for walking animation in milliseconds */
const FRAME_DURATION_WALK = 60;

/** Animation frame duration for jumping animation in milliseconds */
const FRAME_DURATION_JUMP = 10;

/** Animation type identifier for walking animation */
const ANIM_WALK = 0;

/** Animation type identifier for jumping animation */
const ANIM_JUMP = 1;

/**
 * Duck character class representing the main player character.
 * Handles movement, jumping, animation states, and sprite rendering with horizontal flipping.
 * 
 * Features:
 * - Physics-based movement with gravity and ground collision
 * - Multiple animation states (walking, jumping)
 * - Horizontal sprite mirroring for left/right movement
 * - Dual sprite system for different animation types
 * 
 * @example
 * ```typescript
 * const inputHandler = new InputHandler();
 * const duck = new Duck(100, 400, inputHandler);
 * 
 * // In game loop
 * duck.update(deltaTime);
 * duck.render(ctx);
 * ```
 */
export class Duck {
    /** Current X position in pixels */
    private x: number;
    
    /** Current Y position in pixels */
    private y: number;
    
    /** Horizontal velocity in pixels per second */
    private velocityX: number = 0;
    
    /** Vertical velocity in pixels per second */
    private velocityY: number = 0;
    
    /** Normal walking speed in pixels per second */
    private speed: number = 200;
    
    /** Running speed when holding shift in pixels per second */
    private runSpeed: number = 650;
    
    /** Initial upward force applied when jumping */
    private jumpForce: number = -400;
    
    /** Gravity acceleration in pixels per second squared */
    private gravity: number = 800;
    
    /** Whether the duck is currently in the air */
    private isJumping: boolean = false;
    
    /** Input handler for processing keyboard input */
    private inputHandler: InputHandler;
    
    /** Sprite image for walking animation */
    private walkingSprite: HTMLImageElement;
    
    /** Sprite image for jumping animation */
    private jumpingSprite: HTMLImageElement;
    
    /** Currently active sprite being rendered */
    private currentSprite: HTMLImageElement;
    
    /** Width of each animation frame in pixels */
    private frameWidth = 76;
    
    /** Height of each animation frame in pixels */
    private frameHeight = 90;
    
    /** Animation controller for managing frame cycling */
    private animation: Animation | null = null;
    
    /** Whether the walking sprite has finished loading */
    private walkingLoaded: boolean = false;
    
    /** Whether the jumping sprite has finished loading */
    private jumpingLoaded: boolean = false;
    
    /** Current animation type (ANIM_WALK or ANIM_JUMP) */
    private currentAnimType: number = ANIM_WALK;
    
    /** Rendering scale factor (currently unused) */
    private scale: number = 1;
    
    /** Whether the duck is facing left (for sprite mirroring) */
    private facingLeft: boolean = false;

    /**
     * Creates a new Duck instance.
     * 
     * @param x - Initial X position in pixels
     * @param y - Initial Y position in pixels  
     * @param inputHandler - Input handler for processing keyboard input
     */
    constructor(x: number, y: number, inputHandler: InputHandler) {
        this.x = x;
        this.y = y;
        this.inputHandler = inputHandler;
        
        // Initialize walking sprite
        this.walkingSprite = new window.Image();
        this.walkingSprite.src = duckWalkingSprite;
        this.walkingSprite.onload = () => {
            console.log('Walking sprite loaded:', this.walkingSprite.width, this.walkingSprite.height);
            this.walkingLoaded = true;
            this.initializeAnimation();
        };
        
        // Initialize jumping sprite
        this.jumpingSprite = new window.Image();
        this.jumpingSprite.src = duckJumpingSprite;
        this.jumpingSprite.onload = () => {
            console.log('Jumping sprite loaded:', this.jumpingSprite.width, this.jumpingSprite.height);
            this.jumpingLoaded = true;
            this.initializeAnimation();
        };
        
        // Start with walking sprite
        this.currentSprite = this.walkingSprite;
    }
    
    /**
     * Initializes the animation system once sprites are loaded.
     * Sets up the walking animation as the default state.
     * 
     * @private
     */
    private initializeAnimation(): void {
        if (this.walkingLoaded && this.currentAnimType === ANIM_WALK) {
            this.animation = new Animation(
                this.walkingSprite,
                this.frameWidth,
                this.frameHeight,
                0, // row 0 for walking
                7, // 7 frames for walking
                FRAME_DURATION_WALK
            );
        }
    }
    
    /**
     * Switches between different animation types (walking/jumping).
     * Updates the current sprite and creates a new Animation instance with appropriate settings.
     * 
     * @param newAnimType - The animation type to switch to (ANIM_WALK or ANIM_JUMP)
     * @private
     */
    private switchAnimation(newAnimType: number): void {
        this.currentAnimType = newAnimType;
        
        if (newAnimType === ANIM_WALK && this.walkingLoaded) {
            this.currentSprite = this.walkingSprite;
            this.animation = new Animation(
                this.walkingSprite,
                this.frameWidth,
                this.frameHeight,
                0, // row 0
                7, // 7 frames
                FRAME_DURATION_WALK
            );
        } else if (newAnimType === ANIM_JUMP && this.jumpingLoaded) {
            this.currentSprite = this.jumpingSprite;
            // For jumping: 8 columns, 2 rows = 16 total frames
            this.animation = new Animation(
                this.jumpingSprite,
                this.frameWidth,
                this.frameHeight,
                0, // start with row 0
                16, // 16 total frames (8x2)
                FRAME_DURATION_JUMP
            );
        }
    }

    /**
     * Updates the duck's state including physics, input handling, and animation.
     * Called once per frame by the game loop.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    public update(deltaTime: number): void {
        // Convert deltaTime to seconds
        const dt = deltaTime / 1000;

        // Handle horizontal movement
        let moving = false;
        let running = false;
        if (this.inputHandler.isMovingLeft()) {
            this.velocityX = this.inputHandler.isKeyPressed('Shift') ? -this.runSpeed : -this.speed;
            this.facingLeft = true;
            moving = true;
            running = this.inputHandler.isKeyPressed('Shift');
        } else if (this.inputHandler.isMovingRight()) {
            this.velocityX = this.inputHandler.isKeyPressed('Shift') ? this.runSpeed : this.speed;
            this.facingLeft = false;
            moving = true;
            running = this.inputHandler.isKeyPressed('Shift');
        } else {
            this.velocityX = 0;
        }

        // Handle jumping
        if (this.inputHandler.isJumping() && !this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }

        // Apply gravity
        this.velocityY += this.gravity * dt;

        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;

        // Simple ground collision
        if (this.y > 500) { // Ground level
            this.y = 500;
            this.velocityY = 0;
            this.isJumping = false;
        }

        // Animation switching
        if (this.animation) {
            let newAnimType = ANIM_WALK;
            
            if (this.isJumping) {
                newAnimType = ANIM_JUMP;
            } else if (moving) {
                newAnimType = ANIM_WALK;
            }
            
            // Switch animation if needed
            if (newAnimType !== this.currentAnimType) {
                this.switchAnimation(newAnimType);
            }
            
            // Update animation
            if (this.isJumping && this.currentAnimType === ANIM_JUMP) {
                // For jumping, only update if not on last frame
                const currentFrame = this.animation['currentFrame'];
                const maxFrames = 16; // Total jump frames
                if (currentFrame < maxFrames - 1) {
                    this.animation.update(deltaTime);
                }
                // If on last frame, freeze there until landing
            } else if (moving) {
                // Normal walking animation
                this.animation.update(deltaTime);
            } else {
                // Idle: set to first frame of walk animation
                this.animation.setRow(0);
                this.animation.reset();
            }
        }
    }

    /**
     * Renders the duck sprite to the canvas with proper animation frame and horizontal mirroring.
     * Includes debug frame visualization and handles sprite flipping for left-facing movement.
     * 
     * @param ctx - The 2D rendering context of the canvas
     */
    public render(ctx: CanvasRenderingContext2D): void {
        if (this.animation && this.frameWidth && this.frameHeight && this.currentSprite) {
            // Draw debug frame
            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.strokeRect(
                this.x - this.frameWidth / 2,
                this.y - this.frameHeight / 2,
                this.frameWidth,
                this.frameHeight
            );
            ctx.restore();

            let sx = 0;
            let sy = 0;
            let sw = 76; // source width
            let sh = 90; // source height
            
            if (this.animation) {
                const frame = this.animation['currentFrame'];
                
                if (this.currentAnimType === ANIM_WALK) {
                    // Walking animation frames - 7 frames, each 76x90 pixels
                    const walkFrameData = [
                        { x: 0, y: 0, width: 76, height: 90 },      // frame 0
                        { x: 76, y: 0, width: 76, height: 90 },     // frame 1
                        { x: 152, y: 0, width: 76, height: 90 },    // frame 2
                        { x: 228, y: 0, width: 76, height: 90 },    // frame 3
                        { x: 304, y: 0, width: 76, height: 90 },    // frame 4
                        { x: 380, y: 0, width: 76, height: 90 },    // frame 5
                        { x: 456, y: 0, width: 76, height: 90 },    // frame 6
                    ];
                    
                    if (frame < walkFrameData.length) {
                        const frameData = walkFrameData[frame];
                        sx = frameData.x;
                        sy = frameData.y;
                        sw = frameData.width;
                        sh = frameData.height;
                    }
                } else if (this.currentAnimType === ANIM_JUMP) {
                    // Jumping animation frames - 8 columns x 2 rows, each 76x90 pixels
                    const jumpFrameData = [];
                    
                    // Generate frame data for 8x2 grid
                    for (let row = 0; row < 2; row++) {
                        for (let col = 0; col < 8; col++) {
                            jumpFrameData.push({
                                x: col * 76,
                                y: row * 90,
                                width: 76,
                                height: 90
                            });
                        }
                    }
                    
                    if (frame < jumpFrameData.length) {
                        const frameData = jumpFrameData[frame];
                        sx = frameData.x;
                        sy = frameData.y;
                        sw = frameData.width;
                        sh = frameData.height;
                    }
                }
            }

            // Draw just the duck artwork at a reasonable scale
            const drawScale = 1; // Reduce scale to make duck reasonable size
            const drawWidth = sw * drawScale;
            const drawHeight = sh * drawScale;
            
            // Save the current canvas state
            ctx.save();
            
            // If facing left, flip the sprite horizontally
            if (this.facingLeft) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    this.currentSprite,
                    sx, sy, sw, sh,
                    -(this.x + drawWidth / 2),  // Flip the x position
                    this.y - drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            } else {
                ctx.drawImage(
                    this.currentSprite,
                    sx, sy, sw, sh,
                    this.x - drawWidth / 2,
                    this.y - drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            }
            
            // Restore the canvas state
            ctx.restore();
        } else {
            // Draw placeholder while loading
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, 50, 50);
        }
    }
} 