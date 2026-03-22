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
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-base-600 text-base-50 shadow-sm transition group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.5 4a1.5 1.5 0 0 0-1.5 1.5V7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-3V5.5A1.5 1.5 0 0 0 14.5 4h-5ZM12 10a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Zm-2.5 4.25a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z" />
            </svg>
          </span>
          <span className="font-display text-2xl leading-none text-base-800">BildeBua</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
