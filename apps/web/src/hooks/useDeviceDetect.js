import { useState, useEffect } from "react";

export function useDeviceDetect() {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mobileCheck = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobileCheck);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPrefersReducedMotion(reducedMotion);

    const lowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
    const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
    setIsLowEnd(mobileCheck || reducedMotion || lowMemory || lowCores);
  }, []);

  return { isLowEnd, isMobile, prefersReducedMotion };
}
