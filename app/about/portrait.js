'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

export default function Portrait() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.0001 });
  const scale = useTransform(progress, [0, 1], [1, 1.3]);

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
