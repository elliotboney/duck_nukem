# Duck Nukem - Side Scrolling Adventure

A retro-styled side-scrolling adventure game featuring a dapper duck protagonist exploring a vast world filled with angry bread enemies. Built with TypeScript, HTML5 Canvas, and modern web technologies.

## 🎮 Live Game

**Play Now**: [Duck Nukem on Cloudflare Pages](https://duck-nukem.pages.dev)

## 🎯 Current Features

### ✅ Fully Implemented
- **Duck Character**: Complete with four animation states (Idle, Walk, Run, Jump)
- **Smooth Physics**: 60fps game loop with deltaTime-based movement and gravity
- **Extended World**: 8000px wide seamless scrolling world with camera following
- **Professional Parallax**: Multi-layer background with atmospheric depth effects
- **Enemy System**: Animated Angry Bread enemies with patrol AI and directional sprites
- **Responsive Controls**: Full keyboard controls with professional UI display
- **Advanced Sprite System**: Real-time coordinate testing and automatic code generation
- **Production Ready**: Optimized builds with Cloudflare Pages deployment

### 🌟 Visual Highlights
- **Professional UI**: "Duck Nukem" title with retro gaming aesthetic using Pixelify Sans font
- **1200x600 Canvas**: Enhanced viewport for better gameplay experience
- **Atmospheric Parallax**: Clouds, hills, and trees with realistic depth and scaling
- **Enemy Animations**: 5-frame walking animations with horizontal sprite mirroring
- **Debug System**: Toggleable bounding boxes and debug information (F1/F2 keys)

### 🔧 Technical Achievements
- **Camera System**: Smooth following with world-to-screen coordinate transformation
- **Background Layers**: Sky gradient, clouds (2x scale), distant hills, near hills, trees
- **Enemy AI**: Patrol behavior with configurable distances and direction changes
- **Performance**: Camera culling, efficient rendering, and optimized asset loading
- **Development Tools**: Comprehensive sprite testing interface with live updates

## 🎮 Controls

### Movement
- **Move Left**: A or ← (Left Arrow)
- **Move Right**: D or → (Right Arrow)  
- **Jump**: SPACE
- **Run**: Hold SHIFT while moving

### Debug
- **F1**: Toggle Bounding Boxes
- **F2**: Toggle Debug Mode

*Controls are displayed in-game under the canvas for easy reference.*

## 🚀 Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the main game:
   ```bash
   npm run dev
   ```
4. In a separate terminal, start the update server:
   ```bash
   node update-server.js
   ```
5. Open your browser:
   - **Game**: `http://localhost:9000`
   - **Sprite Testing**: `http://localhost:9000/sprite-test.html`

### 🛠️ Development Tools

#### Sprite Coordinate Testing
Access the sprite testing interface at `http://localhost:9000/sprite-test.html` to:
- Adjust sprite frame coordinates in real-time
- See instant visual feedback for each animation frame
- Export changes directly to the game code
- Load current coordinates from the game file
- Save/restore coordinate configurations

#### Development Workflow
1. Use sprite test interface to adjust coordinates
2. Click "Export & Update Game" to push changes to Duck.ts
3. Refresh main game to see changes immediately
4. Use "Reload from Game" to sync test interface with current game state

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Testing & Quality

```bash
npm test          # Run tests
npm run lint      # Check code style
npm run lint:fix  # Auto-fix linting issues
```

## 📁 Project Structure

```
parker_duck/
├── src/
│   ├── game/
│   │   ├── entities/
│   │   │   ├── Duck.ts           # Main character with 4-state animation
│   │   │   └── AngryBread.ts     # Enemy with patrol AI and animations
│   │   ├── core/
│   │   │   ├── Game.ts           # Game loop, camera, and world systems
│   │   │   ├── InputHandler.ts   # Keyboard input management
│   │   │   ├── Camera.ts         # Smooth following camera system
│   │   │   └── DebugConfig.ts    # Master debug configuration
│   │   ├── world/
│   │   │   ├── Background.ts     # Multi-layer parallax system
│   │   │   └── Ground.ts         # Ground collision and rendering
│   │   └── utils/
│   │       └── Animation.ts      # Animation utility class
│   ├── assets/images/
│   │   ├── duck_idle.png         # Duck idle animation (5 frames)
│   │   ├── duck_walking.png      # Duck walking animation (7 frames)
│   │   ├── duck_running.png      # Duck running animation (4 frames)
│   │   ├── duck_jumping.png      # Duck jumping animation (16 frames)
│   │   ├── angry_bread_walking.png # Enemy walking animation (5 frames)
│   │   ├── clouds.png            # Parallax clouds sprite
│   │   ├── hills1.png            # Distant hills sprite
│   │   ├── hills2.png            # Near hills sprite
│   │   ├── trees.png             # Trees foreground sprite
│   │   └── ground.png            # Ground texture sprite
│   └── index.ts                  # Entry point with 1200x600 canvas
├── dist/                         # Production build output
├── public/
│   └── sprite-test.html          # Sprite coordinate testing interface
├── update-server.js              # Express server for sprite management
├── webpack.config.js             # Production-optimized build config
├── wrangler.toml                 # Cloudflare Pages configuration
├── _redirects                    # Deployment redirects
└── session_context.md            # Comprehensive development documentation
```

## 🎨 Animation System

### Duck Animations (76x90 pixels per frame)
- **Idle**: 5 frames @ 120ms each (duck_idle.png)
- **Walk**: 7 frames @ 60ms each (duck_walking.png)  
- **Run**: 4 frames @ 40ms each (duck_running.png)
- **Jump**: 16 frames @ 50ms each (duck_jumping.png)

### Enemy Animations (32x32 pixels, scaled to 0.3x = ~10x10 rendered)
- **Angry Bread Walk**: 5 frames @ 100ms each (angry_bread_walking.png)

All sprite coordinates are managed through the sprite testing interface and automatically synchronized with the game code.

## 🌍 World & Enemies

### World Specifications
- **World Size**: 8000px wide (4x expanded from original)
- **Canvas Size**: 1200x600px for enhanced gameplay view
- **Camera**: Smooth following with world-to-screen transformation
- **Parallax Layers**: Sky, clouds (2x), distant hills (2x), near hills (1.5x), trees (1.5x)

### Enemy Placement (9 Angry Bread enemies)
- **Early Game** (X: 800-1200): 2 enemies, 100-150px patrol ranges
- **Mid Game** (X: 2500-3500): 3 enemies, 120-200px patrol ranges
- **Later Game** (X: 5000-5800): 2 enemies, 140-160px patrol ranges
- **End Game** (X: 7200-7800): 2 enemies, 100-200px patrol ranges

## 🔮 Coming Next

- **Combat System**: Duck vs Angry Bread collision detection
- **Projectile System**: Shooting mechanics for gameplay
- **Sound System**: Audio effects and background music
- **UI Elements**: Health bars, score display, game over screens
- **Level Progression**: More enemy types and spawning patterns

## 📋 Development Status

**Current Phase**: Enemy system and world complete ✅  
**Next Milestone**: Combat mechanics implementation 🎯  
**Playable**: Yes - full world exploration with animated enemies 🎮  
**Deployed**: [Live on Cloudflare Pages](https://duck-nukem.pages.dev) 🌐

## 📄 License

MIT 