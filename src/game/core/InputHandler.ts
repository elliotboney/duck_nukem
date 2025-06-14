/**
 * InputHandler class for managing keyboard input in the game.
 * Provides a centralized system for tracking key states and common game actions.
 * 
 * Features:
 * - Real-time key state tracking
 * - Convenient methods for common game actions (movement, jumping, shooting)
 * - Support for multiple key bindings per action
 * - Automatic event listener management
 * 
 * Supported Controls:
 * - Movement: Arrow keys or WASD
 * - Jump: Up arrow, W, or Spacebar
 * - Shoot: X key
 * - Run: Shift key (modifier)
 * 
 * @example
 * ```typescript
 * const inputHandler = new InputHandler();
 * 
 * // In game loop
 * if (inputHandler.isMovingLeft()) {
 *   player.moveLeft();
 * }
 * if (inputHandler.isJumping()) {
 *   player.jump();
 * }
 * ```
 */
export class InputHandler {
    /** Map of key names to their current pressed state */
    private keys: { [key: string]: boolean } = {};

    /**
     * Creates a new InputHandler and sets up keyboard event listeners.
     * Automatically begins tracking key states when instantiated.
     */
    constructor() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * Handles keydown events and marks keys as pressed.
     * 
     * @param event - The keyboard event containing key information
     * @private
     */
    private handleKeyDown(event: KeyboardEvent): void {
        this.keys[event.key] = true;
    }

    /**
     * Handles keyup events and marks keys as released.
     * 
     * @param event - The keyboard event containing key information
     * @private
     */
    private handleKeyUp(event: KeyboardEvent): void {
        this.keys[event.key] = false;
    }

    /**
     * Checks if a specific key is currently pressed.
     * 
     * @param key - The key name to check (e.g., 'ArrowLeft', 'w', ' ')
     * @returns True if the key is currently pressed, false otherwise
     */
    public isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    /**
     * Checks if the player is trying to move left.
     * Supports both arrow keys and WASD controls.
     * 
     * @returns True if left movement keys are pressed
     */
    public isMovingLeft(): boolean {
        return this.isKeyPressed('ArrowLeft') || this.isKeyPressed('a');
    }

    /**
     * Checks if the player is trying to move right.
     * Supports both arrow keys and WASD controls.
     * 
     * @returns True if right movement keys are pressed
     */
    public isMovingRight(): boolean {
        return this.isKeyPressed('ArrowRight') || this.isKeyPressed('d');
    }

    /**
     * Checks if the player is trying to jump.
     * Supports arrow keys, WASD, and spacebar controls.
     * 
     * @returns True if jump keys are pressed
     */
    public isJumping(): boolean {
        return this.isKeyPressed('ArrowUp') || this.isKeyPressed('w') || this.isKeyPressed(' ');
    }

    /**
     * Checks if the player is trying to shoot.
     * Currently mapped to the X key.
     * 
     * @returns True if shoot key is pressed
     */
    public isShooting(): boolean {
        return this.isKeyPressed('x');
    }
} 