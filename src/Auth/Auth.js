import React, { useState } from 'react'

import SignUp from './SignUp'
import Login from './Login'

export default function Auth() {
    const [authScreen, setAuthScreen] = useState(1)

    if (authScreen == 1) return <Login setAuthScreen={setAuthScreen} />
    else return <SignUp setAuthScreen={setAuthScreen} />

}