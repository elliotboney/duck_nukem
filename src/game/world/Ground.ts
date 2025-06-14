/**
 * Ground system for managing terrain collision and ground level calculations.
 * Provides proper ground collision detection and supports future terrain variations.
 * 
 * Features:
 * - Configurable ground level
 * - Ground collision detection
 * - Future support for terrain variations and slopes
 * - Visual ground rendering
 * 
 * @example
 * ```typescript
 * const ground = new Ground(500); // Ground level at Y=500
 * 
 * // Check collision
 * if (ground.isOnGround(duck.getY(), duck.getHeight())) {
 *   duck.land(ground.getGroundLevel());
 * }
 * ```
 */
export class Ground {
    /** Y coordinate of the ground level in world space */
    private groundLevel: number;
    
    /** Height of the ground/terrain visual representation */
    private groundHeight: number = 60;
    
    /** Color of the ground for rendering */
    private groundColor: string = '#8B4513'; // Brown color
    
    /** Grass color for the top of the ground */
    private grassColor: string = '#228B22'; // Forest green
    
    /** Height of the grass layer */
    private grassHeight: number = 10;

    /**
     * Creates a new Ground instance.
     * 
     * @param groundLevel - Y coordinate of the ground surface in world space
     */
    constructor(groundLevel: number) {
        this.groundLevel = groundLevel;
    }

    /**
     * Checks if an entity is on or below the ground level.
     * 
     * @param entityY - Y position of the entity's bottom edge
     * @param entityHeight - Height of the entity (optional, defaults to 0)
     * @returns True if the entity is on or below ground level
     */
    public isOnGround(entityY: number, entityHeight: number = 0): boolean {
        return entityY + entityHeight >= this.groundLevel;
    }

    /**
     * Gets the ground level Y coordinate.
     * 
     * @returns Ground level Y coordinate in world space
     */
    public getGroundLevel(): number {
        return this.groundLevel;
    }

    /**
     * Sets a new ground level.
     * 
     * @param level - New ground level Y coordinate
     */
    public setGroundLevel(level: number): void {
        this.groundLevel = level;
    }

    /**
     * Gets the ground level for a specific X position.
     * Currently returns flat ground, but can be extended for terrain variations.
     * 
     * @param x - X position in world coordinates
     * @returns Ground level Y coordinate at the given X position
     */
    public getGroundLevelAt(x: number): number {
        // Currently flat ground - can be extended for hills, slopes, etc.
        return this.groundLevel;
    }

    /**
     * Renders the ground to the canvas with proper camera transformation.
     * 
     * @param ctx - Canvas rendering context
     * @param camera - Camera for coordinate transformation
     * @param canvasWidth - Width of the canvas viewport
     * @param canvasHeight - Height of the canvas viewport
     */
    public render(ctx: CanvasRenderingContext2D, camera: any, canvasWidth: number, canvasHeight: number): void {
        // Calculate screen coordinates for ground
        const groundScreenY = camera.worldToScreenY(this.groundLevel);
        
        // Only render if ground is visible on screen
        if (groundScreenY < canvasHeight) {
            // Render ground (soil) - fixed height, not filling entire screen
            ctx.fillStyle = this.groundColor;
            ctx.fillRect(
                0, 
                groundScreenY, 
                canvasWidth, 
                this.groundHeight
            );
            
            // Render grass layer on top
            ctx.fillStyle = this.grassColor;
            ctx.fillRect(
                0, 
                groundScreenY - this.grassHeight, 
                canvasWidth, 
                this.grassHeight
            );
        }
    }

    /**
     * Corrects an entity's position if it's below ground level.
     * Returns the corrected Y position.
     * 
     * @param entityY - Current Y position of entity's bottom edge
     * @param entityHeight - Height of the entity
     * @returns Corrected Y position (top-left of entity)
     */
    public correctPosition(entityY: number, entityHeight: number = 0): number {
        if (this.isOnGround(entityY, entityHeight)) {
            return this.groundLevel - entityHeight;
        }
        return entityY;
    }

    /**
     * Sets the visual appearance of the ground.
     * 
     * @param groundColor - Color of the soil/ground
     * @param grassColor - Color of the grass layer
     * @param grassHeight - Height of the grass layer in pixels
     */
    public setAppearance(groundColor: string, grassColor: string, grassHeight: number): void {
        this.groundColor = groundColor;
        this.grassColor = grassColor;
        this.grassHeight = grassHeight;
    }
} 