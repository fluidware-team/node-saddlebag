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

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = '[Unable to stringify the thrown value]';
  try {
    stringified = JSON.stringify(value);
  } catch {
    // doesn't matter
  }

  return new Error(`This value was thrown as is, not through an Error: ${stringified}`);
}

export const EnvParse = {
  /* eslint-disable no-process-env */
  envStringRequired: function envStringRequired(key: string): string {
    const v = process.env[key];
    if (!v) {
      throw new Error(`Required env ${key} is missing`);
    }
    return v;
  },

  envStringOptional: function envString(key: string): string | undefined {
    return process.env[key];
  },

  envString: function envString(key: string, def: string): string {
    const v = process.env[key];
    if (v !== undefined) {
      return v;
    }
    return def;
  },

  envIntRequired: function envInt(key: string): number {
    const v = process.env[key];
    if (v === undefined) {
      throw new Error(`Required env ${key} is missing`);
    }
    if (isNaN(Number(v))) {
      throw new Error(`Required env ${key} is not a number`);
    }
    return parseInt(v, 10);
  },

  envInt: function envInt(key: string, def: number): number {
    const v = process.env[key];
    if (v !== undefined) {
      return parseInt(v, 10);
    }
    return def;
  },

  envJSON: function envJSON(key: string, def?: object) {
    const v = process.env[key];
    if (v !== undefined) {
      return JSON.parse(v);
    }
    return def;
  },

  envBool: function envBool(key: string, def: boolean): boolean {
    const v = process.env[key];
    if (v !== undefined) {
      let needle, needle1;
      if ((needle = v.toLowerCase()) && ['1', 'true', 'yes', 'on'].includes(needle)) {
        return true;
      } else if ((needle1 = v.toLowerCase()) && ['0', 'false', 'no', 'off'].includes(needle1)) {
        return false;
      } else {
        throw new Error(`Not a boolean: ${v}`);
      }
    }
    return def;
  },

  envStringList: function envStringList<K>(key: string, def: K[], separator = ','): string[] | K[] {
    const v = process.env[key];
    if (v !== undefined) {
      return v.split(separator).map(ca => ca.trim());
    }
    return def;
  }
  /* eslint-enable no-process-env */
};

export function getEnvironment() {
  // eslint-disable-next-line no-process-env
  return process.env;
}
