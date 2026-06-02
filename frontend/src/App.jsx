import { SignInButton, SignUpButton, UserButton, SignedOut, SignedIn} from '@clerk/clerk-react'
import './App.css'



function App() {


  return (
    <div>
      
    <h1>wellcome</h1>
    <header>
        <SignedOut>
           <SignInButton mode="modal">
      <button className="w-36 p-4 bg-gray-900 text-white rounded">
        Sign In
      </button>
    </SignInButton>
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
    </header>
          </div>
  )
}

export default App
