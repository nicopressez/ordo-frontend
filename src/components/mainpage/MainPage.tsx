import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import { useMediaQuery } from "@uidotdev/usehooks";

// Define the type of the context
export interface OutletContextType {
    isLargeDevice: boolean;
  }

const MainPage = () => {

    const isLargeDevice = useMediaQuery("only screen and (min-width: 1040px)");

    const outletContext : OutletContextType = {isLargeDevice}

    return (
        <div className="overflow-hidden">
            <Navbar isLargeDevice={isLargeDevice}/>
            <Outlet context={outletContext}/>
        </div>
    )
}

export default MainPage