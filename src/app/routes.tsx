import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import Home from "./pages/Home";
import Product from "./pages/Product";
import News from "./pages/News";
import ArticleDetail from "./pages/ArticleDetail";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/product",
        Component: Product,
      },
      {
        path: "/news",
        Component: News,
      },
      {
        path: "/news/:slug",
        Component: ArticleDetail,
      },
    ],
  },
]);