/**
 * Background system for managing multiple parallax scrolling layers.
 * Creates depth and visual appeal through layers that scroll at different speeds.
 * 
 * Features:
 * - Multiple background layers with different scroll speeds
 * - Parallax effect for depth perception
 * - Seamless horizontal tiling/repeating
 * - Sky gradient and cloud layers
 * - Configurable layer properties
 * 
 * @example
 * ```typescript
 * const background = new Background();
 * background.addLayer(skyTexture, 0.1, 'sky');
 * background.addLayer(hillsTexture, 0.5, 'hills');
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

    /**
     * Creates a new Background instance and initializes default layers.
     */
    constructor() {
        this.initializeDefaultLayers();
    }

    /**
     * Initializes default background layers (sky gradient and basic elements).
     * 
     * @private
     */
    private initializeDefaultLayers(): void {
        // Add sky gradient layer (no scrolling)
        this.addLayer(null, 0, 'sky', '#87CEEB');
        
        // Add cloud layers with different speeds
        this.addLayer(null, 0.1, 'clouds-far', '#FFFFFF', 0.7);
        this.addLayer(null, 0.3, 'clouds-near', '#FFFFFF', 0.5);
        
        // Add distant hills
        this.addLayer(null, 0.6, 'hills-distant', '#4A5D23');
        
        // Add near hills/trees
        this.addLayer(null, 0.8, 'hills-near', '#2F4F2F');
    }

    /**
     * Adds a new background layer.
     * 
     * @param texture - Image texture for the layer (null for procedural layers)
     * @param scrollSpeed - Scroll speed multiplier (0 = static, 1 = same as camera)
     * @param type - Type identifier for the layer
     * @param color - Color for procedural layers
     * @param alpha - Transparency (0-1)
     */
    public addLayer(
        texture: HTMLImageElement | null, 
        scrollSpeed: number, 
        type: string, 
        color: string = '#FFFFFF',
        alpha: number = 1
    ): void {
        this.layers.push({
            texture,
            scrollSpeed,
            type,
            color,
            alpha,
            offset: 0
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
                
            case 'clouds-far':
                this.renderClouds(ctx, parallaxOffset, canvasWidth, canvasHeight, 60, 30, 8);
                break;
                
            case 'clouds-near':
                this.renderClouds(ctx, parallaxOffset, canvasWidth, canvasHeight, 40, 20, 5);
                break;
                
            case 'hills-distant':
                this.renderHills(ctx, parallaxOffset, canvasWidth, canvasHeight, layer.color, 0.3, 200);
                break;
                
            case 'hills-near':
                this.renderHills(ctx, parallaxOffset, canvasWidth, canvasHeight, layer.color, 0.5, 150);
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
     * Renders procedural clouds.
     * 
     * @param ctx - Canvas rendering context
     * @param offset - Parallax offset
     * @param width - Canvas width
     * @param height - Canvas height
     * @param cloudWidth - Width of each cloud
     * @param cloudHeight - Height of each cloud
     * @param spacing - Spacing between clouds
     * @private
     */
    private renderClouds(
        ctx: CanvasRenderingContext2D, 
        offset: number, 
        width: number, 
        height: number,
        cloudWidth: number,
        cloudHeight: number,
        spacing: number
    ): void {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        const totalCloudWidth = cloudWidth + spacing;
        const startX = -((offset % totalCloudWidth + totalCloudWidth) % totalCloudWidth);
        
        for (let x = startX; x < width + cloudWidth; x += totalCloudWidth) {
            // Simple cloud shape using circles
            const cloudY = height * 0.1 + Math.sin((x + offset) * 0.01) * 20;
            
            ctx.beginPath();
            ctx.arc(x, cloudY, cloudHeight / 2, 0, Math.PI * 2);
            ctx.arc(x + cloudWidth / 3, cloudY, cloudHeight / 3, 0, Math.PI * 2);
            ctx.arc(x + cloudWidth * 2/3, cloudY, cloudHeight / 2.5, 0, Math.PI * 2);
            ctx.fill();
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
} 