/**
 * Animation class for managing sprite sheet animations.
 * Handles frame cycling, timing, and rendering for sprite-based animations.
 * 
 * Supports:
 * - Multi-row sprite sheets
 * - Configurable frame duration and looping
 * - Frame-by-frame progression with delta time
 * - Row switching for different animation states
 * 
 * @example
 * ```typescript
 * const animation = new Animation(
 *   spriteImage,
 *   76,    // frame width
 *   90,    // frame height
 *   0,     // row index
 *   7,     // frame count
 *   60,    // frame duration in ms
 *   true   // loop
 * );
 * 
 * // In game loop
 * animation.update(deltaTime);
 * animation.draw(ctx, x, y);
 * ```
 */
export class Animation {
    /** The sprite sheet image containing animation frames */
    private image: HTMLImageElement;
    
    /** Width of each animation frame in pixels */
    private frameWidth: number;
    
    /** Height of each animation frame in pixels */
    private frameHeight: number;
    
    /** Current row index in the sprite sheet */
    private row: number;
    
    /** Total number of frames in the current animation */
    private frameCount: number;
    
    /** Duration of each frame in milliseconds */
    private frameDuration: number;
    
    /** Accumulated time since last frame change */
    private elapsedTime: number = 0;
    
    /** Current frame index (0-based) */
    private currentFrame: number = 0;
    
    /** Whether the animation should loop when reaching the end */
    private loop: boolean;

    /**
     * Creates a new Animation instance.
     * 
     * @param image - The sprite sheet image containing animation frames
     * @param frameWidth - Width of each frame in pixels
     * @param frameHeight - Height of each frame in pixels
     * @param row - Row index in the sprite sheet (0-based)
     * @param frameCount - Total number of frames in the animation
     * @param frameDuration - Duration of each frame in milliseconds (default: 100)
     * @param loop - Whether the animation should loop (default: true)
     */
    constructor(
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number,
        row: number,
        frameCount: number,
        frameDuration: number = 100,
        loop: boolean = true
    ) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.row = row;
        this.frameCount = frameCount;
        this.frameDuration = frameDuration;
        this.loop = loop;
    }

    /**
     * Updates the animation by advancing frames based on elapsed time.
     * Should be called once per frame in the game loop.
     * 
     * @param deltaTime - Time elapsed since last update in milliseconds
     */
    public update(deltaTime: number): void {
        this.elapsedTime += deltaTime;
        if (this.elapsedTime > this.frameDuration) {
            this.elapsedTime = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.frameCount) {
                this.currentFrame = this.loop ? 0 : this.frameCount - 1;
            }
        }
    }

    /**
     * Draws the current animation frame to the canvas.
     * 
     * @param ctx - The 2D rendering context of the canvas
     * @param x - X position to draw the frame
     * @param y - Y position to draw the frame
     * @param scale - Scale factor for rendering (default: 1)
     */
    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1): void {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth,
            this.row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            x,
            y,
            this.frameWidth * scale,
            this.frameHeight * scale
        );
    }

    /**
     * Changes the current row in the sprite sheet and resets the animation.
     * Useful for switching between different animation states within the same sprite sheet.
     * 
     * @param row - The new row index to switch to (0-based)
     */
    public setRow(row: number): void {
        if (this.row !== row) {
            this.row = row;
            this.currentFrame = 0;
            this.elapsedTime = 0;
        }
    }

    /**
     * Resets the animation to the first frame and clears elapsed time.
     * Useful for restarting animations or setting idle states.
     */
    public reset(): void {
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }
} 