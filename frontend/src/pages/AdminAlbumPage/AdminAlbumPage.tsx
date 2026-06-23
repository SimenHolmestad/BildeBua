import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import NotFound from 'components/NotFound';
import { Link, useNavigate } from 'react-router-dom';
import routes from 'routes';
import { useAdminAlbum, useAdminConfig, useAlbumName, deleteAlbumAndRefresh, deleteImageAndRefresh, updateAdminConfigAndRefresh, updateAlbumDescriptionAndRefresh } from 'hooks/swr';
import { useGlobalError } from 'contexts/GlobalErrorContext';

const linkClass = 'rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200';
const disabledLinkClass = 'rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-400 shadow-sm opacity-60 cursor-not-allowed';

type AlbumLinkProps = {
  to: string;
  external?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

// Links to this album's user-facing views are dead while another album is forced
// (those pages redirect to the forced album or 403), so render them disabled.
const AlbumLink = ({ to, external, disabled, children }: AlbumLinkProps) => {
  if (disabled) {
    return (
      <span className={disabledLinkClass} title="Ikke tilgjengelig mens et annet album er tvunget" aria-disabled="true">
        {children}
      </span>
    );
  }
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={linkClass}>
      {children}
    </Link>
  );
};

const AdminAlbumPage = () => {
  const albumName = useAlbumName();
  const { albumInfo, isLoading } = useAdminAlbum();
  const { adminConfig } = useAdminConfig();
  const { showError } = useGlobalError();
  const navigate = useNavigate();

  const [isEditingDescription, setIsEditingDescription] = React.useState(false);
  const [descriptionDraft, setDescriptionDraft] = React.useState('');
  const [savingDescription, setSavingDescription] = React.useState(false);

  const isForcedAlbum = adminConfig?.forced_album === albumName;
  const anotherAlbumForced = !!adminConfig?.forced_album && adminConfig.forced_album !== albumName;

  const handleToggleForcedAlbum = async () => {
    const forced_album = isForcedAlbum ? '' : albumName;
    await updateAdminConfigAndRefresh({ forced_album }, showError);
  };

  const handleStartEditDescription = () => {
    setDescriptionDraft(albumInfo?.description ?? '');
    setIsEditingDescription(true);
  };

  const handleSaveDescription = async () => {
    setSavingDescription(true);
    const result = await updateAlbumDescriptionAndRefresh(albumName, descriptionDraft.trim(), showError);
    setSavingDescription(false);
    if (result) {
      setIsEditingDescription(false);
    }
  };

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
        {isEditingDescription ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              rows={3}
              autoFocus
              placeholder="Valgfri beskrivelse"
              className="w-full rounded-xl border border-base-300 bg-white px-3 py-2.5 text-base text-base-900 outline-none ring-base-500 transition placeholder:text-base-400 focus:ring-2"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveDescription}
                disabled={savingDescription}
                className="rounded-xl bg-base-600 px-4 py-2 text-sm font-semibold text-base-50 transition hover:bg-base-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingDescription ? 'Lagrer...' : 'Lagre'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingDescription(false)}
                disabled={savingDescription}
                className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold text-base-800 transition hover:bg-base-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-start gap-3">
            <p className="text-base-600">
              {albumInfo.description || <span className="italic text-base-400">Ingen beskrivelse</span>}
            </p>
            <button
              type="button"
              onClick={handleStartEditDescription}
              className="text-sm text-base-500 underline-offset-2 hover:text-base-700 hover:underline"
            >
              Rediger
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <AlbumLink to={routes.albumPage(albumName)} external disabled={anotherAlbumForced}>
            Gå til album-side
          </AlbumLink>
          <button
            type="button"
            onClick={handleToggleForcedAlbum}
            className="rounded-xl border border-base-300 bg-base-100 px-6 py-3 font-display text-lg text-base-900 shadow-sm transition hover:bg-base-200"
          >
            {isForcedAlbum ? 'Fjern som tvunget album' : 'Sett som tvunget album'}
          </button>
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
          {anotherAlbumForced && (
            <p className="mt-1 text-sm text-base-500">Ikke tilgjengelig mens et annet album er tvunget.</p>
          )}
          <div className="mt-2 flex flex-wrap gap-3">
            <AlbumLink to={routes.lastImagePage(albumName)} disabled={anotherAlbumForced}>
              Siste bilde
            </AlbumLink>
            <AlbumLink to={routes.qrCodeLastImagePage(albumName)} disabled={anotherAlbumForced}>
              QR siste bilde
            </AlbumLink>
            <AlbumLink to={routes.slideshowPage(albumName)} disabled={anotherAlbumForced}>
              Lysbildeshow
            </AlbumLink>
            <AlbumLink to={routes.slideshowLastImagePage(albumName)} disabled={anotherAlbumForced}>
              Lysbildeshow siste bilde
            </AlbumLink>
          </div>
        </div>

        <p className="mt-6 text-sm text-base-500">{images.length} bilder i album</p>

        <div className="mt-4 space-y-6">
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
