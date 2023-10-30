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

import { createHmac, createHash, BinaryToTextEncoding, randomUUID } from 'crypto';

export const getHmac = function getHmac(
  algorithm: string,
  string: string,
  secret: string,
  encoding: BinaryToTextEncoding = 'hex'
): string {
  return createHmac(algorithm, secret).update(string).digest(encoding);
};

export const getHash = function getHash(
  algorithm: string,
  string: string,
  encoding: BinaryToTextEncoding = 'hex'
): string {
  return createHash(algorithm).update(string).digest(encoding);
};

export const getSha256Hmac = function getSha256Hmac(string: string, secret: string) {
  return getHmac('sha256', string, secret);
};

export const getSha1 = function getSha1(string: string, encoding: BinaryToTextEncoding) {
  return getHash('sha1', string, encoding);
};

export const getSha256 = function getSha256(string: string, encoding?: BinaryToTextEncoding) {
  return getHash('sha256', string, encoding);
};

export const getMd5 = function getMd5(string: string) {
  return getHash('md5', string);
};

export const getRandomString = function getRandomString() {
  return getSha256(randomUUID());
};
