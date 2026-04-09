import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import NotFound from 'components/NotFound';
import { Link } from 'react-router-dom';
import routes from 'routes';
import { useAdminConfig, useAvailableAlbums, updateAdminConfigAndRefresh } from 'hooks/swr';
import { useGlobalError } from 'contexts/GlobalErrorContext';
import type { AdminConfigUpdateRequest, CameraConfig, QrCodeConfig, WifiConfig } from 'api';

const AdminPage = () => {
  const { adminConfig, isLoading: configLoading } = useAdminConfig();
  const { albumInfo, isLoading: albumsLoading } = useAvailableAlbums();
  const { showError } = useGlobalError();
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [slidingOut, setSlidingOut] = React.useState(false);

  const [cameraType, setCameraType] = React.useState('');
  const [previewSeconds, setPreviewSeconds] = React.useState(3);
  const [overlayImage, setOverlayImage] = React.useState('');
  const [dslrPreviewIso, setDslrPreviewIso] = React.useState(4000);
  const [dslrCaptureIso, setDslrCaptureIso] = React.useState(200);
  const [verboseErrors, setVerboseErrors] = React.useState(true);
  const [forcedAlbum, setForcedAlbum] = React.useState('');
  const [useCenterImages, setUseCenterImages] = React.useState(true);
  const [wifiEnabled, setWifiEnabled] = React.useState(false);
  const [wifiName, setWifiName] = React.useState('');
  const [wifiProtocol, setWifiProtocol] = React.useState('');
  const [wifiPassword, setWifiPassword] = React.useState('');
  const [wifiDescription, setWifiDescription] = React.useState('');

  React.useEffect(() => {
    if (!adminConfig) return;
    setCameraType(adminConfig.camera.camera_type ?? 'dummy');
    setPreviewSeconds(adminConfig.camera.preview_seconds ?? 3);
    setOverlayImage(adminConfig.camera.overlay_image ?? 'smil');
    setDslrPreviewIso(adminConfig.camera.dslr_preview_iso ?? 4000);
    setDslrCaptureIso(adminConfig.camera.dslr_capture_iso ?? 200);
    setVerboseErrors(adminConfig.camera.verbose_errors ?? true);
    setForcedAlbum(adminConfig.forced_album ?? '');
    setUseCenterImages(adminConfig.qr_codes.use_center_images ?? true);
    setWifiEnabled(adminConfig.wifi_qr_code.enabled ?? false);
    setWifiName(adminConfig.wifi_qr_code.wifi_name ?? '');
    setWifiProtocol(adminConfig.wifi_qr_code.protocol ?? '');
    setWifiPassword(adminConfig.wifi_qr_code.password ?? '');
    setWifiDescription(adminConfig.wifi_qr_code.description ?? '');
  }, [adminConfig]);

  const hasChanges = adminConfig != null && (
    cameraType !== (adminConfig.camera.camera_type ?? 'dummy') ||
    previewSeconds !== (adminConfig.camera.preview_seconds ?? 3) ||
    overlayImage !== (adminConfig.camera.overlay_image ?? 'smil') ||
    dslrPreviewIso !== (adminConfig.camera.dslr_preview_iso ?? 4000) ||
    dslrCaptureIso !== (adminConfig.camera.dslr_capture_iso ?? 200) ||
    verboseErrors !== (adminConfig.camera.verbose_errors ?? true) ||
    forcedAlbum !== (adminConfig.forced_album ?? '') ||
    useCenterImages !== (adminConfig.qr_codes.use_center_images ?? true) ||
    wifiEnabled !== (adminConfig.wifi_qr_code.enabled ?? false) ||
    wifiName !== (adminConfig.wifi_qr_code.wifi_name ?? '') ||
    wifiProtocol !== (adminConfig.wifi_qr_code.protocol ?? '') ||
    wifiPassword !== (adminConfig.wifi_qr_code.password ?? '') ||
    wifiDescription !== (adminConfig.wifi_qr_code.description ?? '')
  );

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    const camera: CameraConfig = {
      camera_type: cameraType as CameraConfig['camera_type'],
      preview_seconds: previewSeconds,
      overlay_image: overlayImage as CameraConfig['overlay_image'],
      dslr_preview_iso: dslrPreviewIso,
      dslr_capture_iso: dslrCaptureIso,
      verbose_errors: verboseErrors,
    };

    const qr_codes: QrCodeConfig = {
      use_center_images: useCenterImages,
    };

    const wifi_qr_code: WifiConfig = {
      enabled: wifiEnabled,
      wifi_name: wifiName,
      protocol: wifiProtocol,
      password: wifiPassword,
      description: wifiDescription,
    };

    const updates: AdminConfigUpdateRequest = {
      camera,
      forced_album: forcedAlbum || '',
      qr_codes,
      wifi_qr_code,
    };

    const result = await updateAdminConfigAndRefresh(updates, showError);
    setSaving(false);
    if (result) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSlidingOut(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setSlidingOut(false);
        }, 250);
      }, 500);
    }
  };

  if ((configLoading && !adminConfig) || (albumsLoading && !albumInfo)) {
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

  if (!adminConfig) {
    return (
      <>
        <Header />
        <NotFound />
        <Footer />
      </>
    );
  }

  const availableAlbums = albumInfo?.available_albums ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-base-900 sm:text-5xl">Admin</h1>

        {/* Albums section */}
        <section className="mt-8">
          <h2 className="font-display text-2xl text-base-900">Album</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableAlbums.map((album) => (
              <Link
                key={album.name}
                to={routes.adminAlbumPage(album.name)}
                className="flex items-center justify-between rounded-xl border border-base-200 bg-base-100 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <span className="font-display text-lg text-base-900">{album.name}</span>
                <span className="text-sm text-base-500">Administrer &rarr;</span>
              </Link>
            ))}
            {availableAlbums.length === 0 && (
              <p className="text-base-600">Ingen album opprettet ennå.</p>
            )}
          </div>
        </section>

        {/* Settings form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="mt-10 space-y-8"
        >
          {/* Album settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">Albuminnstillinger</h2>
            <div className="mt-4">
              <label className="block">
                <span className="text-sm font-medium text-base-700">Tvunget album</span>
                <select
                  value={forcedAlbum}
                  onChange={(e) => setForcedAlbum(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                >
                  <option value="">Ingen</option>
                  {availableAlbums.map((album) => (
                    <option key={album.name} value={album.name}>{album.name}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          {/* Camera settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">Kamera</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-base-700">Kameratype</span>
                <select
                  value={cameraType}
                  onChange={(e) => setCameraType(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                >
                  <option value="dummy">Dummy</option>
                  <option value="rpicam">Raspberry Pi-kamera</option>
                  <option value="dslr">DSLR</option>
                  <option value="webcam">Webkamera</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-base-700">Forhåndsvisning (sek)</span>
                <input
                  type="number"
                  min={0}
                  value={previewSeconds}
                  onChange={(e) => setPreviewSeconds(Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-base-700">Overlay-bilde</span>
                <select
                  value={overlayImage}
                  onChange={(e) => setOverlayImage(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                >
                  <option value="smil">Smil</option>
                  <option value="smil_for_faen">Smil for faen</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-base-700">DSLR forhåndsvisning ISO</span>
                <input
                  type="number"
                  min={1}
                  value={dslrPreviewIso}
                  onChange={(e) => setDslrPreviewIso(Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-base-700">DSLR opptak ISO</span>
                <input
                  type="number"
                  min={1}
                  value={dslrCaptureIso}
                  onChange={(e) => setDslrCaptureIso(Number(e.target.value))}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={verboseErrors}
                  onChange={(e) => setVerboseErrors(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Detaljerte feilmeldinger</span>
              </label>
            </div>
          </section>

          {/* QR code settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">QR-koder</h2>
            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useCenterImages}
                  onChange={(e) => setUseCenterImages(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Bruk senterbilder i QR-koder</span>
              </label>
            </div>
          </section>

          {/* WiFi QR code settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">WiFi QR-kode</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wifiEnabled}
                  onChange={(e) => setWifiEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Aktivert</span>
              </label>
              {wifiEnabled && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">WiFi-navn</span>
                    <input
                      type="text"
                      value={wifiName}
                      onChange={(e) => setWifiName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Protokoll</span>
                    <input
                      type="text"
                      value={wifiProtocol}
                      onChange={(e) => setWifiProtocol(e.target.value)}
                      placeholder="WPA/WPA2"
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Passord</span>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Beskrivelse</span>
                    <input
                      type="text"
                      value={wifiDescription}
                      onChange={(e) => setWifiDescription(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                </div>
              )}
            </div>
          </section>

        </form>
      </main>
      <Footer />
      {(hasChanges || saving || saveSuccess || slidingOut) && (
        <div className={`sticky bottom-0 z-40 border-t border-base-200 bg-base-50/95 backdrop-blur ${slidingOut ? 'animate-slide-down-out' : 'animate-slide-up-in'}`}>
          <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-base-900 px-6 py-3 font-display text-lg text-white shadow-sm transition hover:bg-base-700 disabled:opacity-50"
            >
              {saving ? 'Lagrer...' : 'Lagre innstillinger'}
            </button>
            {saveSuccess && (
              <span className="text-sm font-medium text-green-600">Innstillinger lagret!</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPage;
