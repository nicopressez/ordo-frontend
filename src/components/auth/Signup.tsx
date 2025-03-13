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
        },[isLoggedIn])

    const handleSignup = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        setErrors({name: false, email:false, password: false,  repeatPassword:false, emailInUse:false, unknownError:false});

        //Form checks before sending API request
        if(name.length < 3 || name.length > 15) return setErrors(prevErrors => ({...prevErrors, name:true}));
        if(email.length < 5) return setErrors(prevErrors => ({...prevErrors, email:true}));
        if(password.length < 8) return setErrors(prevErrors => ({...prevErrors, password:true}));
        if (password !== repeatPassword) return setErrors(prevErrors => ({...prevErrors, repeatPassword:true}));


        axios.post("https://ordo-backend.fly.dev/auth/signup", {
            name,
            email,
            password,
            repeatPassword
        }).then((res) => {
            // Signed up, log user in, store token and user info
            dispatch(loginSuccess(res.data.token));
        }).catch((err) => {
            if(err.response.data.errors[0].path === "email") {
                setErrors(prevErrors => ({...prevErrors, emailInUse: true}));
            } else {
                setErrors(prevErrors => ({...prevErrors, unknownError:true}));
            }
        })
    }

    return(
        <div>
            <form>
                {errors.unknownError && 
                <p>An error occured, please try again</p>}
                {errors.name && 
                <p>Name must be between 3 and 15 characters long</p>}
                <label htmlFor="name">
                    Name
                    <input type="text"
                           id="name"
                           name="name"
                           value={name}
                           onChange={(e) => setName(e.target.value)} />
                </label>
                {errors.emailInUse && 
                <p>Email already in use, please log in or try a different address</p>}
                {errors.email && 
                <p>Email must be at least 5 characters long</p>}
                <label htmlFor="email">
                    Email
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                </label>
                {errors.password && 
                <p>Password must be at least 8 characters long</p>}
                <label htmlFor="password">
                    Password
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)} />
                </label>
                {errors.repeatPassword && 
                <p>Passwords don't match</p>}
                <label htmlFor="repeatPassword">
                    Repeat password
                    <input type="password"
                           id="repeatPassword"
                           name="repeatPassword"
                           value={repeatPassword}
                           onChange={(e) => setRepeatPassword(e.target.value)} />
                </label>
                <input type="submit"
                       placeholder="Sign up"
                       onClick={(e) => handleSignup(e)} />
            </form>

            Already have an account? 
            <button onClick={() => setSignupPage(false)}>
                Log in
            </button>
        </div>
    )
}

export default Signup