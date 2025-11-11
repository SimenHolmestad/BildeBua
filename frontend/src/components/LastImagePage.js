import React from 'react';
import LastImage from './LastImage'
import { useParams } from 'react-router-dom';

function LastImagePage() {
  const { albumName } = useParams();
  return (
    <LastImage albumName={albumName}/>
  );
}

export default LastImagePage
