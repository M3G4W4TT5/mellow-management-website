import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent, type RefObject, type TouchEvent } from 'react';
import type { Artist, Locale } from '../lib/content';

type Props = { artists: Artist[]; locale: Locale };
type Gesture = { pointerId: number; cardIndex: number; startX: number; startY: number; startTime: number; origin: number };
type Pose = { x: number; y: number; scale: number; opacity: number; rotate: number; rotateY: number };
type PuckBounds = { minX: number; maxX: number; minY: number; maxY: number; baseLeft: number; baseTop: number; size: number; heroWidth: number; heroHeight: number };
type PuckGesture = { pointerId: number; startX: number; startY: number; originX: number; originY: number; lastX: number; lastY: number; lastTime: number };

function modulo(value: number, length: number): number {
  return ((value % length) + length) % length;
}

function relativePosition(index: number, progress: number, length: number): number {
  const half = length / 2;
  return modulo(index - progress + half, length) - half;
}

function poseFor(relative: number, count: number): Pose {
  const distance = Math.abs(relative);
  const sign = Math.sign(relative);

  if (distance <= 1) {
    return {
      x: sign * 82 * distance,
      y: 8 * distance,
      scale: 1 - 0.09 * distance,
      opacity: 1,
      rotate: sign * 9 * distance,
      rotateY: sign * 10 * distance,
    };
  }

  if (distance <= 1.3) {
    const part = (distance - 1) / 0.3;
    return {
      x: sign * (82 + 22 * part),
      y: 8 + 8 * part,
      scale: 0.91 - 0.13 * part,
      opacity: 1 - 0.3 * part,
      rotate: sign * (9 + 5 * part),
      rotateY: sign * (10 + 10 * part),
    };
  }

  const backAt = Math.min(2, count / 2);
  const part = Math.min(1, (distance - 1.3) / (backAt - 1.3));
  return {
    x: sign * 104 * (1 - part),
    y: 16 - 4 * part,
    scale: 0.78 - 0.28 * part,
    opacity: 0.7 * (1 - part),
    rotate: sign * 14 * (1 - part),
    rotateY: sign * 20 * (1 - part),
  };
}

function offsetCss(percent: number, pixels: number): string {
  return 'calc(' + percent + '% ' + (pixels < 0 ? '-' : '+') + ' ' + Math.abs(pixels) + 'px)';
}

type CardProps = {
  artist: Artist;
  index: number;
  count: number;
  active: number;
  locale: Locale;
  progress: MotionValue<number>;
  dragX: MotionValue<number>;
  dragY: MotionValue<number>;
  draggedIndex: MotionValue<number>;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, index: number) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLButtonElement>, index: number) => void;
  onTouchMove: (event: TouchEvent<HTMLButtonElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLButtonElement>) => void;
  onTouchCancel: () => void;
  onKeyDown: (key: string) => void;
  onSelect: (artist: Artist) => void;
  wasDragged: () => boolean;
};

function HeroCard({
  artist, index, count, active, locale, progress, dragX, dragY, draggedIndex,
  onPointerDown, onPointerMove, onPointerUp, onPointerCancel,
  onTouchStart, onTouchMove, onTouchEnd, onTouchCancel, onKeyDown, onSelect, wasDragged,
}: CardProps) {
  const isDragged = () => draggedIndex.get() === index;
  const getPose = () => poseFor(relativePosition(index, progress.get(), count), count);
  const x = useTransform(() => offsetCss(getPose().x, isDragged() ? dragX.get() * 0.42 : 0));
  const y = useTransform(() => offsetCss(getPose().y, isDragged() ? dragY.get() * 0.55 : 0));
  const scale = useTransform(() => getPose().scale);
  const opacity = useTransform(() => getPose().opacity);
  const rotate = useTransform(() => getPose().rotate);
  const rotateY = useTransform(() => getPose().rotateY);
  const zIndex = useTransform(() => Math.round(100 - Math.abs(relativePosition(index, progress.get(), count)) * 40));
  const visible = Math.abs(relativePosition(index, active, count)) <= 1;

  return (
    <motion.button
      type="button"
      className="hero-collage__card"
      aria-label={locale === 'da' ? 'Se ' + artist.name : 'View ' + artist.name}
      aria-hidden={!visible}
      aria-current={index === modulo(active, count) ? 'true' : undefined}
      tabIndex={visible ? 0 : -1}
      style={{ x, y, scale, opacity, rotate, rotateY, zIndex, pointerEvents: visible ? 'auto' : 'none' }}
      onPointerDown={(event) => onPointerDown(event, index)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onTouchStart={(event) => onTouchStart(event, index)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      onClick={() => {
        if (!wasDragged()) onSelect(artist);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          onKeyDown(event.key);
        }
      }}
    >
      <img src={artist.imageUrl} alt="" draggable={false} loading="eager" />
      <span className="hero-collage__tag" aria-hidden="true">{artist.name}</span>
    </motion.button>
  );
}

function StickerPuck({ collageRef, locale }: { collageRef: RefObject<HTMLDivElement | null>; locale: Locale }) {
  const puckRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const boundsRef = useRef<PuckBounds | null>(null);
  const gestureRef = useRef<PuckGesture | null>(null);
  const velocityRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const wakeRef = useRef<() => void>(() => {});
  const reducedMotion = useReducedMotion();

  const measureBounds = () => {
    const puck = puckRef.current;
    const collage = collageRef.current;
    const hero = puck?.closest<HTMLElement>('.hero');
    if (!puck || !collage || !hero) return;
    const heroRect = hero.getBoundingClientRect();
    const collageRect = collage.getBoundingClientRect();
    const size = puck.offsetWidth;
    const baseLeft = collageRect.left - heroRect.left + puck.offsetLeft;
    const baseTop = collageRect.top - heroRect.top + puck.offsetTop;
    boundsRef.current = {
      minX: -baseLeft,
      maxX: Math.max(-baseLeft, hero.clientWidth - size - baseLeft),
      minY: -baseTop,
      maxY: Math.max(-baseTop, hero.clientHeight - size - baseTop),
      baseLeft, baseTop, size, heroWidth: hero.clientWidth, heroHeight: hero.clientHeight,
    };
    x.set(Math.max(boundsRef.current.minX, Math.min(boundsRef.current.maxX, x.get())));
    y.set(Math.max(boundsRef.current.minY, Math.min(boundsRef.current.maxY, y.get())));
  };

  useEffect(() => {
    const collage = collageRef.current;
    const hero = puckRef.current?.closest<HTMLElement>('.hero');
    if (!collage || !hero) return;
    let lastFrame = 0;
    let awakeUntil = 0;

    const cardEscape = (nextX: number, nextY: number, step: number): boolean => {
      const bounds = boundsRef.current;
      if (!bounds) return false;
      const cards = Array.from(collage.querySelectorAll<HTMLElement>('.hero-collage__card[aria-hidden="false"]'));
      if (!cards.length) return false;
      const heroRect = hero.getBoundingClientRect();
      const rects = cards.map((card) => card.getBoundingClientRect());
      const radius = bounds.size / 2;
      const left = Math.min(...rects.map((rect) => rect.left)) - heroRect.left - radius - 4;
      const right = Math.max(...rects.map((rect) => rect.right)) - heroRect.left + radius + 4;
      const top = Math.min(...rects.map((rect) => rect.top)) - heroRect.top - radius - 4;
      const bottom = Math.max(...rects.map((rect) => rect.bottom)) - heroRect.top + radius + 4;
      const centerX = bounds.baseLeft + nextX + radius;
      const centerY = bounds.baseTop + nextY + radius;
      if (centerX <= left || centerX >= right || centerY <= top || centerY >= bottom) return false;

      const exits = [
        { distance: centerX - left, x: -1, y: 0, possible: left >= radius },
        { distance: right - centerX, x: 1, y: 0, possible: right <= bounds.heroWidth - radius },
        { distance: centerY - top, x: 0, y: -1, possible: top >= radius },
        { distance: bottom - centerY, x: 0, y: 1, possible: bottom <= bounds.heroHeight - radius },
      ].filter((exit) => exit.possible).sort((a, b) => a.distance - b.distance);
      const exit = exits[0];
      if (!exit) return false;
      velocityRef.current.x += exit.x * 1.5 * step;
      velocityRef.current.y += exit.y * 1.5 * step;
      return true;
    };

    const tick = (now: number) => {
      frameRef.current = 0;
      const step = lastFrame ? Math.min(2.5, Math.max(0.5, (now - lastFrame) / 16.67)) : 1;
      lastFrame = now;
      const bounds = boundsRef.current;
      if (!bounds || gestureRef.current) return;

      const velocity = velocityRef.current;
      const friction = Math.pow(0.985, step);
      velocity.x *= friction;
      velocity.y *= friction;
      let nextX = x.get() + velocity.x * step;
      let nextY = y.get() + velocity.y * step;
      if (nextX < bounds.minX) { nextX = bounds.minX; velocity.x = Math.abs(velocity.x) * 0.82; }
      if (nextX > bounds.maxX) { nextX = bounds.maxX; velocity.x = -Math.abs(velocity.x) * 0.82; }
      if (nextY < bounds.minY) { nextY = bounds.minY; velocity.y = Math.abs(velocity.y) * 0.82; }
      if (nextY > bounds.maxY) { nextY = bounds.maxY; velocity.y = -Math.abs(velocity.y) * 0.82; }
      const underCards = cardEscape(nextX, nextY, step);
      const speed = Math.hypot(velocity.x, velocity.y);
      if (speed > 24) { velocity.x *= 24 / speed; velocity.y *= 24 / speed; }
      x.set(nextX);
      y.set(nextY);
      if (underCards || speed > 0.08 || now < awakeUntil) frameRef.current = requestAnimationFrame(tick);
      else velocityRef.current = { x: 0, y: 0 };
    };

    const wake = () => {
      awakeUntil = performance.now() + 1600;
      if (!frameRef.current && !gestureRef.current) { lastFrame = 0; frameRef.current = requestAnimationFrame(tick); }
    };
    wakeRef.current = wake;
    const resize = () => { measureBounds(); wake(); };
    measureBounds();
    const observer = new ResizeObserver(resize);
    observer.observe(hero);
    observer.observe(collage);
    collage.addEventListener('pointerup', wake);
    collage.addEventListener('keydown', wake);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      collage.removeEventListener('pointerup', wake);
      collage.removeEventListener('keydown', wake);
      window.removeEventListener('resize', resize);
      wakeRef.current = () => {};
    };
  }, [collageRef, x, y]);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    measureBounds();
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    velocityRef.current = { x: 0, y: 0 };
    gestureRef.current = {
      pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      originX: x.get(), originY: y.get(), lastX: x.get(), lastY: y.get(), lastTime: event.timeStamp,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current;
    const bounds = boundsRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId || !bounds) return;
    const nextX = Math.max(bounds.minX, Math.min(bounds.maxX, gesture.originX + event.clientX - gesture.startX));
    const nextY = Math.max(bounds.minY, Math.min(bounds.maxY, gesture.originY + event.clientY - gesture.startY));
    const elapsed = Math.max(8, event.timeStamp - gesture.lastTime);
    velocityRef.current = {
      x: Math.max(-24, Math.min(24, (nextX - gesture.lastX) * 16.67 / elapsed)),
      y: Math.max(-24, Math.min(24, (nextY - gesture.lastY) * 16.67 / elapsed)),
    };
    x.set(nextX);
    y.set(nextY);
    gesture.lastX = nextX;
    gesture.lastY = nextY;
    gesture.lastTime = event.timeStamp;
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (event.timeStamp - gesture.lastTime > 80 || reducedMotion) velocityRef.current = { x: 0, y: 0 };
    wakeRef.current();
  };

  return (
    <motion.button
      ref={puckRef}
      type="button"
      className="hero-collage__puck"
      aria-label={locale === 'da' ? 'Skub læbeklistermærket med piletasterne' : 'Nudge the lips sticker with arrow keys'}
      style={{ x, y }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { gestureRef.current = null; velocityRef.current = { x: 0, y: 0 }; wakeRef.current(); }}
      onKeyDown={(event) => {
        const impulse = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] }[event.key];
        if (!impulse) return;
        event.preventDefault();
        velocityRef.current.x += impulse[0];
        velocityRef.current.y += impulse[1];
        wakeRef.current();
      }}
    >
      <span className="hero-collage__sticker"><img src="/mellow-lips.png" alt="" draggable={false} /></span>
    </motion.button>
  );
}

export default function HeroCollage({ artists, locale }: Props) {
  const cards = artists.filter((artist) => artist.imageUrl);
  const initial = cards.length > 1 ? 1 : 0;
  const [active, setActive] = useState(initial);
  const activeRef = useRef(initial);
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(260);
  const gestureRef = useRef<Gesture | null>(null);
  const draggedRef = useRef(false);
  const lastTouchEndRef = useRef(0);
  const suppressClickUntilRef = useRef(0);
  const animationGeneration = useRef(0);
  const animations = useRef<Array<{ stop: () => void }>>([]);
  const progress = useMotionValue(initial);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const draggedIndex = useMotionValue(-1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateStep = () => {
      const width = rootRef.current?.clientWidth || 800;
      stepRef.current = width * (window.innerWidth <= 760 ? 0.328 : 0.254);
    };
    updateStep();
    const observer = new ResizeObserver(updateStep);
    if (rootRef.current) observer.observe(rootRef.current);
    window.addEventListener('resize', updateStep);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStep);
      animations.current.forEach((animation) => animation.stop());
    };
  }, []);

  if (!cards.length) return null;

  const stopAnimations = () => {
    animationGeneration.current += 1;
    animations.current.forEach((animation) => animation.stop());
    animations.current = [];
  };

  const settle = (target: number) => {
    stopAnimations();
    const generation = animationGeneration.current;
    const transition = reducedMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 220, damping: 28 };
    const progressAnimation = animate(progress, target, transition);
    const xAnimation = animate(dragX, 0, transition);
    const yAnimation = animate(dragY, 0, transition);
    animations.current = [progressAnimation, xAnimation, yAnimation];
    xAnimation.then(() => {
      if (animationGeneration.current === generation) draggedIndex.set(-1);
    });
  };

  const turn = (direction: number) => {
    if (cards.length < 2) return;
    activeRef.current += direction;
    setActive(modulo(activeRef.current, cards.length));
    settle(activeRef.current);
  };

  const beginGesture = (pointerId: number, index: number, clientX: number, clientY: number) => {
    stopAnimations();
    dragX.set(0);
    dragY.set(0);
    draggedIndex.set(-1);
    draggedRef.current = false;
    suppressClickUntilRef.current = 0;
    gestureRef.current = {
      pointerId,
      cardIndex: index,
      startX: clientX,
      startY: clientY,
      startTime: performance.now(),
      origin: progress.get(),
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType === 'touch' || !event.isPrimary || event.button !== 0) return;
    if (event.pointerType === 'mouse' && performance.now() - lastTouchEndRef.current < 700) return;
    beginGesture(event.pointerId, index, event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveGesture = (pointerId: number, clientX: number, clientY: number) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== pointerId) return;
    const dx = clientX - gesture.startX;
    const dy = clientY - gesture.startY;
    if (!draggedRef.current && Math.hypot(dx, dy) > 5) {
      draggedRef.current = true;
      draggedIndex.set(gesture.cardIndex);
    }
    if (!draggedRef.current) return;
    dragX.set(dx);
    dragY.set(Math.max(-45, Math.min(45, dy)));
    const movement = Math.max(-1.15, Math.min(1.15, -dx * 0.65 / stepRef.current));
    progress.set(gesture.origin + movement);
  };

  const endGesture = (pointerId: number, clientX: number) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== pointerId) return;
    gestureRef.current = null;
    if (!draggedRef.current) return;
    suppressClickUntilRef.current = performance.now() + 500;
    const dx = clientX - gesture.startX;
    const elapsed = Math.max(1, performance.now() - gesture.startTime);
    const threshold = window.innerWidth <= 760 ? 45 : 70;
    if (cards.length > 1 && (Math.abs(dx) > threshold || (Math.abs(dx) > 20 && Math.abs(dx / elapsed) > 0.65))) {
      activeRef.current += dx < 0 ? 1 : -1;
      setActive(modulo(activeRef.current, cards.length));
    }
    settle(activeRef.current);
  };

  const cancelGesture = () => {
    gestureRef.current = null;
    if (draggedRef.current) {
      suppressClickUntilRef.current = performance.now() + 500;
      settle(activeRef.current);
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'touch') moveGesture(event.pointerId, event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return;
    endGesture(event.pointerId, event.clientX);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onPointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return;
    cancelGesture();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onTouchStart = (event: TouchEvent<HTMLButtonElement>, index: number) => {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    beginGesture(touch.identifier, index, touch.clientX, touch.clientY);
  };

  const onTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = Array.from(event.touches).find((item) => item.identifier === gestureRef.current?.pointerId);
    if (touch) moveGesture(touch.identifier, touch.clientX, touch.clientY);
  };

  const onTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    lastTouchEndRef.current = performance.now();
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === gestureRef.current?.pointerId);
    if (touch) endGesture(touch.identifier, touch.clientX);
  };

  const onTouchCancel = () => {
    lastTouchEndRef.current = performance.now();
    cancelGesture();
  };

  const openArtist = (artist: Artist) => {
    window.dispatchEvent(new CustomEvent('mellow:select-artist', { detail: { slug: artist.slug } }));
  };

  return (
    <div ref={rootRef} className="hero-collage" role="region" aria-roledescription="carousel" aria-label={locale === 'da' ? 'Artister' : 'Artists'}>
      <span className="visually-hidden">{locale === 'da' ? 'Træk eller swipe for at se flere artister. Brug piletasterne, når et billede har fokus.' : 'Drag or swipe to see more artists. Use the arrow keys when a picture is focused.'}</span>
      {cards.map((artist, index) => (
        <HeroCard
          key={artist.slug}
          artist={artist}
          index={index}
          count={cards.length}
          active={active}
          locale={locale}
          progress={progress}
          dragX={dragX}
          dragY={dragY}
          draggedIndex={draggedIndex}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
          onKeyDown={(key) => turn(key === 'ArrowLeft' ? -1 : 1)}
          onSelect={openArtist}
          wasDragged={() => draggedRef.current || performance.now() < suppressClickUntilRef.current}
        />
      ))}
      <StickerPuck collageRef={rootRef} locale={locale} />
    </div>
  );
}
