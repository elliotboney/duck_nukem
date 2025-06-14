# Parker Duck - Animation System Documentation

## Overview

The Parker Duck game uses a sprite-based animation system with frame-by-frame animation for character movement. The system supports horizontal sprite flipping and multiple animation states.

## Current Animation Architecture

### Core Components

#### Animation.ts
- **Purpose**: Utility class for managing sprite sheet animations
- **Features**: Frame cycling, row switching, timing control
- **Location**: `src/game/utils/Animation.ts`

#### Duck.ts Animation Logic
- **Purpose**: Character-specific animation state management
- **Features**: Direction tracking, animation switching, sprite rendering
- **Location**: `src/game/entities/Duck.ts`

## Current Sprite Specifications

### Walking Animation (IMPLEMENTED ✅)

**File**: `duck_walking.png`
- **Dimensions**: 532x90 pixels
- **Frame Count**: 7 frames
- **Frame Size**: 76x90 pixels each
- **Layout**: Single horizontal row
- **Frame Duration**: 60ms (~16.7 fps)

#### Frame Coordinates
```typescript
const walkFrameData = [
    { x: 0, y: 0, width: 76, height: 90 },      // frame 0
    { x: 76, y: 0, width: 76, height: 90 },     // frame 1
    { x: 152, y: 0, width: 76, height: 90 },    // frame 2
    { x: 228, y: 0, width: 76, height: 90 },    // frame 3
    { x: 304, y: 0, width: 76, height: 90 },    // frame 4
    { x: 380, y: 0, width: 76, height: 90 },    // frame 5
    { x: 456, y: 0, width: 76, height: 90 },    // frame 6
];
```

### Running Animation (PENDING 🔄)

**Expected File**: `duck_running.png`
- **Expected Dimensions**: Similar to walking (frames x 90 pixels)
- **Expected Frame Size**: 76x90 pixels each
- **Expected Layout**: Single horizontal row
- **Suggested Frame Count**: 6-8 frames
- **Suggested Frame Duration**: 40-50ms (faster than walking)

### Jumping Animation (PENDING 🔄)

**Expected File**: `duck_jumping.png`
- **Expected Dimensions**: Similar to walking (frames x 90 pixels)
- **Expected Frame Size**: 76x90 pixels each
- **Expected Layout**: Single horizontal row
- **Suggested Frame Count**: 4-6 frames
- **Suggested Frame Duration**: 80-100ms (slower, more dramatic)

## Animation States

### Current Implementation

#### Walking State
- **Trigger**: Any horizontal movement (left/right keys)
- **Behavior**: Cycles through 7 walking frames
- **Speed**: 60ms per frame
- **Mirroring**: Flips horizontally when moving left

#### Idle State
- **Trigger**: No movement input
- **Behavior**: Shows first frame of walking animation
- **Static**: No frame cycling

### Planned Implementation

#### Running State (Future)
- **Trigger**: Horizontal movement + Shift key
- **Behavior**: Faster animation cycle
- **Speed**: Faster frame rate than walking
- **Movement Speed**: 650px/s (vs 200px/s walking)

#### Jumping State (Future)
- **Trigger**: Space key press while airborne
- **Behavior**: Jump animation sequence
- **Duration**: Complete animation cycle during jump
- **Physics**: Independent of jump physics timing

## Sprite Mirroring System

### Implementation Details

```typescript
// Direction tracking
private facingLeft: boolean = false;

// Update direction based on input
if (this.inputHandler.isMovingLeft()) {
    this.facingLeft = true;
} else if (this.inputHandler.isMovingRight()) {
    this.facingLeft = false;
}

// Render with mirroring
if (this.facingLeft) {
    ctx.scale(-1, 1);
    ctx.drawImage(/* flipped positioning */);
} else {
    ctx.drawImage(/* normal positioning */);
}
```

### Behavior Rules
- **Direction Memory**: Duck maintains facing direction when idle
- **Jump Inheritance**: Jumping preserves last movement direction
- **Instant Switching**: Direction changes immediately with input

## Technical Configuration

### Current Settings

```typescript
// Sprite Configuration
const SPRITE_COLS = 7;          // 7 frames for walking
const SPRITE_ROWS = 1;          // Single row layout
const FRAME_DURATION = 60;      // 60ms per frame

// Animation Constants
const ANIM_WALK = 0;            // Walking animation row

// Frame Dimensions
private frameWidth = 76;        // Frame width in pixels
private frameHeight = 90;       // Frame height in pixels
```

### Performance Considerations
- **Frame Rate**: 60ms provides smooth animation without performance impact
- **Sprite Size**: 76x90 is optimal for game scale and performance
- **Memory Usage**: Single sprite sheet per animation type minimizes memory footprint

## Animation Workflow

### Current Process
1. **Movement Input** → Update `facingLeft` direction
2. **Animation Check** → Determine if moving or idle
3. **Frame Update** → Advance animation frame if moving
4. **Render** → Draw current frame with appropriate mirroring

### Future Process (With Multiple States)
1. **Input Analysis** → Determine movement type (walk/run/jump)
2. **State Switching** → Change animation state if needed
3. **Frame Update** → Advance appropriate animation
4. **Render** → Draw with state-specific timing and mirroring

## Sprite Creation Guidelines

### For Future Animations

#### File Naming Convention
- `duck_walking.png` ✅
- `duck_running.png` (planned)
- `duck_jumping.png` (planned)
- `duck_idle.png` (optional)

#### Sprite Sheet Requirements
- **Frame Size**: Consistent 76x90 pixels
- **Layout**: Single horizontal row
- **Spacing**: No gaps between frames
- **Background**: Transparent PNG
- **Quality**: High resolution, clean pixel art

#### Frame Count Recommendations
- **Walking**: 7 frames (current) ✅
- **Running**: 6-8 frames (more dynamic)
- **Jumping**: 4-6 frames (takeoff, peak, landing)
- **Idle**: 1-3 frames (breathing, blinking)

## Integration Points

### Adding New Animations

1. **Import Sprite**
```typescript
import duckRunningSprite from '../../assets/images/duck_running.png';
```

2. **Update Constants**
```typescript
const ANIM_RUN = 1;
const ANIM_JUMP = 2;
```

3. **Add Frame Data**
```typescript
const runFrameData = [
    // Frame coordinates...
];
```

4. **Update Animation Logic**
```typescript
if (running && moving) {
    newAnimRow = ANIM_RUN;
} else if (this.isJumping) {
    newAnimRow = ANIM_JUMP;
}
```

## Testing and Debugging

### Animation Testing Tools
- **Sprite Test Interface**: `http://localhost:9000/sprite-test.html`
- **Real-time Coordinate Adjustment**: Live frame positioning
- **Export Functionality**: Automatic code generation

### Debug Features
- **Red Debug Frame**: Visual frame boundary display
- **Console Logging**: Sprite load confirmation
- **Frame Counter**: Current animation frame tracking

## Performance Metrics

### Current Performance
- **Animation FPS**: ~16.7 fps (60ms frame duration)
- **Game FPS**: 60 fps (independent of animation timing)
- **Memory Usage**: Minimal (single sprite sheet)
- **CPU Impact**: Negligible (simple frame switching)

### Optimization Notes
- Frame duration can be adjusted per animation type
- Sprite sheets should be power-of-2 dimensions when possible
- Consider sprite atlasing for multiple animation types

## Future Enhancements

### Planned Features
1. **Multiple Animation States**: Run, jump, idle animations
2. **Animation Blending**: Smooth transitions between states
3. **Dynamic Frame Rates**: Different speeds per animation type
4. **Sprite Effects**: Damage flashing, power-up effects
5. **Particle Integration**: Dust clouds, impact effects

### Advanced Features (Long-term)
1. **Bone-based Animation**: For more complex character movement
2. **Animation Events**: Trigger sounds/effects at specific frames
3. **Procedural Animation**: Dynamic animation generation
4. **Multi-layer Sprites**: Separate body parts for customization

---

*Last Updated: Current session - Walking animation fully implemented with mirroring* 