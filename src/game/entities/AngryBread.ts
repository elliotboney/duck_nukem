import angryBreadWalkingSprite from '../../assets/images/angry_bread_walking.png';
import { DebugConfig } from '../core/DebugConfig';
import type { Ground } from '../world/Ground';

/**
 * Animation state constants for angry bread enemies.
 */
const ANIM_BREAD_WALK = 0;

/**
 * AngryBread enemy class representing hostile bread loaves that walk and patrol areas.
 * Features walking animation, directional movement, ground collision, and sprite mirroring.
 * 
 * Features:
 * - Walking animation with sprite sheet support
 * - Horizontal sprite mirroring for direction changes
 * - Ground collision detection and physics
 * - Patrol movement patterns
 * - Debug bounding box rendering
 * - Camera-aware coordinate transformation
 * 
 * @example
 * ```typescript
 * const bread = new AngryBread(500, 800, 100); // x, y, patrol distance
 * bread.update(deltaTime, ground);
 * bread.render(ctx, camera);
 * ```
 */
export class AngryBread {
    /** Current X position in world coordinates */
    private x: number;
    
    /** Current Y position in world coordinates */
    private y: number;
    
    /** Horizontal velocity in pixels per second */
    private velocityX: number = 50; // 50 pixels/second walking speed
    
    /** Vertical velocity in pixels per second (for gravity/jumping) */
    private velocityY: number = 0;
    
    /** Whether the bread is facing left (true) or right (false) */
    private facingLeft: boolean = false;
    
    /** Starting X position for patrol behavior */
    private startX: number;
    
    /** Maximum distance to patrol from start position */
    private patrolDistance: number;
    
    /** Walking animation sprite */
    private walkingSprite: HTMLImageElement = new window.Image();
    
    /** Whether the walking sprite has loaded */
    private walkingSpriteLoaded: boolean = false;
    
    /** Current animation frame */
    private currentFrame: number = 0;
    
    /** Time accumulator for animation timing */
    private animationTime: number = 0;
    
    /** Duration of each animation frame in milliseconds */
    private frameDuration: number = 100; // 100ms per frame (10 fps)
    
    /** Width of each animation frame in pixels */
    private frameWidth: number = 32; // Bread sprite is smaller than duck
    
    /** Height of each animation frame in pixels */
    private frameHeight: number = 32; // Bread sprite is smaller than duck
    
    /** Number of frames in the walking animation */
    private walkFrameCount: number = 5; // Bread has 5 animation frames
    
    /** Scale factor for rendering (makes bread slightly bigger than duck) */
    private scale: number = 0.3; // 80% of current size for better proportion
    
    /** Current animation type */
    private currentAnimType: number = ANIM_BREAD_WALK;
    
    /** Gravity acceleration in pixels per second squared */
    private gravity: number = 2000;
    
    /** Whether the bread is currently on the ground */
    private isOnGround: boolean = false;

    /**
     * Creates a new AngryBread enemy instance.
     * 
     * @param x - Initial X position in world coordinates
     * @param y - Initial Y position in world coordinates  
     * @param patrolDistance - Maximum distance to patrol from starting position (default: 200)
     */
    constructor(x: number, y: number, patrolDistance: number = 200) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.patrolDistance = patrolDistance;
        
        this.loadSprites();
    }

    /**
     * Loads sprite images for the angry bread enemy.
     * 
     * @private
     */
    private loadSprites(): void {
        this.walkingSprite = new window.Image();
        this.walkingSprite.src = angryBreadWalkingSprite;
        this.walkingSprite.onload = () => {
            console.log('Angry bread walking sprite loaded:', this.walkingSprite.width, this.walkingSprite.height);
            this.walkingSpriteLoaded = true;
            
            // Verify frame dimensions and count
            const detectedFrameWidth = this.walkingSprite.width / this.walkFrameCount;
            const detectedFrameHeight = this.walkingSprite.height;
            
            console.log(`Bread sprite analysis:`);
            console.log(`- Total size: ${this.walkingSprite.width}x${this.walkingSprite.height}`);
            console.log(`- Expected frames: ${this.walkFrameCount}`);
            console.log(`- Calculated frame size: ${detectedFrameWidth}x${detectedFrameHeight}`);
            console.log(`- Using frame size: ${this.frameWidth}x${this.frameHeight}`);
            
            // Update frame dimensions based on actual sprite if needed
            if (detectedFrameWidth !== this.frameWidth || detectedFrameHeight !== this.frameHeight) {
                console.log(`Adjusting frame size from ${this.frameWidth}x${this.frameHeight} to ${detectedFrameWidth}x${detectedFrameHeight}`);
                this.frameWidth = detectedFrameWidth;
                this.frameHeight = detectedFrameHeight;
            }
        };
    }

    /**
     * Updates the angry bread enemy state including movement, animation, and physics.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @param ground - Ground system for collision detection
     */
    public update(deltaTime: number, ground: Ground): void {
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update patrol movement
        this.updatePatrolMovement(deltaTime);
        
        // Apply physics
        this.updatePhysics(deltaTime, ground);
    }

    /**
     * Updates the walking animation frame.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @private
     */
    private updateAnimation(deltaTime: number): void {
        this.animationTime += deltaTime;
        
        if (this.animationTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.walkFrameCount;
            this.animationTime = 0;
        }
    }

    /**
     * Updates patrol movement behavior.
     * Bread walks back and forth within patrol distance from starting position.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @private
     */
    private updatePatrolMovement(deltaTime: number): void {
        const deltaSeconds = deltaTime / 1000;
        
        // Check if we need to turn around
        const distanceFromStart = this.x - this.startX;
        
        if (distanceFromStart >= this.patrolDistance) {
            // Reached right boundary, turn left
            this.facingLeft = true;
            this.velocityX = -Math.abs(this.velocityX);
        } else if (distanceFromStart <= -this.patrolDistance) {
            // Reached left boundary, turn right
            this.facingLeft = false;
            this.velocityX = Math.abs(this.velocityX);
        }
        
        // Update position based on velocity
        this.x += this.velocityX * deltaSeconds;
    }

    /**
     * Updates physics including gravity and ground collision.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     * @param ground - Ground system for collision detection
     * @private
     */
    private updatePhysics(deltaTime: number, ground: Ground): void {
        const deltaSeconds = deltaTime / 1000;
        
        // Apply gravity
        this.velocityY += this.gravity * deltaSeconds;
        
        // Update Y position
        this.y += this.velocityY * deltaSeconds;
        
        // Ground collision (use scaled height)
        const scaledHeight = this.frameHeight * this.scale;
        if (ground.isOnGround(this.y, scaledHeight)) {
            this.y = ground.getGroundLevel() - scaledHeight / 2;
            this.velocityY = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
    }

    /**
     * Renders the angry bread enemy to the canvas with proper camera transformation.
     * 
     * @param ctx - The 2D rendering context of the canvas
     * @param camera - Camera for coordinate transformation
     */
    public render(ctx: CanvasRenderingContext2D, camera: any): void {
        if (!this.walkingSpriteLoaded) return;
        
        // Calculate screen position
        const screenX = camera.worldToScreenX(this.x);
        const screenY = camera.worldToScreenY(this.y);
        
        // Calculate scaled dimensions for rendering
        const scaledWidth = this.frameWidth * this.scale;
        const scaledHeight = this.frameHeight * this.scale;
        
        // Only render if visible on screen (with margin)
        if (screenX < -scaledWidth || screenX > camera.viewportWidth + scaledWidth) {
            return;
        }
        
        // Draw debug bounding box if enabled
        if (DebugConfig.showBoundingBoxes) {
            ctx.save();
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                screenX - scaledWidth / 2,
                screenY - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
            ctx.restore();
        }

        // Calculate source coordinates for current frame
        const sourceX = this.currentFrame * this.frameWidth;
        const sourceY = 0; // Assuming single row sprite
        
        // Save canvas state for potential flipping
        ctx.save();
        
        // If facing left, flip the sprite horizontally
        if (this.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.walkingSprite,
                sourceX, sourceY, this.frameWidth, this.frameHeight,
                -(screenX + scaledWidth / 2), // Flip the x position
                screenY - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
        } else {
            ctx.drawImage(
                this.walkingSprite,
                sourceX, sourceY, this.frameWidth, this.frameHeight,
                screenX - scaledWidth / 2,
                screenY - scaledHeight / 2,
                scaledWidth,
                scaledHeight
            );
        }
        
        ctx.restore();
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
     * Gets the enemy's width for collision detection.
     * 
     * @returns Enemy width in pixels (scaled)
     */
    public getWidth(): number {
        return this.frameWidth * this.scale;
    }

    /**
     * Gets the enemy's height for collision detection.
     * 
     * @returns Enemy height in pixels (scaled)
     */
    public getHeight(): number {
        return this.frameHeight * this.scale;
    }

    /**
     * Checks if the enemy is currently facing left.
     * 
     * @returns True if facing left, false if facing right
     */
    public isFacingLeft(): boolean {
        return this.facingLeft;
    }
} 