import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { isAuth, logout } from "../helpers/auth";

Router.events.on("routeChangeStart", (url) => NProgress.start());
Router.events.on("routeChangeComplete", (url) => NProgress.done());
Router.events.on("routeChangeError", (url) => NProgress.done());

const Layout = ({ children }) => {
  const head = () => (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/static/css/style.css" />
    </>
  );

  const handleLogout = () => {
    logout(() => {
      Router.push("/");
    });
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-warning">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-dark">Home</a>
        </Link>
      </li>

      {!isAuth() && (
        <>
          <li className="nav-item ml-auto">
            <Link href="/login">
              <a className="nav-link text-dark">Login</a>
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-dark">Register</a>
            </Link>
          </li>
        </>
      )}

      {isAuth() && isAuth()?.role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin">
            <a className="nav-link text-dark">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role !== "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/user">
            <a className="nav-link text-dark">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a
            className="nav-link text-dark"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </a>
        </li>
      )}
    </ul>
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
