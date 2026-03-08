import React from 'react';

const AlbumEmptyMessage = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h2 className="font-display text-4xl text-base-900 sm:text-5xl">Det finnes ingen bilder</h2>
        <p className="mt-4 text-lg text-base-700">
          Det er ingen bilder i dette albumet ennå. Bilder vil vises her når de blir tatt.
        </p>
      </div>
    </div>
  );
};

export default AlbumEmptyMessage;
