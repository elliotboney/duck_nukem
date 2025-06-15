import cloudsSprite from '../../assets/images/clouds.png';
import treesSprite from '../../assets/images/trees.png';

/**
 * Background system for managing multiple parallax scrolling layers.
 * Creates depth and visual appeal through layers that scroll at different speeds.
 * 
 * Features:
 * - Multiple background layers with different scroll speeds
 * - Parallax effect for depth perception
 * - Seamless horizontal tiling/repeating with configurable spacing
 * - Sky gradient, clouds, and trees using actual sprites
 * - Trees positioned on ground level as foreground parallax layer
 * - Horizontal offsets to break up repetitive tiling patterns
 * - Configurable layer properties
 * 
 * @example
 * ```typescript
 * const background = new Background();
 * background.addLayer(skyTexture, 0.1, 'sky');
 * background.addLayer(hillsTexture, 0.5, 'hills', '#FFFFFF', 1.0, 100); // 100px offset
 * 
 * // In render loop
 * background.render(ctx, camera, canvasWidth, canvasHeight);
 * ```
 */
export class Background {
    /** Array of background layers, rendered back to front */
    private layers: BackgroundLayer[] = [];
    
    /** Sky gradient colors */
    private skyColorTop: string = '#87CEEB'; // Sky blue
    private skyColorBottom: string = '#E0F6FF'; // Light blue
    
    /** Clouds sprite image */
    private cloudsSprite: HTMLImageElement = new window.Image();
    
    /** Whether the clouds sprite has loaded */
    private cloudsLoaded: boolean = false;
    
    /** Trees sprite image */
    private treesSprite: HTMLImageElement = new window.Image();
    
    /** Whether the trees sprite has loaded */
    private treesLoaded: boolean = false;

    /**
     * Creates a new Background instance and initializes default layers.
     */
    constructor() {
        this.loadSprites();
        this.initializeDefaultLayers();
    }

    /**
     * Loads sprite images for background elements.
     * 
     * @private
     */
    private loadSprites(): void {
        // Load clouds sprite
        this.cloudsSprite = new window.Image();
        this.cloudsSprite.src = cloudsSprite;
        this.cloudsSprite.onload = () => {
            console.log('Clouds sprite loaded:', this.cloudsSprite.width, this.cloudsSprite.height);
            this.cloudsLoaded = true;
        };
        
        // Load trees sprite
        this.treesSprite = new window.Image();
        this.treesSprite.src = treesSprite;
        this.treesSprite.onload = () => {
            console.log('Trees sprite loaded:', this.treesSprite.width, this.treesSprite.height);
            this.treesLoaded = true;
        };
    }

    /**
     * Initializes default background layers (sky gradient and basic elements).
     * 
     * @private
     */
    private initializeDefaultLayers(): void {
        // Add sky gradient layer (no scrolling)
        this.addLayer(null, 0, 'sky', '#87CEEB');
        
        // Add clouds layer with slow parallax speed and offset for natural spacing
        this.addLayer(this.cloudsSprite, 0.2, 'clouds', '#FFFFFF', 1.0, 150);
        
        // Add distant hills
        this.addLayer(null, 0.3, 'hills-distant', '#4A5D23');
        
        // Add near hills/trees
        this.addLayer(null, 0.3, 'hills-near', '#2F4F2F');
        
        // Add trees layer with offset to break up repetition
        this.addLayer(this.treesSprite, 0.4, 'trees', '#228B22', 1.0, 50);
    }

    /**
     * Adds a new background layer.
     * 
     * @param texture - Image texture for the layer (null for procedural layers)
     * @param scrollSpeed - Scroll speed multiplier (0 = static, 1 = same as camera)
     * @param type - Type identifier for the layer
     * @param color - Color for procedural layers
     * @param alpha - Transparency (0-1)
     * @param horizontalOffset - Horizontal offset for tile spacing (default: 0)
     */
    public addLayer(
        texture: HTMLImageElement | null, 
        scrollSpeed: number, 
        type: string, 
        color: string = '#FFFFFF',
        alpha: number = 1,
        horizontalOffset: number = 0
    ): void {
        this.layers.push({
            texture,
            scrollSpeed,
            type,
            color,
            alpha,
            offset: 0,
            horizontalOffset
        });
        
        // Sort layers by scroll speed (back to front)
        this.layers.sort((a, b) => a.scrollSpeed - b.scrollSpeed);
    }

    /**
     * Renders all background layers with parallax scrolling.
     * 
     * @param ctx - Canvas rendering context
     * @param camera - Camera for coordinate transformation
     * @param canvasWidth - Width of the canvas viewport
     * @param canvasHeight - Height of the canvas viewport
     */
    public render(ctx: CanvasRenderingContext2D, camera: any, canvasWidth: number, canvasHeight: number): void {
        // Render each layer
        for (const layer of this.layers) {
            this.renderLayer(ctx, layer, camera, canvasWidth, canvasHeight);
        }
    }

    /**
     * Renders a single background layer.
     * 
     * @param ctx - Canvas rendering context
     * @param layer - Layer to render
     * @param camera - Camera for coordinate transformation
     * @param canvasWidth - Width of the canvas viewport
     * @param canvasHeight - Height of the canvas viewport
     * @private
     */
    private renderLayer(
        ctx: CanvasRenderingContext2D, 
        layer: BackgroundLayer, 
        camera: any, 
        canvasWidth: number, 
        canvasHeight: number
    ): void {
        ctx.save();
        ctx.globalAlpha = layer.alpha;

        // Calculate parallax offset
        const parallaxOffset = camera.getX() * layer.scrollSpeed;

        switch (layer.type) {
            case 'sky':
                this.renderSkyGradient(ctx, canvasWidth, canvasHeight);
                break;
                
            case 'clouds':
                if (this.cloudsLoaded && layer.texture) {
                    this.renderCloudsSprite(ctx, layer.texture, parallaxOffset, canvasWidth, canvasHeight, layer.horizontalOffset);
                }
                break;
                
            case 'hills-distant':
                this.renderHills(ctx, parallaxOffset, canvasWidth, canvasHeight, layer.color, 0.3, 200);
                break;
                
            case 'hills-near':
                this.renderHills(ctx, parallaxOffset, canvasWidth, canvasHeight, layer.color, 0.5, 150);
                break;
                
            case 'trees':
                if (this.treesLoaded && layer.texture) {
                    this.renderTreesSprite(ctx, layer.texture, parallaxOffset, canvasWidth, canvasHeight, camera, layer.horizontalOffset);
                }
                break;
                
            default:
                if (layer.texture) {
                    this.renderTextureLayer(ctx, layer, parallaxOffset, canvasWidth, canvasHeight);
                }
                break;
        }

        ctx.restore();
    }

    /**
     * Renders a sky gradient background.
     * 
     * @param ctx - Canvas rendering context
     * @param width - Canvas width
     * @param height - Canvas height
     * @private
     */
    private renderSkyGradient(ctx: CanvasRenderingContext2D, width: number, height: number): void {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, this.skyColorTop);
        gradient.addColorStop(1, this.skyColorBottom);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Renders the clouds sprite with tiling and parallax scrolling.
     * 
     * @param ctx - Canvas rendering context
     * @param cloudsTexture - Clouds sprite image
     * @param offset - Parallax offset
     * @param width - Canvas width
     * @param height - Canvas height
     * @param horizontalOffset - Horizontal offset for tile spacing
     * @private
     */
    private renderCloudsSprite(
        ctx: CanvasRenderingContext2D, 
        cloudsTexture: HTMLImageElement,
        offset: number, 
        width: number, 
        height: number,
        horizontalOffset: number = 0
    ): void {
        const textureWidth = cloudsTexture.width;
        const textureHeight = cloudsTexture.height;
        
        // Scale clouds 2x larger
        const scale = 2.0;
        const scaledWidth = textureWidth * scale;
        const scaledHeight = textureHeight * scale;
        
        // Calculate seamless horizontal tiling offset using scaled width
        const wrappedOffset = offset % scaledWidth;
        // Apply horizontal offset after modulo to preserve the full offset value
        const startX = -wrappedOffset - scaledWidth + horizontalOffset;
        
        // Position clouds in the upper portion of the screen, using scaled dimensions
        const cloudsY = height * 0.05; // 5% from top
        
        // Tile clouds across the entire screen width with spacing between tiles
        const tileSpacing = scaledWidth + horizontalOffset; // Add spacing between tiles
        for (let x = startX; x <= width + tileSpacing; x += tileSpacing) {
            ctx.drawImage(
                cloudsTexture,
                x,
                cloudsY,
                scaledWidth,
                scaledHeight  // Use scaled dimensions
            );
        }
    }

    /**
     * Renders procedural hills silhouettes.
     * 
     * @param ctx - Canvas rendering context
     * @param offset - Parallax offset
     * @param width - Canvas width
     * @param height - Canvas height
     * @param color - Hill color
     * @param heightRatio - Hills height as ratio of canvas height
     * @param baseY - Base Y position from bottom
     * @private
     */
    private renderHills(
        ctx: CanvasRenderingContext2D, 
        offset: number, 
        width: number, 
        height: number,
        color: string,
        heightRatio: number,
        baseY: number
    ): void {
        ctx.fillStyle = color;
        
        const hillHeight = height * heightRatio;
        const groundY = height - baseY;
        
        ctx.beginPath();
        ctx.moveTo(-offset, groundY);
        
        // Create rolling hills using sine waves
        for (let x = 0; x <= width + Math.abs(offset) + 100; x += 10) {
            const waveY = groundY - hillHeight * (
                Math.sin((x - offset) * 0.01) * 0.5 + 
                Math.sin((x - offset) * 0.02) * 0.3 + 
                Math.sin((x - offset) * 0.005) * 0.7
            );
            ctx.lineTo(x - offset, waveY);
        }
        
        ctx.lineTo(width + 100, height);
        ctx.lineTo(-offset, height);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Renders the trees sprite positioned on top of the ground with parallax scrolling.
     * 
     * @param ctx - Canvas rendering context
     * @param treesTexture - Trees sprite image
     * @param offset - Parallax offset
     * @param width - Canvas width
     * @param height - Canvas height
     * @param camera - Camera for ground level calculation
     * @param horizontalOffset - Horizontal offset for tile spacing
     * @private
     */
    private renderTreesSprite(
        ctx: CanvasRenderingContext2D, 
        treesTexture: HTMLImageElement,
        offset: number, 
        width: number, 
        height: number,
        camera: any,
        horizontalOffset: number = 0
    ): void {
        const textureWidth = treesTexture.width;
        const textureHeight = treesTexture.height;
        
        // Scale trees 1.5x larger
        const scale = 1.5;
        const scaledWidth = textureWidth * scale;
        const scaledHeight = textureHeight * scale;
        
        // Calculate seamless horizontal tiling offset using scaled width
        const wrappedOffset = offset % scaledWidth;
        // Apply horizontal offset after modulo to preserve the full offset value
        const startX = -wrappedOffset - scaledWidth + horizontalOffset;
        
        // Position trees on the ground level (world Y 820, adjusted to screen coordinates)
        // Ground is at world Y 820, trees should sit on dirt surface accounting for grass layer
        const groundWorldY = 820; // Ground level in world coordinates
        const groundScreenY = camera.worldToScreenY(groundWorldY);
        const treesY = groundScreenY - scaledHeight + 15; // Trees sit on dirt surface, accounting for 15px grass layer
        
        // Only render if trees are visible on screen
        if (treesY < height && treesY + scaledHeight > 0) {
            // Tile trees across the entire screen width with spacing between tiles
            const tileSpacing = scaledWidth + horizontalOffset; // Add spacing between tiles
            for (let x = startX; x <= width + tileSpacing; x += tileSpacing) {
                ctx.drawImage(
                    treesTexture,
                    x,
                    treesY,
                    scaledWidth,
                    scaledHeight
                );
            }
        }
    }

    /**
     * Renders a texture-based layer with tiling.
     * 
     * @param ctx - Canvas rendering context
     * @param layer - Layer with texture
     * @param offset - Parallax offset
     * @param width - Canvas width
     * @param height - Canvas height
     * @private
     */
    private renderTextureLayer(
        ctx: CanvasRenderingContext2D, 
        layer: BackgroundLayer, 
        offset: number, 
        width: number, 
        height: number
    ): void {
        if (!layer.texture) return;
        
        const textureWidth = layer.texture.width;
        const startX = -((offset % textureWidth + textureWidth) % textureWidth);
        
        for (let x = startX; x < width + textureWidth; x += textureWidth) {
            ctx.drawImage(layer.texture, x, 0, textureWidth, height);
        }
    }

    /**
     * Sets the sky gradient colors.
     * 
     * @param topColor - Color at the top of the sky
     * @param bottomColor - Color at the bottom of the sky
     */
    public setSkyColors(topColor: string, bottomColor: string): void {
        this.skyColorTop = topColor;
        this.skyColorBottom = bottomColor;
    }
}

/**
 * Interface for background layer properties.
 */
interface BackgroundLayer {
    /** Texture image for the layer */
    texture: HTMLImageElement | null;
    
    /** Parallax scroll speed multiplier */
    scrollSpeed: number;
    
    /** Layer type identifier */
    type: string;
    
    /** Color for procedural layers */
    color: string;
    
    /** Layer transparency (0-1) */
    alpha: number;
    
    /** Current offset for animation */
    offset: number;
    
    /** Horizontal offset for tile spacing */
    horizontalOffset: number;
} 