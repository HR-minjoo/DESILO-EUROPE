import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
