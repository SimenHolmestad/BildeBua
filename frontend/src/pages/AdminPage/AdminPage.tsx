import React from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import NotFound from 'components/NotFound';
import NewAlbumDialog from 'components/NewAlbumDialog';
import { Link } from 'react-router-dom';
import routes from 'routes';
import { useAdminConfig, useAvailableAlbums, updateAdminConfigAndRefresh } from 'hooks/swr';
import { useGlobalError } from 'contexts/GlobalErrorContext';
import type { AdminConfigUpdateRequest, BannerConfig, CameraConfig, DisplayConfig, QrCodeConfig, WifiConfig } from 'api';

const NumberInput = ({ value, onChange, min, ...props }: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'min'>) => {
  const [raw, setRaw] = React.useState(String(value));
  React.useEffect(() => { setRaw(String(value)); }, [value]);

  return (
    <input
      type="number"
      min={min}
      {...props}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        const n = Number(e.target.value);
        if (e.target.value !== '' && !isNaN(n)) onChange(n);
      }}
      onBlur={() => {
        if (raw === '' || isNaN(Number(raw))) {
          const fallback = min ?? 0;
          setRaw(String(fallback));
          onChange(fallback);
        }
      }}
    />
  );
};

const AdminPage = () => {
  const { adminConfig, isLoading: configLoading } = useAdminConfig();
  const { albumInfo, isLoading: albumsLoading } = useAvailableAlbums();
  const { showError } = useGlobalError();
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [slidingOut, setSlidingOut] = React.useState(false);
  const [wifiErrors, setWifiErrors] = React.useState<Record<string, boolean>>({});
  const [newAlbumDialogOpen, setNewAlbumDialogOpen] = React.useState(false);

  const [cameraType, setCameraType] = React.useState('');
  const [previewSeconds, setPreviewSeconds] = React.useState(3);
  const [overlayImage, setOverlayImage] = React.useState('');
  const [dslrPreviewIso, setDslrPreviewIso] = React.useState(4000);
  const [dslrCaptureIso, setDslrCaptureIso] = React.useState(200);
  const [verboseErrors, setVerboseErrors] = React.useState(true);
  const [forcedAlbum, setForcedAlbum] = React.useState('');
  const [overlaySeconds, setOverlaySeconds] = React.useState(20);
  const [useCenterImages, setUseCenterImages] = React.useState(true);
  const [urlQrCodeText, setUrlQrCodeText] = React.useState('');
  const [wifiEnabled, setWifiEnabled] = React.useState(false);
  const [wifiName, setWifiName] = React.useState('');
  const [wifiProtocol, setWifiProtocol] = React.useState('');
  const [wifiPassword, setWifiPassword] = React.useState('');
  const [wifiDescription, setWifiDescription] = React.useState('');
  const [bannerEnabled, setBannerEnabled] = React.useState(false);
  const [bannerText, setBannerText] = React.useState('Ta et bilde selv da vel!');
  const [bannerHeightVh, setBannerHeightVh] = React.useState(15);
  const [bannerImageCount, setBannerImageCount] = React.useState(30);
  const [bannerSpeed, setBannerSpeed] = React.useState(120);

  const resetToConfig = React.useCallback(() => {
    if (!adminConfig) return;
    setCameraType(adminConfig.camera.camera_type ?? 'dummy');
    setPreviewSeconds(adminConfig.camera.preview_seconds ?? 3);
    setOverlayImage(adminConfig.camera.overlay_image ?? 'smil');
    setDslrPreviewIso(adminConfig.camera.dslr_preview_iso ?? 4000);
    setDslrCaptureIso(adminConfig.camera.dslr_capture_iso ?? 200);
    setVerboseErrors(adminConfig.camera.verbose_errors ?? true);
    setForcedAlbum(adminConfig.forced_album ?? '');
    setOverlaySeconds(adminConfig.display.overlay_seconds ?? 20);
    setUseCenterImages(adminConfig.qr_codes.use_center_images ?? true);
    setUrlQrCodeText(adminConfig.qr_codes.url_qr_code_text ?? 'Scan this qr code to go to BildeBua!');
    setWifiEnabled(adminConfig.wifi_qr_code.enabled ?? false);
    setWifiName(adminConfig.wifi_qr_code.wifi_name ?? '');
    setWifiProtocol(adminConfig.wifi_qr_code.protocol ?? '');
    setWifiPassword(adminConfig.wifi_qr_code.password ?? '');
    setWifiDescription(adminConfig.wifi_qr_code.description ?? '');
    setBannerEnabled(adminConfig.banner.enabled ?? false);
    setBannerText(adminConfig.banner.text ?? 'Ta et bilde selv da vel!');
    setBannerHeightVh(adminConfig.banner.height_vh ?? 15);
    setBannerImageCount(adminConfig.banner.image_count ?? 30);
    setBannerSpeed(adminConfig.banner.speed_px_per_sec ?? 120);
    setWifiErrors({});
  }, [adminConfig]);

  React.useEffect(() => { resetToConfig(); }, [resetToConfig]);

  const hasChanges = adminConfig != null && (
    cameraType !== (adminConfig.camera.camera_type ?? 'dummy') ||
    previewSeconds !== (adminConfig.camera.preview_seconds ?? 3) ||
    overlayImage !== (adminConfig.camera.overlay_image ?? 'smil') ||
    dslrPreviewIso !== (adminConfig.camera.dslr_preview_iso ?? 4000) ||
    dslrCaptureIso !== (adminConfig.camera.dslr_capture_iso ?? 200) ||
    verboseErrors !== (adminConfig.camera.verbose_errors ?? true) ||
    forcedAlbum !== (adminConfig.forced_album ?? '') ||
    overlaySeconds !== (adminConfig.display.overlay_seconds ?? 20) ||
    useCenterImages !== (adminConfig.qr_codes.use_center_images ?? true) ||
    urlQrCodeText !== (adminConfig.qr_codes.url_qr_code_text ?? 'Scan this qr code to go to BildeBua!') ||
    wifiEnabled !== (adminConfig.wifi_qr_code.enabled ?? false) ||
    wifiName !== (adminConfig.wifi_qr_code.wifi_name ?? '') ||
    wifiProtocol !== (adminConfig.wifi_qr_code.protocol ?? '') ||
    wifiPassword !== (adminConfig.wifi_qr_code.password ?? '') ||
    wifiDescription !== (adminConfig.wifi_qr_code.description ?? '') ||
    bannerEnabled !== (adminConfig.banner.enabled ?? false) ||
    bannerText !== (adminConfig.banner.text ?? 'Ta et bilde selv da vel!') ||
    bannerHeightVh !== (adminConfig.banner.height_vh ?? 15) ||
    bannerImageCount !== (adminConfig.banner.image_count ?? 30) ||
    bannerSpeed !== (adminConfig.banner.speed_px_per_sec ?? 120)
  );

  const handleSave = async () => {
    if (wifiEnabled) {
      const errors: Record<string, boolean> = {};
      if (!wifiName.trim()) errors.wifi_name = true;
      if (!wifiPassword.trim()) errors.password = true;
      if (!wifiDescription.trim()) errors.description = true;
      setWifiErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      setWifiErrors({});
    }

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

    const display: DisplayConfig = {
      overlay_seconds: overlaySeconds,
    };

    const qr_codes: QrCodeConfig = {
      use_center_images: useCenterImages,
      url_qr_code_text: urlQrCodeText,
    };

    const wifi_qr_code: WifiConfig = {
      enabled: wifiEnabled,
      wifi_name: wifiName,
      protocol: wifiProtocol || 'WPA/WPA2',
      password: wifiPassword,
      description: wifiDescription,
    };

    const banner: BannerConfig = {
      enabled: bannerEnabled,
      text: bannerText,
      height_vh: bannerHeightVh,
      image_count: bannerImageCount,
      speed_px_per_sec: bannerSpeed,
    };

    const updates: AdminConfigUpdateRequest = {
      camera,
      display,
      forced_album: forcedAlbum || '',
      qr_codes,
      wifi_qr_code,
      banner,
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
            {availableAlbums.map((album) => {
              const isForced = forcedAlbum !== '' && album.name === forcedAlbum;
              return (
                <Link
                  key={album.name}
                  to={routes.adminAlbumPage(album.name)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${isForced ? 'border-base-400 bg-base-200' : 'border-base-200 bg-base-100'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-display text-lg text-base-900">{album.name}</span>
                    {isForced && <span className="rounded-full bg-base-700 px-2 py-0.5 text-xs font-medium text-white">Tvunget</span>}
                  </span>
                  <span className="text-sm text-base-500">Administrer &rarr;</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setNewAlbumDialogOpen(true)}
              className="flex items-center justify-between rounded-xl border border-dashed border-base-400 bg-base-50 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-base-100 hover:shadow-soft"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl leading-none text-base-600">＋</span>
                <span className="font-display text-lg text-base-900">Lag nytt album</span>
              </span>
              <span className="text-sm text-base-600">Opprett &rarr;</span>
            </button>
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
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={forcedAlbum !== ''}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setForcedAlbum('');
                    } else {
                      setForcedAlbum(availableAlbums[0]?.name ?? '');
                    }
                  }}
                  className="h-4 w-4 rounded border-base-300 text-base-600 focus:ring-base-500"
                />
                <span className="text-sm font-medium text-base-700">Tving alle brukere til ett album</span>
              </label>
              {forcedAlbum !== '' && (
                <select
                  value={forcedAlbum}
                  onChange={(e) => setForcedAlbum(e.target.value)}
                  className="block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                >
                  {availableAlbums.map((album) => (
                    <option key={album.name} value={album.name}>{album.name}</option>
                  ))}
                </select>
              )}
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
                <NumberInput
                  min={0}
                  value={previewSeconds}
                  onChange={setPreviewSeconds}
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
                <NumberInput
                  min={1}
                  value={dslrPreviewIso}
                  onChange={setDslrPreviewIso}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-base-700">DSLR opptak ISO</span>
                <NumberInput
                  min={1}
                  value={dslrCaptureIso}
                  onChange={setDslrCaptureIso}
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

          {/* Display settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">Bildevisning etter bildet er tatt</h2>
            <div className="mt-4">
              <label className="block">
                <span className="text-sm font-medium text-base-700">Visningstid for nye bilder (sek)</span>
                <NumberInput
                  min={1}
                  value={overlaySeconds}
                  onChange={setOverlaySeconds}
                  className="mt-1 block w-full max-w-xs rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
                <span className="mt-1 block text-xs text-base-500">Hvor lenge nye bilder vises over QR-koder og lysbildeshow</span>
              </label>
            </div>
          </section>

          {/* QR code settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">QR-koder</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-base-700">Beskrivelse under hoved-QR-kode</span>
                <input
                  type="text"
                  value={urlQrCodeText}
                  onChange={(e) => setUrlQrCodeText(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useCenterImages}
                  onChange={(e) => setUseCenterImages(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Bruk senterbilder i QR-koder</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wifiEnabled}
                  onChange={(e) => setWifiEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Bruke WiFi QR-kode</span>
              </label>
              {wifiEnabled && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={`text-sm font-medium ${wifiErrors.wifi_name ? 'text-red-600' : 'text-base-700'}`}>WiFi-navn</span>
                    <input
                      type="text"
                      value={wifiName}
                      onChange={(e) => { setWifiName(e.target.value); setWifiErrors((p) => ({ ...p, wifi_name: false })); }}
                      className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-base-900 shadow-sm focus:outline-none ${wifiErrors.wifi_name ? 'border-red-400 focus:border-red-500' : 'border-base-300 focus:border-base-500'}`}
                    />
                    {wifiErrors.wifi_name && <span className="mt-1 block text-xs text-red-600">Påkrevd</span>}
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
                    <span className="mt-1 block text-xs text-base-500">Standard: WPA/WPA2</span>
                  </label>
                  <label className="block">
                    <span className={`text-sm font-medium ${wifiErrors.password ? 'text-red-600' : 'text-base-700'}`}>Passord</span>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => { setWifiPassword(e.target.value); setWifiErrors((p) => ({ ...p, password: false })); }}
                      className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-base-900 shadow-sm focus:outline-none ${wifiErrors.password ? 'border-red-400 focus:border-red-500' : 'border-base-300 focus:border-base-500'}`}
                    />
                    {wifiErrors.password && <span className="mt-1 block text-xs text-red-600">Påkrevd</span>}
                  </label>
                  <label className="block">
                    <span className={`text-sm font-medium ${wifiErrors.description ? 'text-red-600' : 'text-base-700'}`}>Beskrivelse under WiFi QR-kode</span>
                    <input
                      type="text"
                      value={wifiDescription}
                      onChange={(e) => { setWifiDescription(e.target.value); setWifiErrors((p) => ({ ...p, description: false })); }}
                      className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-base-900 shadow-sm focus:outline-none ${wifiErrors.description ? 'border-red-400 focus:border-red-500' : 'border-base-300 focus:border-base-500'}`}
                    />
                    {wifiErrors.description && <span className="mt-1 block text-xs text-red-600">Påkrevd</span>}
                  </label>
                </div>
              )}
            </div>
          </section>

          {/* Banner settings */}
          <section className="rounded-2xl border border-base-200 bg-base-50/70 p-6 shadow-soft">
            <h2 className="font-display text-2xl text-base-900">Banner på QR-kode-siden</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bannerEnabled}
                  onChange={(e) => setBannerEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-base-300"
                />
                <span className="text-sm font-medium text-base-700">Vis banner nederst på QR-kode-siden</span>
              </label>
              {bannerEnabled && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium text-base-700">Tekst i banneret</span>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Høyde (% av skjermhøyde)</span>
                    <NumberInput
                      min={5}
                      value={bannerHeightVh}
                      onChange={setBannerHeightVh}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Antall bilder per syklus</span>
                    <NumberInput
                      min={0}
                      value={bannerImageCount}
                      onChange={setBannerImageCount}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-base-700">Hastighet (piksler per sekund)</span>
                    <NumberInput
                      min={10}
                      value={bannerSpeed}
                      onChange={setBannerSpeed}
                      className="mt-1 block w-full rounded-lg border border-base-300 bg-white px-3 py-2 text-base-900 shadow-sm focus:border-base-500 focus:outline-none"
                    />
                  </label>
                </div>
              )}
            </div>
          </section>
        </form>
      </main>
      <NewAlbumDialog
        open={newAlbumDialogOpen}
        handleClose={() => setNewAlbumDialogOpen(false)}
        getRedirectPath={routes.adminAlbumPage}
      />
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
            {hasChanges && !saving && (
              <button
                type="button"
                onClick={resetToConfig}
                className="rounded-xl bg-red-600 px-6 py-3 font-display text-lg text-white shadow-sm transition hover:bg-red-700"
              >
                Avbryt
              </button>
            )}
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
