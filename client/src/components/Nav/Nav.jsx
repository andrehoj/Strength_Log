import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth/auth";

export const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="px-2 sm:px-4 py-2.5 rounded text-white">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite Logo"
        />

        <button
          onClick={() => setIsOpen(!isOpen)}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-primary rounded-lg md:hidden  focus:outline-none  "
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`${
            isOpen
              ? " md:block md:w-auto w-full"
              : "hidden md:block md:w-auto w-full"
          }`}
          id="navbar-default"
        >
          <ul className="flex flex-col p-4 mt-4 text-center md:text-start rounded-lg border md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
            <li>
              <Link
                to={"/Templates"}
                className="block py-2 pr-4 pl-3 rounded hover:text-primary md:hover:bg-transparent md:border-0 md:dark:hover:bg-transparent"
              >
                Templates
              </Link>
            </li>
            <li>
              <Link
                to={"/Routines"}
                className="block py-2 pr-4 pl-3 rounded hover:text-primary md:hover:bg-transparent md:border-0 md:dark:hover:bg-transparent"
              >
                Routines
              </Link>
            </li>
            {Auth.isLoggedIn() ? (
              <>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 rounded hover:text-primary md:hover:bg-transparent md:border-0 md:dark:hover:bg-transparent"
                  >
                    Account
                  </a>
                </li>

                <li>
                  <a
                    className="block py-2 pr-4 pl-3 rounded hover:text-primary md:hover:bg-transparent md:border-0 md:dark:hover:bg-transparent cursor-pointer"
                    onClick={() => Auth.logout()}
                  >
                    logout
                  </a>
                </li>
              </>
            ) : (
              <li className="flex md:flex-col justify-center items-center md:block">
                <Link to={"/Login"}>
                  <button
                    type="button"
                    className="w-fit  text-primary hover:text-background border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary_faded font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Log in
                  </button>
                </Link>
                <Link to={"/Signup"}>
                  <button
                    type="button"
                    className="w-fit text-background bg-gradient-to-r from-primary via-primary to-primary_faded hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
                focus:ring-primary_faded font-medium rounded-lg px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Sign up
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};