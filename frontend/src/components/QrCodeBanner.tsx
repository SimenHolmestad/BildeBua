import React from 'react';
import { useAlbumInfo } from 'hooks/swr';
import type { BannerConfig } from 'api';

const ALBUM_REFRESH_INTERVAL = 15000;
const DEFAULT_HEIGHT_VH = 15;
const DEFAULT_IMAGE_COUNT = 30;
const DEFAULT_SPEED = 120;
const TEXT_HEIGHT_RATIO = 0.6;
const SIDE_GAP_RATIO = 1.5;

type QrCodeBannerProps = {
  albumName: string | null;
  config: BannerConfig | undefined;
};

const QrCodeBanner = ({ albumName, config }: QrCodeBannerProps) => {
  const heightVh = config?.height_vh ?? DEFAULT_HEIGHT_VH;
  const imageCount = config?.image_count ?? DEFAULT_IMAGE_COUNT;
  const speed = config?.speed_px_per_sec ?? DEFAULT_SPEED;
  const text = config?.text ?? '';

  const { albumInfo } = useAlbumInfo(ALBUM_REFRESH_INTERVAL, albumName ?? undefined);
  const [cycleKey, setCycleKey] = React.useState(0);

  const handleCycleEnd = React.useCallback(() => {
    setCycleKey((k) => k + 1);
  }, []);

  // Re-pick a random image batch only when a new cycle starts. We intentionally
  // do not depend on albumInfo: SWR returns a new array reference on every
  // refetch, which would otherwise reshuffle and reset the strip mid-cycle.
  // useMemo runs during render, so the body still reads the latest albumInfo
  // from closure when cycleKey actually changes.
  const cycleImages = React.useMemo(() => {
    const thumbnails = (albumInfo?.images ?? []).map((image) => image.thumbnail_url);
    if (thumbnails.length === 0 || imageCount === 0) return [];
    const shuffled = [...thumbnails];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, imageCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleKey, imageCount]);

  if (!config?.enabled || !albumName) {
    return null;
  }

  return (
    <div
      className="w-full overflow-hidden border-t border-base-200 bg-base-100"
      style={{ height: `${heightVh}vh` }}
      data-testid="qr-code-banner"
    >
      <BannerStrip
        key={cycleKey}
        images={cycleImages}
        text={text}
        heightVh={heightVh}
        speed={speed}
        onCycleEnd={handleCycleEnd}
      />
    </div>
  );
};

type BannerStripProps = {
  images: string[];
  text: string;
  heightVh: number;
  speed: number;
  onCycleEnd: () => void;
};

const BannerStrip = ({ images, text, heightVh, speed, onCycleEnd }: BannerStripProps) => {
  const stripRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const viewportWidth = window.innerWidth;
    const computeKeyframes = (width: number): Keyframe[] => [
      { transform: `translateX(${viewportWidth}px)` },
      { transform: `translateX(${-width}px)` },
    ];
    const computeDurationMs = (width: number) =>
      ((viewportWidth + width) / Math.max(speed, 1)) * 1000;

    let stripWidth = el.scrollWidth;
    const animation = el.animate(computeKeyframes(stripWidth), {
      duration: computeDurationMs(stripWidth),
      easing: 'linear',
      fill: 'forwards',
    });
    animation.onfinish = onCycleEnd;

    // The strip width grows as images finish loading. Update keyframes and
    // duration so the px-per-second speed stays constant; currentTime is
    // preserved by the WAAPI, which keeps the visible position stable.
    const observer = new ResizeObserver(() => {
      const newWidth = el.scrollWidth;
      if (newWidth === stripWidth) return;
      stripWidth = newWidth;
      const effect = animation.effect;
      if (effect instanceof KeyframeEffect) {
        effect.setKeyframes(computeKeyframes(newWidth));
        effect.updateTiming({ duration: computeDurationMs(newWidth) });
      }
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      animation.cancel();
    };
  }, [speed, onCycleEnd]);

  const fontSize = `${heightVh * TEXT_HEIGHT_RATIO}vh`;
  const sideGap = `${heightVh * SIDE_GAP_RATIO}vh`;

  return (
    <div
      ref={stripRef}
      className="flex h-full items-center"
      style={{
        width: 'max-content',
        whiteSpace: 'nowrap',
        transform: 'translateX(100vw)',
        willChange: 'transform',
      }}
    >
      {images.map((url, index) => (
        <img
          key={`${url}-${index}`}
          src={url}
          alt=""
          style={{ height: '100%', width: 'auto', display: 'block', flexShrink: 0 }}
        />
      ))}
      <span
        className="font-display text-base-900"
        style={{
          fontSize,
          lineHeight: 1,
          paddingLeft: sideGap,
          paddingRight: sideGap,
          flexShrink: 0,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default QrCodeBanner;
