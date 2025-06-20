/**
 * @fileoverview Update server for Parker Duck game development.
 * Provides API endpoints for reading and updating sprite frame coordinates
 * in the Duck.ts file during development and testing.
 * 
 * Features:
 * - Real-time frame data extraction from Duck.ts
 * - Dynamic code updating for sprite coordinates
 * - CORS support for cross-origin requests
 * - Error handling and validation
 * 
 * Endpoints:
 * - GET /get-frame-data: Retrieves current frame coordinates
 * - POST /update-duck-code: Updates Duck.ts with new coordinates
 * 
 * @author Parker Duck Development Team
 * @version 1.0.0
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
/** Port number for the update server */
const PORT = 3001;

// Middleware setup
app.use(cors());
app.use(express.json());

/**
 * GET /get-frame-data
 * Retrieves current sprite frame coordinates from Duck.ts file.
 * Parses the file to extract walkFrameData, runFrameData, and jumpFrameData arrays.
 * 
 * @route GET /get-frame-data
 * @returns {Object} JSON response with frame data for all animation types
 * @returns {boolean} success - Whether the operation succeeded
 * @returns {Object} data - Frame data organized by animation type (walk, run, jump)
 * @returns {string} error - Error message if operation failed
 */
app.get('/get-frame-data', (req, res) => {
    try {
        const duckFilePath = path.join(__dirname, 'src/game/entities/Duck.ts');
        const duckCode = fs.readFileSync(duckFilePath, 'utf8');
        
        // Extract frame data from the Duck.ts file
        const walkMatch = duckCode.match(/const walkFrameData = \[([\s\S]*?)\];/);
        const runMatch = duckCode.match(/const runFrameData = \[([\s\S]*?)\];/);
        const jumpMatch = duckCode.match(/const jumpFrameData = \[([\s\S]*?)\];/);
        
        const frameData = {
            walk: [],
            run: [],
            jump: []
        };
        
        // Parse walk frames
        if (walkMatch) {
            const walkContent = walkMatch[1];
            const walkFrames = walkContent.match(/\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/g);
            if (walkFrames) {
                walkFrames.forEach(frame => {
                    const match = frame.match(/x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)/);
                    if (match) {
                        frameData.walk.push({
                            x: parseInt(match[1]),
                            y: parseInt(match[2]),
                            width: parseInt(match[3]),
                            height: parseInt(match[4])
                        });
                    }
                });
            }
        }
        
        // Parse run frames
        if (runMatch) {
            const runContent = runMatch[1];
            const runFrames = runContent.match(/\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/g);
            if (runFrames) {
                runFrames.forEach(frame => {
                    const match = frame.match(/x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)/);
                    if (match) {
                        frameData.run.push({
                            x: parseInt(match[1]),
                            y: parseInt(match[2]),
                            width: parseInt(match[3]),
                            height: parseInt(match[4])
                        });
                    }
                });
            }
        }
        
        // Parse jump frames
        if (jumpMatch) {
            const jumpContent = jumpMatch[1];
            const jumpFrames = jumpContent.match(/\{\s*x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)\s*\}/g);
            if (jumpFrames) {
                jumpFrames.forEach(frame => {
                    const match = frame.match(/x:\s*(\d+),\s*y:\s*(\d+),\s*width:\s*(\d+),\s*height:\s*(\d+)/);
                    if (match) {
                        frameData.jump.push({
                            x: parseInt(match[1]),
                            y: parseInt(match[2]),
                            width: parseInt(match[3]),
                            height: parseInt(match[4])
                        });
                    }
                });
            }
        }
        
        res.json({ success: true, data: frameData });
    } catch (error) {
        console.error('Error reading frame data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /update-duck-code
 * Updates the Duck.ts file with new sprite frame coordinates.
 * Replaces existing frame data arrays or inserts new ones if they don't exist.
 * 
 * @route POST /update-duck-code
 * @param {Object} req.body - Request body containing the updated code
 * @param {string} req.body.code - Generated TypeScript code with frame data arrays
 * @returns {Object} JSON response indicating success or failure
 * @returns {boolean} success - Whether the update succeeded
 * @returns {string} message - Success message
 * @returns {string} error - Error message if operation failed
 */
app.post('/update-duck-code', (req, res) => {
    try {
        const { code } = req.body;
        const duckFilePath = path.join(__dirname, 'src/game/entities/Duck.ts');
        
        // Read the current Duck.ts file
        let duckCode = fs.readFileSync(duckFilePath, 'utf8');
        
        // Find and replace the frame data sections
        const walkFrameRegex = /const walkFrameData = \[[\s\S]*?\];/;
        const runFrameRegex = /const runFrameData = \[[\s\S]*?\];/;
        const jumpFrameRegex = /const jumpFrameData = \[[\s\S]*?\];/;
        
        // Extract individual frame data arrays from the generated code
        const walkMatch = code.match(/const walkFrameData = \[[\s\S]*?\];/);
        const runMatch = code.match(/const runFrameData = \[[\s\S]*?\];/);
        const jumpMatch = code.match(/const jumpFrameData = \[[\s\S]*?\];/);
        
        if (walkMatch) {
            if (walkFrameRegex.test(duckCode)) {
                duckCode = duckCode.replace(walkFrameRegex, walkMatch[0]);
            } else {
                // Add walkFrameData if it doesn't exist
                const insertPoint = duckCode.indexOf('// Manually specify coordinates');
                if (insertPoint !== -1) {
                    duckCode = duckCode.substring(0, insertPoint) + 
                              walkMatch[0] + '\n            ' +
                              duckCode.substring(insertPoint);
                }
            }
        }
        
        if (runMatch) {
            if (runFrameRegex.test(duckCode)) {
                duckCode = duckCode.replace(runFrameRegex, runMatch[0]);
            } else {
                // Add runFrameData after walkFrameData
                const walkEndIndex = duckCode.indexOf('];', duckCode.indexOf('walkFrameData')) + 2;
                if (walkEndIndex > 1) {
                    duckCode = duckCode.substring(0, walkEndIndex) + 
                              '\n            ' + runMatch[0] +
                              duckCode.substring(walkEndIndex);
                }
            }
        }
        
        if (jumpMatch) {
            if (jumpFrameRegex.test(duckCode)) {
                duckCode = duckCode.replace(jumpFrameRegex, jumpMatch[0]);
            } else {
                // Add jumpFrameData after runFrameData
                const runEndIndex = duckCode.indexOf('];', duckCode.indexOf('runFrameData')) + 2;
                if (runEndIndex > 1) {
                    duckCode = duckCode.substring(0, runEndIndex) + 
                              '\n            ' + jumpMatch[0] +
                              duckCode.substring(runEndIndex);
                }
            }
        }
        
        // Write the updated code back to the file
        fs.writeFileSync(duckFilePath, duckCode);
        
        res.json({ success: true, message: 'Duck.ts updated successfully' });
    } catch (error) {
        console.error('Error updating Duck.ts:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Start the Express server on the specified port.
 * Logs server startup information to console.
 */
app.listen(PORT, () => {
    console.log(`Update server running on http://localhost:${PORT}`);
});

module.exports = app; 