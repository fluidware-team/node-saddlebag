/*
 * Copyright Fluidware srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Logger, LoggerOptions } from 'pino';
import { Config } from './config';
import { _globalThis } from './globalThis';
import { getAsyncLocalStorageProp, StoreSymbols } from './utils/asyncStore';
import * as pino from 'pino';

const GLOBAL_FW_LOGGER_KEY = Symbol.for('fw.logger');

type FWGlobal = {
  [GLOBAL_FW_LOGGER_KEY]: Logger;
};

const _global = _globalThis as unknown as FWGlobal;

const accessTokenRegex = /access_token=[a-zA-Z0-9_-]*/g;
const bearerTokenRegex = /\s+(\S+)$/;

function setupLogger() {
  const logParams: LoggerOptions = {
    name: Config.Logger.name,
    level: Config.Logger.level,
    redact: {
      paths: ['req.authorization', 'url', ...Config.Logger.redact],
      censor(value, path) {
        if (typeof value !== 'string') {
          return undefined;
        }
        if (path[0] === 'url') {
          return value.replace(accessTokenRegex, 'access_token=***');
        }
        if (path.length === 2 && path[0] === 'req' && path[1] === 'authorization') {
          return value.replace(bearerTokenRegex, ' ***');
        }
        return '***';
      }
    }
  };
  if (Config.Logger.isoTimestamp) {
    logParams.timestamp = pino.stdTimeFunctions.isoTime;
  }
  if (Config.Logger.useSeverityString) {
    logParams.formatters = {
      level(label) {
        return { severity: label };
      }
    };
  }
  _global[GLOBAL_FW_LOGGER_KEY] = pino(logParams);
  _global[GLOBAL_FW_LOGGER_KEY].debug('Logger initialized');
}

export function getLogger(): Logger {
  const logger = getAsyncLocalStorageProp<Logger>(StoreSymbols.LOGGER);
  if (logger) {
    return logger;
  }
  if (!_global[GLOBAL_FW_LOGGER_KEY]) {
    setupLogger();
  }
  return _global[GLOBAL_FW_LOGGER_KEY];
}
