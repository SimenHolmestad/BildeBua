import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalError } from 'contexts/GlobalErrorContext';
import { createAlbumAndRefresh } from 'hooks/swr';
import routes from 'routes';

type NewAlbumDialogProps = {
  open: boolean;
  handleClose: () => void;
};

const NewAlbumDialog = ({ open, handleClose }: NewAlbumDialogProps) => {
  const [albumName, setAlbumName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [redirectAlbum, setRedirectAlbum] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { showError } = useGlobalError();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!albumName.trim()) {
      showError(new Error('Albumnavn er påkrevd'), 'Albumnavn er påkrevd');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createAlbumAndRefresh(albumName.trim(), description.trim(), showError);
      if (response) {
        setRedirectAlbum(response.album_name);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirectAlbum) {
    return <Navigate to={routes.albumPage(redirectAlbum)} replace />;
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 px-4" onClick={handleClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-base-200 bg-base-50 p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-display text-3xl text-base-900">Opprett nytt album</h2>
        <p className="mt-2 text-sm text-base-700">
          Hvert bilde i BildeBua tilhører et album. Skriv inn navn og valgfri beskrivelse.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-base-700">Albumnavn</span>
            <input
              value={albumName}
              onChange={(event) => setAlbumName(event.target.value)}
              autoFocus
              className="w-full rounded-xl border border-base-300 bg-white px-3 py-2.5 text-base text-base-900 outline-none ring-base-500 transition placeholder:text-base-400 focus:ring-2"
              placeholder="Sommer 2026"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-base-700">Beskrivelse</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-base-300 bg-white px-3 py-2.5 text-base text-base-900 outline-none ring-base-500 transition placeholder:text-base-400 focus:ring-2"
              placeholder="Valgfri beskrivelse"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-base-300 px-4 py-2 text-sm font-semibold text-base-800 transition hover:bg-base-100"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-base-600 px-4 py-2 text-sm font-semibold text-base-50 transition hover:bg-base-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Oppretter...' : 'Opprett album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAlbumDialog;
