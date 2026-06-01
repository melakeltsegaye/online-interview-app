import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import './App.css'

function App() {


  return (
    <>
    <h1>wellcome</h1>
    <header>
           <header>
        <Show when="signed-out">
           <SignInButton mode="modal">
      <button className="w-36 p-4 bg-gray-900 text-white rounded">
        Sign In
      </button>
    </SignInButton>
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </header>
          </>
  )
}

export default App
