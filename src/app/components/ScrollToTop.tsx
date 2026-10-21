import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

/** Instantly jump to top, ignoring CSS `scroll-behavior: smooth`. */
function forceScrollTop() {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;

  html.style.scrollBehavior = prev;
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Hash links (e.g. #holmes-logo) handle their own target scroll.
    if (hash) return;

    forceScrollTop();
    requestAnimationFrame(forceScrollTop);
  }, [pathname, hash]);

  return null;
}
