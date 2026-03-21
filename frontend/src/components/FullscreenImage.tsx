import React from 'react';

type FullscreenImageProps = {
  imageUrl?: string | null;
  time?: number;
  startHided?: boolean;
};

const FullscreenImage = ({ imageUrl, time, startHided }: FullscreenImageProps) => {
  const [isShowing, setIsShowing] = React.useState(false);
  const [isFadingIn, setIsFadingIn] = React.useState(false);
  const firstImageShowing = React.useRef(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!imageUrl) {
      return;
    }

    if (startHided && firstImageShowing.current) {
      firstImageShowing.current = false;
      return;
    }

    setIsShowing(true);
    setIsFadingIn(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (time) {
      timeoutRef.current = setTimeout(() => {
        setIsFadingIn(false);
        timeoutRef.current = setTimeout(() => setIsShowing(false), 1000);
      }, time);
    }
  }, [imageUrl, startHided, time]);

  if (!isShowing) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[1200] bg-black transition-opacity duration-1000 ${
        isFadingIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={imageUrl ?? undefined}
        alt=""
        className={`fixed inset-0 m-auto h-full w-full object-contain transition-opacity duration-1000 ${
          isFadingIn ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default FullscreenImage;
