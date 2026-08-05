export function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId;
  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);
    clearTimeout(timeoutId);
    if (remaining <= 0) {
      lastCall = now;
      fn.apply(this, args);
    } else {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
