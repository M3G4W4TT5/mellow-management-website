import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Artist, Locale } from '../lib/content';
import { localized } from '../lib/content';

type Props = { artists: Artist[]; locale: Locale };

function spotifyEmbed(url?: string): string | undefined {
  if (!url) return;
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/artist\/([a-zA-Z0-9]+)\/?$/);
    if (parsed.hostname !== 'open.spotify.com' || !match) return;
    return `https://open.spotify.com/embed/artist/${match[1]}?utm_source=generator`;
  } catch {
    return;
  }
}

export default function ArtistBrowser({ artists, locale }: Props) {
  const [active, setActive] = useState(0);
  const namesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const detailsRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const artist = artists[active];

  const setFromScroll = useCallback(() => {
    if (window.innerWidth >= 900 || !namesRef.current.length) return;
    const target = window.innerHeight * 0.48;
    let best = 0;
    let distance = Number.POSITIVE_INFINITY;
    namesRef.current.forEach((node, index) => {
      if (!node) return;
      const box = node.getBoundingClientRect();
      const next = Math.abs(box.top + box.height / 2 - target);
      if (next < distance) { best = index; distance = next; }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(setFromScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [setFromScroll]);

  if (!artist) return <p className="empty-roster">{locale === 'da' ? 'Artister kommer snart.' : 'Artists coming soon.'}</p>;
  const embed = spotifyEmbed(artist.spotifyArtistUrl);
  const select = (index: number) => {
    setActive(index);
    if (window.innerWidth < 900) {
      window.setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' }), 80);
    }
  };

  return (
    <div className="artist-browser" style={{ '--artist-accent': artist.color } as React.CSSProperties}>
      <div className="artist-browser__visual" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.div key={artist.slug} className="artist-browser__visual-inner"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.38 }}>
            {artist.imageUrl ? <img src={artist.imageUrl} alt="" /> : <div className="artist-browser__placeholder"><span>{artist.name}</span></div>}
          </motion.div>
        </AnimatePresence>
        <span className="artist-browser__visual-number">{String(active + 1).padStart(2, '0')} / {String(artists.length).padStart(2, '0')}</span>
      </div>

      <div className="artist-browser__names" aria-label={locale === 'da' ? 'Artister' : 'Artists'}>
        {artists.map((item, index) => (
          <button ref={(node) => { namesRef.current[index] = node; }} type="button"
            key={item.slug} className={`artist-browser__name ${index === active ? 'is-active' : ''}`}
            aria-current={index === active ? 'true' : undefined} aria-controls="artist-details"
            onClick={() => select(index)}>
            <span className="artist-browser__index">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.name}</span><span className="artist-browser__arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <section className="artist-browser__details" id="artist-details" ref={detailsRef} aria-live="polite">
        <h3>{artist.name}</h3>
        <p className="artist-browser__description">{localized(artist.description, locale)}</p>
        {artist.achievements.length > 0 && <div className="artist-browser__achievements">
          {artist.achievements.map((achievement, index) => <p key={index}>{localized(achievement, locale)}</p>)}
        </div>}
        {artist.links.length > 0 && <div className="artist-browser__links">{artist.links.map((link) => <a href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}
        {artist.spotifyArtistUrl && <div className="artist-browser__spotify">
          {embed ? <iframe title={`${artist.name} Spotify`} src={embed} width="100%" height="352" loading="eager" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /> :
            <a href={artist.spotifyArtistUrl} target="_blank" rel="noopener noreferrer">{locale === 'da' ? 'Hør på Spotify' : 'Listen on Spotify'} ↗</a>}
        </div>}
        {artist.imageCredit && artist.imageUrl && <small className="artist-browser__credit">{locale === 'da' ? 'Foto' : 'Photo'}: {artist.imageCredit}</small>}
      </section>
    </div>
  );
}
