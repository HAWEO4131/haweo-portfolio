import { useCallback, useEffect, useRef } from 'react';
import './ClickSpark.css';

function ClickSpark({
  children,
  sparkColor = '#72ff82',
  sparkSize = 12,
  sparkRadius = 24,
  sparkCount = 8,
  duration = 460,
  easing = 'ease-out',
  extraScale = 1,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const drawRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const resizeCanvas = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const ease = useCallback(
    (t) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing],
  );

  const draw = useCallback(
    (timestamp) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationRef.current = null;
        return;
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = ease(progress);
        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.globalAlpha = 1 - progress;
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      ctx.globalAlpha = 1;

      if (sparksRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(drawRef.current);
        return;
      }

      animationRef.current = null;
    },
    [duration, ease, extraScale, sparkColor, sparkRadius, sparkSize],
  );

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event) => {
    if (!canvasRef.current || event.button !== 0) {
      return;
    }

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, index) => ({
      x: event.clientX,
      y: event.clientY,
      angle: (2 * Math.PI * index) / sparkCount,
      startTime: now,
    }));

    sparksRef.current.push(...newSparks);

    if (!animationRef.current && drawRef.current) {
      animationRef.current = requestAnimationFrame(drawRef.current);
    }
  };

  return (
    <div className="click-spark-root" onPointerDown={handlePointerDown}>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {children}
    </div>
  );
}

export default ClickSpark;
