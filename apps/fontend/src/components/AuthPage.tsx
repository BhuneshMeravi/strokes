"use client"

export function AuthPage({isSignin}: {isSignin: boolean}){
    return <>
    <div className="h-screen w-screen flex justify-center items-center"> 
        <div className="p-2 m-2 bg-white rounded text-black">
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
        </div>
        <button onClick={()=> {

        }} >{isSignin? "SignIn": "SignUp"}</button>
    </div>
    </>
}