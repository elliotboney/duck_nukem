export class InputHandler {
    private keys: { [key: string]: boolean } = {};

    constructor() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this.keys[event.key] = true;
    }

    private handleKeyUp(event: KeyboardEvent): void {
        this.keys[event.key] = false;
    }

    public isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    public isMovingLeft(): boolean {
        return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a');
    }

    public isMovingRight(): boolean {
        return this.isKeyPressed('ArrowRight') || this.isKeyPressed('d');
    }

    public isJumping(): boolean {
        return this.isKeyPressed('ArrowUp') || this.isKeyPressed('w') || this.isKeyPressed(' ');
    }

    public isShooting(): boolean {
        return this.isKeyPressed('x');
    }
} 