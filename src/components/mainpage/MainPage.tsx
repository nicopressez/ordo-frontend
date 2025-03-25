import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"

const MainPage = () => {
    return (
        <div className="overflow-hidden">
            <Navbar />
            <Outlet />
        </div>
    )
}

export default MainPage