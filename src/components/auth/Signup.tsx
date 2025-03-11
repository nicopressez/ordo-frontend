interface SignupProps {
    setSignupPage: React.Dispatch<React.SetStateAction<boolean>>
}

const Signup = ({setSignupPage} : SignupProps) => {
    return(
        <div>
            <form>
                <label htmlFor="name">
                    Name
                    <input type="text"
                           id="text"
                           name="text">
                    </input>
                </label>
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
                <label htmlFor="repeatPassword">
                    Repeat password
                    <input type="password"
                           id="repeatPassword"
                           name="repeatPassword">

                    </input>
                </label>
                <input type="submit"
                       placeholder="Sign up">
                    
                </input>
            </form>
            
            Already have an account? 
            <button onClick={() => setSignupPage(false)}>
                Log in
            </button>
        </div>
    )
}

export default Signup