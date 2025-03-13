import axios from "axios";
import { useState } from "react"

interface SignupProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Signup = ({setSignupPage} : SignupProps) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        repeatPassword: false,
    })

    const handleSignup = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        setErrors({name: false, email:false, password: false,  repeatPassword:false});

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
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    return(
        <div>
            <form>
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