import Header from 'components/Header';
import Footer from 'components/Footer';
import NotFound from 'components/NotFound';
import { Link, useNavigate } from 'react-router-dom';
import routes from 'routes';
import { useAdminAlbum, useAlbumName, deleteAlbumAndRefresh, deleteImageAndRefresh } from 'hooks/swr';
import { useGlobalError } from 'contexts/GlobalErrorContext';

const AdminAlbumPage = () => {
  const albumName = useAlbumName();
  const { albumInfo, isLoading } = useAdminAlbum();
  const { showError } = useGlobalError();
  const navigate = useNavigate();

  const handleDeleteAlbum = async () => {
    if (!window.confirm(`Er du sikker på at du vil slette albumet "${albumName}" og alle bildene?`)) return;
    await deleteAlbumAndRefresh(albumName, showError);
    navigate(routes.adminPage);
  };

  const handleDelete = async (imageNumber: number) => {
    await deleteImageAndRefresh(albumName, imageNumber, showError);
  };

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

  const images = [...albumInfo.images].reverse();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <Link to={routes.adminPage} className="text-sm text-base-500 hover:text-base-700">
          &larr; Tilbake til admin
        </Link>
        <h1 className="mt-4 font-display text-4xl text-base-900">{albumName}</h1>
        {albumInfo.description && (
          <p className="mt-2 text-base-600">{albumInfo.description}</p>
        )}
        <p className="mt-2 text-sm text-base-500">{images.length} bilder</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={routes.albumPage(albumName)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200"
          >
            Gå til album-side
          </a>
          <button
            type="button"
            onClick={handleDeleteAlbum}
            className="rounded-xl bg-red-600 px-6 py-3 font-display text-lg text-white shadow-sm transition hover:bg-red-700"
          >
            Slett album
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-base-500">Andre lenker:</h2>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link to={routes.lastImagePage(albumName)} className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200">
              Siste bilde
            </Link>
            <Link to={routes.qrCodeLastImagePage(albumName)} className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200">
              QR siste bilde
            </Link>
            <Link to={routes.slideshowPage(albumName)} className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200">
              Lysbildeshow
            </Link>
            <Link to={routes.slideshowLastImagePage(albumName)} className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200">
              Lysbildeshow siste bilde
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {images.map((image) => (
            <div key={image.image_number} data-testid="admin-image" className="flex flex-col gap-3 rounded-2xl border border-base-200 bg-base-100 p-3 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-4">
              <div className="overflow-hidden rounded-xl sm:w-2/3">
                <img
                  src={image.image_url}
                  alt={`Bilde ${image.image_number}`}
                  className="w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-1 sm:justify-center">
                <span className="text-sm font-medium text-base-500">#{image.image_number}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(image.image_number)}
                  className="w-full rounded-xl bg-red-600 px-8 py-3 font-display text-lg text-white shadow-sm transition hover:bg-red-700 sm:w-auto sm:px-12 sm:py-4 sm:text-xl"
                >
                  Slett bilde
                </button>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="mt-8 text-center text-base-600">Ingen bilder i dette albumet.</p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AdminAlbumPage;
