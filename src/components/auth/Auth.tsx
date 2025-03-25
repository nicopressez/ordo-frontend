import { useState } from "react"
import Signup from "./Signup"
import Login from "./Login"
import logo from '../../assets/logo.svg';
import { Transition } from '@headlessui/react'

const Auth = () => {

    const [signupPage, setSignupPage] = useState(false)
    return(
        <div className=" p-3 lg:p-0 bg-indigo-300 w-screen min-h-screen lg:fixed">
            <div className="lg:fixed p-2 lg:p-0 lg:top-36 lg:left-12">
                <Transition as="div" show={true} appear={true} 
                 enter="transition-all duration-750"
                 enterFrom="opacity-0"
                 enterTo="opacity-100">
                <h1
                    className="bg-white lg:w-46 text-3xl md:text-4xl lg:text-5xl text-gray-800 pl-5
          pt-2 pb-2 rounded-md font-rubikMed"
                >
                    <img
                        className="inline lg:h-8 mb-2 mr-1"
                        src={logo}
                        alt="Logo"
                    ></img>
                    Ordo
                </h1>
                </Transition>
                <Transition as="div" show={true} appear={true} 
                 enter="transition-all duration-1250"
                 enterFrom="opacity-0"
                 enterTo="opacity-100">
                <div className="mb-3 font-rubikMed text-xl md:text-2xl lg:text-3xl mt-4">
                    <p>
                        Seamlessly organize your tasks,<br />
                        optimize your schedule, <br />
                        and stay productive, <br />
                        with AI-driven planning. <br />
                    </p>
                </div>
                </Transition>
                <Transition as="div" show={true} appear={true} 
                 enter="transition-all duration-1750"
                 enterFrom="opacity-0"
                 enterTo="opacity-100">
                <div className="font-rubik mt-2 hidden lg:inline lg:mt-3 lg:text-lg">
                    <p>
                        Effortlessly balance work, life, and priorities with intelligent <br />
                        scheduling that adapts to you. Track progress, manage tasks, <br />
                        and make the most of every day - your time, optimized.
                    </p>
                    
                </div>
                </Transition>
            </div>
            <div className=" lg:pl-[44%] lg:h-full ">
                <Transition show={signupPage} as="div"
                className="h-full"
                enter="transition-all duration-500"
                enterFrom="translate-x-40 opacity-0"
                enterTo="translate-x-0 opacity-100">
                    <Signup setSignupPage={setSignupPage}/>
                </Transition>
                <Transition show={signupPage === false} as="div"
                className="h-full"
                enter="transition-all duration-500"
                enterFrom="translate-x-40 opacity-0"
                enterTo="translate-x-0 opacity-100">
                    <Login setSignupPage={setSignupPage}/>
                </Transition>
            </div>
        </div>
        
    )
}

export default Auth