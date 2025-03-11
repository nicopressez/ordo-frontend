import axios from "axios";
import { useState } from "react"

interface SignupProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Signup = ({setSignupPage} : SignupProps) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("")

    const handleSignup = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();

        axios.post("https://ordo-backend.fly.dev/auth/signup", {
            name,
            email,
            password,
            repeatPassword
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return(
        <div>
            <form>
                <label htmlFor="name">
                    Name
                    <input type="text"
                           id="name"
                           name="name"
                           value={name}
                           onChange={(e) => setName(e.target.value)} />
                </label>
                <label htmlFor="email">
                    Email
                    <input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="password">
                    Password
                    <input type="password" 
                           id="password"
                           name="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)} />
                </label>
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