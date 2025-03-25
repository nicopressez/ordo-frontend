import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Auth from "./components/auth/Auth";
import MainPage from "./components/mainpage/MainPage";
import Homepage from "./components/mainpage/Homepage";
import Preferences from "./components/mainpage/Preferences";
import Schedule from "./components/mainpage/Schedule";
import Tasks from "./components/mainpage/Tasks";

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
                    element: <MainPage />,
                    children:[
                        {
                            element: <Homepage />,
                            path:"/home",
                        },
                        {
                            element:<Preferences />,
                            path: "/preferences"
                        },
                        {
                            element: <Schedule />,
                            path: "/schedule",
                        },
                        {
                            element: <Tasks />,
                            path: "/tasks"
                        }
                    ]
                }
        ]
        }
    ])
    return <RouterProvider router={router} />
};

export default Router