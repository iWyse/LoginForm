(() => {
    "use strict";
    var __webpack_modules__ = {
        444: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                BH: () => Deferred,
                DV: () => safeGet,
                GJ: () => isAdmin,
                L: () => base64urlEncodeWithoutPadding,
                LL: () => ErrorFactory,
                Pz: () => stringify,
                UI: () => map,
                US: () => base64,
                Yr: () => isNodeSdk,
                ZR: () => FirebaseError,
                b$: () => isReactNative,
                cI: () => jsonEval,
                dS: () => stringToByteArray,
                eu: () => validateIndexedDBOpenable,
                g5: () => assertionError,
                gK: () => errorPrefix,
                gQ: () => Sha1,
                h$: () => base64Encode,
                hl: () => isIndexedDBAvailable,
                hu: () => assert,
                m9: () => getModularInstance,
                ne: () => createSubscribe,
                p$: () => deepCopy,
                pd: () => extractQuerystring,
                r3: () => contains,
                ru: () => isBrowserExtension,
                tV: () => base64Decode,
                uI: () => isMobileCordova,
                ug: () => stringLength,
                vZ: () => deepEqual,
                w1: () => isIE,
                w9: () => isValidFormat,
                xO: () => querystring,
                xb: () => isEmpty,
                z$: () => getUA,
                zd: () => querystringDecode
            });
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const CONSTANTS = {
                NODE_CLIENT: false,
                NODE_ADMIN: false,
                SDK_VERSION: "${JSCORE_VERSION}"
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const assert = function(assertion, message) {
                if (!assertion) throw assertionError(message);
            };
            const assertionError = function(message) {
                return new Error("Firebase Database (" + CONSTANTS.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + message);
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const stringToByteArray$1 = function(str) {
                const out = [];
                let p = 0;
                for (let i = 0; i < str.length; i++) {
                    let c = str.charCodeAt(i);
                    if (c < 128) out[p++] = c; else if (c < 2048) {
                        out[p++] = c >> 6 | 192;
                        out[p++] = 63 & c | 128;
                    } else if (55296 === (64512 & c) && i + 1 < str.length && 56320 === (64512 & str.charCodeAt(i + 1))) {
                        c = 65536 + ((1023 & c) << 10) + (1023 & str.charCodeAt(++i));
                        out[p++] = c >> 18 | 240;
                        out[p++] = c >> 12 & 63 | 128;
                        out[p++] = c >> 6 & 63 | 128;
                        out[p++] = 63 & c | 128;
                    } else {
                        out[p++] = c >> 12 | 224;
                        out[p++] = c >> 6 & 63 | 128;
                        out[p++] = 63 & c | 128;
                    }
                }
                return out;
            };
            const byteArrayToString = function(bytes) {
                const out = [];
                let pos = 0, c = 0;
                while (pos < bytes.length) {
                    const c1 = bytes[pos++];
                    if (c1 < 128) out[c++] = String.fromCharCode(c1); else if (c1 > 191 && c1 < 224) {
                        const c2 = bytes[pos++];
                        out[c++] = String.fromCharCode((31 & c1) << 6 | 63 & c2);
                    } else if (c1 > 239 && c1 < 365) {
                        const c2 = bytes[pos++];
                        const c3 = bytes[pos++];
                        const c4 = bytes[pos++];
                        const u = ((7 & c1) << 18 | (63 & c2) << 12 | (63 & c3) << 6 | 63 & c4) - 65536;
                        out[c++] = String.fromCharCode(55296 + (u >> 10));
                        out[c++] = String.fromCharCode(56320 + (1023 & u));
                    } else {
                        const c2 = bytes[pos++];
                        const c3 = bytes[pos++];
                        out[c++] = String.fromCharCode((15 & c1) << 12 | (63 & c2) << 6 | 63 & c3);
                    }
                }
                return out.join("");
            };
            const base64 = {
                byteToCharMap_: null,
                charToByteMap_: null,
                byteToCharMapWebSafe_: null,
                charToByteMapWebSafe_: null,
                ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz" + "0123456789",
                get ENCODED_VALS() {
                    return this.ENCODED_VALS_BASE + "+/=";
                },
                get ENCODED_VALS_WEBSAFE() {
                    return this.ENCODED_VALS_BASE + "-_.";
                },
                HAS_NATIVE_SUPPORT: "function" === typeof atob,
                encodeByteArray(input, webSafe) {
                    if (!Array.isArray(input)) throw Error("encodeByteArray takes an array as a parameter");
                    this.init_();
                    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
                    const output = [];
                    for (let i = 0; i < input.length; i += 3) {
                        const byte1 = input[i];
                        const haveByte2 = i + 1 < input.length;
                        const byte2 = haveByte2 ? input[i + 1] : 0;
                        const haveByte3 = i + 2 < input.length;
                        const byte3 = haveByte3 ? input[i + 2] : 0;
                        const outByte1 = byte1 >> 2;
                        const outByte2 = (3 & byte1) << 4 | byte2 >> 4;
                        let outByte3 = (15 & byte2) << 2 | byte3 >> 6;
                        let outByte4 = 63 & byte3;
                        if (!haveByte3) {
                            outByte4 = 64;
                            if (!haveByte2) outByte3 = 64;
                        }
                        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
                    }
                    return output.join("");
                },
                encodeString(input, webSafe) {
                    if (this.HAS_NATIVE_SUPPORT && !webSafe) return btoa(input);
                    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
                },
                decodeString(input, webSafe) {
                    if (this.HAS_NATIVE_SUPPORT && !webSafe) return atob(input);
                    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
                },
                decodeStringToByteArray(input, webSafe) {
                    this.init_();
                    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
                    const output = [];
                    for (let i = 0; i < input.length; ) {
                        const byte1 = charToByteMap[input.charAt(i++)];
                        const haveByte2 = i < input.length;
                        const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
                        ++i;
                        const haveByte3 = i < input.length;
                        const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
                        ++i;
                        const haveByte4 = i < input.length;
                        const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
                        ++i;
                        if (null == byte1 || null == byte2 || null == byte3 || null == byte4) throw Error();
                        const outByte1 = byte1 << 2 | byte2 >> 4;
                        output.push(outByte1);
                        if (64 !== byte3) {
                            const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
                            output.push(outByte2);
                            if (64 !== byte4) {
                                const outByte3 = byte3 << 6 & 192 | byte4;
                                output.push(outByte3);
                            }
                        }
                    }
                    return output;
                },
                init_() {
                    if (!this.byteToCharMap_) {
                        this.byteToCharMap_ = {};
                        this.charToByteMap_ = {};
                        this.byteToCharMapWebSafe_ = {};
                        this.charToByteMapWebSafe_ = {};
                        for (let i = 0; i < this.ENCODED_VALS.length; i++) {
                            this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                            this.charToByteMap_[this.byteToCharMap_[i]] = i;
                            this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                            this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                            if (i >= this.ENCODED_VALS_BASE.length) {
                                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                            }
                        }
                    }
                }
            };
            const base64Encode = function(str) {
                const utf8Bytes = stringToByteArray$1(str);
                return base64.encodeByteArray(utf8Bytes, true);
            };
            const base64urlEncodeWithoutPadding = function(str) {
                return base64Encode(str).replace(/\./g, "");
            };
            const base64Decode = function(str) {
                try {
                    return base64.decodeString(str, true);
                } catch (e) {
                    console.error("base64Decode failed: ", e);
                }
                return null;
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function deepCopy(value) {
                return deepExtend(void 0, value);
            }
            function deepExtend(target, source) {
                if (!(source instanceof Object)) return source;
                switch (source.constructor) {
                  case Date:
                    const dateValue = source;
                    return new Date(dateValue.getTime());

                  case Object:
                    if (void 0 === target) target = {};
                    break;

                  case Array:
                    target = [];
                    break;

                  default:
                    return source;
                }
                for (const prop in source) {
                    if (!source.hasOwnProperty(prop) || !isValidKey(prop)) continue;
                    target[prop] = deepExtend(target[prop], source[prop]);
                }
                return target;
            }
            function isValidKey(key) {
                return "__proto__" !== key;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Deferred {
                constructor() {
                    this.reject = () => {};
                    this.resolve = () => {};
                    this.promise = new Promise(((resolve, reject) => {
                        this.resolve = resolve;
                        this.reject = reject;
                    }));
                }
                wrapCallback(callback) {
                    return (error, value) => {
                        if (error) this.reject(error); else this.resolve(value);
                        if ("function" === typeof callback) {
                            this.promise.catch((() => {}));
                            if (1 === callback.length) callback(error); else callback(error, value);
                        }
                    };
                }
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function getUA() {
                if ("undefined" !== typeof navigator && "string" === typeof navigator["userAgent"]) return navigator["userAgent"]; else return "";
            }
            function isMobileCordova() {
                return "undefined" !== typeof window && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
            }
            function isBrowserExtension() {
                const runtime = "object" === typeof chrome ? chrome.runtime : "object" === typeof browser ? browser.runtime : void 0;
                return "object" === typeof runtime && void 0 !== runtime.id;
            }
            function isReactNative() {
                return "object" === typeof navigator && "ReactNative" === navigator["product"];
            }
            function isIE() {
                const ua = getUA();
                return ua.indexOf("MSIE ") >= 0 || ua.indexOf("Trident/") >= 0;
            }
            function isNodeSdk() {
                return true === CONSTANTS.NODE_CLIENT || true === CONSTANTS.NODE_ADMIN;
            }
            function isIndexedDBAvailable() {
                return "object" === typeof indexedDB;
            }
            function validateIndexedDBOpenable() {
                return new Promise(((resolve, reject) => {
                    try {
                        let preExist = true;
                        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
                        const request = self.indexedDB.open(DB_CHECK_NAME);
                        request.onsuccess = () => {
                            request.result.close();
                            if (!preExist) self.indexedDB.deleteDatabase(DB_CHECK_NAME);
                            resolve(true);
                        };
                        request.onupgradeneeded = () => {
                            preExist = false;
                        };
                        request.onerror = () => {
                            var _a;
                            reject((null === (_a = request.error) || void 0 === _a ? void 0 : _a.message) || "");
                        };
                    } catch (error) {
                        reject(error);
                    }
                }));
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const ERROR_NAME = "FirebaseError";
            class FirebaseError extends Error {
                constructor(code, message, customData) {
                    super(message);
                    this.code = code;
                    this.customData = customData;
                    this.name = ERROR_NAME;
                    Object.setPrototypeOf(this, FirebaseError.prototype);
                    if (Error.captureStackTrace) Error.captureStackTrace(this, ErrorFactory.prototype.create);
                }
            }
            class ErrorFactory {
                constructor(service, serviceName, errors) {
                    this.service = service;
                    this.serviceName = serviceName;
                    this.errors = errors;
                }
                create(code, ...data) {
                    const customData = data[0] || {};
                    const fullCode = `${this.service}/${code}`;
                    const template = this.errors[code];
                    const message = template ? replaceTemplate(template, customData) : "Error";
                    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
                    const error = new FirebaseError(fullCode, fullMessage, customData);
                    return error;
                }
            }
            function replaceTemplate(template, data) {
                return template.replace(PATTERN, ((_, key) => {
                    const value = data[key];
                    return null != value ? String(value) : `<${key}?>`;
                }));
            }
            const PATTERN = /\{\$([^}]+)}/g;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function jsonEval(str) {
                return JSON.parse(str);
            }
            function stringify(data) {
                return JSON.stringify(data);
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const decode = function(token) {
                let header = {}, claims = {}, data = {}, signature = "";
                try {
                    const parts = token.split(".");
                    header = jsonEval(base64Decode(parts[0]) || "");
                    claims = jsonEval(base64Decode(parts[1]) || "");
                    signature = parts[2];
                    data = claims["d"] || {};
                    delete claims["d"];
                } catch (e) {}
                return {
                    header,
                    claims,
                    data,
                    signature
                };
            };
            const isValidFormat = function(token) {
                const decoded = decode(token), claims = decoded.claims;
                return !!claims && "object" === typeof claims && claims.hasOwnProperty("iat");
            };
            const isAdmin = function(token) {
                const claims = decode(token).claims;
                return "object" === typeof claims && true === claims["admin"];
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function contains(obj, key) {
                return Object.prototype.hasOwnProperty.call(obj, key);
            }
            function safeGet(obj, key) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key]; else return;
            }
            function isEmpty(obj) {
                for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
                return true;
            }
            function map(obj, fn, contextObj) {
                const res = {};
                for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) res[key] = fn.call(contextObj, obj[key], key, obj);
                return res;
            }
            function deepEqual(a, b) {
                if (a === b) return true;
                const aKeys = Object.keys(a);
                const bKeys = Object.keys(b);
                for (const k of aKeys) {
                    if (!bKeys.includes(k)) return false;
                    const aProp = a[k];
                    const bProp = b[k];
                    if (isObject(aProp) && isObject(bProp)) {
                        if (!deepEqual(aProp, bProp)) return false;
                    } else if (aProp !== bProp) return false;
                }
                for (const k of bKeys) if (!aKeys.includes(k)) return false;
                return true;
            }
            function isObject(thing) {
                return null !== thing && "object" === typeof thing;
            }
            /**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function querystring(querystringParams) {
                const params = [];
                for (const [key, value] of Object.entries(querystringParams)) if (Array.isArray(value)) value.forEach((arrayVal => {
                    params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
                })); else params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
                return params.length ? "&" + params.join("&") : "";
            }
            function querystringDecode(querystring) {
                const obj = {};
                const tokens = querystring.replace(/^\?/, "").split("&");
                tokens.forEach((token => {
                    if (token) {
                        const [key, value] = token.split("=");
                        obj[decodeURIComponent(key)] = decodeURIComponent(value);
                    }
                }));
                return obj;
            }
            function extractQuerystring(url) {
                const queryStart = url.indexOf("?");
                if (!queryStart) return "";
                const fragmentStart = url.indexOf("#", queryStart);
                return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Sha1 {
                constructor() {
                    this.chain_ = [];
                    this.buf_ = [];
                    this.W_ = [];
                    this.pad_ = [];
                    this.inbuf_ = 0;
                    this.total_ = 0;
                    this.blockSize = 512 / 8;
                    this.pad_[0] = 128;
                    for (let i = 1; i < this.blockSize; ++i) this.pad_[i] = 0;
                    this.reset();
                }
                reset() {
                    this.chain_[0] = 1732584193;
                    this.chain_[1] = 4023233417;
                    this.chain_[2] = 2562383102;
                    this.chain_[3] = 271733878;
                    this.chain_[4] = 3285377520;
                    this.inbuf_ = 0;
                    this.total_ = 0;
                }
                compress_(buf, offset) {
                    if (!offset) offset = 0;
                    const W = this.W_;
                    if ("string" === typeof buf) for (let i = 0; i < 16; i++) {
                        W[i] = buf.charCodeAt(offset) << 24 | buf.charCodeAt(offset + 1) << 16 | buf.charCodeAt(offset + 2) << 8 | buf.charCodeAt(offset + 3);
                        offset += 4;
                    } else for (let i = 0; i < 16; i++) {
                        W[i] = buf[offset] << 24 | buf[offset + 1] << 16 | buf[offset + 2] << 8 | buf[offset + 3];
                        offset += 4;
                    }
                    for (let i = 16; i < 80; i++) {
                        const t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                        W[i] = 4294967295 & (t << 1 | t >>> 31);
                    }
                    let a = this.chain_[0];
                    let b = this.chain_[1];
                    let c = this.chain_[2];
                    let d = this.chain_[3];
                    let e = this.chain_[4];
                    let f, k;
                    for (let i = 0; i < 80; i++) {
                        if (i < 40) if (i < 20) {
                            f = d ^ b & (c ^ d);
                            k = 1518500249;
                        } else {
                            f = b ^ c ^ d;
                            k = 1859775393;
                        } else if (i < 60) {
                            f = b & c | d & (b | c);
                            k = 2400959708;
                        } else {
                            f = b ^ c ^ d;
                            k = 3395469782;
                        }
                        const t = (a << 5 | a >>> 27) + f + e + k + W[i] & 4294967295;
                        e = d;
                        d = c;
                        c = 4294967295 & (b << 30 | b >>> 2);
                        b = a;
                        a = t;
                    }
                    this.chain_[0] = this.chain_[0] + a & 4294967295;
                    this.chain_[1] = this.chain_[1] + b & 4294967295;
                    this.chain_[2] = this.chain_[2] + c & 4294967295;
                    this.chain_[3] = this.chain_[3] + d & 4294967295;
                    this.chain_[4] = this.chain_[4] + e & 4294967295;
                }
                update(bytes, length) {
                    if (null == bytes) return;
                    if (void 0 === length) length = bytes.length;
                    const lengthMinusBlock = length - this.blockSize;
                    let n = 0;
                    const buf = this.buf_;
                    let inbuf = this.inbuf_;
                    while (n < length) {
                        if (0 === inbuf) while (n <= lengthMinusBlock) {
                            this.compress_(bytes, n);
                            n += this.blockSize;
                        }
                        if ("string" === typeof bytes) while (n < length) {
                            buf[inbuf] = bytes.charCodeAt(n);
                            ++inbuf;
                            ++n;
                            if (inbuf === this.blockSize) {
                                this.compress_(buf);
                                inbuf = 0;
                                break;
                            }
                        } else while (n < length) {
                            buf[inbuf] = bytes[n];
                            ++inbuf;
                            ++n;
                            if (inbuf === this.blockSize) {
                                this.compress_(buf);
                                inbuf = 0;
                                break;
                            }
                        }
                    }
                    this.inbuf_ = inbuf;
                    this.total_ += length;
                }
                digest() {
                    const digest = [];
                    let totalBits = 8 * this.total_;
                    if (this.inbuf_ < 56) this.update(this.pad_, 56 - this.inbuf_); else this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
                    for (let i = this.blockSize - 1; i >= 56; i--) {
                        this.buf_[i] = 255 & totalBits;
                        totalBits /= 256;
                    }
                    this.compress_(this.buf_);
                    let n = 0;
                    for (let i = 0; i < 5; i++) for (let j = 24; j >= 0; j -= 8) {
                        digest[n] = this.chain_[i] >> j & 255;
                        ++n;
                    }
                    return digest;
                }
            }
            function createSubscribe(executor, onNoObservers) {
                const proxy = new ObserverProxy(executor, onNoObservers);
                return proxy.subscribe.bind(proxy);
            }
            class ObserverProxy {
                constructor(executor, onNoObservers) {
                    this.observers = [];
                    this.unsubscribes = [];
                    this.observerCount = 0;
                    this.task = Promise.resolve();
                    this.finalized = false;
                    this.onNoObservers = onNoObservers;
                    this.task.then((() => {
                        executor(this);
                    })).catch((e => {
                        this.error(e);
                    }));
                }
                next(value) {
                    this.forEachObserver((observer => {
                        observer.next(value);
                    }));
                }
                error(error) {
                    this.forEachObserver((observer => {
                        observer.error(error);
                    }));
                    this.close(error);
                }
                complete() {
                    this.forEachObserver((observer => {
                        observer.complete();
                    }));
                    this.close();
                }
                subscribe(nextOrObserver, error, complete) {
                    let observer;
                    if (void 0 === nextOrObserver && void 0 === error && void 0 === complete) throw new Error("Missing Observer.");
                    if (implementsAnyMethods(nextOrObserver, [ "next", "error", "complete" ])) observer = nextOrObserver; else observer = {
                        next: nextOrObserver,
                        error,
                        complete
                    };
                    if (void 0 === observer.next) observer.next = noop;
                    if (void 0 === observer.error) observer.error = noop;
                    if (void 0 === observer.complete) observer.complete = noop;
                    const unsub = this.unsubscribeOne.bind(this, this.observers.length);
                    if (this.finalized) this.task.then((() => {
                        try {
                            if (this.finalError) observer.error(this.finalError); else observer.complete();
                        } catch (e) {}
                        return;
                    }));
                    this.observers.push(observer);
                    return unsub;
                }
                unsubscribeOne(i) {
                    if (void 0 === this.observers || void 0 === this.observers[i]) return;
                    delete this.observers[i];
                    this.observerCount -= 1;
                    if (0 === this.observerCount && void 0 !== this.onNoObservers) this.onNoObservers(this);
                }
                forEachObserver(fn) {
                    if (this.finalized) return;
                    for (let i = 0; i < this.observers.length; i++) this.sendOne(i, fn);
                }
                sendOne(i, fn) {
                    this.task.then((() => {
                        if (void 0 !== this.observers && void 0 !== this.observers[i]) try {
                            fn(this.observers[i]);
                        } catch (e) {
                            if ("undefined" !== typeof console && console.error) console.error(e);
                        }
                    }));
                }
                close(err) {
                    if (this.finalized) return;
                    this.finalized = true;
                    if (void 0 !== err) this.finalError = err;
                    this.task.then((() => {
                        this.observers = void 0;
                        this.onNoObservers = void 0;
                    }));
                }
            }
            function implementsAnyMethods(obj, methods) {
                if ("object" !== typeof obj || null === obj) return false;
                for (const method of methods) if (method in obj && "function" === typeof obj[method]) return true;
                return false;
            }
            function noop() {}
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function errorPrefix(fnName, argName) {
                return `${fnName} failed: ${argName} argument `;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const stringToByteArray = function(str) {
                const out = [];
                let p = 0;
                for (let i = 0; i < str.length; i++) {
                    let c = str.charCodeAt(i);
                    if (c >= 55296 && c <= 56319) {
                        const high = c - 55296;
                        i++;
                        assert(i < str.length, "Surrogate pair missing trail surrogate.");
                        const low = str.charCodeAt(i) - 56320;
                        c = 65536 + (high << 10) + low;
                    }
                    if (c < 128) out[p++] = c; else if (c < 2048) {
                        out[p++] = c >> 6 | 192;
                        out[p++] = 63 & c | 128;
                    } else if (c < 65536) {
                        out[p++] = c >> 12 | 224;
                        out[p++] = c >> 6 & 63 | 128;
                        out[p++] = 63 & c | 128;
                    } else {
                        out[p++] = c >> 18 | 240;
                        out[p++] = c >> 12 & 63 | 128;
                        out[p++] = c >> 6 & 63 | 128;
                        out[p++] = 63 & c | 128;
                    }
                }
                return out;
            };
            const stringLength = function(str) {
                let p = 0;
                for (let i = 0; i < str.length; i++) {
                    const c = str.charCodeAt(i);
                    if (c < 128) p++; else if (c < 2048) p += 2; else if (c >= 55296 && c <= 56319) {
                        p += 4;
                        i++;
                    } else p += 3;
                }
                return p;
            };
            /**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function getModularInstance(service) {
                if (service && service._delegate) return service._delegate; else return service;
            }
        },
        503: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                ZF: () => _firebase_app__WEBPACK_IMPORTED_MODULE_0__.ZF
            });
            var _firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(389);
            var name = "firebase";
            var version = "9.9.3";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            (0, _firebase_app__WEBPACK_IMPORTED_MODULE_0__.KN)(name, version, "app");
        },
        724: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                Xb: () => createUserWithEmailAndPassword,
                v0: () => getAuth,
                Aj: () => onAuthStateChanged,
                e5: () => signInWithEmailAndPassword,
                w7: () => signOut
            });
            var index_esm2017 = __webpack_require__(444);
            var esm_index_esm2017 = __webpack_require__(389);
            function __rest(s, e) {
                var t = {};
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
                if (null != s && "function" === typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
                }
                return t;
            }
            Object.create;
            Object.create;
            var dist_esm_index_esm2017 = __webpack_require__(333);
            var component_dist_esm_index_esm2017 = __webpack_require__(463);
            function _prodErrorMap() {
                return {
                    ["dependent-sdk-initialized-before-auth"]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is " + "initialized. Please be sure to call `initializeAuth` or `getAuth` before " + "starting any other Firebase SDK."
                };
            }
            const prodErrorMap = _prodErrorMap;
            const _DEFAULT_AUTH_ERROR_FACTORY = new index_esm2017.LL("auth", "Firebase", _prodErrorMap());
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const logClient = new dist_esm_index_esm2017.Yd("@firebase/auth");
            function _logError(msg, ...args) {
                if (logClient.logLevel <= dist_esm_index_esm2017["in"].ERROR) logClient.error(`Auth (${esm_index_esm2017.Jn}): ${msg}`, ...args);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _fail(authOrCode, ...rest) {
                throw createErrorInternal(authOrCode, ...rest);
            }
            function _createError(authOrCode, ...rest) {
                return createErrorInternal(authOrCode, ...rest);
            }
            function _errorWithCustomMessage(auth, code, message) {
                const errorMap = Object.assign(Object.assign({}, prodErrorMap()), {
                    [code]: message
                });
                const factory = new index_esm2017.LL("auth", "Firebase", errorMap);
                return factory.create(code, {
                    appName: auth.name
                });
            }
            function createErrorInternal(authOrCode, ...rest) {
                if ("string" !== typeof authOrCode) {
                    const code = rest[0];
                    const fullParams = [ ...rest.slice(1) ];
                    if (fullParams[0]) fullParams[0].appName = authOrCode.name;
                    return authOrCode._errorFactory.create(code, ...fullParams);
                }
                return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
            }
            function _assert(assertion, authOrCode, ...rest) {
                if (!assertion) throw createErrorInternal(authOrCode, ...rest);
            }
            function debugFail(failure) {
                const message = `INTERNAL ASSERTION FAILED: ` + failure;
                _logError(message);
                throw new Error(message);
            }
            function debugAssert(assertion, message) {
                if (!assertion) debugFail(message);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const instanceCache = new Map;
            function _getInstance(cls) {
                debugAssert(cls instanceof Function, "Expected a class definition");
                let instance = instanceCache.get(cls);
                if (instance) {
                    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
                    return instance;
                }
                instance = new cls;
                instanceCache.set(cls, instance);
                return instance;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function initializeAuth(app, deps) {
                const provider = (0, esm_index_esm2017.qX)(app, "auth");
                if (provider.isInitialized()) {
                    const auth = provider.getImmediate();
                    const initialOptions = provider.getOptions();
                    if ((0, index_esm2017.vZ)(initialOptions, null !== deps && void 0 !== deps ? deps : {})) return auth; else _fail(auth, "already-initialized");
                }
                const auth = provider.initialize({
                    options: deps
                });
                return auth;
            }
            function _initializeAuthInstance(auth, deps) {
                const persistence = (null === deps || void 0 === deps ? void 0 : deps.persistence) || [];
                const hierarchy = (Array.isArray(persistence) ? persistence : [ persistence ]).map(_getInstance);
                if (null === deps || void 0 === deps ? void 0 : deps.errorMap) auth._updateErrorMap(deps.errorMap);
                auth._initializeWithPersistence(hierarchy, null === deps || void 0 === deps ? void 0 : deps.popupRedirectResolver);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _getCurrentUrl() {
                var _a;
                return "undefined" !== typeof self && (null === (_a = self.location) || void 0 === _a ? void 0 : _a.href) || "";
            }
            function _isHttpOrHttps() {
                return "http:" === _getCurrentScheme() || "https:" === _getCurrentScheme();
            }
            function _getCurrentScheme() {
                var _a;
                return "undefined" !== typeof self && (null === (_a = self.location) || void 0 === _a ? void 0 : _a.protocol) || null;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _isOnline() {
                if ("undefined" !== typeof navigator && navigator && "onLine" in navigator && "boolean" === typeof navigator.onLine && (_isHttpOrHttps() || (0, 
                index_esm2017.ru)() || "connection" in navigator)) return navigator.onLine;
                return true;
            }
            function _getUserLanguage() {
                if ("undefined" === typeof navigator) return null;
                const navigatorLanguage = navigator;
                return navigatorLanguage.languages && navigatorLanguage.languages[0] || navigatorLanguage.language || null;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Delay {
                constructor(shortDelay, longDelay) {
                    this.shortDelay = shortDelay;
                    this.longDelay = longDelay;
                    debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
                    this.isMobile = (0, index_esm2017.uI)() || (0, index_esm2017.b$)();
                }
                get() {
                    if (!_isOnline()) return Math.min(5e3, this.shortDelay);
                    return this.isMobile ? this.longDelay : this.shortDelay;
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _emulatorUrl(config, path) {
                debugAssert(config.emulator, "Emulator should always be set here");
                const {url} = config.emulator;
                if (!path) return url;
                return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class FetchProvider {
                static initialize(fetchImpl, headersImpl, responseImpl) {
                    this.fetchImpl = fetchImpl;
                    if (headersImpl) this.headersImpl = headersImpl;
                    if (responseImpl) this.responseImpl = responseImpl;
                }
                static fetch() {
                    if (this.fetchImpl) return this.fetchImpl;
                    if ("undefined" !== typeof self && "fetch" in self) return self.fetch;
                    debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
                }
                static headers() {
                    if (this.headersImpl) return this.headersImpl;
                    if ("undefined" !== typeof self && "Headers" in self) return self.Headers;
                    debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
                }
                static response() {
                    if (this.responseImpl) return this.responseImpl;
                    if ("undefined" !== typeof self && "Response" in self) return self.Response;
                    debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const SERVER_ERROR_MAP = {
                ["CREDENTIAL_MISMATCH"]: "custom-token-mismatch",
                ["MISSING_CUSTOM_TOKEN"]: "internal-error",
                ["INVALID_IDENTIFIER"]: "invalid-email",
                ["MISSING_CONTINUE_URI"]: "internal-error",
                ["INVALID_PASSWORD"]: "wrong-password",
                ["MISSING_PASSWORD"]: "internal-error",
                ["EMAIL_EXISTS"]: "email-already-in-use",
                ["PASSWORD_LOGIN_DISABLED"]: "operation-not-allowed",
                ["INVALID_IDP_RESPONSE"]: "invalid-credential",
                ["INVALID_PENDING_TOKEN"]: "invalid-credential",
                ["FEDERATED_USER_ID_ALREADY_LINKED"]: "credential-already-in-use",
                ["MISSING_REQ_TYPE"]: "internal-error",
                ["EMAIL_NOT_FOUND"]: "user-not-found",
                ["RESET_PASSWORD_EXCEED_LIMIT"]: "too-many-requests",
                ["EXPIRED_OOB_CODE"]: "expired-action-code",
                ["INVALID_OOB_CODE"]: "invalid-action-code",
                ["MISSING_OOB_CODE"]: "internal-error",
                ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN"]: "requires-recent-login",
                ["INVALID_ID_TOKEN"]: "invalid-user-token",
                ["TOKEN_EXPIRED"]: "user-token-expired",
                ["USER_NOT_FOUND"]: "user-token-expired",
                ["TOO_MANY_ATTEMPTS_TRY_LATER"]: "too-many-requests",
                ["INVALID_CODE"]: "invalid-verification-code",
                ["INVALID_SESSION_INFO"]: "invalid-verification-id",
                ["INVALID_TEMPORARY_PROOF"]: "invalid-credential",
                ["MISSING_SESSION_INFO"]: "missing-verification-id",
                ["SESSION_EXPIRED"]: "code-expired",
                ["MISSING_ANDROID_PACKAGE_NAME"]: "missing-android-pkg-name",
                ["UNAUTHORIZED_DOMAIN"]: "unauthorized-continue-uri",
                ["INVALID_OAUTH_CLIENT_ID"]: "invalid-oauth-client-id",
                ["ADMIN_ONLY_OPERATION"]: "admin-restricted-operation",
                ["INVALID_MFA_PENDING_CREDENTIAL"]: "invalid-multi-factor-session",
                ["MFA_ENROLLMENT_NOT_FOUND"]: "multi-factor-info-not-found",
                ["MISSING_MFA_ENROLLMENT_ID"]: "missing-multi-factor-info",
                ["MISSING_MFA_PENDING_CREDENTIAL"]: "missing-multi-factor-session",
                ["SECOND_FACTOR_EXISTS"]: "second-factor-already-in-use",
                ["SECOND_FACTOR_LIMIT_EXCEEDED"]: "maximum-second-factor-count-exceeded",
                ["BLOCKING_FUNCTION_ERROR_RESPONSE"]: "internal-error"
            };
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
            function _addTidIfNecessary(auth, request) {
                if (auth.tenantId && !request.tenantId) return Object.assign(Object.assign({}, request), {
                    tenantId: auth.tenantId
                });
                return request;
            }
            async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
                return _performFetchWithErrorHandling(auth, customErrorMap, (async () => {
                    let body = {};
                    let params = {};
                    if (request) if ("GET" === method) params = request; else body = {
                        body: JSON.stringify(request)
                    };
                    const query = (0, index_esm2017.xO)(Object.assign({
                        key: auth.config.apiKey
                    }, params)).slice(1);
                    const headers = await auth._getAdditionalHeaders();
                    headers["Content-Type"] = "application/json";
                    if (auth.languageCode) headers["X-Firebase-Locale"] = auth.languageCode;
                    return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), Object.assign({
                        method,
                        headers,
                        referrerPolicy: "no-referrer"
                    }, body));
                }));
            }
            async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
                auth._canInitEmulator = false;
                const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
                try {
                    const networkTimeout = new NetworkTimeout(auth);
                    const response = await Promise.race([ fetchFn(), networkTimeout.promise ]);
                    networkTimeout.clearNetworkTimeout();
                    const json = await response.json();
                    if ("needConfirmation" in json) throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
                    if (response.ok && !("errorMessage" in json)) return json; else {
                        const errorMessage = response.ok ? json.errorMessage : json.error.message;
                        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
                        if ("FEDERATED_USER_ID_ALREADY_LINKED" === serverErrorCode) throw _makeTaggedError(auth, "credential-already-in-use", json); else if ("EMAIL_EXISTS" === serverErrorCode) throw _makeTaggedError(auth, "email-already-in-use", json); else if ("USER_DISABLED" === serverErrorCode) throw _makeTaggedError(auth, "user-disabled", json);
                        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
                        if (serverErrorMessage) throw _errorWithCustomMessage(auth, authError, serverErrorMessage); else _fail(auth, authError);
                    }
                } catch (e) {
                    if (e instanceof index_esm2017.ZR) throw e;
                    _fail(auth, "network-request-failed");
                }
            }
            async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
                const serverResponse = await _performApiRequest(auth, method, path, request, customErrorMap);
                if ("mfaPendingCredential" in serverResponse) _fail(auth, "multi-factor-auth-required", {
                    _serverResponse: serverResponse
                });
                return serverResponse;
            }
            function _getFinalTarget(auth, host, path, query) {
                const base = `${host}${path}?${query}`;
                if (!auth.config.emulator) return `${auth.config.apiScheme}://${base}`;
                return _emulatorUrl(auth.config, base);
            }
            class NetworkTimeout {
                constructor(auth) {
                    this.auth = auth;
                    this.timer = null;
                    this.promise = new Promise(((_, reject) => {
                        this.timer = setTimeout((() => reject(_createError(this.auth, "network-request-failed"))), DEFAULT_API_TIMEOUT_MS.get());
                    }));
                }
                clearNetworkTimeout() {
                    clearTimeout(this.timer);
                }
            }
            function _makeTaggedError(auth, code, response) {
                const errorParams = {
                    appName: auth.name
                };
                if (response.email) errorParams.email = response.email;
                if (response.phoneNumber) errorParams.phoneNumber = response.phoneNumber;
                const error = _createError(auth, code, errorParams);
                error.customData._tokenResponse = response;
                return error;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function deleteAccount(auth, request) {
                return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
            }
            async function getAccountInfo(auth, request) {
                return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function utcTimestampToDateString(utcTimestamp) {
                if (!utcTimestamp) return;
                try {
                    const date = new Date(Number(utcTimestamp));
                    if (!isNaN(date.getTime())) return date.toUTCString();
                } catch (e) {}
                return;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function getIdTokenResult(user, forceRefresh = false) {
                const userInternal = (0, index_esm2017.m9)(user);
                const token = await userInternal.getIdToken(forceRefresh);
                const claims = _parseToken(token);
                _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error");
                const firebase = "object" === typeof claims.firebase ? claims.firebase : void 0;
                const signInProvider = null === firebase || void 0 === firebase ? void 0 : firebase["sign_in_provider"];
                return {
                    claims,
                    token,
                    authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
                    issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
                    expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
                    signInProvider: signInProvider || null,
                    signInSecondFactor: (null === firebase || void 0 === firebase ? void 0 : firebase["sign_in_second_factor"]) || null
                };
            }
            function secondsStringToMilliseconds(seconds) {
                return 1e3 * Number(seconds);
            }
            function _parseToken(token) {
                var _a;
                const [algorithm, payload, signature] = token.split(".");
                if (void 0 === algorithm || void 0 === payload || void 0 === signature) {
                    _logError("JWT malformed, contained fewer than 3 sections");
                    return null;
                }
                try {
                    const decoded = (0, index_esm2017.tV)(payload);
                    if (!decoded) {
                        _logError("Failed to decode base64 JWT payload");
                        return null;
                    }
                    return JSON.parse(decoded);
                } catch (e) {
                    _logError("Caught error parsing JWT payload as JSON", null === (_a = e) || void 0 === _a ? void 0 : _a.toString());
                    return null;
                }
            }
            function _tokenExpiresIn(token) {
                const parsedToken = _parseToken(token);
                _assert(parsedToken, "internal-error");
                _assert("undefined" !== typeof parsedToken.exp, "internal-error");
                _assert("undefined" !== typeof parsedToken.iat, "internal-error");
                return Number(parsedToken.exp) - Number(parsedToken.iat);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
                if (bypassAuthState) return promise;
                try {
                    return await promise;
                } catch (e) {
                    if (e instanceof index_esm2017.ZR && isUserInvalidated(e)) if (user.auth.currentUser === user) await user.auth.signOut();
                    throw e;
                }
            }
            function isUserInvalidated({code}) {
                return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ProactiveRefresh {
                constructor(user) {
                    this.user = user;
                    this.isRunning = false;
                    this.timerId = null;
                    this.errorBackoff = 3e4;
                }
                _start() {
                    if (this.isRunning) return;
                    this.isRunning = true;
                    this.schedule();
                }
                _stop() {
                    if (!this.isRunning) return;
                    this.isRunning = false;
                    if (null !== this.timerId) clearTimeout(this.timerId);
                }
                getInterval(wasError) {
                    var _a;
                    if (wasError) {
                        const interval = this.errorBackoff;
                        this.errorBackoff = Math.min(2 * this.errorBackoff, 96e4);
                        return interval;
                    } else {
                        this.errorBackoff = 3e4;
                        const expTime = null !== (_a = this.user.stsTokenManager.expirationTime) && void 0 !== _a ? _a : 0;
                        const interval = expTime - Date.now() - 3e5;
                        return Math.max(0, interval);
                    }
                }
                schedule(wasError = false) {
                    if (!this.isRunning) return;
                    const interval = this.getInterval(wasError);
                    this.timerId = setTimeout((async () => {
                        await this.iteration();
                    }), interval);
                }
                async iteration() {
                    var _a;
                    try {
                        await this.user.getIdToken(true);
                    } catch (e) {
                        if ((null === (_a = e) || void 0 === _a ? void 0 : _a.code) === `auth/${"network-request-failed"}`) this.schedule(true);
                        return;
                    }
                    this.schedule();
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class UserMetadata {
                constructor(createdAt, lastLoginAt) {
                    this.createdAt = createdAt;
                    this.lastLoginAt = lastLoginAt;
                    this._initializeTime();
                }
                _initializeTime() {
                    this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
                    this.creationTime = utcTimestampToDateString(this.createdAt);
                }
                _copy(metadata) {
                    this.createdAt = metadata.createdAt;
                    this.lastLoginAt = metadata.lastLoginAt;
                    this._initializeTime();
                }
                toJSON() {
                    return {
                        createdAt: this.createdAt,
                        lastLoginAt: this.lastLoginAt
                    };
                }
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _reloadWithoutSaving(user) {
                var _a;
                const auth = user.auth;
                const idToken = await user.getIdToken();
                const response = await _logoutIfInvalidated(user, getAccountInfo(auth, {
                    idToken
                }));
                _assert(null === response || void 0 === response ? void 0 : response.users.length, auth, "internal-error");
                const coreAccount = response.users[0];
                user._notifyReloadListener(coreAccount);
                const newProviderData = (null === (_a = coreAccount.providerUserInfo) || void 0 === _a ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
                const providerData = mergeProviderData(user.providerData, newProviderData);
                const oldIsAnonymous = user.isAnonymous;
                const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(null === providerData || void 0 === providerData ? void 0 : providerData.length);
                const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
                const updates = {
                    uid: coreAccount.localId,
                    displayName: coreAccount.displayName || null,
                    photoURL: coreAccount.photoUrl || null,
                    email: coreAccount.email || null,
                    emailVerified: coreAccount.emailVerified || false,
                    phoneNumber: coreAccount.phoneNumber || null,
                    tenantId: coreAccount.tenantId || null,
                    providerData,
                    metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
                    isAnonymous
                };
                Object.assign(user, updates);
            }
            async function reload(user) {
                const userInternal = (0, index_esm2017.m9)(user);
                await _reloadWithoutSaving(userInternal);
                await userInternal.auth._persistUserIfCurrent(userInternal);
                userInternal.auth._notifyListenersIfCurrent(userInternal);
            }
            function mergeProviderData(original, newData) {
                const deduped = original.filter((o => !newData.some((n => n.providerId === o.providerId))));
                return [ ...deduped, ...newData ];
            }
            function extractProviderData(providers) {
                return providers.map((_a => {
                    var {providerId} = _a, provider = __rest(_a, [ "providerId" ]);
                    return {
                        providerId,
                        uid: provider.rawId || "",
                        displayName: provider.displayName || null,
                        email: provider.email || null,
                        phoneNumber: provider.phoneNumber || null,
                        photoURL: provider.photoUrl || null
                    };
                }));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function requestStsToken(auth, refreshToken) {
                const response = await _performFetchWithErrorHandling(auth, {}, (async () => {
                    const body = (0, index_esm2017.xO)({
                        grant_type: "refresh_token",
                        refresh_token: refreshToken
                    }).slice(1);
                    const {tokenApiHost, apiKey} = auth.config;
                    const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
                    const headers = await auth._getAdditionalHeaders();
                    headers["Content-Type"] = "application/x-www-form-urlencoded";
                    return FetchProvider.fetch()(url, {
                        method: "POST",
                        headers,
                        body
                    });
                }));
                return {
                    accessToken: response.access_token,
                    expiresIn: response.expires_in,
                    refreshToken: response.refresh_token
                };
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class StsTokenManager {
                constructor() {
                    this.refreshToken = null;
                    this.accessToken = null;
                    this.expirationTime = null;
                }
                get isExpired() {
                    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
                }
                updateFromServerResponse(response) {
                    _assert(response.idToken, "internal-error");
                    _assert("undefined" !== typeof response.idToken, "internal-error");
                    _assert("undefined" !== typeof response.refreshToken, "internal-error");
                    const expiresIn = "expiresIn" in response && "undefined" !== typeof response.expiresIn ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
                    this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
                }
                async getToken(auth, forceRefresh = false) {
                    _assert(!this.accessToken || this.refreshToken, auth, "user-token-expired");
                    if (!forceRefresh && this.accessToken && !this.isExpired) return this.accessToken;
                    if (this.refreshToken) {
                        await this.refresh(auth, this.refreshToken);
                        return this.accessToken;
                    }
                    return null;
                }
                clearRefreshToken() {
                    this.refreshToken = null;
                }
                async refresh(auth, oldToken) {
                    const {accessToken, refreshToken, expiresIn} = await requestStsToken(auth, oldToken);
                    this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
                }
                updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
                    this.refreshToken = refreshToken || null;
                    this.accessToken = accessToken || null;
                    this.expirationTime = Date.now() + 1e3 * expiresInSec;
                }
                static fromJSON(appName, object) {
                    const {refreshToken, accessToken, expirationTime} = object;
                    const manager = new StsTokenManager;
                    if (refreshToken) {
                        _assert("string" === typeof refreshToken, "internal-error", {
                            appName
                        });
                        manager.refreshToken = refreshToken;
                    }
                    if (accessToken) {
                        _assert("string" === typeof accessToken, "internal-error", {
                            appName
                        });
                        manager.accessToken = accessToken;
                    }
                    if (expirationTime) {
                        _assert("number" === typeof expirationTime, "internal-error", {
                            appName
                        });
                        manager.expirationTime = expirationTime;
                    }
                    return manager;
                }
                toJSON() {
                    return {
                        refreshToken: this.refreshToken,
                        accessToken: this.accessToken,
                        expirationTime: this.expirationTime
                    };
                }
                _assign(stsTokenManager) {
                    this.accessToken = stsTokenManager.accessToken;
                    this.refreshToken = stsTokenManager.refreshToken;
                    this.expirationTime = stsTokenManager.expirationTime;
                }
                _clone() {
                    return Object.assign(new StsTokenManager, this.toJSON());
                }
                _performRefresh() {
                    return debugFail("not implemented");
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function assertStringOrUndefined(assertion, appName) {
                _assert("string" === typeof assertion || "undefined" === typeof assertion, "internal-error", {
                    appName
                });
            }
            class UserImpl {
                constructor(_a) {
                    var {uid, auth, stsTokenManager} = _a, opt = __rest(_a, [ "uid", "auth", "stsTokenManager" ]);
                    this.providerId = "firebase";
                    this.proactiveRefresh = new ProactiveRefresh(this);
                    this.reloadUserInfo = null;
                    this.reloadListener = null;
                    this.uid = uid;
                    this.auth = auth;
                    this.stsTokenManager = stsTokenManager;
                    this.accessToken = stsTokenManager.accessToken;
                    this.displayName = opt.displayName || null;
                    this.email = opt.email || null;
                    this.emailVerified = opt.emailVerified || false;
                    this.phoneNumber = opt.phoneNumber || null;
                    this.photoURL = opt.photoURL || null;
                    this.isAnonymous = opt.isAnonymous || false;
                    this.tenantId = opt.tenantId || null;
                    this.providerData = opt.providerData ? [ ...opt.providerData ] : [];
                    this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
                }
                async getIdToken(forceRefresh) {
                    const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
                    _assert(accessToken, this.auth, "internal-error");
                    if (this.accessToken !== accessToken) {
                        this.accessToken = accessToken;
                        await this.auth._persistUserIfCurrent(this);
                        this.auth._notifyListenersIfCurrent(this);
                    }
                    return accessToken;
                }
                getIdTokenResult(forceRefresh) {
                    return getIdTokenResult(this, forceRefresh);
                }
                reload() {
                    return reload(this);
                }
                _assign(user) {
                    if (this === user) return;
                    _assert(this.uid === user.uid, this.auth, "internal-error");
                    this.displayName = user.displayName;
                    this.photoURL = user.photoURL;
                    this.email = user.email;
                    this.emailVerified = user.emailVerified;
                    this.phoneNumber = user.phoneNumber;
                    this.isAnonymous = user.isAnonymous;
                    this.tenantId = user.tenantId;
                    this.providerData = user.providerData.map((userInfo => Object.assign({}, userInfo)));
                    this.metadata._copy(user.metadata);
                    this.stsTokenManager._assign(user.stsTokenManager);
                }
                _clone(auth) {
                    return new UserImpl(Object.assign(Object.assign({}, this), {
                        auth,
                        stsTokenManager: this.stsTokenManager._clone()
                    }));
                }
                _onReload(callback) {
                    _assert(!this.reloadListener, this.auth, "internal-error");
                    this.reloadListener = callback;
                    if (this.reloadUserInfo) {
                        this._notifyReloadListener(this.reloadUserInfo);
                        this.reloadUserInfo = null;
                    }
                }
                _notifyReloadListener(userInfo) {
                    if (this.reloadListener) this.reloadListener(userInfo); else this.reloadUserInfo = userInfo;
                }
                _startProactiveRefresh() {
                    this.proactiveRefresh._start();
                }
                _stopProactiveRefresh() {
                    this.proactiveRefresh._stop();
                }
                async _updateTokensIfNecessary(response, reload = false) {
                    let tokensRefreshed = false;
                    if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
                        this.stsTokenManager.updateFromServerResponse(response);
                        tokensRefreshed = true;
                    }
                    if (reload) await _reloadWithoutSaving(this);
                    await this.auth._persistUserIfCurrent(this);
                    if (tokensRefreshed) this.auth._notifyListenersIfCurrent(this);
                }
                async delete() {
                    const idToken = await this.getIdToken();
                    await _logoutIfInvalidated(this, deleteAccount(this.auth, {
                        idToken
                    }));
                    this.stsTokenManager.clearRefreshToken();
                    return this.auth.signOut();
                }
                toJSON() {
                    return Object.assign(Object.assign({
                        uid: this.uid,
                        email: this.email || void 0,
                        emailVerified: this.emailVerified,
                        displayName: this.displayName || void 0,
                        isAnonymous: this.isAnonymous,
                        photoURL: this.photoURL || void 0,
                        phoneNumber: this.phoneNumber || void 0,
                        tenantId: this.tenantId || void 0,
                        providerData: this.providerData.map((userInfo => Object.assign({}, userInfo))),
                        stsTokenManager: this.stsTokenManager.toJSON(),
                        _redirectEventId: this._redirectEventId
                    }, this.metadata.toJSON()), {
                        apiKey: this.auth.config.apiKey,
                        appName: this.auth.name
                    });
                }
                get refreshToken() {
                    return this.stsTokenManager.refreshToken || "";
                }
                static _fromJSON(auth, object) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    const displayName = null !== (_a = object.displayName) && void 0 !== _a ? _a : void 0;
                    const email = null !== (_b = object.email) && void 0 !== _b ? _b : void 0;
                    const phoneNumber = null !== (_c = object.phoneNumber) && void 0 !== _c ? _c : void 0;
                    const photoURL = null !== (_d = object.photoURL) && void 0 !== _d ? _d : void 0;
                    const tenantId = null !== (_e = object.tenantId) && void 0 !== _e ? _e : void 0;
                    const _redirectEventId = null !== (_f = object._redirectEventId) && void 0 !== _f ? _f : void 0;
                    const createdAt = null !== (_g = object.createdAt) && void 0 !== _g ? _g : void 0;
                    const lastLoginAt = null !== (_h = object.lastLoginAt) && void 0 !== _h ? _h : void 0;
                    const {uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager} = object;
                    _assert(uid && plainObjectTokenManager, auth, "internal-error");
                    const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
                    _assert("string" === typeof uid, auth, "internal-error");
                    assertStringOrUndefined(displayName, auth.name);
                    assertStringOrUndefined(email, auth.name);
                    _assert("boolean" === typeof emailVerified, auth, "internal-error");
                    _assert("boolean" === typeof isAnonymous, auth, "internal-error");
                    assertStringOrUndefined(phoneNumber, auth.name);
                    assertStringOrUndefined(photoURL, auth.name);
                    assertStringOrUndefined(tenantId, auth.name);
                    assertStringOrUndefined(_redirectEventId, auth.name);
                    assertStringOrUndefined(createdAt, auth.name);
                    assertStringOrUndefined(lastLoginAt, auth.name);
                    const user = new UserImpl({
                        uid,
                        auth,
                        email,
                        emailVerified,
                        displayName,
                        isAnonymous,
                        photoURL,
                        phoneNumber,
                        tenantId,
                        stsTokenManager,
                        createdAt,
                        lastLoginAt
                    });
                    if (providerData && Array.isArray(providerData)) user.providerData = providerData.map((userInfo => Object.assign({}, userInfo)));
                    if (_redirectEventId) user._redirectEventId = _redirectEventId;
                    return user;
                }
                static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
                    const stsTokenManager = new StsTokenManager;
                    stsTokenManager.updateFromServerResponse(idTokenResponse);
                    const user = new UserImpl({
                        uid: idTokenResponse.localId,
                        auth,
                        stsTokenManager,
                        isAnonymous
                    });
                    await _reloadWithoutSaving(user);
                    return user;
                }
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class InMemoryPersistence {
                constructor() {
                    this.type = "NONE";
                    this.storage = {};
                }
                async _isAvailable() {
                    return true;
                }
                async _set(key, value) {
                    this.storage[key] = value;
                }
                async _get(key) {
                    const value = this.storage[key];
                    return void 0 === value ? null : value;
                }
                async _remove(key) {
                    delete this.storage[key];
                }
                _addListener(_key, _listener) {
                    return;
                }
                _removeListener(_key, _listener) {
                    return;
                }
            }
            InMemoryPersistence.type = "NONE";
            const inMemoryPersistence = InMemoryPersistence;
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _persistenceKeyName(key, apiKey, appName) {
                return `${"firebase"}:${key}:${apiKey}:${appName}`;
            }
            class PersistenceUserManager {
                constructor(persistence, auth, userKey) {
                    this.persistence = persistence;
                    this.auth = auth;
                    this.userKey = userKey;
                    const {config, name} = this.auth;
                    this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name);
                    this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name);
                    this.boundEventHandler = auth._onStorageEvent.bind(auth);
                    this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
                }
                setCurrentUser(user) {
                    return this.persistence._set(this.fullUserKey, user.toJSON());
                }
                async getCurrentUser() {
                    const blob = await this.persistence._get(this.fullUserKey);
                    return blob ? UserImpl._fromJSON(this.auth, blob) : null;
                }
                removeCurrentUser() {
                    return this.persistence._remove(this.fullUserKey);
                }
                savePersistenceForRedirect() {
                    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
                }
                async setPersistence(newPersistence) {
                    if (this.persistence === newPersistence) return;
                    const currentUser = await this.getCurrentUser();
                    await this.removeCurrentUser();
                    this.persistence = newPersistence;
                    if (currentUser) return this.setCurrentUser(currentUser);
                }
                delete() {
                    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
                }
                static async create(auth, persistenceHierarchy, userKey = "authUser") {
                    if (!persistenceHierarchy.length) return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
                    const availablePersistences = (await Promise.all(persistenceHierarchy.map((async persistence => {
                        if (await persistence._isAvailable()) return persistence;
                        return;
                    })))).filter((persistence => persistence));
                    let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
                    const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
                    let userToMigrate = null;
                    for (const persistence of persistenceHierarchy) try {
                        const blob = await persistence._get(key);
                        if (blob) {
                            const user = UserImpl._fromJSON(auth, blob);
                            if (persistence !== selectedPersistence) userToMigrate = user;
                            selectedPersistence = persistence;
                            break;
                        }
                    } catch (_a) {}
                    const migrationHierarchy = availablePersistences.filter((p => p._shouldAllowMigration));
                    if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) return new PersistenceUserManager(selectedPersistence, auth, userKey);
                    selectedPersistence = migrationHierarchy[0];
                    if (userToMigrate) await selectedPersistence._set(key, userToMigrate.toJSON());
                    await Promise.all(persistenceHierarchy.map((async persistence => {
                        if (persistence !== selectedPersistence) try {
                            await persistence._remove(key);
                        } catch (_a) {}
                    })));
                    return new PersistenceUserManager(selectedPersistence, auth, userKey);
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _getBrowserName(userAgent) {
                const ua = userAgent.toLowerCase();
                if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) return "Opera"; else if (_isIEMobile(ua)) return "IEMobile"; else if (ua.includes("msie") || ua.includes("trident/")) return "IE"; else if (ua.includes("edge/")) return "Edge"; else if (_isFirefox(ua)) return "Firefox"; else if (ua.includes("silk/")) return "Silk"; else if (_isBlackBerry(ua)) return "Blackberry"; else if (_isWebOS(ua)) return "Webos"; else if (_isSafari(ua)) return "Safari"; else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) return "Chrome"; else if (_isAndroid(ua)) return "Android"; else {
                    const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
                    const matches = userAgent.match(re);
                    if (2 === (null === matches || void 0 === matches ? void 0 : matches.length)) return matches[1];
                }
                return "Other";
            }
            function _isFirefox(ua = (0, index_esm2017.z$)()) {
                return /firefox\//i.test(ua);
            }
            function _isSafari(userAgent = (0, index_esm2017.z$)()) {
                const ua = userAgent.toLowerCase();
                return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
            }
            function _isChromeIOS(ua = (0, index_esm2017.z$)()) {
                return /crios\//i.test(ua);
            }
            function _isIEMobile(ua = (0, index_esm2017.z$)()) {
                return /iemobile/i.test(ua);
            }
            function _isAndroid(ua = (0, index_esm2017.z$)()) {
                return /android/i.test(ua);
            }
            function _isBlackBerry(ua = (0, index_esm2017.z$)()) {
                return /blackberry/i.test(ua);
            }
            function _isWebOS(ua = (0, index_esm2017.z$)()) {
                return /webos/i.test(ua);
            }
            function _isIOS(ua = (0, index_esm2017.z$)()) {
                return /iphone|ipad|ipod/i.test(ua) || /macintosh/i.test(ua) && /mobile/i.test(ua);
            }
            function _isIOSStandalone(ua = (0, index_esm2017.z$)()) {
                var _a;
                return _isIOS(ua) && !!(null === (_a = window.navigator) || void 0 === _a ? void 0 : _a.standalone);
            }
            function _isIE10() {
                return (0, index_esm2017.w1)() && 10 === document.documentMode;
            }
            function _isMobileBrowser(ua = (0, index_esm2017.z$)()) {
                return _isIOS(ua) || _isAndroid(ua) || _isWebOS(ua) || _isBlackBerry(ua) || /windows phone/i.test(ua) || _isIEMobile(ua);
            }
            function _isIframe() {
                try {
                    return !!(window && window !== window.top);
                } catch (e) {
                    return false;
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _getClientVersion(clientPlatform, frameworks = []) {
                let reportedPlatform;
                switch (clientPlatform) {
                  case "Browser":
                    reportedPlatform = _getBrowserName((0, index_esm2017.z$)());
                    break;

                  case "Worker":
                    reportedPlatform = `${_getBrowserName((0, index_esm2017.z$)())}-${clientPlatform}`;
                    break;

                  default:
                    reportedPlatform = clientPlatform;
                }
                const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
                return `${reportedPlatform}/${"JsCore"}/${esm_index_esm2017.Jn}/${reportedFrameworks}`;
            }
            /**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AuthMiddlewareQueue {
                constructor(auth) {
                    this.auth = auth;
                    this.queue = [];
                }
                pushCallback(callback, onAbort) {
                    const wrappedCallback = user => new Promise(((resolve, reject) => {
                        try {
                            const result = callback(user);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    }));
                    wrappedCallback.onAbort = onAbort;
                    this.queue.push(wrappedCallback);
                    const index = this.queue.length - 1;
                    return () => {
                        this.queue[index] = () => Promise.resolve();
                    };
                }
                async runMiddleware(nextUser) {
                    var _a;
                    if (this.auth.currentUser === nextUser) return;
                    const onAbortStack = [];
                    try {
                        for (const beforeStateCallback of this.queue) {
                            await beforeStateCallback(nextUser);
                            if (beforeStateCallback.onAbort) onAbortStack.push(beforeStateCallback.onAbort);
                        }
                    } catch (e) {
                        onAbortStack.reverse();
                        for (const onAbort of onAbortStack) try {
                            onAbort();
                        } catch (_) {}
                        throw this.auth._errorFactory.create("login-blocked", {
                            originalMessage: null === (_a = e) || void 0 === _a ? void 0 : _a.message
                        });
                    }
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AuthImpl {
                constructor(app, heartbeatServiceProvider, config) {
                    this.app = app;
                    this.heartbeatServiceProvider = heartbeatServiceProvider;
                    this.config = config;
                    this.currentUser = null;
                    this.emulatorConfig = null;
                    this.operations = Promise.resolve();
                    this.authStateSubscription = new Subscription(this);
                    this.idTokenSubscription = new Subscription(this);
                    this.beforeStateQueue = new AuthMiddlewareQueue(this);
                    this.redirectUser = null;
                    this.isProactiveRefreshEnabled = false;
                    this._canInitEmulator = true;
                    this._isInitialized = false;
                    this._deleted = false;
                    this._initializationPromise = null;
                    this._popupRedirectResolver = null;
                    this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
                    this.lastNotifiedUid = void 0;
                    this.languageCode = null;
                    this.tenantId = null;
                    this.settings = {
                        appVerificationDisabledForTesting: false
                    };
                    this.frameworks = [];
                    this.name = app.name;
                    this.clientVersion = config.sdkClientVersion;
                }
                _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
                    if (popupRedirectResolver) this._popupRedirectResolver = _getInstance(popupRedirectResolver);
                    this._initializationPromise = this.queue((async () => {
                        var _a, _b;
                        if (this._deleted) return;
                        this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
                        if (this._deleted) return;
                        if (null === (_a = this._popupRedirectResolver) || void 0 === _a ? void 0 : _a._shouldInitProactively) try {
                            await this._popupRedirectResolver._initialize(this);
                        } catch (e) {}
                        await this.initializeCurrentUser(popupRedirectResolver);
                        this.lastNotifiedUid = (null === (_b = this.currentUser) || void 0 === _b ? void 0 : _b.uid) || null;
                        if (this._deleted) return;
                        this._isInitialized = true;
                    }));
                    return this._initializationPromise;
                }
                async _onStorageEvent() {
                    if (this._deleted) return;
                    const user = await this.assertedPersistence.getCurrentUser();
                    if (!this.currentUser && !user) return;
                    if (this.currentUser && user && this.currentUser.uid === user.uid) {
                        this._currentUser._assign(user);
                        await this.currentUser.getIdToken();
                        return;
                    }
                    await this._updateCurrentUser(user, true);
                }
                async initializeCurrentUser(popupRedirectResolver) {
                    var _a;
                    const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
                    let futureCurrentUser = previouslyStoredUser;
                    let needsTocheckMiddleware = false;
                    if (popupRedirectResolver && this.config.authDomain) {
                        await this.getOrInitRedirectPersistenceManager();
                        const redirectUserEventId = null === (_a = this.redirectUser) || void 0 === _a ? void 0 : _a._redirectEventId;
                        const storedUserEventId = null === futureCurrentUser || void 0 === futureCurrentUser ? void 0 : futureCurrentUser._redirectEventId;
                        const result = await this.tryRedirectSignIn(popupRedirectResolver);
                        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (null === result || void 0 === result ? void 0 : result.user)) {
                            futureCurrentUser = result.user;
                            needsTocheckMiddleware = true;
                        }
                    }
                    if (!futureCurrentUser) return this.directlySetCurrentUser(null);
                    if (!futureCurrentUser._redirectEventId) {
                        if (needsTocheckMiddleware) try {
                            await this.beforeStateQueue.runMiddleware(futureCurrentUser);
                        } catch (e) {
                            futureCurrentUser = previouslyStoredUser;
                            this._popupRedirectResolver._overrideRedirectResult(this, (() => Promise.reject(e)));
                        }
                        if (futureCurrentUser) return this.reloadAndSetCurrentUserOrClear(futureCurrentUser); else return this.directlySetCurrentUser(null);
                    }
                    _assert(this._popupRedirectResolver, this, "argument-error");
                    await this.getOrInitRedirectPersistenceManager();
                    if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) return this.directlySetCurrentUser(futureCurrentUser);
                    return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
                }
                async tryRedirectSignIn(redirectResolver) {
                    let result = null;
                    try {
                        result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
                    } catch (e) {
                        await this._setRedirectUser(null);
                    }
                    return result;
                }
                async reloadAndSetCurrentUserOrClear(user) {
                    var _a;
                    try {
                        await _reloadWithoutSaving(user);
                    } catch (e) {
                        if ((null === (_a = e) || void 0 === _a ? void 0 : _a.code) !== `auth/${"network-request-failed"}`) return this.directlySetCurrentUser(null);
                    }
                    return this.directlySetCurrentUser(user);
                }
                useDeviceLanguage() {
                    this.languageCode = _getUserLanguage();
                }
                async _delete() {
                    this._deleted = true;
                }
                async updateCurrentUser(userExtern) {
                    const user = userExtern ? (0, index_esm2017.m9)(userExtern) : null;
                    if (user) _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token");
                    return this._updateCurrentUser(user && user._clone(this));
                }
                async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
                    if (this._deleted) return;
                    if (user) _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch");
                    if (!skipBeforeStateCallbacks) await this.beforeStateQueue.runMiddleware(user);
                    return this.queue((async () => {
                        await this.directlySetCurrentUser(user);
                        this.notifyAuthListeners();
                    }));
                }
                async signOut() {
                    await this.beforeStateQueue.runMiddleware(null);
                    if (this.redirectPersistenceManager || this._popupRedirectResolver) await this._setRedirectUser(null);
                    return this._updateCurrentUser(null, true);
                }
                setPersistence(persistence) {
                    return this.queue((async () => {
                        await this.assertedPersistence.setPersistence(_getInstance(persistence));
                    }));
                }
                _getPersistence() {
                    return this.assertedPersistence.persistence.type;
                }
                _updateErrorMap(errorMap) {
                    this._errorFactory = new index_esm2017.LL("auth", "Firebase", errorMap());
                }
                onAuthStateChanged(nextOrObserver, error, completed) {
                    return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
                }
                beforeAuthStateChanged(callback, onAbort) {
                    return this.beforeStateQueue.pushCallback(callback, onAbort);
                }
                onIdTokenChanged(nextOrObserver, error, completed) {
                    return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
                }
                toJSON() {
                    var _a;
                    return {
                        apiKey: this.config.apiKey,
                        authDomain: this.config.authDomain,
                        appName: this.name,
                        currentUser: null === (_a = this._currentUser) || void 0 === _a ? void 0 : _a.toJSON()
                    };
                }
                async _setRedirectUser(user, popupRedirectResolver) {
                    const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
                    return null === user ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
                }
                async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
                    if (!this.redirectPersistenceManager) {
                        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
                        _assert(resolver, this, "argument-error");
                        this.redirectPersistenceManager = await PersistenceUserManager.create(this, [ _getInstance(resolver._redirectPersistence) ], "redirectUser");
                        this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
                    }
                    return this.redirectPersistenceManager;
                }
                async _redirectUserForId(id) {
                    var _a, _b;
                    if (this._isInitialized) await this.queue((async () => {}));
                    if ((null === (_a = this._currentUser) || void 0 === _a ? void 0 : _a._redirectEventId) === id) return this._currentUser;
                    if ((null === (_b = this.redirectUser) || void 0 === _b ? void 0 : _b._redirectEventId) === id) return this.redirectUser;
                    return null;
                }
                async _persistUserIfCurrent(user) {
                    if (user === this.currentUser) return this.queue((async () => this.directlySetCurrentUser(user)));
                }
                _notifyListenersIfCurrent(user) {
                    if (user === this.currentUser) this.notifyAuthListeners();
                }
                _key() {
                    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
                }
                _startProactiveRefresh() {
                    this.isProactiveRefreshEnabled = true;
                    if (this.currentUser) this._currentUser._startProactiveRefresh();
                }
                _stopProactiveRefresh() {
                    this.isProactiveRefreshEnabled = false;
                    if (this.currentUser) this._currentUser._stopProactiveRefresh();
                }
                get _currentUser() {
                    return this.currentUser;
                }
                notifyAuthListeners() {
                    var _a, _b;
                    if (!this._isInitialized) return;
                    this.idTokenSubscription.next(this.currentUser);
                    const currentUid = null !== (_b = null === (_a = this.currentUser) || void 0 === _a ? void 0 : _a.uid) && void 0 !== _b ? _b : null;
                    if (this.lastNotifiedUid !== currentUid) {
                        this.lastNotifiedUid = currentUid;
                        this.authStateSubscription.next(this.currentUser);
                    }
                }
                registerStateListener(subscription, nextOrObserver, error, completed) {
                    if (this._deleted) return () => {};
                    const cb = "function" === typeof nextOrObserver ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
                    const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
                    _assert(promise, this, "internal-error");
                    promise.then((() => cb(this.currentUser)));
                    if ("function" === typeof nextOrObserver) return subscription.addObserver(nextOrObserver, error, completed); else return subscription.addObserver(nextOrObserver);
                }
                async directlySetCurrentUser(user) {
                    if (this.currentUser && this.currentUser !== user) {
                        this._currentUser._stopProactiveRefresh();
                        if (user && this.isProactiveRefreshEnabled) user._startProactiveRefresh();
                    }
                    this.currentUser = user;
                    if (user) await this.assertedPersistence.setCurrentUser(user); else await this.assertedPersistence.removeCurrentUser();
                }
                queue(action) {
                    this.operations = this.operations.then(action, action);
                    return this.operations;
                }
                get assertedPersistence() {
                    _assert(this.persistenceManager, this, "internal-error");
                    return this.persistenceManager;
                }
                _logFramework(framework) {
                    if (!framework || this.frameworks.includes(framework)) return;
                    this.frameworks.push(framework);
                    this.frameworks.sort();
                    this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
                }
                _getFrameworks() {
                    return this.frameworks;
                }
                async _getAdditionalHeaders() {
                    var _a;
                    const headers = {
                        ["X-Client-Version"]: this.clientVersion
                    };
                    if (this.app.options.appId) headers["X-Firebase-gmpid"] = this.app.options.appId;
                    const heartbeatsHeader = await (null === (_a = this.heartbeatServiceProvider.getImmediate({
                        optional: true
                    })) || void 0 === _a ? void 0 : _a.getHeartbeatsHeader());
                    if (heartbeatsHeader) headers["X-Firebase-Client"] = heartbeatsHeader;
                    return headers;
                }
            }
            function _castAuth(auth) {
                return (0, index_esm2017.m9)(auth);
            }
            class Subscription {
                constructor(auth) {
                    this.auth = auth;
                    this.observer = null;
                    this.addObserver = (0, index_esm2017.ne)((observer => this.observer = observer));
                }
                get next() {
                    _assert(this.observer, this.auth, "internal-error");
                    return this.observer.next.bind(this.observer);
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class AuthCredential {
                constructor(providerId, signInMethod) {
                    this.providerId = providerId;
                    this.signInMethod = signInMethod;
                }
                toJSON() {
                    return debugFail("not implemented");
                }
                _getIdTokenResponse(_auth) {
                    return debugFail("not implemented");
                }
                _linkToIdToken(_auth, _idToken) {
                    return debugFail("not implemented");
                }
                _getReauthenticationResolver(_auth) {
                    return debugFail("not implemented");
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function updateEmailPassword(auth, request) {
                return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            async function signInWithPassword(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            async function signInWithEmailLink$1(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
            }
            async function signInWithEmailLinkForLinking(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class EmailAuthCredential extends AuthCredential {
                constructor(_email, _password, signInMethod, _tenantId = null) {
                    super("password", signInMethod);
                    this._email = _email;
                    this._password = _password;
                    this._tenantId = _tenantId;
                }
                static _fromEmailAndPassword(email, password) {
                    return new EmailAuthCredential(email, password, "password");
                }
                static _fromEmailAndCode(email, oobCode, tenantId = null) {
                    return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
                }
                toJSON() {
                    return {
                        email: this._email,
                        password: this._password,
                        signInMethod: this.signInMethod,
                        tenantId: this._tenantId
                    };
                }
                static fromJSON(json) {
                    const obj = "string" === typeof json ? JSON.parse(json) : json;
                    if ((null === obj || void 0 === obj ? void 0 : obj.email) && (null === obj || void 0 === obj ? void 0 : obj.password)) if ("password" === obj.signInMethod) return this._fromEmailAndPassword(obj.email, obj.password); else if ("emailLink" === obj.signInMethod) return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
                    return null;
                }
                async _getIdTokenResponse(auth) {
                    switch (this.signInMethod) {
                      case "password":
                        return signInWithPassword(auth, {
                            returnSecureToken: true,
                            email: this._email,
                            password: this._password
                        });

                      case "emailLink":
                        return signInWithEmailLink$1(auth, {
                            email: this._email,
                            oobCode: this._password
                        });

                      default:
                        _fail(auth, "internal-error");
                    }
                }
                async _linkToIdToken(auth, idToken) {
                    switch (this.signInMethod) {
                      case "password":
                        return updateEmailPassword(auth, {
                            idToken,
                            returnSecureToken: true,
                            email: this._email,
                            password: this._password
                        });

                      case "emailLink":
                        return signInWithEmailLinkForLinking(auth, {
                            idToken,
                            email: this._email,
                            oobCode: this._password
                        });

                      default:
                        _fail(auth, "internal-error");
                    }
                }
                _getReauthenticationResolver(auth) {
                    return this._getIdTokenResponse(auth);
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function signInWithIdp(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const IDP_REQUEST_URI$1 = "http://localhost";
            class OAuthCredential extends AuthCredential {
                constructor() {
                    super(...arguments);
                    this.pendingToken = null;
                }
                static _fromParams(params) {
                    const cred = new OAuthCredential(params.providerId, params.signInMethod);
                    if (params.idToken || params.accessToken) {
                        if (params.idToken) cred.idToken = params.idToken;
                        if (params.accessToken) cred.accessToken = params.accessToken;
                        if (params.nonce && !params.pendingToken) cred.nonce = params.nonce;
                        if (params.pendingToken) cred.pendingToken = params.pendingToken;
                    } else if (params.oauthToken && params.oauthTokenSecret) {
                        cred.accessToken = params.oauthToken;
                        cred.secret = params.oauthTokenSecret;
                    } else _fail("argument-error");
                    return cred;
                }
                toJSON() {
                    return {
                        idToken: this.idToken,
                        accessToken: this.accessToken,
                        secret: this.secret,
                        nonce: this.nonce,
                        pendingToken: this.pendingToken,
                        providerId: this.providerId,
                        signInMethod: this.signInMethod
                    };
                }
                static fromJSON(json) {
                    const obj = "string" === typeof json ? JSON.parse(json) : json;
                    const {providerId, signInMethod} = obj, rest = __rest(obj, [ "providerId", "signInMethod" ]);
                    if (!providerId || !signInMethod) return null;
                    const cred = new OAuthCredential(providerId, signInMethod);
                    cred.idToken = rest.idToken || void 0;
                    cred.accessToken = rest.accessToken || void 0;
                    cred.secret = rest.secret;
                    cred.nonce = rest.nonce;
                    cred.pendingToken = rest.pendingToken || null;
                    return cred;
                }
                _getIdTokenResponse(auth) {
                    const request = this.buildRequest();
                    return signInWithIdp(auth, request);
                }
                _linkToIdToken(auth, idToken) {
                    const request = this.buildRequest();
                    request.idToken = idToken;
                    return signInWithIdp(auth, request);
                }
                _getReauthenticationResolver(auth) {
                    const request = this.buildRequest();
                    request.autoCreate = false;
                    return signInWithIdp(auth, request);
                }
                buildRequest() {
                    const request = {
                        requestUri: IDP_REQUEST_URI$1,
                        returnSecureToken: true
                    };
                    if (this.pendingToken) request.pendingToken = this.pendingToken; else {
                        const postBody = {};
                        if (this.idToken) postBody["id_token"] = this.idToken;
                        if (this.accessToken) postBody["access_token"] = this.accessToken;
                        if (this.secret) postBody["oauth_token_secret"] = this.secret;
                        postBody["providerId"] = this.providerId;
                        if (this.nonce && !this.pendingToken) postBody["nonce"] = this.nonce;
                        request.postBody = (0, index_esm2017.xO)(postBody);
                    }
                    return request;
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function sendPhoneVerificationCode(auth, request) {
                return _performApiRequest(auth, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth, request));
            }
            async function signInWithPhoneNumber$1(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
            }
            async function linkWithPhoneNumber$1(auth, request) {
                const response = await _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
                if (response.temporaryProof) throw _makeTaggedError(auth, "account-exists-with-different-credential", response);
                return response;
            }
            const VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
                ["USER_NOT_FOUND"]: "user-not-found"
            };
            async function verifyPhoneNumberForExisting(auth, request) {
                const apiRequest = Object.assign(Object.assign({}, request), {
                    operation: "REAUTH"
                });
                return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class PhoneAuthCredential extends AuthCredential {
                constructor(params) {
                    super("phone", "phone");
                    this.params = params;
                }
                static _fromVerification(verificationId, verificationCode) {
                    return new PhoneAuthCredential({
                        verificationId,
                        verificationCode
                    });
                }
                static _fromTokenResponse(phoneNumber, temporaryProof) {
                    return new PhoneAuthCredential({
                        phoneNumber,
                        temporaryProof
                    });
                }
                _getIdTokenResponse(auth) {
                    return signInWithPhoneNumber$1(auth, this._makeVerificationRequest());
                }
                _linkToIdToken(auth, idToken) {
                    return linkWithPhoneNumber$1(auth, Object.assign({
                        idToken
                    }, this._makeVerificationRequest()));
                }
                _getReauthenticationResolver(auth) {
                    return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
                }
                _makeVerificationRequest() {
                    const {temporaryProof, phoneNumber, verificationId, verificationCode} = this.params;
                    if (temporaryProof && phoneNumber) return {
                        temporaryProof,
                        phoneNumber
                    };
                    return {
                        sessionInfo: verificationId,
                        code: verificationCode
                    };
                }
                toJSON() {
                    const obj = {
                        providerId: this.providerId
                    };
                    if (this.params.phoneNumber) obj.phoneNumber = this.params.phoneNumber;
                    if (this.params.temporaryProof) obj.temporaryProof = this.params.temporaryProof;
                    if (this.params.verificationCode) obj.verificationCode = this.params.verificationCode;
                    if (this.params.verificationId) obj.verificationId = this.params.verificationId;
                    return obj;
                }
                static fromJSON(json) {
                    if ("string" === typeof json) json = JSON.parse(json);
                    const {verificationId, verificationCode, phoneNumber, temporaryProof} = json;
                    if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) return null;
                    return new PhoneAuthCredential({
                        verificationId,
                        verificationCode,
                        phoneNumber,
                        temporaryProof
                    });
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function parseMode(mode) {
                switch (mode) {
                  case "recoverEmail":
                    return "RECOVER_EMAIL";

                  case "resetPassword":
                    return "PASSWORD_RESET";

                  case "signIn":
                    return "EMAIL_SIGNIN";

                  case "verifyEmail":
                    return "VERIFY_EMAIL";

                  case "verifyAndChangeEmail":
                    return "VERIFY_AND_CHANGE_EMAIL";

                  case "revertSecondFactorAddition":
                    return "REVERT_SECOND_FACTOR_ADDITION";

                  default:
                    return null;
                }
            }
            function parseDeepLink(url) {
                const link = (0, index_esm2017.zd)((0, index_esm2017.pd)(url))["link"];
                const doubleDeepLink = link ? (0, index_esm2017.zd)((0, index_esm2017.pd)(link))["deep_link_id"] : null;
                const iOSDeepLink = (0, index_esm2017.zd)((0, index_esm2017.pd)(url))["deep_link_id"];
                const iOSDoubleDeepLink = iOSDeepLink ? (0, index_esm2017.zd)((0, index_esm2017.pd)(iOSDeepLink))["link"] : null;
                return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
            }
            class ActionCodeURL {
                constructor(actionLink) {
                    var _a, _b, _c, _d, _e, _f;
                    const searchParams = (0, index_esm2017.zd)((0, index_esm2017.pd)(actionLink));
                    const apiKey = null !== (_a = searchParams["apiKey"]) && void 0 !== _a ? _a : null;
                    const code = null !== (_b = searchParams["oobCode"]) && void 0 !== _b ? _b : null;
                    const operation = parseMode(null !== (_c = searchParams["mode"]) && void 0 !== _c ? _c : null);
                    _assert(apiKey && code && operation, "argument-error");
                    this.apiKey = apiKey;
                    this.operation = operation;
                    this.code = code;
                    this.continueUrl = null !== (_d = searchParams["continueUrl"]) && void 0 !== _d ? _d : null;
                    this.languageCode = null !== (_e = searchParams["languageCode"]) && void 0 !== _e ? _e : null;
                    this.tenantId = null !== (_f = searchParams["tenantId"]) && void 0 !== _f ? _f : null;
                }
                static parseLink(link) {
                    const actionLink = parseDeepLink(link);
                    try {
                        return new ActionCodeURL(actionLink);
                    } catch (_a) {
                        return null;
                    }
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class EmailAuthProvider {
                constructor() {
                    this.providerId = EmailAuthProvider.PROVIDER_ID;
                }
                static credential(email, password) {
                    return EmailAuthCredential._fromEmailAndPassword(email, password);
                }
                static credentialWithLink(email, emailLink) {
                    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
                    _assert(actionCodeUrl, "argument-error");
                    return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
                }
            }
            EmailAuthProvider.PROVIDER_ID = "password";
            EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
            EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class FederatedAuthProvider {
                constructor(providerId) {
                    this.providerId = providerId;
                    this.defaultLanguageCode = null;
                    this.customParameters = {};
                }
                setDefaultLanguage(languageCode) {
                    this.defaultLanguageCode = languageCode;
                }
                setCustomParameters(customOAuthParameters) {
                    this.customParameters = customOAuthParameters;
                    return this;
                }
                getCustomParameters() {
                    return this.customParameters;
                }
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class BaseOAuthProvider extends FederatedAuthProvider {
                constructor() {
                    super(...arguments);
                    this.scopes = [];
                }
                addScope(scope) {
                    if (!this.scopes.includes(scope)) this.scopes.push(scope);
                    return this;
                }
                getScopes() {
                    return [ ...this.scopes ];
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class FacebookAuthProvider extends BaseOAuthProvider {
                constructor() {
                    super("facebook.com");
                }
                static credential(accessToken) {
                    return OAuthCredential._fromParams({
                        providerId: FacebookAuthProvider.PROVIDER_ID,
                        signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
                        accessToken
                    });
                }
                static credentialFromResult(userCredential) {
                    return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
                }
                static credentialFromError(error) {
                    return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
                }
                static credentialFromTaggedObject({_tokenResponse: tokenResponse}) {
                    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) return null;
                    if (!tokenResponse.oauthAccessToken) return null;
                    try {
                        return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
                    } catch (_a) {
                        return null;
                    }
                }
            }
            FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
            FacebookAuthProvider.PROVIDER_ID = "facebook.com";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class GoogleAuthProvider extends BaseOAuthProvider {
                constructor() {
                    super("google.com");
                    this.addScope("profile");
                }
                static credential(idToken, accessToken) {
                    return OAuthCredential._fromParams({
                        providerId: GoogleAuthProvider.PROVIDER_ID,
                        signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
                        idToken,
                        accessToken
                    });
                }
                static credentialFromResult(userCredential) {
                    return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
                }
                static credentialFromError(error) {
                    return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
                }
                static credentialFromTaggedObject({_tokenResponse: tokenResponse}) {
                    if (!tokenResponse) return null;
                    const {oauthIdToken, oauthAccessToken} = tokenResponse;
                    if (!oauthIdToken && !oauthAccessToken) return null;
                    try {
                        return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
                    } catch (_a) {
                        return null;
                    }
                }
            }
            GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
            GoogleAuthProvider.PROVIDER_ID = "google.com";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class GithubAuthProvider extends BaseOAuthProvider {
                constructor() {
                    super("github.com");
                }
                static credential(accessToken) {
                    return OAuthCredential._fromParams({
                        providerId: GithubAuthProvider.PROVIDER_ID,
                        signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
                        accessToken
                    });
                }
                static credentialFromResult(userCredential) {
                    return GithubAuthProvider.credentialFromTaggedObject(userCredential);
                }
                static credentialFromError(error) {
                    return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
                }
                static credentialFromTaggedObject({_tokenResponse: tokenResponse}) {
                    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) return null;
                    if (!tokenResponse.oauthAccessToken) return null;
                    try {
                        return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
                    } catch (_a) {
                        return null;
                    }
                }
            }
            GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
            GithubAuthProvider.PROVIDER_ID = "github.com";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class TwitterAuthProvider extends BaseOAuthProvider {
                constructor() {
                    super("twitter.com");
                }
                static credential(token, secret) {
                    return OAuthCredential._fromParams({
                        providerId: TwitterAuthProvider.PROVIDER_ID,
                        signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
                        oauthToken: token,
                        oauthTokenSecret: secret
                    });
                }
                static credentialFromResult(userCredential) {
                    return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
                }
                static credentialFromError(error) {
                    return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
                }
                static credentialFromTaggedObject({_tokenResponse: tokenResponse}) {
                    if (!tokenResponse) return null;
                    const {oauthAccessToken, oauthTokenSecret} = tokenResponse;
                    if (!oauthAccessToken || !oauthTokenSecret) return null;
                    try {
                        return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
                    } catch (_a) {
                        return null;
                    }
                }
            }
            TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
            TwitterAuthProvider.PROVIDER_ID = "twitter.com";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function signUp(auth, request) {
                return _performSignInRequest(auth, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth, request));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class UserCredentialImpl {
                constructor(params) {
                    this.user = params.user;
                    this.providerId = params.providerId;
                    this._tokenResponse = params._tokenResponse;
                    this.operationType = params.operationType;
                }
                static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
                    const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
                    const providerId = providerIdForResponse(idTokenResponse);
                    const userCred = new UserCredentialImpl({
                        user,
                        providerId,
                        _tokenResponse: idTokenResponse,
                        operationType
                    });
                    return userCred;
                }
                static async _forOperation(user, operationType, response) {
                    await user._updateTokensIfNecessary(response, true);
                    const providerId = providerIdForResponse(response);
                    return new UserCredentialImpl({
                        user,
                        providerId,
                        _tokenResponse: response,
                        operationType
                    });
                }
            }
            function providerIdForResponse(response) {
                if (response.providerId) return response.providerId;
                if ("phoneNumber" in response) return "phone";
                return null;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class MultiFactorError extends index_esm2017.ZR {
                constructor(auth, error, operationType, user) {
                    var _a;
                    super(error.code, error.message);
                    this.operationType = operationType;
                    this.user = user;
                    Object.setPrototypeOf(this, MultiFactorError.prototype);
                    this.customData = {
                        appName: auth.name,
                        tenantId: null !== (_a = auth.tenantId) && void 0 !== _a ? _a : void 0,
                        _serverResponse: error.customData._serverResponse,
                        operationType
                    };
                }
                static _fromErrorAndOperation(auth, error, operationType, user) {
                    return new MultiFactorError(auth, error, operationType, user);
                }
            }
            function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
                const idTokenProvider = "reauthenticate" === operationType ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
                return idTokenProvider.catch((error => {
                    if (error.code === `auth/${"multi-factor-auth-required"}`) throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
                    throw error;
                }));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _link$1(user, credential, bypassAuthState = false) {
                const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
                return UserCredentialImpl._forOperation(user, "link", response);
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            async function _reauthenticate(user, credential, bypassAuthState = false) {
                var _a;
                const {auth} = user;
                const operationType = "reauthenticate";
                try {
                    const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
                    _assert(response.idToken, auth, "internal-error");
                    const parsed = _parseToken(response.idToken);
                    _assert(parsed, auth, "internal-error");
                    const {sub: localId} = parsed;
                    _assert(user.uid === localId, auth, "user-mismatch");
                    return UserCredentialImpl._forOperation(user, operationType, response);
                } catch (e) {
                    if ((null === (_a = e) || void 0 === _a ? void 0 : _a.code) === `auth/${"user-not-found"}`) _fail(auth, "user-mismatch");
                    throw e;
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _signInWithCredential(auth, credential, bypassAuthState = false) {
                const operationType = "signIn";
                const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
                const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
                if (!bypassAuthState) await auth._updateCurrentUser(userCredential.user);
                return userCredential;
            }
            async function signInWithCredential(auth, credential) {
                return _signInWithCredential(_castAuth(auth), credential);
            }
            async function createUserWithEmailAndPassword(auth, email, password) {
                const authInternal = _castAuth(auth);
                const response = await signUp(authInternal, {
                    returnSecureToken: true,
                    email,
                    password
                });
                const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
                await authInternal._updateCurrentUser(userCredential.user);
                return userCredential;
            }
            function signInWithEmailAndPassword(auth, email, password) {
                return signInWithCredential((0, index_esm2017.m9)(auth), EmailAuthProvider.credential(email, password));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function onAuthStateChanged(auth, nextOrObserver, error, completed) {
                return (0, index_esm2017.m9)(auth).onAuthStateChanged(nextOrObserver, error, completed);
            }
            function signOut(auth) {
                return (0, index_esm2017.m9)(auth).signOut();
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function startEnrollPhoneMfa(auth, request) {
                return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
            }
            function finalizeEnrollPhoneMfa(auth, request) {
                return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
            }
            new WeakMap;
            const STORAGE_AVAILABLE_KEY = "__sak";
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class BrowserPersistenceClass {
                constructor(storageRetriever, type) {
                    this.storageRetriever = storageRetriever;
                    this.type = type;
                }
                _isAvailable() {
                    try {
                        if (!this.storage) return Promise.resolve(false);
                        this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
                        this.storage.removeItem(STORAGE_AVAILABLE_KEY);
                        return Promise.resolve(true);
                    } catch (_a) {
                        return Promise.resolve(false);
                    }
                }
                _set(key, value) {
                    this.storage.setItem(key, JSON.stringify(value));
                    return Promise.resolve();
                }
                _get(key) {
                    const json = this.storage.getItem(key);
                    return Promise.resolve(json ? JSON.parse(json) : null);
                }
                _remove(key) {
                    this.storage.removeItem(key);
                    return Promise.resolve();
                }
                get storage() {
                    return this.storageRetriever();
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _iframeCannotSyncWebStorage() {
                const ua = (0, index_esm2017.z$)();
                return _isSafari(ua) || _isIOS(ua);
            }
            const _POLLING_INTERVAL_MS$1 = 1e3;
            const IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
            class BrowserLocalPersistence extends BrowserPersistenceClass {
                constructor() {
                    super((() => window.localStorage), "LOCAL");
                    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
                    this.listeners = {};
                    this.localCache = {};
                    this.pollTimer = null;
                    this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
                    this.fallbackToPolling = _isMobileBrowser();
                    this._shouldAllowMigration = true;
                }
                forAllChangedKeys(cb) {
                    for (const key of Object.keys(this.listeners)) {
                        const newValue = this.storage.getItem(key);
                        const oldValue = this.localCache[key];
                        if (newValue !== oldValue) cb(key, oldValue, newValue);
                    }
                }
                onStorageEvent(event, poll = false) {
                    if (!event.key) {
                        this.forAllChangedKeys(((key, _oldValue, newValue) => {
                            this.notifyListeners(key, newValue);
                        }));
                        return;
                    }
                    const key = event.key;
                    if (poll) this.detachListener(); else this.stopPolling();
                    if (this.safariLocalStorageNotSynced) {
                        const storedValue = this.storage.getItem(key);
                        if (event.newValue !== storedValue) if (null !== event.newValue) this.storage.setItem(key, event.newValue); else this.storage.removeItem(key); else if (this.localCache[key] === event.newValue && !poll) return;
                    }
                    const triggerListeners = () => {
                        const storedValue = this.storage.getItem(key);
                        if (!poll && this.localCache[key] === storedValue) return;
                        this.notifyListeners(key, storedValue);
                    };
                    const storedValue = this.storage.getItem(key);
                    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY); else triggerListeners();
                }
                notifyListeners(key, value) {
                    this.localCache[key] = value;
                    const listeners = this.listeners[key];
                    if (listeners) for (const listener of Array.from(listeners)) listener(value ? JSON.parse(value) : value);
                }
                startPolling() {
                    this.stopPolling();
                    this.pollTimer = setInterval((() => {
                        this.forAllChangedKeys(((key, oldValue, newValue) => {
                            this.onStorageEvent(new StorageEvent("storage", {
                                key,
                                oldValue,
                                newValue
                            }), true);
                        }));
                    }), _POLLING_INTERVAL_MS$1);
                }
                stopPolling() {
                    if (this.pollTimer) {
                        clearInterval(this.pollTimer);
                        this.pollTimer = null;
                    }
                }
                attachListener() {
                    window.addEventListener("storage", this.boundEventHandler);
                }
                detachListener() {
                    window.removeEventListener("storage", this.boundEventHandler);
                }
                _addListener(key, listener) {
                    if (0 === Object.keys(this.listeners).length) if (this.fallbackToPolling) this.startPolling(); else this.attachListener();
                    if (!this.listeners[key]) {
                        this.listeners[key] = new Set;
                        this.localCache[key] = this.storage.getItem(key);
                    }
                    this.listeners[key].add(listener);
                }
                _removeListener(key, listener) {
                    if (this.listeners[key]) {
                        this.listeners[key].delete(listener);
                        if (0 === this.listeners[key].size) delete this.listeners[key];
                    }
                    if (0 === Object.keys(this.listeners).length) {
                        this.detachListener();
                        this.stopPolling();
                    }
                }
                async _set(key, value) {
                    await super._set(key, value);
                    this.localCache[key] = JSON.stringify(value);
                }
                async _get(key) {
                    const value = await super._get(key);
                    this.localCache[key] = JSON.stringify(value);
                    return value;
                }
                async _remove(key) {
                    await super._remove(key);
                    delete this.localCache[key];
                }
            }
            BrowserLocalPersistence.type = "LOCAL";
            const browserLocalPersistence = BrowserLocalPersistence;
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class BrowserSessionPersistence extends BrowserPersistenceClass {
                constructor() {
                    super((() => window.sessionStorage), "SESSION");
                }
                _addListener(_key, _listener) {
                    return;
                }
                _removeListener(_key, _listener) {
                    return;
                }
            }
            BrowserSessionPersistence.type = "SESSION";
            const browserSessionPersistence = BrowserSessionPersistence;
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _allSettled(promises) {
                return Promise.all(promises.map((async promise => {
                    try {
                        const value = await promise;
                        return {
                            fulfilled: true,
                            value
                        };
                    } catch (reason) {
                        return {
                            fulfilled: false,
                            reason
                        };
                    }
                })));
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Receiver {
                constructor(eventTarget) {
                    this.eventTarget = eventTarget;
                    this.handlersMap = {};
                    this.boundEventHandler = this.handleEvent.bind(this);
                }
                static _getInstance(eventTarget) {
                    const existingInstance = this.receivers.find((receiver => receiver.isListeningto(eventTarget)));
                    if (existingInstance) return existingInstance;
                    const newInstance = new Receiver(eventTarget);
                    this.receivers.push(newInstance);
                    return newInstance;
                }
                isListeningto(eventTarget) {
                    return this.eventTarget === eventTarget;
                }
                async handleEvent(event) {
                    const messageEvent = event;
                    const {eventId, eventType, data} = messageEvent.data;
                    const handlers = this.handlersMap[eventType];
                    if (!(null === handlers || void 0 === handlers ? void 0 : handlers.size)) return;
                    messageEvent.ports[0].postMessage({
                        status: "ack",
                        eventId,
                        eventType
                    });
                    const promises = Array.from(handlers).map((async handler => handler(messageEvent.origin, data)));
                    const response = await _allSettled(promises);
                    messageEvent.ports[0].postMessage({
                        status: "done",
                        eventId,
                        eventType,
                        response
                    });
                }
                _subscribe(eventType, eventHandler) {
                    if (0 === Object.keys(this.handlersMap).length) this.eventTarget.addEventListener("message", this.boundEventHandler);
                    if (!this.handlersMap[eventType]) this.handlersMap[eventType] = new Set;
                    this.handlersMap[eventType].add(eventHandler);
                }
                _unsubscribe(eventType, eventHandler) {
                    if (this.handlersMap[eventType] && eventHandler) this.handlersMap[eventType].delete(eventHandler);
                    if (!eventHandler || 0 === this.handlersMap[eventType].size) delete this.handlersMap[eventType];
                    if (0 === Object.keys(this.handlersMap).length) this.eventTarget.removeEventListener("message", this.boundEventHandler);
                }
            }
            Receiver.receivers = [];
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _generateEventId(prefix = "", digits = 10) {
                let random = "";
                for (let i = 0; i < digits; i++) random += Math.floor(10 * Math.random());
                return prefix + random;
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Sender {
                constructor(target) {
                    this.target = target;
                    this.handlers = new Set;
                }
                removeMessageHandler(handler) {
                    if (handler.messageChannel) {
                        handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
                        handler.messageChannel.port1.close();
                    }
                    this.handlers.delete(handler);
                }
                async _send(eventType, data, timeout = 50) {
                    const messageChannel = "undefined" !== typeof MessageChannel ? new MessageChannel : null;
                    if (!messageChannel) throw new Error("connection_unavailable");
                    let completionTimer;
                    let handler;
                    return new Promise(((resolve, reject) => {
                        const eventId = _generateEventId("", 20);
                        messageChannel.port1.start();
                        const ackTimer = setTimeout((() => {
                            reject(new Error("unsupported_event"));
                        }), timeout);
                        handler = {
                            messageChannel,
                            onMessage(event) {
                                const messageEvent = event;
                                if (messageEvent.data.eventId !== eventId) return;
                                switch (messageEvent.data.status) {
                                  case "ack":
                                    clearTimeout(ackTimer);
                                    completionTimer = setTimeout((() => {
                                        reject(new Error("timeout"));
                                    }), 3e3);
                                    break;

                                  case "done":
                                    clearTimeout(completionTimer);
                                    resolve(messageEvent.data.response);
                                    break;

                                  default:
                                    clearTimeout(ackTimer);
                                    clearTimeout(completionTimer);
                                    reject(new Error("invalid_response"));
                                    break;
                                }
                            }
                        };
                        this.handlers.add(handler);
                        messageChannel.port1.addEventListener("message", handler.onMessage);
                        this.target.postMessage({
                            eventType,
                            eventId,
                            data
                        }, [ messageChannel.port2 ]);
                    })).finally((() => {
                        if (handler) this.removeMessageHandler(handler);
                    }));
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _window() {
                return window;
            }
            function _setWindowLocation(url) {
                _window().location.href = url;
            }
            /**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _isWorker() {
                return "undefined" !== typeof _window()["WorkerGlobalScope"] && "function" === typeof _window()["importScripts"];
            }
            async function _getActiveServiceWorker() {
                if (!(null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker)) return null;
                try {
                    const registration = await navigator.serviceWorker.ready;
                    return registration.active;
                } catch (_a) {
                    return null;
                }
            }
            function _getServiceWorkerController() {
                var _a;
                return (null === (_a = null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker) || void 0 === _a ? void 0 : _a.controller) || null;
            }
            function _getWorkerGlobalScope() {
                return _isWorker() ? self : null;
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const DB_NAME = "firebaseLocalStorageDb";
            const DB_VERSION = 1;
            const DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
            const DB_DATA_KEYPATH = "fbase_key";
            class DBPromise {
                constructor(request) {
                    this.request = request;
                }
                toPromise() {
                    return new Promise(((resolve, reject) => {
                        this.request.addEventListener("success", (() => {
                            resolve(this.request.result);
                        }));
                        this.request.addEventListener("error", (() => {
                            reject(this.request.error);
                        }));
                    }));
                }
            }
            function getObjectStore(db, isReadWrite) {
                return db.transaction([ DB_OBJECTSTORE_NAME ], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
            }
            function _deleteDatabase() {
                const request = indexedDB.deleteDatabase(DB_NAME);
                return new DBPromise(request).toPromise();
            }
            function _openDatabase() {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                return new Promise(((resolve, reject) => {
                    request.addEventListener("error", (() => {
                        reject(request.error);
                    }));
                    request.addEventListener("upgradeneeded", (() => {
                        const db = request.result;
                        try {
                            db.createObjectStore(DB_OBJECTSTORE_NAME, {
                                keyPath: DB_DATA_KEYPATH
                            });
                        } catch (e) {
                            reject(e);
                        }
                    }));
                    request.addEventListener("success", (async () => {
                        const db = request.result;
                        if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
                            db.close();
                            await _deleteDatabase();
                            resolve(await _openDatabase());
                        } else resolve(db);
                    }));
                }));
            }
            async function _putObject(db, key, value) {
                const request = getObjectStore(db, true).put({
                    [DB_DATA_KEYPATH]: key,
                    value
                });
                return new DBPromise(request).toPromise();
            }
            async function getObject(db, key) {
                const request = getObjectStore(db, false).get(key);
                const data = await new DBPromise(request).toPromise();
                return void 0 === data ? null : data.value;
            }
            function _deleteObject(db, key) {
                const request = getObjectStore(db, true).delete(key);
                return new DBPromise(request).toPromise();
            }
            const _POLLING_INTERVAL_MS = 800;
            const _TRANSACTION_RETRY_COUNT = 3;
            class IndexedDBLocalPersistence {
                constructor() {
                    this.type = "LOCAL";
                    this._shouldAllowMigration = true;
                    this.listeners = {};
                    this.localCache = {};
                    this.pollTimer = null;
                    this.pendingWrites = 0;
                    this.receiver = null;
                    this.sender = null;
                    this.serviceWorkerReceiverAvailable = false;
                    this.activeServiceWorker = null;
                    this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then((() => {}), (() => {}));
                }
                async _openDb() {
                    if (this.db) return this.db;
                    this.db = await _openDatabase();
                    return this.db;
                }
                async _withRetries(op) {
                    let numAttempts = 0;
                    while (true) try {
                        const db = await this._openDb();
                        return await op(db);
                    } catch (e) {
                        if (numAttempts++ > _TRANSACTION_RETRY_COUNT) throw e;
                        if (this.db) {
                            this.db.close();
                            this.db = void 0;
                        }
                    }
                }
                async initializeServiceWorkerMessaging() {
                    return _isWorker() ? this.initializeReceiver() : this.initializeSender();
                }
                async initializeReceiver() {
                    this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
                    this.receiver._subscribe("keyChanged", (async (_origin, data) => {
                        const keys = await this._poll();
                        return {
                            keyProcessed: keys.includes(data.key)
                        };
                    }));
                    this.receiver._subscribe("ping", (async (_origin, _data) => [ "keyChanged" ]));
                }
                async initializeSender() {
                    var _a, _b;
                    this.activeServiceWorker = await _getActiveServiceWorker();
                    if (!this.activeServiceWorker) return;
                    this.sender = new Sender(this.activeServiceWorker);
                    const results = await this.sender._send("ping", {}, 800);
                    if (!results) return;
                    if ((null === (_a = results[0]) || void 0 === _a ? void 0 : _a.fulfilled) && (null === (_b = results[0]) || void 0 === _b ? void 0 : _b.value.includes("keyChanged"))) this.serviceWorkerReceiverAvailable = true;
                }
                async notifyServiceWorker(key) {
                    if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) return;
                    try {
                        await this.sender._send("keyChanged", {
                            key
                        }, this.serviceWorkerReceiverAvailable ? 800 : 50);
                    } catch (_a) {}
                }
                async _isAvailable() {
                    try {
                        if (!indexedDB) return false;
                        const db = await _openDatabase();
                        await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
                        await _deleteObject(db, STORAGE_AVAILABLE_KEY);
                        return true;
                    } catch (_a) {}
                    return false;
                }
                async _withPendingWrite(write) {
                    this.pendingWrites++;
                    try {
                        await write();
                    } finally {
                        this.pendingWrites--;
                    }
                }
                async _set(key, value) {
                    return this._withPendingWrite((async () => {
                        await this._withRetries((db => _putObject(db, key, value)));
                        this.localCache[key] = value;
                        return this.notifyServiceWorker(key);
                    }));
                }
                async _get(key) {
                    const obj = await this._withRetries((db => getObject(db, key)));
                    this.localCache[key] = obj;
                    return obj;
                }
                async _remove(key) {
                    return this._withPendingWrite((async () => {
                        await this._withRetries((db => _deleteObject(db, key)));
                        delete this.localCache[key];
                        return this.notifyServiceWorker(key);
                    }));
                }
                async _poll() {
                    const result = await this._withRetries((db => {
                        const getAllRequest = getObjectStore(db, false).getAll();
                        return new DBPromise(getAllRequest).toPromise();
                    }));
                    if (!result) return [];
                    if (0 !== this.pendingWrites) return [];
                    const keys = [];
                    const keysInResult = new Set;
                    for (const {fbase_key: key, value} of result) {
                        keysInResult.add(key);
                        if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
                            this.notifyListeners(key, value);
                            keys.push(key);
                        }
                    }
                    for (const localKey of Object.keys(this.localCache)) if (this.localCache[localKey] && !keysInResult.has(localKey)) {
                        this.notifyListeners(localKey, null);
                        keys.push(localKey);
                    }
                    return keys;
                }
                notifyListeners(key, newValue) {
                    this.localCache[key] = newValue;
                    const listeners = this.listeners[key];
                    if (listeners) for (const listener of Array.from(listeners)) listener(newValue);
                }
                startPolling() {
                    this.stopPolling();
                    this.pollTimer = setInterval((async () => this._poll()), _POLLING_INTERVAL_MS);
                }
                stopPolling() {
                    if (this.pollTimer) {
                        clearInterval(this.pollTimer);
                        this.pollTimer = null;
                    }
                }
                _addListener(key, listener) {
                    if (0 === Object.keys(this.listeners).length) this.startPolling();
                    if (!this.listeners[key]) {
                        this.listeners[key] = new Set;
                        void this._get(key);
                    }
                    this.listeners[key].add(listener);
                }
                _removeListener(key, listener) {
                    if (this.listeners[key]) {
                        this.listeners[key].delete(listener);
                        if (0 === this.listeners[key].size) delete this.listeners[key];
                    }
                    if (0 === Object.keys(this.listeners).length) this.stopPolling();
                }
            }
            IndexedDBLocalPersistence.type = "LOCAL";
            const indexedDBLocalPersistence = IndexedDBLocalPersistence;
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function startSignInPhoneMfa(auth, request) {
                return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth, request));
            }
            function finalizeSignInPhoneMfa(auth, request) {
                return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function getScriptParentElement() {
                var _a, _b;
                return null !== (_b = null === (_a = document.getElementsByTagName("head")) || void 0 === _a ? void 0 : _a[0]) && void 0 !== _b ? _b : document;
            }
            function _loadJS(url) {
                return new Promise(((resolve, reject) => {
                    const el = document.createElement("script");
                    el.setAttribute("src", url);
                    el.onload = resolve;
                    el.onerror = e => {
                        const error = _createError("internal-error");
                        error.customData = e;
                        reject(error);
                    };
                    el.type = "text/javascript";
                    el.charset = "UTF-8";
                    getScriptParentElement().appendChild(el);
                }));
            }
            function _generateCallbackName(prefix) {
                return `__${prefix}${Math.floor(1e6 * Math.random())}`;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            _generateCallbackName("rcb");
            new Delay(3e4, 6e4);
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const RECAPTCHA_VERIFIER_TYPE = "recaptcha";
            async function _verifyPhoneNumber(auth, options, verifier) {
                var _a;
                const recaptchaToken = await verifier.verify();
                try {
                    _assert("string" === typeof recaptchaToken, auth, "argument-error");
                    _assert(verifier.type === RECAPTCHA_VERIFIER_TYPE, auth, "argument-error");
                    let phoneInfoOptions;
                    if ("string" === typeof options) phoneInfoOptions = {
                        phoneNumber: options
                    }; else phoneInfoOptions = options;
                    if ("session" in phoneInfoOptions) {
                        const session = phoneInfoOptions.session;
                        if ("phoneNumber" in phoneInfoOptions) {
                            _assert("enroll" === session.type, auth, "internal-error");
                            const response = await startEnrollPhoneMfa(auth, {
                                idToken: session.credential,
                                phoneEnrollmentInfo: {
                                    phoneNumber: phoneInfoOptions.phoneNumber,
                                    recaptchaToken
                                }
                            });
                            return response.phoneSessionInfo.sessionInfo;
                        } else {
                            _assert("signin" === session.type, auth, "internal-error");
                            const mfaEnrollmentId = (null === (_a = phoneInfoOptions.multiFactorHint) || void 0 === _a ? void 0 : _a.uid) || phoneInfoOptions.multiFactorUid;
                            _assert(mfaEnrollmentId, auth, "missing-multi-factor-info");
                            const response = await startSignInPhoneMfa(auth, {
                                mfaPendingCredential: session.credential,
                                mfaEnrollmentId,
                                phoneSignInInfo: {
                                    recaptchaToken
                                }
                            });
                            return response.phoneResponseInfo.sessionInfo;
                        }
                    } else {
                        const {sessionInfo} = await sendPhoneVerificationCode(auth, {
                            phoneNumber: phoneInfoOptions.phoneNumber,
                            recaptchaToken
                        });
                        return sessionInfo;
                    }
                } finally {
                    verifier._reset();
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class PhoneAuthProvider {
                constructor(auth) {
                    this.providerId = PhoneAuthProvider.PROVIDER_ID;
                    this.auth = _castAuth(auth);
                }
                verifyPhoneNumber(phoneOptions, applicationVerifier) {
                    return _verifyPhoneNumber(this.auth, phoneOptions, (0, index_esm2017.m9)(applicationVerifier));
                }
                static credential(verificationId, verificationCode) {
                    return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
                }
                static credentialFromResult(userCredential) {
                    const credential = userCredential;
                    return PhoneAuthProvider.credentialFromTaggedObject(credential);
                }
                static credentialFromError(error) {
                    return PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
                }
                static credentialFromTaggedObject({_tokenResponse: tokenResponse}) {
                    if (!tokenResponse) return null;
                    const {phoneNumber, temporaryProof} = tokenResponse;
                    if (phoneNumber && temporaryProof) return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
                    return null;
                }
            }
            PhoneAuthProvider.PROVIDER_ID = "phone";
            PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function _withDefaultResolver(auth, resolverOverride) {
                if (resolverOverride) return _getInstance(resolverOverride);
                _assert(auth._popupRedirectResolver, auth, "argument-error");
                return auth._popupRedirectResolver;
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class IdpCredential extends AuthCredential {
                constructor(params) {
                    super("custom", "custom");
                    this.params = params;
                }
                _getIdTokenResponse(auth) {
                    return signInWithIdp(auth, this._buildIdpRequest());
                }
                _linkToIdToken(auth, idToken) {
                    return signInWithIdp(auth, this._buildIdpRequest(idToken));
                }
                _getReauthenticationResolver(auth) {
                    return signInWithIdp(auth, this._buildIdpRequest());
                }
                _buildIdpRequest(idToken) {
                    const request = {
                        requestUri: this.params.requestUri,
                        sessionId: this.params.sessionId,
                        postBody: this.params.postBody,
                        tenantId: this.params.tenantId,
                        pendingToken: this.params.pendingToken,
                        returnSecureToken: true,
                        returnIdpCredential: true
                    };
                    if (idToken) request.idToken = idToken;
                    return request;
                }
            }
            function _signIn(params) {
                return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
            }
            function _reauth(params) {
                const {auth, user} = params;
                _assert(user, auth, "internal-error");
                return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
            }
            async function _link(params) {
                const {auth, user} = params;
                _assert(user, auth, "internal-error");
                return _link$1(user, new IdpCredential(params), params.bypassAuthState);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AbstractPopupRedirectOperation {
                constructor(auth, filter, resolver, user, bypassAuthState = false) {
                    this.auth = auth;
                    this.resolver = resolver;
                    this.user = user;
                    this.bypassAuthState = bypassAuthState;
                    this.pendingPromise = null;
                    this.eventManager = null;
                    this.filter = Array.isArray(filter) ? filter : [ filter ];
                }
                execute() {
                    return new Promise((async (resolve, reject) => {
                        this.pendingPromise = {
                            resolve,
                            reject
                        };
                        try {
                            this.eventManager = await this.resolver._initialize(this.auth);
                            await this.onExecution();
                            this.eventManager.registerConsumer(this);
                        } catch (e) {
                            this.reject(e);
                        }
                    }));
                }
                async onAuthEvent(event) {
                    const {urlResponse, sessionId, postBody, tenantId, error, type} = event;
                    if (error) {
                        this.reject(error);
                        return;
                    }
                    const params = {
                        auth: this.auth,
                        requestUri: urlResponse,
                        sessionId,
                        tenantId: tenantId || void 0,
                        postBody: postBody || void 0,
                        user: this.user,
                        bypassAuthState: this.bypassAuthState
                    };
                    try {
                        this.resolve(await this.getIdpTask(type)(params));
                    } catch (e) {
                        this.reject(e);
                    }
                }
                onError(error) {
                    this.reject(error);
                }
                getIdpTask(type) {
                    switch (type) {
                      case "signInViaPopup":
                      case "signInViaRedirect":
                        return _signIn;

                      case "linkViaPopup":
                      case "linkViaRedirect":
                        return _link;

                      case "reauthViaPopup":
                      case "reauthViaRedirect":
                        return _reauth;

                      default:
                        _fail(this.auth, "internal-error");
                    }
                }
                resolve(cred) {
                    debugAssert(this.pendingPromise, "Pending promise was never set");
                    this.pendingPromise.resolve(cred);
                    this.unregisterAndCleanUp();
                }
                reject(error) {
                    debugAssert(this.pendingPromise, "Pending promise was never set");
                    this.pendingPromise.reject(error);
                    this.unregisterAndCleanUp();
                }
                unregisterAndCleanUp() {
                    if (this.eventManager) this.eventManager.unregisterConsumer(this);
                    this.pendingPromise = null;
                    this.cleanUp();
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
            class PopupOperation extends AbstractPopupRedirectOperation {
                constructor(auth, filter, provider, resolver, user) {
                    super(auth, filter, resolver, user);
                    this.provider = provider;
                    this.authWindow = null;
                    this.pollId = null;
                    if (PopupOperation.currentPopupAction) PopupOperation.currentPopupAction.cancel();
                    PopupOperation.currentPopupAction = this;
                }
                async executeNotNull() {
                    const result = await this.execute();
                    _assert(result, this.auth, "internal-error");
                    return result;
                }
                async onExecution() {
                    debugAssert(1 === this.filter.length, "Popup operations only handle one event");
                    const eventId = _generateEventId();
                    this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], eventId);
                    this.authWindow.associatedEvent = eventId;
                    this.resolver._originValidation(this.auth).catch((e => {
                        this.reject(e);
                    }));
                    this.resolver._isIframeWebStorageSupported(this.auth, (isSupported => {
                        if (!isSupported) this.reject(_createError(this.auth, "web-storage-unsupported"));
                    }));
                    this.pollUserCancellation();
                }
                get eventId() {
                    var _a;
                    return (null === (_a = this.authWindow) || void 0 === _a ? void 0 : _a.associatedEvent) || null;
                }
                cancel() {
                    this.reject(_createError(this.auth, "cancelled-popup-request"));
                }
                cleanUp() {
                    if (this.authWindow) this.authWindow.close();
                    if (this.pollId) window.clearTimeout(this.pollId);
                    this.authWindow = null;
                    this.pollId = null;
                    PopupOperation.currentPopupAction = null;
                }
                pollUserCancellation() {
                    const poll = () => {
                        var _a, _b;
                        if (null === (_b = null === (_a = this.authWindow) || void 0 === _a ? void 0 : _a.window) || void 0 === _b ? void 0 : _b.closed) {
                            this.pollId = window.setTimeout((() => {
                                this.pollId = null;
                                this.reject(_createError(this.auth, "popup-closed-by-user"));
                            }), 2e3);
                            return;
                        }
                        this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
                    };
                    poll();
                }
            }
            PopupOperation.currentPopupAction = null;
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const PENDING_REDIRECT_KEY = "pendingRedirect";
            const redirectOutcomeMap = new Map;
            class RedirectAction extends AbstractPopupRedirectOperation {
                constructor(auth, resolver, bypassAuthState = false) {
                    super(auth, [ "signInViaRedirect", "linkViaRedirect", "reauthViaRedirect", "unknown" ], resolver, void 0, bypassAuthState);
                    this.eventId = null;
                }
                async execute() {
                    let readyOutcome = redirectOutcomeMap.get(this.auth._key());
                    if (!readyOutcome) {
                        try {
                            const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
                            const result = hasPendingRedirect ? await super.execute() : null;
                            readyOutcome = () => Promise.resolve(result);
                        } catch (e) {
                            readyOutcome = () => Promise.reject(e);
                        }
                        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
                    }
                    if (!this.bypassAuthState) redirectOutcomeMap.set(this.auth._key(), (() => Promise.resolve(null)));
                    return readyOutcome();
                }
                async onAuthEvent(event) {
                    if ("signInViaRedirect" === event.type) return super.onAuthEvent(event); else if ("unknown" === event.type) {
                        this.resolve(null);
                        return;
                    }
                    if (event.eventId) {
                        const user = await this.auth._redirectUserForId(event.eventId);
                        if (user) {
                            this.user = user;
                            return super.onAuthEvent(event);
                        } else this.resolve(null);
                    }
                }
                async onExecution() {}
                cleanUp() {}
            }
            async function _getAndClearPendingRedirectStatus(resolver, auth) {
                const key = pendingRedirectKey(auth);
                const persistence = resolverPersistence(resolver);
                if (!await persistence._isAvailable()) return false;
                const hasPendingRedirect = "true" === await persistence._get(key);
                await persistence._remove(key);
                return hasPendingRedirect;
            }
            function _overrideRedirectResult(auth, result) {
                redirectOutcomeMap.set(auth._key(), result);
            }
            function resolverPersistence(resolver) {
                return _getInstance(resolver._redirectPersistence);
            }
            function pendingRedirectKey(auth) {
                return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
                const authInternal = _castAuth(auth);
                const resolver = _withDefaultResolver(authInternal, resolverExtern);
                const action = new RedirectAction(authInternal, resolver, bypassAuthState);
                const result = await action.execute();
                if (result && !bypassAuthState) {
                    delete result.user._redirectEventId;
                    await authInternal._persistUserIfCurrent(result.user);
                    await authInternal._setRedirectUser(null, resolverExtern);
                }
                return result;
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
            class AuthEventManager {
                constructor(auth) {
                    this.auth = auth;
                    this.cachedEventUids = new Set;
                    this.consumers = new Set;
                    this.queuedRedirectEvent = null;
                    this.hasHandledPotentialRedirect = false;
                    this.lastProcessedEventTime = Date.now();
                }
                registerConsumer(authEventConsumer) {
                    this.consumers.add(authEventConsumer);
                    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
                        this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
                        this.saveEventToCache(this.queuedRedirectEvent);
                        this.queuedRedirectEvent = null;
                    }
                }
                unregisterConsumer(authEventConsumer) {
                    this.consumers.delete(authEventConsumer);
                }
                onEvent(event) {
                    if (this.hasEventBeenHandled(event)) return false;
                    let handled = false;
                    this.consumers.forEach((consumer => {
                        if (this.isEventForConsumer(event, consumer)) {
                            handled = true;
                            this.sendToConsumer(event, consumer);
                            this.saveEventToCache(event);
                        }
                    }));
                    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) return handled;
                    this.hasHandledPotentialRedirect = true;
                    if (!handled) {
                        this.queuedRedirectEvent = event;
                        handled = true;
                    }
                    return handled;
                }
                sendToConsumer(event, consumer) {
                    var _a;
                    if (event.error && !isNullRedirectEvent(event)) {
                        const code = (null === (_a = event.error.code) || void 0 === _a ? void 0 : _a.split("auth/")[1]) || "internal-error";
                        consumer.onError(_createError(this.auth, code));
                    } else consumer.onAuthEvent(event);
                }
                isEventForConsumer(event, consumer) {
                    const eventIdMatches = null === consumer.eventId || !!event.eventId && event.eventId === consumer.eventId;
                    return consumer.filter.includes(event.type) && eventIdMatches;
                }
                hasEventBeenHandled(event) {
                    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) this.cachedEventUids.clear();
                    return this.cachedEventUids.has(eventUid(event));
                }
                saveEventToCache(event) {
                    this.cachedEventUids.add(eventUid(event));
                    this.lastProcessedEventTime = Date.now();
                }
            }
            function eventUid(e) {
                return [ e.type, e.eventId, e.sessionId, e.tenantId ].filter((v => v)).join("-");
            }
            function isNullRedirectEvent({type, error}) {
                return "unknown" === type && (null === error || void 0 === error ? void 0 : error.code) === `auth/${"no-auth-event"}`;
            }
            function isRedirectEvent(event) {
                switch (event.type) {
                  case "signInViaRedirect":
                  case "linkViaRedirect":
                  case "reauthViaRedirect":
                    return true;

                  case "unknown":
                    return isNullRedirectEvent(event);

                  default:
                    return false;
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            async function _getProjectConfig(auth, request = {}) {
                return _performApiRequest(auth, "GET", "/v1/projects", request);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
            const HTTP_REGEX = /^https?/;
            async function _validateOrigin(auth) {
                if (auth.config.emulator) return;
                const {authorizedDomains} = await _getProjectConfig(auth);
                for (const domain of authorizedDomains) try {
                    if (matchDomain(domain)) return;
                } catch (_a) {}
                _fail(auth, "unauthorized-domain");
            }
            function matchDomain(expected) {
                const currentUrl = _getCurrentUrl();
                const {protocol, hostname} = new URL(currentUrl);
                if (expected.startsWith("chrome-extension://")) {
                    const ceUrl = new URL(expected);
                    if ("" === ceUrl.hostname && "" === hostname) return "chrome-extension:" === protocol && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
                    return "chrome-extension:" === protocol && ceUrl.hostname === hostname;
                }
                if (!HTTP_REGEX.test(protocol)) return false;
                if (IP_ADDRESS_REGEX.test(expected)) return hostname === expected;
                const escapedDomainPattern = expected.replace(/\./g, "\\.");
                const re = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
                return re.test(hostname);
            }
            /**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const NETWORK_TIMEOUT = new Delay(3e4, 6e4);
            function resetUnloadedGapiModules() {
                const beacon = _window().___jsl;
                if (null === beacon || void 0 === beacon ? void 0 : beacon.H) for (const hint of Object.keys(beacon.H)) {
                    beacon.H[hint].r = beacon.H[hint].r || [];
                    beacon.H[hint].L = beacon.H[hint].L || [];
                    beacon.H[hint].r = [ ...beacon.H[hint].L ];
                    if (beacon.CP) for (let i = 0; i < beacon.CP.length; i++) beacon.CP[i] = null;
                }
            }
            function loadGapi(auth) {
                return new Promise(((resolve, reject) => {
                    var _a, _b, _c;
                    function loadGapiIframe() {
                        resetUnloadedGapiModules();
                        gapi.load("gapi.iframes", {
                            callback: () => {
                                resolve(gapi.iframes.getContext());
                            },
                            ontimeout: () => {
                                resetUnloadedGapiModules();
                                reject(_createError(auth, "network-request-failed"));
                            },
                            timeout: NETWORK_TIMEOUT.get()
                        });
                    }
                    if (null === (_b = null === (_a = _window().gapi) || void 0 === _a ? void 0 : _a.iframes) || void 0 === _b ? void 0 : _b.Iframe) resolve(gapi.iframes.getContext()); else if (!!(null === (_c = _window().gapi) || void 0 === _c ? void 0 : _c.load)) loadGapiIframe(); else {
                        const cbName = _generateCallbackName("iframefcb");
                        _window()[cbName] = () => {
                            if (!!gapi.load) loadGapiIframe(); else reject(_createError(auth, "network-request-failed"));
                        };
                        return _loadJS(`https://apis.google.com/js/api.js?onload=${cbName}`).catch((e => reject(e)));
                    }
                })).catch((error => {
                    cachedGApiLoader = null;
                    throw error;
                }));
            }
            let cachedGApiLoader = null;
            function _loadGapi(auth) {
                cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
                return cachedGApiLoader;
            }
            /**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const PING_TIMEOUT = new Delay(5e3, 15e3);
            const IFRAME_PATH = "__/auth/iframe";
            const EMULATED_IFRAME_PATH = "emulator/auth/iframe";
            const IFRAME_ATTRIBUTES = {
                style: {
                    position: "absolute",
                    top: "-100px",
                    width: "1px",
                    height: "1px"
                },
                "aria-hidden": "true",
                tabindex: "-1"
            };
            const EID_FROM_APIHOST = new Map([ [ "identitytoolkit.googleapis.com", "p" ], [ "staging-identitytoolkit.sandbox.googleapis.com", "s" ], [ "test-identitytoolkit.sandbox.googleapis.com", "t" ] ]);
            function getIframeUrl(auth) {
                const config = auth.config;
                _assert(config.authDomain, auth, "auth-domain-config-required");
                const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
                const params = {
                    apiKey: config.apiKey,
                    appName: auth.name,
                    v: esm_index_esm2017.Jn
                };
                const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
                if (eid) params.eid = eid;
                const frameworks = auth._getFrameworks();
                if (frameworks.length) params.fw = frameworks.join(",");
                return `${url}?${(0, index_esm2017.xO)(params).slice(1)}`;
            }
            async function _openIframe(auth) {
                const context = await _loadGapi(auth);
                const gapi = _window().gapi;
                _assert(gapi, auth, "internal-error");
                return context.open({
                    where: document.body,
                    url: getIframeUrl(auth),
                    messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
                    attributes: IFRAME_ATTRIBUTES,
                    dontclear: true
                }, (iframe => new Promise((async (resolve, reject) => {
                    await iframe.restyle({
                        setHideOnLeave: false
                    });
                    const networkError = _createError(auth, "network-request-failed");
                    const networkErrorTimer = _window().setTimeout((() => {
                        reject(networkError);
                    }), PING_TIMEOUT.get());
                    function clearTimerAndResolve() {
                        _window().clearTimeout(networkErrorTimer);
                        resolve(iframe);
                    }
                    iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, (() => {
                        reject(networkError);
                    }));
                }))));
            }
            /**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const BASE_POPUP_OPTIONS = {
                location: "yes",
                resizable: "yes",
                statusbar: "yes",
                toolbar: "no"
            };
            const DEFAULT_WIDTH = 500;
            const DEFAULT_HEIGHT = 600;
            const TARGET_BLANK = "_blank";
            const FIREFOX_EMPTY_URL = "http://localhost";
            class AuthPopup {
                constructor(window) {
                    this.window = window;
                    this.associatedEvent = null;
                }
                close() {
                    if (this.window) try {
                        this.window.close();
                    } catch (e) {}
                }
            }
            function _open(auth, url, name, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
                const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
                const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
                let target = "";
                const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
                    width: width.toString(),
                    height: height.toString(),
                    top,
                    left
                });
                const ua = (0, index_esm2017.z$)().toLowerCase();
                if (name) target = _isChromeIOS(ua) ? TARGET_BLANK : name;
                if (_isFirefox(ua)) {
                    url = url || FIREFOX_EMPTY_URL;
                    options.scrollbars = "yes";
                }
                const optionsString = Object.entries(options).reduce(((accum, [key, value]) => `${accum}${key}=${value},`), "");
                if (_isIOSStandalone(ua) && "_self" !== target) {
                    openAsNewWindowIOS(url || "", target);
                    return new AuthPopup(null);
                }
                const newWin = window.open(url || "", target, optionsString);
                _assert(newWin, auth, "popup-blocked");
                try {
                    newWin.focus();
                } catch (e) {}
                return new AuthPopup(newWin);
            }
            function openAsNewWindowIOS(url, target) {
                const el = document.createElement("a");
                el.href = url;
                el.target = target;
                const click = document.createEvent("MouseEvent");
                click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
                el.dispatchEvent(click);
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const WIDGET_PATH = "__/auth/handler";
            const EMULATOR_WIDGET_PATH = "emulator/auth/handler";
            function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
                _assert(auth.config.authDomain, auth, "auth-domain-config-required");
                _assert(auth.config.apiKey, auth, "invalid-api-key");
                const params = {
                    apiKey: auth.config.apiKey,
                    appName: auth.name,
                    authType,
                    redirectUrl,
                    v: esm_index_esm2017.Jn,
                    eventId
                };
                if (provider instanceof FederatedAuthProvider) {
                    provider.setDefaultLanguage(auth.languageCode);
                    params.providerId = provider.providerId || "";
                    if (!(0, index_esm2017.xb)(provider.getCustomParameters())) params.customParameters = JSON.stringify(provider.getCustomParameters());
                    for (const [key, value] of Object.entries(additionalParams || {})) params[key] = value;
                }
                if (provider instanceof BaseOAuthProvider) {
                    const scopes = provider.getScopes().filter((scope => "" !== scope));
                    if (scopes.length > 0) params.scopes = scopes.join(",");
                }
                if (auth.tenantId) params.tid = auth.tenantId;
                const paramsDict = params;
                for (const key of Object.keys(paramsDict)) if (void 0 === paramsDict[key]) delete paramsDict[key];
                return `${getHandlerBase(auth)}?${(0, index_esm2017.xO)(paramsDict).slice(1)}`;
            }
            function getHandlerBase({config}) {
                if (!config.emulator) return `https://${config.authDomain}/${WIDGET_PATH}`;
                return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
            class BrowserPopupRedirectResolver {
                constructor() {
                    this.eventManagers = {};
                    this.iframes = {};
                    this.originValidationPromises = {};
                    this._redirectPersistence = browserSessionPersistence;
                    this._completeRedirectFn = _getRedirectResult;
                    this._overrideRedirectResult = _overrideRedirectResult;
                }
                async _openPopup(auth, provider, authType, eventId) {
                    var _a;
                    debugAssert(null === (_a = this.eventManagers[auth._key()]) || void 0 === _a ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
                    const url = _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
                    return _open(auth, url, _generateEventId());
                }
                async _openRedirect(auth, provider, authType, eventId) {
                    await this._originValidation(auth);
                    _setWindowLocation(_getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId));
                    return new Promise((() => {}));
                }
                _initialize(auth) {
                    const key = auth._key();
                    if (this.eventManagers[key]) {
                        const {manager, promise} = this.eventManagers[key];
                        if (manager) return Promise.resolve(manager); else {
                            debugAssert(promise, "If manager is not set, promise should be");
                            return promise;
                        }
                    }
                    const promise = this.initAndGetManager(auth);
                    this.eventManagers[key] = {
                        promise
                    };
                    promise.catch((() => {
                        delete this.eventManagers[key];
                    }));
                    return promise;
                }
                async initAndGetManager(auth) {
                    const iframe = await _openIframe(auth);
                    const manager = new AuthEventManager(auth);
                    iframe.register("authEvent", (iframeEvent => {
                        _assert(null === iframeEvent || void 0 === iframeEvent ? void 0 : iframeEvent.authEvent, auth, "invalid-auth-event");
                        const handled = manager.onEvent(iframeEvent.authEvent);
                        return {
                            status: handled ? "ACK" : "ERROR"
                        };
                    }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
                    this.eventManagers[auth._key()] = {
                        manager
                    };
                    this.iframes[auth._key()] = iframe;
                    return manager;
                }
                _isIframeWebStorageSupported(auth, cb) {
                    const iframe = this.iframes[auth._key()];
                    iframe.send(WEB_STORAGE_SUPPORT_KEY, {
                        type: WEB_STORAGE_SUPPORT_KEY
                    }, (result => {
                        var _a;
                        const isSupported = null === (_a = null === result || void 0 === result ? void 0 : result[0]) || void 0 === _a ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
                        if (void 0 !== isSupported) cb(!!isSupported);
                        _fail(auth, "internal-error");
                    }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
                }
                _originValidation(auth) {
                    const key = auth._key();
                    if (!this.originValidationPromises[key]) this.originValidationPromises[key] = _validateOrigin(auth);
                    return this.originValidationPromises[key];
                }
                get _shouldInitProactively() {
                    return _isMobileBrowser() || _isSafari() || _isIOS();
                }
            }
            const browserPopupRedirectResolver = BrowserPopupRedirectResolver;
            class MultiFactorAssertionImpl {
                constructor(factorId) {
                    this.factorId = factorId;
                }
                _process(auth, session, displayName) {
                    switch (session.type) {
                      case "enroll":
                        return this._finalizeEnroll(auth, session.credential, displayName);

                      case "signin":
                        return this._finalizeSignIn(auth, session.credential);

                      default:
                        return debugFail("unexpected MultiFactorSessionType");
                    }
                }
            }
            class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
                constructor(credential) {
                    super("phone");
                    this.credential = credential;
                }
                static _fromCredential(credential) {
                    return new PhoneMultiFactorAssertionImpl(credential);
                }
                _finalizeEnroll(auth, idToken, displayName) {
                    return finalizeEnrollPhoneMfa(auth, {
                        idToken,
                        displayName,
                        phoneVerificationInfo: this.credential._makeVerificationRequest()
                    });
                }
                _finalizeSignIn(auth, mfaPendingCredential) {
                    return finalizeSignInPhoneMfa(auth, {
                        mfaPendingCredential,
                        phoneVerificationInfo: this.credential._makeVerificationRequest()
                    });
                }
            }
            class PhoneMultiFactorGenerator {
                constructor() {}
                static assertion(credential) {
                    return PhoneMultiFactorAssertionImpl._fromCredential(credential);
                }
            }
            PhoneMultiFactorGenerator.FACTOR_ID = "phone";
            var index_90ebcfae_name = "@firebase/auth";
            var version = "0.20.5";
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AuthInterop {
                constructor(auth) {
                    this.auth = auth;
                    this.internalListeners = new Map;
                }
                getUid() {
                    var _a;
                    this.assertAuthConfigured();
                    return (null === (_a = this.auth.currentUser) || void 0 === _a ? void 0 : _a.uid) || null;
                }
                async getToken(forceRefresh) {
                    this.assertAuthConfigured();
                    await this.auth._initializationPromise;
                    if (!this.auth.currentUser) return null;
                    const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
                    return {
                        accessToken
                    };
                }
                addAuthTokenListener(listener) {
                    this.assertAuthConfigured();
                    if (this.internalListeners.has(listener)) return;
                    const unsubscribe = this.auth.onIdTokenChanged((user => {
                        var _a;
                        listener((null === (_a = user) || void 0 === _a ? void 0 : _a.stsTokenManager.accessToken) || null);
                    }));
                    this.internalListeners.set(listener, unsubscribe);
                    this.updateProactiveRefresh();
                }
                removeAuthTokenListener(listener) {
                    this.assertAuthConfigured();
                    const unsubscribe = this.internalListeners.get(listener);
                    if (!unsubscribe) return;
                    this.internalListeners.delete(listener);
                    unsubscribe();
                    this.updateProactiveRefresh();
                }
                assertAuthConfigured() {
                    _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
                }
                updateProactiveRefresh() {
                    if (this.internalListeners.size > 0) this.auth._startProactiveRefresh(); else this.auth._stopProactiveRefresh();
                }
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function getVersionForPlatform(clientPlatform) {
                switch (clientPlatform) {
                  case "Node":
                    return "node";

                  case "ReactNative":
                    return "rn";

                  case "Worker":
                    return "webworker";

                  case "Cordova":
                    return "cordova";

                  default:
                    return;
                }
            }
            function registerAuth(clientPlatform) {
                (0, esm_index_esm2017.Xd)(new component_dist_esm_index_esm2017.wA("auth", ((container, {options: deps}) => {
                    const app = container.getProvider("app").getImmediate();
                    const heartbeatServiceProvider = container.getProvider("heartbeat");
                    const {apiKey, authDomain} = app.options;
                    return ((app, heartbeatServiceProvider) => {
                        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", {
                            appName: app.name
                        });
                        _assert(!(null === authDomain || void 0 === authDomain ? void 0 : authDomain.includes(":")), "argument-error", {
                            appName: app.name
                        });
                        const config = {
                            apiKey,
                            authDomain,
                            clientPlatform,
                            apiHost: "identitytoolkit.googleapis.com",
                            tokenApiHost: "securetoken.googleapis.com",
                            apiScheme: "https",
                            sdkClientVersion: _getClientVersion(clientPlatform)
                        };
                        const authInstance = new AuthImpl(app, heartbeatServiceProvider, config);
                        _initializeAuthInstance(authInstance, deps);
                        return authInstance;
                    })(app, heartbeatServiceProvider);
                }), "PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback(((container, _instanceIdentifier, _instance) => {
                    const authInternalProvider = container.getProvider("auth-internal");
                    authInternalProvider.initialize();
                })));
                (0, esm_index_esm2017.Xd)(new component_dist_esm_index_esm2017.wA("auth-internal", (container => {
                    const auth = _castAuth(container.getProvider("auth").getImmediate());
                    return (auth => new AuthInterop(auth))(auth);
                }), "PRIVATE").setInstantiationMode("EXPLICIT"));
                (0, esm_index_esm2017.KN)(index_90ebcfae_name, version, getVersionForPlatform(clientPlatform));
                (0, esm_index_esm2017.KN)(index_90ebcfae_name, version, "esm2017");
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function getAuth(app = (0, esm_index_esm2017.Mq)()) {
                const provider = (0, esm_index_esm2017.qX)(app, "auth");
                if (provider.isInitialized()) return provider.getImmediate();
                return initializeAuth(app, {
                    popupRedirectResolver: browserPopupRedirectResolver,
                    persistence: [ indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence ]
                });
            }
            registerAuth("Browser");
        },
        956: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                iU: () => child,
                U2: () => get,
                N8: () => getDatabase,
                iH: () => ref,
                t8: () => set,
                Vx: () => update
            });
            var index_esm2017 = __webpack_require__(389);
            var esm_index_esm2017 = __webpack_require__(463);
            var dist_index_esm2017 = __webpack_require__(444);
            var dist_esm_index_esm2017 = __webpack_require__(333);
            const index_esm2017_name = "@firebase/database";
            const version = "0.13.5";
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let SDK_VERSION = "";
            function setSDKVersion(version) {
                SDK_VERSION = version;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class DOMStorageWrapper {
                constructor(domStorage_) {
                    this.domStorage_ = domStorage_;
                    this.prefix_ = "firebase:";
                }
                set(key, value) {
                    if (null == value) this.domStorage_.removeItem(this.prefixedName_(key)); else this.domStorage_.setItem(this.prefixedName_(key), (0, 
                    dist_index_esm2017.Pz)(value));
                }
                get(key) {
                    const storedVal = this.domStorage_.getItem(this.prefixedName_(key));
                    if (null == storedVal) return null; else return (0, dist_index_esm2017.cI)(storedVal);
                }
                remove(key) {
                    this.domStorage_.removeItem(this.prefixedName_(key));
                }
                prefixedName_(name) {
                    return this.prefix_ + name;
                }
                toString() {
                    return this.domStorage_.toString();
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class MemoryStorage {
                constructor() {
                    this.cache_ = {};
                    this.isInMemoryStorage = true;
                }
                set(key, value) {
                    if (null == value) delete this.cache_[key]; else this.cache_[key] = value;
                }
                get(key) {
                    if ((0, dist_index_esm2017.r3)(this.cache_, key)) return this.cache_[key];
                    return null;
                }
                remove(key) {
                    delete this.cache_[key];
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const createStoragefor = function(domStorageName) {
                try {
                    if ("undefined" !== typeof window && "undefined" !== typeof window[domStorageName]) {
                        const domStorage = window[domStorageName];
                        domStorage.setItem("firebase:sentinel", "cache");
                        domStorage.removeItem("firebase:sentinel");
                        return new DOMStorageWrapper(domStorage);
                    }
                } catch (e) {}
                return new MemoryStorage;
            };
            const PersistentStorage = createStoragefor("localStorage");
            const SessionStorage = createStoragefor("sessionStorage");
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const logClient = new dist_esm_index_esm2017.Yd("@firebase/database");
            const LUIDGenerator = function() {
                let id = 1;
                return function() {
                    return id++;
                };
            }();
            const sha1 = function(str) {
                const utf8Bytes = (0, dist_index_esm2017.dS)(str);
                const sha1 = new dist_index_esm2017.gQ;
                sha1.update(utf8Bytes);
                const sha1Bytes = sha1.digest();
                return dist_index_esm2017.US.encodeByteArray(sha1Bytes);
            };
            const buildLogMessage_ = function(...varArgs) {
                let message = "";
                for (let i = 0; i < varArgs.length; i++) {
                    const arg = varArgs[i];
                    if (Array.isArray(arg) || arg && "object" === typeof arg && "number" === typeof arg.length) message += buildLogMessage_.apply(null, arg); else if ("object" === typeof arg) message += (0, 
                    dist_index_esm2017.Pz)(arg); else message += arg;
                    message += " ";
                }
                return message;
            };
            let logger = null;
            let firstLog_ = true;
            const enableLogging$1 = function(logger_, persistent) {
                (0, dist_index_esm2017.hu)(!persistent || true === logger_ || false === logger_, "Can't turn on custom loggers persistently.");
                if (true === logger_) {
                    logClient.logLevel = dist_esm_index_esm2017["in"].VERBOSE;
                    logger = logClient.log.bind(logClient);
                    if (persistent) SessionStorage.set("logging_enabled", true);
                } else if ("function" === typeof logger_) logger = logger_; else {
                    logger = null;
                    SessionStorage.remove("logging_enabled");
                }
            };
            const log = function(...varArgs) {
                if (true === firstLog_) {
                    firstLog_ = false;
                    if (null === logger && true === SessionStorage.get("logging_enabled")) enableLogging$1(true);
                }
                if (logger) {
                    const message = buildLogMessage_.apply(null, varArgs);
                    logger(message);
                }
            };
            const logWrapper = function(prefix) {
                return function(...varArgs) {
                    log(prefix, ...varArgs);
                };
            };
            const error = function(...varArgs) {
                const message = "FIREBASE INTERNAL ERROR: " + buildLogMessage_(...varArgs);
                logClient.error(message);
            };
            const fatal = function(...varArgs) {
                const message = `FIREBASE FATAL ERROR: ${buildLogMessage_(...varArgs)}`;
                logClient.error(message);
                throw new Error(message);
            };
            const warn = function(...varArgs) {
                const message = "FIREBASE WARNING: " + buildLogMessage_(...varArgs);
                logClient.warn(message);
            };
            const warnIfPageIsSecure = function() {
                if ("undefined" !== typeof window && window.location && window.location.protocol && -1 !== window.location.protocol.indexOf("https:")) warn("Insecure Firebase access from a secure page. " + "Please use https in calls to new Firebase().");
            };
            const isInvalidJSONNumber = function(data) {
                return "number" === typeof data && (data !== data || data === Number.POSITIVE_INFINITY || data === Number.NEGATIVE_INFINITY);
            };
            const executeWhenDOMReady = function(fn) {
                if ((0, dist_index_esm2017.Yr)() || "complete" === document.readyState) fn(); else {
                    let called = false;
                    const wrappedFn = function() {
                        if (!document.body) {
                            setTimeout(wrappedFn, Math.floor(10));
                            return;
                        }
                        if (!called) {
                            called = true;
                            fn();
                        }
                    };
                    if (document.addEventListener) {
                        document.addEventListener("DOMContentLoaded", wrappedFn, false);
                        window.addEventListener("load", wrappedFn, false);
                    } else if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", (() => {
                            if ("complete" === document.readyState) wrappedFn();
                        }));
                        window.attachEvent("onload", wrappedFn);
                    }
                }
            };
            const MIN_NAME = "[MIN_NAME]";
            const MAX_NAME = "[MAX_NAME]";
            const nameCompare = function(a, b) {
                if (a === b) return 0; else if (a === MIN_NAME || b === MAX_NAME) return -1; else if (b === MIN_NAME || a === MAX_NAME) return 1; else {
                    const aAsInt = tryParseInt(a), bAsInt = tryParseInt(b);
                    if (null !== aAsInt) if (null !== bAsInt) return aAsInt - bAsInt === 0 ? a.length - b.length : aAsInt - bAsInt; else return -1; else if (null !== bAsInt) return 1; else return a < b ? -1 : 1;
                }
            };
            const stringCompare = function(a, b) {
                if (a === b) return 0; else if (a < b) return -1; else return 1;
            };
            const requireKey = function(key, obj) {
                if (obj && key in obj) return obj[key]; else throw new Error("Missing required key (" + key + ") in object: " + (0, 
                dist_index_esm2017.Pz)(obj));
            };
            const ObjectToUniqueKey = function(obj) {
                if ("object" !== typeof obj || null === obj) return (0, dist_index_esm2017.Pz)(obj);
                const keys = [];
                for (const k in obj) keys.push(k);
                keys.sort();
                let key = "{";
                for (let i = 0; i < keys.length; i++) {
                    if (0 !== i) key += ",";
                    key += (0, dist_index_esm2017.Pz)(keys[i]);
                    key += ":";
                    key += ObjectToUniqueKey(obj[keys[i]]);
                }
                key += "}";
                return key;
            };
            const splitStringBySize = function(str, segsize) {
                const len = str.length;
                if (len <= segsize) return [ str ];
                const dataSegs = [];
                for (let c = 0; c < len; c += segsize) if (c + segsize > len) dataSegs.push(str.substring(c, len)); else dataSegs.push(str.substring(c, c + segsize));
                return dataSegs;
            };
            function each(obj, fn) {
                for (const key in obj) if (obj.hasOwnProperty(key)) fn(key, obj[key]);
            }
            const doubleToIEEE754String = function(v) {
                (0, dist_index_esm2017.hu)(!isInvalidJSONNumber(v), "Invalid JSON number");
                const ebits = 11, fbits = 52;
                const bias = (1 << ebits - 1) - 1;
                let s, e, f, ln, i;
                if (0 === v) {
                    e = 0;
                    f = 0;
                    s = 1 / v === -1 / 0 ? 1 : 0;
                } else {
                    s = v < 0;
                    v = Math.abs(v);
                    if (v >= Math.pow(2, 1 - bias)) {
                        ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
                        e = ln + bias;
                        f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
                    } else {
                        e = 0;
                        f = Math.round(v / Math.pow(2, 1 - bias - fbits));
                    }
                }
                const bits = [];
                for (i = fbits; i; i -= 1) {
                    bits.push(f % 2 ? 1 : 0);
                    f = Math.floor(f / 2);
                }
                for (i = ebits; i; i -= 1) {
                    bits.push(e % 2 ? 1 : 0);
                    e = Math.floor(e / 2);
                }
                bits.push(s ? 1 : 0);
                bits.reverse();
                const str = bits.join("");
                let hexByteString = "";
                for (i = 0; i < 64; i += 8) {
                    let hexByte = parseInt(str.substr(i, 8), 2).toString(16);
                    if (1 === hexByte.length) hexByte = "0" + hexByte;
                    hexByteString += hexByte;
                }
                return hexByteString.toLowerCase();
            };
            const isChromeExtensionContentScript = function() {
                return !!("object" === typeof window && window["chrome"] && window["chrome"]["extension"] && !/^chrome/.test(window.location.href));
            };
            const isWindowsStoreApp = function() {
                return "object" === typeof Windows && "object" === typeof Windows.UI;
            };
            function errorForServerCode(code, query) {
                let reason = "Unknown Error";
                if ("too_big" === code) reason = "The data requested exceeds the maximum size " + "that can be accessed with a single request."; else if ("permission_denied" === code) reason = "Client doesn't have permission to access the desired data."; else if ("unavailable" === code) reason = "The service is unavailable";
                const error = new Error(code + " at " + query._path.toString() + ": " + reason);
                error.code = code.toUpperCase();
                return error;
            }
            const INTEGER_REGEXP_ = new RegExp("^-?(0*)\\d{1,10}$");
            const INTEGER_32_MIN = -2147483648;
            const INTEGER_32_MAX = 2147483647;
            const tryParseInt = function(str) {
                if (INTEGER_REGEXP_.test(str)) {
                    const intVal = Number(str);
                    if (intVal >= INTEGER_32_MIN && intVal <= INTEGER_32_MAX) return intVal;
                }
                return null;
            };
            const exceptionGuard = function(fn) {
                try {
                    fn();
                } catch (e) {
                    setTimeout((() => {
                        const stack = e.stack || "";
                        warn("Exception was thrown by user callback.", stack);
                        throw e;
                    }), Math.floor(0));
                }
            };
            const beingCrawled = function() {
                const userAgent = "object" === typeof window && window["navigator"] && window["navigator"]["userAgent"] || "";
                return userAgent.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i) >= 0;
            };
            const setTimeoutNonBlocking = function(fn, time) {
                const timeout = setTimeout(fn, time);
                if ("object" === typeof timeout && timeout["unref"]) timeout["unref"]();
                return timeout;
            };
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AppCheckTokenProvider {
                constructor(appName_, appCheckProvider) {
                    this.appName_ = appName_;
                    this.appCheckProvider = appCheckProvider;
                    this.appCheck = null === appCheckProvider || void 0 === appCheckProvider ? void 0 : appCheckProvider.getImmediate({
                        optional: true
                    });
                    if (!this.appCheck) null === appCheckProvider || void 0 === appCheckProvider ? void 0 : appCheckProvider.get().then((appCheck => this.appCheck = appCheck));
                }
                getToken(forceRefresh) {
                    if (!this.appCheck) return new Promise(((resolve, reject) => {
                        setTimeout((() => {
                            if (this.appCheck) this.getToken(forceRefresh).then(resolve, reject); else resolve(null);
                        }), 0);
                    }));
                    return this.appCheck.getToken(forceRefresh);
                }
                addTokenChangeListener(listener) {
                    var _a;
                    null === (_a = this.appCheckProvider) || void 0 === _a ? void 0 : _a.get().then((appCheck => appCheck.addTokenListener(listener)));
                }
                notifyForInvalidToken() {
                    warn(`Provided AppCheck credentials for the app named "${this.appName_}" ` + "are invalid. This usually indicates your app was not initialized correctly.");
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class FirebaseAuthTokenProvider {
                constructor(appName_, firebaseOptions_, authProvider_) {
                    this.appName_ = appName_;
                    this.firebaseOptions_ = firebaseOptions_;
                    this.authProvider_ = authProvider_;
                    this.auth_ = null;
                    this.auth_ = authProvider_.getImmediate({
                        optional: true
                    });
                    if (!this.auth_) authProvider_.onInit((auth => this.auth_ = auth));
                }
                getToken(forceRefresh) {
                    if (!this.auth_) return new Promise(((resolve, reject) => {
                        setTimeout((() => {
                            if (this.auth_) this.getToken(forceRefresh).then(resolve, reject); else resolve(null);
                        }), 0);
                    }));
                    return this.auth_.getToken(forceRefresh).catch((error => {
                        if (error && "auth/token-not-initialized" === error.code) {
                            log("Got auth/token-not-initialized error.  Treating as null token.");
                            return null;
                        } else return Promise.reject(error);
                    }));
                }
                addTokenChangeListener(listener) {
                    if (this.auth_) this.auth_.addAuthTokenListener(listener); else this.authProvider_.get().then((auth => auth.addAuthTokenListener(listener)));
                }
                removeTokenChangeListener(listener) {
                    this.authProvider_.get().then((auth => auth.removeAuthTokenListener(listener)));
                }
                notifyForInvalidToken() {
                    let errorMessage = 'Provided authentication credentials for the app named "' + this.appName_ + '" are invalid. This usually indicates your app was not ' + "initialized correctly. ";
                    if ("credential" in this.firebaseOptions_) errorMessage += 'Make sure the "credential" property provided to initializeApp() ' + 'is authorized to access the specified "databaseURL" and is from the correct ' + "project."; else if ("serviceAccount" in this.firebaseOptions_) errorMessage += 'Make sure the "serviceAccount" property provided to initializeApp() ' + 'is authorized to access the specified "databaseURL" and is from the correct ' + "project."; else errorMessage += 'Make sure the "apiKey" and "databaseURL" properties provided to ' + "initializeApp() match the values provided for your app at " + "https://console.firebase.google.com/.";
                    warn(errorMessage);
                }
            }
            class EmulatorTokenProvider {
                constructor(accessToken) {
                    this.accessToken = accessToken;
                }
                getToken(forceRefresh) {
                    return Promise.resolve({
                        accessToken: this.accessToken
                    });
                }
                addTokenChangeListener(listener) {
                    listener(this.accessToken);
                }
                removeTokenChangeListener(listener) {}
                notifyForInvalidToken() {}
            }
            EmulatorTokenProvider.OWNER = "owner";
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const PROTOCOL_VERSION = "5";
            const VERSION_PARAM = "v";
            const TRANSPORT_SESSION_PARAM = "s";
            const REFERER_PARAM = "r";
            const FORGE_REF = "f";
            const FORGE_DOMAIN_RE = /(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/;
            const LAST_SESSION_PARAM = "ls";
            const APPLICATION_ID_PARAM = "p";
            const APP_CHECK_TOKEN_PARAM = "ac";
            const WEBSOCKET = "websocket";
            const LONG_POLLING = "long_polling";
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class RepoInfo {
                constructor(host, secure, namespace, webSocketOnly, nodeAdmin = false, persistenceKey = "", includeNamespaceInQueryParams = false) {
                    this.secure = secure;
                    this.namespace = namespace;
                    this.webSocketOnly = webSocketOnly;
                    this.nodeAdmin = nodeAdmin;
                    this.persistenceKey = persistenceKey;
                    this.includeNamespaceInQueryParams = includeNamespaceInQueryParams;
                    this._host = host.toLowerCase();
                    this._domain = this._host.substr(this._host.indexOf(".") + 1);
                    this.internalHost = PersistentStorage.get("host:" + host) || this._host;
                }
                isCacheableHost() {
                    return "s-" === this.internalHost.substr(0, 2);
                }
                isCustomHost() {
                    return "firebaseio.com" !== this._domain && "firebaseio-demo.com" !== this._domain;
                }
                get host() {
                    return this._host;
                }
                set host(newHost) {
                    if (newHost !== this.internalHost) {
                        this.internalHost = newHost;
                        if (this.isCacheableHost()) PersistentStorage.set("host:" + this._host, this.internalHost);
                    }
                }
                toString() {
                    let str = this.toURLString();
                    if (this.persistenceKey) str += "<" + this.persistenceKey + ">";
                    return str;
                }
                toURLString() {
                    const protocol = this.secure ? "https://" : "http://";
                    const query = this.includeNamespaceInQueryParams ? `?ns=${this.namespace}` : "";
                    return `${protocol}${this.host}/${query}`;
                }
            }
            function repoInfoNeedsQueryParam(repoInfo) {
                return repoInfo.host !== repoInfo.internalHost || repoInfo.isCustomHost() || repoInfo.includeNamespaceInQueryParams;
            }
            function repoInfoConnectionURL(repoInfo, type, params) {
                (0, dist_index_esm2017.hu)("string" === typeof type, "typeof type must == string");
                (0, dist_index_esm2017.hu)("object" === typeof params, "typeof params must == object");
                let connURL;
                if (type === WEBSOCKET) connURL = (repoInfo.secure ? "wss://" : "ws://") + repoInfo.internalHost + "/.ws?"; else if (type === LONG_POLLING) connURL = (repoInfo.secure ? "https://" : "http://") + repoInfo.internalHost + "/.lp?"; else throw new Error("Unknown connection type: " + type);
                if (repoInfoNeedsQueryParam(repoInfo)) params["ns"] = repoInfo.namespace;
                const pairs = [];
                each(params, ((key, value) => {
                    pairs.push(key + "=" + value);
                }));
                return connURL + pairs.join("&");
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class StatsCollection {
                constructor() {
                    this.counters_ = {};
                }
                incrementCounter(name, amount = 1) {
                    if (!(0, dist_index_esm2017.r3)(this.counters_, name)) this.counters_[name] = 0;
                    this.counters_[name] += amount;
                }
                get() {
                    return (0, dist_index_esm2017.p$)(this.counters_);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const collections = {};
            const reporters = {};
            function statsManagerGetCollection(repoInfo) {
                const hashString = repoInfo.toString();
                if (!collections[hashString]) collections[hashString] = new StatsCollection;
                return collections[hashString];
            }
            function statsManagerGetOrCreateReporter(repoInfo, creatorFunction) {
                const hashString = repoInfo.toString();
                if (!reporters[hashString]) reporters[hashString] = creatorFunction();
                return reporters[hashString];
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class PacketReceiver {
                constructor(onMessage_) {
                    this.onMessage_ = onMessage_;
                    this.pendingResponses = [];
                    this.currentResponseNum = 0;
                    this.closeAfterResponse = -1;
                    this.onClose = null;
                }
                closeAfter(responseNum, callback) {
                    this.closeAfterResponse = responseNum;
                    this.onClose = callback;
                    if (this.closeAfterResponse < this.currentResponseNum) {
                        this.onClose();
                        this.onClose = null;
                    }
                }
                handleResponse(requestNum, data) {
                    this.pendingResponses[requestNum] = data;
                    while (this.pendingResponses[this.currentResponseNum]) {
                        const toProcess = this.pendingResponses[this.currentResponseNum];
                        delete this.pendingResponses[this.currentResponseNum];
                        for (let i = 0; i < toProcess.length; ++i) if (toProcess[i]) exceptionGuard((() => {
                            this.onMessage_(toProcess[i]);
                        }));
                        if (this.currentResponseNum === this.closeAfterResponse) {
                            if (this.onClose) {
                                this.onClose();
                                this.onClose = null;
                            }
                            break;
                        }
                        this.currentResponseNum++;
                    }
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const FIREBASE_LONGPOLL_START_PARAM = "start";
            const FIREBASE_LONGPOLL_CLOSE_COMMAND = "close";
            const FIREBASE_LONGPOLL_COMMAND_CB_NAME = "pLPCommand";
            const FIREBASE_LONGPOLL_DATA_CB_NAME = "pRTLPCB";
            const FIREBASE_LONGPOLL_ID_PARAM = "id";
            const FIREBASE_LONGPOLL_PW_PARAM = "pw";
            const FIREBASE_LONGPOLL_SERIAL_PARAM = "ser";
            const FIREBASE_LONGPOLL_CALLBACK_ID_PARAM = "cb";
            const FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM = "seg";
            const FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET = "ts";
            const FIREBASE_LONGPOLL_DATA_PARAM = "d";
            const FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM = "dframe";
            const MAX_URL_DATA_SIZE = 1870;
            const SEG_HEADER_SIZE = 30;
            const MAX_PAYLOAD_SIZE = MAX_URL_DATA_SIZE - SEG_HEADER_SIZE;
            const KEEPALIVE_REQUEST_INTERVAL = 25e3;
            const LP_CONNECT_TIMEOUT = 3e4;
            class BrowserPollConnection {
                constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
                    this.connId = connId;
                    this.repoInfo = repoInfo;
                    this.applicationId = applicationId;
                    this.appCheckToken = appCheckToken;
                    this.authToken = authToken;
                    this.transportSessionId = transportSessionId;
                    this.lastSessionId = lastSessionId;
                    this.bytesSent = 0;
                    this.bytesReceived = 0;
                    this.everConnected_ = false;
                    this.log_ = logWrapper(connId);
                    this.stats_ = statsManagerGetCollection(repoInfo);
                    this.urlFn = params => {
                        if (this.appCheckToken) params[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
                        return repoInfoConnectionURL(repoInfo, LONG_POLLING, params);
                    };
                }
                open(onMessage, onDisconnect) {
                    this.curSegmentNum = 0;
                    this.onDisconnect_ = onDisconnect;
                    this.myPacketOrderer = new PacketReceiver(onMessage);
                    this.isClosed_ = false;
                    this.connectTimeoutTimer_ = setTimeout((() => {
                        this.log_("Timed out trying to connect.");
                        this.onClosed_();
                        this.connectTimeoutTimer_ = null;
                    }), Math.floor(LP_CONNECT_TIMEOUT));
                    executeWhenDOMReady((() => {
                        if (this.isClosed_) return;
                        this.scriptTagHolder = new FirebaseIFrameScriptHolder(((...args) => {
                            const [command, arg1, arg2, arg3, arg4] = args;
                            this.incrementIncomingBytes_(args);
                            if (!this.scriptTagHolder) return;
                            if (this.connectTimeoutTimer_) {
                                clearTimeout(this.connectTimeoutTimer_);
                                this.connectTimeoutTimer_ = null;
                            }
                            this.everConnected_ = true;
                            if (command === FIREBASE_LONGPOLL_START_PARAM) {
                                this.id = arg1;
                                this.password = arg2;
                            } else if (command === FIREBASE_LONGPOLL_CLOSE_COMMAND) if (arg1) {
                                this.scriptTagHolder.sendNewPolls = false;
                                this.myPacketOrderer.closeAfter(arg1, (() => {
                                    this.onClosed_();
                                }));
                            } else this.onClosed_(); else throw new Error("Unrecognized command received: " + command);
                        }), ((...args) => {
                            const [pN, data] = args;
                            this.incrementIncomingBytes_(args);
                            this.myPacketOrderer.handleResponse(pN, data);
                        }), (() => {
                            this.onClosed_();
                        }), this.urlFn);
                        const urlParams = {};
                        urlParams[FIREBASE_LONGPOLL_START_PARAM] = "t";
                        urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = Math.floor(1e8 * Math.random());
                        if (this.scriptTagHolder.uniqueCallbackIdentifier) urlParams[FIREBASE_LONGPOLL_CALLBACK_ID_PARAM] = this.scriptTagHolder.uniqueCallbackIdentifier;
                        urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
                        if (this.transportSessionId) urlParams[TRANSPORT_SESSION_PARAM] = this.transportSessionId;
                        if (this.lastSessionId) urlParams[LAST_SESSION_PARAM] = this.lastSessionId;
                        if (this.applicationId) urlParams[APPLICATION_ID_PARAM] = this.applicationId;
                        if (this.appCheckToken) urlParams[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
                        if ("undefined" !== typeof location && location.hostname && FORGE_DOMAIN_RE.test(location.hostname)) urlParams[REFERER_PARAM] = FORGE_REF;
                        const connectURL = this.urlFn(urlParams);
                        this.log_("Connecting via long-poll to " + connectURL);
                        this.scriptTagHolder.addTag(connectURL, (() => {}));
                    }));
                }
                start() {
                    this.scriptTagHolder.startLongPoll(this.id, this.password);
                    this.addDisconnectPingFrame(this.id, this.password);
                }
                static forceAllow() {
                    BrowserPollConnection.forceAllow_ = true;
                }
                static forceDisallow() {
                    BrowserPollConnection.forceDisallow_ = true;
                }
                static isAvailable() {
                    if ((0, dist_index_esm2017.Yr)()) return false; else if (BrowserPollConnection.forceAllow_) return true; else return !BrowserPollConnection.forceDisallow_ && "undefined" !== typeof document && null != document.createElement && !isChromeExtensionContentScript() && !isWindowsStoreApp();
                }
                markConnectionHealthy() {}
                shutdown_() {
                    this.isClosed_ = true;
                    if (this.scriptTagHolder) {
                        this.scriptTagHolder.close();
                        this.scriptTagHolder = null;
                    }
                    if (this.myDisconnFrame) {
                        document.body.removeChild(this.myDisconnFrame);
                        this.myDisconnFrame = null;
                    }
                    if (this.connectTimeoutTimer_) {
                        clearTimeout(this.connectTimeoutTimer_);
                        this.connectTimeoutTimer_ = null;
                    }
                }
                onClosed_() {
                    if (!this.isClosed_) {
                        this.log_("Longpoll is closing itself");
                        this.shutdown_();
                        if (this.onDisconnect_) {
                            this.onDisconnect_(this.everConnected_);
                            this.onDisconnect_ = null;
                        }
                    }
                }
                close() {
                    if (!this.isClosed_) {
                        this.log_("Longpoll is being closed.");
                        this.shutdown_();
                    }
                }
                send(data) {
                    const dataStr = (0, dist_index_esm2017.Pz)(data);
                    this.bytesSent += dataStr.length;
                    this.stats_.incrementCounter("bytes_sent", dataStr.length);
                    const base64data = (0, dist_index_esm2017.h$)(dataStr);
                    const dataSegs = splitStringBySize(base64data, MAX_PAYLOAD_SIZE);
                    for (let i = 0; i < dataSegs.length; i++) {
                        this.scriptTagHolder.enqueueSegment(this.curSegmentNum, dataSegs.length, dataSegs[i]);
                        this.curSegmentNum++;
                    }
                }
                addDisconnectPingFrame(id, pw) {
                    if ((0, dist_index_esm2017.Yr)()) return;
                    this.myDisconnFrame = document.createElement("iframe");
                    const urlParams = {};
                    urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM] = "t";
                    urlParams[FIREBASE_LONGPOLL_ID_PARAM] = id;
                    urlParams[FIREBASE_LONGPOLL_PW_PARAM] = pw;
                    this.myDisconnFrame.src = this.urlFn(urlParams);
                    this.myDisconnFrame.style.display = "none";
                    document.body.appendChild(this.myDisconnFrame);
                }
                incrementIncomingBytes_(args) {
                    const bytesReceived = (0, dist_index_esm2017.Pz)(args).length;
                    this.bytesReceived += bytesReceived;
                    this.stats_.incrementCounter("bytes_received", bytesReceived);
                }
            }
            class FirebaseIFrameScriptHolder {
                constructor(commandCB, onMessageCB, onDisconnect, urlFn) {
                    this.onDisconnect = onDisconnect;
                    this.urlFn = urlFn;
                    this.outstandingRequests = new Set;
                    this.pendingSegs = [];
                    this.currentSerial = Math.floor(1e8 * Math.random());
                    this.sendNewPolls = true;
                    if (!(0, dist_index_esm2017.Yr)()) {
                        this.uniqueCallbackIdentifier = LUIDGenerator();
                        window[FIREBASE_LONGPOLL_COMMAND_CB_NAME + this.uniqueCallbackIdentifier] = commandCB;
                        window[FIREBASE_LONGPOLL_DATA_CB_NAME + this.uniqueCallbackIdentifier] = onMessageCB;
                        this.myIFrame = FirebaseIFrameScriptHolder.createIFrame_();
                        let script = "";
                        if (this.myIFrame.src && "javascript:" === this.myIFrame.src.substr(0, "javascript:".length)) {
                            const currentDomain = document.domain;
                            script = '<script>document.domain="' + currentDomain + '";<\/script>';
                        }
                        const iframeContents = "<html><body>" + script + "</body></html>";
                        try {
                            this.myIFrame.doc.open();
                            this.myIFrame.doc.write(iframeContents);
                            this.myIFrame.doc.close();
                        } catch (e) {
                            log("frame writing exception");
                            if (e.stack) log(e.stack);
                            log(e);
                        }
                    } else {
                        this.commandCB = commandCB;
                        this.onMessageCB = onMessageCB;
                    }
                }
                static createIFrame_() {
                    const iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    if (document.body) {
                        document.body.appendChild(iframe);
                        try {
                            const a = iframe.contentWindow.document;
                            if (!a) log("No IE domain setting required");
                        } catch (e) {
                            const domain = document.domain;
                            iframe.src = "javascript:void((function(){document.open();document.domain='" + domain + "';document.close();})())";
                        }
                    } else throw "Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
                    if (iframe.contentDocument) iframe.doc = iframe.contentDocument; else if (iframe.contentWindow) iframe.doc = iframe.contentWindow.document; else if (iframe.document) iframe.doc = iframe.document;
                    return iframe;
                }
                close() {
                    this.alive = false;
                    if (this.myIFrame) {
                        this.myIFrame.doc.body.innerHTML = "";
                        setTimeout((() => {
                            if (null !== this.myIFrame) {
                                document.body.removeChild(this.myIFrame);
                                this.myIFrame = null;
                            }
                        }), Math.floor(0));
                    }
                    const onDisconnect = this.onDisconnect;
                    if (onDisconnect) {
                        this.onDisconnect = null;
                        onDisconnect();
                    }
                }
                startLongPoll(id, pw) {
                    this.myID = id;
                    this.myPW = pw;
                    this.alive = true;
                    while (this.newRequest_()) ;
                }
                newRequest_() {
                    if (this.alive && this.sendNewPolls && this.outstandingRequests.size < (this.pendingSegs.length > 0 ? 2 : 1)) {
                        this.currentSerial++;
                        const urlParams = {};
                        urlParams[FIREBASE_LONGPOLL_ID_PARAM] = this.myID;
                        urlParams[FIREBASE_LONGPOLL_PW_PARAM] = this.myPW;
                        urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = this.currentSerial;
                        let theURL = this.urlFn(urlParams);
                        let curDataString = "";
                        let i = 0;
                        while (this.pendingSegs.length > 0) {
                            const nextSeg = this.pendingSegs[0];
                            if (nextSeg.d.length + SEG_HEADER_SIZE + curDataString.length <= MAX_URL_DATA_SIZE) {
                                const theSeg = this.pendingSegs.shift();
                                curDataString = curDataString + "&" + FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM + i + "=" + theSeg.seg + "&" + FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET + i + "=" + theSeg.ts + "&" + FIREBASE_LONGPOLL_DATA_PARAM + i + "=" + theSeg.d;
                                i++;
                            } else break;
                        }
                        theURL += curDataString;
                        this.addLongPollTag_(theURL, this.currentSerial);
                        return true;
                    } else return false;
                }
                enqueueSegment(segnum, totalsegs, data) {
                    this.pendingSegs.push({
                        seg: segnum,
                        ts: totalsegs,
                        d: data
                    });
                    if (this.alive) this.newRequest_();
                }
                addLongPollTag_(url, serial) {
                    this.outstandingRequests.add(serial);
                    const doNewRequest = () => {
                        this.outstandingRequests.delete(serial);
                        this.newRequest_();
                    };
                    const keepaliveTimeout = setTimeout(doNewRequest, Math.floor(KEEPALIVE_REQUEST_INTERVAL));
                    const readyStateCB = () => {
                        clearTimeout(keepaliveTimeout);
                        doNewRequest();
                    };
                    this.addTag(url, readyStateCB);
                }
                addTag(url, loadCB) {
                    if ((0, dist_index_esm2017.Yr)()) this.doNodeLongPoll(url, loadCB); else setTimeout((() => {
                        try {
                            if (!this.sendNewPolls) return;
                            const newScript = this.myIFrame.doc.createElement("script");
                            newScript.type = "text/javascript";
                            newScript.async = true;
                            newScript.src = url;
                            newScript.onload = newScript.onreadystatechange = function() {
                                const rstate = newScript.readyState;
                                if (!rstate || "loaded" === rstate || "complete" === rstate) {
                                    newScript.onload = newScript.onreadystatechange = null;
                                    if (newScript.parentNode) newScript.parentNode.removeChild(newScript);
                                    loadCB();
                                }
                            };
                            newScript.onerror = () => {
                                log("Long-poll script failed to load: " + url);
                                this.sendNewPolls = false;
                                this.close();
                            };
                            this.myIFrame.doc.body.appendChild(newScript);
                        } catch (e) {}
                    }), Math.floor(1));
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const WEBSOCKET_MAX_FRAME_SIZE = 16384;
            const WEBSOCKET_KEEPALIVE_INTERVAL = 45e3;
            let WebSocketImpl = null;
            if ("undefined" !== typeof MozWebSocket) WebSocketImpl = MozWebSocket; else if ("undefined" !== typeof WebSocket) WebSocketImpl = WebSocket;
            class WebSocketConnection {
                constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
                    this.connId = connId;
                    this.applicationId = applicationId;
                    this.appCheckToken = appCheckToken;
                    this.authToken = authToken;
                    this.keepaliveTimer = null;
                    this.frames = null;
                    this.totalFrames = 0;
                    this.bytesSent = 0;
                    this.bytesReceived = 0;
                    this.log_ = logWrapper(this.connId);
                    this.stats_ = statsManagerGetCollection(repoInfo);
                    this.connURL = WebSocketConnection.connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId);
                    this.nodeAdmin = repoInfo.nodeAdmin;
                }
                static connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId) {
                    const urlParams = {};
                    urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
                    if (!(0, dist_index_esm2017.Yr)() && "undefined" !== typeof location && location.hostname && FORGE_DOMAIN_RE.test(location.hostname)) urlParams[REFERER_PARAM] = FORGE_REF;
                    if (transportSessionId) urlParams[TRANSPORT_SESSION_PARAM] = transportSessionId;
                    if (lastSessionId) urlParams[LAST_SESSION_PARAM] = lastSessionId;
                    if (appCheckToken) urlParams[APP_CHECK_TOKEN_PARAM] = appCheckToken;
                    if (applicationId) urlParams[APPLICATION_ID_PARAM] = applicationId;
                    return repoInfoConnectionURL(repoInfo, WEBSOCKET, urlParams);
                }
                open(onMessage, onDisconnect) {
                    this.onDisconnect = onDisconnect;
                    this.onMessage = onMessage;
                    this.log_("Websocket connecting to " + this.connURL);
                    this.everConnected_ = false;
                    PersistentStorage.set("previous_websocket_failure", true);
                    try {
                        let options;
                        if ((0, dist_index_esm2017.Yr)()) {
                            const device = this.nodeAdmin ? "AdminNode" : "Node";
                            options = {
                                headers: {
                                    "User-Agent": `Firebase/${PROTOCOL_VERSION}/${SDK_VERSION}/${process.platform}/${device}`,
                                    "X-Firebase-GMPID": this.applicationId || ""
                                }
                            };
                            if (this.authToken) options.headers["Authorization"] = `Bearer ${this.authToken}`;
                            if (this.appCheckToken) options.headers["X-Firebase-AppCheck"] = this.appCheckToken;
                            const env = {
                                FIREBASE_API_KEY: "AIzaSyBtqZbY6PnEMXjuFAdT6yvOvb7UgHvM42k",
                                FIREBASE_AUTH_DOMAIN: "auth-examplec.firebaseapp.com",
                                FIREBASE_DATABASE_URL: "https://auth-examplec-default-rtdb.firebaseio.com",
                                FIREBASE_PROJECT_ID: "auth-examplec",
                                FIREBASE_STORAGE_BUCKET: "auth-examplec.appspot.com",
                                FIREBASE_MESSAGING_SENDER_ID: "724261682760",
                                FIREBASE_APP_ID: "1:724261682760:web:12652068e198094cdee27d"
                            };
                            const proxy = 0 === this.connURL.indexOf("wss://") ? env["HTTPS_PROXY"] || env["https_proxy"] : env["HTTP_PROXY"] || env["http_proxy"];
                            if (proxy) options["proxy"] = {
                                origin: proxy
                            };
                        }
                        this.mySock = new WebSocketImpl(this.connURL, [], options);
                    } catch (e) {
                        this.log_("Error instantiating WebSocket.");
                        const error = e.message || e.data;
                        if (error) this.log_(error);
                        this.onClosed_();
                        return;
                    }
                    this.mySock.onopen = () => {
                        this.log_("Websocket connected.");
                        this.everConnected_ = true;
                    };
                    this.mySock.onclose = () => {
                        this.log_("Websocket connection was disconnected.");
                        this.mySock = null;
                        this.onClosed_();
                    };
                    this.mySock.onmessage = m => {
                        this.handleIncomingFrame(m);
                    };
                    this.mySock.onerror = e => {
                        this.log_("WebSocket error.  Closing connection.");
                        const error = e.message || e.data;
                        if (error) this.log_(error);
                        this.onClosed_();
                    };
                }
                start() {}
                static forceDisallow() {
                    WebSocketConnection.forceDisallow_ = true;
                }
                static isAvailable() {
                    let isOldAndroid = false;
                    if ("undefined" !== typeof navigator && navigator.userAgent) {
                        const oldAndroidRegex = /Android ([0-9]{0,}\.[0-9]{0,})/;
                        const oldAndroidMatch = navigator.userAgent.match(oldAndroidRegex);
                        if (oldAndroidMatch && oldAndroidMatch.length > 1) if (parseFloat(oldAndroidMatch[1]) < 4.4) isOldAndroid = true;
                    }
                    return !isOldAndroid && null !== WebSocketImpl && !WebSocketConnection.forceDisallow_;
                }
                static previouslyFailed() {
                    return PersistentStorage.isInMemoryStorage || true === PersistentStorage.get("previous_websocket_failure");
                }
                markConnectionHealthy() {
                    PersistentStorage.remove("previous_websocket_failure");
                }
                appendFrame_(data) {
                    this.frames.push(data);
                    if (this.frames.length === this.totalFrames) {
                        const fullMess = this.frames.join("");
                        this.frames = null;
                        const jsonMess = (0, dist_index_esm2017.cI)(fullMess);
                        this.onMessage(jsonMess);
                    }
                }
                handleNewFrameCount_(frameCount) {
                    this.totalFrames = frameCount;
                    this.frames = [];
                }
                extractFrameCount_(data) {
                    (0, dist_index_esm2017.hu)(null === this.frames, "We already have a frame buffer");
                    if (data.length <= 6) {
                        const frameCount = Number(data);
                        if (!isNaN(frameCount)) {
                            this.handleNewFrameCount_(frameCount);
                            return null;
                        }
                    }
                    this.handleNewFrameCount_(1);
                    return data;
                }
                handleIncomingFrame(mess) {
                    if (null === this.mySock) return;
                    const data = mess["data"];
                    this.bytesReceived += data.length;
                    this.stats_.incrementCounter("bytes_received", data.length);
                    this.resetKeepAlive();
                    if (null !== this.frames) this.appendFrame_(data); else {
                        const remainingData = this.extractFrameCount_(data);
                        if (null !== remainingData) this.appendFrame_(remainingData);
                    }
                }
                send(data) {
                    this.resetKeepAlive();
                    const dataStr = (0, dist_index_esm2017.Pz)(data);
                    this.bytesSent += dataStr.length;
                    this.stats_.incrementCounter("bytes_sent", dataStr.length);
                    const dataSegs = splitStringBySize(dataStr, WEBSOCKET_MAX_FRAME_SIZE);
                    if (dataSegs.length > 1) this.sendString_(String(dataSegs.length));
                    for (let i = 0; i < dataSegs.length; i++) this.sendString_(dataSegs[i]);
                }
                shutdown_() {
                    this.isClosed_ = true;
                    if (this.keepaliveTimer) {
                        clearInterval(this.keepaliveTimer);
                        this.keepaliveTimer = null;
                    }
                    if (this.mySock) {
                        this.mySock.close();
                        this.mySock = null;
                    }
                }
                onClosed_() {
                    if (!this.isClosed_) {
                        this.log_("WebSocket is closing itself");
                        this.shutdown_();
                        if (this.onDisconnect) {
                            this.onDisconnect(this.everConnected_);
                            this.onDisconnect = null;
                        }
                    }
                }
                close() {
                    if (!this.isClosed_) {
                        this.log_("WebSocket is being closed");
                        this.shutdown_();
                    }
                }
                resetKeepAlive() {
                    clearInterval(this.keepaliveTimer);
                    this.keepaliveTimer = setInterval((() => {
                        if (this.mySock) this.sendString_("0");
                        this.resetKeepAlive();
                    }), Math.floor(WEBSOCKET_KEEPALIVE_INTERVAL));
                }
                sendString_(str) {
                    try {
                        this.mySock.send(str);
                    } catch (e) {
                        this.log_("Exception thrown from WebSocket.send():", e.message || e.data, "Closing connection.");
                        setTimeout(this.onClosed_.bind(this), 0);
                    }
                }
            }
            WebSocketConnection.responsesRequiredToBeHealthy = 2;
            WebSocketConnection.healthyTimeout = 3e4;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class TransportManager {
                constructor(repoInfo) {
                    this.initTransports_(repoInfo);
                }
                static get ALL_TRANSPORTS() {
                    return [ BrowserPollConnection, WebSocketConnection ];
                }
                static get IS_TRANSPORT_INITIALIZED() {
                    return this.globalTransportInitialized_;
                }
                initTransports_(repoInfo) {
                    const isWebSocketsAvailable = WebSocketConnection && WebSocketConnection["isAvailable"]();
                    let isSkipPollConnection = isWebSocketsAvailable && !WebSocketConnection.previouslyFailed();
                    if (repoInfo.webSocketOnly) {
                        if (!isWebSocketsAvailable) warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");
                        isSkipPollConnection = true;
                    }
                    if (isSkipPollConnection) this.transports_ = [ WebSocketConnection ]; else {
                        const transports = this.transports_ = [];
                        for (const transport of TransportManager.ALL_TRANSPORTS) if (transport && transport["isAvailable"]()) transports.push(transport);
                        TransportManager.globalTransportInitialized_ = true;
                    }
                }
                initialTransport() {
                    if (this.transports_.length > 0) return this.transports_[0]; else throw new Error("No transports available");
                }
                upgradeTransport() {
                    if (this.transports_.length > 1) return this.transports_[1]; else return null;
                }
            }
            TransportManager.globalTransportInitialized_ = false;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const UPGRADE_TIMEOUT = 6e4;
            const DELAY_BEFORE_SENDING_EXTRA_REQUESTS = 5e3;
            const BYTES_SENT_HEALTHY_OVERRIDE = 10 * 1024;
            const BYTES_RECEIVED_HEALTHY_OVERRIDE = 100 * 1024;
            const MESSAGE_TYPE = "t";
            const MESSAGE_DATA = "d";
            const CONTROL_SHUTDOWN = "s";
            const CONTROL_RESET = "r";
            const CONTROL_ERROR = "e";
            const CONTROL_PONG = "o";
            const SWITCH_ACK = "a";
            const END_TRANSMISSION = "n";
            const PING = "p";
            const SERVER_HELLO = "h";
            class Connection {
                constructor(id, repoInfo_, applicationId_, appCheckToken_, authToken_, onMessage_, onReady_, onDisconnect_, onKill_, lastSessionId) {
                    this.id = id;
                    this.repoInfo_ = repoInfo_;
                    this.applicationId_ = applicationId_;
                    this.appCheckToken_ = appCheckToken_;
                    this.authToken_ = authToken_;
                    this.onMessage_ = onMessage_;
                    this.onReady_ = onReady_;
                    this.onDisconnect_ = onDisconnect_;
                    this.onKill_ = onKill_;
                    this.lastSessionId = lastSessionId;
                    this.connectionCount = 0;
                    this.pendingDataMessages = [];
                    this.state_ = 0;
                    this.log_ = logWrapper("c:" + this.id + ":");
                    this.transportManager_ = new TransportManager(repoInfo_);
                    this.log_("Connection created");
                    this.start_();
                }
                start_() {
                    const conn = this.transportManager_.initialTransport();
                    this.conn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, null, this.lastSessionId);
                    this.primaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
                    const onMessageReceived = this.connReceiver_(this.conn_);
                    const onConnectionLost = this.disconnReceiver_(this.conn_);
                    this.tx_ = this.conn_;
                    this.rx_ = this.conn_;
                    this.secondaryConn_ = null;
                    this.isHealthy_ = false;
                    setTimeout((() => {
                        this.conn_ && this.conn_.open(onMessageReceived, onConnectionLost);
                    }), Math.floor(0));
                    const healthyTimeoutMS = conn["healthyTimeout"] || 0;
                    if (healthyTimeoutMS > 0) this.healthyTimeout_ = setTimeoutNonBlocking((() => {
                        this.healthyTimeout_ = null;
                        if (!this.isHealthy_) if (this.conn_ && this.conn_.bytesReceived > BYTES_RECEIVED_HEALTHY_OVERRIDE) {
                            this.log_("Connection exceeded healthy timeout but has received " + this.conn_.bytesReceived + " bytes.  Marking connection healthy.");
                            this.isHealthy_ = true;
                            this.conn_.markConnectionHealthy();
                        } else if (this.conn_ && this.conn_.bytesSent > BYTES_SENT_HEALTHY_OVERRIDE) this.log_("Connection exceeded healthy timeout but has sent " + this.conn_.bytesSent + " bytes.  Leaving connection alive."); else {
                            this.log_("Closing unhealthy connection after timeout.");
                            this.close();
                        }
                    }), Math.floor(healthyTimeoutMS));
                }
                nextTransportId_() {
                    return "c:" + this.id + ":" + this.connectionCount++;
                }
                disconnReceiver_(conn) {
                    return everConnected => {
                        if (conn === this.conn_) this.onConnectionLost_(everConnected); else if (conn === this.secondaryConn_) {
                            this.log_("Secondary connection lost.");
                            this.onSecondaryConnectionLost_();
                        } else this.log_("closing an old connection");
                    };
                }
                connReceiver_(conn) {
                    return message => {
                        if (2 !== this.state_) if (conn === this.rx_) this.onPrimaryMessageReceived_(message); else if (conn === this.secondaryConn_) this.onSecondaryMessageReceived_(message); else this.log_("message on old connection");
                    };
                }
                sendRequest(dataMsg) {
                    const msg = {
                        t: "d",
                        d: dataMsg
                    };
                    this.sendData_(msg);
                }
                tryCleanupConnection() {
                    if (this.tx_ === this.secondaryConn_ && this.rx_ === this.secondaryConn_) {
                        this.log_("cleaning up and promoting a connection: " + this.secondaryConn_.connId);
                        this.conn_ = this.secondaryConn_;
                        this.secondaryConn_ = null;
                    }
                }
                onSecondaryControl_(controlData) {
                    if (MESSAGE_TYPE in controlData) {
                        const cmd = controlData[MESSAGE_TYPE];
                        if (cmd === SWITCH_ACK) this.upgradeIfSecondaryHealthy_(); else if (cmd === CONTROL_RESET) {
                            this.log_("Got a reset on secondary, closing it");
                            this.secondaryConn_.close();
                            if (this.tx_ === this.secondaryConn_ || this.rx_ === this.secondaryConn_) this.close();
                        } else if (cmd === CONTROL_PONG) {
                            this.log_("got pong on secondary.");
                            this.secondaryResponsesRequired_--;
                            this.upgradeIfSecondaryHealthy_();
                        }
                    }
                }
                onSecondaryMessageReceived_(parsedData) {
                    const layer = requireKey("t", parsedData);
                    const data = requireKey("d", parsedData);
                    if ("c" === layer) this.onSecondaryControl_(data); else if ("d" === layer) this.pendingDataMessages.push(data); else throw new Error("Unknown protocol layer: " + layer);
                }
                upgradeIfSecondaryHealthy_() {
                    if (this.secondaryResponsesRequired_ <= 0) {
                        this.log_("Secondary connection is healthy.");
                        this.isHealthy_ = true;
                        this.secondaryConn_.markConnectionHealthy();
                        this.proceedWithUpgrade_();
                    } else {
                        this.log_("sending ping on secondary.");
                        this.secondaryConn_.send({
                            t: "c",
                            d: {
                                t: PING,
                                d: {}
                            }
                        });
                    }
                }
                proceedWithUpgrade_() {
                    this.secondaryConn_.start();
                    this.log_("sending client ack on secondary");
                    this.secondaryConn_.send({
                        t: "c",
                        d: {
                            t: SWITCH_ACK,
                            d: {}
                        }
                    });
                    this.log_("Ending transmission on primary");
                    this.conn_.send({
                        t: "c",
                        d: {
                            t: END_TRANSMISSION,
                            d: {}
                        }
                    });
                    this.tx_ = this.secondaryConn_;
                    this.tryCleanupConnection();
                }
                onPrimaryMessageReceived_(parsedData) {
                    const layer = requireKey("t", parsedData);
                    const data = requireKey("d", parsedData);
                    if ("c" === layer) this.onControl_(data); else if ("d" === layer) this.onDataMessage_(data);
                }
                onDataMessage_(message) {
                    this.onPrimaryResponse_();
                    this.onMessage_(message);
                }
                onPrimaryResponse_() {
                    if (!this.isHealthy_) {
                        this.primaryResponsesRequired_--;
                        if (this.primaryResponsesRequired_ <= 0) {
                            this.log_("Primary connection is healthy.");
                            this.isHealthy_ = true;
                            this.conn_.markConnectionHealthy();
                        }
                    }
                }
                onControl_(controlData) {
                    const cmd = requireKey(MESSAGE_TYPE, controlData);
                    if (MESSAGE_DATA in controlData) {
                        const payload = controlData[MESSAGE_DATA];
                        if (cmd === SERVER_HELLO) this.onHandshake_(payload); else if (cmd === END_TRANSMISSION) {
                            this.log_("recvd end transmission on primary");
                            this.rx_ = this.secondaryConn_;
                            for (let i = 0; i < this.pendingDataMessages.length; ++i) this.onDataMessage_(this.pendingDataMessages[i]);
                            this.pendingDataMessages = [];
                            this.tryCleanupConnection();
                        } else if (cmd === CONTROL_SHUTDOWN) this.onConnectionShutdown_(payload); else if (cmd === CONTROL_RESET) this.onReset_(payload); else if (cmd === CONTROL_ERROR) error("Server Error: " + payload); else if (cmd === CONTROL_PONG) {
                            this.log_("got pong on primary.");
                            this.onPrimaryResponse_();
                            this.sendPingOnPrimaryIfNecessary_();
                        } else error("Unknown control packet command: " + cmd);
                    }
                }
                onHandshake_(handshake) {
                    const timestamp = handshake.ts;
                    const version = handshake.v;
                    const host = handshake.h;
                    this.sessionId = handshake.s;
                    this.repoInfo_.host = host;
                    if (0 === this.state_) {
                        this.conn_.start();
                        this.onConnectionEstablished_(this.conn_, timestamp);
                        if (PROTOCOL_VERSION !== version) warn("Protocol version mismatch detected");
                        this.tryStartUpgrade_();
                    }
                }
                tryStartUpgrade_() {
                    const conn = this.transportManager_.upgradeTransport();
                    if (conn) this.startUpgrade_(conn);
                }
                startUpgrade_(conn) {
                    this.secondaryConn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, this.sessionId);
                    this.secondaryResponsesRequired_ = conn["responsesRequiredToBeHealthy"] || 0;
                    const onMessage = this.connReceiver_(this.secondaryConn_);
                    const onDisconnect = this.disconnReceiver_(this.secondaryConn_);
                    this.secondaryConn_.open(onMessage, onDisconnect);
                    setTimeoutNonBlocking((() => {
                        if (this.secondaryConn_) {
                            this.log_("Timed out trying to upgrade.");
                            this.secondaryConn_.close();
                        }
                    }), Math.floor(UPGRADE_TIMEOUT));
                }
                onReset_(host) {
                    this.log_("Reset packet received.  New host: " + host);
                    this.repoInfo_.host = host;
                    if (1 === this.state_) this.close(); else {
                        this.closeConnections_();
                        this.start_();
                    }
                }
                onConnectionEstablished_(conn, timestamp) {
                    this.log_("Realtime connection established.");
                    this.conn_ = conn;
                    this.state_ = 1;
                    if (this.onReady_) {
                        this.onReady_(timestamp, this.sessionId);
                        this.onReady_ = null;
                    }
                    if (0 === this.primaryResponsesRequired_) {
                        this.log_("Primary connection is healthy.");
                        this.isHealthy_ = true;
                    } else setTimeoutNonBlocking((() => {
                        this.sendPingOnPrimaryIfNecessary_();
                    }), Math.floor(DELAY_BEFORE_SENDING_EXTRA_REQUESTS));
                }
                sendPingOnPrimaryIfNecessary_() {
                    if (!this.isHealthy_ && 1 === this.state_) {
                        this.log_("sending ping on primary.");
                        this.sendData_({
                            t: "c",
                            d: {
                                t: PING,
                                d: {}
                            }
                        });
                    }
                }
                onSecondaryConnectionLost_() {
                    const conn = this.secondaryConn_;
                    this.secondaryConn_ = null;
                    if (this.tx_ === conn || this.rx_ === conn) this.close();
                }
                onConnectionLost_(everConnected) {
                    this.conn_ = null;
                    if (!everConnected && 0 === this.state_) {
                        this.log_("Realtime connection failed.");
                        if (this.repoInfo_.isCacheableHost()) {
                            PersistentStorage.remove("host:" + this.repoInfo_.host);
                            this.repoInfo_.internalHost = this.repoInfo_.host;
                        }
                    } else if (1 === this.state_) this.log_("Realtime connection lost.");
                    this.close();
                }
                onConnectionShutdown_(reason) {
                    this.log_("Connection shutdown command received. Shutting down...");
                    if (this.onKill_) {
                        this.onKill_(reason);
                        this.onKill_ = null;
                    }
                    this.onDisconnect_ = null;
                    this.close();
                }
                sendData_(data) {
                    if (1 !== this.state_) throw "Connection is not connected"; else this.tx_.send(data);
                }
                close() {
                    if (2 !== this.state_) {
                        this.log_("Closing realtime connection.");
                        this.state_ = 2;
                        this.closeConnections_();
                        if (this.onDisconnect_) {
                            this.onDisconnect_();
                            this.onDisconnect_ = null;
                        }
                    }
                }
                closeConnections_() {
                    this.log_("Shutting down all connections");
                    if (this.conn_) {
                        this.conn_.close();
                        this.conn_ = null;
                    }
                    if (this.secondaryConn_) {
                        this.secondaryConn_.close();
                        this.secondaryConn_ = null;
                    }
                    if (this.healthyTimeout_) {
                        clearTimeout(this.healthyTimeout_);
                        this.healthyTimeout_ = null;
                    }
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ServerActions {
                put(pathString, data, onComplete, hash) {}
                merge(pathString, data, onComplete, hash) {}
                refreshAuthToken(token) {}
                refreshAppCheckToken(token) {}
                onDisconnectPut(pathString, data, onComplete) {}
                onDisconnectMerge(pathString, data, onComplete) {}
                onDisconnectCancel(pathString, onComplete) {}
                reportStats(stats) {}
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class EventEmitter {
                constructor(allowedEvents_) {
                    this.allowedEvents_ = allowedEvents_;
                    this.listeners_ = {};
                    (0, dist_index_esm2017.hu)(Array.isArray(allowedEvents_) && allowedEvents_.length > 0, "Requires a non-empty array");
                }
                trigger(eventType, ...varArgs) {
                    if (Array.isArray(this.listeners_[eventType])) {
                        const listeners = [ ...this.listeners_[eventType] ];
                        for (let i = 0; i < listeners.length; i++) listeners[i].callback.apply(listeners[i].context, varArgs);
                    }
                }
                on(eventType, callback, context) {
                    this.validateEventType_(eventType);
                    this.listeners_[eventType] = this.listeners_[eventType] || [];
                    this.listeners_[eventType].push({
                        callback,
                        context
                    });
                    const eventData = this.getInitialEvent(eventType);
                    if (eventData) callback.apply(context, eventData);
                }
                off(eventType, callback, context) {
                    this.validateEventType_(eventType);
                    const listeners = this.listeners_[eventType] || [];
                    for (let i = 0; i < listeners.length; i++) if (listeners[i].callback === callback && (!context || context === listeners[i].context)) {
                        listeners.splice(i, 1);
                        return;
                    }
                }
                validateEventType_(eventType) {
                    (0, dist_index_esm2017.hu)(this.allowedEvents_.find((et => et === eventType)), "Unknown event: " + eventType);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class OnlineMonitor extends EventEmitter {
                constructor() {
                    super([ "online" ]);
                    this.online_ = true;
                    if ("undefined" !== typeof window && "undefined" !== typeof window.addEventListener && !(0, 
                    dist_index_esm2017.uI)()) {
                        window.addEventListener("online", (() => {
                            if (!this.online_) {
                                this.online_ = true;
                                this.trigger("online", true);
                            }
                        }), false);
                        window.addEventListener("offline", (() => {
                            if (this.online_) {
                                this.online_ = false;
                                this.trigger("online", false);
                            }
                        }), false);
                    }
                }
                static getInstance() {
                    return new OnlineMonitor;
                }
                getInitialEvent(eventType) {
                    (0, dist_index_esm2017.hu)("online" === eventType, "Unknown event type: " + eventType);
                    return [ this.online_ ];
                }
                currentlyOnline() {
                    return this.online_;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const MAX_PATH_DEPTH = 32;
            const MAX_PATH_LENGTH_BYTES = 768;
            class Path {
                constructor(pathOrString, pieceNum) {
                    if (void 0 === pieceNum) {
                        this.pieces_ = pathOrString.split("/");
                        let copyTo = 0;
                        for (let i = 0; i < this.pieces_.length; i++) if (this.pieces_[i].length > 0) {
                            this.pieces_[copyTo] = this.pieces_[i];
                            copyTo++;
                        }
                        this.pieces_.length = copyTo;
                        this.pieceNum_ = 0;
                    } else {
                        this.pieces_ = pathOrString;
                        this.pieceNum_ = pieceNum;
                    }
                }
                toString() {
                    let pathString = "";
                    for (let i = this.pieceNum_; i < this.pieces_.length; i++) if ("" !== this.pieces_[i]) pathString += "/" + this.pieces_[i];
                    return pathString || "/";
                }
            }
            function newEmptyPath() {
                return new Path("");
            }
            function pathGetFront(path) {
                if (path.pieceNum_ >= path.pieces_.length) return null;
                return path.pieces_[path.pieceNum_];
            }
            function pathGetLength(path) {
                return path.pieces_.length - path.pieceNum_;
            }
            function pathPopFront(path) {
                let pieceNum = path.pieceNum_;
                if (pieceNum < path.pieces_.length) pieceNum++;
                return new Path(path.pieces_, pieceNum);
            }
            function pathGetBack(path) {
                if (path.pieceNum_ < path.pieces_.length) return path.pieces_[path.pieces_.length - 1];
                return null;
            }
            function pathToUrlEncodedString(path) {
                let pathString = "";
                for (let i = path.pieceNum_; i < path.pieces_.length; i++) if ("" !== path.pieces_[i]) pathString += "/" + encodeURIComponent(String(path.pieces_[i]));
                return pathString || "/";
            }
            function pathSlice(path, begin = 0) {
                return path.pieces_.slice(path.pieceNum_ + begin);
            }
            function pathParent(path) {
                if (path.pieceNum_ >= path.pieces_.length) return null;
                const pieces = [];
                for (let i = path.pieceNum_; i < path.pieces_.length - 1; i++) pieces.push(path.pieces_[i]);
                return new Path(pieces, 0);
            }
            function pathChild(path, childPathObj) {
                const pieces = [];
                for (let i = path.pieceNum_; i < path.pieces_.length; i++) pieces.push(path.pieces_[i]);
                if (childPathObj instanceof Path) for (let i = childPathObj.pieceNum_; i < childPathObj.pieces_.length; i++) pieces.push(childPathObj.pieces_[i]); else {
                    const childPieces = childPathObj.split("/");
                    for (let i = 0; i < childPieces.length; i++) if (childPieces[i].length > 0) pieces.push(childPieces[i]);
                }
                return new Path(pieces, 0);
            }
            function pathIsEmpty(path) {
                return path.pieceNum_ >= path.pieces_.length;
            }
            function newRelativePath(outerPath, innerPath) {
                const outer = pathGetFront(outerPath), inner = pathGetFront(innerPath);
                if (null === outer) return innerPath; else if (outer === inner) return newRelativePath(pathPopFront(outerPath), pathPopFront(innerPath)); else throw new Error("INTERNAL ERROR: innerPath (" + innerPath + ") is not within " + "outerPath (" + outerPath + ")");
            }
            function pathCompare(left, right) {
                const leftKeys = pathSlice(left, 0);
                const rightKeys = pathSlice(right, 0);
                for (let i = 0; i < leftKeys.length && i < rightKeys.length; i++) {
                    const cmp = nameCompare(leftKeys[i], rightKeys[i]);
                    if (0 !== cmp) return cmp;
                }
                if (leftKeys.length === rightKeys.length) return 0;
                return leftKeys.length < rightKeys.length ? -1 : 1;
            }
            function pathEquals(path, other) {
                if (pathGetLength(path) !== pathGetLength(other)) return false;
                for (let i = path.pieceNum_, j = other.pieceNum_; i <= path.pieces_.length; i++, 
                j++) if (path.pieces_[i] !== other.pieces_[j]) return false;
                return true;
            }
            function pathContains(path, other) {
                let i = path.pieceNum_;
                let j = other.pieceNum_;
                if (pathGetLength(path) > pathGetLength(other)) return false;
                while (i < path.pieces_.length) {
                    if (path.pieces_[i] !== other.pieces_[j]) return false;
                    ++i;
                    ++j;
                }
                return true;
            }
            class ValidationPath {
                constructor(path, errorPrefix_) {
                    this.errorPrefix_ = errorPrefix_;
                    this.parts_ = pathSlice(path, 0);
                    this.byteLength_ = Math.max(1, this.parts_.length);
                    for (let i = 0; i < this.parts_.length; i++) this.byteLength_ += (0, dist_index_esm2017.ug)(this.parts_[i]);
                    validationPathCheckValid(this);
                }
            }
            function validationPathPush(validationPath, child) {
                if (validationPath.parts_.length > 0) validationPath.byteLength_ += 1;
                validationPath.parts_.push(child);
                validationPath.byteLength_ += (0, dist_index_esm2017.ug)(child);
                validationPathCheckValid(validationPath);
            }
            function validationPathPop(validationPath) {
                const last = validationPath.parts_.pop();
                validationPath.byteLength_ -= (0, dist_index_esm2017.ug)(last);
                if (validationPath.parts_.length > 0) validationPath.byteLength_ -= 1;
            }
            function validationPathCheckValid(validationPath) {
                if (validationPath.byteLength_ > MAX_PATH_LENGTH_BYTES) throw new Error(validationPath.errorPrefix_ + "has a key path longer than " + MAX_PATH_LENGTH_BYTES + " bytes (" + validationPath.byteLength_ + ").");
                if (validationPath.parts_.length > MAX_PATH_DEPTH) throw new Error(validationPath.errorPrefix_ + "path specified exceeds the maximum depth that can be written (" + MAX_PATH_DEPTH + ") or object contains a cycle " + validationPathToErrorString(validationPath));
            }
            function validationPathToErrorString(validationPath) {
                if (0 === validationPath.parts_.length) return "";
                return "in property '" + validationPath.parts_.join(".") + "'";
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class VisibilityMonitor extends EventEmitter {
                constructor() {
                    super([ "visible" ]);
                    let hidden;
                    let visibilityChange;
                    if ("undefined" !== typeof document && "undefined" !== typeof document.addEventListener) if ("undefined" !== typeof document["hidden"]) {
                        visibilityChange = "visibilitychange";
                        hidden = "hidden";
                    } else if ("undefined" !== typeof document["mozHidden"]) {
                        visibilityChange = "mozvisibilitychange";
                        hidden = "mozHidden";
                    } else if ("undefined" !== typeof document["msHidden"]) {
                        visibilityChange = "msvisibilitychange";
                        hidden = "msHidden";
                    } else if ("undefined" !== typeof document["webkitHidden"]) {
                        visibilityChange = "webkitvisibilitychange";
                        hidden = "webkitHidden";
                    }
                    this.visible_ = true;
                    if (visibilityChange) document.addEventListener(visibilityChange, (() => {
                        const visible = !document[hidden];
                        if (visible !== this.visible_) {
                            this.visible_ = visible;
                            this.trigger("visible", visible);
                        }
                    }), false);
                }
                static getInstance() {
                    return new VisibilityMonitor;
                }
                getInitialEvent(eventType) {
                    (0, dist_index_esm2017.hu)("visible" === eventType, "Unknown event type: " + eventType);
                    return [ this.visible_ ];
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const RECONNECT_MIN_DELAY = 1e3;
            const RECONNECT_MAX_DELAY_DEFAULT = 60 * 5 * 1e3;
            const RECONNECT_MAX_DELAY_FOR_ADMINS = 30 * 1e3;
            const RECONNECT_DELAY_MULTIPLIER = 1.3;
            const RECONNECT_DELAY_RESET_TIMEOUT = 3e4;
            const SERVER_KILL_INTERRUPT_REASON = "server_kill";
            const INVALID_TOKEN_THRESHOLD = 3;
            class PersistentConnection extends ServerActions {
                constructor(repoInfo_, applicationId_, onDataUpdate_, onConnectStatus_, onServerInfoUpdate_, authTokenProvider_, appCheckTokenProvider_, authOverride_) {
                    super();
                    this.repoInfo_ = repoInfo_;
                    this.applicationId_ = applicationId_;
                    this.onDataUpdate_ = onDataUpdate_;
                    this.onConnectStatus_ = onConnectStatus_;
                    this.onServerInfoUpdate_ = onServerInfoUpdate_;
                    this.authTokenProvider_ = authTokenProvider_;
                    this.appCheckTokenProvider_ = appCheckTokenProvider_;
                    this.authOverride_ = authOverride_;
                    this.id = PersistentConnection.nextPersistentConnectionId_++;
                    this.log_ = logWrapper("p:" + this.id + ":");
                    this.interruptReasons_ = {};
                    this.listens = new Map;
                    this.outstandingPuts_ = [];
                    this.outstandingGets_ = [];
                    this.outstandingPutCount_ = 0;
                    this.outstandingGetCount_ = 0;
                    this.onDisconnectRequestQueue_ = [];
                    this.connected_ = false;
                    this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                    this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_DEFAULT;
                    this.securityDebugCallback_ = null;
                    this.lastSessionId = null;
                    this.establishConnectionTimer_ = null;
                    this.visible_ = false;
                    this.requestCBHash_ = {};
                    this.requestNumber_ = 0;
                    this.realtime_ = null;
                    this.authToken_ = null;
                    this.appCheckToken_ = null;
                    this.forceTokenRefresh_ = false;
                    this.invalidAuthTokenCount_ = 0;
                    this.invalidAppCheckTokenCount_ = 0;
                    this.firstConnection_ = true;
                    this.lastConnectionAttemptTime_ = null;
                    this.lastConnectionEstablishedTime_ = null;
                    if (authOverride_ && !(0, dist_index_esm2017.Yr)()) throw new Error("Auth override specified in options, but not supported on non Node.js platforms");
                    VisibilityMonitor.getInstance().on("visible", this.onVisible_, this);
                    if (-1 === repoInfo_.host.indexOf("fblocal")) OnlineMonitor.getInstance().on("online", this.onOnline_, this);
                }
                sendRequest(action, body, onResponse) {
                    const curReqNum = ++this.requestNumber_;
                    const msg = {
                        r: curReqNum,
                        a: action,
                        b: body
                    };
                    this.log_((0, dist_index_esm2017.Pz)(msg));
                    (0, dist_index_esm2017.hu)(this.connected_, "sendRequest call when we're not connected not allowed.");
                    this.realtime_.sendRequest(msg);
                    if (onResponse) this.requestCBHash_[curReqNum] = onResponse;
                }
                get(query) {
                    this.initConnection_();
                    const deferred = new dist_index_esm2017.BH;
                    const request = {
                        p: query._path.toString(),
                        q: query._queryObject
                    };
                    const outstandingGet = {
                        action: "g",
                        request,
                        onComplete: message => {
                            const payload = message["d"];
                            if ("ok" === message["s"]) deferred.resolve(payload); else deferred.reject(payload);
                        }
                    };
                    this.outstandingGets_.push(outstandingGet);
                    this.outstandingGetCount_++;
                    const index = this.outstandingGets_.length - 1;
                    if (this.connected_) this.sendGet_(index);
                    return deferred.promise;
                }
                listen(query, currentHashFn, tag, onComplete) {
                    this.initConnection_();
                    const queryId = query._queryIdentifier;
                    const pathString = query._path.toString();
                    this.log_("Listen called for " + pathString + " " + queryId);
                    if (!this.listens.has(pathString)) this.listens.set(pathString, new Map);
                    (0, dist_index_esm2017.hu)(query._queryParams.isDefault() || !query._queryParams.loadsAllData(), "listen() called for non-default but complete query");
                    (0, dist_index_esm2017.hu)(!this.listens.get(pathString).has(queryId), `listen() called twice for same path/queryId.`);
                    const listenSpec = {
                        onComplete,
                        hashFn: currentHashFn,
                        query,
                        tag
                    };
                    this.listens.get(pathString).set(queryId, listenSpec);
                    if (this.connected_) this.sendListen_(listenSpec);
                }
                sendGet_(index) {
                    const get = this.outstandingGets_[index];
                    this.sendRequest("g", get.request, (message => {
                        delete this.outstandingGets_[index];
                        this.outstandingGetCount_--;
                        if (0 === this.outstandingGetCount_) this.outstandingGets_ = [];
                        if (get.onComplete) get.onComplete(message);
                    }));
                }
                sendListen_(listenSpec) {
                    const query = listenSpec.query;
                    const pathString = query._path.toString();
                    const queryId = query._queryIdentifier;
                    this.log_("Listen on " + pathString + " for " + queryId);
                    const req = {
                        p: pathString
                    };
                    const action = "q";
                    if (listenSpec.tag) {
                        req["q"] = query._queryObject;
                        req["t"] = listenSpec.tag;
                    }
                    req["h"] = listenSpec.hashFn();
                    this.sendRequest(action, req, (message => {
                        const payload = message["d"];
                        const status = message["s"];
                        PersistentConnection.warnOnListenWarnings_(payload, query);
                        const currentListenSpec = this.listens.get(pathString) && this.listens.get(pathString).get(queryId);
                        if (currentListenSpec === listenSpec) {
                            this.log_("listen response", message);
                            if ("ok" !== status) this.removeListen_(pathString, queryId);
                            if (listenSpec.onComplete) listenSpec.onComplete(status, payload);
                        }
                    }));
                }
                static warnOnListenWarnings_(payload, query) {
                    if (payload && "object" === typeof payload && (0, dist_index_esm2017.r3)(payload, "w")) {
                        const warnings = (0, dist_index_esm2017.DV)(payload, "w");
                        if (Array.isArray(warnings) && ~warnings.indexOf("no_index")) {
                            const indexSpec = '".indexOn": "' + query._queryParams.getIndex().toString() + '"';
                            const indexPath = query._path.toString();
                            warn(`Using an unspecified index. Your data will be downloaded and ` + `filtered on the client. Consider adding ${indexSpec} at ` + `${indexPath} to your security rules for better performance.`);
                        }
                    }
                }
                refreshAuthToken(token) {
                    this.authToken_ = token;
                    this.log_("Auth token refreshed");
                    if (this.authToken_) this.tryAuth(); else if (this.connected_) this.sendRequest("unauth", {}, (() => {}));
                    this.reduceReconnectDelayIfAdminCredential_(token);
                }
                reduceReconnectDelayIfAdminCredential_(credential) {
                    const isFirebaseSecret = credential && 40 === credential.length;
                    if (isFirebaseSecret || (0, dist_index_esm2017.GJ)(credential)) {
                        this.log_("Admin auth credential detected.  Reducing max reconnect time.");
                        this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
                    }
                }
                refreshAppCheckToken(token) {
                    this.appCheckToken_ = token;
                    this.log_("App check token refreshed");
                    if (this.appCheckToken_) this.tryAppCheck(); else if (this.connected_) this.sendRequest("unappeck", {}, (() => {}));
                }
                tryAuth() {
                    if (this.connected_ && this.authToken_) {
                        const token = this.authToken_;
                        const authMethod = (0, dist_index_esm2017.w9)(token) ? "auth" : "gauth";
                        const requestData = {
                            cred: token
                        };
                        if (null === this.authOverride_) requestData["noauth"] = true; else if ("object" === typeof this.authOverride_) requestData["authvar"] = this.authOverride_;
                        this.sendRequest(authMethod, requestData, (res => {
                            const status = res["s"];
                            const data = res["d"] || "error";
                            if (this.authToken_ === token) if ("ok" === status) this.invalidAuthTokenCount_ = 0; else this.onAuthRevoked_(status, data);
                        }));
                    }
                }
                tryAppCheck() {
                    if (this.connected_ && this.appCheckToken_) this.sendRequest("appcheck", {
                        token: this.appCheckToken_
                    }, (res => {
                        const status = res["s"];
                        const data = res["d"] || "error";
                        if ("ok" === status) this.invalidAppCheckTokenCount_ = 0; else this.onAppCheckRevoked_(status, data);
                    }));
                }
                unlisten(query, tag) {
                    const pathString = query._path.toString();
                    const queryId = query._queryIdentifier;
                    this.log_("Unlisten called for " + pathString + " " + queryId);
                    (0, dist_index_esm2017.hu)(query._queryParams.isDefault() || !query._queryParams.loadsAllData(), "unlisten() called for non-default but complete query");
                    const listen = this.removeListen_(pathString, queryId);
                    if (listen && this.connected_) this.sendUnlisten_(pathString, queryId, query._queryObject, tag);
                }
                sendUnlisten_(pathString, queryId, queryObj, tag) {
                    this.log_("Unlisten on " + pathString + " for " + queryId);
                    const req = {
                        p: pathString
                    };
                    const action = "n";
                    if (tag) {
                        req["q"] = queryObj;
                        req["t"] = tag;
                    }
                    this.sendRequest(action, req);
                }
                onDisconnectPut(pathString, data, onComplete) {
                    this.initConnection_();
                    if (this.connected_) this.sendOnDisconnect_("o", pathString, data, onComplete); else this.onDisconnectRequestQueue_.push({
                        pathString,
                        action: "o",
                        data,
                        onComplete
                    });
                }
                onDisconnectMerge(pathString, data, onComplete) {
                    this.initConnection_();
                    if (this.connected_) this.sendOnDisconnect_("om", pathString, data, onComplete); else this.onDisconnectRequestQueue_.push({
                        pathString,
                        action: "om",
                        data,
                        onComplete
                    });
                }
                onDisconnectCancel(pathString, onComplete) {
                    this.initConnection_();
                    if (this.connected_) this.sendOnDisconnect_("oc", pathString, null, onComplete); else this.onDisconnectRequestQueue_.push({
                        pathString,
                        action: "oc",
                        data: null,
                        onComplete
                    });
                }
                sendOnDisconnect_(action, pathString, data, onComplete) {
                    const request = {
                        p: pathString,
                        d: data
                    };
                    this.log_("onDisconnect " + action, request);
                    this.sendRequest(action, request, (response => {
                        if (onComplete) setTimeout((() => {
                            onComplete(response["s"], response["d"]);
                        }), Math.floor(0));
                    }));
                }
                put(pathString, data, onComplete, hash) {
                    this.putInternal("p", pathString, data, onComplete, hash);
                }
                merge(pathString, data, onComplete, hash) {
                    this.putInternal("m", pathString, data, onComplete, hash);
                }
                putInternal(action, pathString, data, onComplete, hash) {
                    this.initConnection_();
                    const request = {
                        p: pathString,
                        d: data
                    };
                    if (void 0 !== hash) request["h"] = hash;
                    this.outstandingPuts_.push({
                        action,
                        request,
                        onComplete
                    });
                    this.outstandingPutCount_++;
                    const index = this.outstandingPuts_.length - 1;
                    if (this.connected_) this.sendPut_(index); else this.log_("Buffering put: " + pathString);
                }
                sendPut_(index) {
                    const action = this.outstandingPuts_[index].action;
                    const request = this.outstandingPuts_[index].request;
                    const onComplete = this.outstandingPuts_[index].onComplete;
                    this.outstandingPuts_[index].queued = this.connected_;
                    this.sendRequest(action, request, (message => {
                        this.log_(action + " response", message);
                        delete this.outstandingPuts_[index];
                        this.outstandingPutCount_--;
                        if (0 === this.outstandingPutCount_) this.outstandingPuts_ = [];
                        if (onComplete) onComplete(message["s"], message["d"]);
                    }));
                }
                reportStats(stats) {
                    if (this.connected_) {
                        const request = {
                            c: stats
                        };
                        this.log_("reportStats", request);
                        this.sendRequest("s", request, (result => {
                            const status = result["s"];
                            if ("ok" !== status) {
                                const errorReason = result["d"];
                                this.log_("reportStats", "Error sending stats: " + errorReason);
                            }
                        }));
                    }
                }
                onDataMessage_(message) {
                    if ("r" in message) {
                        this.log_("from server: " + (0, dist_index_esm2017.Pz)(message));
                        const reqNum = message["r"];
                        const onResponse = this.requestCBHash_[reqNum];
                        if (onResponse) {
                            delete this.requestCBHash_[reqNum];
                            onResponse(message["b"]);
                        }
                    } else if ("error" in message) throw "A server-side error has occurred: " + message["error"]; else if ("a" in message) this.onDataPush_(message["a"], message["b"]);
                }
                onDataPush_(action, body) {
                    this.log_("handleServerMessage", action, body);
                    if ("d" === action) this.onDataUpdate_(body["p"], body["d"], false, body["t"]); else if ("m" === action) this.onDataUpdate_(body["p"], body["d"], true, body["t"]); else if ("c" === action) this.onListenRevoked_(body["p"], body["q"]); else if ("ac" === action) this.onAuthRevoked_(body["s"], body["d"]); else if ("apc" === action) this.onAppCheckRevoked_(body["s"], body["d"]); else if ("sd" === action) this.onSecurityDebugPacket_(body); else error("Unrecognized action received from server: " + (0, 
                    dist_index_esm2017.Pz)(action) + "\nAre you using the latest client?");
                }
                onReady_(timestamp, sessionId) {
                    this.log_("connection ready");
                    this.connected_ = true;
                    this.lastConnectionEstablishedTime_ = (new Date).getTime();
                    this.handleTimestamp_(timestamp);
                    this.lastSessionId = sessionId;
                    if (this.firstConnection_) this.sendConnectStats_();
                    this.restoreState_();
                    this.firstConnection_ = false;
                    this.onConnectStatus_(true);
                }
                scheduleConnect_(timeout) {
                    (0, dist_index_esm2017.hu)(!this.realtime_, "Scheduling a connect when we're already connected/ing?");
                    if (this.establishConnectionTimer_) clearTimeout(this.establishConnectionTimer_);
                    this.establishConnectionTimer_ = setTimeout((() => {
                        this.establishConnectionTimer_ = null;
                        this.establishConnection_();
                    }), Math.floor(timeout));
                }
                initConnection_() {
                    if (!this.realtime_ && this.firstConnection_) this.scheduleConnect_(0);
                }
                onVisible_(visible) {
                    if (visible && !this.visible_ && this.reconnectDelay_ === this.maxReconnectDelay_) {
                        this.log_("Window became visible.  Reducing delay.");
                        this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                        if (!this.realtime_) this.scheduleConnect_(0);
                    }
                    this.visible_ = visible;
                }
                onOnline_(online) {
                    if (online) {
                        this.log_("Browser went online.");
                        this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                        if (!this.realtime_) this.scheduleConnect_(0);
                    } else {
                        this.log_("Browser went offline.  Killing connection.");
                        if (this.realtime_) this.realtime_.close();
                    }
                }
                onRealtimeDisconnect_() {
                    this.log_("data client disconnected");
                    this.connected_ = false;
                    this.realtime_ = null;
                    this.cancelSentTransactions_();
                    this.requestCBHash_ = {};
                    if (this.shouldReconnect_()) {
                        if (!this.visible_) {
                            this.log_("Window isn't visible.  Delaying reconnect.");
                            this.reconnectDelay_ = this.maxReconnectDelay_;
                            this.lastConnectionAttemptTime_ = (new Date).getTime();
                        } else if (this.lastConnectionEstablishedTime_) {
                            const timeSinceLastConnectSucceeded = (new Date).getTime() - this.lastConnectionEstablishedTime_;
                            if (timeSinceLastConnectSucceeded > RECONNECT_DELAY_RESET_TIMEOUT) this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                            this.lastConnectionEstablishedTime_ = null;
                        }
                        const timeSinceLastConnectAttempt = (new Date).getTime() - this.lastConnectionAttemptTime_;
                        let reconnectDelay = Math.max(0, this.reconnectDelay_ - timeSinceLastConnectAttempt);
                        reconnectDelay = Math.random() * reconnectDelay;
                        this.log_("Trying to reconnect in " + reconnectDelay + "ms");
                        this.scheduleConnect_(reconnectDelay);
                        this.reconnectDelay_ = Math.min(this.maxReconnectDelay_, this.reconnectDelay_ * RECONNECT_DELAY_MULTIPLIER);
                    }
                    this.onConnectStatus_(false);
                }
                async establishConnection_() {
                    if (this.shouldReconnect_()) {
                        this.log_("Making a connection attempt");
                        this.lastConnectionAttemptTime_ = (new Date).getTime();
                        this.lastConnectionEstablishedTime_ = null;
                        const onDataMessage = this.onDataMessage_.bind(this);
                        const onReady = this.onReady_.bind(this);
                        const onDisconnect = this.onRealtimeDisconnect_.bind(this);
                        const connId = this.id + ":" + PersistentConnection.nextConnectionId_++;
                        const lastSessionId = this.lastSessionId;
                        let canceled = false;
                        let connection = null;
                        const closeFn = function() {
                            if (connection) connection.close(); else {
                                canceled = true;
                                onDisconnect();
                            }
                        };
                        const sendRequestFn = function(msg) {
                            (0, dist_index_esm2017.hu)(connection, "sendRequest call when we're not connected not allowed.");
                            connection.sendRequest(msg);
                        };
                        this.realtime_ = {
                            close: closeFn,
                            sendRequest: sendRequestFn
                        };
                        const forceRefresh = this.forceTokenRefresh_;
                        this.forceTokenRefresh_ = false;
                        try {
                            const [authToken, appCheckToken] = await Promise.all([ this.authTokenProvider_.getToken(forceRefresh), this.appCheckTokenProvider_.getToken(forceRefresh) ]);
                            if (!canceled) {
                                log("getToken() completed. Creating connection.");
                                this.authToken_ = authToken && authToken.accessToken;
                                this.appCheckToken_ = appCheckToken && appCheckToken.token;
                                connection = new Connection(connId, this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, onDataMessage, onReady, onDisconnect, (reason => {
                                    warn(reason + " (" + this.repoInfo_.toString() + ")");
                                    this.interrupt(SERVER_KILL_INTERRUPT_REASON);
                                }), lastSessionId);
                            } else log("getToken() completed but was canceled");
                        } catch (error) {
                            this.log_("Failed to get token: " + error);
                            if (!canceled) {
                                if (this.repoInfo_.nodeAdmin) warn(error);
                                closeFn();
                            }
                        }
                    }
                }
                interrupt(reason) {
                    log("Interrupting connection for reason: " + reason);
                    this.interruptReasons_[reason] = true;
                    if (this.realtime_) this.realtime_.close(); else {
                        if (this.establishConnectionTimer_) {
                            clearTimeout(this.establishConnectionTimer_);
                            this.establishConnectionTimer_ = null;
                        }
                        if (this.connected_) this.onRealtimeDisconnect_();
                    }
                }
                resume(reason) {
                    log("Resuming connection for reason: " + reason);
                    delete this.interruptReasons_[reason];
                    if ((0, dist_index_esm2017.xb)(this.interruptReasons_)) {
                        this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                        if (!this.realtime_) this.scheduleConnect_(0);
                    }
                }
                handleTimestamp_(timestamp) {
                    const delta = timestamp - (new Date).getTime();
                    this.onServerInfoUpdate_({
                        serverTimeOffset: delta
                    });
                }
                cancelSentTransactions_() {
                    for (let i = 0; i < this.outstandingPuts_.length; i++) {
                        const put = this.outstandingPuts_[i];
                        if (put && "h" in put.request && put.queued) {
                            if (put.onComplete) put.onComplete("disconnect");
                            delete this.outstandingPuts_[i];
                            this.outstandingPutCount_--;
                        }
                    }
                    if (0 === this.outstandingPutCount_) this.outstandingPuts_ = [];
                }
                onListenRevoked_(pathString, query) {
                    let queryId;
                    if (!query) queryId = "default"; else queryId = query.map((q => ObjectToUniqueKey(q))).join("$");
                    const listen = this.removeListen_(pathString, queryId);
                    if (listen && listen.onComplete) listen.onComplete("permission_denied");
                }
                removeListen_(pathString, queryId) {
                    const normalizedPathString = new Path(pathString).toString();
                    let listen;
                    if (this.listens.has(normalizedPathString)) {
                        const map = this.listens.get(normalizedPathString);
                        listen = map.get(queryId);
                        map.delete(queryId);
                        if (0 === map.size) this.listens.delete(normalizedPathString);
                    } else listen = void 0;
                    return listen;
                }
                onAuthRevoked_(statusCode, explanation) {
                    log("Auth token revoked: " + statusCode + "/" + explanation);
                    this.authToken_ = null;
                    this.forceTokenRefresh_ = true;
                    this.realtime_.close();
                    if ("invalid_token" === statusCode || "permission_denied" === statusCode) {
                        this.invalidAuthTokenCount_++;
                        if (this.invalidAuthTokenCount_ >= INVALID_TOKEN_THRESHOLD) {
                            this.reconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
                            this.authTokenProvider_.notifyForInvalidToken();
                        }
                    }
                }
                onAppCheckRevoked_(statusCode, explanation) {
                    log("App check token revoked: " + statusCode + "/" + explanation);
                    this.appCheckToken_ = null;
                    this.forceTokenRefresh_ = true;
                    if ("invalid_token" === statusCode || "permission_denied" === statusCode) {
                        this.invalidAppCheckTokenCount_++;
                        if (this.invalidAppCheckTokenCount_ >= INVALID_TOKEN_THRESHOLD) this.appCheckTokenProvider_.notifyForInvalidToken();
                    }
                }
                onSecurityDebugPacket_(body) {
                    if (this.securityDebugCallback_) this.securityDebugCallback_(body); else if ("msg" in body) console.log("FIREBASE: " + body["msg"].replace("\n", "\nFIREBASE: "));
                }
                restoreState_() {
                    this.tryAuth();
                    this.tryAppCheck();
                    for (const queries of this.listens.values()) for (const listenSpec of queries.values()) this.sendListen_(listenSpec);
                    for (let i = 0; i < this.outstandingPuts_.length; i++) if (this.outstandingPuts_[i]) this.sendPut_(i);
                    while (this.onDisconnectRequestQueue_.length) {
                        const request = this.onDisconnectRequestQueue_.shift();
                        this.sendOnDisconnect_(request.action, request.pathString, request.data, request.onComplete);
                    }
                    for (let i = 0; i < this.outstandingGets_.length; i++) if (this.outstandingGets_[i]) this.sendGet_(i);
                }
                sendConnectStats_() {
                    const stats = {};
                    let clientName = "js";
                    if ((0, dist_index_esm2017.Yr)()) if (this.repoInfo_.nodeAdmin) clientName = "admin_node"; else clientName = "node";
                    stats["sdk." + clientName + "." + SDK_VERSION.replace(/\./g, "-")] = 1;
                    if ((0, dist_index_esm2017.uI)()) stats["framework.cordova"] = 1; else if ((0, dist_index_esm2017.b$)()) stats["framework.reactnative"] = 1;
                    this.reportStats(stats);
                }
                shouldReconnect_() {
                    const online = OnlineMonitor.getInstance().currentlyOnline();
                    return (0, dist_index_esm2017.xb)(this.interruptReasons_) && online;
                }
            }
            PersistentConnection.nextPersistentConnectionId_ = 0;
            PersistentConnection.nextConnectionId_ = 0;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class NamedNode {
                constructor(name, node) {
                    this.name = name;
                    this.node = node;
                }
                static Wrap(name, node) {
                    return new NamedNode(name, node);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Index {
                getCompare() {
                    return this.compare.bind(this);
                }
                indexedValueChanged(oldNode, newNode) {
                    const oldWrapped = new NamedNode(MIN_NAME, oldNode);
                    const newWrapped = new NamedNode(MIN_NAME, newNode);
                    return 0 !== this.compare(oldWrapped, newWrapped);
                }
                minPost() {
                    return NamedNode.MIN;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let __EMPTY_NODE;
            class KeyIndex extends Index {
                static get __EMPTY_NODE() {
                    return __EMPTY_NODE;
                }
                static set __EMPTY_NODE(val) {
                    __EMPTY_NODE = val;
                }
                compare(a, b) {
                    return nameCompare(a.name, b.name);
                }
                isDefinedOn(node) {
                    throw (0, dist_index_esm2017.g5)("KeyIndex.isDefinedOn not expected to be called.");
                }
                indexedValueChanged(oldNode, newNode) {
                    return false;
                }
                minPost() {
                    return NamedNode.MIN;
                }
                maxPost() {
                    return new NamedNode(MAX_NAME, __EMPTY_NODE);
                }
                makePost(indexValue, name) {
                    (0, dist_index_esm2017.hu)("string" === typeof indexValue, "KeyIndex indexValue must always be a string.");
                    return new NamedNode(indexValue, __EMPTY_NODE);
                }
                toString() {
                    return ".key";
                }
            }
            const KEY_INDEX = new KeyIndex;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class SortedMapIterator {
                constructor(node, startKey, comparator, isReverse_, resultGenerator_ = null) {
                    this.isReverse_ = isReverse_;
                    this.resultGenerator_ = resultGenerator_;
                    this.nodeStack_ = [];
                    let cmp = 1;
                    while (!node.isEmpty()) {
                        node = node;
                        cmp = startKey ? comparator(node.key, startKey) : 1;
                        if (isReverse_) cmp *= -1;
                        if (cmp < 0) if (this.isReverse_) node = node.left; else node = node.right; else if (0 === cmp) {
                            this.nodeStack_.push(node);
                            break;
                        } else {
                            this.nodeStack_.push(node);
                            if (this.isReverse_) node = node.right; else node = node.left;
                        }
                    }
                }
                getNext() {
                    if (0 === this.nodeStack_.length) return null;
                    let node = this.nodeStack_.pop();
                    let result;
                    if (this.resultGenerator_) result = this.resultGenerator_(node.key, node.value); else result = {
                        key: node.key,
                        value: node.value
                    };
                    if (this.isReverse_) {
                        node = node.left;
                        while (!node.isEmpty()) {
                            this.nodeStack_.push(node);
                            node = node.right;
                        }
                    } else {
                        node = node.right;
                        while (!node.isEmpty()) {
                            this.nodeStack_.push(node);
                            node = node.left;
                        }
                    }
                    return result;
                }
                hasNext() {
                    return this.nodeStack_.length > 0;
                }
                peek() {
                    if (0 === this.nodeStack_.length) return null;
                    const node = this.nodeStack_[this.nodeStack_.length - 1];
                    if (this.resultGenerator_) return this.resultGenerator_(node.key, node.value); else return {
                        key: node.key,
                        value: node.value
                    };
                }
            }
            class LLRBNode {
                constructor(key, value, color, left, right) {
                    this.key = key;
                    this.value = value;
                    this.color = null != color ? color : LLRBNode.RED;
                    this.left = null != left ? left : SortedMap.EMPTY_NODE;
                    this.right = null != right ? right : SortedMap.EMPTY_NODE;
                }
                copy(key, value, color, left, right) {
                    return new LLRBNode(null != key ? key : this.key, null != value ? value : this.value, null != color ? color : this.color, null != left ? left : this.left, null != right ? right : this.right);
                }
                count() {
                    return this.left.count() + 1 + this.right.count();
                }
                isEmpty() {
                    return false;
                }
                inorderTraversal(action) {
                    return this.left.inorderTraversal(action) || !!action(this.key, this.value) || this.right.inorderTraversal(action);
                }
                reverseTraversal(action) {
                    return this.right.reverseTraversal(action) || action(this.key, this.value) || this.left.reverseTraversal(action);
                }
                min_() {
                    if (this.left.isEmpty()) return this; else return this.left.min_();
                }
                minKey() {
                    return this.min_().key;
                }
                maxKey() {
                    if (this.right.isEmpty()) return this.key; else return this.right.maxKey();
                }
                insert(key, value, comparator) {
                    let n = this;
                    const cmp = comparator(key, n.key);
                    if (cmp < 0) n = n.copy(null, null, null, n.left.insert(key, value, comparator), null); else if (0 === cmp) n = n.copy(null, value, null, null, null); else n = n.copy(null, null, null, null, n.right.insert(key, value, comparator));
                    return n.fixUp_();
                }
                removeMin_() {
                    if (this.left.isEmpty()) return SortedMap.EMPTY_NODE;
                    let n = this;
                    if (!n.left.isRed_() && !n.left.left.isRed_()) n = n.moveRedLeft_();
                    n = n.copy(null, null, null, n.left.removeMin_(), null);
                    return n.fixUp_();
                }
                remove(key, comparator) {
                    let n, smallest;
                    n = this;
                    if (comparator(key, n.key) < 0) {
                        if (!n.left.isEmpty() && !n.left.isRed_() && !n.left.left.isRed_()) n = n.moveRedLeft_();
                        n = n.copy(null, null, null, n.left.remove(key, comparator), null);
                    } else {
                        if (n.left.isRed_()) n = n.rotateRight_();
                        if (!n.right.isEmpty() && !n.right.isRed_() && !n.right.left.isRed_()) n = n.moveRedRight_();
                        if (0 === comparator(key, n.key)) if (n.right.isEmpty()) return SortedMap.EMPTY_NODE; else {
                            smallest = n.right.min_();
                            n = n.copy(smallest.key, smallest.value, null, null, n.right.removeMin_());
                        }
                        n = n.copy(null, null, null, null, n.right.remove(key, comparator));
                    }
                    return n.fixUp_();
                }
                isRed_() {
                    return this.color;
                }
                fixUp_() {
                    let n = this;
                    if (n.right.isRed_() && !n.left.isRed_()) n = n.rotateLeft_();
                    if (n.left.isRed_() && n.left.left.isRed_()) n = n.rotateRight_();
                    if (n.left.isRed_() && n.right.isRed_()) n = n.colorFlip_();
                    return n;
                }
                moveRedLeft_() {
                    let n = this.colorFlip_();
                    if (n.right.left.isRed_()) {
                        n = n.copy(null, null, null, null, n.right.rotateRight_());
                        n = n.rotateLeft_();
                        n = n.colorFlip_();
                    }
                    return n;
                }
                moveRedRight_() {
                    let n = this.colorFlip_();
                    if (n.left.left.isRed_()) {
                        n = n.rotateRight_();
                        n = n.colorFlip_();
                    }
                    return n;
                }
                rotateLeft_() {
                    const nl = this.copy(null, null, LLRBNode.RED, null, this.right.left);
                    return this.right.copy(null, null, this.color, nl, null);
                }
                rotateRight_() {
                    const nr = this.copy(null, null, LLRBNode.RED, this.left.right, null);
                    return this.left.copy(null, null, this.color, null, nr);
                }
                colorFlip_() {
                    const left = this.left.copy(null, null, !this.left.color, null, null);
                    const right = this.right.copy(null, null, !this.right.color, null, null);
                    return this.copy(null, null, !this.color, left, right);
                }
                checkMaxDepth_() {
                    const blackDepth = this.check_();
                    return Math.pow(2, blackDepth) <= this.count() + 1;
                }
                check_() {
                    if (this.isRed_() && this.left.isRed_()) throw new Error("Red node has red child(" + this.key + "," + this.value + ")");
                    if (this.right.isRed_()) throw new Error("Right child of (" + this.key + "," + this.value + ") is red");
                    const blackDepth = this.left.check_();
                    if (blackDepth !== this.right.check_()) throw new Error("Black depths differ"); else return blackDepth + (this.isRed_() ? 0 : 1);
                }
            }
            LLRBNode.RED = true;
            LLRBNode.BLACK = false;
            class LLRBEmptyNode {
                copy(key, value, color, left, right) {
                    return this;
                }
                insert(key, value, comparator) {
                    return new LLRBNode(key, value, null);
                }
                remove(key, comparator) {
                    return this;
                }
                count() {
                    return 0;
                }
                isEmpty() {
                    return true;
                }
                inorderTraversal(action) {
                    return false;
                }
                reverseTraversal(action) {
                    return false;
                }
                minKey() {
                    return null;
                }
                maxKey() {
                    return null;
                }
                check_() {
                    return 0;
                }
                isRed_() {
                    return false;
                }
            }
            class SortedMap {
                constructor(comparator_, root_ = SortedMap.EMPTY_NODE) {
                    this.comparator_ = comparator_;
                    this.root_ = root_;
                }
                insert(key, value) {
                    return new SortedMap(this.comparator_, this.root_.insert(key, value, this.comparator_).copy(null, null, LLRBNode.BLACK, null, null));
                }
                remove(key) {
                    return new SortedMap(this.comparator_, this.root_.remove(key, this.comparator_).copy(null, null, LLRBNode.BLACK, null, null));
                }
                get(key) {
                    let cmp;
                    let node = this.root_;
                    while (!node.isEmpty()) {
                        cmp = this.comparator_(key, node.key);
                        if (0 === cmp) return node.value; else if (cmp < 0) node = node.left; else if (cmp > 0) node = node.right;
                    }
                    return null;
                }
                getPredecessorKey(key) {
                    let cmp, node = this.root_, rightParent = null;
                    while (!node.isEmpty()) {
                        cmp = this.comparator_(key, node.key);
                        if (0 === cmp) if (!node.left.isEmpty()) {
                            node = node.left;
                            while (!node.right.isEmpty()) node = node.right;
                            return node.key;
                        } else if (rightParent) return rightParent.key; else return null; else if (cmp < 0) node = node.left; else if (cmp > 0) {
                            rightParent = node;
                            node = node.right;
                        }
                    }
                    throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?");
                }
                isEmpty() {
                    return this.root_.isEmpty();
                }
                count() {
                    return this.root_.count();
                }
                minKey() {
                    return this.root_.minKey();
                }
                maxKey() {
                    return this.root_.maxKey();
                }
                inorderTraversal(action) {
                    return this.root_.inorderTraversal(action);
                }
                reverseTraversal(action) {
                    return this.root_.reverseTraversal(action);
                }
                getIterator(resultGenerator) {
                    return new SortedMapIterator(this.root_, null, this.comparator_, false, resultGenerator);
                }
                getIteratorFrom(key, resultGenerator) {
                    return new SortedMapIterator(this.root_, key, this.comparator_, false, resultGenerator);
                }
                getReverseIteratorFrom(key, resultGenerator) {
                    return new SortedMapIterator(this.root_, key, this.comparator_, true, resultGenerator);
                }
                getReverseIterator(resultGenerator) {
                    return new SortedMapIterator(this.root_, null, this.comparator_, true, resultGenerator);
                }
            }
            SortedMap.EMPTY_NODE = new LLRBEmptyNode;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function NAME_ONLY_COMPARATOR(left, right) {
                return nameCompare(left.name, right.name);
            }
            function NAME_COMPARATOR(left, right) {
                return nameCompare(left, right);
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let MAX_NODE$2;
            function setMaxNode$1(val) {
                MAX_NODE$2 = val;
            }
            const priorityHashText = function(priority) {
                if ("number" === typeof priority) return "number:" + doubleToIEEE754String(priority); else return "string:" + priority;
            };
            const validatePriorityNode = function(priorityNode) {
                if (priorityNode.isLeafNode()) {
                    const val = priorityNode.val();
                    (0, dist_index_esm2017.hu)("string" === typeof val || "number" === typeof val || "object" === typeof val && (0, 
                    dist_index_esm2017.r3)(val, ".sv"), "Priority must be a string or number.");
                } else (0, dist_index_esm2017.hu)(priorityNode === MAX_NODE$2 || priorityNode.isEmpty(), "priority of unexpected type.");
                (0, dist_index_esm2017.hu)(priorityNode === MAX_NODE$2 || priorityNode.getPriority().isEmpty(), "Priority nodes can't have a priority of their own.");
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let __childrenNodeConstructor;
            class LeafNode {
                constructor(value_, priorityNode_ = LeafNode.__childrenNodeConstructor.EMPTY_NODE) {
                    this.value_ = value_;
                    this.priorityNode_ = priorityNode_;
                    this.lazyHash_ = null;
                    (0, dist_index_esm2017.hu)(void 0 !== this.value_ && null !== this.value_, "LeafNode shouldn't be created with null/undefined value.");
                    validatePriorityNode(this.priorityNode_);
                }
                static set __childrenNodeConstructor(val) {
                    __childrenNodeConstructor = val;
                }
                static get __childrenNodeConstructor() {
                    return __childrenNodeConstructor;
                }
                isLeafNode() {
                    return true;
                }
                getPriority() {
                    return this.priorityNode_;
                }
                updatePriority(newPriorityNode) {
                    return new LeafNode(this.value_, newPriorityNode);
                }
                getImmediateChild(childName) {
                    if (".priority" === childName) return this.priorityNode_; else return LeafNode.__childrenNodeConstructor.EMPTY_NODE;
                }
                getChild(path) {
                    if (pathIsEmpty(path)) return this; else if (".priority" === pathGetFront(path)) return this.priorityNode_; else return LeafNode.__childrenNodeConstructor.EMPTY_NODE;
                }
                hasChild() {
                    return false;
                }
                getPredecessorChildName(childName, childNode) {
                    return null;
                }
                updateImmediateChild(childName, newChildNode) {
                    if (".priority" === childName) return this.updatePriority(newChildNode); else if (newChildNode.isEmpty() && ".priority" !== childName) return this; else return LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(childName, newChildNode).updatePriority(this.priorityNode_);
                }
                updateChild(path, newChildNode) {
                    const front = pathGetFront(path);
                    if (null === front) return newChildNode; else if (newChildNode.isEmpty() && ".priority" !== front) return this; else {
                        (0, dist_index_esm2017.hu)(".priority" !== front || 1 === pathGetLength(path), ".priority must be the last token in a path");
                        return this.updateImmediateChild(front, LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(pathPopFront(path), newChildNode));
                    }
                }
                isEmpty() {
                    return false;
                }
                numChildren() {
                    return 0;
                }
                forEachChild(index, action) {
                    return false;
                }
                val(exportFormat) {
                    if (exportFormat && !this.getPriority().isEmpty()) return {
                        ".value": this.getValue(),
                        ".priority": this.getPriority().val()
                    }; else return this.getValue();
                }
                hash() {
                    if (null === this.lazyHash_) {
                        let toHash = "";
                        if (!this.priorityNode_.isEmpty()) toHash += "priority:" + priorityHashText(this.priorityNode_.val()) + ":";
                        const type = typeof this.value_;
                        toHash += type + ":";
                        if ("number" === type) toHash += doubleToIEEE754String(this.value_); else toHash += this.value_;
                        this.lazyHash_ = sha1(toHash);
                    }
                    return this.lazyHash_;
                }
                getValue() {
                    return this.value_;
                }
                compareTo(other) {
                    if (other === LeafNode.__childrenNodeConstructor.EMPTY_NODE) return 1; else if (other instanceof LeafNode.__childrenNodeConstructor) return -1; else {
                        (0, dist_index_esm2017.hu)(other.isLeafNode(), "Unknown node type");
                        return this.compareToLeafNode_(other);
                    }
                }
                compareToLeafNode_(otherLeaf) {
                    const otherLeafType = typeof otherLeaf.value_;
                    const thisLeafType = typeof this.value_;
                    const otherIndex = LeafNode.VALUE_TYPE_ORDER.indexOf(otherLeafType);
                    const thisIndex = LeafNode.VALUE_TYPE_ORDER.indexOf(thisLeafType);
                    (0, dist_index_esm2017.hu)(otherIndex >= 0, "Unknown leaf type: " + otherLeafType);
                    (0, dist_index_esm2017.hu)(thisIndex >= 0, "Unknown leaf type: " + thisLeafType);
                    if (otherIndex === thisIndex) if ("object" === thisLeafType) return 0; else if (this.value_ < otherLeaf.value_) return -1; else if (this.value_ === otherLeaf.value_) return 0; else return 1; else return thisIndex - otherIndex;
                }
                withIndex() {
                    return this;
                }
                isIndexed() {
                    return true;
                }
                equals(other) {
                    if (other === this) return true; else if (other.isLeafNode()) {
                        const otherLeaf = other;
                        return this.value_ === otherLeaf.value_ && this.priorityNode_.equals(otherLeaf.priorityNode_);
                    } else return false;
                }
            }
            LeafNode.VALUE_TYPE_ORDER = [ "object", "boolean", "number", "string" ];
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let nodeFromJSON$1;
            let MAX_NODE$1;
            function setNodeFromJSON(val) {
                nodeFromJSON$1 = val;
            }
            function setMaxNode(val) {
                MAX_NODE$1 = val;
            }
            class PriorityIndex extends Index {
                compare(a, b) {
                    const aPriority = a.node.getPriority();
                    const bPriority = b.node.getPriority();
                    const indexCmp = aPriority.compareTo(bPriority);
                    if (0 === indexCmp) return nameCompare(a.name, b.name); else return indexCmp;
                }
                isDefinedOn(node) {
                    return !node.getPriority().isEmpty();
                }
                indexedValueChanged(oldNode, newNode) {
                    return !oldNode.getPriority().equals(newNode.getPriority());
                }
                minPost() {
                    return NamedNode.MIN;
                }
                maxPost() {
                    return new NamedNode(MAX_NAME, new LeafNode("[PRIORITY-POST]", MAX_NODE$1));
                }
                makePost(indexValue, name) {
                    const priorityNode = nodeFromJSON$1(indexValue);
                    return new NamedNode(name, new LeafNode("[PRIORITY-POST]", priorityNode));
                }
                toString() {
                    return ".priority";
                }
            }
            const PRIORITY_INDEX = new PriorityIndex;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const LOG_2 = Math.log(2);
            class Base12Num {
                constructor(length) {
                    const logBase2 = num => parseInt(Math.log(num) / LOG_2, 10);
                    const bitMask = bits => parseInt(Array(bits + 1).join("1"), 2);
                    this.count = logBase2(length + 1);
                    this.current_ = this.count - 1;
                    const mask = bitMask(this.count);
                    this.bits_ = length + 1 & mask;
                }
                nextBitIsOne() {
                    const result = !(this.bits_ & 1 << this.current_);
                    this.current_--;
                    return result;
                }
            }
            const buildChildSet = function(childList, cmp, keyFn, mapSortFn) {
                childList.sort(cmp);
                const buildBalancedTree = function(low, high) {
                    const length = high - low;
                    let namedNode;
                    let key;
                    if (0 === length) return null; else if (1 === length) {
                        namedNode = childList[low];
                        key = keyFn ? keyFn(namedNode) : namedNode;
                        return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, null, null);
                    } else {
                        const middle = parseInt(length / 2, 10) + low;
                        const left = buildBalancedTree(low, middle);
                        const right = buildBalancedTree(middle + 1, high);
                        namedNode = childList[middle];
                        key = keyFn ? keyFn(namedNode) : namedNode;
                        return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, left, right);
                    }
                };
                const buildFrom12Array = function(base12) {
                    let node = null;
                    let root = null;
                    let index = childList.length;
                    const buildPennant = function(chunkSize, color) {
                        const low = index - chunkSize;
                        const high = index;
                        index -= chunkSize;
                        const childTree = buildBalancedTree(low + 1, high);
                        const namedNode = childList[low];
                        const key = keyFn ? keyFn(namedNode) : namedNode;
                        attachPennant(new LLRBNode(key, namedNode.node, color, null, childTree));
                    };
                    const attachPennant = function(pennant) {
                        if (node) {
                            node.left = pennant;
                            node = pennant;
                        } else {
                            root = pennant;
                            node = pennant;
                        }
                    };
                    for (let i = 0; i < base12.count; ++i) {
                        const isOne = base12.nextBitIsOne();
                        const chunkSize = Math.pow(2, base12.count - (i + 1));
                        if (isOne) buildPennant(chunkSize, LLRBNode.BLACK); else {
                            buildPennant(chunkSize, LLRBNode.BLACK);
                            buildPennant(chunkSize, LLRBNode.RED);
                        }
                    }
                    return root;
                };
                const base12 = new Base12Num(childList.length);
                const root = buildFrom12Array(base12);
                return new SortedMap(mapSortFn || cmp, root);
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let _defaultIndexMap;
            const fallbackObject = {};
            class IndexMap {
                constructor(indexes_, indexSet_) {
                    this.indexes_ = indexes_;
                    this.indexSet_ = indexSet_;
                }
                static get Default() {
                    (0, dist_index_esm2017.hu)(fallbackObject && PRIORITY_INDEX, "ChildrenNode.ts has not been loaded");
                    _defaultIndexMap = _defaultIndexMap || new IndexMap({
                        ".priority": fallbackObject
                    }, {
                        ".priority": PRIORITY_INDEX
                    });
                    return _defaultIndexMap;
                }
                get(indexKey) {
                    const sortedMap = (0, dist_index_esm2017.DV)(this.indexes_, indexKey);
                    if (!sortedMap) throw new Error("No index defined for " + indexKey);
                    if (sortedMap instanceof SortedMap) return sortedMap; else return null;
                }
                hasIndex(indexDefinition) {
                    return (0, dist_index_esm2017.r3)(this.indexSet_, indexDefinition.toString());
                }
                addIndex(indexDefinition, existingChildren) {
                    (0, dist_index_esm2017.hu)(indexDefinition !== KEY_INDEX, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
                    const childList = [];
                    let sawIndexedValue = false;
                    const iter = existingChildren.getIterator(NamedNode.Wrap);
                    let next = iter.getNext();
                    while (next) {
                        sawIndexedValue = sawIndexedValue || indexDefinition.isDefinedOn(next.node);
                        childList.push(next);
                        next = iter.getNext();
                    }
                    let newIndex;
                    if (sawIndexedValue) newIndex = buildChildSet(childList, indexDefinition.getCompare()); else newIndex = fallbackObject;
                    const indexName = indexDefinition.toString();
                    const newIndexSet = Object.assign({}, this.indexSet_);
                    newIndexSet[indexName] = indexDefinition;
                    const newIndexes = Object.assign({}, this.indexes_);
                    newIndexes[indexName] = newIndex;
                    return new IndexMap(newIndexes, newIndexSet);
                }
                addToIndexes(namedNode, existingChildren) {
                    const newIndexes = (0, dist_index_esm2017.UI)(this.indexes_, ((indexedChildren, indexName) => {
                        const index = (0, dist_index_esm2017.DV)(this.indexSet_, indexName);
                        (0, dist_index_esm2017.hu)(index, "Missing index implementation for " + indexName);
                        if (indexedChildren === fallbackObject) if (index.isDefinedOn(namedNode.node)) {
                            const childList = [];
                            const iter = existingChildren.getIterator(NamedNode.Wrap);
                            let next = iter.getNext();
                            while (next) {
                                if (next.name !== namedNode.name) childList.push(next);
                                next = iter.getNext();
                            }
                            childList.push(namedNode);
                            return buildChildSet(childList, index.getCompare());
                        } else return fallbackObject; else {
                            const existingSnap = existingChildren.get(namedNode.name);
                            let newChildren = indexedChildren;
                            if (existingSnap) newChildren = newChildren.remove(new NamedNode(namedNode.name, existingSnap));
                            return newChildren.insert(namedNode, namedNode.node);
                        }
                    }));
                    return new IndexMap(newIndexes, this.indexSet_);
                }
                removeFromIndexes(namedNode, existingChildren) {
                    const newIndexes = (0, dist_index_esm2017.UI)(this.indexes_, (indexedChildren => {
                        if (indexedChildren === fallbackObject) return indexedChildren; else {
                            const existingSnap = existingChildren.get(namedNode.name);
                            if (existingSnap) return indexedChildren.remove(new NamedNode(namedNode.name, existingSnap)); else return indexedChildren;
                        }
                    }));
                    return new IndexMap(newIndexes, this.indexSet_);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let EMPTY_NODE;
            class ChildrenNode {
                constructor(children_, priorityNode_, indexMap_) {
                    this.children_ = children_;
                    this.priorityNode_ = priorityNode_;
                    this.indexMap_ = indexMap_;
                    this.lazyHash_ = null;
                    if (this.priorityNode_) validatePriorityNode(this.priorityNode_);
                    if (this.children_.isEmpty()) (0, dist_index_esm2017.hu)(!this.priorityNode_ || this.priorityNode_.isEmpty(), "An empty node cannot have a priority");
                }
                static get EMPTY_NODE() {
                    return EMPTY_NODE || (EMPTY_NODE = new ChildrenNode(new SortedMap(NAME_COMPARATOR), null, IndexMap.Default));
                }
                isLeafNode() {
                    return false;
                }
                getPriority() {
                    return this.priorityNode_ || EMPTY_NODE;
                }
                updatePriority(newPriorityNode) {
                    if (this.children_.isEmpty()) return this; else return new ChildrenNode(this.children_, newPriorityNode, this.indexMap_);
                }
                getImmediateChild(childName) {
                    if (".priority" === childName) return this.getPriority(); else {
                        const child = this.children_.get(childName);
                        return null === child ? EMPTY_NODE : child;
                    }
                }
                getChild(path) {
                    const front = pathGetFront(path);
                    if (null === front) return this;
                    return this.getImmediateChild(front).getChild(pathPopFront(path));
                }
                hasChild(childName) {
                    return null !== this.children_.get(childName);
                }
                updateImmediateChild(childName, newChildNode) {
                    (0, dist_index_esm2017.hu)(newChildNode, "We should always be passing snapshot nodes");
                    if (".priority" === childName) return this.updatePriority(newChildNode); else {
                        const namedNode = new NamedNode(childName, newChildNode);
                        let newChildren, newIndexMap;
                        if (newChildNode.isEmpty()) {
                            newChildren = this.children_.remove(childName);
                            newIndexMap = this.indexMap_.removeFromIndexes(namedNode, this.children_);
                        } else {
                            newChildren = this.children_.insert(childName, newChildNode);
                            newIndexMap = this.indexMap_.addToIndexes(namedNode, this.children_);
                        }
                        const newPriority = newChildren.isEmpty() ? EMPTY_NODE : this.priorityNode_;
                        return new ChildrenNode(newChildren, newPriority, newIndexMap);
                    }
                }
                updateChild(path, newChildNode) {
                    const front = pathGetFront(path);
                    if (null === front) return newChildNode; else {
                        (0, dist_index_esm2017.hu)(".priority" !== pathGetFront(path) || 1 === pathGetLength(path), ".priority must be the last token in a path");
                        const newImmediateChild = this.getImmediateChild(front).updateChild(pathPopFront(path), newChildNode);
                        return this.updateImmediateChild(front, newImmediateChild);
                    }
                }
                isEmpty() {
                    return this.children_.isEmpty();
                }
                numChildren() {
                    return this.children_.count();
                }
                val(exportFormat) {
                    if (this.isEmpty()) return null;
                    const obj = {};
                    let numKeys = 0, maxKey = 0, allIntegerKeys = true;
                    this.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                        obj[key] = childNode.val(exportFormat);
                        numKeys++;
                        if (allIntegerKeys && ChildrenNode.INTEGER_REGEXP_.test(key)) maxKey = Math.max(maxKey, Number(key)); else allIntegerKeys = false;
                    }));
                    if (!exportFormat && allIntegerKeys && maxKey < 2 * numKeys) {
                        const array = [];
                        for (const key in obj) array[key] = obj[key];
                        return array;
                    } else {
                        if (exportFormat && !this.getPriority().isEmpty()) obj[".priority"] = this.getPriority().val();
                        return obj;
                    }
                }
                hash() {
                    if (null === this.lazyHash_) {
                        let toHash = "";
                        if (!this.getPriority().isEmpty()) toHash += "priority:" + priorityHashText(this.getPriority().val()) + ":";
                        this.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                            const childHash = childNode.hash();
                            if ("" !== childHash) toHash += ":" + key + ":" + childHash;
                        }));
                        this.lazyHash_ = "" === toHash ? "" : sha1(toHash);
                    }
                    return this.lazyHash_;
                }
                getPredecessorChildName(childName, childNode, index) {
                    const idx = this.resolveIndex_(index);
                    if (idx) {
                        const predecessor = idx.getPredecessorKey(new NamedNode(childName, childNode));
                        return predecessor ? predecessor.name : null;
                    } else return this.children_.getPredecessorKey(childName);
                }
                getFirstChildName(indexDefinition) {
                    const idx = this.resolveIndex_(indexDefinition);
                    if (idx) {
                        const minKey = idx.minKey();
                        return minKey && minKey.name;
                    } else return this.children_.minKey();
                }
                getFirstChild(indexDefinition) {
                    const minKey = this.getFirstChildName(indexDefinition);
                    if (minKey) return new NamedNode(minKey, this.children_.get(minKey)); else return null;
                }
                getLastChildName(indexDefinition) {
                    const idx = this.resolveIndex_(indexDefinition);
                    if (idx) {
                        const maxKey = idx.maxKey();
                        return maxKey && maxKey.name;
                    } else return this.children_.maxKey();
                }
                getLastChild(indexDefinition) {
                    const maxKey = this.getLastChildName(indexDefinition);
                    if (maxKey) return new NamedNode(maxKey, this.children_.get(maxKey)); else return null;
                }
                forEachChild(index, action) {
                    const idx = this.resolveIndex_(index);
                    if (idx) return idx.inorderTraversal((wrappedNode => action(wrappedNode.name, wrappedNode.node))); else return this.children_.inorderTraversal(action);
                }
                getIterator(indexDefinition) {
                    return this.getIteratorFrom(indexDefinition.minPost(), indexDefinition);
                }
                getIteratorFrom(startPost, indexDefinition) {
                    const idx = this.resolveIndex_(indexDefinition);
                    if (idx) return idx.getIteratorFrom(startPost, (key => key)); else {
                        const iterator = this.children_.getIteratorFrom(startPost.name, NamedNode.Wrap);
                        let next = iterator.peek();
                        while (null != next && indexDefinition.compare(next, startPost) < 0) {
                            iterator.getNext();
                            next = iterator.peek();
                        }
                        return iterator;
                    }
                }
                getReverseIterator(indexDefinition) {
                    return this.getReverseIteratorFrom(indexDefinition.maxPost(), indexDefinition);
                }
                getReverseIteratorFrom(endPost, indexDefinition) {
                    const idx = this.resolveIndex_(indexDefinition);
                    if (idx) return idx.getReverseIteratorFrom(endPost, (key => key)); else {
                        const iterator = this.children_.getReverseIteratorFrom(endPost.name, NamedNode.Wrap);
                        let next = iterator.peek();
                        while (null != next && indexDefinition.compare(next, endPost) > 0) {
                            iterator.getNext();
                            next = iterator.peek();
                        }
                        return iterator;
                    }
                }
                compareTo(other) {
                    if (this.isEmpty()) if (other.isEmpty()) return 0; else return -1; else if (other.isLeafNode() || other.isEmpty()) return 1; else if (other === MAX_NODE) return -1; else return 0;
                }
                withIndex(indexDefinition) {
                    if (indexDefinition === KEY_INDEX || this.indexMap_.hasIndex(indexDefinition)) return this; else {
                        const newIndexMap = this.indexMap_.addIndex(indexDefinition, this.children_);
                        return new ChildrenNode(this.children_, this.priorityNode_, newIndexMap);
                    }
                }
                isIndexed(index) {
                    return index === KEY_INDEX || this.indexMap_.hasIndex(index);
                }
                equals(other) {
                    if (other === this) return true; else if (other.isLeafNode()) return false; else {
                        const otherChildrenNode = other;
                        if (!this.getPriority().equals(otherChildrenNode.getPriority())) return false; else if (this.children_.count() === otherChildrenNode.children_.count()) {
                            const thisIter = this.getIterator(PRIORITY_INDEX);
                            const otherIter = otherChildrenNode.getIterator(PRIORITY_INDEX);
                            let thisCurrent = thisIter.getNext();
                            let otherCurrent = otherIter.getNext();
                            while (thisCurrent && otherCurrent) {
                                if (thisCurrent.name !== otherCurrent.name || !thisCurrent.node.equals(otherCurrent.node)) return false;
                                thisCurrent = thisIter.getNext();
                                otherCurrent = otherIter.getNext();
                            }
                            return null === thisCurrent && null === otherCurrent;
                        } else return false;
                    }
                }
                resolveIndex_(indexDefinition) {
                    if (indexDefinition === KEY_INDEX) return null; else return this.indexMap_.get(indexDefinition.toString());
                }
            }
            ChildrenNode.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/;
            class MaxNode extends ChildrenNode {
                constructor() {
                    super(new SortedMap(NAME_COMPARATOR), ChildrenNode.EMPTY_NODE, IndexMap.Default);
                }
                compareTo(other) {
                    if (other === this) return 0; else return 1;
                }
                equals(other) {
                    return other === this;
                }
                getPriority() {
                    return this;
                }
                getImmediateChild(childName) {
                    return ChildrenNode.EMPTY_NODE;
                }
                isEmpty() {
                    return false;
                }
            }
            const MAX_NODE = new MaxNode;
            Object.defineProperties(NamedNode, {
                MIN: {
                    value: new NamedNode(MIN_NAME, ChildrenNode.EMPTY_NODE)
                },
                MAX: {
                    value: new NamedNode(MAX_NAME, MAX_NODE)
                }
            });
            KeyIndex.__EMPTY_NODE = ChildrenNode.EMPTY_NODE;
            LeafNode.__childrenNodeConstructor = ChildrenNode;
            setMaxNode$1(MAX_NODE);
            setMaxNode(MAX_NODE);
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const USE_HINZE = true;
            function nodeFromJSON(json, priority = null) {
                if (null === json) return ChildrenNode.EMPTY_NODE;
                if ("object" === typeof json && ".priority" in json) priority = json[".priority"];
                (0, dist_index_esm2017.hu)(null === priority || "string" === typeof priority || "number" === typeof priority || "object" === typeof priority && ".sv" in priority, "Invalid priority type found: " + typeof priority);
                if ("object" === typeof json && ".value" in json && null !== json[".value"]) json = json[".value"];
                if ("object" !== typeof json || ".sv" in json) {
                    const jsonLeaf = json;
                    return new LeafNode(jsonLeaf, nodeFromJSON(priority));
                }
                if (!(json instanceof Array) && USE_HINZE) {
                    const children = [];
                    let childrenHavePriority = false;
                    const hinzeJsonObj = json;
                    each(hinzeJsonObj, ((key, child) => {
                        if ("." !== key.substring(0, 1)) {
                            const childNode = nodeFromJSON(child);
                            if (!childNode.isEmpty()) {
                                childrenHavePriority = childrenHavePriority || !childNode.getPriority().isEmpty();
                                children.push(new NamedNode(key, childNode));
                            }
                        }
                    }));
                    if (0 === children.length) return ChildrenNode.EMPTY_NODE;
                    const childSet = buildChildSet(children, NAME_ONLY_COMPARATOR, (namedNode => namedNode.name), NAME_COMPARATOR);
                    if (childrenHavePriority) {
                        const sortedChildSet = buildChildSet(children, PRIORITY_INDEX.getCompare());
                        return new ChildrenNode(childSet, nodeFromJSON(priority), new IndexMap({
                            ".priority": sortedChildSet
                        }, {
                            ".priority": PRIORITY_INDEX
                        }));
                    } else return new ChildrenNode(childSet, nodeFromJSON(priority), IndexMap.Default);
                } else {
                    let node = ChildrenNode.EMPTY_NODE;
                    each(json, ((key, childData) => {
                        if ((0, dist_index_esm2017.r3)(json, key)) if ("." !== key.substring(0, 1)) {
                            const childNode = nodeFromJSON(childData);
                            if (childNode.isLeafNode() || !childNode.isEmpty()) node = node.updateImmediateChild(key, childNode);
                        }
                    }));
                    return node.updatePriority(nodeFromJSON(priority));
                }
            }
            setNodeFromJSON(nodeFromJSON);
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class PathIndex extends Index {
                constructor(indexPath_) {
                    super();
                    this.indexPath_ = indexPath_;
                    (0, dist_index_esm2017.hu)(!pathIsEmpty(indexPath_) && ".priority" !== pathGetFront(indexPath_), "Can't create PathIndex with empty path or .priority key");
                }
                extractChild(snap) {
                    return snap.getChild(this.indexPath_);
                }
                isDefinedOn(node) {
                    return !node.getChild(this.indexPath_).isEmpty();
                }
                compare(a, b) {
                    const aChild = this.extractChild(a.node);
                    const bChild = this.extractChild(b.node);
                    const indexCmp = aChild.compareTo(bChild);
                    if (0 === indexCmp) return nameCompare(a.name, b.name); else return indexCmp;
                }
                makePost(indexValue, name) {
                    const valueNode = nodeFromJSON(indexValue);
                    const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, valueNode);
                    return new NamedNode(name, node);
                }
                maxPost() {
                    const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, MAX_NODE);
                    return new NamedNode(MAX_NAME, node);
                }
                toString() {
                    return pathSlice(this.indexPath_, 0).join("/");
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ValueIndex extends Index {
                compare(a, b) {
                    const indexCmp = a.node.compareTo(b.node);
                    if (0 === indexCmp) return nameCompare(a.name, b.name); else return indexCmp;
                }
                isDefinedOn(node) {
                    return true;
                }
                indexedValueChanged(oldNode, newNode) {
                    return !oldNode.equals(newNode);
                }
                minPost() {
                    return NamedNode.MIN;
                }
                maxPost() {
                    return NamedNode.MAX;
                }
                makePost(indexValue, name) {
                    const valueNode = nodeFromJSON(indexValue);
                    return new NamedNode(name, valueNode);
                }
                toString() {
                    return ".value";
                }
            }
            const VALUE_INDEX = new ValueIndex;
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
            (function() {
                let lastPushTime = 0;
                const lastRandChars = [];
            })();
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function changeValue(snapshotNode) {
                return {
                    type: "value",
                    snapshotNode
                };
            }
            function changeChildAdded(childName, snapshotNode) {
                return {
                    type: "child_added",
                    snapshotNode,
                    childName
                };
            }
            function changeChildRemoved(childName, snapshotNode) {
                return {
                    type: "child_removed",
                    snapshotNode,
                    childName
                };
            }
            function changeChildChanged(childName, snapshotNode, oldSnap) {
                return {
                    type: "child_changed",
                    snapshotNode,
                    childName,
                    oldSnap
                };
            }
            function changeChildMoved(childName, snapshotNode) {
                return {
                    type: "child_moved",
                    snapshotNode,
                    childName
                };
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class IndexedFilter {
                constructor(index_) {
                    this.index_ = index_;
                }
                updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
                    (0, dist_index_esm2017.hu)(snap.isIndexed(this.index_), "A node must be indexed if only a child is updated");
                    const oldChild = snap.getImmediateChild(key);
                    if (oldChild.getChild(affectedPath).equals(newChild.getChild(affectedPath))) if (oldChild.isEmpty() === newChild.isEmpty()) return snap;
                    if (null != optChangeAccumulator) if (newChild.isEmpty()) if (snap.hasChild(key)) optChangeAccumulator.trackChildChange(changeChildRemoved(key, oldChild)); else (0, 
                    dist_index_esm2017.hu)(snap.isLeafNode(), "A child remove without an old child only makes sense on a leaf node"); else if (oldChild.isEmpty()) optChangeAccumulator.trackChildChange(changeChildAdded(key, newChild)); else optChangeAccumulator.trackChildChange(changeChildChanged(key, newChild, oldChild));
                    if (snap.isLeafNode() && newChild.isEmpty()) return snap; else return snap.updateImmediateChild(key, newChild).withIndex(this.index_);
                }
                updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
                    if (null != optChangeAccumulator) {
                        if (!oldSnap.isLeafNode()) oldSnap.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                            if (!newSnap.hasChild(key)) optChangeAccumulator.trackChildChange(changeChildRemoved(key, childNode));
                        }));
                        if (!newSnap.isLeafNode()) newSnap.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                            if (oldSnap.hasChild(key)) {
                                const oldChild = oldSnap.getImmediateChild(key);
                                if (!oldChild.equals(childNode)) optChangeAccumulator.trackChildChange(changeChildChanged(key, childNode, oldChild));
                            } else optChangeAccumulator.trackChildChange(changeChildAdded(key, childNode));
                        }));
                    }
                    return newSnap.withIndex(this.index_);
                }
                updatePriority(oldSnap, newPriority) {
                    if (oldSnap.isEmpty()) return ChildrenNode.EMPTY_NODE; else return oldSnap.updatePriority(newPriority);
                }
                filtersNodes() {
                    return false;
                }
                getIndexedFilter() {
                    return this;
                }
                getIndex() {
                    return this.index_;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class RangedFilter {
                constructor(params) {
                    this.indexedFilter_ = new IndexedFilter(params.getIndex());
                    this.index_ = params.getIndex();
                    this.startPost_ = RangedFilter.getStartPost_(params);
                    this.endPost_ = RangedFilter.getEndPost_(params);
                }
                getStartPost() {
                    return this.startPost_;
                }
                getEndPost() {
                    return this.endPost_;
                }
                matches(node) {
                    return this.index_.compare(this.getStartPost(), node) <= 0 && this.index_.compare(node, this.getEndPost()) <= 0;
                }
                updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
                    if (!this.matches(new NamedNode(key, newChild))) newChild = ChildrenNode.EMPTY_NODE;
                    return this.indexedFilter_.updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator);
                }
                updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
                    if (newSnap.isLeafNode()) newSnap = ChildrenNode.EMPTY_NODE;
                    let filtered = newSnap.withIndex(this.index_);
                    filtered = filtered.updatePriority(ChildrenNode.EMPTY_NODE);
                    const self = this;
                    newSnap.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                        if (!self.matches(new NamedNode(key, childNode))) filtered = filtered.updateImmediateChild(key, ChildrenNode.EMPTY_NODE);
                    }));
                    return this.indexedFilter_.updateFullNode(oldSnap, filtered, optChangeAccumulator);
                }
                updatePriority(oldSnap, newPriority) {
                    return oldSnap;
                }
                filtersNodes() {
                    return true;
                }
                getIndexedFilter() {
                    return this.indexedFilter_;
                }
                getIndex() {
                    return this.index_;
                }
                static getStartPost_(params) {
                    if (params.hasStart()) {
                        const startName = params.getIndexStartName();
                        return params.getIndex().makePost(params.getIndexStartValue(), startName);
                    } else return params.getIndex().minPost();
                }
                static getEndPost_(params) {
                    if (params.hasEnd()) {
                        const endName = params.getIndexEndName();
                        return params.getIndex().makePost(params.getIndexEndValue(), endName);
                    } else return params.getIndex().maxPost();
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class LimitedFilter {
                constructor(params) {
                    this.rangedFilter_ = new RangedFilter(params);
                    this.index_ = params.getIndex();
                    this.limit_ = params.getLimit();
                    this.reverse_ = !params.isViewFromLeft();
                }
                updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator) {
                    if (!this.rangedFilter_.matches(new NamedNode(key, newChild))) newChild = ChildrenNode.EMPTY_NODE;
                    if (snap.getImmediateChild(key).equals(newChild)) return snap; else if (snap.numChildren() < this.limit_) return this.rangedFilter_.getIndexedFilter().updateChild(snap, key, newChild, affectedPath, source, optChangeAccumulator); else return this.fullLimitUpdateChild_(snap, key, newChild, source, optChangeAccumulator);
                }
                updateFullNode(oldSnap, newSnap, optChangeAccumulator) {
                    let filtered;
                    if (newSnap.isLeafNode() || newSnap.isEmpty()) filtered = ChildrenNode.EMPTY_NODE.withIndex(this.index_); else if (2 * this.limit_ < newSnap.numChildren() && newSnap.isIndexed(this.index_)) {
                        filtered = ChildrenNode.EMPTY_NODE.withIndex(this.index_);
                        let iterator;
                        if (this.reverse_) iterator = newSnap.getReverseIteratorFrom(this.rangedFilter_.getEndPost(), this.index_); else iterator = newSnap.getIteratorFrom(this.rangedFilter_.getStartPost(), this.index_);
                        let count = 0;
                        while (iterator.hasNext() && count < this.limit_) {
                            const next = iterator.getNext();
                            let inRange;
                            if (this.reverse_) inRange = this.index_.compare(this.rangedFilter_.getStartPost(), next) <= 0; else inRange = this.index_.compare(next, this.rangedFilter_.getEndPost()) <= 0;
                            if (inRange) {
                                filtered = filtered.updateImmediateChild(next.name, next.node);
                                count++;
                            } else break;
                        }
                    } else {
                        filtered = newSnap.withIndex(this.index_);
                        filtered = filtered.updatePriority(ChildrenNode.EMPTY_NODE);
                        let startPost;
                        let endPost;
                        let cmp;
                        let iterator;
                        if (this.reverse_) {
                            iterator = filtered.getReverseIterator(this.index_);
                            startPost = this.rangedFilter_.getEndPost();
                            endPost = this.rangedFilter_.getStartPost();
                            const indexCompare = this.index_.getCompare();
                            cmp = (a, b) => indexCompare(b, a);
                        } else {
                            iterator = filtered.getIterator(this.index_);
                            startPost = this.rangedFilter_.getStartPost();
                            endPost = this.rangedFilter_.getEndPost();
                            cmp = this.index_.getCompare();
                        }
                        let count = 0;
                        let foundStartPost = false;
                        while (iterator.hasNext()) {
                            const next = iterator.getNext();
                            if (!foundStartPost && cmp(startPost, next) <= 0) foundStartPost = true;
                            const inRange = foundStartPost && count < this.limit_ && cmp(next, endPost) <= 0;
                            if (inRange) count++; else filtered = filtered.updateImmediateChild(next.name, ChildrenNode.EMPTY_NODE);
                        }
                    }
                    return this.rangedFilter_.getIndexedFilter().updateFullNode(oldSnap, filtered, optChangeAccumulator);
                }
                updatePriority(oldSnap, newPriority) {
                    return oldSnap;
                }
                filtersNodes() {
                    return true;
                }
                getIndexedFilter() {
                    return this.rangedFilter_.getIndexedFilter();
                }
                getIndex() {
                    return this.index_;
                }
                fullLimitUpdateChild_(snap, childKey, childSnap, source, changeAccumulator) {
                    let cmp;
                    if (this.reverse_) {
                        const indexCmp = this.index_.getCompare();
                        cmp = (a, b) => indexCmp(b, a);
                    } else cmp = this.index_.getCompare();
                    const oldEventCache = snap;
                    (0, dist_index_esm2017.hu)(oldEventCache.numChildren() === this.limit_, "");
                    const newChildNamedNode = new NamedNode(childKey, childSnap);
                    const windowBoundary = this.reverse_ ? oldEventCache.getFirstChild(this.index_) : oldEventCache.getLastChild(this.index_);
                    const inRange = this.rangedFilter_.matches(newChildNamedNode);
                    if (oldEventCache.hasChild(childKey)) {
                        const oldChildSnap = oldEventCache.getImmediateChild(childKey);
                        let nextChild = source.getChildAfterChild(this.index_, windowBoundary, this.reverse_);
                        while (null != nextChild && (nextChild.name === childKey || oldEventCache.hasChild(nextChild.name))) nextChild = source.getChildAfterChild(this.index_, nextChild, this.reverse_);
                        const compareNext = null == nextChild ? 1 : cmp(nextChild, newChildNamedNode);
                        const remainsInWindow = inRange && !childSnap.isEmpty() && compareNext >= 0;
                        if (remainsInWindow) {
                            if (null != changeAccumulator) changeAccumulator.trackChildChange(changeChildChanged(childKey, childSnap, oldChildSnap));
                            return oldEventCache.updateImmediateChild(childKey, childSnap);
                        } else {
                            if (null != changeAccumulator) changeAccumulator.trackChildChange(changeChildRemoved(childKey, oldChildSnap));
                            const newEventCache = oldEventCache.updateImmediateChild(childKey, ChildrenNode.EMPTY_NODE);
                            const nextChildInRange = null != nextChild && this.rangedFilter_.matches(nextChild);
                            if (nextChildInRange) {
                                if (null != changeAccumulator) changeAccumulator.trackChildChange(changeChildAdded(nextChild.name, nextChild.node));
                                return newEventCache.updateImmediateChild(nextChild.name, nextChild.node);
                            } else return newEventCache;
                        }
                    } else if (childSnap.isEmpty()) return snap; else if (inRange) if (cmp(windowBoundary, newChildNamedNode) >= 0) {
                        if (null != changeAccumulator) {
                            changeAccumulator.trackChildChange(changeChildRemoved(windowBoundary.name, windowBoundary.node));
                            changeAccumulator.trackChildChange(changeChildAdded(childKey, childSnap));
                        }
                        return oldEventCache.updateImmediateChild(childKey, childSnap).updateImmediateChild(windowBoundary.name, ChildrenNode.EMPTY_NODE);
                    } else return snap; else return snap;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class QueryParams {
                constructor() {
                    this.limitSet_ = false;
                    this.startSet_ = false;
                    this.startNameSet_ = false;
                    this.startAfterSet_ = false;
                    this.endSet_ = false;
                    this.endNameSet_ = false;
                    this.endBeforeSet_ = false;
                    this.limit_ = 0;
                    this.viewFrom_ = "";
                    this.indexStartValue_ = null;
                    this.indexStartName_ = "";
                    this.indexEndValue_ = null;
                    this.indexEndName_ = "";
                    this.index_ = PRIORITY_INDEX;
                }
                hasStart() {
                    return this.startSet_;
                }
                hasStartAfter() {
                    return this.startAfterSet_;
                }
                hasEndBefore() {
                    return this.endBeforeSet_;
                }
                isViewFromLeft() {
                    if ("" === this.viewFrom_) return this.startSet_; else return "l" === this.viewFrom_;
                }
                getIndexStartValue() {
                    (0, dist_index_esm2017.hu)(this.startSet_, "Only valid if start has been set");
                    return this.indexStartValue_;
                }
                getIndexStartName() {
                    (0, dist_index_esm2017.hu)(this.startSet_, "Only valid if start has been set");
                    if (this.startNameSet_) return this.indexStartName_; else return MIN_NAME;
                }
                hasEnd() {
                    return this.endSet_;
                }
                getIndexEndValue() {
                    (0, dist_index_esm2017.hu)(this.endSet_, "Only valid if end has been set");
                    return this.indexEndValue_;
                }
                getIndexEndName() {
                    (0, dist_index_esm2017.hu)(this.endSet_, "Only valid if end has been set");
                    if (this.endNameSet_) return this.indexEndName_; else return MAX_NAME;
                }
                hasLimit() {
                    return this.limitSet_;
                }
                hasAnchoredLimit() {
                    return this.limitSet_ && "" !== this.viewFrom_;
                }
                getLimit() {
                    (0, dist_index_esm2017.hu)(this.limitSet_, "Only valid if limit has been set");
                    return this.limit_;
                }
                getIndex() {
                    return this.index_;
                }
                loadsAllData() {
                    return !(this.startSet_ || this.endSet_ || this.limitSet_);
                }
                isDefault() {
                    return this.loadsAllData() && this.index_ === PRIORITY_INDEX;
                }
                copy() {
                    const copy = new QueryParams;
                    copy.limitSet_ = this.limitSet_;
                    copy.limit_ = this.limit_;
                    copy.startSet_ = this.startSet_;
                    copy.indexStartValue_ = this.indexStartValue_;
                    copy.startNameSet_ = this.startNameSet_;
                    copy.indexStartName_ = this.indexStartName_;
                    copy.endSet_ = this.endSet_;
                    copy.indexEndValue_ = this.indexEndValue_;
                    copy.endNameSet_ = this.endNameSet_;
                    copy.indexEndName_ = this.indexEndName_;
                    copy.index_ = this.index_;
                    copy.viewFrom_ = this.viewFrom_;
                    return copy;
                }
            }
            function queryParamsGetNodeFilter(queryParams) {
                if (queryParams.loadsAllData()) return new IndexedFilter(queryParams.getIndex()); else if (queryParams.hasLimit()) return new LimitedFilter(queryParams); else return new RangedFilter(queryParams);
            }
            function queryParamsToRestQueryStringParameters(queryParams) {
                const qs = {};
                if (queryParams.isDefault()) return qs;
                let orderBy;
                if (queryParams.index_ === PRIORITY_INDEX) orderBy = "$priority"; else if (queryParams.index_ === VALUE_INDEX) orderBy = "$value"; else if (queryParams.index_ === KEY_INDEX) orderBy = "$key"; else {
                    (0, dist_index_esm2017.hu)(queryParams.index_ instanceof PathIndex, "Unrecognized index type!");
                    orderBy = queryParams.index_.toString();
                }
                qs["orderBy"] = (0, dist_index_esm2017.Pz)(orderBy);
                if (queryParams.startSet_) {
                    qs["startAt"] = (0, dist_index_esm2017.Pz)(queryParams.indexStartValue_);
                    if (queryParams.startNameSet_) qs["startAt"] += "," + (0, dist_index_esm2017.Pz)(queryParams.indexStartName_);
                }
                if (queryParams.endSet_) {
                    qs["endAt"] = (0, dist_index_esm2017.Pz)(queryParams.indexEndValue_);
                    if (queryParams.endNameSet_) qs["endAt"] += "," + (0, dist_index_esm2017.Pz)(queryParams.indexEndName_);
                }
                if (queryParams.limitSet_) if (queryParams.isViewFromLeft()) qs["limitToFirst"] = queryParams.limit_; else qs["limitToLast"] = queryParams.limit_;
                return qs;
            }
            function queryParamsGetQueryObject(queryParams) {
                const obj = {};
                if (queryParams.startSet_) {
                    obj["sp"] = queryParams.indexStartValue_;
                    if (queryParams.startNameSet_) obj["sn"] = queryParams.indexStartName_;
                }
                if (queryParams.endSet_) {
                    obj["ep"] = queryParams.indexEndValue_;
                    if (queryParams.endNameSet_) obj["en"] = queryParams.indexEndName_;
                }
                if (queryParams.limitSet_) {
                    obj["l"] = queryParams.limit_;
                    let viewFrom = queryParams.viewFrom_;
                    if ("" === viewFrom) if (queryParams.isViewFromLeft()) viewFrom = "l"; else viewFrom = "r";
                    obj["vf"] = viewFrom;
                }
                if (queryParams.index_ !== PRIORITY_INDEX) obj["i"] = queryParams.index_.toString();
                return obj;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ReadonlyRestClient extends ServerActions {
                constructor(repoInfo_, onDataUpdate_, authTokenProvider_, appCheckTokenProvider_) {
                    super();
                    this.repoInfo_ = repoInfo_;
                    this.onDataUpdate_ = onDataUpdate_;
                    this.authTokenProvider_ = authTokenProvider_;
                    this.appCheckTokenProvider_ = appCheckTokenProvider_;
                    this.log_ = logWrapper("p:rest:");
                    this.listens_ = {};
                }
                reportStats(stats) {
                    throw new Error("Method not implemented.");
                }
                static getListenId_(query, tag) {
                    if (void 0 !== tag) return "tag$" + tag; else {
                        (0, dist_index_esm2017.hu)(query._queryParams.isDefault(), "should have a tag if it's not a default query.");
                        return query._path.toString();
                    }
                }
                listen(query, currentHashFn, tag, onComplete) {
                    const pathString = query._path.toString();
                    this.log_("Listen called for " + pathString + " " + query._queryIdentifier);
                    const listenId = ReadonlyRestClient.getListenId_(query, tag);
                    const thisListen = {};
                    this.listens_[listenId] = thisListen;
                    const queryStringParameters = queryParamsToRestQueryStringParameters(query._queryParams);
                    this.restRequest_(pathString + ".json", queryStringParameters, ((error, result) => {
                        let data = result;
                        if (404 === error) {
                            data = null;
                            error = null;
                        }
                        if (null === error) this.onDataUpdate_(pathString, data, false, tag);
                        if ((0, dist_index_esm2017.DV)(this.listens_, listenId) === thisListen) {
                            let status;
                            if (!error) status = "ok"; else if (401 === error) status = "permission_denied"; else status = "rest_error:" + error;
                            onComplete(status, null);
                        }
                    }));
                }
                unlisten(query, tag) {
                    const listenId = ReadonlyRestClient.getListenId_(query, tag);
                    delete this.listens_[listenId];
                }
                get(query) {
                    const queryStringParameters = queryParamsToRestQueryStringParameters(query._queryParams);
                    const pathString = query._path.toString();
                    const deferred = new dist_index_esm2017.BH;
                    this.restRequest_(pathString + ".json", queryStringParameters, ((error, result) => {
                        let data = result;
                        if (404 === error) {
                            data = null;
                            error = null;
                        }
                        if (null === error) {
                            this.onDataUpdate_(pathString, data, false, null);
                            deferred.resolve(data);
                        } else deferred.reject(new Error(data));
                    }));
                    return deferred.promise;
                }
                refreshAuthToken(token) {}
                restRequest_(pathString, queryStringParameters = {}, callback) {
                    queryStringParameters["format"] = "export";
                    return Promise.all([ this.authTokenProvider_.getToken(false), this.appCheckTokenProvider_.getToken(false) ]).then((([authToken, appCheckToken]) => {
                        if (authToken && authToken.accessToken) queryStringParameters["auth"] = authToken.accessToken;
                        if (appCheckToken && appCheckToken.token) queryStringParameters["ac"] = appCheckToken.token;
                        const url = (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host + pathString + "?" + "ns=" + this.repoInfo_.namespace + (0, 
                        dist_index_esm2017.xO)(queryStringParameters);
                        this.log_("Sending REST request for " + url);
                        const xhr = new XMLHttpRequest;
                        xhr.onreadystatechange = () => {
                            if (callback && 4 === xhr.readyState) {
                                this.log_("REST Response for " + url + " received. status:", xhr.status, "response:", xhr.responseText);
                                let res = null;
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    try {
                                        res = (0, dist_index_esm2017.cI)(xhr.responseText);
                                    } catch (e) {
                                        warn("Failed to parse JSON response for " + url + ": " + xhr.responseText);
                                    }
                                    callback(null, res);
                                } else {
                                    if (401 !== xhr.status && 404 !== xhr.status) warn("Got unsuccessful REST response for " + url + " Status: " + xhr.status);
                                    callback(xhr.status);
                                }
                                callback = null;
                            }
                        };
                        xhr.open("GET", url, true);
                        xhr.send();
                    }));
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class SnapshotHolder {
                constructor() {
                    this.rootNode_ = ChildrenNode.EMPTY_NODE;
                }
                getNode(path) {
                    return this.rootNode_.getChild(path);
                }
                updateSnapshot(path, newSnapshotNode) {
                    this.rootNode_ = this.rootNode_.updateChild(path, newSnapshotNode);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function newSparseSnapshotTree() {
                return {
                    value: null,
                    children: new Map
                };
            }
            function sparseSnapshotTreeRemember(sparseSnapshotTree, path, data) {
                if (pathIsEmpty(path)) {
                    sparseSnapshotTree.value = data;
                    sparseSnapshotTree.children.clear();
                } else if (null !== sparseSnapshotTree.value) sparseSnapshotTree.value = sparseSnapshotTree.value.updateChild(path, data); else {
                    const childKey = pathGetFront(path);
                    if (!sparseSnapshotTree.children.has(childKey)) sparseSnapshotTree.children.set(childKey, newSparseSnapshotTree());
                    const child = sparseSnapshotTree.children.get(childKey);
                    path = pathPopFront(path);
                    sparseSnapshotTreeRemember(child, path, data);
                }
            }
            function sparseSnapshotTreeForEachTree(sparseSnapshotTree, prefixPath, func) {
                if (null !== sparseSnapshotTree.value) func(prefixPath, sparseSnapshotTree.value); else sparseSnapshotTreeForEachChild(sparseSnapshotTree, ((key, tree) => {
                    const path = new Path(prefixPath.toString() + "/" + key);
                    sparseSnapshotTreeForEachTree(tree, path, func);
                }));
            }
            function sparseSnapshotTreeForEachChild(sparseSnapshotTree, func) {
                sparseSnapshotTree.children.forEach(((tree, key) => {
                    func(key, tree);
                }));
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class StatsListener {
                constructor(collection_) {
                    this.collection_ = collection_;
                    this.last_ = null;
                }
                get() {
                    const newStats = this.collection_.get();
                    const delta = Object.assign({}, newStats);
                    if (this.last_) each(this.last_, ((stat, value) => {
                        delta[stat] = delta[stat] - value;
                    }));
                    this.last_ = newStats;
                    return delta;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const FIRST_STATS_MIN_TIME = 10 * 1e3;
            const FIRST_STATS_MAX_TIME = 30 * 1e3;
            const REPORT_STATS_INTERVAL = 5 * 60 * 1e3;
            class StatsReporter {
                constructor(collection, server_) {
                    this.server_ = server_;
                    this.statsToReport_ = {};
                    this.statsListener_ = new StatsListener(collection);
                    const timeout = FIRST_STATS_MIN_TIME + (FIRST_STATS_MAX_TIME - FIRST_STATS_MIN_TIME) * Math.random();
                    setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(timeout));
                }
                reportStats_() {
                    const stats = this.statsListener_.get();
                    const reportedStats = {};
                    let haveStatsToReport = false;
                    each(stats, ((stat, value) => {
                        if (value > 0 && (0, dist_index_esm2017.r3)(this.statsToReport_, stat)) {
                            reportedStats[stat] = value;
                            haveStatsToReport = true;
                        }
                    }));
                    if (haveStatsToReport) this.server_.reportStats(reportedStats);
                    setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(2 * Math.random() * REPORT_STATS_INTERVAL));
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            var OperationType;
            (function(OperationType) {
                OperationType[OperationType["OVERWRITE"] = 0] = "OVERWRITE";
                OperationType[OperationType["MERGE"] = 1] = "MERGE";
                OperationType[OperationType["ACK_USER_WRITE"] = 2] = "ACK_USER_WRITE";
                OperationType[OperationType["LISTEN_COMPLETE"] = 3] = "LISTEN_COMPLETE";
            })(OperationType || (OperationType = {}));
            function newOperationSourceUser() {
                return {
                    fromUser: true,
                    fromServer: false,
                    queryId: null,
                    tagged: false
                };
            }
            function newOperationSourceServer() {
                return {
                    fromUser: false,
                    fromServer: true,
                    queryId: null,
                    tagged: false
                };
            }
            function newOperationSourceServerTaggedQuery(queryId) {
                return {
                    fromUser: false,
                    fromServer: true,
                    queryId,
                    tagged: true
                };
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class AckUserWrite {
                constructor(path, affectedTree, revert) {
                    this.path = path;
                    this.affectedTree = affectedTree;
                    this.revert = revert;
                    this.type = OperationType.ACK_USER_WRITE;
                    this.source = newOperationSourceUser();
                }
                operationForChild(childName) {
                    if (!pathIsEmpty(this.path)) {
                        (0, dist_index_esm2017.hu)(pathGetFront(this.path) === childName, "operationForChild called for unrelated child.");
                        return new AckUserWrite(pathPopFront(this.path), this.affectedTree, this.revert);
                    } else if (null != this.affectedTree.value) {
                        (0, dist_index_esm2017.hu)(this.affectedTree.children.isEmpty(), "affectedTree should not have overlapping affected paths.");
                        return this;
                    } else {
                        const childTree = this.affectedTree.subtree(new Path(childName));
                        return new AckUserWrite(newEmptyPath(), childTree, this.revert);
                    }
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ListenComplete {
                constructor(source, path) {
                    this.source = source;
                    this.path = path;
                    this.type = OperationType.LISTEN_COMPLETE;
                }
                operationForChild(childName) {
                    if (pathIsEmpty(this.path)) return new ListenComplete(this.source, newEmptyPath()); else return new ListenComplete(this.source, pathPopFront(this.path));
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Overwrite {
                constructor(source, path, snap) {
                    this.source = source;
                    this.path = path;
                    this.snap = snap;
                    this.type = OperationType.OVERWRITE;
                }
                operationForChild(childName) {
                    if (pathIsEmpty(this.path)) return new Overwrite(this.source, newEmptyPath(), this.snap.getImmediateChild(childName)); else return new Overwrite(this.source, pathPopFront(this.path), this.snap);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Merge {
                constructor(source, path, children) {
                    this.source = source;
                    this.path = path;
                    this.children = children;
                    this.type = OperationType.MERGE;
                }
                operationForChild(childName) {
                    if (pathIsEmpty(this.path)) {
                        const childTree = this.children.subtree(new Path(childName));
                        if (childTree.isEmpty()) return null; else if (childTree.value) return new Overwrite(this.source, newEmptyPath(), childTree.value); else return new Merge(this.source, newEmptyPath(), childTree);
                    } else {
                        (0, dist_index_esm2017.hu)(pathGetFront(this.path) === childName, "Can't get a merge for a child not on the path of the operation");
                        return new Merge(this.source, pathPopFront(this.path), this.children);
                    }
                }
                toString() {
                    return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")";
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class CacheNode {
                constructor(node_, fullyInitialized_, filtered_) {
                    this.node_ = node_;
                    this.fullyInitialized_ = fullyInitialized_;
                    this.filtered_ = filtered_;
                }
                isFullyInitialized() {
                    return this.fullyInitialized_;
                }
                isFiltered() {
                    return this.filtered_;
                }
                isCompleteForPath(path) {
                    if (pathIsEmpty(path)) return this.isFullyInitialized() && !this.filtered_;
                    const childKey = pathGetFront(path);
                    return this.isCompleteForChild(childKey);
                }
                isCompleteForChild(key) {
                    return this.isFullyInitialized() && !this.filtered_ || this.node_.hasChild(key);
                }
                getNode() {
                    return this.node_;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class EventGenerator {
                constructor(query_) {
                    this.query_ = query_;
                    this.index_ = this.query_._queryParams.getIndex();
                }
            }
            function eventGeneratorGenerateEventsForChanges(eventGenerator, changes, eventCache, eventRegistrations) {
                const events = [];
                const moves = [];
                changes.forEach((change => {
                    if ("child_changed" === change.type && eventGenerator.index_.indexedValueChanged(change.oldSnap, change.snapshotNode)) moves.push(changeChildMoved(change.childName, change.snapshotNode));
                }));
                eventGeneratorGenerateEventsForType(eventGenerator, events, "child_removed", changes, eventRegistrations, eventCache);
                eventGeneratorGenerateEventsForType(eventGenerator, events, "child_added", changes, eventRegistrations, eventCache);
                eventGeneratorGenerateEventsForType(eventGenerator, events, "child_moved", moves, eventRegistrations, eventCache);
                eventGeneratorGenerateEventsForType(eventGenerator, events, "child_changed", changes, eventRegistrations, eventCache);
                eventGeneratorGenerateEventsForType(eventGenerator, events, "value", changes, eventRegistrations, eventCache);
                return events;
            }
            function eventGeneratorGenerateEventsForType(eventGenerator, events, eventType, changes, registrations, eventCache) {
                const filteredChanges = changes.filter((change => change.type === eventType));
                filteredChanges.sort(((a, b) => eventGeneratorCompareChanges(eventGenerator, a, b)));
                filteredChanges.forEach((change => {
                    const materializedChange = eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache);
                    registrations.forEach((registration => {
                        if (registration.respondsTo(change.type)) events.push(registration.createEvent(materializedChange, eventGenerator.query_));
                    }));
                }));
            }
            function eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache) {
                if ("value" === change.type || "child_removed" === change.type) return change; else {
                    change.prevName = eventCache.getPredecessorChildName(change.childName, change.snapshotNode, eventGenerator.index_);
                    return change;
                }
            }
            function eventGeneratorCompareChanges(eventGenerator, a, b) {
                if (null == a.childName || null == b.childName) throw (0, dist_index_esm2017.g5)("Should only compare child_ events.");
                const aWrapped = new NamedNode(a.childName, a.snapshotNode);
                const bWrapped = new NamedNode(b.childName, b.snapshotNode);
                return eventGenerator.index_.compare(aWrapped, bWrapped);
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function newViewCache(eventCache, serverCache) {
                return {
                    eventCache,
                    serverCache
                };
            }
            function viewCacheUpdateEventSnap(viewCache, eventSnap, complete, filtered) {
                return newViewCache(new CacheNode(eventSnap, complete, filtered), viewCache.serverCache);
            }
            function viewCacheUpdateServerSnap(viewCache, serverSnap, complete, filtered) {
                return newViewCache(viewCache.eventCache, new CacheNode(serverSnap, complete, filtered));
            }
            function viewCacheGetCompleteEventSnap(viewCache) {
                return viewCache.eventCache.isFullyInitialized() ? viewCache.eventCache.getNode() : null;
            }
            function viewCacheGetCompleteServerSnap(viewCache) {
                return viewCache.serverCache.isFullyInitialized() ? viewCache.serverCache.getNode() : null;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let emptyChildrenSingleton;
            const EmptyChildren = () => {
                if (!emptyChildrenSingleton) emptyChildrenSingleton = new SortedMap(stringCompare);
                return emptyChildrenSingleton;
            };
            class ImmutableTree {
                constructor(value, children = EmptyChildren()) {
                    this.value = value;
                    this.children = children;
                }
                static fromObject(obj) {
                    let tree = new ImmutableTree(null);
                    each(obj, ((childPath, childSnap) => {
                        tree = tree.set(new Path(childPath), childSnap);
                    }));
                    return tree;
                }
                isEmpty() {
                    return null === this.value && this.children.isEmpty();
                }
                findRootMostMatchingPathAndValue(relativePath, predicate) {
                    if (null != this.value && predicate(this.value)) return {
                        path: newEmptyPath(),
                        value: this.value
                    }; else if (pathIsEmpty(relativePath)) return null; else {
                        const front = pathGetFront(relativePath);
                        const child = this.children.get(front);
                        if (null !== child) {
                            const childExistingPathAndValue = child.findRootMostMatchingPathAndValue(pathPopFront(relativePath), predicate);
                            if (null != childExistingPathAndValue) {
                                const fullPath = pathChild(new Path(front), childExistingPathAndValue.path);
                                return {
                                    path: fullPath,
                                    value: childExistingPathAndValue.value
                                };
                            } else return null;
                        } else return null;
                    }
                }
                findRootMostValueAndPath(relativePath) {
                    return this.findRootMostMatchingPathAndValue(relativePath, (() => true));
                }
                subtree(relativePath) {
                    if (pathIsEmpty(relativePath)) return this; else {
                        const front = pathGetFront(relativePath);
                        const childTree = this.children.get(front);
                        if (null !== childTree) return childTree.subtree(pathPopFront(relativePath)); else return new ImmutableTree(null);
                    }
                }
                set(relativePath, toSet) {
                    if (pathIsEmpty(relativePath)) return new ImmutableTree(toSet, this.children); else {
                        const front = pathGetFront(relativePath);
                        const child = this.children.get(front) || new ImmutableTree(null);
                        const newChild = child.set(pathPopFront(relativePath), toSet);
                        const newChildren = this.children.insert(front, newChild);
                        return new ImmutableTree(this.value, newChildren);
                    }
                }
                remove(relativePath) {
                    if (pathIsEmpty(relativePath)) if (this.children.isEmpty()) return new ImmutableTree(null); else return new ImmutableTree(null, this.children); else {
                        const front = pathGetFront(relativePath);
                        const child = this.children.get(front);
                        if (child) {
                            const newChild = child.remove(pathPopFront(relativePath));
                            let newChildren;
                            if (newChild.isEmpty()) newChildren = this.children.remove(front); else newChildren = this.children.insert(front, newChild);
                            if (null === this.value && newChildren.isEmpty()) return new ImmutableTree(null); else return new ImmutableTree(this.value, newChildren);
                        } else return this;
                    }
                }
                get(relativePath) {
                    if (pathIsEmpty(relativePath)) return this.value; else {
                        const front = pathGetFront(relativePath);
                        const child = this.children.get(front);
                        if (child) return child.get(pathPopFront(relativePath)); else return null;
                    }
                }
                setTree(relativePath, newTree) {
                    if (pathIsEmpty(relativePath)) return newTree; else {
                        const front = pathGetFront(relativePath);
                        const child = this.children.get(front) || new ImmutableTree(null);
                        const newChild = child.setTree(pathPopFront(relativePath), newTree);
                        let newChildren;
                        if (newChild.isEmpty()) newChildren = this.children.remove(front); else newChildren = this.children.insert(front, newChild);
                        return new ImmutableTree(this.value, newChildren);
                    }
                }
                fold(fn) {
                    return this.fold_(newEmptyPath(), fn);
                }
                fold_(pathSoFar, fn) {
                    const accum = {};
                    this.children.inorderTraversal(((childKey, childTree) => {
                        accum[childKey] = childTree.fold_(pathChild(pathSoFar, childKey), fn);
                    }));
                    return fn(pathSoFar, this.value, accum);
                }
                findOnPath(path, f) {
                    return this.findOnPath_(path, newEmptyPath(), f);
                }
                findOnPath_(pathToFollow, pathSoFar, f) {
                    const result = this.value ? f(pathSoFar, this.value) : false;
                    if (result) return result; else if (pathIsEmpty(pathToFollow)) return null; else {
                        const front = pathGetFront(pathToFollow);
                        const nextChild = this.children.get(front);
                        if (nextChild) return nextChild.findOnPath_(pathPopFront(pathToFollow), pathChild(pathSoFar, front), f); else return null;
                    }
                }
                foreachOnPath(path, f) {
                    return this.foreachOnPath_(path, newEmptyPath(), f);
                }
                foreachOnPath_(pathToFollow, currentRelativePath, f) {
                    if (pathIsEmpty(pathToFollow)) return this; else {
                        if (this.value) f(currentRelativePath, this.value);
                        const front = pathGetFront(pathToFollow);
                        const nextChild = this.children.get(front);
                        if (nextChild) return nextChild.foreachOnPath_(pathPopFront(pathToFollow), pathChild(currentRelativePath, front), f); else return new ImmutableTree(null);
                    }
                }
                foreach(f) {
                    this.foreach_(newEmptyPath(), f);
                }
                foreach_(currentRelativePath, f) {
                    this.children.inorderTraversal(((childName, childTree) => {
                        childTree.foreach_(pathChild(currentRelativePath, childName), f);
                    }));
                    if (this.value) f(currentRelativePath, this.value);
                }
                foreachChild(f) {
                    this.children.inorderTraversal(((childName, childTree) => {
                        if (childTree.value) f(childName, childTree.value);
                    }));
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class CompoundWrite {
                constructor(writeTree_) {
                    this.writeTree_ = writeTree_;
                }
                static empty() {
                    return new CompoundWrite(new ImmutableTree(null));
                }
            }
            function compoundWriteAddWrite(compoundWrite, path, node) {
                if (pathIsEmpty(path)) return new CompoundWrite(new ImmutableTree(node)); else {
                    const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
                    if (null != rootmost) {
                        const rootMostPath = rootmost.path;
                        let value = rootmost.value;
                        const relativePath = newRelativePath(rootMostPath, path);
                        value = value.updateChild(relativePath, node);
                        return new CompoundWrite(compoundWrite.writeTree_.set(rootMostPath, value));
                    } else {
                        const subtree = new ImmutableTree(node);
                        const newWriteTree = compoundWrite.writeTree_.setTree(path, subtree);
                        return new CompoundWrite(newWriteTree);
                    }
                }
            }
            function compoundWriteAddWrites(compoundWrite, path, updates) {
                let newWrite = compoundWrite;
                each(updates, ((childKey, node) => {
                    newWrite = compoundWriteAddWrite(newWrite, pathChild(path, childKey), node);
                }));
                return newWrite;
            }
            function compoundWriteRemoveWrite(compoundWrite, path) {
                if (pathIsEmpty(path)) return CompoundWrite.empty(); else {
                    const newWriteTree = compoundWrite.writeTree_.setTree(path, new ImmutableTree(null));
                    return new CompoundWrite(newWriteTree);
                }
            }
            function compoundWriteHasCompleteWrite(compoundWrite, path) {
                return null != compoundWriteGetCompleteNode(compoundWrite, path);
            }
            function compoundWriteGetCompleteNode(compoundWrite, path) {
                const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
                if (null != rootmost) return compoundWrite.writeTree_.get(rootmost.path).getChild(newRelativePath(rootmost.path, path)); else return null;
            }
            function compoundWriteGetCompleteChildren(compoundWrite) {
                const children = [];
                const node = compoundWrite.writeTree_.value;
                if (null != node) {
                    if (!node.isLeafNode()) node.forEachChild(PRIORITY_INDEX, ((childName, childNode) => {
                        children.push(new NamedNode(childName, childNode));
                    }));
                } else compoundWrite.writeTree_.children.inorderTraversal(((childName, childTree) => {
                    if (null != childTree.value) children.push(new NamedNode(childName, childTree.value));
                }));
                return children;
            }
            function compoundWriteChildCompoundWrite(compoundWrite, path) {
                if (pathIsEmpty(path)) return compoundWrite; else {
                    const shadowingNode = compoundWriteGetCompleteNode(compoundWrite, path);
                    if (null != shadowingNode) return new CompoundWrite(new ImmutableTree(shadowingNode)); else return new CompoundWrite(compoundWrite.writeTree_.subtree(path));
                }
            }
            function compoundWriteIsEmpty(compoundWrite) {
                return compoundWrite.writeTree_.isEmpty();
            }
            function compoundWriteApply(compoundWrite, node) {
                return applySubtreeWrite(newEmptyPath(), compoundWrite.writeTree_, node);
            }
            function applySubtreeWrite(relativePath, writeTree, node) {
                if (null != writeTree.value) return node.updateChild(relativePath, writeTree.value); else {
                    let priorityWrite = null;
                    writeTree.children.inorderTraversal(((childKey, childTree) => {
                        if (".priority" === childKey) {
                            (0, dist_index_esm2017.hu)(null !== childTree.value, "Priority writes must always be leaf nodes");
                            priorityWrite = childTree.value;
                        } else node = applySubtreeWrite(pathChild(relativePath, childKey), childTree, node);
                    }));
                    if (!node.getChild(relativePath).isEmpty() && null !== priorityWrite) node = node.updateChild(pathChild(relativePath, ".priority"), priorityWrite);
                    return node;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function writeTreeChildWrites(writeTree, path) {
                return newWriteTreeRef(path, writeTree);
            }
            function writeTreeAddOverwrite(writeTree, path, snap, writeId, visible) {
                (0, dist_index_esm2017.hu)(writeId > writeTree.lastWriteId, "Stacking an older write on top of newer ones");
                if (void 0 === visible) visible = true;
                writeTree.allWrites.push({
                    path,
                    snap,
                    writeId,
                    visible
                });
                if (visible) writeTree.visibleWrites = compoundWriteAddWrite(writeTree.visibleWrites, path, snap);
                writeTree.lastWriteId = writeId;
            }
            function writeTreeAddMerge(writeTree, path, changedChildren, writeId) {
                (0, dist_index_esm2017.hu)(writeId > writeTree.lastWriteId, "Stacking an older merge on top of newer ones");
                writeTree.allWrites.push({
                    path,
                    children: changedChildren,
                    writeId,
                    visible: true
                });
                writeTree.visibleWrites = compoundWriteAddWrites(writeTree.visibleWrites, path, changedChildren);
                writeTree.lastWriteId = writeId;
            }
            function writeTreeGetWrite(writeTree, writeId) {
                for (let i = 0; i < writeTree.allWrites.length; i++) {
                    const record = writeTree.allWrites[i];
                    if (record.writeId === writeId) return record;
                }
                return null;
            }
            function writeTreeRemoveWrite(writeTree, writeId) {
                const idx = writeTree.allWrites.findIndex((s => s.writeId === writeId));
                (0, dist_index_esm2017.hu)(idx >= 0, "removeWrite called with nonexistent writeId.");
                const writeToRemove = writeTree.allWrites[idx];
                writeTree.allWrites.splice(idx, 1);
                let removedWriteWasVisible = writeToRemove.visible;
                let removedWriteOverlapsWithOtherWrites = false;
                let i = writeTree.allWrites.length - 1;
                while (removedWriteWasVisible && i >= 0) {
                    const currentWrite = writeTree.allWrites[i];
                    if (currentWrite.visible) if (i >= idx && writeTreeRecordContainsPath_(currentWrite, writeToRemove.path)) removedWriteWasVisible = false; else if (pathContains(writeToRemove.path, currentWrite.path)) removedWriteOverlapsWithOtherWrites = true;
                    i--;
                }
                if (!removedWriteWasVisible) return false; else if (removedWriteOverlapsWithOtherWrites) {
                    writeTreeResetTree_(writeTree);
                    return true;
                } else {
                    if (writeToRemove.snap) writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, writeToRemove.path); else {
                        const children = writeToRemove.children;
                        each(children, (childName => {
                            writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, pathChild(writeToRemove.path, childName));
                        }));
                    }
                    return true;
                }
            }
            function writeTreeRecordContainsPath_(writeRecord, path) {
                if (writeRecord.snap) return pathContains(writeRecord.path, path); else {
                    for (const childName in writeRecord.children) if (writeRecord.children.hasOwnProperty(childName) && pathContains(pathChild(writeRecord.path, childName), path)) return true;
                    return false;
                }
            }
            function writeTreeResetTree_(writeTree) {
                writeTree.visibleWrites = writeTreeLayerTree_(writeTree.allWrites, writeTreeDefaultFilter_, newEmptyPath());
                if (writeTree.allWrites.length > 0) writeTree.lastWriteId = writeTree.allWrites[writeTree.allWrites.length - 1].writeId; else writeTree.lastWriteId = -1;
            }
            function writeTreeDefaultFilter_(write) {
                return write.visible;
            }
            function writeTreeLayerTree_(writes, filter, treeRoot) {
                let compoundWrite = CompoundWrite.empty();
                for (let i = 0; i < writes.length; ++i) {
                    const write = writes[i];
                    if (filter(write)) {
                        const writePath = write.path;
                        let relativePath;
                        if (write.snap) {
                            if (pathContains(treeRoot, writePath)) {
                                relativePath = newRelativePath(treeRoot, writePath);
                                compoundWrite = compoundWriteAddWrite(compoundWrite, relativePath, write.snap);
                            } else if (pathContains(writePath, treeRoot)) {
                                relativePath = newRelativePath(writePath, treeRoot);
                                compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), write.snap.getChild(relativePath));
                            }
                        } else if (write.children) {
                            if (pathContains(treeRoot, writePath)) {
                                relativePath = newRelativePath(treeRoot, writePath);
                                compoundWrite = compoundWriteAddWrites(compoundWrite, relativePath, write.children);
                            } else if (pathContains(writePath, treeRoot)) {
                                relativePath = newRelativePath(writePath, treeRoot);
                                if (pathIsEmpty(relativePath)) compoundWrite = compoundWriteAddWrites(compoundWrite, newEmptyPath(), write.children); else {
                                    const child = (0, dist_index_esm2017.DV)(write.children, pathGetFront(relativePath));
                                    if (child) {
                                        const deepNode = child.getChild(pathPopFront(relativePath));
                                        compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), deepNode);
                                    }
                                }
                            }
                        } else throw (0, dist_index_esm2017.g5)("WriteRecord should have .snap or .children");
                    }
                }
                return compoundWrite;
            }
            function writeTreeCalcCompleteEventCache(writeTree, treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
                if (!writeIdsToExclude && !includeHiddenWrites) {
                    const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
                    if (null != shadowingNode) return shadowingNode; else {
                        const subMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                        if (compoundWriteIsEmpty(subMerge)) return completeServerCache; else if (null == completeServerCache && !compoundWriteHasCompleteWrite(subMerge, newEmptyPath())) return null; else {
                            const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
                            return compoundWriteApply(subMerge, layeredCache);
                        }
                    }
                } else {
                    const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                    if (!includeHiddenWrites && compoundWriteIsEmpty(merge)) return completeServerCache; else if (!includeHiddenWrites && null == completeServerCache && !compoundWriteHasCompleteWrite(merge, newEmptyPath())) return null; else {
                        const filter = function(write) {
                            return (write.visible || includeHiddenWrites) && (!writeIdsToExclude || !~writeIdsToExclude.indexOf(write.writeId)) && (pathContains(write.path, treePath) || pathContains(treePath, write.path));
                        };
                        const mergeAtPath = writeTreeLayerTree_(writeTree.allWrites, filter, treePath);
                        const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
                        return compoundWriteApply(mergeAtPath, layeredCache);
                    }
                }
            }
            function writeTreeCalcCompleteEventChildren(writeTree, treePath, completeServerChildren) {
                let completeChildren = ChildrenNode.EMPTY_NODE;
                const topLevelSet = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
                if (topLevelSet) {
                    if (!topLevelSet.isLeafNode()) topLevelSet.forEachChild(PRIORITY_INDEX, ((childName, childSnap) => {
                        completeChildren = completeChildren.updateImmediateChild(childName, childSnap);
                    }));
                    return completeChildren;
                } else if (completeServerChildren) {
                    const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                    completeServerChildren.forEachChild(PRIORITY_INDEX, ((childName, childNode) => {
                        const node = compoundWriteApply(compoundWriteChildCompoundWrite(merge, new Path(childName)), childNode);
                        completeChildren = completeChildren.updateImmediateChild(childName, node);
                    }));
                    compoundWriteGetCompleteChildren(merge).forEach((namedNode => {
                        completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
                    }));
                    return completeChildren;
                } else {
                    const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                    compoundWriteGetCompleteChildren(merge).forEach((namedNode => {
                        completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
                    }));
                    return completeChildren;
                }
            }
            function writeTreeCalcEventCacheAfterServerOverwrite(writeTree, treePath, childPath, existingEventSnap, existingServerSnap) {
                (0, dist_index_esm2017.hu)(existingEventSnap || existingServerSnap, "Either existingEventSnap or existingServerSnap must exist");
                const path = pathChild(treePath, childPath);
                if (compoundWriteHasCompleteWrite(writeTree.visibleWrites, path)) return null; else {
                    const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
                    if (compoundWriteIsEmpty(childMerge)) return existingServerSnap.getChild(childPath); else return compoundWriteApply(childMerge, existingServerSnap.getChild(childPath));
                }
            }
            function writeTreeCalcCompleteChild(writeTree, treePath, childKey, existingServerSnap) {
                const path = pathChild(treePath, childKey);
                const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
                if (null != shadowingNode) return shadowingNode; else if (existingServerSnap.isCompleteForChild(childKey)) {
                    const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
                    return compoundWriteApply(childMerge, existingServerSnap.getNode().getImmediateChild(childKey));
                } else return null;
            }
            function writeTreeShadowingWrite(writeTree, path) {
                return compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
            }
            function writeTreeCalcIndexedSlice(writeTree, treePath, completeServerData, startPost, count, reverse, index) {
                let toIterate;
                const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                const shadowingNode = compoundWriteGetCompleteNode(merge, newEmptyPath());
                if (null != shadowingNode) toIterate = shadowingNode; else if (null != completeServerData) toIterate = compoundWriteApply(merge, completeServerData); else return [];
                toIterate = toIterate.withIndex(index);
                if (!toIterate.isEmpty() && !toIterate.isLeafNode()) {
                    const nodes = [];
                    const cmp = index.getCompare();
                    const iter = reverse ? toIterate.getReverseIteratorFrom(startPost, index) : toIterate.getIteratorFrom(startPost, index);
                    let next = iter.getNext();
                    while (next && nodes.length < count) {
                        if (0 !== cmp(next, startPost)) nodes.push(next);
                        next = iter.getNext();
                    }
                    return nodes;
                } else return [];
            }
            function newWriteTree() {
                return {
                    visibleWrites: CompoundWrite.empty(),
                    allWrites: [],
                    lastWriteId: -1
                };
            }
            function writeTreeRefCalcCompleteEventCache(writeTreeRef, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
                return writeTreeCalcCompleteEventCache(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites);
            }
            function writeTreeRefCalcCompleteEventChildren(writeTreeRef, completeServerChildren) {
                return writeTreeCalcCompleteEventChildren(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerChildren);
            }
            function writeTreeRefCalcEventCacheAfterServerOverwrite(writeTreeRef, path, existingEventSnap, existingServerSnap) {
                return writeTreeCalcEventCacheAfterServerOverwrite(writeTreeRef.writeTree, writeTreeRef.treePath, path, existingEventSnap, existingServerSnap);
            }
            function writeTreeRefShadowingWrite(writeTreeRef, path) {
                return writeTreeShadowingWrite(writeTreeRef.writeTree, pathChild(writeTreeRef.treePath, path));
            }
            function writeTreeRefCalcIndexedSlice(writeTreeRef, completeServerData, startPost, count, reverse, index) {
                return writeTreeCalcIndexedSlice(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerData, startPost, count, reverse, index);
            }
            function writeTreeRefCalcCompleteChild(writeTreeRef, childKey, existingServerCache) {
                return writeTreeCalcCompleteChild(writeTreeRef.writeTree, writeTreeRef.treePath, childKey, existingServerCache);
            }
            function writeTreeRefChild(writeTreeRef, childName) {
                return newWriteTreeRef(pathChild(writeTreeRef.treePath, childName), writeTreeRef.writeTree);
            }
            function newWriteTreeRef(path, writeTree) {
                return {
                    treePath: path,
                    writeTree
                };
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ChildChangeAccumulator {
                constructor() {
                    this.changeMap = new Map;
                }
                trackChildChange(change) {
                    const type = change.type;
                    const childKey = change.childName;
                    (0, dist_index_esm2017.hu)("child_added" === type || "child_changed" === type || "child_removed" === type, "Only child changes supported for tracking");
                    (0, dist_index_esm2017.hu)(".priority" !== childKey, "Only non-priority child changes can be tracked.");
                    const oldChange = this.changeMap.get(childKey);
                    if (oldChange) {
                        const oldType = oldChange.type;
                        if ("child_added" === type && "child_removed" === oldType) this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.snapshotNode)); else if ("child_removed" === type && "child_added" === oldType) this.changeMap.delete(childKey); else if ("child_removed" === type && "child_changed" === oldType) this.changeMap.set(childKey, changeChildRemoved(childKey, oldChange.oldSnap)); else if ("child_changed" === type && "child_added" === oldType) this.changeMap.set(childKey, changeChildAdded(childKey, change.snapshotNode)); else if ("child_changed" === type && "child_changed" === oldType) this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.oldSnap)); else throw (0, 
                        dist_index_esm2017.g5)("Illegal combination of changes: " + change + " occurred after " + oldChange);
                    } else this.changeMap.set(childKey, change);
                }
                getChanges() {
                    return Array.from(this.changeMap.values());
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class NoCompleteChildSource_ {
                getCompleteChild(childKey) {
                    return null;
                }
                getChildAfterChild(index, child, reverse) {
                    return null;
                }
            }
            const NO_COMPLETE_CHILD_SOURCE = new NoCompleteChildSource_;
            class WriteTreeCompleteChildSource {
                constructor(writes_, viewCache_, optCompleteServerCache_ = null) {
                    this.writes_ = writes_;
                    this.viewCache_ = viewCache_;
                    this.optCompleteServerCache_ = optCompleteServerCache_;
                }
                getCompleteChild(childKey) {
                    const node = this.viewCache_.eventCache;
                    if (node.isCompleteForChild(childKey)) return node.getNode().getImmediateChild(childKey); else {
                        const serverNode = null != this.optCompleteServerCache_ ? new CacheNode(this.optCompleteServerCache_, true, false) : this.viewCache_.serverCache;
                        return writeTreeRefCalcCompleteChild(this.writes_, childKey, serverNode);
                    }
                }
                getChildAfterChild(index, child, reverse) {
                    const completeServerData = null != this.optCompleteServerCache_ ? this.optCompleteServerCache_ : viewCacheGetCompleteServerSnap(this.viewCache_);
                    const nodes = writeTreeRefCalcIndexedSlice(this.writes_, completeServerData, child, 1, reverse, index);
                    if (0 === nodes.length) return null; else return nodes[0];
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function newViewProcessor(filter) {
                return {
                    filter
                };
            }
            function viewProcessorAssertIndexed(viewProcessor, viewCache) {
                (0, dist_index_esm2017.hu)(viewCache.eventCache.getNode().isIndexed(viewProcessor.filter.getIndex()), "Event snap not indexed");
                (0, dist_index_esm2017.hu)(viewCache.serverCache.getNode().isIndexed(viewProcessor.filter.getIndex()), "Server snap not indexed");
            }
            function viewProcessorApplyOperation(viewProcessor, oldViewCache, operation, writesCache, completeCache) {
                const accumulator = new ChildChangeAccumulator;
                let newViewCache, filterServerNode;
                if (operation.type === OperationType.OVERWRITE) {
                    const overwrite = operation;
                    if (overwrite.source.fromUser) newViewCache = viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, accumulator); else {
                        (0, dist_index_esm2017.hu)(overwrite.source.fromServer, "Unknown source.");
                        filterServerNode = overwrite.source.tagged || oldViewCache.serverCache.isFiltered() && !pathIsEmpty(overwrite.path);
                        newViewCache = viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, filterServerNode, accumulator);
                    }
                } else if (operation.type === OperationType.MERGE) {
                    const merge = operation;
                    if (merge.source.fromUser) newViewCache = viewProcessorApplyUserMerge(viewProcessor, oldViewCache, merge.path, merge.children, writesCache, completeCache, accumulator); else {
                        (0, dist_index_esm2017.hu)(merge.source.fromServer, "Unknown source.");
                        filterServerNode = merge.source.tagged || oldViewCache.serverCache.isFiltered();
                        newViewCache = viewProcessorApplyServerMerge(viewProcessor, oldViewCache, merge.path, merge.children, writesCache, completeCache, filterServerNode, accumulator);
                    }
                } else if (operation.type === OperationType.ACK_USER_WRITE) {
                    const ackUserWrite = operation;
                    if (!ackUserWrite.revert) newViewCache = viewProcessorAckUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, ackUserWrite.affectedTree, writesCache, completeCache, accumulator); else newViewCache = viewProcessorRevertUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, writesCache, completeCache, accumulator);
                } else if (operation.type === OperationType.LISTEN_COMPLETE) newViewCache = viewProcessorListenComplete(viewProcessor, oldViewCache, operation.path, writesCache, accumulator); else throw (0, 
                dist_index_esm2017.g5)("Unknown operation type: " + operation.type);
                const changes = accumulator.getChanges();
                viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache, changes);
                return {
                    viewCache: newViewCache,
                    changes
                };
            }
            function viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache, accumulator) {
                const eventSnap = newViewCache.eventCache;
                if (eventSnap.isFullyInitialized()) {
                    const isLeafOrEmpty = eventSnap.getNode().isLeafNode() || eventSnap.getNode().isEmpty();
                    const oldCompleteSnap = viewCacheGetCompleteEventSnap(oldViewCache);
                    if (accumulator.length > 0 || !oldViewCache.eventCache.isFullyInitialized() || isLeafOrEmpty && !eventSnap.getNode().equals(oldCompleteSnap) || !eventSnap.getNode().getPriority().equals(oldCompleteSnap.getPriority())) accumulator.push(changeValue(viewCacheGetCompleteEventSnap(newViewCache)));
                }
            }
            function viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, viewCache, changePath, writesCache, source, accumulator) {
                const oldEventSnap = viewCache.eventCache;
                if (null != writeTreeRefShadowingWrite(writesCache, changePath)) return viewCache; else {
                    let newEventCache, serverNode;
                    if (pathIsEmpty(changePath)) {
                        (0, dist_index_esm2017.hu)(viewCache.serverCache.isFullyInitialized(), "If change path is empty, we must have complete server data");
                        if (viewCache.serverCache.isFiltered()) {
                            const serverCache = viewCacheGetCompleteServerSnap(viewCache);
                            const completeChildren = serverCache instanceof ChildrenNode ? serverCache : ChildrenNode.EMPTY_NODE;
                            const completeEventChildren = writeTreeRefCalcCompleteEventChildren(writesCache, completeChildren);
                            newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeEventChildren, accumulator);
                        } else {
                            const completeNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
                            newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeNode, accumulator);
                        }
                    } else {
                        const childKey = pathGetFront(changePath);
                        if (".priority" === childKey) {
                            (0, dist_index_esm2017.hu)(1 === pathGetLength(changePath), "Can't have a priority with additional path components");
                            const oldEventNode = oldEventSnap.getNode();
                            serverNode = viewCache.serverCache.getNode();
                            const updatedPriority = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventNode, serverNode);
                            if (null != updatedPriority) newEventCache = viewProcessor.filter.updatePriority(oldEventNode, updatedPriority); else newEventCache = oldEventSnap.getNode();
                        } else {
                            const childChangePath = pathPopFront(changePath);
                            let newEventChild;
                            if (oldEventSnap.isCompleteForChild(childKey)) {
                                serverNode = viewCache.serverCache.getNode();
                                const eventChildUpdate = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventSnap.getNode(), serverNode);
                                if (null != eventChildUpdate) newEventChild = oldEventSnap.getNode().getImmediateChild(childKey).updateChild(childChangePath, eventChildUpdate); else newEventChild = oldEventSnap.getNode().getImmediateChild(childKey);
                            } else newEventChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
                            if (null != newEventChild) newEventCache = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newEventChild, childChangePath, source, accumulator); else newEventCache = oldEventSnap.getNode();
                        }
                    }
                    return viewCacheUpdateEventSnap(viewCache, newEventCache, oldEventSnap.isFullyInitialized() || pathIsEmpty(changePath), viewProcessor.filter.filtersNodes());
                }
            }
            function viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, filterServerNode, accumulator) {
                const oldServerSnap = oldViewCache.serverCache;
                let newServerCache;
                const serverFilter = filterServerNode ? viewProcessor.filter : viewProcessor.filter.getIndexedFilter();
                if (pathIsEmpty(changePath)) newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), changedSnap, null); else if (serverFilter.filtersNodes() && !oldServerSnap.isFiltered()) {
                    const newServerNode = oldServerSnap.getNode().updateChild(changePath, changedSnap);
                    newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), newServerNode, null);
                } else {
                    const childKey = pathGetFront(changePath);
                    if (!oldServerSnap.isCompleteForPath(changePath) && pathGetLength(changePath) > 1) return oldViewCache;
                    const childChangePath = pathPopFront(changePath);
                    const childNode = oldServerSnap.getNode().getImmediateChild(childKey);
                    const newChildNode = childNode.updateChild(childChangePath, changedSnap);
                    if (".priority" === childKey) newServerCache = serverFilter.updatePriority(oldServerSnap.getNode(), newChildNode); else newServerCache = serverFilter.updateChild(oldServerSnap.getNode(), childKey, newChildNode, childChangePath, NO_COMPLETE_CHILD_SOURCE, null);
                }
                const newViewCache = viewCacheUpdateServerSnap(oldViewCache, newServerCache, oldServerSnap.isFullyInitialized() || pathIsEmpty(changePath), serverFilter.filtersNodes());
                const source = new WriteTreeCompleteChildSource(writesCache, newViewCache, completeCache);
                return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache, changePath, writesCache, source, accumulator);
            }
            function viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, accumulator) {
                const oldEventSnap = oldViewCache.eventCache;
                let newViewCache, newEventCache;
                const source = new WriteTreeCompleteChildSource(writesCache, oldViewCache, completeCache);
                if (pathIsEmpty(changePath)) {
                    newEventCache = viewProcessor.filter.updateFullNode(oldViewCache.eventCache.getNode(), changedSnap, accumulator);
                    newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventCache, true, viewProcessor.filter.filtersNodes());
                } else {
                    const childKey = pathGetFront(changePath);
                    if (".priority" === childKey) {
                        newEventCache = viewProcessor.filter.updatePriority(oldViewCache.eventCache.getNode(), changedSnap);
                        newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventCache, oldEventSnap.isFullyInitialized(), oldEventSnap.isFiltered());
                    } else {
                        const childChangePath = pathPopFront(changePath);
                        const oldChild = oldEventSnap.getNode().getImmediateChild(childKey);
                        let newChild;
                        if (pathIsEmpty(childChangePath)) newChild = changedSnap; else {
                            const childNode = source.getCompleteChild(childKey);
                            if (null != childNode) if (".priority" === pathGetBack(childChangePath) && childNode.getChild(pathParent(childChangePath)).isEmpty()) newChild = childNode; else newChild = childNode.updateChild(childChangePath, changedSnap); else newChild = ChildrenNode.EMPTY_NODE;
                        }
                        if (!oldChild.equals(newChild)) {
                            const newEventSnap = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newChild, childChangePath, source, accumulator);
                            newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventSnap, oldEventSnap.isFullyInitialized(), viewProcessor.filter.filtersNodes());
                        } else newViewCache = oldViewCache;
                    }
                }
                return newViewCache;
            }
            function viewProcessorCacheHasChild(viewCache, childKey) {
                return viewCache.eventCache.isCompleteForChild(childKey);
            }
            function viewProcessorApplyUserMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, accumulator) {
                let curViewCache = viewCache;
                changedChildren.foreach(((relativePath, childNode) => {
                    const writePath = pathChild(path, relativePath);
                    if (viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
                }));
                changedChildren.foreach(((relativePath, childNode) => {
                    const writePath = pathChild(path, relativePath);
                    if (!viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
                }));
                return curViewCache;
            }
            function viewProcessorApplyMerge(viewProcessor, node, merge) {
                merge.foreach(((relativePath, childNode) => {
                    node = node.updateChild(relativePath, childNode);
                }));
                return node;
            }
            function viewProcessorApplyServerMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, filterServerNode, accumulator) {
                if (viewCache.serverCache.getNode().isEmpty() && !viewCache.serverCache.isFullyInitialized()) return viewCache;
                let curViewCache = viewCache;
                let viewMergeTree;
                if (pathIsEmpty(path)) viewMergeTree = changedChildren; else viewMergeTree = new ImmutableTree(null).setTree(path, changedChildren);
                const serverNode = viewCache.serverCache.getNode();
                viewMergeTree.children.inorderTraversal(((childKey, childTree) => {
                    if (serverNode.hasChild(childKey)) {
                        const serverChild = viewCache.serverCache.getNode().getImmediateChild(childKey);
                        const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childTree);
                        curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
                    }
                }));
                viewMergeTree.children.inorderTraversal(((childKey, childMergeTree) => {
                    const isUnknownDeepMerge = !viewCache.serverCache.isCompleteForChild(childKey) && null === childMergeTree.value;
                    if (!serverNode.hasChild(childKey) && !isUnknownDeepMerge) {
                        const serverChild = viewCache.serverCache.getNode().getImmediateChild(childKey);
                        const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childMergeTree);
                        curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
                    }
                }));
                return curViewCache;
            }
            function viewProcessorAckUserWrite(viewProcessor, viewCache, ackPath, affectedTree, writesCache, completeCache, accumulator) {
                if (null != writeTreeRefShadowingWrite(writesCache, ackPath)) return viewCache;
                const filterServerNode = viewCache.serverCache.isFiltered();
                const serverCache = viewCache.serverCache;
                if (null != affectedTree.value) if (pathIsEmpty(ackPath) && serverCache.isFullyInitialized() || serverCache.isCompleteForPath(ackPath)) return viewProcessorApplyServerOverwrite(viewProcessor, viewCache, ackPath, serverCache.getNode().getChild(ackPath), writesCache, completeCache, filterServerNode, accumulator); else if (pathIsEmpty(ackPath)) {
                    let changedChildren = new ImmutableTree(null);
                    serverCache.getNode().forEachChild(KEY_INDEX, ((name, node) => {
                        changedChildren = changedChildren.set(new Path(name), node);
                    }));
                    return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
                } else return viewCache; else {
                    let changedChildren = new ImmutableTree(null);
                    affectedTree.foreach(((mergePath, value) => {
                        const serverCachePath = pathChild(ackPath, mergePath);
                        if (serverCache.isCompleteForPath(serverCachePath)) changedChildren = changedChildren.set(mergePath, serverCache.getNode().getChild(serverCachePath));
                    }));
                    return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
                }
            }
            function viewProcessorListenComplete(viewProcessor, viewCache, path, writesCache, accumulator) {
                const oldServerNode = viewCache.serverCache;
                const newViewCache = viewCacheUpdateServerSnap(viewCache, oldServerNode.getNode(), oldServerNode.isFullyInitialized() || pathIsEmpty(path), oldServerNode.isFiltered());
                return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache, path, writesCache, NO_COMPLETE_CHILD_SOURCE, accumulator);
            }
            function viewProcessorRevertUserWrite(viewProcessor, viewCache, path, writesCache, completeServerCache, accumulator) {
                let complete;
                if (null != writeTreeRefShadowingWrite(writesCache, path)) return viewCache; else {
                    const source = new WriteTreeCompleteChildSource(writesCache, viewCache, completeServerCache);
                    const oldEventCache = viewCache.eventCache.getNode();
                    let newEventCache;
                    if (pathIsEmpty(path) || ".priority" === pathGetFront(path)) {
                        let newNode;
                        if (viewCache.serverCache.isFullyInitialized()) newNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache)); else {
                            const serverChildren = viewCache.serverCache.getNode();
                            (0, dist_index_esm2017.hu)(serverChildren instanceof ChildrenNode, "serverChildren would be complete if leaf node");
                            newNode = writeTreeRefCalcCompleteEventChildren(writesCache, serverChildren);
                        }
                        newNode = newNode;
                        newEventCache = viewProcessor.filter.updateFullNode(oldEventCache, newNode, accumulator);
                    } else {
                        const childKey = pathGetFront(path);
                        let newChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
                        if (null == newChild && viewCache.serverCache.isCompleteForChild(childKey)) newChild = oldEventCache.getImmediateChild(childKey);
                        if (null != newChild) newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, newChild, pathPopFront(path), source, accumulator); else if (viewCache.eventCache.getNode().hasChild(childKey)) newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, ChildrenNode.EMPTY_NODE, pathPopFront(path), source, accumulator); else newEventCache = oldEventCache;
                        if (newEventCache.isEmpty() && viewCache.serverCache.isFullyInitialized()) {
                            complete = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
                            if (complete.isLeafNode()) newEventCache = viewProcessor.filter.updateFullNode(newEventCache, complete, accumulator);
                        }
                    }
                    complete = viewCache.serverCache.isFullyInitialized() || null != writeTreeRefShadowingWrite(writesCache, newEmptyPath());
                    return viewCacheUpdateEventSnap(viewCache, newEventCache, complete, viewProcessor.filter.filtersNodes());
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class View {
                constructor(query_, initialViewCache) {
                    this.query_ = query_;
                    this.eventRegistrations_ = [];
                    const params = this.query_._queryParams;
                    const indexFilter = new IndexedFilter(params.getIndex());
                    const filter = queryParamsGetNodeFilter(params);
                    this.processor_ = newViewProcessor(filter);
                    const initialServerCache = initialViewCache.serverCache;
                    const initialEventCache = initialViewCache.eventCache;
                    const serverSnap = indexFilter.updateFullNode(ChildrenNode.EMPTY_NODE, initialServerCache.getNode(), null);
                    const eventSnap = filter.updateFullNode(ChildrenNode.EMPTY_NODE, initialEventCache.getNode(), null);
                    const newServerCache = new CacheNode(serverSnap, initialServerCache.isFullyInitialized(), indexFilter.filtersNodes());
                    const newEventCache = new CacheNode(eventSnap, initialEventCache.isFullyInitialized(), filter.filtersNodes());
                    this.viewCache_ = newViewCache(newEventCache, newServerCache);
                    this.eventGenerator_ = new EventGenerator(this.query_);
                }
                get query() {
                    return this.query_;
                }
            }
            function viewGetServerCache(view) {
                return view.viewCache_.serverCache.getNode();
            }
            function viewGetCompleteNode(view) {
                return viewCacheGetCompleteEventSnap(view.viewCache_);
            }
            function viewGetCompleteServerCache(view, path) {
                const cache = viewCacheGetCompleteServerSnap(view.viewCache_);
                if (cache) if (view.query._queryParams.loadsAllData() || !pathIsEmpty(path) && !cache.getImmediateChild(pathGetFront(path)).isEmpty()) return cache.getChild(path);
                return null;
            }
            function viewIsEmpty(view) {
                return 0 === view.eventRegistrations_.length;
            }
            function viewAddEventRegistration(view, eventRegistration) {
                view.eventRegistrations_.push(eventRegistration);
            }
            function viewRemoveEventRegistration(view, eventRegistration, cancelError) {
                const cancelEvents = [];
                if (cancelError) {
                    (0, dist_index_esm2017.hu)(null == eventRegistration, "A cancel should cancel all event registrations.");
                    const path = view.query._path;
                    view.eventRegistrations_.forEach((registration => {
                        const maybeEvent = registration.createCancelEvent(cancelError, path);
                        if (maybeEvent) cancelEvents.push(maybeEvent);
                    }));
                }
                if (eventRegistration) {
                    let remaining = [];
                    for (let i = 0; i < view.eventRegistrations_.length; ++i) {
                        const existing = view.eventRegistrations_[i];
                        if (!existing.matches(eventRegistration)) remaining.push(existing); else if (eventRegistration.hasAnyCallback()) {
                            remaining = remaining.concat(view.eventRegistrations_.slice(i + 1));
                            break;
                        }
                    }
                    view.eventRegistrations_ = remaining;
                } else view.eventRegistrations_ = [];
                return cancelEvents;
            }
            function viewApplyOperation(view, operation, writesCache, completeServerCache) {
                if (operation.type === OperationType.MERGE && null !== operation.source.queryId) {
                    (0, dist_index_esm2017.hu)(viewCacheGetCompleteServerSnap(view.viewCache_), "We should always have a full cache before handling merges");
                    (0, dist_index_esm2017.hu)(viewCacheGetCompleteEventSnap(view.viewCache_), "Missing event cache, even though we have a server cache");
                }
                const oldViewCache = view.viewCache_;
                const result = viewProcessorApplyOperation(view.processor_, oldViewCache, operation, writesCache, completeServerCache);
                viewProcessorAssertIndexed(view.processor_, result.viewCache);
                (0, dist_index_esm2017.hu)(result.viewCache.serverCache.isFullyInitialized() || !oldViewCache.serverCache.isFullyInitialized(), "Once a server snap is complete, it should never go back");
                view.viewCache_ = result.viewCache;
                return viewGenerateEventsForChanges_(view, result.changes, result.viewCache.eventCache.getNode(), null);
            }
            function viewGetInitialEvents(view, registration) {
                const eventSnap = view.viewCache_.eventCache;
                const initialChanges = [];
                if (!eventSnap.getNode().isLeafNode()) {
                    const eventNode = eventSnap.getNode();
                    eventNode.forEachChild(PRIORITY_INDEX, ((key, childNode) => {
                        initialChanges.push(changeChildAdded(key, childNode));
                    }));
                }
                if (eventSnap.isFullyInitialized()) initialChanges.push(changeValue(eventSnap.getNode()));
                return viewGenerateEventsForChanges_(view, initialChanges, eventSnap.getNode(), registration);
            }
            function viewGenerateEventsForChanges_(view, changes, eventCache, eventRegistration) {
                const registrations = eventRegistration ? [ eventRegistration ] : view.eventRegistrations_;
                return eventGeneratorGenerateEventsForChanges(view.eventGenerator_, changes, eventCache, registrations);
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let referenceConstructor$1;
            class SyncPoint {
                constructor() {
                    this.views = new Map;
                }
            }
            function syncPointSetReferenceConstructor(val) {
                (0, dist_index_esm2017.hu)(!referenceConstructor$1, "__referenceConstructor has already been defined");
                referenceConstructor$1 = val;
            }
            function syncPointGetReferenceConstructor() {
                (0, dist_index_esm2017.hu)(referenceConstructor$1, "Reference.ts has not been loaded");
                return referenceConstructor$1;
            }
            function syncPointIsEmpty(syncPoint) {
                return 0 === syncPoint.views.size;
            }
            function syncPointApplyOperation(syncPoint, operation, writesCache, optCompleteServerCache) {
                const queryId = operation.source.queryId;
                if (null !== queryId) {
                    const view = syncPoint.views.get(queryId);
                    (0, dist_index_esm2017.hu)(null != view, "SyncTree gave us an op for an invalid query.");
                    return viewApplyOperation(view, operation, writesCache, optCompleteServerCache);
                } else {
                    let events = [];
                    for (const view of syncPoint.views.values()) events = events.concat(viewApplyOperation(view, operation, writesCache, optCompleteServerCache));
                    return events;
                }
            }
            function syncPointGetView(syncPoint, query, writesCache, serverCache, serverCacheComplete) {
                const queryId = query._queryIdentifier;
                const view = syncPoint.views.get(queryId);
                if (!view) {
                    let eventCache = writeTreeRefCalcCompleteEventCache(writesCache, serverCacheComplete ? serverCache : null);
                    let eventCacheComplete = false;
                    if (eventCache) eventCacheComplete = true; else if (serverCache instanceof ChildrenNode) {
                        eventCache = writeTreeRefCalcCompleteEventChildren(writesCache, serverCache);
                        eventCacheComplete = false;
                    } else {
                        eventCache = ChildrenNode.EMPTY_NODE;
                        eventCacheComplete = false;
                    }
                    const viewCache = newViewCache(new CacheNode(eventCache, eventCacheComplete, false), new CacheNode(serverCache, serverCacheComplete, false));
                    return new View(query, viewCache);
                }
                return view;
            }
            function syncPointAddEventRegistration(syncPoint, query, eventRegistration, writesCache, serverCache, serverCacheComplete) {
                const view = syncPointGetView(syncPoint, query, writesCache, serverCache, serverCacheComplete);
                if (!syncPoint.views.has(query._queryIdentifier)) syncPoint.views.set(query._queryIdentifier, view);
                viewAddEventRegistration(view, eventRegistration);
                return viewGetInitialEvents(view, eventRegistration);
            }
            function syncPointRemoveEventRegistration(syncPoint, query, eventRegistration, cancelError) {
                const queryId = query._queryIdentifier;
                const removed = [];
                let cancelEvents = [];
                const hadCompleteView = syncPointHasCompleteView(syncPoint);
                if ("default" === queryId) for (const [viewQueryId, view] of syncPoint.views.entries()) {
                    cancelEvents = cancelEvents.concat(viewRemoveEventRegistration(view, eventRegistration, cancelError));
                    if (viewIsEmpty(view)) {
                        syncPoint.views.delete(viewQueryId);
                        if (!view.query._queryParams.loadsAllData()) removed.push(view.query);
                    }
                } else {
                    const view = syncPoint.views.get(queryId);
                    if (view) {
                        cancelEvents = cancelEvents.concat(viewRemoveEventRegistration(view, eventRegistration, cancelError));
                        if (viewIsEmpty(view)) {
                            syncPoint.views.delete(queryId);
                            if (!view.query._queryParams.loadsAllData()) removed.push(view.query);
                        }
                    }
                }
                if (hadCompleteView && !syncPointHasCompleteView(syncPoint)) removed.push(new (syncPointGetReferenceConstructor())(query._repo, query._path));
                return {
                    removed,
                    events: cancelEvents
                };
            }
            function syncPointGetQueryViews(syncPoint) {
                const result = [];
                for (const view of syncPoint.views.values()) if (!view.query._queryParams.loadsAllData()) result.push(view);
                return result;
            }
            function syncPointGetCompleteServerCache(syncPoint, path) {
                let serverCache = null;
                for (const view of syncPoint.views.values()) serverCache = serverCache || viewGetCompleteServerCache(view, path);
                return serverCache;
            }
            function syncPointViewForQuery(syncPoint, query) {
                const params = query._queryParams;
                if (params.loadsAllData()) return syncPointGetCompleteView(syncPoint); else {
                    const queryId = query._queryIdentifier;
                    return syncPoint.views.get(queryId);
                }
            }
            function syncPointViewExistsForQuery(syncPoint, query) {
                return null != syncPointViewForQuery(syncPoint, query);
            }
            function syncPointHasCompleteView(syncPoint) {
                return null != syncPointGetCompleteView(syncPoint);
            }
            function syncPointGetCompleteView(syncPoint) {
                for (const view of syncPoint.views.values()) if (view.query._queryParams.loadsAllData()) return view;
                return null;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            let referenceConstructor;
            function syncTreeSetReferenceConstructor(val) {
                (0, dist_index_esm2017.hu)(!referenceConstructor, "__referenceConstructor has already been defined");
                referenceConstructor = val;
            }
            function syncTreeGetReferenceConstructor() {
                (0, dist_index_esm2017.hu)(referenceConstructor, "Reference.ts has not been loaded");
                return referenceConstructor;
            }
            let syncTreeNextQueryTag_ = 1;
            class SyncTree {
                constructor(listenProvider_) {
                    this.listenProvider_ = listenProvider_;
                    this.syncPointTree_ = new ImmutableTree(null);
                    this.pendingWriteTree_ = newWriteTree();
                    this.tagToQueryMap = new Map;
                    this.queryToTagMap = new Map;
                }
            }
            function syncTreeApplyUserOverwrite(syncTree, path, newData, writeId, visible) {
                writeTreeAddOverwrite(syncTree.pendingWriteTree_, path, newData, writeId, visible);
                if (!visible) return []; else return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceUser(), path, newData));
            }
            function syncTreeApplyUserMerge(syncTree, path, changedChildren, writeId) {
                writeTreeAddMerge(syncTree.pendingWriteTree_, path, changedChildren, writeId);
                const changeTree = ImmutableTree.fromObject(changedChildren);
                return syncTreeApplyOperationToSyncPoints_(syncTree, new Merge(newOperationSourceUser(), path, changeTree));
            }
            function syncTreeAckUserWrite(syncTree, writeId, revert = false) {
                const write = writeTreeGetWrite(syncTree.pendingWriteTree_, writeId);
                const needToReevaluate = writeTreeRemoveWrite(syncTree.pendingWriteTree_, writeId);
                if (!needToReevaluate) return []; else {
                    let affectedTree = new ImmutableTree(null);
                    if (null != write.snap) affectedTree = affectedTree.set(newEmptyPath(), true); else each(write.children, (pathString => {
                        affectedTree = affectedTree.set(new Path(pathString), true);
                    }));
                    return syncTreeApplyOperationToSyncPoints_(syncTree, new AckUserWrite(write.path, affectedTree, revert));
                }
            }
            function syncTreeApplyServerOverwrite(syncTree, path, newData) {
                return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceServer(), path, newData));
            }
            function syncTreeApplyServerMerge(syncTree, path, changedChildren) {
                const changeTree = ImmutableTree.fromObject(changedChildren);
                return syncTreeApplyOperationToSyncPoints_(syncTree, new Merge(newOperationSourceServer(), path, changeTree));
            }
            function syncTreeApplyListenComplete(syncTree, path) {
                return syncTreeApplyOperationToSyncPoints_(syncTree, new ListenComplete(newOperationSourceServer(), path));
            }
            function syncTreeApplyTaggedListenComplete(syncTree, path, tag) {
                const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
                if (queryKey) {
                    const r = syncTreeParseQueryKey_(queryKey);
                    const queryPath = r.path, queryId = r.queryId;
                    const relativePath = newRelativePath(queryPath, path);
                    const op = new ListenComplete(newOperationSourceServerTaggedQuery(queryId), relativePath);
                    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
                } else return [];
            }
            function syncTreeRemoveEventRegistration(syncTree, query, eventRegistration, cancelError, skipListenerDedup = false) {
                const path = query._path;
                const maybeSyncPoint = syncTree.syncPointTree_.get(path);
                let cancelEvents = [];
                if (maybeSyncPoint && ("default" === query._queryIdentifier || syncPointViewExistsForQuery(maybeSyncPoint, query))) {
                    const removedAndEvents = syncPointRemoveEventRegistration(maybeSyncPoint, query, eventRegistration, cancelError);
                    if (syncPointIsEmpty(maybeSyncPoint)) syncTree.syncPointTree_ = syncTree.syncPointTree_.remove(path);
                    const removed = removedAndEvents.removed;
                    cancelEvents = removedAndEvents.events;
                    if (!skipListenerDedup) {
                        const removingDefault = -1 !== removed.findIndex((query => query._queryParams.loadsAllData()));
                        const covered = syncTree.syncPointTree_.findOnPath(path, ((relativePath, parentSyncPoint) => syncPointHasCompleteView(parentSyncPoint)));
                        if (removingDefault && !covered) {
                            const subtree = syncTree.syncPointTree_.subtree(path);
                            if (!subtree.isEmpty()) {
                                const newViews = syncTreeCollectDistinctViewsForSubTree_(subtree);
                                for (let i = 0; i < newViews.length; ++i) {
                                    const view = newViews[i], newQuery = view.query;
                                    const listener = syncTreeCreateListenerForView_(syncTree, view);
                                    syncTree.listenProvider_.startListening(syncTreeQueryForListening_(newQuery), syncTreeTagForQuery(syncTree, newQuery), listener.hashFn, listener.onComplete);
                                }
                            }
                        }
                        if (!covered && removed.length > 0 && !cancelError) if (removingDefault) {
                            const defaultTag = null;
                            syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(query), defaultTag);
                        } else removed.forEach((queryToRemove => {
                            const tagToRemove = syncTree.queryToTagMap.get(syncTreeMakeQueryKey_(queryToRemove));
                            syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(queryToRemove), tagToRemove);
                        }));
                    }
                    syncTreeRemoveTags_(syncTree, removed);
                }
                return cancelEvents;
            }
            function syncTreeApplyTaggedQueryOverwrite(syncTree, path, snap, tag) {
                const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
                if (null != queryKey) {
                    const r = syncTreeParseQueryKey_(queryKey);
                    const queryPath = r.path, queryId = r.queryId;
                    const relativePath = newRelativePath(queryPath, path);
                    const op = new Overwrite(newOperationSourceServerTaggedQuery(queryId), relativePath, snap);
                    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
                } else return [];
            }
            function syncTreeApplyTaggedQueryMerge(syncTree, path, changedChildren, tag) {
                const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
                if (queryKey) {
                    const r = syncTreeParseQueryKey_(queryKey);
                    const queryPath = r.path, queryId = r.queryId;
                    const relativePath = newRelativePath(queryPath, path);
                    const changeTree = ImmutableTree.fromObject(changedChildren);
                    const op = new Merge(newOperationSourceServerTaggedQuery(queryId), relativePath, changeTree);
                    return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
                } else return [];
            }
            function syncTreeAddEventRegistration(syncTree, query, eventRegistration, skipSetupListener = false) {
                const path = query._path;
                let serverCache = null;
                let foundAncestorDefaultView = false;
                syncTree.syncPointTree_.foreachOnPath(path, ((pathToSyncPoint, sp) => {
                    const relativePath = newRelativePath(pathToSyncPoint, path);
                    serverCache = serverCache || syncPointGetCompleteServerCache(sp, relativePath);
                    foundAncestorDefaultView = foundAncestorDefaultView || syncPointHasCompleteView(sp);
                }));
                let syncPoint = syncTree.syncPointTree_.get(path);
                if (!syncPoint) {
                    syncPoint = new SyncPoint;
                    syncTree.syncPointTree_ = syncTree.syncPointTree_.set(path, syncPoint);
                } else {
                    foundAncestorDefaultView = foundAncestorDefaultView || syncPointHasCompleteView(syncPoint);
                    serverCache = serverCache || syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
                }
                let serverCacheComplete;
                if (null != serverCache) serverCacheComplete = true; else {
                    serverCacheComplete = false;
                    serverCache = ChildrenNode.EMPTY_NODE;
                    const subtree = syncTree.syncPointTree_.subtree(path);
                    subtree.foreachChild(((childName, childSyncPoint) => {
                        const completeCache = syncPointGetCompleteServerCache(childSyncPoint, newEmptyPath());
                        if (completeCache) serverCache = serverCache.updateImmediateChild(childName, completeCache);
                    }));
                }
                const viewAlreadyExists = syncPointViewExistsForQuery(syncPoint, query);
                if (!viewAlreadyExists && !query._queryParams.loadsAllData()) {
                    const queryKey = syncTreeMakeQueryKey_(query);
                    (0, dist_index_esm2017.hu)(!syncTree.queryToTagMap.has(queryKey), "View does not exist, but we have a tag");
                    const tag = syncTreeGetNextQueryTag_();
                    syncTree.queryToTagMap.set(queryKey, tag);
                    syncTree.tagToQueryMap.set(tag, queryKey);
                }
                const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, path);
                let events = syncPointAddEventRegistration(syncPoint, query, eventRegistration, writesCache, serverCache, serverCacheComplete);
                if (!viewAlreadyExists && !foundAncestorDefaultView && !skipSetupListener) {
                    const view = syncPointViewForQuery(syncPoint, query);
                    events = events.concat(syncTreeSetupListener_(syncTree, query, view));
                }
                return events;
            }
            function syncTreeCalcCompleteEventCache(syncTree, path, writeIdsToExclude) {
                const includeHiddenSets = true;
                const writeTree = syncTree.pendingWriteTree_;
                const serverCache = syncTree.syncPointTree_.findOnPath(path, ((pathSoFar, syncPoint) => {
                    const relativePath = newRelativePath(pathSoFar, path);
                    const serverCache = syncPointGetCompleteServerCache(syncPoint, relativePath);
                    if (serverCache) return serverCache;
                }));
                return writeTreeCalcCompleteEventCache(writeTree, path, serverCache, writeIdsToExclude, includeHiddenSets);
            }
            function syncTreeGetServerValue(syncTree, query) {
                const path = query._path;
                let serverCache = null;
                syncTree.syncPointTree_.foreachOnPath(path, ((pathToSyncPoint, sp) => {
                    const relativePath = newRelativePath(pathToSyncPoint, path);
                    serverCache = serverCache || syncPointGetCompleteServerCache(sp, relativePath);
                }));
                let syncPoint = syncTree.syncPointTree_.get(path);
                if (!syncPoint) {
                    syncPoint = new SyncPoint;
                    syncTree.syncPointTree_ = syncTree.syncPointTree_.set(path, syncPoint);
                } else serverCache = serverCache || syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
                const serverCacheComplete = null != serverCache;
                const serverCacheNode = serverCacheComplete ? new CacheNode(serverCache, true, false) : null;
                const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, query._path);
                const view = syncPointGetView(syncPoint, query, writesCache, serverCacheComplete ? serverCacheNode.getNode() : ChildrenNode.EMPTY_NODE, serverCacheComplete);
                return viewGetCompleteNode(view);
            }
            function syncTreeApplyOperationToSyncPoints_(syncTree, operation) {
                return syncTreeApplyOperationHelper_(operation, syncTree.syncPointTree_, null, writeTreeChildWrites(syncTree.pendingWriteTree_, newEmptyPath()));
            }
            function syncTreeApplyOperationHelper_(operation, syncPointTree, serverCache, writesCache) {
                if (pathIsEmpty(operation.path)) return syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache); else {
                    const syncPoint = syncPointTree.get(newEmptyPath());
                    if (null == serverCache && null != syncPoint) serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
                    let events = [];
                    const childName = pathGetFront(operation.path);
                    const childOperation = operation.operationForChild(childName);
                    const childTree = syncPointTree.children.get(childName);
                    if (childTree && childOperation) {
                        const childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
                        const childWritesCache = writeTreeRefChild(writesCache, childName);
                        events = events.concat(syncTreeApplyOperationHelper_(childOperation, childTree, childServerCache, childWritesCache));
                    }
                    if (syncPoint) events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
                    return events;
                }
            }
            function syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache) {
                const syncPoint = syncPointTree.get(newEmptyPath());
                if (null == serverCache && null != syncPoint) serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
                let events = [];
                syncPointTree.children.inorderTraversal(((childName, childTree) => {
                    const childServerCache = serverCache ? serverCache.getImmediateChild(childName) : null;
                    const childWritesCache = writeTreeRefChild(writesCache, childName);
                    const childOperation = operation.operationForChild(childName);
                    if (childOperation) events = events.concat(syncTreeApplyOperationDescendantsHelper_(childOperation, childTree, childServerCache, childWritesCache));
                }));
                if (syncPoint) events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
                return events;
            }
            function syncTreeCreateListenerForView_(syncTree, view) {
                const query = view.query;
                const tag = syncTreeTagForQuery(syncTree, query);
                return {
                    hashFn: () => {
                        const cache = viewGetServerCache(view) || ChildrenNode.EMPTY_NODE;
                        return cache.hash();
                    },
                    onComplete: status => {
                        if ("ok" === status) if (tag) return syncTreeApplyTaggedListenComplete(syncTree, query._path, tag); else return syncTreeApplyListenComplete(syncTree, query._path); else {
                            const error = errorForServerCode(status, query);
                            return syncTreeRemoveEventRegistration(syncTree, query, null, error);
                        }
                    }
                };
            }
            function syncTreeTagForQuery(syncTree, query) {
                const queryKey = syncTreeMakeQueryKey_(query);
                return syncTree.queryToTagMap.get(queryKey);
            }
            function syncTreeMakeQueryKey_(query) {
                return query._path.toString() + "$" + query._queryIdentifier;
            }
            function syncTreeQueryKeyForTag_(syncTree, tag) {
                return syncTree.tagToQueryMap.get(tag);
            }
            function syncTreeParseQueryKey_(queryKey) {
                const splitIndex = queryKey.indexOf("$");
                (0, dist_index_esm2017.hu)(-1 !== splitIndex && splitIndex < queryKey.length - 1, "Bad queryKey.");
                return {
                    queryId: queryKey.substr(splitIndex + 1),
                    path: new Path(queryKey.substr(0, splitIndex))
                };
            }
            function syncTreeApplyTaggedOperation_(syncTree, queryPath, operation) {
                const syncPoint = syncTree.syncPointTree_.get(queryPath);
                (0, dist_index_esm2017.hu)(syncPoint, "Missing sync point for query tag that we're tracking");
                const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, queryPath);
                return syncPointApplyOperation(syncPoint, operation, writesCache, null);
            }
            function syncTreeCollectDistinctViewsForSubTree_(subtree) {
                return subtree.fold(((relativePath, maybeChildSyncPoint, childMap) => {
                    if (maybeChildSyncPoint && syncPointHasCompleteView(maybeChildSyncPoint)) {
                        const completeView = syncPointGetCompleteView(maybeChildSyncPoint);
                        return [ completeView ];
                    } else {
                        let views = [];
                        if (maybeChildSyncPoint) views = syncPointGetQueryViews(maybeChildSyncPoint);
                        each(childMap, ((_key, childViews) => {
                            views = views.concat(childViews);
                        }));
                        return views;
                    }
                }));
            }
            function syncTreeQueryForListening_(query) {
                if (query._queryParams.loadsAllData() && !query._queryParams.isDefault()) return new (syncTreeGetReferenceConstructor())(query._repo, query._path); else return query;
            }
            function syncTreeRemoveTags_(syncTree, queries) {
                for (let j = 0; j < queries.length; ++j) {
                    const removedQuery = queries[j];
                    if (!removedQuery._queryParams.loadsAllData()) {
                        const removedQueryKey = syncTreeMakeQueryKey_(removedQuery);
                        const removedQueryTag = syncTree.queryToTagMap.get(removedQueryKey);
                        syncTree.queryToTagMap.delete(removedQueryKey);
                        syncTree.tagToQueryMap.delete(removedQueryTag);
                    }
                }
            }
            function syncTreeGetNextQueryTag_() {
                return syncTreeNextQueryTag_++;
            }
            function syncTreeSetupListener_(syncTree, query, view) {
                const path = query._path;
                const tag = syncTreeTagForQuery(syncTree, query);
                const listener = syncTreeCreateListenerForView_(syncTree, view);
                const events = syncTree.listenProvider_.startListening(syncTreeQueryForListening_(query), tag, listener.hashFn, listener.onComplete);
                const subtree = syncTree.syncPointTree_.subtree(path);
                if (tag) (0, dist_index_esm2017.hu)(!syncPointHasCompleteView(subtree.value), "If we're adding a query, it shouldn't be shadowed"); else {
                    const queriesToStop = subtree.fold(((relativePath, maybeChildSyncPoint, childMap) => {
                        if (!pathIsEmpty(relativePath) && maybeChildSyncPoint && syncPointHasCompleteView(maybeChildSyncPoint)) return [ syncPointGetCompleteView(maybeChildSyncPoint).query ]; else {
                            let queries = [];
                            if (maybeChildSyncPoint) queries = queries.concat(syncPointGetQueryViews(maybeChildSyncPoint).map((view => view.query)));
                            each(childMap, ((_key, childQueries) => {
                                queries = queries.concat(childQueries);
                            }));
                            return queries;
                        }
                    }));
                    for (let i = 0; i < queriesToStop.length; ++i) {
                        const queryToStop = queriesToStop[i];
                        syncTree.listenProvider_.stopListening(syncTreeQueryForListening_(queryToStop), syncTreeTagForQuery(syncTree, queryToStop));
                    }
                }
                return events;
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ExistingValueProvider {
                constructor(node_) {
                    this.node_ = node_;
                }
                getImmediateChild(childName) {
                    const child = this.node_.getImmediateChild(childName);
                    return new ExistingValueProvider(child);
                }
                node() {
                    return this.node_;
                }
            }
            class DeferredValueProvider {
                constructor(syncTree, path) {
                    this.syncTree_ = syncTree;
                    this.path_ = path;
                }
                getImmediateChild(childName) {
                    const childPath = pathChild(this.path_, childName);
                    return new DeferredValueProvider(this.syncTree_, childPath);
                }
                node() {
                    return syncTreeCalcCompleteEventCache(this.syncTree_, this.path_);
                }
            }
            const generateWithValues = function(values) {
                values = values || {};
                values["timestamp"] = values["timestamp"] || (new Date).getTime();
                return values;
            };
            const resolveDeferredLeafValue = function(value, existingVal, serverValues) {
                if (!value || "object" !== typeof value) return value;
                (0, dist_index_esm2017.hu)(".sv" in value, "Unexpected leaf node or priority contents");
                if ("string" === typeof value[".sv"]) return resolveScalarDeferredValue(value[".sv"], existingVal, serverValues); else if ("object" === typeof value[".sv"]) return resolveComplexDeferredValue(value[".sv"], existingVal); else (0, 
                dist_index_esm2017.hu)(false, "Unexpected server value: " + JSON.stringify(value, null, 2));
            };
            const resolveScalarDeferredValue = function(op, existing, serverValues) {
                switch (op) {
                  case "timestamp":
                    return serverValues["timestamp"];

                  default:
                    (0, dist_index_esm2017.hu)(false, "Unexpected server value: " + op);
                }
            };
            const resolveComplexDeferredValue = function(op, existing, unused) {
                if (!op.hasOwnProperty("increment")) (0, dist_index_esm2017.hu)(false, "Unexpected server value: " + JSON.stringify(op, null, 2));
                const delta = op["increment"];
                if ("number" !== typeof delta) (0, dist_index_esm2017.hu)(false, "Unexpected increment value: " + delta);
                const existingNode = existing.node();
                (0, dist_index_esm2017.hu)(null !== existingNode && "undefined" !== typeof existingNode, "Expected ChildrenNode.EMPTY_NODE for nulls");
                if (!existingNode.isLeafNode()) return delta;
                const leaf = existingNode;
                const existingVal = leaf.getValue();
                if ("number" !== typeof existingVal) return delta;
                return existingVal + delta;
            };
            const resolveDeferredValueTree = function(path, node, syncTree, serverValues) {
                return resolveDeferredValue(node, new DeferredValueProvider(syncTree, path), serverValues);
            };
            const resolveDeferredValueSnapshot = function(node, existing, serverValues) {
                return resolveDeferredValue(node, new ExistingValueProvider(existing), serverValues);
            };
            function resolveDeferredValue(node, existingVal, serverValues) {
                const rawPri = node.getPriority().val();
                const priority = resolveDeferredLeafValue(rawPri, existingVal.getImmediateChild(".priority"), serverValues);
                let newNode;
                if (node.isLeafNode()) {
                    const leafNode = node;
                    const value = resolveDeferredLeafValue(leafNode.getValue(), existingVal, serverValues);
                    if (value !== leafNode.getValue() || priority !== leafNode.getPriority().val()) return new LeafNode(value, nodeFromJSON(priority)); else return node;
                } else {
                    const childrenNode = node;
                    newNode = childrenNode;
                    if (priority !== childrenNode.getPriority().val()) newNode = newNode.updatePriority(new LeafNode(priority));
                    childrenNode.forEachChild(PRIORITY_INDEX, ((childName, childNode) => {
                        const newChildNode = resolveDeferredValue(childNode, existingVal.getImmediateChild(childName), serverValues);
                        if (newChildNode !== childNode) newNode = newNode.updateImmediateChild(childName, newChildNode);
                    }));
                    return newNode;
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Tree {
                constructor(name = "", parent = null, node = {
                    children: {},
                    childCount: 0
                }) {
                    this.name = name;
                    this.parent = parent;
                    this.node = node;
                }
            }
            function treeSubTree(tree, pathObj) {
                let path = pathObj instanceof Path ? pathObj : new Path(pathObj);
                let child = tree, next = pathGetFront(path);
                while (null !== next) {
                    const childNode = (0, dist_index_esm2017.DV)(child.node.children, next) || {
                        children: {},
                        childCount: 0
                    };
                    child = new Tree(next, child, childNode);
                    path = pathPopFront(path);
                    next = pathGetFront(path);
                }
                return child;
            }
            function treeGetValue(tree) {
                return tree.node.value;
            }
            function treeSetValue(tree, value) {
                tree.node.value = value;
                treeUpdateParents(tree);
            }
            function treeHasChildren(tree) {
                return tree.node.childCount > 0;
            }
            function treeIsEmpty(tree) {
                return void 0 === treeGetValue(tree) && !treeHasChildren(tree);
            }
            function treeForEachChild(tree, action) {
                each(tree.node.children, ((child, childTree) => {
                    action(new Tree(child, tree, childTree));
                }));
            }
            function treeForEachDescendant(tree, action, includeSelf, childrenFirst) {
                if (includeSelf && !childrenFirst) action(tree);
                treeForEachChild(tree, (child => {
                    treeForEachDescendant(child, action, true, childrenFirst);
                }));
                if (includeSelf && childrenFirst) action(tree);
            }
            function treeForEachAncestor(tree, action, includeSelf) {
                let node = includeSelf ? tree : tree.parent;
                while (null !== node) {
                    if (action(node)) return true;
                    node = node.parent;
                }
                return false;
            }
            function treeGetPath(tree) {
                return new Path(null === tree.parent ? tree.name : treeGetPath(tree.parent) + "/" + tree.name);
            }
            function treeUpdateParents(tree) {
                if (null !== tree.parent) treeUpdateChild(tree.parent, tree.name, tree);
            }
            function treeUpdateChild(tree, childName, child) {
                const childEmpty = treeIsEmpty(child);
                const childExists = (0, dist_index_esm2017.r3)(tree.node.children, childName);
                if (childEmpty && childExists) {
                    delete tree.node.children[childName];
                    tree.node.childCount--;
                    treeUpdateParents(tree);
                } else if (!childEmpty && !childExists) {
                    tree.node.children[childName] = child.node;
                    tree.node.childCount++;
                    treeUpdateParents(tree);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const INVALID_KEY_REGEX_ = /[\[\].#$\/\u0000-\u001F\u007F]/;
            const INVALID_PATH_REGEX_ = /[\[\].#$\u0000-\u001F\u007F]/;
            const MAX_LEAF_SIZE_ = 10 * 1024 * 1024;
            const isValidKey = function(key) {
                return "string" === typeof key && 0 !== key.length && !INVALID_KEY_REGEX_.test(key);
            };
            const isValidPathString = function(pathString) {
                return "string" === typeof pathString && 0 !== pathString.length && !INVALID_PATH_REGEX_.test(pathString);
            };
            const isValidRootPathString = function(pathString) {
                if (pathString) pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
                return isValidPathString(pathString);
            };
            const isValidPriority = function(priority) {
                return null === priority || "string" === typeof priority || "number" === typeof priority && !isInvalidJSONNumber(priority) || priority && "object" === typeof priority && (0, 
                dist_index_esm2017.r3)(priority, ".sv");
            };
            const validateFirebaseDataArg = function(fnName, value, path, optional) {
                if (optional && void 0 === value) return;
                validateFirebaseData((0, dist_index_esm2017.gK)(fnName, "value"), value, path);
            };
            const validateFirebaseData = function(errorPrefix, data, path_) {
                const path = path_ instanceof Path ? new ValidationPath(path_, errorPrefix) : path_;
                if (void 0 === data) throw new Error(errorPrefix + "contains undefined " + validationPathToErrorString(path));
                if ("function" === typeof data) throw new Error(errorPrefix + "contains a function " + validationPathToErrorString(path) + " with contents = " + data.toString());
                if (isInvalidJSONNumber(data)) throw new Error(errorPrefix + "contains " + data.toString() + " " + validationPathToErrorString(path));
                if ("string" === typeof data && data.length > MAX_LEAF_SIZE_ / 3 && (0, dist_index_esm2017.ug)(data) > MAX_LEAF_SIZE_) throw new Error(errorPrefix + "contains a string greater than " + MAX_LEAF_SIZE_ + " utf8 bytes " + validationPathToErrorString(path) + " ('" + data.substring(0, 50) + "...')");
                if (data && "object" === typeof data) {
                    let hasDotValue = false;
                    let hasActualChild = false;
                    each(data, ((key, value) => {
                        if (".value" === key) hasDotValue = true; else if (".priority" !== key && ".sv" !== key) {
                            hasActualChild = true;
                            if (!isValidKey(key)) throw new Error(errorPrefix + " contains an invalid key (" + key + ") " + validationPathToErrorString(path) + ".  Keys must be non-empty strings " + 'and can\'t contain ".", "#", "$", "/", "[", or "]"');
                        }
                        validationPathPush(path, key);
                        validateFirebaseData(errorPrefix, value, path);
                        validationPathPop(path);
                    }));
                    if (hasDotValue && hasActualChild) throw new Error(errorPrefix + ' contains ".value" child ' + validationPathToErrorString(path) + " in addition to actual children.");
                }
            };
            const validateFirebaseMergePaths = function(errorPrefix, mergePaths) {
                let i, curPath;
                for (i = 0; i < mergePaths.length; i++) {
                    curPath = mergePaths[i];
                    const keys = pathSlice(curPath);
                    for (let j = 0; j < keys.length; j++) if (".priority" === keys[j] && j === keys.length - 1) ; else if (!isValidKey(keys[j])) throw new Error(errorPrefix + "contains an invalid key (" + keys[j] + ") in path " + curPath.toString() + ". Keys must be non-empty strings " + 'and can\'t contain ".", "#", "$", "/", "[", or "]"');
                }
                mergePaths.sort(pathCompare);
                let prevPath = null;
                for (i = 0; i < mergePaths.length; i++) {
                    curPath = mergePaths[i];
                    if (null !== prevPath && pathContains(prevPath, curPath)) throw new Error(errorPrefix + "contains a path " + prevPath.toString() + " that is ancestor of another path " + curPath.toString());
                    prevPath = curPath;
                }
            };
            const validateFirebaseMergeDataArg = function(fnName, data, path, optional) {
                if (optional && void 0 === data) return;
                const errorPrefix$1 = (0, dist_index_esm2017.gK)(fnName, "values");
                if (!(data && "object" === typeof data) || Array.isArray(data)) throw new Error(errorPrefix$1 + " must be an object containing the children to replace.");
                const mergePaths = [];
                each(data, ((key, value) => {
                    const curPath = new Path(key);
                    validateFirebaseData(errorPrefix$1, value, pathChild(path, curPath));
                    if (".priority" === pathGetBack(curPath)) if (!isValidPriority(value)) throw new Error(errorPrefix$1 + "contains an invalid value for '" + curPath.toString() + "', which must be a valid " + "Firebase priority (a string, finite number, server value, or null).");
                    mergePaths.push(curPath);
                }));
                validateFirebaseMergePaths(errorPrefix$1, mergePaths);
            };
            const validatePathString = function(fnName, argumentName, pathString, optional) {
                if (optional && void 0 === pathString) return;
                if (!isValidPathString(pathString)) throw new Error((0, dist_index_esm2017.gK)(fnName, argumentName) + 'was an invalid path = "' + pathString + '". Paths must be non-empty strings and ' + 'can\'t contain ".", "#", "$", "[", or "]"');
            };
            const validateRootPathString = function(fnName, argumentName, pathString, optional) {
                if (pathString) pathString = pathString.replace(/^\/*\.info(\/|$)/, "/");
                validatePathString(fnName, argumentName, pathString, optional);
            };
            const validateWritablePath = function(fnName, path) {
                if (".info" === pathGetFront(path)) throw new Error(fnName + " failed = Can't modify data under /.info/");
            };
            const validateUrl = function(fnName, parsedUrl) {
                const pathString = parsedUrl.path.toString();
                if (!("string" === typeof parsedUrl.repoInfo.host) || 0 === parsedUrl.repoInfo.host.length || !isValidKey(parsedUrl.repoInfo.namespace) && "localhost" !== parsedUrl.repoInfo.host.split(":")[0] || 0 !== pathString.length && !isValidRootPathString(pathString)) throw new Error((0, 
                dist_index_esm2017.gK)(fnName, "url") + "must be a valid firebase URL and " + 'the path can\'t contain ".", "#", "$", "[", or "]".');
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class EventQueue {
                constructor() {
                    this.eventLists_ = [];
                    this.recursionDepth_ = 0;
                }
            }
            function eventQueueQueueEvents(eventQueue, eventDataList) {
                let currList = null;
                for (let i = 0; i < eventDataList.length; i++) {
                    const data = eventDataList[i];
                    const path = data.getPath();
                    if (null !== currList && !pathEquals(path, currList.path)) {
                        eventQueue.eventLists_.push(currList);
                        currList = null;
                    }
                    if (null === currList) currList = {
                        events: [],
                        path
                    };
                    currList.events.push(data);
                }
                if (currList) eventQueue.eventLists_.push(currList);
            }
            function eventQueueRaiseEventsForChangedPath(eventQueue, changedPath, eventDataList) {
                eventQueueQueueEvents(eventQueue, eventDataList);
                eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, (eventPath => pathContains(eventPath, changedPath) || pathContains(changedPath, eventPath)));
            }
            function eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, predicate) {
                eventQueue.recursionDepth_++;
                let sentAll = true;
                for (let i = 0; i < eventQueue.eventLists_.length; i++) {
                    const eventList = eventQueue.eventLists_[i];
                    if (eventList) {
                        const eventPath = eventList.path;
                        if (predicate(eventPath)) {
                            eventListRaise(eventQueue.eventLists_[i]);
                            eventQueue.eventLists_[i] = null;
                        } else sentAll = false;
                    }
                }
                if (sentAll) eventQueue.eventLists_ = [];
                eventQueue.recursionDepth_--;
            }
            function eventListRaise(eventList) {
                for (let i = 0; i < eventList.events.length; i++) {
                    const eventData = eventList.events[i];
                    if (null !== eventData) {
                        eventList.events[i] = null;
                        const eventFn = eventData.getEventRunner();
                        if (logger) log("event: " + eventData.toString());
                        exceptionGuard(eventFn);
                    }
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const INTERRUPT_REASON = "repo_interrupt";
            const MAX_TRANSACTION_RETRIES = 25;
            class Repo {
                constructor(repoInfo_, forceRestClient_, authTokenProvider_, appCheckProvider_) {
                    this.repoInfo_ = repoInfo_;
                    this.forceRestClient_ = forceRestClient_;
                    this.authTokenProvider_ = authTokenProvider_;
                    this.appCheckProvider_ = appCheckProvider_;
                    this.dataUpdateCount = 0;
                    this.statsListener_ = null;
                    this.eventQueue_ = new EventQueue;
                    this.nextWriteId_ = 1;
                    this.interceptServerDataCallback_ = null;
                    this.onDisconnect_ = newSparseSnapshotTree();
                    this.transactionQueueTree_ = new Tree;
                    this.persistentConnection_ = null;
                    this.key = this.repoInfo_.toURLString();
                }
                toString() {
                    return (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host;
                }
            }
            function repoStart(repo, appId, authOverride) {
                repo.stats_ = statsManagerGetCollection(repo.repoInfo_);
                if (repo.forceRestClient_ || beingCrawled()) {
                    repo.server_ = new ReadonlyRestClient(repo.repoInfo_, ((pathString, data, isMerge, tag) => {
                        repoOnDataUpdate(repo, pathString, data, isMerge, tag);
                    }), repo.authTokenProvider_, repo.appCheckProvider_);
                    setTimeout((() => repoOnConnectStatus(repo, true)), 0);
                } else {
                    if ("undefined" !== typeof authOverride && null !== authOverride) {
                        if ("object" !== typeof authOverride) throw new Error("Only objects are supported for option databaseAuthVariableOverride");
                        try {
                            (0, dist_index_esm2017.Pz)(authOverride);
                        } catch (e) {
                            throw new Error("Invalid authOverride provided: " + e);
                        }
                    }
                    repo.persistentConnection_ = new PersistentConnection(repo.repoInfo_, appId, ((pathString, data, isMerge, tag) => {
                        repoOnDataUpdate(repo, pathString, data, isMerge, tag);
                    }), (connectStatus => {
                        repoOnConnectStatus(repo, connectStatus);
                    }), (updates => {
                        repoOnServerInfoUpdate(repo, updates);
                    }), repo.authTokenProvider_, repo.appCheckProvider_, authOverride);
                    repo.server_ = repo.persistentConnection_;
                }
                repo.authTokenProvider_.addTokenChangeListener((token => {
                    repo.server_.refreshAuthToken(token);
                }));
                repo.appCheckProvider_.addTokenChangeListener((result => {
                    repo.server_.refreshAppCheckToken(result.token);
                }));
                repo.statsReporter_ = statsManagerGetOrCreateReporter(repo.repoInfo_, (() => new StatsReporter(repo.stats_, repo.server_)));
                repo.infoData_ = new SnapshotHolder;
                repo.infoSyncTree_ = new SyncTree({
                    startListening: (query, tag, currentHashFn, onComplete) => {
                        let infoEvents = [];
                        const node = repo.infoData_.getNode(query._path);
                        if (!node.isEmpty()) {
                            infoEvents = syncTreeApplyServerOverwrite(repo.infoSyncTree_, query._path, node);
                            setTimeout((() => {
                                onComplete("ok");
                            }), 0);
                        }
                        return infoEvents;
                    },
                    stopListening: () => {}
                });
                repoUpdateInfo(repo, "connected", false);
                repo.serverSyncTree_ = new SyncTree({
                    startListening: (query, tag, currentHashFn, onComplete) => {
                        repo.server_.listen(query, currentHashFn, tag, ((status, data) => {
                            const events = onComplete(status, data);
                            eventQueueRaiseEventsForChangedPath(repo.eventQueue_, query._path, events);
                        }));
                        return [];
                    },
                    stopListening: (query, tag) => {
                        repo.server_.unlisten(query, tag);
                    }
                });
            }
            function repoServerTime(repo) {
                const offsetNode = repo.infoData_.getNode(new Path(".info/serverTimeOffset"));
                const offset = offsetNode.val() || 0;
                return (new Date).getTime() + offset;
            }
            function repoGenerateServerValues(repo) {
                return generateWithValues({
                    timestamp: repoServerTime(repo)
                });
            }
            function repoOnDataUpdate(repo, pathString, data, isMerge, tag) {
                repo.dataUpdateCount++;
                const path = new Path(pathString);
                data = repo.interceptServerDataCallback_ ? repo.interceptServerDataCallback_(pathString, data) : data;
                let events = [];
                if (tag) if (isMerge) {
                    const taggedChildren = (0, dist_index_esm2017.UI)(data, (raw => nodeFromJSON(raw)));
                    events = syncTreeApplyTaggedQueryMerge(repo.serverSyncTree_, path, taggedChildren, tag);
                } else {
                    const taggedSnap = nodeFromJSON(data);
                    events = syncTreeApplyTaggedQueryOverwrite(repo.serverSyncTree_, path, taggedSnap, tag);
                } else if (isMerge) {
                    const changedChildren = (0, dist_index_esm2017.UI)(data, (raw => nodeFromJSON(raw)));
                    events = syncTreeApplyServerMerge(repo.serverSyncTree_, path, changedChildren);
                } else {
                    const snap = nodeFromJSON(data);
                    events = syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap);
                }
                let affectedPath = path;
                if (events.length > 0) affectedPath = repoRerunTransactions(repo, path);
                eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, events);
            }
            function repoOnConnectStatus(repo, connectStatus) {
                repoUpdateInfo(repo, "connected", connectStatus);
                if (false === connectStatus) repoRunOnDisconnectEvents(repo);
            }
            function repoOnServerInfoUpdate(repo, updates) {
                each(updates, ((key, value) => {
                    repoUpdateInfo(repo, key, value);
                }));
            }
            function repoUpdateInfo(repo, pathString, value) {
                const path = new Path("/.info/" + pathString);
                const newNode = nodeFromJSON(value);
                repo.infoData_.updateSnapshot(path, newNode);
                const events = syncTreeApplyServerOverwrite(repo.infoSyncTree_, path, newNode);
                eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
            }
            function repoGetNextWriteId(repo) {
                return repo.nextWriteId_++;
            }
            function repoGetValue(repo, query, eventRegistration) {
                const cached = syncTreeGetServerValue(repo.serverSyncTree_, query);
                if (null != cached) return Promise.resolve(cached);
                return repo.server_.get(query).then((payload => {
                    const node = nodeFromJSON(payload).withIndex(query._queryParams.getIndex());
                    syncTreeAddEventRegistration(repo.serverSyncTree_, query, eventRegistration, true);
                    let events;
                    if (query._queryParams.loadsAllData()) events = syncTreeApplyServerOverwrite(repo.serverSyncTree_, query._path, node); else {
                        const tag = syncTreeTagForQuery(repo.serverSyncTree_, query);
                        events = syncTreeApplyTaggedQueryOverwrite(repo.serverSyncTree_, query._path, node, tag);
                    }
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, query._path, events);
                    syncTreeRemoveEventRegistration(repo.serverSyncTree_, query, eventRegistration, null, true);
                    return node;
                }), (err => {
                    repoLog(repo, "get for query " + (0, dist_index_esm2017.Pz)(query) + " failed: " + err);
                    return Promise.reject(new Error(err));
                }));
            }
            function repoSetWithPriority(repo, path, newVal, newPriority, onComplete) {
                repoLog(repo, "set", {
                    path: path.toString(),
                    value: newVal,
                    priority: newPriority
                });
                const serverValues = repoGenerateServerValues(repo);
                const newNodeUnresolved = nodeFromJSON(newVal, newPriority);
                const existing = syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path);
                const newNode = resolveDeferredValueSnapshot(newNodeUnresolved, existing, serverValues);
                const writeId = repoGetNextWriteId(repo);
                const events = syncTreeApplyUserOverwrite(repo.serverSyncTree_, path, newNode, writeId, true);
                eventQueueQueueEvents(repo.eventQueue_, events);
                repo.server_.put(path.toString(), newNodeUnresolved.val(true), ((status, errorReason) => {
                    const success = "ok" === status;
                    if (!success) warn("set at " + path + " failed: " + status);
                    const clearEvents = syncTreeAckUserWrite(repo.serverSyncTree_, writeId, !success);
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, clearEvents);
                    repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
                }));
                const affectedPath = repoAbortTransactions(repo, path);
                repoRerunTransactions(repo, affectedPath);
                eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, []);
            }
            function repoUpdate(repo, path, childrenToMerge, onComplete) {
                repoLog(repo, "update", {
                    path: path.toString(),
                    value: childrenToMerge
                });
                let empty = true;
                const serverValues = repoGenerateServerValues(repo);
                const changedChildren = {};
                each(childrenToMerge, ((changedKey, changedValue) => {
                    empty = false;
                    changedChildren[changedKey] = resolveDeferredValueTree(pathChild(path, changedKey), nodeFromJSON(changedValue), repo.serverSyncTree_, serverValues);
                }));
                if (!empty) {
                    const writeId = repoGetNextWriteId(repo);
                    const events = syncTreeApplyUserMerge(repo.serverSyncTree_, path, changedChildren, writeId);
                    eventQueueQueueEvents(repo.eventQueue_, events);
                    repo.server_.merge(path.toString(), childrenToMerge, ((status, errorReason) => {
                        const success = "ok" === status;
                        if (!success) warn("update at " + path + " failed: " + status);
                        const clearEvents = syncTreeAckUserWrite(repo.serverSyncTree_, writeId, !success);
                        const affectedPath = clearEvents.length > 0 ? repoRerunTransactions(repo, path) : path;
                        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, clearEvents);
                        repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
                    }));
                    each(childrenToMerge, (changedPath => {
                        const affectedPath = repoAbortTransactions(repo, pathChild(path, changedPath));
                        repoRerunTransactions(repo, affectedPath);
                    }));
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, []);
                } else {
                    log("update() called with empty data.  Don't do anything.");
                    repoCallOnCompleteCallback(repo, onComplete, "ok", void 0);
                }
            }
            function repoRunOnDisconnectEvents(repo) {
                repoLog(repo, "onDisconnectEvents");
                const serverValues = repoGenerateServerValues(repo);
                const resolvedOnDisconnectTree = newSparseSnapshotTree();
                sparseSnapshotTreeForEachTree(repo.onDisconnect_, newEmptyPath(), ((path, node) => {
                    const resolved = resolveDeferredValueTree(path, node, repo.serverSyncTree_, serverValues);
                    sparseSnapshotTreeRemember(resolvedOnDisconnectTree, path, resolved);
                }));
                let events = [];
                sparseSnapshotTreeForEachTree(resolvedOnDisconnectTree, newEmptyPath(), ((path, snap) => {
                    events = events.concat(syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap));
                    const affectedPath = repoAbortTransactions(repo, path);
                    repoRerunTransactions(repo, affectedPath);
                }));
                repo.onDisconnect_ = newSparseSnapshotTree();
                eventQueueRaiseEventsForChangedPath(repo.eventQueue_, newEmptyPath(), events);
            }
            function repoInterrupt(repo) {
                if (repo.persistentConnection_) repo.persistentConnection_.interrupt(INTERRUPT_REASON);
            }
            function repoLog(repo, ...varArgs) {
                let prefix = "";
                if (repo.persistentConnection_) prefix = repo.persistentConnection_.id + ":";
                log(prefix, ...varArgs);
            }
            function repoCallOnCompleteCallback(repo, callback, status, errorReason) {
                if (callback) exceptionGuard((() => {
                    if ("ok" === status) callback(null); else {
                        const code = (status || "error").toUpperCase();
                        let message = code;
                        if (errorReason) message += ": " + errorReason;
                        const error = new Error(message);
                        error.code = code;
                        callback(error);
                    }
                }));
            }
            function repoGetLatestState(repo, path, excludeSets) {
                return syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path, excludeSets) || ChildrenNode.EMPTY_NODE;
            }
            function repoSendReadyTransactions(repo, node = repo.transactionQueueTree_) {
                if (!node) repoPruneCompletedTransactionsBelowNode(repo, node);
                if (treeGetValue(node)) {
                    const queue = repoBuildTransactionQueue(repo, node);
                    (0, dist_index_esm2017.hu)(queue.length > 0, "Sending zero length transaction queue");
                    const allRun = queue.every((transaction => 0 === transaction.status));
                    if (allRun) repoSendTransactionQueue(repo, treeGetPath(node), queue);
                } else if (treeHasChildren(node)) treeForEachChild(node, (childNode => {
                    repoSendReadyTransactions(repo, childNode);
                }));
            }
            function repoSendTransactionQueue(repo, path, queue) {
                const setsToIgnore = queue.map((txn => txn.currentWriteId));
                const latestState = repoGetLatestState(repo, path, setsToIgnore);
                let snapToSend = latestState;
                const latestHash = latestState.hash();
                for (let i = 0; i < queue.length; i++) {
                    const txn = queue[i];
                    (0, dist_index_esm2017.hu)(0 === txn.status, "tryToSendTransactionQueue_: items in queue should all be run.");
                    txn.status = 1;
                    txn.retryCount++;
                    const relativePath = newRelativePath(path, txn.path);
                    snapToSend = snapToSend.updateChild(relativePath, txn.currentOutputSnapshotRaw);
                }
                const dataToSend = snapToSend.val(true);
                const pathToSend = path;
                repo.server_.put(pathToSend.toString(), dataToSend, (status => {
                    repoLog(repo, "transaction put response", {
                        path: pathToSend.toString(),
                        status
                    });
                    let events = [];
                    if ("ok" === status) {
                        const callbacks = [];
                        for (let i = 0; i < queue.length; i++) {
                            queue[i].status = 2;
                            events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId));
                            if (queue[i].onComplete) callbacks.push((() => queue[i].onComplete(null, true, queue[i].currentOutputSnapshotResolved)));
                            queue[i].unwatcher();
                        }
                        repoPruneCompletedTransactionsBelowNode(repo, treeSubTree(repo.transactionQueueTree_, path));
                        repoSendReadyTransactions(repo, repo.transactionQueueTree_);
                        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
                        for (let i = 0; i < callbacks.length; i++) exceptionGuard(callbacks[i]);
                    } else {
                        if ("datastale" === status) for (let i = 0; i < queue.length; i++) if (3 === queue[i].status) queue[i].status = 4; else queue[i].status = 0; else {
                            warn("transaction at " + pathToSend.toString() + " failed: " + status);
                            for (let i = 0; i < queue.length; i++) {
                                queue[i].status = 4;
                                queue[i].abortReason = status;
                            }
                        }
                        repoRerunTransactions(repo, path);
                    }
                }), latestHash);
            }
            function repoRerunTransactions(repo, changedPath) {
                const rootMostTransactionNode = repoGetAncestorTransactionNode(repo, changedPath);
                const path = treeGetPath(rootMostTransactionNode);
                const queue = repoBuildTransactionQueue(repo, rootMostTransactionNode);
                repoRerunTransactionQueue(repo, queue, path);
                return path;
            }
            function repoRerunTransactionQueue(repo, queue, path) {
                if (0 === queue.length) return;
                const callbacks = [];
                let events = [];
                const txnsToRerun = queue.filter((q => 0 === q.status));
                const setsToIgnore = txnsToRerun.map((q => q.currentWriteId));
                for (let i = 0; i < queue.length; i++) {
                    const transaction = queue[i];
                    const relativePath = newRelativePath(path, transaction.path);
                    let abortReason, abortTransaction = false;
                    (0, dist_index_esm2017.hu)(null !== relativePath, "rerunTransactionsUnderNode_: relativePath should not be null.");
                    if (4 === transaction.status) {
                        abortTransaction = true;
                        abortReason = transaction.abortReason;
                        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
                    } else if (0 === transaction.status) if (transaction.retryCount >= MAX_TRANSACTION_RETRIES) {
                        abortTransaction = true;
                        abortReason = "maxretry";
                        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
                    } else {
                        const currentNode = repoGetLatestState(repo, transaction.path, setsToIgnore);
                        transaction.currentInputSnapshot = currentNode;
                        const newData = queue[i].update(currentNode.val());
                        if (void 0 !== newData) {
                            validateFirebaseData("transaction failed: Data returned ", newData, transaction.path);
                            let newDataNode = nodeFromJSON(newData);
                            const hasExplicitPriority = "object" === typeof newData && null != newData && (0, 
                            dist_index_esm2017.r3)(newData, ".priority");
                            if (!hasExplicitPriority) newDataNode = newDataNode.updatePriority(currentNode.getPriority());
                            const oldWriteId = transaction.currentWriteId;
                            const serverValues = repoGenerateServerValues(repo);
                            const newNodeResolved = resolveDeferredValueSnapshot(newDataNode, currentNode, serverValues);
                            transaction.currentOutputSnapshotRaw = newDataNode;
                            transaction.currentOutputSnapshotResolved = newNodeResolved;
                            transaction.currentWriteId = repoGetNextWriteId(repo);
                            setsToIgnore.splice(setsToIgnore.indexOf(oldWriteId), 1);
                            events = events.concat(syncTreeApplyUserOverwrite(repo.serverSyncTree_, transaction.path, newNodeResolved, transaction.currentWriteId, transaction.applyLocally));
                            events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, oldWriteId, true));
                        } else {
                            abortTransaction = true;
                            abortReason = "nodata";
                            events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
                        }
                    }
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
                    events = [];
                    if (abortTransaction) {
                        queue[i].status = 2;
                        (function(unwatcher) {
                            setTimeout(unwatcher, Math.floor(0));
                        })(queue[i].unwatcher);
                        if (queue[i].onComplete) if ("nodata" === abortReason) callbacks.push((() => queue[i].onComplete(null, false, queue[i].currentInputSnapshot))); else callbacks.push((() => queue[i].onComplete(new Error(abortReason), false, null)));
                    }
                }
                repoPruneCompletedTransactionsBelowNode(repo, repo.transactionQueueTree_);
                for (let i = 0; i < callbacks.length; i++) exceptionGuard(callbacks[i]);
                repoSendReadyTransactions(repo, repo.transactionQueueTree_);
            }
            function repoGetAncestorTransactionNode(repo, path) {
                let front;
                let transactionNode = repo.transactionQueueTree_;
                front = pathGetFront(path);
                while (null !== front && void 0 === treeGetValue(transactionNode)) {
                    transactionNode = treeSubTree(transactionNode, front);
                    path = pathPopFront(path);
                    front = pathGetFront(path);
                }
                return transactionNode;
            }
            function repoBuildTransactionQueue(repo, transactionNode) {
                const transactionQueue = [];
                repoAggregateTransactionQueuesForNode(repo, transactionNode, transactionQueue);
                transactionQueue.sort(((a, b) => a.order - b.order));
                return transactionQueue;
            }
            function repoAggregateTransactionQueuesForNode(repo, node, queue) {
                const nodeQueue = treeGetValue(node);
                if (nodeQueue) for (let i = 0; i < nodeQueue.length; i++) queue.push(nodeQueue[i]);
                treeForEachChild(node, (child => {
                    repoAggregateTransactionQueuesForNode(repo, child, queue);
                }));
            }
            function repoPruneCompletedTransactionsBelowNode(repo, node) {
                const queue = treeGetValue(node);
                if (queue) {
                    let to = 0;
                    for (let from = 0; from < queue.length; from++) if (2 !== queue[from].status) {
                        queue[to] = queue[from];
                        to++;
                    }
                    queue.length = to;
                    treeSetValue(node, queue.length > 0 ? queue : void 0);
                }
                treeForEachChild(node, (childNode => {
                    repoPruneCompletedTransactionsBelowNode(repo, childNode);
                }));
            }
            function repoAbortTransactions(repo, path) {
                const affectedPath = treeGetPath(repoGetAncestorTransactionNode(repo, path));
                const transactionNode = treeSubTree(repo.transactionQueueTree_, path);
                treeForEachAncestor(transactionNode, (node => {
                    repoAbortTransactionsOnNode(repo, node);
                }));
                repoAbortTransactionsOnNode(repo, transactionNode);
                treeForEachDescendant(transactionNode, (node => {
                    repoAbortTransactionsOnNode(repo, node);
                }));
                return affectedPath;
            }
            function repoAbortTransactionsOnNode(repo, node) {
                const queue = treeGetValue(node);
                if (queue) {
                    const callbacks = [];
                    let events = [];
                    let lastSent = -1;
                    for (let i = 0; i < queue.length; i++) if (3 === queue[i].status) ; else if (1 === queue[i].status) {
                        (0, dist_index_esm2017.hu)(lastSent === i - 1, "All SENT items should be at beginning of queue.");
                        lastSent = i;
                        queue[i].status = 3;
                        queue[i].abortReason = "set";
                    } else {
                        (0, dist_index_esm2017.hu)(0 === queue[i].status, "Unexpected transaction status in abort");
                        queue[i].unwatcher();
                        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId, true));
                        if (queue[i].onComplete) callbacks.push(queue[i].onComplete.bind(null, new Error("set"), false, null));
                    }
                    if (-1 === lastSent) treeSetValue(node, void 0); else queue.length = lastSent + 1;
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, treeGetPath(node), events);
                    for (let i = 0; i < callbacks.length; i++) exceptionGuard(callbacks[i]);
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function decodePath(pathString) {
                let pathStringDecoded = "";
                const pieces = pathString.split("/");
                for (let i = 0; i < pieces.length; i++) if (pieces[i].length > 0) {
                    let piece = pieces[i];
                    try {
                        piece = decodeURIComponent(piece.replace(/\+/g, " "));
                    } catch (e) {}
                    pathStringDecoded += "/" + piece;
                }
                return pathStringDecoded;
            }
            function decodeQuery(queryString) {
                const results = {};
                if ("?" === queryString.charAt(0)) queryString = queryString.substring(1);
                for (const segment of queryString.split("&")) {
                    if (0 === segment.length) continue;
                    const kv = segment.split("=");
                    if (2 === kv.length) results[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]); else warn(`Invalid query segment '${segment}' in query '${queryString}'`);
                }
                return results;
            }
            const parseRepoInfo = function(dataURL, nodeAdmin) {
                const parsedUrl = parseDatabaseURL(dataURL), namespace = parsedUrl.namespace;
                if ("firebase.com" === parsedUrl.domain) fatal(parsedUrl.host + " is no longer supported. " + "Please use <YOUR FIREBASE>.firebaseio.com instead");
                if ((!namespace || "undefined" === namespace) && "localhost" !== parsedUrl.domain) fatal("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");
                if (!parsedUrl.secure) warnIfPageIsSecure();
                const webSocketOnly = "ws" === parsedUrl.scheme || "wss" === parsedUrl.scheme;
                return {
                    repoInfo: new RepoInfo(parsedUrl.host, parsedUrl.secure, namespace, webSocketOnly, nodeAdmin, "", namespace !== parsedUrl.subdomain),
                    path: new Path(parsedUrl.pathString)
                };
            };
            const parseDatabaseURL = function(dataURL) {
                let host = "", domain = "", subdomain = "", pathString = "", namespace = "";
                let secure = true, scheme = "https", port = 443;
                if ("string" === typeof dataURL) {
                    let colonInd = dataURL.indexOf("//");
                    if (colonInd >= 0) {
                        scheme = dataURL.substring(0, colonInd - 1);
                        dataURL = dataURL.substring(colonInd + 2);
                    }
                    let slashInd = dataURL.indexOf("/");
                    if (-1 === slashInd) slashInd = dataURL.length;
                    let questionMarkInd = dataURL.indexOf("?");
                    if (-1 === questionMarkInd) questionMarkInd = dataURL.length;
                    host = dataURL.substring(0, Math.min(slashInd, questionMarkInd));
                    if (slashInd < questionMarkInd) pathString = decodePath(dataURL.substring(slashInd, questionMarkInd));
                    const queryParams = decodeQuery(dataURL.substring(Math.min(dataURL.length, questionMarkInd)));
                    colonInd = host.indexOf(":");
                    if (colonInd >= 0) {
                        secure = "https" === scheme || "wss" === scheme;
                        port = parseInt(host.substring(colonInd + 1), 10);
                    } else colonInd = host.length;
                    const hostWithoutPort = host.slice(0, colonInd);
                    if ("localhost" === hostWithoutPort.toLowerCase()) domain = "localhost"; else if (hostWithoutPort.split(".").length <= 2) domain = hostWithoutPort; else {
                        const dotInd = host.indexOf(".");
                        subdomain = host.substring(0, dotInd).toLowerCase();
                        domain = host.substring(dotInd + 1);
                        namespace = subdomain;
                    }
                    if ("ns" in queryParams) namespace = queryParams["ns"];
                }
                return {
                    host,
                    port,
                    domain,
                    subdomain,
                    secure,
                    scheme,
                    pathString,
                    namespace
                };
            };
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class DataEvent {
                constructor(eventType, eventRegistration, snapshot, prevName) {
                    this.eventType = eventType;
                    this.eventRegistration = eventRegistration;
                    this.snapshot = snapshot;
                    this.prevName = prevName;
                }
                getPath() {
                    const ref = this.snapshot.ref;
                    if ("value" === this.eventType) return ref._path; else return ref.parent._path;
                }
                getEventType() {
                    return this.eventType;
                }
                getEventRunner() {
                    return this.eventRegistration.getEventRunner(this);
                }
                toString() {
                    return this.getPath().toString() + ":" + this.eventType + ":" + (0, dist_index_esm2017.Pz)(this.snapshot.exportVal());
                }
            }
            class CancelEvent {
                constructor(eventRegistration, error, path) {
                    this.eventRegistration = eventRegistration;
                    this.error = error;
                    this.path = path;
                }
                getPath() {
                    return this.path;
                }
                getEventType() {
                    return "cancel";
                }
                getEventRunner() {
                    return this.eventRegistration.getEventRunner(this);
                }
                toString() {
                    return this.path.toString() + ":cancel";
                }
            }
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class CallbackContext {
                constructor(snapshotCallback, cancelCallback) {
                    this.snapshotCallback = snapshotCallback;
                    this.cancelCallback = cancelCallback;
                }
                onValue(expDataSnapshot, previousChildName) {
                    this.snapshotCallback.call(null, expDataSnapshot, previousChildName);
                }
                onCancel(error) {
                    (0, dist_index_esm2017.hu)(this.hasCancelCallback, "Raising a cancel event on a listener with no cancel callback");
                    return this.cancelCallback.call(null, error);
                }
                get hasCancelCallback() {
                    return !!this.cancelCallback;
                }
                matches(other) {
                    return this.snapshotCallback === other.snapshotCallback || void 0 !== this.snapshotCallback.userCallback && this.snapshotCallback.userCallback === other.snapshotCallback.userCallback && this.snapshotCallback.context === other.snapshotCallback.context;
                }
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class QueryImpl {
                constructor(_repo, _path, _queryParams, _orderByCalled) {
                    this._repo = _repo;
                    this._path = _path;
                    this._queryParams = _queryParams;
                    this._orderByCalled = _orderByCalled;
                }
                get key() {
                    if (pathIsEmpty(this._path)) return null; else return pathGetBack(this._path);
                }
                get ref() {
                    return new ReferenceImpl(this._repo, this._path);
                }
                get _queryIdentifier() {
                    const obj = queryParamsGetQueryObject(this._queryParams);
                    const id = ObjectToUniqueKey(obj);
                    return "{}" === id ? "default" : id;
                }
                get _queryObject() {
                    return queryParamsGetQueryObject(this._queryParams);
                }
                isEqual(other) {
                    other = (0, dist_index_esm2017.m9)(other);
                    if (!(other instanceof QueryImpl)) return false;
                    const sameRepo = this._repo === other._repo;
                    const samePath = pathEquals(this._path, other._path);
                    const sameQueryIdentifier = this._queryIdentifier === other._queryIdentifier;
                    return sameRepo && samePath && sameQueryIdentifier;
                }
                toJSON() {
                    return this.toString();
                }
                toString() {
                    return this._repo.toString() + pathToUrlEncodedString(this._path);
                }
            }
            class ReferenceImpl extends QueryImpl {
                constructor(repo, path) {
                    super(repo, path, new QueryParams, false);
                }
                get parent() {
                    const parentPath = pathParent(this._path);
                    return null === parentPath ? null : new ReferenceImpl(this._repo, parentPath);
                }
                get root() {
                    let ref = this;
                    while (null !== ref.parent) ref = ref.parent;
                    return ref;
                }
            }
            class DataSnapshot {
                constructor(_node, ref, _index) {
                    this._node = _node;
                    this.ref = ref;
                    this._index = _index;
                }
                get priority() {
                    return this._node.getPriority().val();
                }
                get key() {
                    return this.ref.key;
                }
                get size() {
                    return this._node.numChildren();
                }
                child(path) {
                    const childPath = new Path(path);
                    const childRef = child(this.ref, path);
                    return new DataSnapshot(this._node.getChild(childPath), childRef, PRIORITY_INDEX);
                }
                exists() {
                    return !this._node.isEmpty();
                }
                exportVal() {
                    return this._node.val(true);
                }
                forEach(action) {
                    if (this._node.isLeafNode()) return false;
                    const childrenNode = this._node;
                    return !!childrenNode.forEachChild(this._index, ((key, node) => action(new DataSnapshot(node, child(this.ref, key), PRIORITY_INDEX))));
                }
                hasChild(path) {
                    const childPath = new Path(path);
                    return !this._node.getChild(childPath).isEmpty();
                }
                hasChildren() {
                    if (this._node.isLeafNode()) return false; else return !this._node.isEmpty();
                }
                toJSON() {
                    return this.exportVal();
                }
                val() {
                    return this._node.val();
                }
            }
            function ref(db, path) {
                db = (0, dist_index_esm2017.m9)(db);
                db._checkNotDeleted("ref");
                return void 0 !== path ? child(db._root, path) : db._root;
            }
            function child(parent, path) {
                parent = (0, dist_index_esm2017.m9)(parent);
                if (null === pathGetFront(parent._path)) validateRootPathString("child", "path", path, false); else validatePathString("child", "path", path, false);
                return new ReferenceImpl(parent._repo, pathChild(parent._path, path));
            }
            function set(ref, value) {
                ref = (0, dist_index_esm2017.m9)(ref);
                validateWritablePath("set", ref._path);
                validateFirebaseDataArg("set", value, ref._path, false);
                const deferred = new dist_index_esm2017.BH;
                repoSetWithPriority(ref._repo, ref._path, value, null, deferred.wrapCallback((() => {})));
                return deferred.promise;
            }
            function update(ref, values) {
                validateFirebaseMergeDataArg("update", values, ref._path, false);
                const deferred = new dist_index_esm2017.BH;
                repoUpdate(ref._repo, ref._path, values, deferred.wrapCallback((() => {})));
                return deferred.promise;
            }
            function get(query) {
                query = (0, dist_index_esm2017.m9)(query);
                const callbackContext = new CallbackContext((() => {}));
                const container = new ValueEventRegistration(callbackContext);
                return repoGetValue(query._repo, query, container).then((node => new DataSnapshot(node, new ReferenceImpl(query._repo, query._path), query._queryParams.getIndex())));
            }
            class ValueEventRegistration {
                constructor(callbackContext) {
                    this.callbackContext = callbackContext;
                }
                respondsTo(eventType) {
                    return "value" === eventType;
                }
                createEvent(change, query) {
                    const index = query._queryParams.getIndex();
                    return new DataEvent("value", this, new DataSnapshot(change.snapshotNode, new ReferenceImpl(query._repo, query._path), index));
                }
                getEventRunner(eventData) {
                    if ("cancel" === eventData.getEventType()) return () => this.callbackContext.onCancel(eventData.error); else return () => this.callbackContext.onValue(eventData.snapshot, null);
                }
                createCancelEvent(error, path) {
                    if (this.callbackContext.hasCancelCallback) return new CancelEvent(this, error, path); else return null;
                }
                matches(other) {
                    if (!(other instanceof ValueEventRegistration)) return false; else if (!other.callbackContext || !this.callbackContext) return true; else return other.callbackContext.matches(this.callbackContext);
                }
                hasAnyCallback() {
                    return null !== this.callbackContext;
                }
            }
            syncPointSetReferenceConstructor(ReferenceImpl);
            syncTreeSetReferenceConstructor(ReferenceImpl);
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const FIREBASE_DATABASE_EMULATOR_HOST_VAR = "FIREBASE_DATABASE_EMULATOR_HOST";
            const repos = {};
            let useRestClient = false;
            function repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url, nodeAdmin) {
                let dbUrl = url || app.options.databaseURL;
                if (void 0 === dbUrl) {
                    if (!app.options.projectId) fatal("Can't determine Firebase Database URL. Be sure to include " + " a Project ID when calling firebase.initializeApp().");
                    log("Using default host for project ", app.options.projectId);
                    dbUrl = `${app.options.projectId}-default-rtdb.firebaseio.com`;
                }
                let parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
                let repoInfo = parsedUrl.repoInfo;
                let isEmulator;
                let dbEmulatorHost;
                if ("undefined" !== typeof process && {
                    FIREBASE_API_KEY: "AIzaSyBtqZbY6PnEMXjuFAdT6yvOvb7UgHvM42k",
                    FIREBASE_AUTH_DOMAIN: "auth-examplec.firebaseapp.com",
                    FIREBASE_DATABASE_URL: "https://auth-examplec-default-rtdb.firebaseio.com",
                    FIREBASE_PROJECT_ID: "auth-examplec",
                    FIREBASE_STORAGE_BUCKET: "auth-examplec.appspot.com",
                    FIREBASE_MESSAGING_SENDER_ID: "724261682760",
                    FIREBASE_APP_ID: "1:724261682760:web:12652068e198094cdee27d"
                }) dbEmulatorHost = {
                    FIREBASE_API_KEY: "AIzaSyBtqZbY6PnEMXjuFAdT6yvOvb7UgHvM42k",
                    FIREBASE_AUTH_DOMAIN: "auth-examplec.firebaseapp.com",
                    FIREBASE_DATABASE_URL: "https://auth-examplec-default-rtdb.firebaseio.com",
                    FIREBASE_PROJECT_ID: "auth-examplec",
                    FIREBASE_STORAGE_BUCKET: "auth-examplec.appspot.com",
                    FIREBASE_MESSAGING_SENDER_ID: "724261682760",
                    FIREBASE_APP_ID: "1:724261682760:web:12652068e198094cdee27d"
                }[FIREBASE_DATABASE_EMULATOR_HOST_VAR];
                if (dbEmulatorHost) {
                    isEmulator = true;
                    dbUrl = `http://${dbEmulatorHost}?ns=${repoInfo.namespace}`;
                    parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
                    repoInfo = parsedUrl.repoInfo;
                } else isEmulator = !parsedUrl.repoInfo.secure;
                const authTokenProvider = nodeAdmin && isEmulator ? new EmulatorTokenProvider(EmulatorTokenProvider.OWNER) : new FirebaseAuthTokenProvider(app.name, app.options, authProvider);
                validateUrl("Invalid Firebase Database URL", parsedUrl);
                if (!pathIsEmpty(parsedUrl.path)) fatal("Database URL must point to the root of a Firebase Database " + "(not including a child path).");
                const repo = repoManagerCreateRepo(repoInfo, app, authTokenProvider, new AppCheckTokenProvider(app.name, appCheckProvider));
                return new Database(repo, app);
            }
            function repoManagerDeleteRepo(repo, appName) {
                const appRepos = repos[appName];
                if (!appRepos || appRepos[repo.key] !== repo) fatal(`Database ${appName}(${repo.repoInfo_}) has already been deleted.`);
                repoInterrupt(repo);
                delete appRepos[repo.key];
            }
            function repoManagerCreateRepo(repoInfo, app, authTokenProvider, appCheckProvider) {
                let appRepos = repos[app.name];
                if (!appRepos) {
                    appRepos = {};
                    repos[app.name] = appRepos;
                }
                let repo = appRepos[repoInfo.toURLString()];
                if (repo) fatal("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.");
                repo = new Repo(repoInfo, useRestClient, authTokenProvider, appCheckProvider);
                appRepos[repoInfo.toURLString()] = repo;
                return repo;
            }
            class Database {
                constructor(_repoInternal, app) {
                    this._repoInternal = _repoInternal;
                    this.app = app;
                    this["type"] = "database";
                    this._instanceStarted = false;
                }
                get _repo() {
                    if (!this._instanceStarted) {
                        repoStart(this._repoInternal, this.app.options.appId, this.app.options["databaseAuthVariableOverride"]);
                        this._instanceStarted = true;
                    }
                    return this._repoInternal;
                }
                get _root() {
                    if (!this._rootInternal) this._rootInternal = new ReferenceImpl(this._repo, newEmptyPath());
                    return this._rootInternal;
                }
                _delete() {
                    if (null !== this._rootInternal) {
                        repoManagerDeleteRepo(this._repo, this.app.name);
                        this._repoInternal = null;
                        this._rootInternal = null;
                    }
                    return Promise.resolve();
                }
                _checkNotDeleted(apiName) {
                    if (null === this._rootInternal) fatal("Cannot call " + apiName + " on a deleted database.");
                }
            }
            function getDatabase(app = (0, index_esm2017.Mq)(), url) {
                return (0, index_esm2017.qX)(app, "database").getImmediate({
                    identifier: url
                });
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            function registerDatabase(variant) {
                setSDKVersion(index_esm2017.Jn);
                (0, index_esm2017.Xd)(new esm_index_esm2017.wA("database", ((container, {instanceIdentifier: url}) => {
                    const app = container.getProvider("app").getImmediate();
                    const authProvider = container.getProvider("auth-internal");
                    const appCheckProvider = container.getProvider("app-check-internal");
                    return repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url);
                }), "PUBLIC").setMultipleInstances(true));
                (0, index_esm2017.KN)(index_esm2017_name, version, variant);
                (0, index_esm2017.KN)(index_esm2017_name, version, "esm2017");
            }
            /**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            PersistentConnection;
            PersistentConnection.prototype.simpleListen = function(pathString, onComplete) {
                this.sendRequest("q", {
                    p: pathString
                }, onComplete);
            };
            PersistentConnection.prototype.echo = function(data, onEcho) {
                this.sendRequest("echo", {
                    d: data
                }, onEcho);
            };
            Connection;
            RepoInfo;
            registerDatabase();
        },
        389: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                Jn: () => SDK_VERSION,
                qX: () => _getProvider,
                Xd: () => _registerComponent,
                Mq: () => getApp,
                ZF: () => initializeApp,
                KN: () => registerVersion
            });
            var index_esm2017 = __webpack_require__(463);
            var esm_index_esm2017 = __webpack_require__(333);
            var dist_index_esm2017 = __webpack_require__(444);
            const instanceOfAny = (object, constructors) => constructors.some((c => object instanceof c));
            let idbProxyableTypes;
            let cursorAdvanceMethods;
            function getIdbProxyableTypes() {
                return idbProxyableTypes || (idbProxyableTypes = [ IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction ]);
            }
            function getCursorAdvanceMethods() {
                return cursorAdvanceMethods || (cursorAdvanceMethods = [ IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey ]);
            }
            const cursorRequestMap = new WeakMap;
            const transactionDoneMap = new WeakMap;
            const transactionStoreNamesMap = new WeakMap;
            const transformCache = new WeakMap;
            const reverseTransformCache = new WeakMap;
            function promisifyRequest(request) {
                const promise = new Promise(((resolve, reject) => {
                    const unlisten = () => {
                        request.removeEventListener("success", success);
                        request.removeEventListener("error", error);
                    };
                    const success = () => {
                        resolve(wrap_idb_value_wrap(request.result));
                        unlisten();
                    };
                    const error = () => {
                        reject(request.error);
                        unlisten();
                    };
                    request.addEventListener("success", success);
                    request.addEventListener("error", error);
                }));
                promise.then((value => {
                    if (value instanceof IDBCursor) cursorRequestMap.set(value, request);
                })).catch((() => {}));
                reverseTransformCache.set(promise, request);
                return promise;
            }
            function cacheDonePromiseForTransaction(tx) {
                if (transactionDoneMap.has(tx)) return;
                const done = new Promise(((resolve, reject) => {
                    const unlisten = () => {
                        tx.removeEventListener("complete", complete);
                        tx.removeEventListener("error", error);
                        tx.removeEventListener("abort", error);
                    };
                    const complete = () => {
                        resolve();
                        unlisten();
                    };
                    const error = () => {
                        reject(tx.error || new DOMException("AbortError", "AbortError"));
                        unlisten();
                    };
                    tx.addEventListener("complete", complete);
                    tx.addEventListener("error", error);
                    tx.addEventListener("abort", error);
                }));
                transactionDoneMap.set(tx, done);
            }
            let idbProxyTraps = {
                get(target, prop, receiver) {
                    if (target instanceof IDBTransaction) {
                        if ("done" === prop) return transactionDoneMap.get(target);
                        if ("objectStoreNames" === prop) return target.objectStoreNames || transactionStoreNamesMap.get(target);
                        if ("store" === prop) return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
                    }
                    return wrap_idb_value_wrap(target[prop]);
                },
                set(target, prop, value) {
                    target[prop] = value;
                    return true;
                },
                has(target, prop) {
                    if (target instanceof IDBTransaction && ("done" === prop || "store" === prop)) return true;
                    return prop in target;
                }
            };
            function replaceTraps(callback) {
                idbProxyTraps = callback(idbProxyTraps);
            }
            function wrapFunction(func) {
                if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) return function(storeNames, ...args) {
                    const tx = func.call(unwrap(this), storeNames, ...args);
                    transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [ storeNames ]);
                    return wrap_idb_value_wrap(tx);
                };
                if (getCursorAdvanceMethods().includes(func)) return function(...args) {
                    func.apply(unwrap(this), args);
                    return wrap_idb_value_wrap(cursorRequestMap.get(this));
                };
                return function(...args) {
                    return wrap_idb_value_wrap(func.apply(unwrap(this), args));
                };
            }
            function transformCachableValue(value) {
                if ("function" === typeof value) return wrapFunction(value);
                if (value instanceof IDBTransaction) cacheDonePromiseForTransaction(value);
                if (instanceOfAny(value, getIdbProxyableTypes())) return new Proxy(value, idbProxyTraps);
                return value;
            }
            function wrap_idb_value_wrap(value) {
                if (value instanceof IDBRequest) return promisifyRequest(value);
                if (transformCache.has(value)) return transformCache.get(value);
                const newValue = transformCachableValue(value);
                if (newValue !== value) {
                    transformCache.set(value, newValue);
                    reverseTransformCache.set(newValue, value);
                }
                return newValue;
            }
            const unwrap = value => reverseTransformCache.get(value);
            function openDB(name, version, {blocked, upgrade, blocking, terminated} = {}) {
                const request = indexedDB.open(name, version);
                const openPromise = wrap_idb_value_wrap(request);
                if (upgrade) request.addEventListener("upgradeneeded", (event => {
                    upgrade(wrap_idb_value_wrap(request.result), event.oldVersion, event.newVersion, wrap_idb_value_wrap(request.transaction));
                }));
                if (blocked) request.addEventListener("blocked", (() => blocked()));
                openPromise.then((db => {
                    if (terminated) db.addEventListener("close", (() => terminated()));
                    if (blocking) db.addEventListener("versionchange", (() => blocking()));
                })).catch((() => {}));
                return openPromise;
            }
            const readMethods = [ "get", "getKey", "getAll", "getAllKeys", "count" ];
            const writeMethods = [ "put", "add", "delete", "clear" ];
            const cachedMethods = new Map;
            function getMethod(target, prop) {
                if (!(target instanceof IDBDatabase && !(prop in target) && "string" === typeof prop)) return;
                if (cachedMethods.get(prop)) return cachedMethods.get(prop);
                const targetFuncName = prop.replace(/FromIndex$/, "");
                const useIndex = prop !== targetFuncName;
                const isWrite = writeMethods.includes(targetFuncName);
                if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) return;
                const method = async function(storeName, ...args) {
                    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
                    let target = tx.store;
                    if (useIndex) target = target.index(args.shift());
                    return (await Promise.all([ target[targetFuncName](...args), isWrite && tx.done ]))[0];
                };
                cachedMethods.set(prop, method);
                return method;
            }
            replaceTraps((oldTraps => ({
                ...oldTraps,
                get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
                has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
            })));
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            class PlatformLoggerServiceImpl {
                constructor(container) {
                    this.container = container;
                }
                getPlatformInfoString() {
                    const providers = this.container.getProviders();
                    return providers.map((provider => {
                        if (isVersionServiceProvider(provider)) {
                            const service = provider.getImmediate();
                            return `${service.library}/${service.version}`;
                        } else return null;
                    })).filter((logString => logString)).join(" ");
                }
            }
            function isVersionServiceProvider(provider) {
                const component = provider.getComponent();
                return "VERSION" === (null === component || void 0 === component ? void 0 : component.type);
            }
            const name$o = "@firebase/app";
            const version$1 = "0.7.31";
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const logger = new esm_index_esm2017.Yd("@firebase/app");
            const name$n = "@firebase/app-compat";
            const name$m = "@firebase/analytics-compat";
            const name$l = "@firebase/analytics";
            const name$k = "@firebase/app-check-compat";
            const name$j = "@firebase/app-check";
            const name$i = "@firebase/auth";
            const name$h = "@firebase/auth-compat";
            const name$g = "@firebase/database";
            const name$f = "@firebase/database-compat";
            const name$e = "@firebase/functions";
            const name$d = "@firebase/functions-compat";
            const name$c = "@firebase/installations";
            const name$b = "@firebase/installations-compat";
            const name$a = "@firebase/messaging";
            const name$9 = "@firebase/messaging-compat";
            const name$8 = "@firebase/performance";
            const name$7 = "@firebase/performance-compat";
            const name$6 = "@firebase/remote-config";
            const name$5 = "@firebase/remote-config-compat";
            const name$4 = "@firebase/storage";
            const name$3 = "@firebase/storage-compat";
            const name$2 = "@firebase/firestore";
            const name$1 = "@firebase/firestore-compat";
            const index_esm2017_name = "firebase";
            const version = "9.9.3";
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const DEFAULT_ENTRY_NAME = "[DEFAULT]";
            const PLATFORM_LOG_STRING = {
                [name$o]: "fire-core",
                [name$n]: "fire-core-compat",
                [name$l]: "fire-analytics",
                [name$m]: "fire-analytics-compat",
                [name$j]: "fire-app-check",
                [name$k]: "fire-app-check-compat",
                [name$i]: "fire-auth",
                [name$h]: "fire-auth-compat",
                [name$g]: "fire-rtdb",
                [name$f]: "fire-rtdb-compat",
                [name$e]: "fire-fn",
                [name$d]: "fire-fn-compat",
                [name$c]: "fire-iid",
                [name$b]: "fire-iid-compat",
                [name$a]: "fire-fcm",
                [name$9]: "fire-fcm-compat",
                [name$8]: "fire-perf",
                [name$7]: "fire-perf-compat",
                [name$6]: "fire-rc",
                [name$5]: "fire-rc-compat",
                [name$4]: "fire-gcs",
                [name$3]: "fire-gcs-compat",
                [name$2]: "fire-fst",
                [name$1]: "fire-fst-compat",
                "fire-js": "fire-js",
                [index_esm2017_name]: "fire-js-all"
            };
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const _apps = new Map;
            const _components = new Map;
            function _addComponent(app, component) {
                try {
                    app.container.addComponent(component);
                } catch (e) {
                    logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
                }
            }
            function _registerComponent(component) {
                const componentName = component.name;
                if (_components.has(componentName)) {
                    logger.debug(`There were multiple attempts to register component ${componentName}.`);
                    return false;
                }
                _components.set(componentName, component);
                for (const app of _apps.values()) _addComponent(app, component);
                return true;
            }
            function _getProvider(app, name) {
                const heartbeatController = app.container.getProvider("heartbeat").getImmediate({
                    optional: true
                });
                if (heartbeatController) void heartbeatController.triggerHeartbeat();
                return app.container.getProvider(name);
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const ERRORS = {
                ["no-app"]: "No Firebase App '{$appName}' has been created - " + "call Firebase App.initializeApp()",
                ["bad-app-name"]: "Illegal App name: '{$appName}",
                ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
                ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
                ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a " + "Firebase App instance.",
                ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
                ["idb-open"]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
                ["idb-get"]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
                ["idb-set"]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
                ["idb-delete"]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
            };
            const ERROR_FACTORY = new dist_index_esm2017.LL("app", "Firebase", ERRORS);
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class FirebaseAppImpl {
                constructor(options, config, container) {
                    this._isDeleted = false;
                    this._options = Object.assign({}, options);
                    this._config = Object.assign({}, config);
                    this._name = config.name;
                    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
                    this._container = container;
                    this.container.addComponent(new index_esm2017.wA("app", (() => this), "PUBLIC"));
                }
                get automaticDataCollectionEnabled() {
                    this.checkDestroyed();
                    return this._automaticDataCollectionEnabled;
                }
                set automaticDataCollectionEnabled(val) {
                    this.checkDestroyed();
                    this._automaticDataCollectionEnabled = val;
                }
                get name() {
                    this.checkDestroyed();
                    return this._name;
                }
                get options() {
                    this.checkDestroyed();
                    return this._options;
                }
                get config() {
                    this.checkDestroyed();
                    return this._config;
                }
                get container() {
                    return this._container;
                }
                get isDeleted() {
                    return this._isDeleted;
                }
                set isDeleted(val) {
                    this._isDeleted = val;
                }
                checkDestroyed() {
                    if (this.isDeleted) throw ERROR_FACTORY.create("app-deleted", {
                        appName: this._name
                    });
                }
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const SDK_VERSION = version;
            function initializeApp(options, rawConfig = {}) {
                if ("object" !== typeof rawConfig) {
                    const name = rawConfig;
                    rawConfig = {
                        name
                    };
                }
                const config = Object.assign({
                    name: DEFAULT_ENTRY_NAME,
                    automaticDataCollectionEnabled: false
                }, rawConfig);
                const name = config.name;
                if ("string" !== typeof name || !name) throw ERROR_FACTORY.create("bad-app-name", {
                    appName: String(name)
                });
                const existingApp = _apps.get(name);
                if (existingApp) if ((0, dist_index_esm2017.vZ)(options, existingApp.options) && (0, 
                dist_index_esm2017.vZ)(config, existingApp.config)) return existingApp; else throw ERROR_FACTORY.create("duplicate-app", {
                    appName: name
                });
                const container = new index_esm2017.H0(name);
                for (const component of _components.values()) container.addComponent(component);
                const newApp = new FirebaseAppImpl(options, config, container);
                _apps.set(name, newApp);
                return newApp;
            }
            function getApp(name = DEFAULT_ENTRY_NAME) {
                const app = _apps.get(name);
                if (!app) throw ERROR_FACTORY.create("no-app", {
                    appName: name
                });
                return app;
            }
            function registerVersion(libraryKeyOrName, version, variant) {
                var _a;
                let library = null !== (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) && void 0 !== _a ? _a : libraryKeyOrName;
                if (variant) library += `-${variant}`;
                const libraryMismatch = library.match(/\s|\//);
                const versionMismatch = version.match(/\s|\//);
                if (libraryMismatch || versionMismatch) {
                    const warning = [ `Unable to register library "${library}" with version "${version}":` ];
                    if (libraryMismatch) warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
                    if (libraryMismatch && versionMismatch) warning.push("and");
                    if (versionMismatch) warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
                    logger.warn(warning.join(" "));
                    return;
                }
                _registerComponent(new index_esm2017.wA(`${library}-version`, (() => ({
                    library,
                    version
                })), "VERSION"));
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
            const DB_NAME = "firebase-heartbeat-database";
            const DB_VERSION = 1;
            const STORE_NAME = "firebase-heartbeat-store";
            let dbPromise = null;
            function getDbPromise() {
                if (!dbPromise) dbPromise = openDB(DB_NAME, DB_VERSION, {
                    upgrade: (db, oldVersion) => {
                        switch (oldVersion) {
                          case 0:
                            db.createObjectStore(STORE_NAME);
                        }
                    }
                }).catch((e => {
                    throw ERROR_FACTORY.create("idb-open", {
                        originalErrorMessage: e.message
                    });
                }));
                return dbPromise;
            }
            async function readHeartbeatsFromIndexedDB(app) {
                var _a;
                try {
                    const db = await getDbPromise();
                    return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app));
                } catch (e) {
                    if (e instanceof dist_index_esm2017.ZR) logger.warn(e.message); else {
                        const idbGetError = ERROR_FACTORY.create("idb-get", {
                            originalErrorMessage: null === (_a = e) || void 0 === _a ? void 0 : _a.message
                        });
                        logger.warn(idbGetError.message);
                    }
                }
            }
            async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
                var _a;
                try {
                    const db = await getDbPromise();
                    const tx = db.transaction(STORE_NAME, "readwrite");
                    const objectStore = tx.objectStore(STORE_NAME);
                    await objectStore.put(heartbeatObject, computeKey(app));
                    return tx.done;
                } catch (e) {
                    if (e instanceof dist_index_esm2017.ZR) logger.warn(e.message); else {
                        const idbGetError = ERROR_FACTORY.create("idb-set", {
                            originalErrorMessage: null === (_a = e) || void 0 === _a ? void 0 : _a.message
                        });
                        logger.warn(idbGetError.message);
                    }
                }
            }
            function computeKey(app) {
                return `${app.name}!${app.options.appId}`;
            }
            /**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const MAX_HEADER_BYTES = 1024;
            const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
            class HeartbeatServiceImpl {
                constructor(container) {
                    this.container = container;
                    this._heartbeatsCache = null;
                    const app = this.container.getProvider("app").getImmediate();
                    this._storage = new HeartbeatStorageImpl(app);
                    this._heartbeatsCachePromise = this._storage.read().then((result => {
                        this._heartbeatsCache = result;
                        return result;
                    }));
                }
                async triggerHeartbeat() {
                    const platformLogger = this.container.getProvider("platform-logger").getImmediate();
                    const agent = platformLogger.getPlatformInfoString();
                    const date = getUTCDateString();
                    if (null === this._heartbeatsCache) this._heartbeatsCache = await this._heartbeatsCachePromise;
                    if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat => singleDateHeartbeat.date === date))) return; else this._heartbeatsCache.heartbeats.push({
                        date,
                        agent
                    });
                    this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat => {
                        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
                        const now = Date.now();
                        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
                    }));
                    return this._storage.overwrite(this._heartbeatsCache);
                }
                async getHeartbeatsHeader() {
                    if (null === this._heartbeatsCache) await this._heartbeatsCachePromise;
                    if (null === this._heartbeatsCache || 0 === this._heartbeatsCache.heartbeats.length) return "";
                    const date = getUTCDateString();
                    const {heartbeatsToSend, unsentEntries} = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
                    const headerString = (0, dist_index_esm2017.L)(JSON.stringify({
                        version: 2,
                        heartbeats: heartbeatsToSend
                    }));
                    this._heartbeatsCache.lastSentHeartbeatDate = date;
                    if (unsentEntries.length > 0) {
                        this._heartbeatsCache.heartbeats = unsentEntries;
                        await this._storage.overwrite(this._heartbeatsCache);
                    } else {
                        this._heartbeatsCache.heartbeats = [];
                        void this._storage.overwrite(this._heartbeatsCache);
                    }
                    return headerString;
                }
            }
            function getUTCDateString() {
                const today = new Date;
                return today.toISOString().substring(0, 10);
            }
            function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
                const heartbeatsToSend = [];
                let unsentEntries = heartbeatsCache.slice();
                for (const singleDateHeartbeat of heartbeatsCache) {
                    const heartbeatEntry = heartbeatsToSend.find((hb => hb.agent === singleDateHeartbeat.agent));
                    if (!heartbeatEntry) {
                        heartbeatsToSend.push({
                            agent: singleDateHeartbeat.agent,
                            dates: [ singleDateHeartbeat.date ]
                        });
                        if (countBytes(heartbeatsToSend) > maxSize) {
                            heartbeatsToSend.pop();
                            break;
                        }
                    } else {
                        heartbeatEntry.dates.push(singleDateHeartbeat.date);
                        if (countBytes(heartbeatsToSend) > maxSize) {
                            heartbeatEntry.dates.pop();
                            break;
                        }
                    }
                    unsentEntries = unsentEntries.slice(1);
                }
                return {
                    heartbeatsToSend,
                    unsentEntries
                };
            }
            class HeartbeatStorageImpl {
                constructor(app) {
                    this.app = app;
                    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
                }
                async runIndexedDBEnvironmentCheck() {
                    if (!(0, dist_index_esm2017.hl)()) return false; else return (0, dist_index_esm2017.eu)().then((() => true)).catch((() => false));
                }
                async read() {
                    const canUseIndexedDB = await this._canUseIndexedDBPromise;
                    if (!canUseIndexedDB) return {
                        heartbeats: []
                    }; else {
                        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
                        return idbHeartbeatObject || {
                            heartbeats: []
                        };
                    }
                }
                async overwrite(heartbeatsObject) {
                    var _a;
                    const canUseIndexedDB = await this._canUseIndexedDBPromise;
                    if (!canUseIndexedDB) return; else {
                        const existingHeartbeatsObject = await this.read();
                        return writeHeartbeatsToIndexedDB(this.app, {
                            lastSentHeartbeatDate: null !== (_a = heartbeatsObject.lastSentHeartbeatDate) && void 0 !== _a ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                            heartbeats: heartbeatsObject.heartbeats
                        });
                    }
                }
                async add(heartbeatsObject) {
                    var _a;
                    const canUseIndexedDB = await this._canUseIndexedDBPromise;
                    if (!canUseIndexedDB) return; else {
                        const existingHeartbeatsObject = await this.read();
                        return writeHeartbeatsToIndexedDB(this.app, {
                            lastSentHeartbeatDate: null !== (_a = heartbeatsObject.lastSentHeartbeatDate) && void 0 !== _a ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                            heartbeats: [ ...existingHeartbeatsObject.heartbeats, ...heartbeatsObject.heartbeats ]
                        });
                    }
                }
            }
            function countBytes(heartbeatsCache) {
                return (0, dist_index_esm2017.L)(JSON.stringify({
                    version: 2,
                    heartbeats: heartbeatsCache
                })).length;
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            function registerCoreComponents(variant) {
                _registerComponent(new index_esm2017.wA("platform-logger", (container => new PlatformLoggerServiceImpl(container)), "PRIVATE"));
                _registerComponent(new index_esm2017.wA("heartbeat", (container => new HeartbeatServiceImpl(container)), "PRIVATE"));
                registerVersion(name$o, version$1, variant);
                registerVersion(name$o, version$1, "esm2017");
                registerVersion("fire-js", "");
            }
            registerCoreComponents("");
        },
        463: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                H0: () => ComponentContainer,
                wA: () => Component
            });
            var _firebase_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(444);
            class Component {
                constructor(name, instanceFactory, type) {
                    this.name = name;
                    this.instanceFactory = instanceFactory;
                    this.type = type;
                    this.multipleInstances = false;
                    this.serviceProps = {};
                    this.instantiationMode = "LAZY";
                    this.onInstanceCreated = null;
                }
                setInstantiationMode(mode) {
                    this.instantiationMode = mode;
                    return this;
                }
                setMultipleInstances(multipleInstances) {
                    this.multipleInstances = multipleInstances;
                    return this;
                }
                setServiceProps(props) {
                    this.serviceProps = props;
                    return this;
                }
                setInstanceCreatedCallback(callback) {
                    this.onInstanceCreated = callback;
                    return this;
                }
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const DEFAULT_ENTRY_NAME = "[DEFAULT]";
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class Provider {
                constructor(name, container) {
                    this.name = name;
                    this.container = container;
                    this.component = null;
                    this.instances = new Map;
                    this.instancesDeferred = new Map;
                    this.instancesOptions = new Map;
                    this.onInitCallbacks = new Map;
                }
                get(identifier) {
                    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
                    if (!this.instancesDeferred.has(normalizedIdentifier)) {
                        const deferred = new _firebase_util__WEBPACK_IMPORTED_MODULE_0__.BH;
                        this.instancesDeferred.set(normalizedIdentifier, deferred);
                        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
                            const instance = this.getOrInitializeService({
                                instanceIdentifier: normalizedIdentifier
                            });
                            if (instance) deferred.resolve(instance);
                        } catch (e) {}
                    }
                    return this.instancesDeferred.get(normalizedIdentifier).promise;
                }
                getImmediate(options) {
                    var _a;
                    const normalizedIdentifier = this.normalizeInstanceIdentifier(null === options || void 0 === options ? void 0 : options.identifier);
                    const optional = null !== (_a = null === options || void 0 === options ? void 0 : options.optional) && void 0 !== _a ? _a : false;
                    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) try {
                        return this.getOrInitializeService({
                            instanceIdentifier: normalizedIdentifier
                        });
                    } catch (e) {
                        if (optional) return null; else throw e;
                    } else if (optional) return null; else throw Error(`Service ${this.name} is not available`);
                }
                getComponent() {
                    return this.component;
                }
                setComponent(component) {
                    if (component.name !== this.name) throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
                    if (this.component) throw Error(`Component for ${this.name} has already been provided`);
                    this.component = component;
                    if (!this.shouldAutoInitialize()) return;
                    if (isComponentEager(component)) try {
                        this.getOrInitializeService({
                            instanceIdentifier: DEFAULT_ENTRY_NAME
                        });
                    } catch (e) {}
                    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                        try {
                            const instance = this.getOrInitializeService({
                                instanceIdentifier: normalizedIdentifier
                            });
                            instanceDeferred.resolve(instance);
                        } catch (e) {}
                    }
                }
                clearInstance(identifier = DEFAULT_ENTRY_NAME) {
                    this.instancesDeferred.delete(identifier);
                    this.instancesOptions.delete(identifier);
                    this.instances.delete(identifier);
                }
                async delete() {
                    const services = Array.from(this.instances.values());
                    await Promise.all([ ...services.filter((service => "INTERNAL" in service)).map((service => service.INTERNAL.delete())), ...services.filter((service => "_delete" in service)).map((service => service._delete())) ]);
                }
                isComponentSet() {
                    return null != this.component;
                }
                isInitialized(identifier = DEFAULT_ENTRY_NAME) {
                    return this.instances.has(identifier);
                }
                getOptions(identifier = DEFAULT_ENTRY_NAME) {
                    return this.instancesOptions.get(identifier) || {};
                }
                initialize(opts = {}) {
                    const {options = {}} = opts;
                    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
                    if (this.isInitialized(normalizedIdentifier)) throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
                    if (!this.isComponentSet()) throw Error(`Component ${this.name} has not been registered yet`);
                    const instance = this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier,
                        options
                    });
                    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                        if (normalizedIdentifier === normalizedDeferredIdentifier) instanceDeferred.resolve(instance);
                    }
                    return instance;
                }
                onInit(callback, identifier) {
                    var _a;
                    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
                    const existingCallbacks = null !== (_a = this.onInitCallbacks.get(normalizedIdentifier)) && void 0 !== _a ? _a : new Set;
                    existingCallbacks.add(callback);
                    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
                    const existingInstance = this.instances.get(normalizedIdentifier);
                    if (existingInstance) callback(existingInstance, normalizedIdentifier);
                    return () => {
                        existingCallbacks.delete(callback);
                    };
                }
                invokeOnInitCallbacks(instance, identifier) {
                    const callbacks = this.onInitCallbacks.get(identifier);
                    if (!callbacks) return;
                    for (const callback of callbacks) try {
                        callback(instance, identifier);
                    } catch (_a) {}
                }
                getOrInitializeService({instanceIdentifier, options = {}}) {
                    let instance = this.instances.get(instanceIdentifier);
                    if (!instance && this.component) {
                        instance = this.component.instanceFactory(this.container, {
                            instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
                            options
                        });
                        this.instances.set(instanceIdentifier, instance);
                        this.instancesOptions.set(instanceIdentifier, options);
                        this.invokeOnInitCallbacks(instance, instanceIdentifier);
                        if (this.component.onInstanceCreated) try {
                            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
                        } catch (_a) {}
                    }
                    return instance || null;
                }
                normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
                    if (this.component) return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME; else return identifier;
                }
                shouldAutoInitialize() {
                    return !!this.component && "EXPLICIT" !== this.component.instantiationMode;
                }
            }
            function normalizeIdentifierForFactory(identifier) {
                return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
            }
            function isComponentEager(component) {
                return "EAGER" === component.instantiationMode;
            }
            /**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            class ComponentContainer {
                constructor(name) {
                    this.name = name;
                    this.providers = new Map;
                }
                addComponent(component) {
                    const provider = this.getProvider(component.name);
                    if (provider.isComponentSet()) throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
                    provider.setComponent(component);
                }
                addOrOverwriteComponent(component) {
                    const provider = this.getProvider(component.name);
                    if (provider.isComponentSet()) this.providers.delete(component.name);
                    this.addComponent(component);
                }
                getProvider(name) {
                    if (this.providers.has(name)) return this.providers.get(name);
                    const provider = new Provider(name, this);
                    this.providers.set(name, provider);
                    return provider;
                }
                getProviders() {
                    return Array.from(this.providers.values());
                }
            }
        },
        333: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                Yd: () => Logger,
                in: () => LogLevel
            });
            /**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */            const instances = [];
            var LogLevel;
            (function(LogLevel) {
                LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
                LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
                LogLevel[LogLevel["INFO"] = 2] = "INFO";
                LogLevel[LogLevel["WARN"] = 3] = "WARN";
                LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
                LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
            })(LogLevel || (LogLevel = {}));
            const levelStringToEnum = {
                debug: LogLevel.DEBUG,
                verbose: LogLevel.VERBOSE,
                info: LogLevel.INFO,
                warn: LogLevel.WARN,
                error: LogLevel.ERROR,
                silent: LogLevel.SILENT
            };
            const defaultLogLevel = LogLevel.INFO;
            const ConsoleMethod = {
                [LogLevel.DEBUG]: "log",
                [LogLevel.VERBOSE]: "log",
                [LogLevel.INFO]: "info",
                [LogLevel.WARN]: "warn",
                [LogLevel.ERROR]: "error"
            };
            const defaultLogHandler = (instance, logType, ...args) => {
                if (logType < instance.logLevel) return;
                const now = (new Date).toISOString();
                const method = ConsoleMethod[logType];
                if (method) console[method](`[${now}]  ${instance.name}:`, ...args); else throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
            };
            class Logger {
                constructor(name) {
                    this.name = name;
                    this._logLevel = defaultLogLevel;
                    this._logHandler = defaultLogHandler;
                    this._userLogHandler = null;
                    instances.push(this);
                }
                get logLevel() {
                    return this._logLevel;
                }
                set logLevel(val) {
                    if (!(val in LogLevel)) throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
                    this._logLevel = val;
                }
                setLogLevel(val) {
                    this._logLevel = "string" === typeof val ? levelStringToEnum[val] : val;
                }
                get logHandler() {
                    return this._logHandler;
                }
                set logHandler(val) {
                    if ("function" !== typeof val) throw new TypeError("Value assigned to `logHandler` must be a function");
                    this._logHandler = val;
                }
                get userLogHandler() {
                    return this._userLogHandler;
                }
                set userLogHandler(val) {
                    this._userLogHandler = val;
                }
                debug(...args) {
                    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
                    this._logHandler(this, LogLevel.DEBUG, ...args);
                }
                log(...args) {
                    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
                    this._logHandler(this, LogLevel.VERBOSE, ...args);
                }
                info(...args) {
                    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
                    this._logHandler(this, LogLevel.INFO, ...args);
                }
                warn(...args) {
                    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
                    this._logHandler(this, LogLevel.WARN, ...args);
                }
                error(...args) {
                    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
                    this._logHandler(this, LogLevel.ERROR, ...args);
                }
            }
        },
        972: (__webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {
            __webpack_require__.a(__webpack_module__, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
                try {
                    var _files_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
                    __webpack_require__(566);
                    __webpack_require__(380);
                    var _files_script_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(794);
                    var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([ _files_script_js__WEBPACK_IMPORTED_MODULE_3__ ]);
                    _files_script_js__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
                    window["FLS"] = true;
                    _files_functions_js__WEBPACK_IMPORTED_MODULE_0__.An();
                    __webpack_async_result__();
                } catch (e) {
                    __webpack_async_result__(e);
                }
            }));
        },
        566: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__(627);
            __webpack_require__(307);
            __webpack_require__(862);
        },
        307: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                An: () => isWebp
            });
            __webpack_require__(627);
            function isWebp() {
                function testWebP(callback) {
                    let webP = new Image;
                    webP.onload = webP.onerror = function() {
                        callback(2 == webP.height);
                    };
                    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
                }
                testWebP((function(support) {
                    let className = true === support ? "webp" : "no-webp";
                    document.documentElement.classList.add(className);
                }));
            }
        },
        994: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                VZ: () => isError,
                d6: () => isSuccess,
                dH: () => errorValidate,
                eH: () => modalVisible
            });
            const modalWindow = document.querySelector(".modal");
            const modalContent = document.querySelector(".modal__content");
            const isVisible = "is-visible";
            let modalMesssage = document.querySelector(".modal__text");
            const errorValidate = "Invalid email or password";
            function modalVisible(message) {
                modalWindow.classList.add(isVisible);
                modalContent.style.animation = "loadAlert .2s linear 0s 1 forwards";
                modalMesssage.innerHTML = message;
                setTimeout((() => {
                    modalContent.style.animation = "closeAlert .125s linear 0s 1 forwards";
                }), 1700);
                setTimeout((() => {
                    modalWindow.classList.remove(isVisible);
                }), 2e3);
            }
            function isError() {
                modalContent.classList.add("modal__content--alert");
                setTimeout((() => {
                    modalContent.classList.remove("modal__content--alert");
                }), 2e3);
            }
            function isSuccess() {
                modalContent.classList.add("modal__content--checked");
                setTimeout((() => {
                    modalContent.classList.remove("modal__content--checked");
                }), 2e3);
            }
        },
        627: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                S: () => flsModules
            });
            const flsModules = {};
        },
        794: (__webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.a(__webpack_module__, (async (__webpack_handle_async_dependencies__, __webpack_async_result__) => {
                try {
                    var _modal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(994);
                    var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(503);
                    var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(956);
                    var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(724);
                    const firebaseConfig = {
                        apiKey: "AIzaSyBtqZbY6PnEMXjuFAdT6yvOvb7UgHvM42k",
                        authDomain: "auth-examplec.firebaseapp.com",
                        databaseURL: "https://auth-examplec-default-rtdb.firebaseio.com",
                        projectId: "auth-examplec",
                        storageBucket: "auth-examplec.appspot.com",
                        messagingSenderId: "724261682760",
                        appId: "1:724261682760:web:12652068e198094cdee27d"
                    };
                    const app = (0, firebase_app__WEBPACK_IMPORTED_MODULE_1__.ZF)(firebaseConfig);
                    const database = (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.N8)(app);
                    const auth = (0, firebase_auth__WEBPACK_IMPORTED_MODULE_3__.v0)();
                    (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.N8)();
                    let allUsersEmail, UsersAccounts = [];
                    const emails = document.querySelector(".emails");
                    const user = await getUser();
                    (0, firebase_auth__WEBPACK_IMPORTED_MODULE_3__.w7)(auth);
                    function getUser() {
                        return new Promise(((resolve, _) => {
                            const unsub = (0, firebase_auth__WEBPACK_IMPORTED_MODULE_3__.Aj)(auth, (user => {
                                unsub();
                                return resolve(user);
                            }));
                        }));
                    }
                    if (document.querySelector(".page-homepage")) {
                        const formAuth = document.querySelector(".sign-form");
                        const signUp = document.getElementById("signUp");
                        const login = document.getElementById("login");
                        const logout = document.getElementById("logout");
                        const goSignUp = document.querySelector(".goSignUp");
                        const goSignIn = document.querySelector(".goSignIn");
                        const showUsers = document.querySelector(".showUsers");
                        const loggedTitle = document.querySelector(".loggedTitle");
                        const authTitle = document.querySelector(".page-sign__title");
                        let validRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                        let validPass = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
                        function accountIsRegistred() {
                            signUp.style.display = "none";
                            goSignIn.style.display = "none";
                            login.style.display = "block";
                            goSignUp.style.display = "block";
                            authTitle.innerHTML = "sign in";
                            formAuth.classList.remove("registration");
                            formAuth.classList.add("authentication");
                        }
                        function logged() {
                            let email = document.querySelector(".sign-form__email");
                            let password = document.querySelector(".sign-form__password");
                            login.style.display = "none";
                            signUp.style.display = "none";
                            goSignIn.style.display = "none";
                            goSignUp.style.display = "none";
                            email.style.display = "none";
                            password.style.display = "none";
                            logout.style.display = "block";
                            loggedTitle.style.display = "block";
                            showUsers.style.display = "block";
                            formAuth.classList.add("logged");
                            formAuth.classList.remove("authentication");
                            formAuth.classList.remove("registration");
                        }
                        function registration() {
                            goSignUp.style.display = "none";
                            logout.style.display = "none";
                            login.style.display = "none";
                            signUp.style.display = "block";
                            goSignIn.style.display = "block";
                            authTitle.innerHTML = "sign up";
                            formAuth.classList.remove("authentication");
                            formAuth.classList.add("registration");
                        }
                        function goLogin() {
                            let email = document.querySelector(".sign-form__email");
                            let password = document.querySelector(".sign-form__password");
                            accountIsRegistred();
                            logout.style.display = "none";
                            showUsers.style.display = "none";
                            email.style.display = "block";
                            password.style.display = "block";
                            loggedTitle.style.display = "none";
                            formAuth.classList.add("authentication");
                            formAuth.classList.remove("logged");
                        }
                        goSignIn.addEventListener("click", (e => {
                            accountIsRegistred(signUp);
                            goSignIn.style.display = "none";
                        }));
                        goSignUp.addEventListener("click", (e => {
                            registration();
                        }));
                        formAuth.addEventListener("submit", (e => {
                            e.preventDefault();
                            let email = document.getElementById("email").value;
                            let password = document.getElementById("password").value;
                            if (formAuth.classList.contains("registration")) if (email.match(validRegex) && password.match(validPass)) (0, 
                            firebase_auth__WEBPACK_IMPORTED_MODULE_3__.Xb)(auth, email, password).then((userCredential => {
                                const user = userCredential.user;
                                (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.t8)((0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.iH)(database, "users/" + user.uid), {
                                    email,
                                    password
                                }), (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Created " + email, (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.d6)());
                                accountIsRegistred();
                                document.getElementById("password").value = "";
                            })).catch((error => {
                                let errorCode = error.code;
                                let errorMessage = error.message;
                                switch (errorCode) {
                                  case "auth/email-already-in-use":
                                    errorMessage = "Email already in use";
                                    break;

                                  case "auth/weak-password":
                                    errorMessage = "Password should be at least 6 characters";
                                    break;

                                  case "auth/internal-error":
                                    errorMessage = _modal_js__WEBPACK_IMPORTED_MODULE_0__.dH;
                                    break;

                                  case "auth/invalid-email":
                                    errorMessage = "Invalid email or password";
                                    break;

                                  case "auth/missing-email":
                                    errorMessage = "Missing email";
                                    break;

                                  default:
                                    error.code;
                                    break;
                                }
                                (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)(errorMessage, (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)());
                            })); else (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)(_modal_js__WEBPACK_IMPORTED_MODULE_0__.dH, (0, 
                            _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)()); else if (formAuth.classList.contains("authentication")) {
                                let email = document.getElementById("email").value;
                                let password = document.getElementById("password").value;
                                (0, firebase_auth__WEBPACK_IMPORTED_MODULE_3__.e5)(auth, email, password).then((userCredential => {
                                    const user = userCredential.user;
                                    const dt = new Date;
                                    (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.Vx)((0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.iH)(database, "users/" + user.uid), {
                                        last_login: dt
                                    });
                                    (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Loged in! " + email, (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.d6)());
                                    logged();
                                    createEmails();
                                    loggedTitle.innerHTML = ` You are logged as  <b>${email}</b>`;
                                })).catch((error => {
                                    let errorCode = error.code;
                                    let errorMessage = error.message;
                                    console.log(errorCode);
                                    console.log(errorMessage);
                                    switch (errorCode) {
                                      case "auth/user-not-found":
                                        errorMessage = "User not found";
                                        break;

                                      case "auth/weak-password":
                                        errorMessage = "Password should be at least 6 characters";
                                        break;

                                      case "auth/internal-error":
                                        errorMessage = _modal_js__WEBPACK_IMPORTED_MODULE_0__.dH;
                                        break;

                                      case "auth/invalid-email":
                                        errorMessage = "Invalid email or password";
                                        break;

                                      case "auth/missing-email":
                                        errorMessage = "Missing email";
                                        break;

                                      case "auth/wrong-password":
                                        errorMessage = "Wrong password";
                                        break;

                                      case "auth/too-many-requests":
                                        errorMessage = "Too many requests";
                                        break;

                                      default:
                                        error.code;
                                        break;
                                    }
                                    (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)(errorMessage, (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)());
                                }));
                            } else (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Auth error");
                        }));
                        logout.addEventListener("click", (e => {
                            document.getElementById("password").value = "";
                            (0, firebase_auth__WEBPACK_IMPORTED_MODULE_3__.w7)(auth).then((() => {
                                (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("logged out", (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.d6)());
                                goLogin();
                            })).catch((error => {
                                error.code;
                                const errorMessage = error.message;
                                (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)(errorMessage, (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)());
                            }));
                        }));
                        showUsers.addEventListener("click", (() => {
                            const user = auth.currentUser;
                            getUser().then((() => {
                                user && formAuth.classList.contains("logged") ? window.location.replace("/users.html") : (0, 
                                _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Need to login", (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)());
                            })).catch((error => {
                                (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Need to login", (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.VZ)());
                            }));
                        }));
                    }
 //! PAGE-HOMEPAGE
                                        if (document.querySelector(".page-database")) if (!user) window.location.replace("index.html"); else (0, 
                    _modal_js__WEBPACK_IMPORTED_MODULE_0__.eH)("Welcome to database", (0, _modal_js__WEBPACK_IMPORTED_MODULE_0__.d6)());
                    function createEmails() {
                        const dbRef = (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.iH)((0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.N8)());
                        (0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.U2)((0, firebase_database__WEBPACK_IMPORTED_MODULE_2__.iU)(dbRef, `users/`)).then((snapshot => {
                            snapshot.forEach((child => {
                                child.val().email;
                                allUsersEmail += " " + child.val().email;
                                UsersAccounts = allUsersEmail.trim().split(" ");
                            }));
                        }));
                    }
                    function getEmails() {
                        const ul = document.createElement("ul");
                        for (let item in UsersAccounts) {
                            let li = document.createElement("li");
                            li.innerText = UsersAccounts[item];
                            ul.appendChild(li);
                        }
                        emails.append(ul);
                    }
                    if (document.querySelector(".page-database")) {
                        createEmails();
                        setTimeout((() => {
                            getEmails();
                        }), 2e3);
                        const goHome = document.querySelector(".goHome");
                        goHome.addEventListener("click", (() => {
                            window.location.replace("index.html");
                            allUsersEmail = [];
                            while (emails.firstChild) emails.removeChild(emails.firstChild);
                        }));
                    }
                    __webpack_async_result__();
                } catch (e) {
                    __webpack_async_result__(e);
                }
            }), 1);
        },
        862: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__(307);
        },
        380: (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
            __webpack_require__(307);
            __webpack_require__(862);
            let addWindowScrollEvent = false;
            setTimeout((() => {
                if (addWindowScrollEvent) {
                    let windowScroll = new Event("windowScroll");
                    window.addEventListener("scroll", (function(e) {
                        document.dispatchEvent(windowScroll);
                    }));
                }
            }), 0);
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    (() => {
        var webpackThen = "function" === typeof Symbol ? Symbol("webpack then") : "__webpack_then__";
        var webpackExports = "function" === typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__";
        var webpackError = "function" === typeof Symbol ? Symbol("webpack error") : "__webpack_error__";
        var completeQueue = queue => {
            if (queue) {
                queue.forEach((fn => fn.r--));
                queue.forEach((fn => fn.r-- ? fn.r++ : fn()));
            }
        };
        var completeFunction = fn => !--fn.r && fn();
        var queueFunction = (queue, fn) => queue ? queue.push(fn) : completeFunction(fn);
        var wrapDeps = deps => deps.map((dep => {
            if (null !== dep && "object" === typeof dep) {
                if (dep[webpackThen]) return dep;
                if (dep.then) {
                    var queue = [];
                    dep.then((r => {
                        obj[webpackExports] = r;
                        completeQueue(queue);
                        queue = 0;
                    }), (e => {
                        obj[webpackError] = e;
                        completeQueue(queue);
                        queue = 0;
                    }));
                    var obj = {};
                    obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep["catch"](reject));
                    return obj;
                }
            }
            var ret = {};
            ret[webpackThen] = fn => completeFunction(fn);
            ret[webpackExports] = dep;
            return ret;
        }));
        __webpack_require__.a = (module, body, hasAwait) => {
            var queue = hasAwait && [];
            var exports = module.exports;
            var currentDeps;
            var outerResolve;
            var reject;
            var isEvaluating = true;
            var nested = false;
            var whenAll = (deps, onResolve, onReject) => {
                if (nested) return;
                nested = true;
                onResolve.r += deps.length;
                deps.map(((dep, i) => dep[webpackThen](onResolve, onReject)));
                nested = false;
            };
            var promise = new Promise(((resolve, rej) => {
                reject = rej;
                outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
            }));
            promise[webpackExports] = exports;
            promise[webpackThen] = (fn, rejectFn) => {
                if (isEvaluating) return completeFunction(fn);
                if (currentDeps) whenAll(currentDeps, fn, rejectFn);
                queueFunction(queue, fn);
                promise["catch"](rejectFn);
            };
            module.exports = promise;
            body((deps => {
                currentDeps = wrapDeps(deps);
                var fn;
                var getResult = () => currentDeps.map((d => {
                    if (d[webpackError]) throw d[webpackError];
                    return d[webpackExports];
                }));
                var promise = new Promise(((resolve, reject) => {
                    fn = () => resolve(getResult);
                    fn.r = 0;
                    whenAll(currentDeps, fn, reject);
                }));
                return fn.r ? promise : getResult();
            }), (err => (err && reject(promise[webpackError] = err), outerResolve())));
            isEvaluating = false;
        };
    })();
    (() => {
        __webpack_require__.d = (exports, definition) => {
            for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
                enumerable: true,
                get: definition[key]
            });
        };
    })();
    (() => {
        __webpack_require__.g = function() {
            if ("object" === typeof globalThis) return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if ("object" === typeof window) return window;
            }
        }();
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    __webpack_require__(972);
})();