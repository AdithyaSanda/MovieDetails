import { useActionState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
export default function Signup() {

    const {signUpNewUser} = useAuth()
    const navigate = useNavigate()

    const [error, submitAction, isPending] = useActionState(async (previousState, formData) => {
        const email = formData.get('email')
        const password = formData.get('password')
        const name = formData.get('name')
        
        const {success, data, error:signUpError} = await signUpNewUser(email, password, name)

        if(signUpError) {
            return new Error(signUpError)
        }
        
        if(success && data?.session) {
            navigate('/watchlist', {replace: true})
            return null
        }

        return null
    }, null)

    return(
        <div className="SigninPage">
            <div className="signin-form-container">
                <form className="form-container" action={submitAction}>
                    <h2>Sign up today!</h2>
                    <p>Already have an account?{' '}
                        <Link to="/signin">
                            <span className="signup">Sign in</span>
                        </Link>
                         
                    </p>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="example@mail.com" name="email" id="email" required/>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="password" name="password" id="password" required/>
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="eg. John Doe" name="name" id="name" required/>
                    <button type="submit">Sign Up</button>
                    
                    
                    {error && <div>{error.message}</div>}
                </form>
            </div>
        </div>
    )
}