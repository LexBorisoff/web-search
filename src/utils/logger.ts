/* eslint-disable no-console */
import chalk from 'chalk';

export const level = {
  info: chalk.cyan,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
};

type LogFn = typeof console.log;
type Args = Parameters<LogFn>;
interface Level {
  level: typeof level;
}
type PrintFn = LogFn &
  Level & {
    [K in keyof typeof level]: (...args: Args) => void;
  };

const logger = console.log as PrintFn;

logger.level = level;
logger.info = (...args) => logger(level.info(...args));
logger.success = (...args) => logger(level.success(...args));
logger.warning = (...args) => logger(level.warning(...args));
logger.error = (...args) => logger(level.error(...args));

export { logger };
