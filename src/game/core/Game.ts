import { Duck } from '../entities/Duck';
import { InputHandler } from '../core/InputHandler';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private inputHandler: InputHandler;
    private duck: Duck;
    private lastTime: number = 0;
    private isRunning: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.inputHandler = new InputHandler();
        this.duck = new Duck(100, 400, this.inputHandler);
    }

    public start(): void {
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    public stop(): void {
        this.isRunning = false;
    }

    private gameLoop(timestamp: number): void {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number): void {
        this.duck.update(deltaTime);
    }

    private render(): void {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the game elements
        this.duck.render(this.ctx);
    }
} 