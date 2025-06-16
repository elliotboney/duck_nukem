import groundSprite from '../../assets/images/ground.png';

/**
 * Ground system for managing terrain collision and ground level calculations.
 * Provides proper ground collision detection and visual rendering using sprite assets.
 * 
 * Features:
 * - Configurable ground level
 * - Ground collision detection
 * - Sprite-based ground rendering with infinite tiling
 * - Future support for terrain variations and slopes
 * 
 * @example
 * ```typescript
 * const ground = new Ground(550); // Ground level at Y=550
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
    
    /** Ground sprite image */
    private groundSprite: HTMLImageElement = new window.Image();
    
    /** Whether the ground sprite has loaded */
    private groundLoaded: boolean = false;
    
    /** Default ground height if sprite not loaded */
    private fallbackGroundHeight: number = 60;
    
    /** Color of the ground for fallback rendering */
    private groundColor: string = '#8B4513'; // Brown color
    
    /** Grass color for fallback rendering */
    private grassColor: string = '#228B22'; // Forest green
    
    /** Height of the grass layer for fallback */
    private grassHeight: number = 20;

    /**
     * Creates a new Ground instance.
     * 
     * @param groundLevel - Y coordinate of the ground surface in world space
     */
    constructor(groundLevel: number) {
        this.groundLevel = groundLevel;
        this.loadSprite();
    }

    /**
     * Loads the ground sprite image.
     * 
     * @private
     */
    private loadSprite(): void {
        this.groundSprite.src = groundSprite;
        this.groundSprite.onload = () => {
            console.log('Ground sprite loaded:', this.groundSprite.width, this.groundSprite.height);
            this.groundLoaded = true;
        };
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
     * Gets the ground level Y coordinate where entities should stand.
     * For sprite ground, this accounts for grass layer thickness so entities stand on dirt.
     * 
     * @returns Ground level Y coordinate in world space (dirt surface, not grass top)
     */
    public getGroundLevel(): number {
        // If using ground sprite, adjust for grass layer so duck stands on brown dirt
        if (this.groundLoaded) {
            // Assuming the ground sprite has ~8-10px of grass on top, position duck on dirt below
            return this.groundLevel + 17;
        }
        // For fallback rendering, use base ground level
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
     * Renders the ground to the canvas with proper camera transformation and infinite tiling.
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
            if (this.groundLoaded && this.groundSprite) {
                this.renderGroundSprite(ctx, camera, canvasWidth, canvasHeight, groundScreenY);
            } else {
                this.renderFallbackGround(ctx, canvasWidth, canvasHeight, groundScreenY);
            }
        }
    }

    /**
     * Renders the ground sprite with infinite horizontal tiling.
     * 
     * @param ctx - Canvas rendering context
     * @param camera - Camera for coordinate transformation
     * @param canvasWidth - Width of the canvas viewport
     * @param canvasHeight - Height of the canvas viewport
     * @param groundScreenY - Ground Y position in screen coordinates
     * @private
     */
    private renderGroundSprite(
        ctx: CanvasRenderingContext2D,
        camera: any,
        canvasWidth: number,
        canvasHeight: number,
        groundScreenY: number
    ): void {
        const textureWidth = this.groundSprite.width;
        const textureHeight = this.groundSprite.height;
        
        // Calculate tiling offset based on camera position (1x speed - moves with camera)
        const cameraOffset = camera.getX();
        const wrappedOffset = cameraOffset % textureWidth;
        const startX = -wrappedOffset - textureWidth;
        
        // Calculate how much of the ground texture to show - always fill to bottom of screen
        const availableHeight = canvasHeight - groundScreenY;
        const renderHeight = Math.max(textureHeight, availableHeight);
        
        // Tile ground sprites across the screen width with slight overlap to prevent seams
        const tileOverlap = 2; // 2 pixel overlap to hide seams
        const tileSpacing = textureWidth - tileOverlap;
        
        for (let x = startX; x <= canvasWidth + textureWidth; x += tileSpacing) {
            ctx.drawImage(
                this.groundSprite,
                0, 0, textureWidth, textureHeight, // Source: full texture
                x, groundScreenY, textureWidth, renderHeight // Destination: stretch to fill available height
            );
        }
    }

    /**
     * Renders fallback ground using simple colored rectangles.
     * 
     * @param ctx - Canvas rendering context
     * @param canvasWidth - Width of the canvas viewport
     * @param canvasHeight - Height of the canvas viewport
     * @param groundScreenY - Ground Y position in screen coordinates
     * @private
     */
    private renderFallbackGround(
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number,
        groundScreenY: number
    ): void {
        // Render ground (soil) - fixed height
        ctx.fillStyle = this.groundColor;
        ctx.fillRect(
            0, 
            groundScreenY, 
            canvasWidth, 
            this.fallbackGroundHeight
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
     * Sets the visual appearance of the fallback ground.
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

    /**
     * Gets the loaded ground sprite for external access.
     * 
     * @returns The ground sprite image or null if not loaded
     */
    public getGroundSprite(): HTMLImageElement | null {
        return this.groundLoaded ? this.groundSprite : null;
    }

    /**
     * Checks if the ground sprite has finished loading.
     * 
     * @returns True if the ground sprite is loaded and ready
     */
    public isGroundSpriteLoaded(): boolean {
        return this.groundLoaded;
    }
} 