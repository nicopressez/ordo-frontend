import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/Auth";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element:<App />,
            children:[
                {
                    path:"/auth",
                    element:<Auth />
                }
        ]
        }
    ])
    return <RouterProvider router={router} />
};

export default Router