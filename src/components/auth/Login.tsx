interface LoginProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Login = ( {setSignupPage} : LoginProps) => {
    return(
        <div>
            <h1>Log in</h1>
            <form>
                <label htmlFor="email">
                    Email
                    <input type="email"
                            id="email"
                            name="email">
                    </input>
                </label>
                <label htmlFor="email">
                    Password
                    <input type="password" 
                           id="password"
                           name="password">
                    </input>
                </label>
            </form>
            Don't have an account yet?
            <button onClick={() => setSignupPage(true)}>
                Sign up
            </button>
        </div>
    )
}

export default Login