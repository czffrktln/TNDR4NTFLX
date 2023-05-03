import Button from '@mui/material/Button'

const Login = () => {
  
  const googleLink = "https://accounts.google.com/o/oauth2/v2/auth"
  const clientId = "665656248711-h7gchpi9tpohaqrgtni6rglg8nd57tv2.apps.googleusercontent.com"
  const redirectUri = "http://localhost:5173/callback"
  const scope = "openid%20email%20profile"
  const responseType = "code"
  
  const googleLoginUrl = `${googleLink}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=consent`
  
  return (
    <div id="loginButton">
      <a href={googleLoginUrl}>
        <button>LOGIN</button>
      </a>
    </div>
  )
}
export default Login