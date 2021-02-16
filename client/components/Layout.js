import { useState } from "react";
import Link from "next/link";
import Router from "next/router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { isAuth, logout } from "../helpers/auth";

Router.events.on("routeChangeStart", (url) => NProgress.start());
Router.events.on("routeChangeComplete", (url) => NProgress.done());
Router.events.on("routeChangeError", (url) => NProgress.done());

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const head = () => (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
        crossorigin="anonymous"
      />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
      />
      <link rel="stylesheet" href="/static/css/style.css" />
    </>
  );

  const expandNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout(() => {
      Router.push("/");
    });
  };

  const nav = () => (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link href={isAuth() ? "/articles" : "/login"}>
          <a className="navbar-brand">
            <strong>MZZPK</strong>
          </a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => {
            expandNavbar();
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end ${
            isExpanded ? "show" : ""
          }`}
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav">
            {!isAuth() && (
              <Link href="/login">
                <a className="nav-item nav-link mt-1">Login</a>
              </Link>
            )}

            {isAuth() && isAuth()?.role === "admin" && (
              <Link href="/admin">
                <a className="nav-item nav-link mt-1">{isAuth().name}</a>
              </Link>
            )}

            {isAuth() && isAuth()?.role !== "admin" && (
              <Link href="/user">
                <a className="nav-item nav-link mt-1">{isAuth().name}</a>
              </Link>
            )}

            {isAuth() && (
              <a
                className="nav-item nav-link"
                onClick={() => {
                  handleLogout();
                }}
              >
                <div className="btn btn-danger btn-sm ml-2">Wyloguj</div>
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );

  return (
    <>
      {head()}
      {nav()}
      <div className="container pt-5 pb-5">{children}</div>
    </>
  );
};

export default Layout;
