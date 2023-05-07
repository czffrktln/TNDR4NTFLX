import { useNavigate } from "react-router-dom"

const BackButton = () => {

  const navigate = useNavigate()

  const navigateBack = () => {
    navigate(-1)
  }

  return (
    <div id="backButton">
    <button onClick={navigateBack}>back</button>
    </div>
  )
}
export default BackButton