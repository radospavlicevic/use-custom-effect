import React from 'react'

import { useMyHook } from 'use-custom-effect'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
