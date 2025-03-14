import axios from "axios"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks"
import { loginSuccess } from "../../reducers/auth"
import { useNavigate } from "react-router-dom"

interface LoginProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Login = ( {setSignupPage} : LoginProps) => {

    const auth = useAppSelector((state => state.auth));
    const dispatch = useAppDispatch();
    const { isLoggedIn } = auth
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    // Redirect to homepage once logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home")
        }
    },[isLoggedIn])

    const handleLogin = (e : React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();

        if(password.length >= 8 && email.length >= 8){

        axios.post("https://ordo-backend.fly.dev/auth/login", {
            email,
            password,
        }).then((res) => {
            // Logged in, store token and user info
            dispatch(loginSuccess(res.data.token))
        }).catch(() => {
            setError(true);
        })
        } else {
        setError(true);
        }
    }

    const demoLogin = () => {
        //Login with test user info
        axios.post("https://ordo-backend.fly.dev/auth/login", {
            email: "testuser@email.com",
            password: "password"
        }).then((res) => {
            dispatch(loginSuccess(res.data.token))
        }).catch(() => {
            setError(true)
        })
    }

    return(
        <div className="p-5 md:pt-40 md:pb-20 md:pl-44 md:pr-48 md:h-full  bg-white font-rubik rounded-[1.5rem] md:rounded-r-none md:rounded-l-[2.5rem]
        h-screen">
            <h1 className=" font-bold text-2xl md:text-3xl mb-7 tracking-wide text-center md:text-left">
                Log in
            </h1>
            <form className="flex flex-col">
                {error && 
                <p className="text-red-500 text-center md:text-left mb-1 mt-1">
                    Invalid email or password. Please try again.
                    </p>
                }
                <label htmlFor="email" className="text-gray-400">
                    Email
                </label>
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                                        ${isLoading && 'brightness-95'}`}>
                            
                    </input>
                <label htmlFor="password" className="text-gray-400">
                    Password
                </label>
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                                        ${isLoading && 'brightness-95'}`}>
                    </input>
                <input type="submit"
                       placeholder="Log in"
                       value="Log in"
                       onClick={(e) => handleLogin(e)}
                       className={`p-2 bg-indigo-400 rounded-2xl text-white
                        font-semibold hover:cursor-pointer hover:brightness-105
                        active:brightness-110
                        ${isLoading && 'brightness-90'}`}>
                </input>
            </form>
            <p className="mt-5 text-gray-400">
                Don't have an account yet?
                <button onClick={() => setSignupPage(true)}
                    className="text-indigo-400 ml-1 hover:brightness-90 hover:underline hover:cursor-pointer">
                    Sign up
                </button>
            </p>
            <p className=" text-gray-400">
                Want to try it out first? Check out the 
                <button onClick={demoLogin} 
                className="text-indigo-400 ml-1 hover:brightness-90 hover:underline hover:cursor-pointer">
                    Demo Version
                </button>
            </p>
        </div>
    )
}

export default Login