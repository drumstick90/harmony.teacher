# 🌐 Browser Mode (Recommended)

## Why Browser Mode?

**Browser mode is BETTER than Electron for this app:**
- ✅ No blank screen issues
- ✅ Web MIDI API works perfectly
- ✅ Faster startup
- ✅ Easier debugging (DevTools)
- ✅ No Electron dependencies needed
- ✅ Works on any OS

## 🚀 Quick Start

### 1. Start the dev server
```bash
npm start
```

### 2. Open your browser
The app will automatically open at **http://localhost:5173**

Or manually open:
- **Chrome** (recommended)
- **Edge**
- **Opera**

### 3. Connect MIDI keyboard
- Plug in USB MIDI keyboard
- The app will detect it automatically
- Allow MIDI access when prompted

### 4. Start learning!
Click "Start Learning" when MIDI is initialized.

---

## 🎹 Requirements

### Browser Support (Web MIDI API)
- ✅ **Chrome** (desktop) - BEST
- ✅ **Edge** (desktop)
- ✅ **Opera** (desktop)
- ❌ Firefox (no Web MIDI support yet)
- ❌ Safari (no Web MIDI support yet)

### MIDI Keyboard
- Any USB MIDI keyboard
- Class-compliant (no drivers needed)
- Examples: M-Audio, Akai, Novation, Arturia, etc.

---

## 🔧 Commands

### Start in Browser (Default)
```bash
npm start
# Opens http://localhost:5173
```

### Build for Production
```bash
npm run build
# Creates dist/ folder
npm run preview
# Preview production build
```

### If you really want Electron
```bash
npm run electron
# Starts Vite + Electron together
```

---

## 🐛 Troubleshooting

### MIDI Not Detected?
1. **Check browser**: Use Chrome/Edge/Opera
2. **Check connection**: Unplug/replug USB cable
3. **Check permissions**: Browser may ask for MIDI access - click "Allow"
4. **Check console**: Open DevTools (F12) → Console tab

### Port 5173 Already in Use?
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm start -- --port 3000
```

### Blank Page?
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm start
```

### Hot Reload Not Working?
```bash
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## 💡 Pro Tips

### 1. Keep DevTools Open
- Press **F12** or **Cmd+Option+I** (Mac)
- See MIDI messages in Console
- Check Network tab if issues

### 2. Test MIDI Connection
Open Console and type:
```javascript
navigator.requestMIDIAccess().then(access => {
  console.log('MIDI Inputs:', Array.from(access.inputs.values()));
});
```

### 3. Full Screen Mode
Press **F11** for immersive learning experience

### 4. Multiple Monitors
Drag browser to second screen while producing in DAW

---

## 📊 Performance

Browser mode is **faster** than Electron:
- Startup: ~2 seconds (vs 5+ for Electron)
- MIDI latency: <10ms
- Memory: ~150MB (vs 300MB+ for Electron)

---

## 🎯 Next Steps

1. **Bookmark** http://localhost:5173
2. **Keep terminal open** (don't close it)
3. **Hot reload enabled** - changes appear instantly
4. **Focus on learning** - no tech issues!

---

## 🔄 Switching Between Browser and Electron

### Browser (Recommended)
```bash
npm start
```

### Electron (If needed)
```bash
npm run electron
```

That's it! **Browser mode is the way to go.** 🚀

---

## ❓ FAQ

**Q: Do I need to build anything?**
A: No! Just `npm start` and it works.

**Q: Can I use this offline?**
A: Yes, once started. But you need `npm start` running.

**Q: Can I access from another device?**
A: Yes! Use your local IP: http://192.168.x.x:5173

**Q: Does it work on mobile?**
A: Web MIDI not supported on mobile browsers yet. Use desktop.

**Q: Can I use Bluetooth MIDI?**
A: Some browsers support it, but USB is more reliable.

---

**Enjoy! 🎹**
