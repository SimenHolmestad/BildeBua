import React from 'react';
import Footer from 'components/Footer';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { useAlbumInfo } from 'hooks/swr';
import { Link, useParams } from 'react-router-dom';
import routes from 'routes';

const AlbumImageDetailPage = () => {
  const { albumName, imageNumber } = useParams<{ albumName: string; imageNumber: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(5000);

  if (!albumName) {
    return (
      <>
        <Header />
        <h1 className="mx-auto my-20 max-w-3xl px-4 text-2xl font-semibold text-red-700">FEIL: Albumnavn mangler.</h1>
        <Footer />
      </>
    );
  }

  if (isLoading && !albumInfo) {
    return (
      <>
        <Header />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
        </div>
        <Footer />
      </>
    );
  }

  if (!albumInfo) {
    return (
      <>
        <Header />
        <NotFound />
        <Footer />
      </>
    );
  }

  const selectedImageNumber = imageNumber && /^\d+$/.test(imageNumber) ? Number.parseInt(imageNumber, 10) : Number.NaN;
  const images = albumInfo.images;
  const selectedIndex = images.findIndex((image) => image.image_number === selectedImageNumber);
  const selectedImage = Number.isNaN(selectedImageNumber) ? null : images[selectedIndex] ?? null;

  if (selectedIndex < 0 || Number.isNaN(selectedImageNumber) || !selectedImage) {
    return (
      <>
        <Header />
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-4xl text-base-900">Fant ikke bildet</h1>
          <p className="mt-2 text-lg text-base-700">Fant ikke bilde {imageNumber} i dette albumet.</p>
        <Link
          to={routes.albumPage(albumName)}
          className="mt-5 inline-flex items-center rounded-xl bg-base-600 px-5 py-3 text-[22px] font-semibold text-base-50 shadow-soft transition hover:bg-base-700"
        >
          Tilbake til album
        </Link>
        </div>
        <Footer />
      </>
    );
  }

  const previousImageNumber = selectedIndex > 0 ? images[selectedIndex - 1].image_number : null;
  const nextImageNumber = selectedIndex < images.length - 1 ? images[selectedIndex + 1].image_number : null;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to={routes.albumPage(albumName)} className="inline-flex items-center text-[22px] font-semibold text-base-700 hover:text-base-900">
          ← Tilbake til album
        </Link>

        <section className="relative mt-4 overflow-hidden rounded-3xl border border-base-200 bg-black/90 shadow-soft">
          <img src={selectedImage.image_url} alt={`Bilde ${selectedImage.image_number}`} className="max-h-[82vh] w-full object-contain" />

          <div className="absolute inset-0">
            <NavigationArrow
              direction="left"
              imageNumber={nextImageNumber}
              albumName={albumName}
              label="Neste bilde"
            />
            <NavigationArrow
              direction="right"
              imageNumber={previousImageNumber}
              albumName={albumName}
              label="Forrige bilde"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

type NavigationArrowProps = {
  albumName: string;
  direction: 'left' | 'right';
  imageNumber: number | null;
  label: string;
};

const NavigationArrow = ({ albumName, direction, imageNumber, label }: NavigationArrowProps) => {
  const isDisabled = imageNumber === null;
  const icon = direction === 'left' ? '←' : '→';
  const zoneClasses = `absolute inset-y-0 ${
    direction === 'left' ? 'left-0 justify-start pl-2 sm:pl-4' : 'right-0 justify-end pr-2 sm:pr-4'
  } flex w-1/5 min-w-16 items-center`;

  const classes =
    'inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/35 text-2xl text-white shadow-lg backdrop-blur transition';

  if (isDisabled) {
    return (
      <div className={zoneClasses}>
        <span className={`${classes} cursor-not-allowed opacity-35`}>{icon}</span>
      </div>
    );
  }

  return (
    <Link to={routes.albumImageDetailPage(albumName, imageNumber)} aria-label={label} className={`${zoneClasses} group`}>
      <span className={`${classes} group-hover:scale-105 group-hover:bg-black/60`}>{icon}</span>
    </Link>
  );
};

export default AlbumImageDetailPage;
