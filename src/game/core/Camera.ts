/**
 * Camera system for handling world-to-screen coordinate transformations and following entities.
 * Provides smooth camera movement and coordinate space conversion for scrolling gameplay.
 * 
 * Features:
 * - Smooth camera following with configurable lag
 * - World coordinate to screen coordinate transformation
 * - Camera bounds and constraints
 * - Viewport management for rendering optimization
 * 
 * @example
 * ```typescript
 * const camera = new Camera(canvasWidth, canvasHeight);
 * camera.followTarget(duck.getX(), duck.getY());
 * 
 * // In render loop
 * camera.update(deltaTime);
 * const screenX = camera.worldToScreenX(worldX);
 * const screenY = camera.worldToScreenY(worldY);
 * ```
 */
export class Camera {
    /** Current camera X position in world coordinates */
    private x: number = 0;
    
    /** Current camera Y position in world coordinates */
    private y: number = 0;
    
    /** Target X position for smooth following */
    private targetX: number = 0;
    
    /** Target Y position for smooth following */
    private targetY: number = 0;
    
    /** Width of the camera viewport (canvas width) */
    private viewportWidth: number;
    
    /** Height of the camera viewport (canvas height) */
    private viewportHeight: number;
    
    /** Camera smoothing factor (0 = instant, 1 = never catch up) */
    private smoothing: number = 0.1;
    
    /** Minimum world X boundary for camera movement */
    private minX: number = 0;
    
    /** Maximum world X boundary for camera movement */
    private maxX: number = 2000; // Default world width
    
    /** Fixed Y position for side-scrolling (ground level focus) */
    private fixedY: number = 300;
    
    /** Whether camera should follow Y axis or stay fixed */
    private followY: boolean = false;

    /**
     * Creates a new Camera instance.
     * 
     * @param viewportWidth - Width of the camera viewport (canvas width)
     * @param viewportHeight - Height of the camera viewport (canvas height)
     */
    constructor(viewportWidth: number, viewportHeight: number) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.y = this.fixedY;
        this.targetY = this.fixedY;
    }

    /**
     * Sets the target position for the camera to follow.
     * The camera will smoothly move towards this position.
     * 
     * @param x - Target X position in world coordinates
     * @param y - Target Y position in world coordinates (only used if followY is enabled)
     */
    public followTarget(x: number, y: number): void {
        this.targetX = x - this.viewportWidth / 2; // Center on target
        
        if (this.followY) {
            this.targetY = y - this.viewportHeight / 2;
        }
        
        // Apply camera bounds
        this.targetX = Math.max(this.minX, Math.min(this.targetX, this.maxX - this.viewportWidth));
    }

    /**
     * Updates camera position with smooth following behavior.
     * Should be called once per frame in the game loop.
     * 
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    public update(deltaTime: number): void {
        // Smooth camera movement using lerp
        const factor = 1 - Math.pow(this.smoothing, deltaTime / 16.67); // Normalize to 60fps
        
        this.x += (this.targetX - this.x) * factor;
        
        if (this.followY) {
            this.y += (this.targetY - this.y) * factor;
        }
    }

    /**
     * Converts world X coordinate to screen X coordinate.
     * 
     * @param worldX - X position in world coordinates
     * @returns X position in screen coordinates
     */
    public worldToScreenX(worldX: number): number {
        return worldX - this.x;
    }

    /**
     * Converts world Y coordinate to screen Y coordinate.
     * 
     * @param worldY - Y position in world coordinates
     * @returns Y position in screen coordinates
     */
    public worldToScreenY(worldY: number): number {
        return worldY - this.y;
    }

    /**
     * Converts screen X coordinate to world X coordinate.
     * 
     * @param screenX - X position in screen coordinates
     * @returns X position in world coordinates
     */
    public screenToWorldX(screenX: number): number {
        return screenX + this.x;
    }

    /**
     * Converts screen Y coordinate to world Y coordinate.
     * 
     * @param screenY - Y position in screen coordinates
     * @returns Y position in world coordinates
     */
    public screenToWorldY(screenY: number): number {
        return screenY + this.y;
    }

    /**
     * Gets the current camera X position in world coordinates.
     * 
     * @returns Current camera X position
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Gets the current camera Y position in world coordinates.
     * 
     * @returns Current camera Y position
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Sets the world boundaries for camera movement.
     * 
     * @param minX - Minimum X boundary
     * @param maxX - Maximum X boundary
     */
    public setBounds(minX: number, maxX: number): void {
        this.minX = minX;
        this.maxX = maxX;
    }

    /**
     * Enables or disables Y-axis following.
     * When disabled, camera stays at fixed Y position for side-scrolling.
     * 
     * @param follow - Whether to follow Y axis
     */
    public setFollowY(follow: boolean): void {
        this.followY = follow;
        if (!follow) {
            this.y = this.fixedY;
            this.targetY = this.fixedY;
        }
    }

    /**
     * Sets the camera smoothing factor.
     * 
     * @param smoothing - Smoothing factor between 0 (instant) and 1 (never catch up)
     */
    public setSmoothing(smoothing: number): void {
        this.smoothing = Math.max(0, Math.min(1, smoothing));
    }
} 