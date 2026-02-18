# 👋 START HERE - Harmony Teacher

## 🎯 What is This?

An **interactive MIDI harmony trainer** that analyzes your keyboard playing in real-time and teaches you advanced harmonic concepts.

## ⚡ Quick Start (30 seconds)

### 1. Open Terminal
```bash
cd /Users/pier/Coding/harmony.teacher
```

### 2. Start the App
```bash
npm start
```

### 3. Open Browser
**Chrome/Edge/Opera** → http://localhost:5173

### 4. Connect MIDI Keyboard
- Plug in USB MIDI keyboard
- Allow MIDI access when prompted
- Click "Start Learning"

**That's it!** 🎉

---

## 🎹 First Exercise

1. Select **"Shared Tones Connection"**
2. Play **Dm7**: D F A C
3. Play **G7**: G B D F
4. Watch real-time analysis
5. Click **"Evaluate"**

---

## 📚 Documentation

- **BROWSER_MODE.md** - How browser mode works (recommended)
- **QUICK_START.md** - Detailed setup guide
- **README.md** - Full user guide
- **ARCHITECTURE.md** - Technical deep-dive
- **PROJECT_SUMMARY.md** - Complete overview

---

## 🐛 Issues?

### MIDI Not Working?
- **Use Chrome, Edge, or Opera** (Firefox/Safari don't support Web MIDI)
- Unplug/replug keyboard
- Check browser console (F12)

### Blank Screen?
```bash
# Refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

### Port Already in Use?
```bash
lsof -ti:5173 | xargs kill -9
npm start
```

---

## 💡 Tips

- Keep terminal open (don't close it)
- Use Chrome DevTools (F12) for debugging
- Hot reload enabled - changes appear instantly
- Try all exercises in order (beginner → advanced)

---

**Ready?**
```bash
npm start
```

**Happy learning! 🎵**
