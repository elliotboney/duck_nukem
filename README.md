# Parker Duck - Side Scrolling Shooter

A fun side-scrolling shooter game featuring a dapper duck protagonist fighting against evil bread enemies. Built with TypeScript, HTML5 Canvas, and modern web technologies.

## 🎮 Current Features

### ✅ Fully Implemented
- **Smooth Physics**: 60fps game loop with proper deltaTime handling
- **Duck Character**: Complete with movement, jumping, and gravity physics
- **Three Animation States**: Walk, Run, and Jump with sprite-based animations
- **Responsive Controls**: WASD/Arrow keys + Space + Shift for enhanced movement
- **Advanced Sprite System**: Real-time coordinate testing and automatic code generation
- **Development Tools**: Comprehensive sprite coordinate management interface

### 🔧 Technical Highlights
- **Dual Server Architecture**: Main game (port 9000) + Update server (port 3001)
- **Real-time Sprite Testing**: Live coordinate adjustment with instant visual feedback
- **Automatic Code Generation**: Changes in sprite test automatically update game code
- **Manual Coordinate System**: Precise frame-by-frame sprite positioning
- **Animation State Management**: Seamless switching between walk/run/jump animations

## 🎯 Controls

- **Move Left**: Left Arrow or A
- **Move Right**: Right Arrow or D  
- **Jump**: Up Arrow, W, or Space
- **Run**: Hold Shift while moving
- **Shoot**: X *(coming soon)*

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
│   │   │   └── Duck.ts           # Main character with animations
│   │   ├── core/
│   │   │   ├── Game.ts           # Game loop and rendering
│   │   │   └── InputHandler.ts   # Keyboard input management
│   │   └── utils/
│   │       └── Animation.ts      # Animation utility class
│   ├── assets/
│   │   └── images/
│   │       └── duck2.png         # 1024x1024 sprite sheet
│   └── index.ts                  # Entry point
├── public/
│   └── sprite-test.html          # Sprite coordinate testing interface
├── update-server.js              # Express server for sprite management
├── package.json
├── webpack.config.js
├── tsconfig.json
└── session_context.md            # Detailed development context
```

## 🎨 Current Sprite Coordinates

The game uses manually specified sprite coordinates for precise animation control:

- **Walk Animation**: 5 frames with varying X positions
- **Run Animation**: 5 frames from row 2 of sprite sheet  
- **Jump Animation**: 5 frames from row 4 with different heights

All coordinates are managed through the sprite testing interface and automatically synchronized with the game code.

## 🔮 Coming Next

- **Enemy System**: Cartoon bread loaves with AK-47s
- **Combat Mechanics**: Shooting and collision detection
- **Level Design**: Scrolling backgrounds and platforms
- **Audio System**: Sound effects and background music
- **UI Elements**: Menus, score, and health display

## 📋 Development Status

**Current Phase**: Core character system complete ✅  
**Next Milestone**: Enemy implementation 🎯  
**Playable**: Yes - full movement and animation system functional 🎮

## 📄 License

MIT 