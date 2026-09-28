import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Artist, Locale } from '../lib/content';

type Props = { artists: Artist[]; locale: Locale };
type Gesture = { pointerId: number; cardIndex: number; startX: number; startY: number; startTime: number; origin: number };
type Pose = { x: number; y: number; scale: number; opacity: number; rotate: number; rotateY: number };

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
  onPointerCancel: () => void;
  onKeyDown: (key: string) => void;
  onSelect: (artist: Artist) => void;
  wasDragged: () => boolean;
};

function HeroCard({
  artist, index, count, active, locale, progress, dragX, dragY, draggedIndex,
  onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown, onSelect, wasDragged,
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

export default function HeroCollage({ artists, locale }: Props) {
  const cards = artists.filter((artist) => artist.imageUrl);
  const initial = cards.length > 1 ? 1 : 0;
  const [active, setActive] = useState(initial);
  const activeRef = useRef(initial);
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(260);
  const gestureRef = useRef<Gesture | null>(null);
  const draggedRef = useRef(false);
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

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (!event.isPrimary || event.button !== 0) return;
    stopAnimations();
    dragX.set(0);
    dragY.set(0);
    draggedIndex.set(-1);
    draggedRef.current = false;
    gestureRef.current = {
      pointerId: event.pointerId,
      cardIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      startTime: performance.now(),
      origin: progress.get(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
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

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (!draggedRef.current) return;
    const dx = event.clientX - gesture.startX;
    const elapsed = Math.max(1, performance.now() - gesture.startTime);
    const threshold = window.innerWidth <= 760 ? 45 : 70;
    if (cards.length > 1 && (Math.abs(dx) > threshold || (Math.abs(dx) > 20 && Math.abs(dx / elapsed) > 0.65))) {
      activeRef.current += dx < 0 ? 1 : -1;
      setActive(modulo(activeRef.current, cards.length));
    }
    settle(activeRef.current);
  };

  const onPointerCancel = () => {
    gestureRef.current = null;
    if (draggedRef.current) settle(activeRef.current);
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
          onKeyDown={(key) => turn(key === 'ArrowLeft' ? -1 : 1)}
          onSelect={openArtist}
          wasDragged={() => draggedRef.current}
        />
      ))}
      <div className="hero-collage__sticker" aria-hidden="true"><img src="/mellow-lips.png" alt="" /></div>
    </div>
  );
}
