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
        if(isLoading) return;
        setIsLoading(true);

        if(password.length >= 8 && email.length >= 8){

        axios.post("https://ordo-backend.fly.dev/auth/login", {
            email,
            password,
        }).then((res) => {
            // Logged in, store token and user info
            setTimeout(() => {
                setIsLoading(false);
                dispatch(loginSuccess(res.data.token));
            }, 500);
            
        }).catch(() => {
            setTimeout(() => {
                setError(true);
                setIsLoading(false);
            }, 500);
        })
        } else {
            setTimeout(() => {
                setError(true);
                setIsLoading(false);
            }, 1500);
        }
    }

    const demoLogin = () => {
        if(isLoading) return;
        setIsLoading(true);
        //Login with test user info
        axios.post("https://ordo-backend.fly.dev/auth/login", {
            email: "testuser@email.com",
            password: "password"
        }).then((res) => {
            setTimeout(() => {
                dispatch(loginSuccess(res.data.token))
            }, 500);
        }).catch(() => {
            setTimeout(() => {
                setError(true)
            }, 500);
        })
    }

    return(
        <div className="p-5 md:pt-40 md:pb-20 md:pl-44 md:pr-48 md:h-full  bg-white font-rubik rounded-[1.5rem] md:rounded-r-none md:rounded-l-[2.5rem]
        h-screen">
            <h1 className=" font-bold text-2xl md:text-3xl mb-7 tracking-wide text-center md:text-left">
                Log in
            </h1>
            <form className="flex flex-col">
                <div>
                <label htmlFor="email" className="text-gray-400">
                    Email
                </label>
                {error && 
                <p className="text-red-500 float-right">
                    Invalid email or password. Please try again.
                    </p>
                }
                </div>
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                if(isLoading) return;
                                setEmail(e.target.value);
                            }}
                            className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                                        ${isLoading && 'brightness-75 cursor-default'}`}>
                            
                    </input>
                <label htmlFor="password" className="text-gray-400">
                    Password
                </label>
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => {
                            if(isLoading) return;
                            setPassword(e.target.value);
                        }}
                           className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                                        ${isLoading && 'brightness-75 cursor-default'}`}>
                    </input>
                <input type="submit"
                       placeholder="Log in"
                       value="Log in"
                       onClick={(e) => handleLogin(e)}
                       className={`p-2 bg-indigo-400 rounded-2xl text-white
                        font-semibold 
                        ${isLoading ? 'brightness-95' : 
                        "hover:cursor-pointer hover:brightness-105 active:brightness-110"}`}>
                </input>
            </form>
            <p className="mt-5 text-gray-400">
                Don't have an account yet?
                <button onClick={() => {
                    if(isLoading) return;
                    setSignupPage(true);
                }}
                    className={`text-indigo-400 ml-1
                        ${isLoading ? "cursor-default" : "hover:brightness-90 hover:underline hover:cursor-pointer"}`} >
                    Sign up
                </button>
            </p>
            <p className=" text-gray-400">
                Want to try it out first? Check out the 
                <button onClick={demoLogin} 
                className={`text-indigo-400 ml-1
                ${isLoading ? "cursor-default" : "hover:brightness-90 hover:underline hover:cursor-pointer"}`}>
                    Demo Version
                </button>
            </p>
        </div>
    )
}

export default Login