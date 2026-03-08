import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-base-200 bg-base-100/70">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <p className="font-display text-xl text-base-900">Håper du liker BildeBua!</p>
        <p className="mt-2 text-sm text-base-700">
          BildeBua er laget med Python, FastAPI, React og Tailwind. Kildekoden er tilgjengelig på{' '}
          <a
            className="font-semibold underline decoration-base-400 decoration-2 underline-offset-4 hover:decoration-base-700"
            href="https://github.com/SimenHolmestad/BildeBua"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
