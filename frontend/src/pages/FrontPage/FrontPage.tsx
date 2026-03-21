import React from 'react';
import Footer from 'components/Footer';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { useAvailableAlbums } from 'hooks/swr';
import { Link, Navigate } from 'react-router-dom';
import routes from 'routes';
import NewAlbumDialog from './components/NewAlbumDialog';

const FrontPage = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { albumInfo, isLoading } = useAvailableAlbums();

  if (isLoading && !albumInfo) {
    return (
      <>
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center">
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

  if (albumInfo.forced_album) {
    return (
      <>
        <Header />
        <Navigate to={routes.albumPage(albumInfo.forced_album)} replace />
        <Footer />
      </>
    );
  }

  const availableAlbums = albumInfo.available_albums ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up rounded-3xl border border-base-200 bg-base-50/70 px-6 py-10 shadow-soft sm:px-10">
          <h1 className="font-display text-5xl text-base-900 sm:text-6xl">Velkommen til BildeBua</h1>
          <p className="mt-4 max-w-3xl text-base text-base-700 sm:text-lg">
            Velg et album nedenfor eller opprett et nytt for å komme igang.
          </p>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="group flex h-full min-h-[7rem] sm:min-h-[14.5rem] flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-100/70 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-base-500 hover:bg-base-100 hover:shadow-soft"
          >
            <span className="text-3xl text-base-700">＋</span>
            <span className="mt-2 font-display text-2xl text-base-900">Opprett nytt album</span>
            <span className="mt-2 text-sm text-base-600">Lag et nytt sted for de neste bildene dine.</span>
          </button>

          {availableAlbums.map((album) => (
            <Link
              key={album.name}
              to={routes.albumPage(album.name)}
              className="group overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="grid h-44 grid-cols-2 grid-rows-2 gap-1 bg-base-200 p-1">
                {album.last_images_thumbnails.length > 0 ? (
                  <>
                    {album.last_images_thumbnails.slice(0, 4).map((thumbnailUrl) => (
                      <img
                        key={thumbnailUrl}
                        src={thumbnailUrl}
                        alt={album.name}
                        className="h-full w-full rounded-md object-cover"
                        loading="lazy"
                      />
                    ))}
                    {Array.from({ length: Math.max(0, 4 - album.last_images_thumbnails.length) }).map((_, idx) => (
                      <div
                        key={`placeholder-${album.name}-${idx}`}
                        className="rounded-md bg-gradient-to-br from-base-200 via-base-100 to-base-300"
                      />
                    ))}
                  </>
                ) : (
                  <div className="col-span-2 row-span-2 grid place-items-center rounded-md bg-gradient-to-br from-base-200 via-base-100 to-base-300 text-base-600">
                    Ingen bilder ennå
                  </div>
                )}
              </div>
              <div className="px-4 py-4">
                <p className="font-display text-2xl text-base-900 transition group-hover:text-base-700">{album.name}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <NewAlbumDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
      <Footer />
    </>
  );
};

export default FrontPage;
