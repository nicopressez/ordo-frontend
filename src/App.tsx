import axios from "axios"
import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./reducers/hooks"
import { logout, loginSuccess } from "./reducers/auth";

function App() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // If token exists, try refreshing user info
    const token = localStorage.getItem("token");

    if (token) {
      // Check if the user is already logged in

        axios.post("https://ordo-backend.fly.dev/auth/token", {}, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        })
          .then((res) => {
            // Store new token and refresh user info
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess(res.data.token));  
          })
          .catch(() => {
            // Token is invalid or expired
            dispatch(logout());
            navigate("/auth");
          });
      
    } else {
      // If no token, navigate to the login page
      if (location.pathname !== "/auth") navigate("/auth");
    }
  }, [isLoggedIn, location.pathname]);



  

  return (
    <Outlet />
  )
}

export default App
