import React from "react";
import { Outlet } from "react-router";
import { ScrollToTop } from "./components/ScrollToTop";

export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      {children || <Outlet />}
    </>
  );
}
