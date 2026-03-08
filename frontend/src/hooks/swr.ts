import useSWR, { mutate } from 'swr';
import { useParams } from 'react-router-dom';
import {
  captureImageToAlbum,
  createAlbum,
  getAlbumInfo,
  getAlbumLastImage,
  getQrCodes,
  listAlbums,
} from 'api';
import type {
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

export const useAlbumLastImage = (refreshInterval = 0) => {
  const albumName = useAlbumName();
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
    'Failed to create album',
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
    'Failed to capture image',
  );
};
