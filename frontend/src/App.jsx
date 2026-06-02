import { Show, SignInButton, SignUpButton, UserButton, SignedOut, SignedIn} from '@clerk/react'
import './App.css'

function App() {


  return (
    <>
    <h1>wellcome</h1>
    <header>
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
    </header>
          </>
  )
}

export default App
