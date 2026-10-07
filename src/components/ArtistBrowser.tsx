import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import ArrowUpRight from './ArrowUpRight';
import type {Artist,Locale,SiteContent} from '../lib/content-model';
import {defaultText} from '../lib/content-defaults';
import {localized,linkLabel} from '../lib/content-model';

type Props = { artists: Artist[]; locale: Locale; text?: SiteContent['text'] };

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

export default function ArtistBrowser({ artists, locale, text=defaultText }: Props) {
  const [active, setActive] = useState(0);
  const detailsRef = useRef<HTMLElement | null>(null);
  const namesRef = useRef<HTMLDivElement | null>(null);
  const scrollFrame = useRef(0);
  const reduceMotion = useReducedMotion();
  const artist = artists[active];

  useEffect(() => {
    const onHeroSelect = (event: Event) => {
      const slug = (event as CustomEvent<{ slug: string }>).detail?.slug;
      const index = artists.findIndex((item) => item.slug === slug);
      if (index < 0) return;
      setActive(index);
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = window.requestAnimationFrame(() => {
        if (detailsRef.current) detailsRef.current.scrollTop = 0;
        detailsRef.current?.focus({ preventScroll: true });
        detailsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
      });
    };
    window.addEventListener('mellow:select-artist', onHeroSelect);
    return () => { window.removeEventListener('mellow:select-artist', onHeroSelect); cancelAnimationFrame(scrollFrame.current); };
  }, [artists, reduceMotion]);

  useEffect(() => {
    const panels = [namesRef.current, detailsRef.current].filter((panel): panel is HTMLElement => Boolean(panel));
    const continuePageScroll = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const panel = event.currentTarget as HTMLElement;
      const atTop = panel.scrollTop <= 1;
      const atBottom = panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 1;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        // Keep wheel scrolling continuous in browsers that latch onto the inner panel.
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        window.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
      }
    };
    panels.forEach((panel) => panel.addEventListener('wheel', continuePageScroll, { passive: false }));
    return () => panels.forEach((panel) => panel.removeEventListener('wheel', continuePageScroll));
  }, []);

  if (!artist) return <p className="empty-roster">{localized(text.emptyRoster,locale)}</p>;
  const embed = spotifyEmbed(artist.spotifyArtistUrl);
  const select = (index: number) => {
    setActive(index);
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = window.requestAnimationFrame(() => {
      if (detailsRef.current) detailsRef.current.scrollTop = 0;
      detailsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
    });
  };

  return (
    <div className="artist-browser" style={{ '--artist-accent': artist.color } as React.CSSProperties}>
      <div className="artist-browser__visual" role="img" aria-label={localized(artist.imageAlt,locale) || artist.name}>
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

      <div className="artist-browser__names" ref={namesRef} role="region" tabIndex={0} aria-label={localized(text.artistsLink,locale)}>
        {artists.map((item, index) => (
          <button type="button"
            key={item.slug} className={`artist-browser__name ${index === active ? 'is-active' : ''}`}
            aria-current={index === active ? 'true' : undefined} aria-controls="artist-details"
            onClick={() => select(index)}>
            <span className="artist-browser__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="artist-browser__thumb" aria-hidden="true">{item.imageUrl && <img src={item.thumbImageUrl || item.imageUrl} alt="" loading="lazy" />}</span>
            <span className="artist-browser__name-text">{item.name}</span><span className="artist-browser__arrow" aria-hidden="true"><ArrowUpRight /></span>
          </button>
        ))}
      </div>

      <section className="artist-browser__details" id="artist-details" ref={detailsRef} tabIndex={0} aria-labelledby="artist-details-name" aria-live="polite">
        <h3 id="artist-details-name">{artist.name}</h3>
        <p className="artist-browser__description">{localized(artist.description, locale)}</p>
        {artist.achievements.length > 0 && <div className="artist-browser__achievements">
          {artist.achievements.map((achievement, index) => <p key={achievement._key || `${artist.slug}-highlight-${index}`}>{localized(achievement, locale)}</p>)}
        </div>}
        {artist.links.length > 0 && <div className="artist-browser__links">{artist.links.filter(link=>link.showInDetails!==false).map((link) => <a href={link.url} key={link._key || link.url} target="_blank" rel="noopener noreferrer">{linkLabel(link,locale)} <ArrowUpRight /></a>)}</div>}
        {artist.spotifyArtistUrl && artist.spotifyEmbedVisible!==false && <div className="artist-browser__spotify">
          {embed ? <iframe title={`${artist.name} — ${localized(text.spotifyPlayer,locale)}`} src={embed} width="100%" height="352" loading="eager" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" /> :
            <a href={artist.spotifyArtistUrl} target="_blank" rel="noopener noreferrer">{localized(text.spotifyLink,locale)} <ArrowUpRight /></a>}
        </div>}
        {artist.imageCredit && artist.imageUrl && <small className="artist-browser__credit">{localized(text.photoCredit,locale)}: {artist.imageCredit}</small>}
      </section>
    </div>
  );
}
