import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'routes';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="font-display text-5xl text-base-900">404</p>
      <h1 className="mt-3 font-display text-3xl text-base-900">Ikke funnet</h1>
      <p className="mt-2 text-base text-base-700">Kunne ikke finne dataen.</p>
      <Link
        to={routes.frontPage}
        className="mt-6 inline-flex items-center rounded-xl bg-base-600 px-5 py-3 text-sm font-semibold text-base-50 shadow-soft transition hover:bg-base-700"
      >
        Gå til forside
      </Link>
    </div>
  );
};

export default NotFound;
