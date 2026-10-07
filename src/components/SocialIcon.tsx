export type SocialPlatform = 'Spotify' | 'Instagram' | 'Facebook';

export default function SocialIcon({ platform }: { platform: SocialPlatform }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {platform === 'Spotify' && <>
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path d="M6 9c4-1.3 8-1 12 1M7 12.5c3.4-1 6.8-.8 10 1M8 16c2.7-.7 5.4-.5 8 .7" stroke="var(--social-icon-background, #f5db36)" strokeWidth="1.7" strokeLinecap="round" />
      </>}
      {platform === 'Instagram' && <>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </>}
      {platform === 'Facebook' && <path fill="currentColor" d="M14 22v-9h3l.5-4H14V7c0-1.2.3-2 2-2h2V1.4A23 23 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v9z" />}
    </svg>
  );
}
