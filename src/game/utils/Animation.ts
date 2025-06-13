export class Animation {
    private image: HTMLImageElement;
    private frameWidth: number;
    private frameHeight: number;
    private row: number;
    private frameCount: number;
    private frameDuration: number;
    private elapsedTime: number = 0;
    private currentFrame: number = 0;
    private loop: boolean;

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

    public setRow(row: number): void {
        if (this.row !== row) {
            this.row = row;
            this.currentFrame = 0;
            this.elapsedTime = 0;
        }
    }

    public reset(): void {
        this.currentFrame = 0;
        this.elapsedTime = 0;
    }
} 