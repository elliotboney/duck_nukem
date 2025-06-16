import { InputHandler } from '../core/InputHandler';
import { Animation } from '../utils/Animation';
import { DebugConfig } from '../core/DebugConfig';
import duckWalkingSprite from '../../assets/images/duck_walking.png';
import duckRunningSprite from '../../assets/images/duck_running.png';
import duckJumpingSprite from '../../assets/images/duck_jumping.png';
import duckIdleSprite from '../../assets/images/duck_idle.png';

/** Animation frame duration for walking animation in milliseconds */
const FRAME_DURATION_WALK = 60;

/** Animation frame duration for running animation in milliseconds */
const FRAME_DURATION_RUN = 40;

/** Animation frame duration for jumping animation in milliseconds */
const FRAME_DURATION_JUMP = 50;

/** Animation frame duration for idle animation in milliseconds */
const FRAME_DURATION_IDLE = 120;

/** Animation type identifier for walking animation */
const ANIM_WALK = 0;

/** Animation type identifier for running animation */
const ANIM_RUN = 1;

/** Animation type identifier for jumping animation */
const ANIM_JUMP = 2;

/** Animation type identifier for idle animation */
const ANIM_IDLE = 3;

/**
 * Duck character class representing the main player character.
 * Handles movement, jumping, animation states, and sprite rendering with horizontal flipping.
 * 
 * Features:
 * - Physics-based movement with gravity and ground collision
 * - Multiple animation states (walking, running, jumping)
 * - Horizontal sprite mirroring for left/right movement
 * - Triple sprite system for different animation types
 * - Running speed boost when holding Shift key
 * - Camera-compatible coordinate system
 * 
 * @example
 * ```typescript
 * const inputHandler = new InputHandler();
 * const duck = new Duck(100, 400, inputHandler);
 * 
 * // In game loop
 * duck.update(deltaTime);
 * duck.render(ctx, camera);
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
    
    /** Sprite image for running animation */
    private runningSprite: HTMLImageElement;
    
    /** Sprite image for jumping animation */
    private jumpingSprite: HTMLImageElement;
    
    /** Sprite image for idle animation */
    private idleSprite: HTMLImageElement;
    
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
    
    /** Whether the running sprite has finished loading */
    private runningLoaded: boolean = false;
    
    /** Whether the jumping sprite has finished loading */
    private jumpingLoaded: boolean = false;
    
    /** Whether the idle sprite has finished loading */
    private idleLoaded: boolean = false;
    
    /** Current animation type (ANIM_WALK, ANIM_RUN, ANIM_JUMP, or ANIM_IDLE) */
    private currentAnimType: number = ANIM_IDLE;
    
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
        
        // Initialize running sprite
        this.runningSprite = new window.Image();
        this.runningSprite.src = duckRunningSprite;
        this.runningSprite.onload = () => {
            console.log('Running sprite loaded:', this.runningSprite.width, this.runningSprite.height);
            this.runningLoaded = true;
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
        
        // Initialize idle sprite
        this.idleSprite = new window.Image();
        this.idleSprite.src = duckIdleSprite;
        this.idleSprite.onload = () => {
            console.log('Idle sprite loaded:', this.idleSprite.width, this.idleSprite.height);
            this.idleLoaded = true;
            this.initializeAnimation();
        };
        
        // Start with idle sprite
        this.currentSprite = this.idleSprite;
    }
    
    /**
     * Initializes the animation system once sprites are loaded.
     * Sets up the idle animation as the default state.
     * 
     * @private
     */
    private initializeAnimation(): void {
        if (this.idleLoaded && this.currentAnimType === ANIM_IDLE) {
            this.animation = new Animation(
                this.idleSprite,
                this.frameWidth,
                this.frameHeight,
                0, // row 0 for idle
                5, // 5 frames for idle
                FRAME_DURATION_IDLE
            );
        }
    }
    
    /**
     * Switches between different animation types (walking/running/jumping).
     * Updates the current sprite and creates a new Animation instance with appropriate settings.
     * 
     * @param newAnimType - The animation type to switch to (ANIM_WALK, ANIM_RUN, or ANIM_JUMP)
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
        } else if (newAnimType === ANIM_RUN && this.runningLoaded) {
            this.currentSprite = this.runningSprite;
            this.animation = new Animation(
                this.runningSprite,
                this.frameWidth,
                this.frameHeight,
                0, // row 0
                4, // 4 frames
                FRAME_DURATION_RUN
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
        } else if (newAnimType === ANIM_IDLE && this.idleLoaded) {
            this.currentSprite = this.idleSprite;
            this.animation = new Animation(
                this.idleSprite,
                this.frameWidth,
                this.frameHeight,
                0, // row 0
                5, // 5 frames
                FRAME_DURATION_IDLE
            );
        }
    }

    /**
     * Updates the duck's state including physics, input handling, and animation.
     * Called once per frame by the game loop.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @param ground - Ground system for collision detection (optional)
     */
    public update(deltaTime: number, ground?: any): void {
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

        // Ground collision - use Ground system if provided, otherwise fallback
        if (ground) {
            // Check if duck's bottom edge touches or goes below ground
            const duckBottom = this.y + this.frameHeight / 2;
            if (duckBottom >= ground.getGroundLevel()) {
                this.y = ground.getGroundLevel() - this.frameHeight / 2;
                this.velocityY = 0;
                this.isJumping = false;
            }
        } else {
            // Fallback ground collision for backward compatibility
            const duckBottom = this.y + this.frameHeight / 2;
            if (duckBottom >= 850) {
                this.y = 850 - this.frameHeight / 2;
                this.velocityY = 0;
                this.isJumping = false;
            }
        }

        // Animation switching
        if (this.animation) {
            let newAnimType = ANIM_IDLE;
            
            if (this.isJumping) {
                newAnimType = ANIM_JUMP;
            } else if (moving) {
                // Choose between walking and running based on shift key
                newAnimType = running ? ANIM_RUN : ANIM_WALK;
            } else {
                // Not moving and not jumping = idle
                newAnimType = ANIM_IDLE;
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
            } else if (moving || this.currentAnimType === ANIM_IDLE) {
                // Normal walking, running, or idle animation
                this.animation.update(deltaTime);
            }
        }
    }

    /**
     * Renders the duck sprite to the canvas with proper camera transformation.
     * 
     * @param ctx - The 2D rendering context of the canvas
     * @param camera - Camera for coordinate transformation (optional)
     */
    public render(ctx: CanvasRenderingContext2D, camera?: any): void {
        if (this.animation && this.frameWidth && this.frameHeight && this.currentSprite) {
            // Calculate screen position
            let screenX = this.x;
            let screenY = this.y;
            
            if (camera) {
                screenX = camera.worldToScreenX(this.x);
                screenY = camera.worldToScreenY(this.y);
            }

            // Draw debug bounding box if enabled
            if (DebugConfig.showBoundingBoxes) {
                ctx.save();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    screenX - this.frameWidth / 2,
                    screenY - this.frameHeight / 2,
                    this.frameWidth,
                    this.frameHeight
                );
                ctx.restore();
            }

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
                } else if (this.currentAnimType === ANIM_RUN) {
                    // Running animation frames - 4 frames, each 76x90 pixels
                    const runFrameData = [
                        { x: 0, y: 0, width: 76, height: 90 },      // frame 0
                        { x: 76, y: 0, width: 76, height: 90 },     // frame 1
                        { x: 152, y: 0, width: 76, height: 90 },    // frame 2
                        { x: 228, y: 0, width: 76, height: 90 },    // frame 3
                    ];
                    
                    if (frame < runFrameData.length) {
                        const frameData = runFrameData[frame];
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
                    
                    // Ensure frame is within valid range
                    const clampedFrame = Math.max(0, Math.min(frame, jumpFrameData.length - 1));
                    if (clampedFrame < jumpFrameData.length) {
                        const frameData = jumpFrameData[clampedFrame];
                        sx = frameData.x;
                        sy = frameData.y;
                        sw = frameData.width;
                        sh = frameData.height;
                    }
                    
                    // Debug logging to track what's happening
                    if (frame !== clampedFrame) {
                        console.log(`Jump frame clamped: ${frame} -> ${clampedFrame}, max: ${jumpFrameData.length - 1}`);
                    }
                } else if (this.currentAnimType === ANIM_IDLE) {
                    // Idle animation frames - 5 frames, each 76x90 pixels
                    const idleFrameData = [
                        { x: 0, y: 0, width: 76, height: 90 },      // frame 0
                        { x: 76, y: 0, width: 76, height: 90 },     // frame 1
                        { x: 152, y: 0, width: 76, height: 90 },    // frame 2
                        { x: 228, y: 0, width: 76, height: 90 },    // frame 3
                        { x: 304, y: 0, width: 76, height: 90 },    // frame 4
                    ];
                    
                    if (frame < idleFrameData.length) {
                        const frameData = idleFrameData[frame];
                        sx = frameData.x;
                        sy = frameData.y;
                        sw = frameData.width;
                        sh = frameData.height;
                    }
                }
            }

            // Draw just the duck artwork at a reasonable scale
            const drawScale = 1;
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
                    -(screenX + drawWidth / 2),  // Flip the x position
                    screenY - drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            } else {
                ctx.drawImage(
                    this.currentSprite,
                    sx, sy, sw, sh,
                    screenX - drawWidth / 2,
                    screenY - drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            }
            
            // Restore the canvas state
            ctx.restore();
        } else {
            // Draw placeholder while loading
            let screenX = this.x;
            let screenY = this.y;
            
            if (camera) {
                screenX = camera.worldToScreenX(this.x);
                screenY = camera.worldToScreenY(this.y);
            }
            
            ctx.fillStyle = 'white';
            ctx.fillRect(screenX, screenY, 50, 50);
        }
    }

    /**
     * Gets the current X position in world coordinates.
     * 
     * @returns Current X position
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Gets the current Y position in world coordinates.
     * 
     * @returns Current Y position
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Gets the width of the duck sprite.
     * 
     * @returns Duck width in pixels
     */
    public getWidth(): number {
        return this.frameWidth;
    }

    /**
     * Gets the height of the duck sprite.
     * 
     * @returns Duck height in pixels
     */
    public getHeight(): number {
        return this.frameHeight;
    }

    /**
     * Sets the duck's position in world coordinates.
     * 
     * @param x - New X position
     * @param y - New Y position
     */
    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
} 