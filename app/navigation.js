'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState(null);
  const pending = useRef(false);
  const timer = useRef(null);
  const recovery = useRef(null);

  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    clearTimeout(timer.current);
    clearTimeout(recovery.current);
    setPhase('reveal');
    timer.current = setTimeout(() => setPhase(null), 1000);
  }, [pathname]);

  useEffect(() => () => {
    clearTimeout(timer.current);
    clearTimeout(recovery.current);
  }, []);

  function navigate(event, href) {
    if (typeof href !== 'string' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    clearTimeout(timer.current);
    setPhase('cover');
    timer.current = setTimeout(() => {
      router.push(destination.pathname + destination.search + destination.hash);
      // A failed navigation must never leave the portfolio behind an overlay.
      recovery.current = setTimeout(() => {
        pending.current = false;
        setPhase(null);
      }, 5000);
    }, 700);
  }

  return <NavigationContext.Provider value={navigate}>
    <div className={phase === 'cover' ? 'navigation-exit' : undefined}>{children}</div>
    {phase && <div className={`route-curtain route-curtain-${phase}`} aria-hidden="true"><div /></div>}
  </NavigationContext.Provider>;
}

export default function Link({ href, children, ...props }) {
  const navigate = useContext(NavigationContext);
  return <NextLink {...props} href={href} onNavigate={(event) => navigate?.(event, href)}>{children}</NextLink>;
}
