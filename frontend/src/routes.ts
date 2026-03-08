const routes = {
  frontPage: '/',
  notFoundPage: '/notfound',
  qrCodePage: '/qr',
  albumPage: (albumName: string): string => `/album/${albumName}`,
  albumImageDetailPage: (albumName: string, imageNumber: string | number): string => `/album/${albumName}/image/${imageNumber}`,
  lastImagePage: (albumName: string): string => `/album/${albumName}/last_image`,
  qrCodeLastImagePage: (albumName: string): string => `/album/${albumName}/last_image_qr`,
  slideshowPage: (albumName: string): string => `/album/${albumName}/slideshow`,
  slideshowLastImagePage: (albumName: string): string => `/album/${albumName}/slideshow_last_image`,
};

export default routes;
