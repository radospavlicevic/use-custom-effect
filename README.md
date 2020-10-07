# use-custom-effect

> React custom hook helper for building custom runtime effects

[![NPM](https://img.shields.io/npm/v/use-custom-effect.svg)](https://www.npmjs.com/package/use-custom-effect) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-custom-effect
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'use-custom-effect'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [radospavlicevic](https://github.com/radospavlicevic)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
