import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/UserContext'


import Login from './pages/Login'
import LoginCallback from './pages/LoginCallback'
import Dashboard from './pages/Dashboard'
import SetUsername from './pages/SetUsername'
import AddFriendPage from './pages/AddFriendPage'
import IncomingRequest from './pages/IncomingRequest'
import PendingRequest from './pages/PendingRequest'
import Tinder from './pages/Tinder'
import IncomingPairRequest from './pages/IncomingPairRequest'
import Match from './pages/Match'

const router = createBrowserRouter([
  { path: "/", element: <App />, children: [
      { path: "/", element: <Login /> },
      { path: "callback", element: <LoginCallback /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "setusername", element: <SetUsername /> },
      { path: "addfriend", element: <AddFriendPage /> },
      { path: "request", element: <IncomingRequest /> },
      { path: "pendingrequest", element: <PendingRequest /> },
      { path: "tinder", element: <Tinder /> },
      { path: "pairrequest", element: <IncomingPairRequest /> },
      { path: "match", element: <Match /> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
 
  </>,
)
