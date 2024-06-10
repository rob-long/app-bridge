# @rob-long/app-bridge

**Version**: 0.0.4  
**Description**: App bridge for Angular and React

## Overview

The `@rob-long/app-bridge` library provides a seamless bridge for state management between Angular and React applications using RxJS. It allows easy integration and communication between different frameworks, ensuring consistent state handling across your application.

## Installation

```bash
npm install @rob-long/app-bridge
```

## Features

- **State Management**: Utilize RxJS `BehaviorSubject` for managing state.
- **Framework Integration**: Seamless integration with Angular and React.
- **TypeScript Support**: Fully typed with TypeScript for better developer experience.

## Usage

### Angular

```typescript
import { appBridgeService } from '@rob-long/app-bridge';

const appBridge = appBridgeService('myApp');
```

### React

```typescript
import useAppBridge from '@rob-long/app-bridge';

const [state, updateState] = useAppBridge('mySubject');
```

## Scripts

- **test**: `jest --config jest.config.json`
- **build**: `rollup -c`
- **lint**: `eslint . --ext .ts`
- **format**: `prettier --write .`
- **docs**: `typedoc`

## Contributing

Feel free to open issues or submit pull requests. Ensure that all new code has associated tests and follows the existing style.

## License

This project is licensed under the ISC License.

## Author

Created by [Rob Long](mailto:roblong@gmail.com).

## Links

- [Homepage](https://rob-long.github.io/app-bridge/modules.html)
- [Repository](https://github.com/rob-long/app-bridge)

For more detailed documentation, visit the [TypeDoc pages](https://rob-long.github.io/app-bridge/modules.html).
