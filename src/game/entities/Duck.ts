import { InputHandler } from '../core/InputHandler';
import { Animation } from '../utils/Animation';
import duckWalkingSprite from '../../assets/images/duck_walking.png';

const SPRITE_COLS = 7;  // 7 frames for walking animation
const SPRITE_ROWS = 1;  // Single row
const FRAME_DURATION = 60; // ms per frame (faster animation)

// Animation row mapping
const ANIM_WALK = 0;

export class Duck {
    private x: number;
    private y: number;
    private velocityX: number = 0;
    private velocityY: number = 0;
    private speed: number = 200;
    private runSpeed: number = 650;
    private jumpForce: number = -400;
    private gravity: number = 800;
    private isJumping: boolean = false;
    private inputHandler: InputHandler;
    private sprite: HTMLImageElement;
    private frameWidth = 76;
    private frameHeight = 90;
    private animation: Animation | null = null;
    private loaded: boolean = false;
    private currentAnimRow: number = ANIM_WALK;
    private scale: number = 1;
    private facingLeft: boolean = false;

    constructor(x: number, y: number, inputHandler: InputHandler) {
        this.x = x;
        this.y = y;
        this.inputHandler = inputHandler;
        this.sprite = new window.Image();
        this.sprite.src = duckWalkingSprite;
        this.sprite.onload = () => {
            console.log('Sprite loaded:', this.sprite.width, this.sprite.height);
            this.animation = new Animation(
                this.sprite,
                this.frameWidth,
                this.frameHeight,
                ANIM_WALK,
                SPRITE_COLS,
                FRAME_DURATION
            );
            this.loaded = true;
        };
    }

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

        // Animation switching - simplified to only walking for now
        if (this.loaded && this.animation) {
            if (moving) {
                // Animate walking when moving
                this.animation.update(deltaTime);
            } else {
                // Idle: set to first frame of walk animation
                this.animation.setRow(ANIM_WALK);
                this.animation.reset();
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (this.loaded && this.animation && this.frameWidth && this.frameHeight) {
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
            
            let sx = 0;
            let sy = 0;
            let sw = 76; // source width
            let sh = 90; // source height
            
            if (this.animation) {
                const frame = this.animation['currentFrame'];
                if (frame < walkFrameData.length) {
                    const frameData = walkFrameData[frame];
                    sx = frameData.x;
                    sy = frameData.y;
                    sw = frameData.width;
                    sh = frameData.height;
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
                    this.sprite,
                    sx, sy, sw, sh,
                    -(this.x + drawWidth / 2),  // Flip the x position
                    this.y - drawHeight / 2,
                    drawWidth,
                    drawHeight
                );
            } else {
                ctx.drawImage(
                    this.sprite,
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