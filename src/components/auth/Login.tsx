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

    return(
        <div>
            <h1>Log in</h1>
            <form>
                {error && 
                <p>Invalid email or password. Please try again.</p>
                }
                <label htmlFor="email">
                    Email
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}>
                            
                    </input>
                </label>
                <label htmlFor="password">
                    Password
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}>
                    </input>

                </label>
                <input type="submit"
                       placeholder="Log in"
                       onClick={(e) => handleLogin(e)}>
                </input>
            </form>
            Don't have an account yet?
            <button onClick={() => setSignupPage(true)}>
                Sign up
            </button>
        </div>
    )
}

export default Login