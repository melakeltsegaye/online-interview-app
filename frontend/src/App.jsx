import { SignInButton, SignUpButton, UserButton, SignedOut, SignedIn, useUser} from '@clerk/clerk-react'
import { Routes,Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import { Toaster } from 'react-hot-toast'
import ProblemPage from './pages/ProblemPage'





function App() {

const {isSignedIn, isLoaded} = useUser()

if (!isLoaded) return null
  return (
    <>
    <Routes>
      
 
     <Route path="/" element = {!isSignedIn? <HomePage /> : <Navigate to={"/dashboard"} />
    } />
     <Route path="/dashboard" element = {!isSignedIn? <HomePage /> : <DashboardPage />
    } />
     <Route path="/problems" element = {isSignedIn?<ProblemsPage /> : <Navigate to={"/"} />} />
     <Route path="/problem/:id" element = {isSignedIn?<ProblemPage /> : <Navigate to={"/"} />} />
   
          </Routes>
          <Toaster/>
    </>
  )
}

export default App
