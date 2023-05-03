import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { UserContext } from "../context/UserContext";

const LoginCallback = () => {

  const { login } = useContext(UserContext)
  const navigate = useNavigate()
  
  const urlSearchParams = new URLSearchParams(window.location.search)
  const googleCode = urlSearchParams.get("code")
  
  const sendCode = async () => {
    const response = await axios.post("http://localhost:8080/api/login", {
      code: googleCode
    })

    const sessionToken = response.data
    const decodedToken = jwt_decode(sessionToken)
    const token = decodedToken
    const user = {
      name: token.name, 
      picture: token.picture, 
      sub:token.sub, 
      friends: token.friends,
      id: token._id, 
      username: token.username
    }
    console.log("user", user);
    login(user, sessionToken)
    const usersub = user.sub
    console.log("usersub", usersub);

    const userName = await axios.post("http://localhost:8080/api/user/username", {
      usersub
    }, {
      headers: { Authorization: `Bearer ${sessionToken}`}
    })
    console.log("usernamebody", userName.body);

    if (userName.data === "") {
      navigate("/setusername")
    } else {
      navigate("/dashboard")
    }
  }

  useEffect(() => {
    sendCode()
  }, [])

  return (
    <div id="loginCallback">
    </div>
  )
}
export default LoginCallback