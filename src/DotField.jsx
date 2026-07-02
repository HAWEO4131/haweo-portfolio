import { memo, useEffect, useRef } from 'react';
import './DotField.css';

const TWO_PI = Math.PI * 2;

const DotField = memo(
  ({
    dotRadius = 1.4,
    dotSpacing = 18,
    cursorRadius = 360,
    bulgeStrength = 38,
    glowRadius = 190,
    gradientFrom = 'rgba(85, 247, 94, 0.38)',
    gradientTo = 'rgba(180, 255, 190, 0.2)',
    glowColor = 'rgba(85, 247, 94, 0.24)',
    className = '',
  }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const glowRef = useRef(null);
    const dotsRef = useRef([]);
    const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
    const sizeRef = useRef({ w: 0, h: 0 });
    const glowOpacityRef = useRef(0);
    const engagementRef = useRef(0);
    const rafRef = useRef(0);
    const frameRef = useRef(0);
    const lastDrawRef = useRef(0);
    const idleTimerRef = useRef(0);
    const resizeTimerRef = useRef(0);
    const glowIdRef = useRef(`dot-field-glow-${Math.random().toString(36).slice(2, 9)}`);

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const glow = glowRef.current;
      if (!container || !canvas || !glow) return undefined;

      const ctx = canvas.getContext('2d', { alpha: true });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const size = sizeRef.current;

      function queueTick(delay = 0) {
        window.clearTimeout(idleTimerRef.current);
        if (delay > 0) {
          idleTimerRef.current = window.setTimeout(() => {
            rafRef.current = window.requestAnimationFrame(tick);
          }, delay);
          return;
        }

        rafRef.current = window.requestAnimationFrame(tick);
      }

      function buildDots() {
        dots.length = 0;
        const step = dotRadius + dotSpacing;
        const cols = Math.max(1, Math.floor(size.w / step));
        const rows = Math.max(1, Math.floor(size.h / step));
        const padX = (size.w % step) / 2;
        const padY = (size.h % step) / 2;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const ax = padX + col * step + step / 2;
            const ay = padY + row * step + step / 2;
            dots.push({ ax, ay, sx: ax, sy: ay });
          }
        }
      }

      function doResize() {
        const rect = container.getBoundingClientRect();
        size.w = rect.width;
        size.h = rect.height;
        canvas.width = size.w * dpr;
        canvas.height = size.h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildDots();
      }

      function resize() {
        window.clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = window.setTimeout(doResize, 100);
      }

      function updateMouse(event) {
        const rect = container.getBoundingClientRect();
        const nextX = event.clientX - rect.left;
        const nextY = event.clientY - rect.top;
        const dx = nextX - mouse.x;
        const dy = nextY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouse.x = nextX;
        mouse.y = nextY;
        mouse.speed = Math.max(mouse.speed, mouse.prevX < -1000 ? 0 : dist * 0.9);
        mouse.prevX = nextX;
        mouse.prevY = nextY;
      }

      function tick() {
        const now = Date.now();
        if (document.hidden) {
          queueTick(500);
          return;
        }

        const isIdle =
          mouse.speed < 0.02 && engagementRef.current < 0.02 && glowOpacityRef.current < 0.02;
        if (isIdle && now - lastDrawRef.current < 180) {
          queueTick(180 - (now - lastDrawRef.current));
          return;
        }

        lastDrawRef.current = now;
        frameRef.current += 1;
        const targetEngagement = Math.min(mouse.speed / 5, 1);
        mouse.speed *= 0.78;
        if (mouse.speed < 0.001) mouse.speed = 0;
        engagementRef.current += (targetEngagement - engagementRef.current) * 0.06;
        if (engagementRef.current < 0.001) engagementRef.current = 0;
        glowOpacityRef.current += (engagementRef.current - glowOpacityRef.current) * 0.08;
        glow.setAttribute('cx', mouse.x);
        glow.setAttribute('cy', mouse.y);
        glow.style.opacity = glowOpacityRef.current;

        ctx.clearRect(0, 0, size.w, size.h);
        const grad = ctx.createLinearGradient(0, 0, size.w, size.h);
        grad.addColorStop(0, gradientFrom);
        grad.addColorStop(1, gradientTo);
        ctx.fillStyle = grad;
        ctx.beginPath();

        const crSq = cursorRadius * cursorRadius;
        const wave = prefersReduced ? 0 : Math.sin(frameRef.current * 0.012) * 0.35;

        for (const dot of dots) {
          const dx = mouse.x - dot.ax;
          const dy = mouse.y - dot.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < crSq && engagementRef.current > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / cursorRadius) ** 2 * bulgeStrength * engagementRef.current;
            const angle = Math.atan2(dy, dx);
            dot.sx += (dot.ax - Math.cos(angle) * force - dot.sx) * 0.15;
            dot.sy += (dot.ay - Math.sin(angle) * force - dot.sy) * 0.15;
          } else {
            dot.sx += (dot.ax - dot.sx) * 0.1;
            dot.sy += (dot.ay - dot.sy) * 0.1;
          }

          const drawY = dot.sy + Math.sin(dot.ax * 0.018 + frameRef.current * 0.018) * wave;
          ctx.moveTo(dot.sx + dotRadius, drawY);
          ctx.arc(dot.sx, drawY, dotRadius, 0, TWO_PI);
        }

        ctx.fill();
        queueTick();
      }

      doResize();
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', updateMouse, { passive: true });
      queueTick();

      return () => {
        window.cancelAnimationFrame(rafRef.current);
        window.clearTimeout(idleTimerRef.current);
        window.clearTimeout(resizeTimerRef.current);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', updateMouse);
      };
    }, [bulgeStrength, cursorRadius, dotRadius, dotSpacing, glowColor, gradientFrom, gradientTo]);

    return (
      <div className={`dot-field-container ${className}`} ref={containerRef} aria-hidden="true">
        <canvas ref={canvasRef} />
        <svg>
          <defs>
            <radialGradient id={glowIdRef.current}>
              <stop offset="0%" stopColor={glowColor} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle
            ref={glowRef}
            cx="-9999"
            cy="-9999"
            r={glowRadius}
            fill={`url(#${glowIdRef.current})`}
            style={{ opacity: 0 }}
          />
        </svg>
      </div>
    );
  },
);

DotField.displayName = 'DotField';

export default DotField;
