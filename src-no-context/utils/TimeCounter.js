import { useEffect, useState, useRef } from "react";

// Utility: Format milliseconds into hh:mm:ss or mm:ss
const formatTime = (ms, showHours = false) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  return showHours ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// Component: Timer or Stopwatch
function TimeCounter({ mode = "timer", hours = 0, minutes = 0, seconds = 0 }) {
  //using useRef avoids recalculating or recreating values on each render.
  const totalMs = useRef((hours * 3600 + minutes * 60 + seconds) * 1000);
  const startTime = useRef(null);

  const [time, setTime] = useState(mode === "timer" ? totalMs.current : 0);

  useEffect(() => {
    startTime.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime.current;

      if (mode === "timer") {
        const remaining = totalMs.current - elapsed;
        if (remaining <= 0) {
          setTime(0);
          clearInterval(interval);
        } else {
          setTime(remaining);
        }
      } else {
        //In stopwatch mode, elapsed is a measure of time since start, but we care about how much progress toward the total we've made.
        const progress = elapsed;
        if (progress >= totalMs.current) {
          setTime(totalMs.current);
          clearInterval(interval);
        } else {
          setTime(progress);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const showHours = hours > 0;
  return <div className="timer">{formatTime(time, showHours)}</div>;
}

export default TimeCounter;
