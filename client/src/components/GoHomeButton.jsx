import { useNavigate } from "react-router-dom"

const GoHomeButton = () => {

  const navigate = useNavigate()

  const goHome = () => {
    navigate('/dashboard')
  }

  return (
    <>
    <button onClick={goHome}>home</button>
    </>
  )
}

export default GoHomeButton