import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates a number from 0 -> target once the element scrolls into view.
 * @param {number} target - final value to count up to
 * @param {number} duration - animation duration in ms
 */
export default function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = null;
    let frameId;

    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(easeOutQuint(progress) * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, target, duration]);

  return { ref, value };
}
