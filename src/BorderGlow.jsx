import { useCallback, useEffect, useRef } from 'react';
import './BorderGlow.css';

const gradientPositions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const gradientKeys = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function parseHsl(hsl) {
  const match = hsl.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) {
    return { h: 127, s: 100, l: 72 };
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHsl(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];

  return opacities.reduce((vars, opacity, index) => {
    vars[`--glow-color${keys[index]}`] = `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`;
    return vars;
  }, {});
}

function buildGradientVars(colors) {
  const vars = {};

  for (let i = 0; i < gradientPositions.length; i += 1) {
    const color = colors[Math.min(colorMap[i], colors.length - 1)];
    vars[gradientKeys[i]] = `radial-gradient(at ${gradientPositions[i]}, ${color} 0px, transparent 50%)`;
  }

  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) {
  return 1 - (1 - x) ** 3;
}

function easeInCubic(x) {
  return x ** 3;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const startTime = performance.now() + delay;
  let timeoutId;
  let frameId;

  function tick() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(progress));

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
      return;
    }

    onEnd?.();
  }

  timeoutId = window.setTimeout(() => {
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  };
}

function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 26,
  glowColor = '127 100 72',
  backgroundColor = 'rgba(13, 18, 15, 0.76)',
  borderRadius = 0,
  glowRadius = 34,
  glowIntensity = 1,
  coneSpread = 24,
  animated = false,
  colors = ['#72ff82', '#aaff72', '#38ff9c'],
  fillOpacity = 0.28,
  ...props
}) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef(null);

  const getCenter = useCallback((element) => {
    const { width, height } = element.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (element, x, y) => {
      const [centerX, centerY] = getCenter(element);
      const dx = x - centerX;
      const dy = y - centerY;
      const kx = dx === 0 ? Infinity : centerX / Math.abs(dx);
      const ky = dy === 0 ? Infinity : centerY / Math.abs(dy);

      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenter],
  );

  const getCursorAngle = useCallback(
    (element, x, y) => {
      const [centerX, centerY] = getCenter(element);
      const dx = x - centerX;
      const dy = y - centerY;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      return degrees < 0 ? degrees + 360 : degrees;
    },
    [getCenter],
  );

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;
      if (!card) {
        return;
      }

      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (frameRef.current) {
        return;
      }

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const currentCard = cardRef.current;
        const pointer = pointerRef.current;

        if (!currentCard || !pointer) {
          return;
        }

        const rect = currentCard.getBoundingClientRect();
        const x = pointer.x - rect.left;
        const y = pointer.y - rect.top;
        const edge = getEdgeProximity(currentCard, x, y);
        const angle = getCursorAngle(currentCard, x, y);

        currentCard.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
        currentCard.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
      });
    },
    [getCursorAngle, getEdgeProximity],
  );

  const handlePointerLeave = useCallback(() => {
    pointerRef.current = null;
    cardRef.current?.style.setProperty('--edge-proximity', '0');
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card) {
      return undefined;
    }

    const cleanups = [];
    const angleStart = 110;
    const angleEnd = 465;

    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    cleanups.push(animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty('--edge-proximity', value) }));
    cleanups.push(
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (value) => {
          card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
    );
    cleanups.push(
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (value) => {
          card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
    );
    cleanups.push(
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (value) => card.style.setProperty('--edge-proximity', value),
        onEnd: () => card.classList.remove('sweep-active'),
      }),
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      card.classList.remove('sweep-active');
    };
  }, [animated]);

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`.trim()}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

export default BorderGlow;
