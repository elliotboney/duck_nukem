import { InputHandler } from '../core/InputHandler';
import { Animation } from '../utils/Animation';
import duckSprite from '../../assets/images/duck2.png';

const SPRITE_COLS = 5;
const SPRITE_ROWS = 4;
const FRAME_DURATION = 100; // ms per frame

// Animation row mapping
const ANIM_WALK = 0;
const ANIM_RUN = 1;
const ANIM_JUMP = 3;

export class Duck {
    private x: number;
    private y: number;
    private velocityX: number = 0;
    private velocityY: number = 0;
    private speed: number = 200;
    private runSpeed: number = 350;
    private jumpForce: number = -400;
    private gravity: number = 800;
    private isJumping: boolean = false;
    private inputHandler: InputHandler;
    private sprite: HTMLImageElement;
    private frameWidth = 150;
    private frameHeight = 240;
    private animation: Animation | null = null;
    private loaded: boolean = false;
    private currentAnimRow: number = ANIM_WALK;
    private scale: number = 1;

    constructor(x: number, y: number, inputHandler: InputHandler) {
        this.x = x;
        this.y = y;
        this.inputHandler = inputHandler;
        this.sprite = new window.Image();
        this.sprite.src = duckSprite;
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
            moving = true;
            running = this.inputHandler.isKeyPressed('Shift');
        } else if (this.inputHandler.isMovingRight()) {
            this.velocityX = this.inputHandler.isKeyPressed('Shift') ? this.runSpeed : this.speed;
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

        // Animation switching
        if (this.loaded && this.animation) {
            let newAnimRow = ANIM_WALK;
            let shouldAnimate = false;
            if (this.isJumping) {
                newAnimRow = ANIM_JUMP;
                shouldAnimate = true;
            } else if (running && moving) {
                newAnimRow = ANIM_RUN;
                shouldAnimate = true;
            } else if (moving) {
                newAnimRow = ANIM_WALK;
                shouldAnimate = true;
            } else {
                // Idle: set to first frame of walk row
                this.animation.setRow(ANIM_WALK);
                this.animation.reset();
            }
            if (newAnimRow !== this.currentAnimRow) {
                this.animation.setRow(newAnimRow);
                this.currentAnimRow = newAnimRow;
            }
            if (shouldAnimate) {
                this.animation.update(deltaTime);
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

            // Manually specify coordinates and size for just the duck artwork
            // Walk Animation Frames
const walkFrameData = [
    { x: 0, y: 0, width: 150, height: 182 },    // frame 0
    { x: 236, y: 0, width: 150, height: 182 },    // frame 1
    { x: 474, y: 0, width: 150, height: 182 },    // frame 2
    { x: 683, y: 0, width: 150, height: 182 },    // frame 3
    { x: 0, y: 0, width: 150, height: 182 },    // frame 4
];

// Run Animation Frames
const runFrameData = [
    { x: 0, y: 211, width: 150, height: 182 },    // frame 0
    { x: 234, y: 211, width: 150, height: 182 },    // frame 1
    { x: 469, y: 211, width: 150, height: 182 },    // frame 2
    { x: 450, y: 211, width: 150, height: 182 },    // frame 3
    { x: 600, y: 211, width: 150, height: 182 },    // frame 4
];

// Jump Animation Frames
const jumpFrameData = [
    { x: 679, y: 666, width: 150, height: 213 },    // frame 0
    { x: 234, y: 666, width: 150, height: 213 },    // frame 1
    { x: 470, y: 666, width: 150, height: 213 },    // frame 2
    { x: 679, y: 666, width: 150, height: 213 },    // frame 3
    { x: 234, y: 666, width: 150, height: 213 },    // frame 4
];
            let sx = 19;
            let sy = 37;
            let sw = 150; // source width (duck artwork)
            let sh = 256; // source height (duck artwork)
            
            if (this.animation) {
                const frame = this.animation['currentFrame'];
                let frameData = null;
                
                if (this.currentAnimRow === ANIM_WALK) {
                    frameData = walkFrameData[frame];
                } else if (this.currentAnimRow === ANIM_RUN) {
                    frameData = runFrameData[frame];
                } else if (this.currentAnimRow === ANIM_JUMP) {
                    frameData = jumpFrameData[frame];
                }
                
                if (frameData) {
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
            
            ctx.drawImage(
                this.sprite,
                sx, sy, sw, sh,
                this.x - drawWidth / 2,
                this.y - drawHeight / 2,
                drawWidth,
                drawHeight
            );
        } else {
            // Draw placeholder while loading
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, 50, 50);
        }
    }
} 