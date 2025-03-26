import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../reducers/hooks"
import { logout } from "../reducers/auth"
import logo from "../assets/logo.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCog, faTasks, faCalendar, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth')
    }
    return(
        <div className="flex flex-col fixed left-0 top-0 w-[14%] bg-white h-screen
        border-gray-200 border-r-[1px] pt-5 pb-5">
            <h1 className="bg-white md:w-52 font-rubikMed text-3xl md:text-4xl text-gray-800
            pt-2 pb-2 rounded-md mb-7 hover:cursor-pointer"
                    >
                <img
                    className="inline md:h-7 mb-2  mr-1 pl-8"
                    src={logo}
                    alt="Logo"
                />
                Ordo
            </h1>
            <nav className="flex flex-col h-full justify-between">
                <ul className="flex flex-col">
                    <li >
                        <NavLink to="/home" 
                        className="text-gray-500 font-rubikMed pl-8 rounded-r-full pt-3 pb-3 w-[97%] block
                         hover:bg-gray-100 hover:cursor-pointer hover:text-indigo-500
                          aria-[current=page]:bg-indigo-700 aria-[current=page]:text-white ">
                            <FontAwesomeIcon  icon={faHome} size="sm" className="inline mr-2"/>
                        Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/schedule"
                         className="text-gray-500 font-rubikMed pl-8 rounded-r-full pt-3 pb-3 w-[97%] block
                         hover:bg-gray-100 hover:cursor-pointer hover:text-indigo-500
                          aria-[current=page]:bg-indigo-700 aria-[current=page]:text-white ">
                            <FontAwesomeIcon  icon={faCalendar} size="sm" className="inline mr-2"/>
                        Schedule
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks"
                         className="text-gray-500 font-rubikMed pl-8 rounded-r-full pt-3 pb-3 w-[97%] block
                         hover:bg-gray-100 hover:cursor-pointer hover:text-indigo-500
                          aria-[current=page]:bg-indigo-700 aria-[current=page]:text-white ">
                            <FontAwesomeIcon  icon={faTasks} size="sm" className="inline mr-2"/>
                        Tasks
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/preferences"
                         className="text-gray-500 font-rubikMed pl-8 rounded-r-full pt-3 pb-3 w-[97%] block
                         hover:bg-gray-100 hover:cursor-pointer hover:text-indigo-500
                          aria-[current=page]:bg-indigo-700 aria-[current=page]:text-white ">
                            <FontAwesomeIcon  icon={faCog} size="sm" className="inline mr-2"/>
                        Preferences
                        </NavLink>
                    </li>
                </ul>
            </nav>
                <button onClick={handleLogout}
                    className="text-red-600 font-rubikMed pl-8 text-left hover:cursor-pointer hover:bg-gray-100 w-full
                    pt-3 pb-3">
                        <FontAwesomeIcon  icon={faArrowRightFromBracket} size="sm" className="inline mr-2"/>
                    Logout
                </button>
            
        </div>
    )
}

export default Navbar