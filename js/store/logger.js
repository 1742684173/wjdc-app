// @flow
import { createLogger } from 'redux-logger';

const logger = createLogger({
  predicate: () => __DEV__,
  collapsed: true,
  duration: true,
});

export default logger;
