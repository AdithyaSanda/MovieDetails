import { useActionState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, Navigate } from "react-router-dom"
export default function Signin() {

    const { signinUser } = useAuth()
    const navigate = useNavigate()

    const [error, submitAction, isPending] = useActionState(async (previousState, formData) => {
        const email = formData.get('email')
        const password = formData.get('password')

        
            const { success, data, error:signInError} = await signinUser(email, password)

            if(signInError) {
                return new Error(signInError)
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
                    <h2>Sign in</h2>
                    <p>Don't have an account yet?{' '}
                        <Link to="/signup">
                            <span className="signup">Sign up</span>
                        </Link>
                         
                    </p>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="example@mail.com" name="email" id="email" required/>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="password" name="password" id="password" required/>
                    {error && <div className="error-msg">{error.message}</div>}
                    <button type="submit">Sign In</button>

                    
                </form>
            </div>
        </div>
    )
}