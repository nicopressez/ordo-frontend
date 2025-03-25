import axios from "axios";
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { loginSuccess } from "../../reducers/auth";
import { useNavigate } from "react-router-dom";

interface SignupProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Signup = ({setSignupPage} : SignupProps) => {

    const navigate = useNavigate();
    const auth = useAppSelector((state => state.auth))
    const dispatch = useAppDispatch();
    const { isLoggedIn } = auth

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        repeatPassword: false,
        emailInUse: false,
        unknownError: false,
    })

     useEffect(() => {
            if (isLoggedIn) {
                navigate("/home")
            }
        },[isLoggedIn]);

        // Add form error to state when detected
        const handleErrors = (field : keyof typeof errors) => {
            setTimeout(() => {
                setIsLoading(false);
                setErrors( prevErrors => ({...prevErrors, [field]:true}))
            }, 1500);
        }

    const handleSignup = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({name: false, email:false, password: false,  repeatPassword:false, emailInUse:false, unknownError:false});

        //Form checks before sending API request
        if(name.length < 3 || name.length > 15) return handleErrors("name");
        if(email.length < 5) return handleErrors("email");
        if(password.length < 8) return handleErrors("password");
        if (password !== repeatPassword) return handleErrors("repeatPassword")


        axios.post("https://ordo-backend.fly.dev/auth/signup", {
            name,
            email,
            password,
            repeatPassword
        }).then((res) => {
            // Signed up, log user in, store token and user info
            setTimeout(() => {
                setIsLoading(false);
                dispatch(loginSuccess(res.data.token));
            }, 500)
        }).catch((err) => {
            if(err.response.data.errors[0].path === "email") {
                setTimeout(() => {
                    handleErrors("emailInUse")
                }, 500);
            } else {
                setTimeout(() => {
                    handleErrors("unknownError")
                }, 500)
            }
        })
    }

    return(
        <div className="p-5 md:mt-3 md:p-7 md:ml-5 md:mr-5 lg:m-0 lg:pt-32 lg:pb-20 lg:pl-44 lg:pr-48 lg:h-screen  bg-white font-rubik rounded-[1.5rem] lg:rounded-r-none lg:rounded-l-[2.5rem]">
            <h1 className=" font-bold text-2xl mb-3 lg:text-3xl lg:mb-7 tracking-wide text-center lg:text-left">
                    Create Account
            </h1>
            <form
            className="flex flex-col">
                {errors.unknownError && 
                <p className=" text-red-500 float-right">
                    An error occured, please try again
                </p>}
                <div>
                <label htmlFor="name"  className="text-gray-400">
                    Name
                </label>
                {errors.name && 
                <p className=" text-red-500 float-right">
                    Name must be between 3 and 15 characters long
                </p>}
                </div>
                    <input type="text"
                           id="name"
                           name="name"
                           value={name}
                           onChange={(e) => setName(e.target.value)} 
                           className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                            ${isLoading && 'brightness-75 cursor-default'}`}/>

                <div>
                <label htmlFor="email"  className="text-gray-400">
                    Email
                </label>
                {errors.email && 
                <p className=" text-red-500 float-right">
                    Email must be at least 5 characters long
                </p>}
                {errors.emailInUse && 
                <p className=" text-red-500 float-right">
                    Email already in use, please log in or try a different address
                </p>}
                </div>
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                                ${isLoading && 'brightness-75 cursor-default'}`} />
                <div>
                <label htmlFor="password"  className="text-gray-400">
                    Password
                </label>
                {errors.password && 
                <p className=" text-red-500 float-right">
                    Password must be at least 8 characters long
                </p>}
                </div>
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                            ${isLoading && 'brightness-75 cursor-default'}`} />
                <div>
                <label htmlFor="repeatPassword"  className="text-gray-400 ">
                    Repeat password
                </label>
                {errors.repeatPassword && 
                <p className=" text-red-500 float-right">
                    Passwords don't match
                </p>}
                </div>
                    <input type="password"
                           id="repeatPassword"
                           name="repeatPassword"
                           value={repeatPassword}
                           onChange={(e) => setRepeatPassword(e.target.value)}
                           className={`border-gray-200 border-2 rounded-lg mb-5 p-2
                            ${isLoading && 'brightness-75 cursor-default'}`} />
                <input type="submit"
                       placeholder="Sign up"
                       value="Sign up"
                       onClick={(e) => handleSignup(e)}
                       className={`p-2 bg-indigo-400 rounded-2xl text-white
                        font-semibold
                       ${isLoading ? 'brightness-95' : 
                        "hover:cursor-pointer hover:brightness-105 active:brightness-110"}`} />
            </form>
            <p className=" text-gray-400 mt-5">
            Already have an account? 
                <button onClick={() => setSignupPage(false)}
                    className={`text-indigo-400 ml-1 
                    ${isLoading ? "cursor-default" : "hover:brightness-90 hover:underline hover:cursor-pointer"}`}>
                Log in
                </button>
            </p>
        </div>
    )
}

export default Signup