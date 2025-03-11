import axios from "axios"
import { useState } from "react"

interface LoginProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Login = ( {setSignupPage} : LoginProps) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = (e : React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();

        axios.post("https://ordo-backend.fly.dev/auth/login", {
            email,
            password,
        }).then((res) => {
            // Store user in redux
            // Store token
            // Redirect user to main page
            console.log(res)
        }).catch((err) => {
            // Add error handling
            console.log(err)
        })
    }

    return(
        <div>
            <h1>Log in</h1>
            <form>
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