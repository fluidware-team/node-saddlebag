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

import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Store>();

export interface Store {
  [key: symbol]: unknown;
}

export const StoreSymbols = {
  LOGGER: Symbol('fw.logger')
};

export function getAsyncLocalStorage(): AsyncLocalStorage<Store> {
  return asyncLocalStorage;
}

export function getAsyncLocalStorageProp<T>(key: symbol): T | undefined {
  const store = asyncLocalStorage.getStore();
  if (store && key in store) return store[key] as T;
  return undefined;
}

export function setAsyncLocalStorageProp<T>(key: symbol, value: T): void {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw new Error(`could not set ${String(key)}: store not initialized`);
  }
  store[key] = value;
  return undefined;
}

export function getAsyncLocalStorageStore(): Store | undefined {
  return asyncLocalStorage.getStore();
}
