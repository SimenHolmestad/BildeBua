const routes = {
  frontPage: '/',
  notFoundPage: '/notfound',
  qrCodePage: '/qr',
  albumPage: (albumName: string): string => `/album/${albumName}`,
  albumPageDetail: (albumName: string): string => `/album/${albumName}/detail`,
  lastImagePage: (albumName: string): string => `/album/${albumName}/last_image`,
  qrCodeLastImagePage: (albumName: string): string => `/album/${albumName}/last_image_qr`,
  slideshowPage: (albumName: string): string => `/album/${albumName}/slideshow`,
  slideshowLastImagePage: (albumName: string): string => `/album/${albumName}/slideshow_last_image`,
};

export default routes;
