'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

export default function Portrait() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const zoom = useTransform(scrollY, [0, 800, 2400], [1, 1.3, 1.45]);
  const scale = useSpring(zoom, { stiffness: 180, damping: 28, restDelta: 0.001 });

  return <div className="about-portrait"><div className="portrait-frame">
    <motion.img
      src="/images/abolfazl.png"
      alt="Abolfazl Jamshidi"
      width="1024"
      height="1536"
      fetchPriority="high"
      style={{ scale: shouldReduceMotion ? 1 : scale, transformOrigin: '50% 35%' }}
    />
  </div></div>;
}
