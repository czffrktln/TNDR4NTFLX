import { useEffect } from "react";
import { useState, createContext } from "react";


export const UserContext = createContext()


export const UserProvider = ({children}) => {
  
  const [ user, setUser ] = useState(null)
  const [ isLoggedIn, setIsLoggedIn ] = useState(false)
  const [ token, setToken ] = useState(null)

  const login = (user, token) => {
    setUser(user)
    setIsLoggedIn(true)
    setToken(token)
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setToken(null)
    localStorage.removeItem("token")
  }

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  // ha van token uj user lekeres
  //     setUser(JSON.parse(localStorage.getItem("token")))
  //     setIsLoggedIn(true)
  //   }
  // }, [])

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, login, logout, token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}