import { useState } from "react"
import Signup from "./Signup"
import Login from "./Login"
import logo from '../../assets/logo.svg';

const Auth = () => {

    const [signupPage, setSignupPage] = useState(false)
    return(
        <div className=" p-3 md:p-0 bg-indigo-300 w-screen h-full md:fixed">
            <div className="md:fixed p-2 md:p-0 md:top-36 md:left-12">
                <h1
                    className="bg-white md:w-46 text-3xl md:text-5xl text-gray-800 pl-5
          pt-2 pb-2 rounded-md font-rubikMed"
                >
                    <img
                        className="inline md:h-8 mb-2 mr-1"
                        src={logo}
                        alt="Logo"
                    ></img>
                    Ordo
                </h1>
                <div className="mb-3 font-rubikMed text-2xl md:text-3xl mt-4">
                    <p>
                        Seamlessly organize your tasks,<br />
                        optimize your schedule, <br />
                        and stay productive, <br />
                        with AI-driven planning. <br />
                    </p>
                </div>
                <div className="font-rubik mt-2 hidden md:inline md:mt-3 md:text-lg">
                    <p>
                        Effortlessly balance work, life, and priorities with intelligent <br />
                        scheduling that adapts to you. Track progress, manage tasks, <br />
                        and make the most of every day - your time, optimized.
                    </p>
                </div>
            </div>
            <div className=" md:pl-[44%] md:h-full">
                {signupPage ? 
                    <Signup setSignupPage={setSignupPage}/>
                 : 
                    <Login setSignupPage={setSignupPage}/>
                }
            </div>
        </div>
        
    )
}

export default Auth