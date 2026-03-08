import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-base-200/80 bg-base-50/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-base-100"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-base-600 text-lg text-base-50 shadow-sm transition group-hover:scale-105">
            📷
          </span>
          <span className="font-display text-2xl leading-none text-base-800">BildeBua</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
