import useSWR, { mutate } from 'swr';
import { useParams } from 'react-router-dom';
import {
  captureImageToAlbum,
  createAlbum,
  deleteAdminAlbum,
  deleteAdminImage,
  getAdminAlbumInfo,
  getAdminConfig,
  getAlbumInfo,
  getAlbumLastImage,
  getQrCodes,
  listAlbums,
  updateAdminConfig,
} from 'api';
import type {
  AdminConfigResponse,
  AdminConfigUpdateRequest,
  AlbumCaptureResponse,
  AlbumCreatedResponse,
  AlbumInfoResponse,
  AvailableAlbumsResponse,
  LastImageResponse,
  QrCodesResponse,
} from 'api';
import { runWithGlobalApiErrorHandling, type ShowErrorFn } from 'utils/runWithGlobalApiErrorHandling';

export const swrKeys = {
  availableAlbums: (): string => 'availableAlbums',
  albumInfo: (albumName: string): string => `albumInfo/${albumName}`,
  albumLastImage: (albumName: string): string => `albumLastImage/${albumName}`,
  qrCodes: (): string => 'qrCodes',
  adminConfig: (): string => 'adminConfig',
  adminAlbum: (albumName: string): string => `adminAlbum/${albumName}`,
};

export const useAlbumName = () => {
  const { albumName } = useParams<{ albumName: string }>() as { albumName: string };
  return albumName
};

export const useAvailableAlbums = () => {
  const { data: albumInfo, isLoading } = useSWR<AvailableAlbumsResponse>(
    swrKeys.availableAlbums(),
    () => listAlbums()
  );
  return { albumInfo, isLoading };
}

export const useAlbumInfo = (refreshInterval = 0) => {
  const albumName = useAlbumName();
  const { data: albumInfo, isLoading } = useSWR<AlbumInfoResponse>(
    albumName ? swrKeys.albumInfo(albumName) : null,
    () =>
      getAlbumInfo({
        path: { album_name: albumName },
      }),
    { refreshInterval }
  );
  return { albumInfo, isLoading };
}

export const useAlbumLastImage = (albumNameOverride?: string, refreshInterval = 0) => {
  const routeAlbumName = useAlbumName();
  const albumName = albumNameOverride ?? routeAlbumName;
  const { data: albumLastImage, isLoading } = useSWR<LastImageResponse>(
    albumName ? swrKeys.albumLastImage(albumName) : null,
    () =>
      getAlbumLastImage({
        path: { album_name: albumName },
      }),
    { refreshInterval }
  );
  return { albumLastImage, isLoading };
}

export const useQrCodes = () => {
  const { data: qrCodes, isLoading } = useSWR<QrCodesResponse>(
    swrKeys.qrCodes(),
    () => getQrCodes()
  );
  return { qrCodes, isLoading };
}

export const createAlbumAndRefresh = async (
  albumName: string,
  description: string,
  showError: ShowErrorFn,
): Promise<AlbumCreatedResponse | undefined> => {
  return runWithGlobalApiErrorHandling(
    async () => {
      const createdAlbum = await createAlbum({
        body: { album_name: albumName, description },
      });

      await mutate(swrKeys.availableAlbums());
      return createdAlbum;
    },
    showError,
    'Kunne ikke opprette album',
  );
};

export const captureImageToAlbumAndRefresh = async (
  albumName: string,
  showError: ShowErrorFn,
): Promise<AlbumCaptureResponse | undefined> => {
  return runWithGlobalApiErrorHandling(
    async () => {
      const capturedImage = await captureImageToAlbum({
        path: { album_name: albumName },
      });

      await Promise.all([
        mutate(swrKeys.albumInfo(albumName)),
        mutate(swrKeys.albumLastImage(albumName)),
      ]);

      return capturedImage;
    },
    showError,
    'Kunne ikke ta bilde',
  );
};

export const useAdminConfig = () => {
  const { data: adminConfig, isLoading } = useSWR<AdminConfigResponse>(
    swrKeys.adminConfig(),
    () => getAdminConfig()
  );
  return { adminConfig, isLoading };
};

export const useAdminAlbum = () => {
  const albumName = useAlbumName();
  const { data: albumInfo, isLoading } = useSWR<AlbumInfoResponse>(
    albumName ? swrKeys.adminAlbum(albumName) : null,
    () =>
      getAdminAlbumInfo({
        path: { album_name: albumName },
      }),
  );
  return { albumInfo, isLoading };
};

export const updateAdminConfigAndRefresh = async (
  updates: AdminConfigUpdateRequest,
  showError: ShowErrorFn,
): Promise<AdminConfigResponse | undefined> => {
  return runWithGlobalApiErrorHandling(
    async () => {
      const updatedConfig = await updateAdminConfig({
        body: updates,
      });
      await mutate(swrKeys.adminConfig());
      return updatedConfig;
    },
    showError,
    'Kunne ikke lagre innstillinger',
  );
};

export const deleteAlbumAndRefresh = async (
  albumName: string,
  showError: ShowErrorFn,
): Promise<void> => {
  await runWithGlobalApiErrorHandling(
    async () => {
      await deleteAdminAlbum({
        path: { album_name: albumName },
      });
      await mutate(swrKeys.availableAlbums());
    },
    showError,
    'Kunne ikke slette album',
  );
};

export const deleteImageAndRefresh = async (
  albumName: string,
  imageNumber: number,
  showError: ShowErrorFn,
): Promise<void> => {
  await runWithGlobalApiErrorHandling(
    async () => {
      await deleteAdminImage({
        path: { album_name: albumName, image_number: imageNumber },
      });
      await mutate(swrKeys.adminAlbum(albumName));
    },
    showError,
    'Kunne ikke slette bilde',
  );
};
