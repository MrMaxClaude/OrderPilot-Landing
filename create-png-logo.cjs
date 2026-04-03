/**
 * Create a simple PNG logo programmatically
 */

const fs = require('fs');
const path = require('path');

// Simple 24x24 PNG logo as base64 (orange square with white O)
const simplePngBase64 = `iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAmSURBVEiJ7c0xAQAwCAOw4F8ydetiAQMrKx/Yf8D+A/YfsP+A/Qf8DwAAwA/jOBKI9gAAAABJRU5ErkJggg==`;

// Even simpler - just orange square
const orangeSquareBase64 = `iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAOgAAADoBKJNxDgAAAA1JREFUOI1jYBgFo2AUAAACOgABuswPCgAAAABJRU5ErkJggg==`;

// Create directory if needed
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Save the PNG
const logoPath = path.join(publicDir, 'orderpilot-logo.png');
const logoBuffer = Buffer.from(orangeSquareBase64, 'base64');
fs.writeFileSync(logoPath, logoBuffer);

console.log(`📸 Created PNG logo: ${logoPath}`);
console.log(`📊 Size: ${logoBuffer.length} bytes`);

// Test loading it
const testLoad = fs.readFileSync(logoPath);
console.log(`✅ Logo loads successfully: ${testLoad.length} bytes`);