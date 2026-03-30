/**
 * Fisher-Yates shuffle queue.
 * Cycles through every item once in random order before reshuffling.
 * Guarantees no immediate repeats across reshuffle boundaries.
 */
export function createShuffledQueue(items) {
  let queue = [];
  let lastItem = null;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function refill() {
    queue = shuffle(items);
    // Avoid repeating the last item from the previous round
    if (queue.length > 1 && lastItem && queue[0] === lastItem) {
      const swapIdx = 1 + Math.floor(Math.random() * (queue.length - 1));
      [queue[0], queue[swapIdx]] = [queue[swapIdx], queue[0]];
    }
  }

  return {
    next() {
      if (queue.length === 0) refill();
      lastItem = queue.shift();
      return lastItem;
    },
  };
}
