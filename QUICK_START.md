# 🚀 Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js 16+ installed
- ✅ MIDI keyboard connected via USB
- ✅ Chrome/Edge/Opera browser (for Web MIDI API)

## Installation & Launch (2 steps)

### 1. Install Dependencies (first time only)
```bash
cd /Users/pier/Coding/harmony.teacher
npm install
```

### 2. Start the App
```bash
npm start
```

**OR** use the quick start script:
```bash
./start.sh
```

## What Happens Next

1. **Vite dev server starts** on http://localhost:5173
2. **Browser opens automatically** (or open manually in Chrome/Edge/Opera)
3. **Welcome screen appears**
4. **MIDI initialization** (you'll see status message - click "Allow" if prompted)
5. **Click "Start Learning"** when ready

## 🌐 Browser Mode (Recommended)

**Why browser instead of Electron?**
- ✅ No blank screen issues
- ✅ Faster startup
- ✅ Better MIDI support
- ✅ Easier debugging
- ✅ Works perfectly!

## First Exercise

1. Select **"Shared Tones Connection"** (beginner, voice-leading)
2. Play **Dm7** chord (D F A C)
3. Play **G7** chord (G B D F)
4. Watch the real-time analysis
5. Click **"Evaluate"** to get your score

## Troubleshooting

### MIDI Not Working?
- Unplug and replug your MIDI keyboard
- Refresh the app (Cmd+R on Mac, Ctrl+R on Windows)
- Check if your keyboard appears in System Preferences/Settings

### App Won't Start?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port 5173 Already in Use?
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm start
```

## Keyboard Shortcuts (inside app)

- **Space** - Play/pause (future feature)
- **Cmd+R / Ctrl+R** - Reload app
- **Cmd+Q / Ctrl+Q** - Quit app

## Next Steps

1. Complete all **Beginner** exercises
2. Move to **Intermediate** level
3. Experiment in **Free Play** mode (no exercise selected)
4. Check **Feedback Panel** for real-time analysis

## Need Help?

- Read full README.md
- Check ARCHITECTURE.md for technical details
- Browse resources/ folder for theory concepts

---

**Enjoy learning! 🎵**
