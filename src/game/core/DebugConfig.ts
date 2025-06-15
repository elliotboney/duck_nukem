/**
 * Debug configuration system for controlling debug features across the game.
 * Provides centralized control over visual debugging aids like bounding boxes,
 * performance metrics, and other development tools.
 * 
 * Features:
 * - Toggle sprite bounding boxes
 * - Control debug rendering for all entities
 * - Extensible for future debug features
 * - Runtime configuration changes
 * 
 * @example
 * ```typescript
 * // Enable debug features
 * DebugConfig.enableBoundingBoxes();
 * 
 * // Check if debug mode is active
 * if (DebugConfig.showBoundingBoxes) {
 *   // Render debug box
 * }
 * ```
 */
export class DebugConfig {
    /** Whether to show red bounding boxes around sprites */
    public static showBoundingBoxes: boolean = false;
    
    /** Whether to show performance metrics */
    public static showPerformanceMetrics: boolean = false;
    
    /** Whether to show coordinate information */
    public static showCoordinates: boolean = false;
    
    /** Whether to show collision detection areas */
    public static showCollisionBoxes: boolean = false;
    
    /** Whether debug mode is globally enabled */
    public static debugModeEnabled: boolean = false;

    /**
     * Enables sprite bounding boxes for all entities.
     * Shows red rectangular outlines around sprite frames.
     */
    public static enableBoundingBoxes(): void {
        this.showBoundingBoxes = true;
        console.log('Debug: Bounding boxes enabled');
    }

    /**
     * Disables sprite bounding boxes for all entities.
     */
    public static disableBoundingBoxes(): void {
        this.showBoundingBoxes = false;
        console.log('Debug: Bounding boxes disabled');
    }

    /**
     * Toggles sprite bounding boxes on/off.
     * 
     * @returns The new state of bounding boxes
     */
    public static toggleBoundingBoxes(): boolean {
        this.showBoundingBoxes = !this.showBoundingBoxes;
        console.log(`Debug: Bounding boxes ${this.showBoundingBoxes ? 'enabled' : 'disabled'}`);
        return this.showBoundingBoxes;
    }

    /**
     * Enables all debug features.
     */
    public static enableAllDebug(): void {
        this.debugModeEnabled = true;
        this.showBoundingBoxes = true;
        this.showPerformanceMetrics = true;
        this.showCoordinates = true;
        this.showCollisionBoxes = true;
        console.log('Debug: All debug features enabled');
    }

    /**
     * Disables all debug features.
     */
    public static disableAllDebug(): void {
        this.debugModeEnabled = false;
        this.showBoundingBoxes = false;
        this.showPerformanceMetrics = false;
        this.showCoordinates = false;
        this.showCollisionBoxes = false;
        console.log('Debug: All debug features disabled');
    }

    /**
     * Toggles debug mode (enables/disables all features at once).
     * 
     * @returns The new debug mode state
     */
    public static toggleDebugMode(): boolean {
        if (this.debugModeEnabled) {
            this.disableAllDebug();
        } else {
            this.enableAllDebug();
        }
        return this.debugModeEnabled;
    }

    /**
     * Sets up keyboard shortcuts for debug controls.
     * Call this once during game initialization.
     * 
     * Shortcuts:
     * - F1: Toggle bounding boxes
     * - F2: Toggle debug mode
     */
    public static setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (event) => {
            // Only handle debug keys when not typing in input fields
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (event.key) {
                case 'F1':
                    event.preventDefault();
                    this.toggleBoundingBoxes();
                    break;
                case 'F2':
                    event.preventDefault();
                    this.toggleDebugMode();
                    break;
            }
        });
        
        console.log('Debug: Keyboard shortcuts enabled (F1: Bounding boxes, F2: Debug mode)');
    }

    /**
     * Gets the current debug configuration as an object.
     * 
     * @returns Object containing all debug settings
     */
    public static getDebugState(): DebugState {
        return {
            showBoundingBoxes: this.showBoundingBoxes,
            showPerformanceMetrics: this.showPerformanceMetrics,
            showCoordinates: this.showCoordinates,
            showCollisionBoxes: this.showCollisionBoxes,
            debugModeEnabled: this.debugModeEnabled
        };
    }

    /**
     * Sets the debug configuration from an object.
     * 
     * @param state - Debug configuration object
     */
    public static setDebugState(state: Partial<DebugState>): void {
        if (state.showBoundingBoxes !== undefined) this.showBoundingBoxes = state.showBoundingBoxes;
        if (state.showPerformanceMetrics !== undefined) this.showPerformanceMetrics = state.showPerformanceMetrics;
        if (state.showCoordinates !== undefined) this.showCoordinates = state.showCoordinates;
        if (state.showCollisionBoxes !== undefined) this.showCollisionBoxes = state.showCollisionBoxes;
        if (state.debugModeEnabled !== undefined) this.debugModeEnabled = state.debugModeEnabled;
        
        console.log('Debug: Configuration updated', this.getDebugState());
    }
}

/**
 * Interface for debug configuration state.
 */
export interface DebugState {
    /** Whether to show sprite bounding boxes */
    showBoundingBoxes: boolean;
    
    /** Whether to show performance metrics */
    showPerformanceMetrics: boolean;
    
    /** Whether to show coordinate information */
    showCoordinates: boolean;
    
    /** Whether to show collision detection areas */
    showCollisionBoxes: boolean;
    
    /** Whether debug mode is globally enabled */
    debugModeEnabled: boolean;
} 