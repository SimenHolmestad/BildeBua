import React from 'react';
import type { AlbumInfoResponse } from 'api';
import { useGlobalError } from 'contexts/GlobalErrorContext';
import { captureImageToAlbumAndRefresh } from 'hooks/swr';
import { Link } from 'react-router-dom';
import routes from 'routes';

type AlbumOverviewProps = {
  albumData: AlbumInfoResponse;
};

const tileClassForIndex = (index: number): string => {
  const pattern = index % 10;
  // Mobile: 6-col grid alternates rows of 2 (col-span-3) and rows of 3 (col-span-2)
  // Desktop (sm): 4-col grid with variable-size feature tiles
  if (pattern === 0 || pattern === 5) {
    return 'col-span-3 sm:col-span-2 sm:row-span-2';
  }
  if (pattern === 1 || pattern === 6) {
    return 'col-span-3 sm:col-span-1';
  }
  if (pattern === 2 || pattern === 7) {
    return 'col-span-2 sm:col-span-2';
  }
  return 'col-span-2 sm:col-span-1';
};

const AlbumOverview = ({ albumData }: AlbumOverviewProps) => {
  const [isCapturingImage, setIsCapturingImage] = React.useState(false);
  const images = albumData.images;
  const albumName = albumData.album_name;
  const albumDescription = albumData.description ?? '';
  const { showError } = useGlobalError();
  const newestFirstImages = [...images].reverse();

  const handleCapture = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCapturingImage(true);

    try {
      await captureImageToAlbumAndRefresh(albumName, showError);
    } finally {
      setIsCapturingImage(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <section className="animate-fade-in-up rounded-3xl border border-base-200 bg-base-50/70 px-6 py-8 shadow-soft sm:px-10">
        <h1 className="font-display text-4xl text-base-900 sm:text-5xl">{albumName}</h1>
        {albumDescription ? <p className="mt-3 max-w-3xl text-base text-base-700 sm:text-lg">{albumDescription}</p> : null}
      </section>

      <div className="my-6">
        <button
          type="button"
          onClick={handleCapture}
          disabled={isCapturingImage}
          className="flex min-h-[6.4rem] w-full items-center justify-center gap-3 rounded-xl bg-base-600 px-6 py-8 text-3xl font-bold text-base-50 shadow-soft transition hover:bg-base-700 disabled:cursor-not-allowed disabled:opacity-70 sm:text-4xl"
        >
          {isCapturingImage ? (
            <>
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-base-200 border-t-base-50 sm:h-7 sm:w-7" />
              Tar bilde...
            </>
          ) : (
            <>📸 Ta nytt bilde!</>
          )}
        </button>
      </div>

      {newestFirstImages.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-base-300 bg-base-100/70 px-6 py-16 text-center">
          <h2 className="font-display text-4xl text-base-900">Ingen bilder ennå</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-base-700 sm:text-lg">
            Det er ingen bilder i dette albumet ennå. Legg til et med knappen ovenfor.
          </p>
        </section>
      ) : (
        <section>
          <div className="grid grid-cols-6 auto-rows-[110px] grid-flow-dense gap-1 sm:gap-3 sm:grid-cols-4 sm:auto-rows-[140px] lg:auto-rows-[180px]">
            {newestFirstImages.map((imageData, index) => (
              <Link
                key={`${imageData.thumbnail_url}-${imageData.image_number}`}
                to={routes.albumImageDetailPage(albumName, imageData.image_number)}
                className={`group relative overflow-hidden rounded-2xl border border-base-200 bg-base-100 transition ${tileClassForIndex(index)}`}
              >
                <img
                  src={imageData.thumbnail_url}
                  alt={`Bilde ${imageData.image_number}`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default AlbumOverview;
