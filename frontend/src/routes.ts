const routes = {
  home: '/',
  notFound: '/notfound',
  qr: '/qr',
  albumOverview: (albumName: string): string => `/album/${albumName}`,
  albumDetail: (albumName: string): string => `/album/${albumName}/detail`,
  albumLastImage: (albumName: string): string => `/album/${albumName}/last_image`,
  albumLastImageQr: (albumName: string): string => `/album/${albumName}/last_image_qr`,
  albumSlideshow: (albumName: string): string => `/album/${albumName}/slideshow`,
  albumSlideshowLastImage: (albumName: string): string => `/album/${albumName}/slideshow_last_image`,
};

export default routes;
