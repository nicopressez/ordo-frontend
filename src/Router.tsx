import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/auth/Auth";
import MainPage from "./components/MainPage";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element:<App />,
            children:[
                {
                    path:"/auth",
                    element:<Auth />
                },
                {
                    path:"/home",
                    element: <MainPage />
                }
        ]
        }
    ])
    return <RouterProvider router={router} />
};

export default Router