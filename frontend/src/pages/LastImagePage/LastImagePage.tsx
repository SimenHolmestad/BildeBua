import React from 'react';
import LastImage from 'components/LastImage';
import { useParams } from 'react-router-dom';
import { useRedirectOnForcedAlbumChange } from 'hooks/swr';
import routes from 'routes';

const LastImagePage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  useRedirectOnForcedAlbumChange(routes.lastImagePage);

  return (
    <LastImage albumName={albumName} />
  );
};

export default LastImagePage;
