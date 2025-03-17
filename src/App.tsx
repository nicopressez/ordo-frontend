import axios from "axios"
import { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "./reducers/hooks"
import { logout } from "./reducers/auth";

function App() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Check on initial mount if user is logged in
  useEffect(() => {
    // If token in storage, send request to check & refresh it
    if(localStorage.getItem("token")) {
      axios.post("https://ordo-backend.fly.dev/auth/token", {} , {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }).then((res) => {
        // Append new refreshed token to storage
        localStorage.setItem("token", res.data.token)
      }).catch(() => {
        // Token expired or invalid. Log user out and redirect to auth
        dispatch(logout());
        navigate("/auth");
      })
    } else {
      if(location.pathname !== "/auth") navigate("/auth");
    }
  },[])


  

  return (
    <Outlet />
  )
}

export default App
