import { useState } from "react"
import Signup from "./Signup"
import Login from "./Login"

const Auth = () => {

    const [signupPage, setSignupPage] = useState(false)
    return(
        <div>
            {signupPage 
            ? <Signup setSignupPage={setSignupPage}/> 
            : <Login setSignupPage={setSignupPage}/>}
        </div>
        
    )
}

export default Auth