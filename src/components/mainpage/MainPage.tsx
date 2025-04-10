import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import { useMediaQuery } from 'usehooks-ts'

// Define the type of the context
export interface OutletContextType {
    isLargeDevice: boolean;
  }

const MainPage = () => {

    const isLargeDevice = useMediaQuery("only screen and (min-width: 1024px)");

    const outletContext : OutletContextType = {isLargeDevice}

    return (
        <div className=" overflow-x-hidden">
            <Navbar isLargeDevice={isLargeDevice}/>
            <Outlet context={outletContext}/>
        </div>
    )
}

export default MainPage