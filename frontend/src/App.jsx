import { SignInButton, SignUpButton, UserButton, SignedOut, SignedIn, useUser} from '@clerk/clerk-react'
import { Routes,Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import { Toaster } from 'react-hot-toast'




function App() {

const {isSignedIn, isLoaded} = useUser()
  return (
    <>
    <Routes>
      
 
     <Route path="/" element = {<HomePage />} />
     <Route path="/problems" element = { isLoaded? (isSignedIn?<ProblemsPage /> : <Navigate to={"/"} />) : (<>
     Loading...
     </>)} />
   
          </Routes>
          <Toaster/>
    </>
  )
}

export default App
