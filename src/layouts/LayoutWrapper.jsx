import React from "react";
import { matchPath } from "react-router-dom";
import Menu from "./Menu";

const LayoutWrapper = ({ children }) => {
  const pathname = location?.pathname || '';

  const definedRoutes = [
    "/",
    "/ticket",
    "/about",
    "/attendee",
    "/generated"
  ];

  const isKnownRoute = definedRoutes.some((route) =>
    matchPath({ path: route, exact: true }, pathname)
  );

  return (
    <div className="2xl:container w-[100%] mx-auto h-auto min-h-[100vh] relative">
      {isKnownRoute && <Menu />}
      {children}
    </div>
  );
};

export default LayoutWrapper;
