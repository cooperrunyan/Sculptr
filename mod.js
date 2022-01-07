function notImplemented(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    throw new Error(message);
}
function normalizeEncoding(enc) {
    if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
    return slowCases(enc);
}
function slowCases(enc) {
    switch(enc.length){
        case 4:
            if (enc === "UTF8") return "utf8";
            if (enc === "ucs2" || enc === "UCS2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf8") return "utf8";
            if (enc === "ucs2") return "utf16le";
            break;
        case 3:
            if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") return "hex";
            break;
        case 5:
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            if (enc === "UTF-8") return "utf8";
            if (enc === "ASCII") return "ascii";
            if (enc === "UCS-2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf-8") return "utf8";
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            break;
        case 6:
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            if (enc === "BASE64") return "base64";
            if (enc === "LATIN1" || enc === "BINARY") return "latin1";
            enc = `${enc}`.toLowerCase();
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            break;
        case 7:
            if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") return "utf16le";
            break;
        case 8:
            if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") return "utf16le";
            break;
        default:
            if (enc === "") return "utf8";
    }
}
const arch = Deno.build.arch;
const chdir = Deno.chdir;
const cwd = Deno.cwd;
const exit = Deno.exit;
const pid = Deno.pid;
const platform = Deno.build.os === "windows" ? "win32" : Deno.build.os;
const version = `v${Deno.version.deno}`;
const versions = {
    node: Deno.version.deno,
    ...Deno.version
};
const process = {
    arch,
    chdir,
    cwd,
    exit,
    pid,
    platform,
    version,
    versions,
    on (_event, _callback) {
        notImplemented();
    },
    get argv () {
        return [
            Deno.execPath(),
            ...Deno.args
        ];
    },
    get env () {
        return Deno.env.toObject();
    }
};
const argv = new Proxy(process.argv, {
});
const env = new Proxy(process.env, {
});
Object.defineProperty(process, Symbol.toStringTag, {
    enumerable: false,
    writable: true,
    configurable: false,
    value: "process"
});
Object.defineProperty(globalThis, "process", {
    value: process,
    enumerable: false,
    writable: true,
    configurable: true
});
const mod = {
    arch: arch,
    chdir: chdir,
    cwd: cwd,
    exit: exit,
    pid: pid,
    platform: platform,
    version: version,
    versions: versions,
    process: process,
    argv: argv,
    env: env,
    default: process
};
Object.prototype.toString;
const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
const kCustomPromisifyArgsSymbol = Symbol.for("nodejs.util.promisify.customArgs");
class NodeInvalidArgTypeError extends TypeError {
    code = "ERR_INVALID_ARG_TYPE";
    constructor(argumentName, type, received){
        super(`The "${argumentName}" argument must be of type ${type}. Received ${typeof received}`);
    }
}
function promisify(original) {
    if (typeof original !== "function") throw new NodeInvalidArgTypeError("original", "Function", original);
    if (original[kCustomPromisifiedSymbol]) {
        const fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
            throw new NodeInvalidArgTypeError("util.promisify.custom", "Function", fn);
        }
        return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    const argumentNames = original[kCustomPromisifyArgsSymbol];
    function fn(...args) {
        return new Promise((resolve9, reject)=>{
            original.call(this, ...args, (err, ...values)=>{
                if (err) {
                    return reject(err);
                }
                if (argumentNames !== undefined && values.length > 1) {
                    const obj = {
                    };
                    for(let i = 0; i < argumentNames.length; i++){
                        obj[argumentNames[i]] = values[i];
                    }
                    resolve9(obj);
                } else {
                    resolve9(values[0]);
                }
            });
        });
    }
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
    });
    return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisifiedSymbol;
function validateIntegerRange(value, name, min = -2147483648, max = 2147483647) {
    if (!Number.isInteger(value)) {
        throw new Error(`${name} must be 'an integer' but was ${value}`);
    }
    if (value < min || value > max) {
        throw new Error(`${name} must be >= ${min} && <= ${max}.  Value was ${value}`);
    }
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
class EventEmitter {
    static defaultMaxListeners = 10;
    static errorMonitor = Symbol("events.errorMonitor");
    maxListeners;
    _events;
    constructor(){
        this._events = new Map();
    }
    _addListener(eventName, listener, prepend) {
        this.emit("newListener", eventName, listener);
        if (this._events.has(eventName)) {
            const listeners = this._events.get(eventName);
            if (prepend) {
                listeners.unshift(listener);
            } else {
                listeners.push(listener);
            }
        } else {
            this._events.set(eventName, [
                listener
            ]);
        }
        const max = this.getMaxListeners();
        if (max > 0 && this.listenerCount(eventName) > max) {
            const warning = new Error(`Possible EventEmitter memory leak detected.
         ${this.listenerCount(eventName)} ${eventName.toString()} listeners.
         Use emitter.setMaxListeners() to increase limit`);
            warning.name = "MaxListenersExceededWarning";
            console.warn(warning);
        }
        return this;
    }
    addListener(eventName, listener) {
        return this._addListener(eventName, listener, false);
    }
    emit(eventName, ...args) {
        if (this._events.has(eventName)) {
            if (eventName === "error" && this._events.get(EventEmitter.errorMonitor)) {
                this.emit(EventEmitter.errorMonitor, ...args);
            }
            const listeners = this._events.get(eventName).slice();
            for (const listener of listeners){
                try {
                    listener.apply(this, args);
                } catch (err) {
                    this.emit("error", err);
                }
            }
            return true;
        } else if (eventName === "error") {
            if (this._events.get(EventEmitter.errorMonitor)) {
                this.emit(EventEmitter.errorMonitor, ...args);
            }
            const errMsg = args.length > 0 ? args[0] : Error("Unhandled error.");
            throw errMsg;
        }
        return false;
    }
    eventNames() {
        return Array.from(this._events.keys());
    }
    getMaxListeners() {
        return this.maxListeners || EventEmitter.defaultMaxListeners;
    }
    listenerCount(eventName) {
        if (this._events.has(eventName)) {
            return this._events.get(eventName).length;
        } else {
            return 0;
        }
    }
    _listeners(target, eventName, unwrap) {
        if (!target._events.has(eventName)) {
            return [];
        }
        const eventListeners = target._events.get(eventName);
        return unwrap ? this.unwrapListeners(eventListeners) : eventListeners.slice(0);
    }
    unwrapListeners(arr) {
        const unwrappedListeners = new Array(arr.length);
        for(let i = 0; i < arr.length; i++){
            unwrappedListeners[i] = arr[i]["listener"] || arr[i];
        }
        return unwrappedListeners;
    }
    listeners(eventName) {
        return this._listeners(this, eventName, true);
    }
    rawListeners(eventName) {
        return this._listeners(this, eventName, false);
    }
    off(eventName, listener) {
        return this.removeListener(eventName, listener);
    }
    on(eventName, listener) {
        return this.addListener(eventName, listener);
    }
    once(eventName, listener) {
        const wrapped = this.onceWrap(eventName, listener);
        this.on(eventName, wrapped);
        return this;
    }
    onceWrap(eventName, listener) {
        const wrapper = function(...args) {
            this.context.removeListener(this.eventName, this.rawListener);
            this.listener.apply(this.context, args);
        };
        const wrapperContext = {
            eventName: eventName,
            listener: listener,
            rawListener: wrapper,
            context: this
        };
        const wrapped = wrapper.bind(wrapperContext);
        wrapperContext.rawListener = wrapped;
        wrapped.listener = listener;
        return wrapped;
    }
    prependListener(eventName, listener) {
        return this._addListener(eventName, listener, true);
    }
    prependOnceListener(eventName, listener) {
        const wrapped = this.onceWrap(eventName, listener);
        this.prependListener(eventName, wrapped);
        return this;
    }
    removeAllListeners(eventName) {
        if (this._events === undefined) {
            return this;
        }
        if (eventName) {
            if (this._events.has(eventName)) {
                const listeners = this._events.get(eventName).slice();
                this._events.delete(eventName);
                for (const listener of listeners){
                    this.emit("removeListener", eventName, listener);
                }
            }
        } else {
            const eventList = this.eventNames();
            eventList.map((value)=>{
                this.removeAllListeners(value);
            });
        }
        return this;
    }
    removeListener(eventName, listener) {
        if (this._events.has(eventName)) {
            const arr = this._events.get(eventName);
            assert(arr);
            let listenerIndex = -1;
            for(let i = arr.length - 1; i >= 0; i--){
                if (arr[i] == listener || arr[i] && arr[i]["listener"] == listener) {
                    listenerIndex = i;
                    break;
                }
            }
            if (listenerIndex >= 0) {
                arr.splice(listenerIndex, 1);
                this.emit("removeListener", eventName, listener);
                if (arr.length === 0) {
                    this._events.delete(eventName);
                }
            }
        }
        return this;
    }
    setMaxListeners(n) {
        validateIntegerRange(n, "maxListeners", 0);
        this.maxListeners = n;
        return this;
    }
}
const hextable = new TextEncoder().encode("0123456789abcdef");
function errInvalidByte(__byte) {
    return new Error("encoding/hex: invalid byte: " + new TextDecoder().decode(new Uint8Array([
        __byte
    ])));
}
function errLength() {
    return new Error("encoding/hex: odd length hex string");
}
function fromHexChar(__byte) {
    if (48 <= __byte && __byte <= 57) return __byte - 48;
    if (97 <= __byte && __byte <= 102) return __byte - 97 + 10;
    if (65 <= __byte && __byte <= 70) return __byte - 65 + 10;
    throw errInvalidByte(__byte);
}
function encodedLen(n) {
    return n * 2;
}
function encode(src) {
    const dst = new Uint8Array(encodedLen(src.length));
    for(let i = 0; i < dst.length; i++){
        const v = src[i];
        dst[i * 2] = hextable[v >> 4];
        dst[i * 2 + 1] = hextable[v & 15];
    }
    return dst;
}
function encodeToString(src) {
    return new TextDecoder().decode(encode(src));
}
function decode(src) {
    const dst = new Uint8Array(decodedLen(src.length));
    for(let i = 0; i < dst.length; i++){
        const a = fromHexChar(src[i * 2]);
        const b = fromHexChar(src[i * 2 + 1]);
        dst[i] = a << 4 | b;
    }
    if (src.length % 2 == 1) {
        fromHexChar(src[dst.length * 2]);
        throw errLength();
    }
    return dst;
}
function decodedLen(x) {
    return x >>> 1;
}
function decodeString(s) {
    return decode(new TextEncoder().encode(s));
}
function encode1(data) {
    if (typeof data === "string") {
        return btoa(data);
    } else {
        const d = new Uint8Array(data);
        let dataString = "";
        for(let i = 0; i < d.length; ++i){
            dataString += String.fromCharCode(d[i]);
        }
        return btoa(dataString);
    }
}
function decode1(data) {
    const binaryString = decodeString1(data);
    const binary = new Uint8Array(binaryString.length);
    for(let i = 0; i < binary.length; ++i){
        binary[i] = binaryString.charCodeAt(i);
    }
    return binary.buffer;
}
function decodeString1(data) {
    return atob(data);
}
const notImplementedEncodings = [
    "utf16le",
    "latin1",
    "ascii",
    "binary",
    "ucs2", 
];
function checkEncoding(encoding = "utf8", strict = true) {
    if (typeof encoding !== "string" || strict && encoding === "") {
        if (!strict) return "utf8";
        throw new TypeError(`Unkown encoding: ${encoding}`);
    }
    const normalized = normalizeEncoding(encoding);
    if (normalized === undefined) throw new TypeError(`Unkown encoding: ${encoding}`);
    if (notImplementedEncodings.includes(encoding)) {
        notImplemented(`"${encoding}" encoding`);
    }
    return normalized;
}
const encodingOps = {
    utf8: {
        byteLength: (string)=>new TextEncoder().encode(string).byteLength
    },
    ucs2: {
        byteLength: (string)=>string.length * 2
    },
    utf16le: {
        byteLength: (string)=>string.length * 2
    },
    latin1: {
        byteLength: (string)=>string.length
    },
    ascii: {
        byteLength: (string)=>string.length
    },
    base64: {
        byteLength: (string)=>base64ByteLength(string, string.length)
    },
    hex: {
        byteLength: (string)=>string.length >>> 1
    }
};
function base64ByteLength(str, bytes) {
    if (str.charCodeAt(bytes - 1) === 61) bytes--;
    if (bytes > 1 && str.charCodeAt(bytes - 1) === 61) bytes--;
    return bytes * 3 >>> 2;
}
class Buffer extends Uint8Array {
    static alloc(size, fill, encoding = "utf8") {
        if (typeof size !== "number") {
            throw new TypeError(`The "size" argument must be of type number. Received type ${typeof size}`);
        }
        const buf = new Buffer(size);
        if (size === 0) return buf;
        let bufFill;
        if (typeof fill === "string") {
            encoding = checkEncoding(encoding);
            if (typeof fill === "string" && fill.length === 1 && encoding === "utf8") buf.fill(fill.charCodeAt(0));
            else bufFill = Buffer.from(fill, encoding);
        } else if (typeof fill === "number") {
            buf.fill(fill);
        } else if (fill instanceof Uint8Array) {
            if (fill.length === 0) {
                throw new TypeError(`The argument "value" is invalid. Received ${fill.constructor.name} []`);
            }
            bufFill = fill;
        }
        if (bufFill) {
            if (bufFill.length > buf.length) bufFill = bufFill.subarray(0, buf.length);
            let offset = 0;
            while(offset < size){
                buf.set(bufFill, offset);
                offset += bufFill.length;
                if (offset + bufFill.length >= size) break;
            }
            if (offset !== size) {
                buf.set(bufFill.subarray(0, size - offset), offset);
            }
        }
        return buf;
    }
    static allocUnsafe(size) {
        return new Buffer(size);
    }
    static byteLength(string, encoding = "utf8") {
        if (typeof string != "string") return string.byteLength;
        encoding = normalizeEncoding(encoding) || "utf8";
        return encodingOps[encoding].byteLength(string);
    }
    static concat(list1, totalLength) {
        if (totalLength == undefined) {
            totalLength = 0;
            for (const buf of list1){
                totalLength += buf.length;
            }
        }
        const buffer = new Buffer(totalLength);
        let pos = 0;
        for (const buf of list1){
            buffer.set(buf, pos);
            pos += buf.length;
        }
        return buffer;
    }
    static from(value, offsetOrEncoding, length) {
        const offset = typeof offsetOrEncoding === "string" ? undefined : offsetOrEncoding;
        let encoding = typeof offsetOrEncoding === "string" ? offsetOrEncoding : undefined;
        if (typeof value == "string") {
            encoding = checkEncoding(encoding, false);
            if (encoding === "hex") return new Buffer(decodeString(value).buffer);
            if (encoding === "base64") return new Buffer(decode1(value));
            return new Buffer(new TextEncoder().encode(value).buffer);
        }
        return new Buffer(value, offset, length);
    }
    static isBuffer(obj) {
        return obj instanceof Buffer;
    }
    static isEncoding(encoding) {
        return typeof encoding === "string" && encoding.length !== 0 && normalizeEncoding(encoding) !== undefined;
    }
    copy(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
        const sourceBuffer = this.subarray(sourceStart, sourceEnd);
        targetBuffer.set(sourceBuffer, targetStart);
        return sourceBuffer.length;
    }
    equals(otherBuffer) {
        if (!(otherBuffer instanceof Uint8Array)) {
            throw new TypeError(`The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received type ${typeof otherBuffer}`);
        }
        if (this === otherBuffer) return true;
        if (this.byteLength !== otherBuffer.byteLength) return false;
        for(let i = 0; i < this.length; i++){
            if (this[i] !== otherBuffer[i]) return false;
        }
        return true;
    }
    readBigInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset);
    }
    readBigInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset, true);
    }
    readBigUInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset);
    }
    readBigUInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset, true);
    }
    readDoubleBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset);
    }
    readDoubleLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset, true);
    }
    readFloatBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset);
    }
    readFloatLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset, true);
    }
    readInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt8(offset);
    }
    readInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset);
    }
    readInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset, true);
    }
    readInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset);
    }
    readInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset, true);
    }
    readUInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint8(offset);
    }
    readUInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset);
    }
    readUInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset, true);
    }
    readUInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset);
    }
    readUInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset, true);
    }
    slice(begin = 0, end = this.length) {
        return this.subarray(begin, end);
    }
    toJSON() {
        return {
            type: "Buffer",
            data: Array.from(this)
        };
    }
    toString(encoding = "utf8", start = 0, end = this.length) {
        encoding = checkEncoding(encoding);
        const b = this.subarray(start, end);
        if (encoding === "hex") return encodeToString(b);
        if (encoding === "base64") return encode1(b.buffer);
        return new TextDecoder(encoding).decode(b);
    }
    write(string, offset = 0, length = this.length) {
        return new TextEncoder().encodeInto(string, this.subarray(offset, offset + length)).written;
    }
    writeBigInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value);
        return offset + 4;
    }
    writeBigInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value, true);
        return offset + 4;
    }
    writeBigUInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value);
        return offset + 4;
    }
    writeBigUInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value, true);
        return offset + 4;
    }
    writeDoubleBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value);
        return offset + 8;
    }
    writeDoubleLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value, true);
        return offset + 8;
    }
    writeFloatBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value);
        return offset + 4;
    }
    writeFloatLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value, true);
        return offset + 4;
    }
    writeInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt8(offset, value);
        return offset + 1;
    }
    writeInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value);
        return offset + 2;
    }
    writeInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value, true);
        return offset + 2;
    }
    writeInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt32(offset, value, true);
        return offset + 4;
    }
    writeUInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint8(offset, value);
        return offset + 1;
    }
    writeUInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value);
        return offset + 2;
    }
    writeUInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value, true);
        return offset + 2;
    }
    writeUInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeUInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value, true);
        return offset + 4;
    }
}
Object.defineProperty(globalThis, "Buffer", {
    value: Buffer,
    enumerable: false,
    writable: true,
    configurable: true
});
const CHAR_FORWARD_SLASH = 47;
const navigator = globalThis.navigator;
let isWindows = false;
if (globalThis.Deno != null) {
    isWindows = Deno.build.os == "windows";
} else if (navigator?.appVersion != null) {
    isWindows = navigator.appVersion.includes("Win");
}
const SEP = isWindows ? "\\" : "/";
const SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/;
const SEP1 = isWindows ? `(?:\\\\|\\/)` : `\\/`;
const SEP_ESC = isWindows ? `\\\\` : `/`;
const SEP_RAW = isWindows ? `\\` : `/`;
const GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
const WILDCARD = `(?:[^${SEP_ESC}/]*)`;
const GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
const WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
function globrex(glob, { extended =false , globstar =false , strict =false , filepath =false , flags =""  } = {
}) {
    const sepPattern = new RegExp(`^${SEP1}${strict ? "" : "+"}$`);
    let regex = "";
    let segment = "";
    let pathRegexStr = "";
    const pathSegments = [];
    let inGroup = false;
    let inRange = false;
    const ext = [];
    function add1(str, options = {
        split: false,
        last: false,
        only: ""
    }) {
        const { split , last , only  } = options;
        if (only !== "path") regex += str;
        if (filepath && only !== "regex") {
            pathRegexStr += str.match(sepPattern) ? SEP1 : str;
            if (split) {
                if (last) segment += str;
                if (segment !== "") {
                    if (!flags.includes("g")) segment = `^${segment}$`;
                    pathSegments.push(new RegExp(segment, flags));
                }
                segment = "";
            } else {
                segment += str;
            }
        }
    }
    let c, n;
    for(let i = 0; i < glob.length; i++){
        c = glob[i];
        n = glob[i + 1];
        if ([
            "\\",
            "$",
            "^",
            ".",
            "="
        ].includes(c)) {
            add1(`\\${c}`);
            continue;
        }
        if (c.match(sepPattern)) {
            add1(SEP1, {
                split: true
            });
            if (n != null && n.match(sepPattern) && !strict) regex += "?";
            continue;
        }
        if (c === "(") {
            if (ext.length) {
                add1(`${c}?:`);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === ")") {
            if (ext.length) {
                add1(c);
                const type = ext.pop();
                if (type === "@") {
                    add1("{1}");
                } else if (type === "!") {
                    add1(WILDCARD);
                } else {
                    add1(type);
                }
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "|") {
            if (ext.length) {
                add1(c);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "+") {
            if (n === "(" && extended) {
                ext.push(c);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "@" && extended) {
            if (n === "(") {
                ext.push(c);
                continue;
            }
        }
        if (c === "!") {
            if (extended) {
                if (inRange) {
                    add1("^");
                    continue;
                }
                if (n === "(") {
                    ext.push(c);
                    add1("(?!");
                    i++;
                    continue;
                }
                add1(`\\${c}`);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "?") {
            if (extended) {
                if (n === "(") {
                    ext.push(c);
                } else {
                    add1(".");
                }
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "[") {
            if (inRange && n === ":") {
                i++;
                let value = "";
                while(glob[++i] !== ":")value += glob[i];
                if (value === "alnum") add1("(?:\\w|\\d)");
                else if (value === "space") add1("\\s");
                else if (value === "digit") add1("\\d");
                i++;
                continue;
            }
            if (extended) {
                inRange = true;
                add1(c);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "]") {
            if (extended) {
                inRange = false;
                add1(c);
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "{") {
            if (extended) {
                inGroup = true;
                add1("(?:");
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "}") {
            if (extended) {
                inGroup = false;
                add1(")");
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === ",") {
            if (inGroup) {
                add1("|");
                continue;
            }
            add1(`\\${c}`);
            continue;
        }
        if (c === "*") {
            if (n === "(" && extended) {
                ext.push(c);
                continue;
            }
            const prevChar = glob[i - 1];
            let starCount = 1;
            while(glob[i + 1] === "*"){
                starCount++;
                i++;
            }
            const nextChar = glob[i + 1];
            if (!globstar) {
                add1(".*");
            } else {
                const isGlobstar = starCount > 1 && [
                    SEP_RAW,
                    "/",
                    undefined
                ].includes(prevChar) && [
                    SEP_RAW,
                    "/",
                    undefined
                ].includes(nextChar);
                if (isGlobstar) {
                    add1(GLOBSTAR, {
                        only: "regex"
                    });
                    add1(GLOBSTAR_SEGMENT, {
                        only: "path",
                        last: true,
                        split: true
                    });
                    i++;
                } else {
                    add1(WILDCARD, {
                        only: "regex"
                    });
                    add1(WILDCARD_SEGMENT, {
                        only: "path"
                    });
                }
            }
            continue;
        }
        add1(c);
    }
    if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) pathRegexStr = `^${pathRegexStr}$`;
    }
    const result = {
        regex: new RegExp(regex, flags)
    };
    if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
            regex: new RegExp(pathRegexStr, flags),
            segments: pathSegments,
            globstar: new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags)
        };
    }
    return result;
}
function assertPath(path5) {
    if (typeof path5 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path5)}`);
    }
}
function isPosixPathSeparator(code) {
    return code === 47;
}
function isPathSeparator(code) {
    return isPosixPathSeparator(code) || code === 92;
}
function isWindowsDeviceRoot(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString(path6, allowAboveRoot, separator, isPathSeparator1) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path6.length; i <= len; ++i){
        if (i < len) code = path6.charCodeAt(i);
        else if (isPathSeparator1(code)) break;
        else code = CHAR_FORWARD_SLASH;
        if (isPathSeparator1(code)) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path6.slice(lastSlash + 1, i);
                else res = path6.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep9, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep9 + base;
}
const sep = "\\";
const delimiter = ";";
function resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path7;
        if (i >= 0) {
            path7 = pathSegments[i];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path7 = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path7 = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path7 === undefined || path7.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path7 = `${resolvedDevice}\\`;
            }
        }
        assertPath(path7);
        const len = path7.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute1 = false;
        const code = path7.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code)) {
                isAbsolute1 = true;
                if (isPathSeparator(path7.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator(path7.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path7.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator(path7.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator(path7.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path7.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path7.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot(code)) {
                if (path7.charCodeAt(1) === 58) {
                    device = path7.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path7.charCodeAt(2))) {
                            isAbsolute1 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator(code)) {
            rootEnd = 1;
            isAbsolute1 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path7.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute1;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path8) {
    assertPath(path8);
    const len = path8.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute2 = false;
    const code = path8.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            isAbsolute2 = true;
            if (isPathSeparator(path8.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path8.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path8.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path8.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path8.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path8.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path8.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path8.charCodeAt(1) === 58) {
                device = path8.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path8.charCodeAt(2))) {
                        isAbsolute2 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString(path8.slice(rootEnd), !isAbsolute2, "\\", isPathSeparator);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute2) tail = ".";
    if (tail.length > 0 && isPathSeparator(path8.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute2) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute2) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute(path9) {
    assertPath(path9);
    const len = path9.length;
    if (len === 0) return false;
    const code = path9.charCodeAt(0);
    if (isPathSeparator(code)) {
        return true;
    } else if (isWindowsDeviceRoot(code)) {
        if (len > 2 && path9.charCodeAt(1) === 58) {
            if (isPathSeparator(path9.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path10 = paths[i];
        assertPath(path10);
        if (path10.length > 0) {
            if (joined === undefined) joined = firstPart = path10;
            else joined += `\\${path10}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert(firstPart != null);
    if (isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize(joined);
}
function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    const fromOrig = resolve(from);
    const toOrig = resolve(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath(path11) {
    if (typeof path11 !== "string") return path11;
    if (path11.length === 0) return "";
    const resolvedPath = resolve(path11);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path11;
}
function dirname(path12) {
    assertPath(path12);
    const len = path12.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path12.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator(path12.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path12.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path12.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path12.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path12;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path12.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator(path12.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        return path12;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator(path12.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path12.slice(0, end);
}
function basename(path13, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path13);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path13.length >= 2) {
        const drive = path13.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path13.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path13.length) {
        if (ext.length === path13.length && ext === path13) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path13.length - 1; i >= start; --i){
            const code = path13.charCodeAt(i);
            if (isPathSeparator(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path13.length;
        return path13.slice(start, end);
    } else {
        for(i = path13.length - 1; i >= start; --i){
            if (isPathSeparator(path13.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path13.slice(start, end);
    }
}
function extname(path14) {
    assertPath(path14);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path14.length >= 2 && path14.charCodeAt(1) === 58 && isWindowsDeviceRoot(path14.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path14.length - 1; i >= start; --i){
        const code = path14.charCodeAt(i);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path14.slice(startDot, end);
}
function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse(path15) {
    assertPath(path15);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path15.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path15.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = 1;
            if (isPathSeparator(path15.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path15.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path15.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path15.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path15.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path15.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path15;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path15;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        ret.root = ret.dir = path15;
        return ret;
    }
    if (rootEnd > 0) ret.root = path15.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path15.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path15.charCodeAt(i);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path15.slice(startPart, end);
        }
    } else {
        ret.name = path15.slice(startPart, startDot);
        ret.base = path15.slice(startPart, end);
        ret.ext = path15.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path15.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl(url) {
    return new URL(String(url)).pathname.replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/").replace(/\//g, "\\");
}
const mod1 = {
    sep: sep,
    delimiter: delimiter,
    resolve: resolve,
    normalize: normalize,
    isAbsolute: isAbsolute,
    join: join,
    relative: relative,
    toNamespacedPath: toNamespacedPath,
    dirname: dirname,
    basename: basename,
    extname: extname,
    format: format,
    parse: parse,
    fromFileUrl: fromFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path16;
        if (i >= 0) path16 = pathSegments[i];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path16 = Deno.cwd();
        }
        assertPath(path16);
        if (path16.length === 0) {
            continue;
        }
        resolvedPath = `${path16}/${resolvedPath}`;
        resolvedAbsolute = path16.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path17) {
    assertPath(path17);
    if (path17.length === 0) return ".";
    const isAbsolute1 = path17.charCodeAt(0) === 47;
    const trailingSeparator = path17.charCodeAt(path17.length - 1) === 47;
    path17 = normalizeString(path17, !isAbsolute1, "/", isPosixPathSeparator);
    if (path17.length === 0 && !isAbsolute1) path17 = ".";
    if (path17.length > 0 && trailingSeparator) path17 += "/";
    if (isAbsolute1) return `/${path17}`;
    return path17;
}
function isAbsolute1(path18) {
    assertPath(path18);
    return path18.length > 0 && path18.charCodeAt(0) === 47;
}
function join1(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path19 = paths[i];
        assertPath(path19);
        if (path19.length > 0) {
            if (!joined) joined = path19;
            else joined += `/${path19}`;
        }
    }
    if (!joined) return ".";
    return normalize1(joined);
}
function relative1(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to) return "";
    from = resolve1(from);
    to = resolve1(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath1(path20) {
    return path20;
}
function dirname1(path21) {
    assertPath(path21);
    if (path21.length === 0) return ".";
    const hasRoot = path21.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path21.length - 1; i >= 1; --i){
        if (path21.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path21.slice(0, end);
}
function basename1(path22, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path22);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path22.length) {
        if (ext.length === path22.length && ext === path22) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path22.length - 1; i >= 0; --i){
            const code = path22.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path22.length;
        return path22.slice(start, end);
    } else {
        for(i = path22.length - 1; i >= 0; --i){
            if (path22.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path22.slice(start, end);
    }
}
function extname1(path23) {
    assertPath(path23);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path23.length - 1; i >= 0; --i){
        const code = path23.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path23.slice(startDot, end);
}
function format1(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
function parse1(path24) {
    assertPath(path24);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path24.length === 0) return ret;
    const isAbsolute2 = path24.charCodeAt(0) === 47;
    let start;
    if (isAbsolute2) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path24.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path24.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute2) {
                ret.base = ret.name = path24.slice(1, end);
            } else {
                ret.base = ret.name = path24.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute2) {
            ret.name = path24.slice(1, startDot);
            ret.base = path24.slice(1, end);
        } else {
            ret.name = path24.slice(startPart, startDot);
            ret.base = path24.slice(startPart, end);
        }
        ret.ext = path24.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path24.slice(0, startPart - 1);
    else if (isAbsolute2) ret.dir = "/";
    return ret;
}
function fromFileUrl1(url) {
    return new URL(String(url)).pathname;
}
const mod2 = {
    sep: sep1,
    delimiter: delimiter1,
    resolve: resolve1,
    normalize: normalize1,
    isAbsolute: isAbsolute1,
    join: join1,
    relative: relative1,
    toNamespacedPath: toNamespacedPath1,
    dirname: dirname1,
    basename: basename1,
    extname: extname1,
    format: format1,
    parse: parse1,
    fromFileUrl: fromFileUrl1
};
function common(paths, sep10 = SEP) {
    const [first = "", ...remaining] = paths;
    if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep10) + 1);
    }
    const parts = first.split(sep10);
    let endOfPrefix = parts.length;
    for (const path25 of remaining){
        const compare = path25.split(sep10);
        for(let i = 0; i < endOfPrefix; i++){
            if (compare[i] !== parts[i]) {
                endOfPrefix = i;
            }
        }
        if (endOfPrefix === 0) {
            return "";
        }
    }
    const prefix = parts.slice(0, endOfPrefix).join(sep10);
    return prefix.endsWith(sep10) ? prefix : `${prefix}${sep10}`;
}
const path = isWindows ? mod1 : mod2;
function globToRegExp(glob, { extended =false , globstar =true  } = {
}) {
    const result = globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true
    });
    assert(result.path != null);
    return result.path.regex;
}
const { basename: basename2 , delimiter: delimiter2 , dirname: dirname2 , extname: extname2 , format: format2 , fromFileUrl: fromFileUrl2 , isAbsolute: isAbsolute2 , join: join2 , normalize: normalize2 , parse: parse2 , relative: relative2 , resolve: resolve2 , sep: sep2 , toNamespacedPath: toNamespacedPath2 ,  } = path;
function isGlob(str) {
    const chars = {
        "{": "}",
        "(": ")",
        "[": "]"
    };
    const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str === "") {
        return false;
    }
    let match;
    while(match = regex.exec(str)){
        if (match[2]) return true;
        let idx = match.index + match[0].length;
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
            const n = str.indexOf(close, idx);
            if (n !== -1) {
                idx = n + 1;
            }
        }
        str = str.slice(idx);
    }
    return false;
}
function normalizeGlob(glob, { globstar =false  } = {
}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize2(glob);
    }
    const s = SEP_PATTERN.source;
    const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
    return normalize2(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs(globs, { extended =false , globstar =false  } = {
}) {
    if (!globstar || globs.length == 0) {
        return join2(...globs);
    }
    if (globs.length === 0) return ".";
    let joined;
    for (const glob of globs){
        const path26 = glob;
        if (path26.length > 0) {
            if (!joined) joined = path26;
            else joined += `${SEP}${path26}`;
        }
    }
    if (!joined) return ".";
    return normalizeGlob(joined, {
        extended,
        globstar
    });
}
const mod3 = {
    SEP: SEP,
    SEP_PATTERN: SEP_PATTERN,
    win32: mod1,
    posix: mod2,
    basename: basename2,
    delimiter: delimiter2,
    dirname: dirname2,
    extname: extname2,
    format: format2,
    fromFileUrl: fromFileUrl2,
    isAbsolute: isAbsolute2,
    join: join2,
    normalize: normalize2,
    parse: parse2,
    relative: relative2,
    resolve: resolve2,
    sep: sep2,
    toNamespacedPath: toNamespacedPath2,
    common,
    globToRegExp,
    isGlob,
    normalizeGlob,
    joinGlobs
};
const spawn = (command, args, opts)=>{
    return Deno.run({
        cmd: args && args.length ? [
            command,
            ...args
        ] : [
            command
        ]
    });
};
const existsSync = (filePath)=>{
    try {
        Deno.lstatSync(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
};
const fs = {
    existsSync,
    realpathSync: Deno.realPathSync
};
const process1 = {
    ...mod,
    get argv () {
        return [
            Deno.execPath(),
            ...Deno.args
        ];
    },
    mainModule: {
        filename: Deno.mainModule
    },
    execPath: Deno.execPath(),
    execArgv: Deno.args,
    exitCode: 0,
    platform: Deno.build.os === 'windows' ? 'win32' : Deno.build.os,
    stdout: {
        columns: 80,
        write (str) {
            Deno.stdout.writeSync(new TextEncoder().encode(str));
        }
    },
    exit: Deno.exit
};
class Option {
    flags;
    required;
    optional;
    mandatory;
    negate;
    short;
    long;
    description;
    defaultValue;
    constructor(flags, description){
        this.flags = flags;
        this.required = flags.indexOf('<') >= 0;
        this.optional = flags.indexOf('[') >= 0;
        this.mandatory = false;
        this.negate = flags.indexOf('-no-') !== -1;
        const flagParts = flags.split(/[ ,|]+/);
        if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) this.short = flagParts.shift();
        this.long = flagParts.shift() + '';
        this.description = description || '';
        this.defaultValue = undefined;
    }
    name() {
        return this.long.replace(/^--/, '');
    }
    attributeName() {
        return camelcase(this.name().replace(/^no-/, ''));
    }
    is(arg) {
        return this.short === arg || this.long === arg;
    }
}
class CommanderError extends Error {
    code;
    exitCode;
    nestedError;
    constructor(exitCode, code, message){
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = undefined;
    }
}
class Command extends EventEmitter {
    args;
    commands;
    constructor(name){
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._args = [];
        this.rawArgs = null;
        this._scriptPath = null;
        this._name = name || '';
        this._optionValues = {
        };
        this._storeOptionsAsProperties = true;
        this._passCommandToAction = true;
        this._actionResults = [];
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._hidden = false;
        this._helpFlags = '-h, --help';
        this._helpDescription = 'display help for command';
        this._helpShortFlag = '-h';
        this._helpLongFlag = '--help';
        this._hasImplicitHelpCommand = undefined;
        this._helpCommandName = 'help';
        this._helpCommandnameAndArgs = 'help [command]';
        this._helpCommandDescription = 'display help for command';
    }
    command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === 'object' && desc !== null) {
            opts = desc;
            desc = null;
        }
        opts = opts || {
        };
        const args = nameAndArgs.split(/ +/);
        const cmd = this.createCommand(args.shift());
        if (desc) {
            cmd.description(desc);
            cmd._executableHandler = true;
        }
        if (opts.isDefault) this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._helpFlags = this._helpFlags;
        cmd._helpDescription = this._helpDescription;
        cmd._helpShortFlag = this._helpShortFlag;
        cmd._helpLongFlag = this._helpLongFlag;
        cmd._helpCommandName = this._helpCommandName;
        cmd._helpCommandnameAndArgs = this._helpCommandnameAndArgs;
        cmd._helpCommandDescription = this._helpCommandDescription;
        cmd._exitCallback = this._exitCallback;
        cmd._storeOptionsAsProperties = this._storeOptionsAsProperties;
        cmd._passCommandToAction = this._passCommandToAction;
        cmd._executableFile = opts.executableFile || null;
        this.commands.push(cmd);
        cmd._parseExpectedArgs(args);
        cmd.parent = this;
        if (desc) return this;
        return cmd;
    }
    createCommand(name) {
        return new Command(name);
    }
    addCommand(cmd1, opts) {
        if (!cmd1._name) throw new Error('Command passed to .addCommand() must have a name');
        function checkExplicitNames(commandArray) {
            commandArray.forEach((cmd)=>{
                if (cmd._executableHandler && !cmd._executableFile) {
                    throw new Error(`Must specify executableFile for deeply nested executable: ${cmd.name()}`);
                }
                checkExplicitNames(cmd.commands);
            });
        }
        checkExplicitNames(cmd1.commands);
        opts = opts || {
        };
        if (opts.isDefault) this._defaultCommandName = cmd1._name;
        if (opts.noHelp || opts.hidden) cmd1._hidden = true;
        this.commands.push(cmd1);
        cmd1.parent = this;
        return this;
    }
    arguments(desc) {
        return this._parseExpectedArgs(desc.split(/ +/));
    }
    addHelpCommand(enableOrNameAndArgs, description) {
        if (enableOrNameAndArgs === false) {
            this._hasImplicitHelpCommand = false;
        } else {
            this._hasImplicitHelpCommand = true;
            if (typeof enableOrNameAndArgs === 'string') {
                this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
                this._helpCommandnameAndArgs = enableOrNameAndArgs;
            }
            this._helpCommandDescription = description || this._helpCommandDescription;
        }
        return this;
    }
    _lazyHasImplicitHelpCommand() {
        if (this._hasImplicitHelpCommand === undefined) {
            this._hasImplicitHelpCommand = this.commands.length && !this._actionHandler && !this._findCommand('help');
        }
        return this._hasImplicitHelpCommand;
    }
    _parseExpectedArgs(args) {
        if (!args.length) return;
        args.forEach((arg)=>{
            const argDetails = {
                required: false,
                name: '',
                variadic: false
            };
            switch(arg[0]){
                case '<':
                    argDetails.required = true;
                    argDetails.name = arg.slice(1, -1);
                    break;
                case '[':
                    argDetails.name = arg.slice(1, -1);
                    break;
            }
            if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
                argDetails.variadic = true;
                argDetails.name = argDetails.name.slice(0, -3);
            }
            if (argDetails.name) {
                this._args.push(argDetails);
            }
        });
        this._args.forEach((arg, i)=>{
            if (arg.variadic && i < this._args.length - 1) {
                throw new Error(`only the last argument can be variadic '${arg.name}'`);
            }
        });
        return this;
    }
    exitOverride(fn) {
        if (fn) {
            this._exitCallback = fn;
        } else {
            this._exitCallback = (err)=>{
                if (err.code !== 'commander.executeSubCommandAsync') {
                    throw err;
                } else {
                }
            };
        }
        return this;
    }
    _exit(exitCode, code, message) {
        if (this._exitCallback) {
            this._exitCallback(new CommanderError(exitCode, code, message));
        }
        process1.exit(exitCode);
    }
    action(fn) {
        const listener = (args)=>{
            const expectedArgsCount = this._args.length;
            const actionArgs = args.slice(0, expectedArgsCount);
            if (this._passCommandToAction) {
                actionArgs[expectedArgsCount] = this;
            } else {
                actionArgs[expectedArgsCount] = this.opts();
            }
            if (args.length > expectedArgsCount) {
                actionArgs.push(args.slice(expectedArgsCount));
            }
            const actionResult = fn.apply(this, actionArgs);
            let rootCommand = this;
            while(rootCommand.parent){
                rootCommand = rootCommand.parent;
            }
            rootCommand._actionResults.push(actionResult);
        };
        this._actionHandler = listener;
        return this;
    }
    _optionEx(config1, flags, description, fn, defaultValue) {
        const option = new Option(flags, description);
        const oname = option.name();
        const name = option.attributeName();
        option.mandatory = !!config1.mandatory;
        if (typeof fn !== 'function') {
            if (fn instanceof RegExp) {
                const regex = fn;
                fn = (val, def)=>{
                    const m = regex.exec(val);
                    return m ? m[0] : def;
                };
            } else {
                defaultValue = fn;
                fn = null;
            }
        }
        if (option.negate || option.optional || option.required || typeof defaultValue === 'boolean') {
            if (option.negate) {
                const positiveLongFlag = option.long.replace(/^--no-/, '--');
                defaultValue = this._findOption(positiveLongFlag) ? this._getOptionValue(name) : true;
            }
            if (defaultValue !== undefined) {
                this._setOptionValue(name, defaultValue);
                option.defaultValue = defaultValue;
            }
        }
        this.options.push(option);
        this.on('option:' + oname, (val)=>{
            if (val !== null && fn) {
                val = fn(val, this._getOptionValue(name) === undefined ? defaultValue : this._getOptionValue(name));
            }
            if (typeof this._getOptionValue(name) === 'boolean' || typeof this._getOptionValue(name) === 'undefined') {
                if (val == null) {
                    this._setOptionValue(name, option.negate ? false : defaultValue || true);
                } else {
                    this._setOptionValue(name, val);
                }
            } else if (val !== null) {
                this._setOptionValue(name, option.negate ? false : val);
            }
        });
        return this;
    }
    option(flags, description, fn, defaultValue) {
        return this._optionEx({
        }, flags, description, fn, defaultValue);
    }
    requiredOption(flags, description, fn, defaultValue) {
        return this._optionEx({
            mandatory: true
        }, flags, description, fn, defaultValue);
    }
    allowUnknownOption(arg) {
        this._allowUnknownOption = arg === undefined || arg;
        return this;
    }
    storeOptionsAsProperties(value) {
        this._storeOptionsAsProperties = value === undefined || value;
        if (this.options.length) {
            throw new Error('call .storeOptionsAsProperties() before adding options');
        }
        return this;
    }
    passCommandToAction(value) {
        this._passCommandToAction = value === undefined || value;
        return this;
    }
    _setOptionValue(key, value) {
        if (this._storeOptionsAsProperties) {
            this[key] = value;
        } else {
            this._optionValues[key] = value;
        }
    }
    _getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
            return this[key];
        }
        return this._optionValues[key];
    }
    parse(argv1, parseOptions) {
        if (argv1 !== undefined && !Array.isArray(argv1)) {
            throw new Error('first parameter to parse must be array or undefined');
        }
        parseOptions = parseOptions || {
        };
        parseOptions.from = parseOptions.from || 'deno';
        if (argv1 === undefined) {
            argv1 = process1.argv;
            if (process1.versions && process1.versions.electron) {
                parseOptions.from = 'electron';
            }
        }
        this.rawArgs = argv1.slice();
        let userArgs;
        switch(parseOptions.from){
            case undefined:
            case 'node':
                this._scriptPath = argv1[1];
                userArgs = argv1.slice(2);
                break;
            case 'electron':
                if (process1.defaultApp) {
                    this._scriptPath = argv1[1];
                    userArgs = argv1.slice(2);
                } else {
                    userArgs = argv1.slice(1);
                }
                break;
            case 'user':
            case 'deno':
                userArgs = argv1.slice(0);
                break;
            default:
                throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
        }
        if (!this._scriptPath && process1.mainModule) {
            this._scriptPath = process1.mainModule.filename;
        }
        this._name = this._name || this._scriptPath && mod3.basename(this._scriptPath, mod3.extname(this._scriptPath));
        this._parseCommand([], userArgs);
        return this;
    }
    parseAsync(argv2, parseOptions) {
        this.parse(argv2, parseOptions);
        return Promise.all(this._actionResults).then(()=>this
        );
    }
    _executeSubCommand(subcommand, ...args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [
            '.js',
            '.ts',
            '.mjs'
        ];
        this._checkForMissingMandatoryOptions();
        const scriptPath = this._scriptPath;
        let baseDir;
        try {
            const resolvedLink = fs.realpathSync(scriptPath);
            baseDir = mod3.dirname(resolvedLink);
        } catch (e) {
            baseDir = '.';
        }
        let bin = mod3.basename(scriptPath, mod3.extname(scriptPath)) + '-' + subcommand._name;
        if (subcommand._executableFile) {
            bin = subcommand._executableFile;
        }
        const localBin = mod3.join(baseDir, bin);
        if (fs.existsSync(localBin)) {
            bin = localBin;
        } else {
            sourceExt.forEach((ext)=>{
                if (fs.existsSync(`${localBin}${ext}`)) {
                    bin = `${localBin}${ext}`;
                }
            });
        }
        launchWithNode = sourceExt.includes(mod3.extname(bin));
        let proc;
        if (process1.platform !== 'win32') {
            if (launchWithNode) {
                args.unshift(bin);
                args = incrementNodeInspectorPort(process1.execArgv).concat(args);
                proc = spawn(process1.argv[0], args, {
                    stdio: 'inherit'
                });
            } else {
                proc = spawn(bin, args, {
                    stdio: 'inherit'
                });
            }
        } else {
            args.unshift(bin);
            args = incrementNodeInspectorPort(process1.execArgv).concat(args);
            proc = spawn(process1.execPath, args, {
                stdio: 'inherit'
            });
        }
        const signals = [
            'SIGUSR1',
            'SIGUSR2',
            'SIGTERM',
            'SIGINT',
            'SIGHUP'
        ];
        signals.forEach((signal)=>{
            process1.on(signal, ()=>{
                if (proc.killed === false && proc.exitCode === null) {
                    proc.kill(signal);
                }
            });
        });
        const exitCallback = this._exitCallback;
        if (!exitCallback) {
            proc.on('close', process1.exit.bind(process1));
        } else {
            proc.on('close', ()=>{
                exitCallback(new CommanderError(process1.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
            });
        }
        proc.on('error', (err)=>{
            if (err.code === 'ENOENT') {
                const executableMissing = `'${bin}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name`;
                throw new Error(executableMissing);
            } else if (err.code === 'EACCES') {
                throw new Error(`'${bin}' not executable`);
            }
            if (!exitCallback) {
                process1.exit(1);
            } else {
                const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
                wrappedError.nestedError = err;
                exitCallback(wrappedError);
            }
        });
        this.runningCommand = proc;
    }
    _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand) {
            this._helpAndError();
            return;
        }
        if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
        } else {
            subCommand._parseCommand(operands, unknown);
        }
    }
    _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
            this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        } else if (this._lazyHasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
            if (operands.length === 1) {
                this.help();
            } else {
                this._dispatchSubcommand(operands[1], [], [
                    this._helpLongFlag
                ]);
            }
        } else if (this._defaultCommandName) {
            outputHelpIfRequested(this, unknown);
            this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
        } else {
            if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
                this._helpAndError();
            }
            outputHelpIfRequested(this, parsed.unknown);
            this._checkForMissingMandatoryOptions();
            if (parsed.unknown.length > 0) {
                this.unknownOption(parsed.unknown[0]);
            }
            if (this._actionHandler) {
                const args = this.args.slice();
                this._args.forEach((arg, i)=>{
                    if (arg.required && args[i] == null) {
                        this.missingArgument(arg.name);
                    } else if (arg.variadic) {
                        args[i] = args.splice(i);
                    }
                });
                this._actionHandler(args);
                this.emit('command:' + this.name(), operands, unknown);
            } else if (operands.length) {
                if (this._findCommand('*')) {
                    this._dispatchSubcommand('*', operands, unknown);
                } else if (this.listenerCount('command:*')) {
                    this.emit('command:*', operands, unknown);
                } else if (this.commands.length) {
                    this.unknownCommand();
                }
            } else if (this.commands.length) {
                this._helpAndError();
            } else {
            }
        }
    }
    _findCommand(name) {
        if (!name) return undefined;
        return this.commands.find((cmd)=>cmd._name === name || cmd._aliases.includes(name)
        );
    }
    _findOption(arg) {
        return this.options.find((option)=>option.is(arg)
        );
    }
    _checkForMissingMandatoryOptions() {
        for(let cmd = this; cmd; cmd = cmd.parent){
            cmd.options.forEach((anOption)=>{
                if (anOption.mandatory && cmd._getOptionValue(anOption.attributeName()) === undefined) {
                    cmd.missingMandatoryOptionValue(anOption);
                }
            });
        }
    }
    parseOptions(argv3) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv3.slice();
        function maybeOption(arg) {
            return arg.length > 1 && arg[0] === '-';
        }
        while(args.length){
            const arg = args.shift();
            if (arg === '--') {
                if (dest === unknown) dest.push(arg);
                dest.push(...args);
                break;
            }
            if (maybeOption(arg)) {
                const option = this._findOption(arg);
                if (option) {
                    if (option.required) {
                        const value = args.shift();
                        if (value === undefined) this.optionMissingArgument(option);
                        this.emit(`option:${option.name()}`, value);
                    } else if (option.optional) {
                        let value = null;
                        if (args.length > 0 && !maybeOption(args[0])) {
                            value = args.shift();
                        }
                        this.emit(`option:${option.name()}`, value);
                    } else {
                        this.emit(`option:${option.name()}`);
                    }
                    continue;
                }
            }
            if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
                const option = this._findOption(`-${arg[1]}`);
                if (option) {
                    if (option.required || option.optional) {
                        this.emit(`option:${option.name()}`, arg.slice(2));
                    } else {
                        this.emit(`option:${option.name()}`);
                        args.unshift(`-${arg.slice(2)}`);
                    }
                    continue;
                }
            }
            if (/^--[^=]+=/.test(arg)) {
                const index = arg.indexOf('=');
                const option = this._findOption(arg.slice(0, index));
                if (option && (option.required || option.optional)) {
                    this.emit(`option:${option.name()}`, arg.slice(index + 1));
                    continue;
                }
            }
            if (arg.length > 1 && arg[0] === '-') {
                dest = unknown;
            }
            dest.push(arg);
        }
        return {
            operands,
            unknown
        };
    }
    opts() {
        if (this._storeOptionsAsProperties) {
            const result = {
            };
            const len = this.options.length;
            for(let i = 0; i < len; i++){
                const key = this.options[i].attributeName();
                result[key] = key === this._versionOptionName ? this._version : this[key];
            }
            return result;
        }
        return this._optionValues;
    }
    missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        console.error(message);
        this._exit(1, 'commander.missingArgument', message);
    }
    optionMissingArgument(option, flag) {
        let message;
        if (flag) {
            message = `error: option '${option.flags}' argument missing, got '${flag}'`;
        } else {
            message = `error: option '${option.flags}' argument missing`;
        }
        console.error(message);
        this._exit(1, 'commander.optionMissingArgument', message);
    }
    missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        console.error(message);
        this._exit(1, 'commander.missingMandatoryOptionValue', message);
    }
    unknownOption(flag) {
        if (this._allowUnknownOption) return;
        const message = `error: unknown option '${flag}'`;
        console.error(message);
        this._exit(1, 'commander.unknownOption', message);
    }
    unknownCommand() {
        const partCommands = [
            this.name()
        ];
        for(let parentCmd = this.parent; parentCmd; parentCmd = parentCmd.parent){
            partCommands.unshift(parentCmd.name());
        }
        const fullCommand = partCommands.join(' ');
        const message = `error: unknown command '${this.args[0]}'. See '${fullCommand} ${this._helpLongFlag}'.`;
        console.error(message);
        this._exit(1, 'commander.unknownCommand', message);
    }
    version(str, flags, description) {
        if (str === undefined) return this._version;
        this._version = str;
        flags = flags || '-V, --version';
        description = description || 'output the version number';
        const versionOption = new Option(flags, description);
        this._versionOptionName = versionOption.long.substr(2) || 'version';
        this.options.push(versionOption);
        this.on('option:' + this._versionOptionName, ()=>{
            process1.stdout.write(str + '\n');
            this._exit(0, 'commander.version', str);
        });
        return this;
    }
    description(str, argsDescription) {
        if (str === undefined && argsDescription === undefined) return this._description;
        this._description = str;
        this._argsDescription = argsDescription;
        return this;
    }
    alias(alias) {
        if (alias === undefined) return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
            command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');
        command._aliases.push(alias);
        return this;
    }
    aliases(aliases) {
        if (aliases === undefined) return this._aliases;
        aliases.forEach((alias)=>this.alias(alias)
        );
        return this;
    }
    usage(str) {
        if (str === undefined) {
            if (this._usage) return this._usage;
            const args = this._args.map((arg)=>{
                return humanReadableArgName(arg);
            });
            return '[options]' + (this.commands.length ? ' [command]' : '') + (this._args.length ? ' ' + args.join(' ') : '');
        }
        this._usage = str;
        return this;
    }
    name(str) {
        if (str === undefined) return this._name;
        this._name = str;
        return this;
    }
    prepareCommands() {
        const commandDetails = this.commands.filter((cmd)=>{
            return !cmd._hidden;
        }).map((cmd)=>{
            const args = cmd._args.map((arg)=>{
                return humanReadableArgName(arg);
            }).join(' ');
            return [
                cmd._name + (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') + (cmd.options.length ? ' [options]' : '') + (args ? ' ' + args : ''),
                cmd._description
            ];
        });
        if (this._lazyHasImplicitHelpCommand()) {
            commandDetails.push([
                this._helpCommandnameAndArgs,
                this._helpCommandDescription
            ]);
        }
        return commandDetails;
    }
    largestCommandLength() {
        const commands = this.prepareCommands();
        return commands.reduce((max, command)=>{
            return Math.max(max, command[0].length);
        }, 0);
    }
    largestOptionLength() {
        const options = [].slice.call(this.options);
        options.push({
            flags: this._helpFlags
        });
        return options.reduce((max, option)=>{
            return Math.max(max, option.flags.length);
        }, 0);
    }
    largestArgLength() {
        return this._args.reduce((max, arg)=>{
            return Math.max(max, arg.name.length);
        }, 0);
    }
    padWidth() {
        let width = this.largestOptionLength();
        if (this._argsDescription && this._args.length) {
            if (this.largestArgLength() > width) {
                width = this.largestArgLength();
            }
        }
        if (this.commands && this.commands.length) {
            if (this.largestCommandLength() > width) {
                width = this.largestCommandLength();
            }
        }
        return width;
    }
    optionHelp() {
        const width = this.padWidth();
        const columns = process1.stdout.columns || 80;
        const descriptionWidth = columns - width - 4;
        function padOptionDetails(flags, description) {
            return pad(flags, width) + '  ' + optionalWrap(description, descriptionWidth, width + 2);
        }
        const help = this.options.map((option)=>{
            const fullDesc = option.description + (!option.negate && option.defaultValue !== undefined ? ' (default: ' + JSON.stringify(option.defaultValue) + ')' : '');
            return padOptionDetails(option.flags, fullDesc);
        });
        const showShortHelpFlag = this._helpShortFlag && !this._findOption(this._helpShortFlag);
        const showLongHelpFlag = !this._findOption(this._helpLongFlag);
        if (showShortHelpFlag || showLongHelpFlag) {
            let helpFlags = this._helpFlags;
            if (!showShortHelpFlag) {
                helpFlags = this._helpLongFlag;
            } else if (!showLongHelpFlag) {
                helpFlags = this._helpShortFlag;
            }
            help.push(padOptionDetails(helpFlags, this._helpDescription));
        }
        return help.join('\n');
    }
    commandHelp() {
        if (!this.commands.length && !this._lazyHasImplicitHelpCommand()) return '';
        const commands = this.prepareCommands();
        const width = this.padWidth();
        const columns = process1.stdout.columns || 80;
        const descriptionWidth = columns - width - 4;
        return [
            'Commands:',
            commands.map((cmd)=>{
                const desc = cmd[1] ? '  ' + cmd[1] : '';
                return (desc ? pad(cmd[0], width) : cmd[0]) + optionalWrap(desc, descriptionWidth, width + 2);
            }).join('\n').replace(/^/gm, '  '),
            ''
        ].join('\n');
    }
    helpInformation() {
        let desc = [];
        if (this._description) {
            desc = [
                this._description,
                ''
            ];
            const argsDescription = this._argsDescription;
            if (argsDescription && this._args.length) {
                const width = this.padWidth();
                const columns = process1.stdout.columns || 80;
                const descriptionWidth = columns - width - 5;
                desc.push('Arguments:');
                desc.push('');
                this._args.forEach((arg)=>{
                    desc.push('  ' + pad(arg.name, width) + '  ' + wrap(argsDescription[arg.name], descriptionWidth, width + 4));
                });
                desc.push('');
            }
        }
        let cmdName = this._name;
        if (this._aliases[0]) {
            cmdName = cmdName + '|' + this._aliases[0];
        }
        let parentCmdNames = '';
        for(let parentCmd = this.parent; parentCmd; parentCmd = parentCmd.parent){
            parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
        }
        const usage = [
            'Usage: ' + parentCmdNames + cmdName + ' ' + this.usage(),
            ''
        ];
        let cmds = [];
        const commandHelp = this.commandHelp();
        if (commandHelp) cmds = [
            commandHelp
        ];
        const options = [
            'Options:',
            '' + this.optionHelp().replace(/^/gm, '  '),
            ''
        ];
        return usage.concat(desc).concat(options).concat(cmds).join('\n');
    }
    outputHelp(cb) {
        if (!cb) {
            cb = (passthru)=>{
                return passthru;
            };
        }
        const cbOutput = cb(this.helpInformation());
        if (typeof cbOutput !== 'string' && !Buffer.isBuffer(cbOutput)) {
            throw new Error('outputHelp callback must return a string or a Buffer');
        }
        process1.stdout.write(cbOutput);
        this.emit(this._helpLongFlag);
    }
    helpOption(flags, description) {
        this._helpFlags = flags || this._helpFlags;
        this._helpDescription = description || this._helpDescription;
        const splitFlags = this._helpFlags.split(/[ ,|]+/);
        this._helpShortFlag = undefined;
        if (splitFlags.length > 1) this._helpShortFlag = splitFlags.shift();
        this._helpLongFlag = splitFlags.shift();
        return this;
    }
    help(cb) {
        this.outputHelp(cb);
        this._exit(process1.exitCode || 0, 'commander.help', '(outputHelp)');
    }
    _helpAndError() {
        this.outputHelp();
        this._exit(1, 'commander.help', '(outputHelp)');
    }
}
function camelcase(flag) {
    return flag.split('-').reduce((str, word)=>{
        return str + word[0].toUpperCase() + word.slice(1);
    });
}
function pad(str, width) {
    const len = Math.max(0, width - str.length);
    return str + Array(len + 1).join(' ');
}
function wrap(str, width, indent) {
    const regex = new RegExp('.{1,' + (width - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = str.match(regex) || [];
    return lines.map((line, i)=>{
        if (line.slice(-1) === '\n') {
            line = line.slice(0, line.length - 1);
        }
        return (i > 0 && indent ? Array(indent + 1).join(' ') : '') + line.trimRight();
    }).join('\n');
}
function optionalWrap(str, width, indent) {
    if (str.match(/[\n]\s+/)) return str;
    if (width < 40) return str;
    return wrap(str, width, indent);
}
function outputHelpIfRequested(cmd, args) {
    const helpOption = args.find((arg)=>arg === cmd._helpLongFlag || arg === cmd._helpShortFlag
    );
    if (helpOption) {
        cmd.outputHelp();
        cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
    }
}
function humanReadableArgName(arg) {
    const nameOutput = arg.name + (arg.variadic === true ? '...' : '');
    return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']';
}
function incrementNodeInspectorPort(args) {
    return args.map((arg)=>{
        let result = arg;
        if (arg.indexOf('--inspect') === 0) {
            let debugOption;
            let debugHost = '127.0.0.1';
            let debugPort = '9229';
            let match;
            if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
                debugOption = match[1];
            } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
                debugOption = match[1];
                if (/^\d+$/.test(match[3])) {
                    debugPort = match[3];
                } else {
                    debugHost = match[3];
                }
            } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
                debugOption = match[1];
                debugHost = match[3];
                debugPort = match[4];
            }
            if (debugOption && debugPort !== '0') {
                result = `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
            }
        }
        return result;
    });
}
const keyToEventKeyMap = [
    [
        'Escape',
        'Esc'
    ],
    [
        ' ',
        'Space'
    ],
    [
        'ArrowLeft',
        'Left'
    ],
    [
        'ArrowRight',
        'Right'
    ],
    [
        'ArrowUp',
        'Up'
    ],
    [
        'ArrowDown',
        'Down'
    ],
    [
        'Enter',
        'Return'
    ],
    [
        'Add',
        'Plus',
        '+'
    ],
    [
        'Subtract',
        'Minus',
        '-'
    ],
    [
        'Multiply',
        'Times',
        '*'
    ],
    [
        'Divide',
        'Div',
        '/'
    ],
    [
        'Decimal',
        '.'
    ],
    [
        'Separator',
        ','
    ], 
].reduce((map, combinations)=>{
    for (const item of combinations){
        (map[item.toLowerCase()] = map[item.toLowerCase()] || []).push(...combinations.map((it)=>it.toLowerCase()
        ));
    }
    return map;
}, {
});
class KeyCombo {
    ctrl;
    shift;
    alt;
    meta;
    key;
    constructor({ ctrl , shift , alt , meta , key  } = {
    }){
        this.ctrl = ctrl ?? false;
        this.shift = shift ?? false;
        this.alt = alt ?? false;
        this.meta = meta ?? false;
        this.key = key ?? '';
    }
    get option() {
        return this.alt;
    }
    get command() {
        return this.meta;
    }
    get win() {
        return this.meta;
    }
    get super() {
        return this.meta;
    }
    static parse(str) {
        let ctrl = false;
        let shift = false;
        let alt = false;
        let meta = false;
        const key = str.replace(/\s*ctrl\s*(?:\+\s*|$)/i, ()=>(ctrl = true, '')
        ).replace(/\s*shift\s*(?:\+\s*|$)/i, ()=>(shift = true, '')
        ).replace(/\s*(?:alt|option)\s*(?:\+\s*|$)/i, ()=>(alt = true, '')
        ).replace(/\s*(?:meta|super|win|command|cmd)\s*(?:\+\s*|$)/i, ()=>(meta = true, '')
        ).trim();
        return new KeyCombo({
            ctrl,
            shift,
            alt,
            meta,
            key
        });
    }
    test(event) {
        return this.ctrl === event.ctrlKey && this.shift === event.shiftKey && this.meta === event.metaKey && (this.key ? this.key === event.key || (keyToEventKeyMap[this.key.toLowerCase()] || []).includes(event.key?.toLowerCase() ?? '') : true);
    }
    getStringPartsWindows() {
        return [
            this.ctrl && 'Ctrl',
            this.meta && 'Win',
            this.shift && 'Shift',
            this.alt && 'Alt',
            this.key
        ].filter(Boolean);
    }
    toStringWindows() {
        return this.getStringPartsWindows().join('+');
    }
    getStringPartsLinux() {
        return [
            this.ctrl && 'Ctrl',
            this.meta && 'Super',
            this.shift && 'Shift',
            this.alt && 'Alt',
            this.key
        ].filter(Boolean);
    }
    toStringLinux() {
        return this.getStringPartsLinux().join('+');
    }
    getStringPartsMac() {
        return [
            this.ctrl && 'Ctrl',
            this.meta && 'Command',
            this.shift && 'Shift',
            this.alt && 'Option',
            this.key
        ].filter(Boolean);
    }
    toStringMac() {
        return this.getStringPartsMac().join('+');
    }
    getStringParts() {
        if (Deno.build.os === 'windows') return this.getStringPartsWindows();
        if (Deno.build.os === 'linux') return this.getStringPartsLinux();
        return this.getStringPartsMac();
    }
    toString() {
        return this.getStringParts().join('+');
    }
    toJSON() {
        return {
            ctrl: this.ctrl,
            shift: this.shift,
            alt: this.alt,
            meta: this.meta,
            key: this.key
        };
    }
    static from(event) {
        return new KeyCombo({
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            meta: event.metaKey,
            key: event.key
        });
    }
}
class KeyCombos {
    combos;
    constructor(combos){
        this.combos = combos;
    }
    test(event) {
        return this.combos.some((combo)=>combo.test(event)
        );
    }
    static parse(str) {
        const combos = str.split('|').map(KeyCombo.parse);
        return new KeyCombos(combos);
    }
}
const encoder = new TextEncoder();
function encode2(input1) {
    return encoder.encode(input1);
}
const decoder = new TextDecoder();
function decode2(input2) {
    return decoder.decode(input2);
}
function toUnicode(str) {
    let result = '';
    for(let i = 0; i < str.length; i++){
        let unicode = str.charCodeAt(i).toString(16).toUpperCase();
        while(unicode.length < 4){
            unicode = '0' + unicode;
        }
        unicode = '\\u' + unicode;
        result += unicode;
    }
    return result;
}
const metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
const functionKeyCodeRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
const charsRe = /^[A-zА-яЁё]$/;
function decodeKeypress(message) {
    let parts;
    let sequence = decode2(message);
    let event = {
        key: undefined,
        code: undefined,
        keyCode: undefined,
        sequence,
        unicode: toUnicode(sequence),
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
    };
    if (sequence.length === 1) {
        event.key = sequence;
        event.keyCode = sequence.charCodeAt(0);
    }
    if (sequence === '\r') {
        event.key = 'return';
    } else if (sequence === '\n') {
        event.key = 'enter';
    } else if (sequence === '\t') {
        event.key = 'tab';
    } else if (sequence === '\b' || sequence === '\x7f' || sequence === '\x1b\x7f' || sequence === '\x1b\b') {
        event.key = 'backspace';
        event.metaKey = sequence.charAt(0) === '\x1b';
    } else if (sequence === '\x1b' || sequence === '\x1b\x1b') {
        event.key = 'escape';
        event.metaKey = sequence.length === 2;
    } else if (sequence === ' ' || sequence === '\x1b ') {
        event.key = 'space';
        event.metaKey = sequence.length === 2;
    } else if (sequence <= '\x1a') {
        event.key = String.fromCharCode(sequence.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
        event.ctrlKey = true;
    } else if (sequence.length === 1 && charsRe.test(sequence)) {
        event.key = sequence;
        event.shiftKey = sequence !== sequence.toLowerCase() && sequence === sequence.toUpperCase();
    } else if (parts = metaKeyCodeRe.exec(sequence)) {
        event.key = parts[1].toLowerCase();
        event.metaKey = true;
        event.shiftKey = /^[A-Z]$/.test(parts[1]);
    } else if (parts = functionKeyCodeRe.exec(sequence)) {
        const code = (parts[1] || '') + (parts[2] || '') + (parts[4] || '') + (parts[6] || '');
        const modifier = (parts[3] || parts[5] || 1) - 1;
        event.ctrlKey = !!(modifier & 4);
        event.metaKey = !!(modifier & 10);
        event.shiftKey = !!(modifier & 1);
        event.code = code;
        switch(code){
            case 'OP':
                event.key = 'f1';
                break;
            case 'OQ':
                event.key = 'f2';
                break;
            case 'OR':
                event.key = 'f3';
                break;
            case 'OS':
                event.key = 'f4';
                break;
            case '[11~':
                event.key = 'f1';
                break;
            case '[12~':
                event.key = 'f2';
                break;
            case '[13~':
                event.key = 'f3';
                break;
            case '[14~':
                event.key = 'f4';
                break;
            case '[[A':
                event.key = 'f1';
                break;
            case '[[B':
                event.key = 'f2';
                break;
            case '[[C':
                event.key = 'f3';
                break;
            case '[[D':
                event.key = 'f4';
                break;
            case '[[E':
                event.key = 'f5';
                break;
            case '[15~':
                event.key = 'f5';
                break;
            case '[17~':
                event.key = 'f6';
                break;
            case '[18~':
                event.key = 'f7';
                break;
            case '[19~':
                event.key = 'f8';
                break;
            case '[20~':
                event.key = 'f9';
                break;
            case '[21~':
                event.key = 'f10';
                break;
            case '[23~':
                event.key = 'f11';
                break;
            case '[24~':
                event.key = 'f12';
                break;
            case '[A':
                event.key = 'up';
                break;
            case '[B':
                event.key = 'down';
                break;
            case '[C':
                event.key = 'right';
                break;
            case '[D':
                event.key = 'left';
                break;
            case '[E':
                event.key = 'clear';
                break;
            case '[F':
                event.key = 'end';
                break;
            case '[H':
                event.key = 'home';
                break;
            case 'OA':
                event.key = 'up';
                break;
            case 'OB':
                event.key = 'down';
                break;
            case 'OC':
                event.key = 'right';
                break;
            case 'OD':
                event.key = 'left';
                break;
            case 'OE':
                event.key = 'clear';
                break;
            case 'OF':
                event.key = 'end';
                break;
            case 'OH':
                event.key = 'home';
                break;
            case '[1~':
                event.key = 'home';
                break;
            case '[2~':
                event.key = 'insert';
                break;
            case '[3~':
                event.key = 'delete';
                break;
            case '[4~':
                event.key = 'end';
                break;
            case '[5~':
                event.key = 'pageup';
                break;
            case '[6~':
                event.key = 'pagedown';
                break;
            case '[[5~':
                event.key = 'pageup';
                break;
            case '[[6~':
                event.key = 'pagedown';
                break;
            case '[7~':
                event.key = 'home';
                break;
            case '[8~':
                event.key = 'end';
                break;
            case '[a':
                event.key = 'up';
                event.shiftKey = true;
                break;
            case '[b':
                event.key = 'down';
                event.shiftKey = true;
                break;
            case '[c':
                event.key = 'right';
                event.shiftKey = true;
                break;
            case '[d':
                event.key = 'left';
                event.shiftKey = true;
                break;
            case '[e':
                event.key = 'clear';
                event.shiftKey = true;
                break;
            case '[2$':
                event.key = 'insert';
                event.shiftKey = true;
                break;
            case '[3$':
                event.key = 'delete';
                event.shiftKey = true;
                break;
            case '[5$':
                event.key = 'pageup';
                event.shiftKey = true;
                break;
            case '[6$':
                event.key = 'pagedown';
                event.shiftKey = true;
                break;
            case '[7$':
                event.key = 'home';
                event.shiftKey = true;
                break;
            case '[8$':
                event.key = 'end';
                event.shiftKey = true;
                break;
            case 'Oa':
                event.key = 'up';
                event.ctrlKey = true;
                break;
            case 'Ob':
                event.key = 'down';
                event.ctrlKey = true;
                break;
            case 'Oc':
                event.key = 'right';
                event.ctrlKey = true;
                break;
            case 'Od':
                event.key = 'left';
                event.ctrlKey = true;
                break;
            case 'Oe':
                event.key = 'clear';
                event.ctrlKey = true;
                break;
            case '[2^':
                event.key = 'insert';
                event.ctrlKey = true;
                break;
            case '[3^':
                event.key = 'delete';
                event.ctrlKey = true;
                break;
            case '[5^':
                event.key = 'pageup';
                event.ctrlKey = true;
                break;
            case '[6^':
                event.key = 'pagedown';
                event.ctrlKey = true;
                break;
            case '[7^':
                event.key = 'home';
                event.ctrlKey = true;
                break;
            case '[8^':
                event.key = 'end';
                event.ctrlKey = true;
                break;
            case '[Z':
                event.key = 'tab';
                event.shiftKey = true;
                break;
            default:
                event.key = 'undefined';
                break;
        }
    } else if (sequence.length > 1 && sequence[0] !== '\x1b') {
        const results = sequence.split('').map((character)=>decodeKeypress(encode2(character))
        );
        return results.flat();
    }
    return [
        event
    ];
}
async function* readKeypress(reader = Deno.stdin, bufferLength = 1024) {
    if (!Deno.isatty(reader.rid)) {
        throw new Error('Keypress can be read only under TTY.');
    }
    while(true){
        const buffer = new Uint8Array(bufferLength);
        Deno.setRaw(reader.rid, true);
        const length = await reader.read(buffer);
        Deno.setRaw(reader.rid, false);
        const events = decodeKeypress(buffer.subarray(0, length));
        for (const event of events){
            yield event;
        }
    }
}
const PRIMARY_COLOR = '\x1b[94m';
const RESET_COLOR = '\x1b[0m';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const CLEAR_LINE = '\x1b[500D\x1b[K';
const PREFIX = '\x1b[32m?\x1b[0m ';
function asPromptText(text, reset = true) {
    if (reset) return `\x1b[0;1m${text}\x1b[0m `;
    return `\x1b[0;1m${text} `;
}
const COLORS = {
    darkGrey: 30,
    darkRed: 31,
    darkYellow: 32,
    darkGreen: 33,
    darkBlue: 34,
    darkPurple: 35,
    darkCyan: 36,
    lightGrey: 90,
    lightRed: 91,
    lightYellow: 92,
    lightGreen: 93,
    lightBlue: 94,
    lightPurple: 95,
    lightCyan: 96
};
const PRIMARY_COLOR_NAME = 'lightBlue';
function highlightText(text, { shouldHighlight =true , reset =true , color =PRIMARY_COLOR_NAME  } = {
}) {
    if (shouldHighlight) {
        if (reset) return '\x1b[' + COLORS[color] + 'm' + text + RESET_COLOR;
        return '\x1b[' + COLORS[color] + 'm' + text;
    } else {
        if (reset) return text + RESET_COLOR;
        return text;
    }
}
const directionToSpecifier = {
    'up': 'A',
    'down': 'B',
    'left': 'D',
    'right': 'C'
};
function moveCursor(amount, direction) {
    return amount === 0 ? '' : `\x1b[${amount}${directionToSpecifier[direction]}`;
}
const encoder1 = new TextEncoder();
function print(text, writer = Deno.stdout) {
    return writer.write(encoder1.encode(text));
}
function println(text, writer = Deno.stdout) {
    return writer.write(encoder1.encode(text + '\n'));
}
async function createRenderer(options) {
    const cancelKeyCombo = KeyCombo.parse('Ctrl+c');
    const exitKeyCombo = KeyCombo.parse('Ctrl+d');
    options.prompt();
    keys: for await (const keypress of readKeypress()){
        if (cancelKeyCombo.test(keypress)) {
            await options.clear();
            await println(SHOW_CURSOR + PREFIX + asPromptText(options.label) + highlightText(`<cancel>`));
            return undefined;
        } else if (exitKeyCombo.test(keypress)) {
            await println(SHOW_CURSOR);
            Deno.exit(0);
        }
        for (const [keyCombos, handler] of options.actions){
            if (keyCombos.test(keypress)) {
                const result = await handler(options);
                if (result === undefined) {
                    continue keys;
                } else {
                    return result.result;
                }
            }
        }
        if (options.defaultAction !== undefined) {
            const result = await options.defaultAction(keypress, options);
            if (result === undefined) {
                continue keys;
            } else {
                return result.result;
            }
        }
    }
}
async function confirm(label, defaultValue) {
    let cursorIndex = 0;
    const _positiveText = typeof defaultValue === 'object' && typeof defaultValue.positiveText !== 'undefined' ? defaultValue.positiveText : 'Yes';
    const _negativeText = typeof defaultValue === 'object' && typeof defaultValue.negativeText !== 'undefined' ? defaultValue.negativeText : 'No';
    const positiveText = _positiveText.substring(0, 1).toUpperCase() + _positiveText.substring(1).toLowerCase();
    const negativeText = _negativeText.substring(0, 1).toUpperCase() + _negativeText.substring(1).toLowerCase();
    const _defaultValue = typeof defaultValue === 'boolean' || typeof defaultValue === 'undefined' ? defaultValue : defaultValue.defaultValue;
    const positiveChar = _defaultValue === true ? positiveText[0] : positiveText[0].toLowerCase();
    const negativeChar = _defaultValue === false ? negativeText[0] : negativeText[0].toLowerCase();
    const prompt1 = label + ` [${positiveChar}/${negativeChar}]`;
    let text = '';
    return createRenderer({
        label,
        clear: ()=>print(CLEAR_LINE)
        ,
        prompt: ()=>print(PREFIX + asPromptText(prompt1) + text + moveCursor(Math.abs(cursorIndex - text.length), 'left'))
        ,
        actions: [
            [
                KeyCombos.parse('left'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex - 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('right'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex + 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('up|home'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    cursorIndex = 0;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('down|end'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    cursorIndex = text.length;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('backspace'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    text = text.slice(0, cursorIndex - 1) + text.slice(cursorIndex);
                    cursorIndex--;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('delete'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    text = text.slice(0, cursorIndex) + text.slice(cursorIndex + 1);
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('enter'),
                async ({ clear  })=>{
                    const trimmed = text.trimLeft();
                    const result = trimmed[0] === undefined ? typeof defaultValue === 'boolean' ? defaultValue : undefined : trimmed[0].toLowerCase() === positiveChar.toLowerCase() ? true : trimmed[0].toLowerCase() === negativeChar.toLowerCase() ? false : undefined;
                    if (result === undefined) return;
                    await clear();
                    await println(PREFIX + asPromptText(label) + highlightText(result ? positiveText : negativeText));
                    return {
                        result
                    };
                }
            ]
        ],
        async defaultAction (keypress, options) {
            if (!keypress.ctrlKey && !keypress.metaKey && keypress.keyCode !== undefined) {
                text = text.slice(0, cursorIndex) + keypress.sequence + text.slice(cursorIndex);
                cursorIndex++;
                await options.clear();
                await options.prompt();
            }
        }
    });
}
async function checkbox(label, options, checkboxOptions) {
    const selectedIndices = [];
    const defaultSelected = [];
    const possibleOptions = Array.isArray(options) ? getOptionsFromArray(options, defaultSelected) : getOptionsFromObject(options, defaultSelected);
    defaultSelected.forEach(select);
    if (possibleOptions.length == 0) return [];
    let cursorIndex = 0;
    let indexOffset = 0;
    let printedLines = 1;
    const windowSize = Math.min(possibleOptions.length, Math.max(1, checkboxOptions?.windowSize ?? possibleOptions.length));
    const noMoreContentPattern = checkboxOptions?.noMoreContentPattern ?? '=';
    const moreContentPattern = checkboxOptions?.moreContentPattern ?? '-';
    const longestItemLabelLength = Math.max(15, possibleOptions.map((it)=>it.label.length
    ).sort((a, b)=>b - a
    )[0] + 4);
    const showNarrowWindow = windowSize < possibleOptions.length;
    const offsetWindowScroll = checkboxOptions?.offsetWindowScroll ?? true;
    await print(HIDE_CURSOR);
    return createRenderer({
        label,
        clear: ()=>print((CLEAR_LINE + moveCursor(1, 'up')).repeat(printedLines - 1) + CLEAR_LINE)
        ,
        async prompt () {
            let out = PREFIX + asPromptText(label) + '\n';
            if (showNarrowWindow) {
                if (indexOffset !== 0) out += moreContentPattern.repeat(Math.ceil(longestItemLabelLength / moreContentPattern.length)).slice(0, longestItemLabelLength) + '\n';
                else out += noMoreContentPattern.repeat(Math.ceil(longestItemLabelLength / noMoreContentPattern.length)).slice(0, longestItemLabelLength) + '\n';
            }
            for(let index = 0; index < windowSize; index++){
                const option = possibleOptions[indexOffset + index].label;
                const current = cursorIndex === indexOffset + index ? PRIMARY_COLOR + '>' : ' ';
                const selected = selectedIndices.includes(indexOffset + index) ? '☒' : '☐';
                out += `${current} ${selected} ${option}${RESET_COLOR}${index + 1 === windowSize ? '' : '\n'}`;
            }
            if (showNarrowWindow) {
                if (indexOffset + windowSize !== possibleOptions.length) out += '\n' + moreContentPattern.repeat(Math.ceil(longestItemLabelLength / moreContentPattern.length)).slice(0, longestItemLabelLength);
                else out += '\n' + noMoreContentPattern.repeat(Math.ceil(longestItemLabelLength / noMoreContentPattern.length)).slice(0, longestItemLabelLength);
            }
            await print(out);
            printedLines = windowSize + 1 + (showNarrowWindow ? 2 : 0);
        },
        actions: [
            [
                KeyCombos.parse('up'),
                async ({ clear , prompt  })=>{
                    const newIndex = Math.min(Math.max(cursorIndex - 1, 0), possibleOptions.length - 1);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    if (offsetWindowScroll && cursorIndex !== 0) indexOffset = cursorIndex - 1 < indexOffset ? cursorIndex - 1 : indexOffset;
                    else indexOffset = cursorIndex < indexOffset ? cursorIndex : indexOffset;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('down'),
                async ({ clear , prompt  })=>{
                    const newIndex = Math.min(Math.max(cursorIndex + 1, 0), possibleOptions.length - 1);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    if (offsetWindowScroll && cursorIndex !== possibleOptions.length - 1) indexOffset = cursorIndex >= indexOffset + windowSize - 2 ? cursorIndex - windowSize + 2 : indexOffset;
                    else indexOffset = cursorIndex >= indexOffset + windowSize - 1 ? cursorIndex - windowSize + 1 : indexOffset;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('home'),
                async ({ clear , prompt  })=>{
                    const newIndex = 0;
                    if (0 === cursorIndex) return;
                    cursorIndex = newIndex;
                    indexOffset = 0;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('end'),
                async ({ clear , prompt  })=>{
                    const newIndex = possibleOptions.length - 1;
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    indexOffset = Math.max(0, newIndex - windowSize + 1);
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('space'),
                async ({ clear , prompt  })=>{
                    if (selectedIndices.includes(cursorIndex)) deselect(cursorIndex);
                    else select(cursorIndex);
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('enter'),
                async ({ clear  })=>{
                    await clear();
                    const result = selectedIndices.map((index)=>possibleOptions[index]
                    );
                    const text = result.length === 0 ? highlightText('<empty>') : result.map((item)=>highlightText(item.label)
                    ).join(', ');
                    await println(SHOW_CURSOR + PREFIX + asPromptText(label) + text);
                    return {
                        result: result.map((it)=>it.value
                        )
                    };
                }
            ]
        ]
    });
    function select(index1) {
        selectedIndices.push(index1);
        let onSelect;
        if (typeof (onSelect = possibleOptions[index1].onSelect) === 'function') {
            for (const other of onSelect().filter((index)=>!selectedIndices.includes(index)
            )){
                if (selectedIndices.includes(other)) continue;
                select(other);
            }
        }
    }
    function deselect(index) {
        selectedIndices.splice(selectedIndices.indexOf(index), 1);
        for (const selectedIndex of selectedIndices.slice()){
            let onDeselect;
            if (typeof (onDeselect = possibleOptions[selectedIndex].onDeselect) === 'function') {
                if (onDeselect(index)) deselect(selectedIndex);
            }
        }
    }
}
function getOptionsFromArray(options, _defaultSelected) {
    return options.map((value)=>({
            label: value,
            value
        })
    );
}
function getOptionsFromObject(object, defaultSelected) {
    return Object.entries(object).map(([label1, objectOption], index2, allEntries)=>{
        const option = {
            label: label1,
            value: objectOption.value
        };
        if (typeof objectOption.dependencies !== 'undefined') {
            const dependencies = [];
            if (typeof objectOption.dependencies === 'string') dependencies.push(allEntries.findIndex(([label])=>label === objectOption.dependencies
            ));
            else if (typeof objectOption.dependencies === 'number') dependencies.push(objectOption.dependencies);
            else if (Array.isArray(objectOption.dependencies) && objectOption.dependencies.every((dep)=>[
                    'string',
                    'number'
                ].includes(typeof dep)
            )) {
                for (const dep of objectOption.dependencies){
                    if (typeof dep === 'string') dependencies.push(allEntries.findIndex(([label])=>label === objectOption.dependencies
                    ));
                    else dependencies.push(dep);
                }
            }
            const deps = dependencies.filter((it)=>it >= 0 && it < allEntries.length
            );
            option.onSelect = ()=>deps
            ;
            option.onDeselect = (index)=>deps.includes(index)
            ;
        }
        if (objectOption.selected === true) defaultSelected.push(index2);
        return option;
    });
}
async function list(label1, options, listOptions) {
    const possibleOptions = [];
    if (Array.isArray(options)) options.forEach((value)=>possibleOptions.push({
            value: value,
            label: value
        })
    );
    else Object.entries(options).forEach(([label, value])=>possibleOptions.push({
            value,
            label
        })
    );
    if (possibleOptions.length === 0) return undefined;
    let selectedIndex = 0;
    let indexOffset = 0;
    let printedLines = 1;
    const windowSize = Math.min(possibleOptions.length, Math.max(1, listOptions?.windowSize ?? possibleOptions.length));
    const noMoreContentPattern = listOptions?.noMoreContentPattern ?? '=';
    const moreContentPattern = listOptions?.moreContentPattern ?? '-';
    const longestItemLabelLength = Math.max(15, possibleOptions.map((it)=>it.label.length
    ).sort((a, b)=>b - a
    )[0] + 4);
    const showNarrowWindow = windowSize < possibleOptions.length;
    const offsetWindowScroll = listOptions?.offsetWindowScroll ?? true;
    await print(HIDE_CURSOR);
    return createRenderer({
        label: label1,
        clear: ()=>print((CLEAR_LINE + moveCursor(1, 'up')).repeat(printedLines - 1) + CLEAR_LINE)
        ,
        async prompt () {
            let out = PREFIX + asPromptText(label1) + '\n';
            if (showNarrowWindow) {
                if (indexOffset !== 0) out += moreContentPattern.repeat(Math.ceil(longestItemLabelLength / moreContentPattern.length)).slice(0, longestItemLabelLength) + '\n';
                else out += noMoreContentPattern.repeat(Math.ceil(longestItemLabelLength / noMoreContentPattern.length)).slice(0, longestItemLabelLength) + '\n';
            }
            for(let index = 0; index < windowSize; index++){
                const option = possibleOptions[indexOffset + index].label;
                out += highlightText('  ' + option, {
                    shouldHighlight: selectedIndex === indexOffset + index
                }) + (index + 1 === windowSize ? '' : '\n');
            }
            if (showNarrowWindow) {
                if (indexOffset + windowSize !== possibleOptions.length) out += '\n' + moreContentPattern.repeat(Math.ceil(longestItemLabelLength / moreContentPattern.length)).slice(0, longestItemLabelLength);
                else out += '\n' + noMoreContentPattern.repeat(Math.ceil(longestItemLabelLength / noMoreContentPattern.length)).slice(0, longestItemLabelLength);
            }
            await print(out);
            printedLines = windowSize + 1 + (showNarrowWindow ? 2 : 0);
        },
        actions: [
            [
                KeyCombos.parse('up'),
                async ({ clear , prompt  })=>{
                    const newIndex = Math.min(Math.max(selectedIndex - 1, 0), possibleOptions.length - 1);
                    if (newIndex === selectedIndex) return;
                    selectedIndex = newIndex;
                    if (offsetWindowScroll && selectedIndex !== 0) indexOffset = selectedIndex - 1 < indexOffset ? selectedIndex - 1 : indexOffset;
                    else indexOffset = selectedIndex < indexOffset ? selectedIndex : indexOffset;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('down'),
                async ({ clear , prompt  })=>{
                    const newIndex = Math.min(Math.max(selectedIndex + 1, 0), possibleOptions.length - 1);
                    if (newIndex === selectedIndex) return;
                    selectedIndex = newIndex;
                    if (offsetWindowScroll && selectedIndex !== possibleOptions.length - 1) indexOffset = selectedIndex >= indexOffset + windowSize - 2 ? selectedIndex - windowSize + 2 : indexOffset;
                    else indexOffset = selectedIndex >= indexOffset + windowSize - 1 ? selectedIndex - windowSize + 1 : indexOffset;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('enter'),
                async ({ clear  })=>{
                    await clear();
                    await println(SHOW_CURSOR + PREFIX + asPromptText(label1) + highlightText(possibleOptions[selectedIndex].label));
                    return {
                        result: possibleOptions[selectedIndex].value
                    };
                }
            ]
        ]
    });
}
async function input(label, defaultValue) {
    let cursorIndex = 0;
    const prompt1 = asPromptText(label) + (typeof defaultValue === 'string' ? '[' + defaultValue + '] ' : '');
    let text = '';
    return createRenderer({
        label,
        clear: ()=>print(CLEAR_LINE)
        ,
        prompt: ()=>print(PREFIX + prompt1 + text + moveCursor(Math.abs(cursorIndex - text.length), 'left'))
        ,
        actions: [
            [
                KeyCombos.parse('left'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex - 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('right'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex + 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('up|home'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    cursorIndex = 0;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('down|end'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    cursorIndex = text.length;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('backspace'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    text = text.slice(0, cursorIndex - 1) + text.slice(cursorIndex);
                    cursorIndex--;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('delete'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    text = text.slice(0, cursorIndex) + text.slice(cursorIndex + 1);
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('enter'),
                async ({ clear  })=>{
                    const trimmed = text.trim();
                    const result = trimmed.length === 0 ? defaultValue ?? trimmed : trimmed;
                    await clear();
                    await println(PREFIX + asPromptText(label) + highlightText(result.length === 0 ? '<empty>' : result));
                    return {
                        result
                    };
                }
            ]
        ],
        async defaultAction (keypress, options) {
            if (!keypress.ctrlKey && !keypress.metaKey && keypress.keyCode !== undefined) {
                text = text.slice(0, cursorIndex) + keypress.sequence + text.slice(cursorIndex);
                cursorIndex++;
                await options.clear();
                await options.prompt();
            }
        }
    });
}
async function password(label, substitute) {
    let cursorIndex = 0;
    const prompt1 = label;
    const sub = substitute === false ? '' : substitute === true || substitute === undefined ? '*' : substitute;
    let text = '';
    return createRenderer({
        label,
        clear: ()=>print(CLEAR_LINE)
        ,
        prompt: ()=>print(PREFIX + asPromptText(prompt1) + (sub.length === 0 ? '' : sub.repeat(Math.ceil(text.length / sub.length)).slice(0, text.length)) + moveCursor(sub.length === 0 ? 0 : Math.abs(cursorIndex - text.length), 'left'))
        ,
        actions: [
            [
                KeyCombos.parse('left'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex - 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('right'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    const newIndex = Math.min(Math.max(cursorIndex + 1, 0), text.length);
                    if (newIndex === cursorIndex) return;
                    cursorIndex = newIndex;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('up|home'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    cursorIndex = 0;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('down|end'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    cursorIndex = text.length;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('backspace'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === 0) return;
                    text = text.slice(0, cursorIndex - 1) + text.slice(cursorIndex);
                    cursorIndex--;
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('delete'),
                async ({ clear , prompt  })=>{
                    if (text.length === 0) return;
                    if (cursorIndex === text.length) return;
                    text = text.slice(0, cursorIndex) + text.slice(cursorIndex + 1);
                    await clear();
                    await prompt();
                }
            ],
            [
                KeyCombos.parse('enter'),
                async ({ clear  })=>{
                    await clear();
                    await println(PREFIX + asPromptText(label) + highlightText('<hidden>'));
                    return {
                        result: text
                    };
                }
            ]
        ],
        async defaultAction (keypress, options) {
            if (!keypress.ctrlKey && !keypress.metaKey && keypress.keyCode !== undefined) {
                text = text.slice(0, cursorIndex) + keypress.sequence + text.slice(cursorIndex);
                cursorIndex++;
                await options.clear();
                await options.prompt();
            }
        }
    });
}
function question(type, ...opts) {
    switch(type){
        case 'list':
            return list(...opts);
        case 'confirm':
            return confirm(...opts);
        case 'checkbox':
            return checkbox(...opts);
        case 'input':
            return input(...opts);
        case 'password':
            return password(...opts);
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}
const scripts = [
    'javascript',
    'typescript'
];
const styles = [
    'scss',
    'sass',
    'css'
];
async function ask(questions) {
    let answer = '';
    let script = '';
    let style1 = '';
    for (const q of questions){
        answer = await question('list', q.message, q.choices);
        for(let i = 0; i < 10; i++){
            if (answer?.toLowerCase() === scripts[i]?.toLowerCase()) script = answer.slice().toLowerCase();
            if (answer?.toLowerCase() === styles[i]?.toLowerCase()) style1 = answer.slice().toLowerCase();
        }
    }
    return {
        script,
        style: style1
    };
}
const osType = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator: navigator1  } = globalThis;
    if (navigator1?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows1 = osType === "windows";
const CHAR_FORWARD_SLASH1 = 47;
function assertPath1(path27) {
    if (typeof path27 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path27)}`);
    }
}
function isPosixPathSeparator1(code) {
    return code === 47;
}
function isPathSeparator1(code) {
    return isPosixPathSeparator1(code) || code === 92;
}
function isWindowsDeviceRoot1(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString1(path28, allowAboveRoot, separator, isPathSeparator11) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path28.length; i <= len; ++i){
        if (i < len) code = path28.charCodeAt(i);
        else if (isPathSeparator11(code)) break;
        else code = CHAR_FORWARD_SLASH1;
        if (isPathSeparator11(code)) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path28.slice(lastSlash + 1, i);
                else res = path28.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep11, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep11 + base;
}
const WHITESPACE_ENCODINGS = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace(string) {
    return string.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS[c] ?? c;
    });
}
class DenoStdInternalError1 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError1(msg);
    }
}
const sep3 = "\\";
const delimiter3 = ";";
function resolve3(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path29;
        const { Deno  } = globalThis;
        if (i >= 0) {
            path29 = pathSegments[i];
        } else if (!resolvedDevice) {
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path29 = Deno.cwd();
        } else {
            if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path29 = Deno.cwd();
            if (path29 === undefined || path29.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path29 = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path29);
        const len = path29.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute11 = false;
        const code = path29.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator1(code)) {
                isAbsolute11 = true;
                if (isPathSeparator1(path29.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator1(path29.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path29.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator1(path29.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator1(path29.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path29.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path29.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code)) {
                if (path29.charCodeAt(1) === 58) {
                    device = path29.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator1(path29.charCodeAt(2))) {
                            isAbsolute11 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator1(code)) {
            rootEnd = 1;
            isAbsolute11 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path29.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute11;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize3(path30) {
    assertPath1(path30);
    const len = path30.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute21 = false;
    const code = path30.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            isAbsolute21 = true;
            if (isPathSeparator1(path30.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path30.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path30.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path30.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path30.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path30.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path30.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path30.charCodeAt(1) === 58) {
                device = path30.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path30.charCodeAt(2))) {
                        isAbsolute21 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString1(path30.slice(rootEnd), !isAbsolute21, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute21) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path30.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute21) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute21) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute3(path31) {
    assertPath1(path31);
    const len = path31.length;
    if (len === 0) return false;
    const code = path31.charCodeAt(0);
    if (isPathSeparator1(code)) {
        return true;
    } else if (isWindowsDeviceRoot1(code)) {
        if (len > 2 && path31.charCodeAt(1) === 58) {
            if (isPathSeparator1(path31.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join3(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path32 = paths[i];
        assertPath1(path32);
        if (path32.length > 0) {
            if (joined === undefined) joined = firstPart = path32;
            else joined += `\\${path32}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert1(firstPart != null);
    if (isPathSeparator1(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator1(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator1(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator1(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize3(joined);
}
function relative3(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    const fromOrig = resolve3(from);
    const toOrig = resolve3(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath3(path33) {
    if (typeof path33 !== "string") return path33;
    if (path33.length === 0) return "";
    const resolvedPath = resolve3(path33);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot1(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path33;
}
function dirname3(path34) {
    assertPath1(path34);
    const len = path34.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path34.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path34.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path34.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path34.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path34.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path34;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path34.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator1(path34.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return path34;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator1(path34.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path34.slice(0, end);
}
function basename3(path35, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path35);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path35.length >= 2) {
        const drive = path35.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path35.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path35.length) {
        if (ext.length === path35.length && ext === path35) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path35.length - 1; i >= start; --i){
            const code = path35.charCodeAt(i);
            if (isPathSeparator1(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path35.length;
        return path35.slice(start, end);
    } else {
        for(i = path35.length - 1; i >= start; --i){
            if (isPathSeparator1(path35.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path35.slice(start, end);
    }
}
function extname3(path36) {
    assertPath1(path36);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path36.length >= 2 && path36.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path36.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path36.length - 1; i >= start; --i){
        const code = path36.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path36.slice(startDot, end);
}
function format3(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("\\", pathObject);
}
function parse3(path37) {
    assertPath1(path37);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path37.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path37.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = 1;
            if (isPathSeparator1(path37.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path37.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path37.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path37.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path37.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path37.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path37;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path37;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        ret.root = ret.dir = path37;
        return ret;
    }
    if (rootEnd > 0) ret.root = path37.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path37.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path37.charCodeAt(i);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path37.slice(startPart, end);
        }
    } else {
        ret.name = path37.slice(startPart, startDot);
        ret.base = path37.slice(startPart, end);
        ret.ext = path37.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path37.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl3(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path38 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path38 = `\\\\${url.hostname}${path38}`;
    }
    return path38;
}
function toFileUrl(path39) {
    if (!isAbsolute3(path39)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path39.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
    if (hostname != null && hostname != "localhost") {
        url.hostname = hostname;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod4 = {
    sep: sep3,
    delimiter: delimiter3,
    resolve: resolve3,
    normalize: normalize3,
    isAbsolute: isAbsolute3,
    join: join3,
    relative: relative3,
    toNamespacedPath: toNamespacedPath3,
    dirname: dirname3,
    basename: basename3,
    extname: extname3,
    format: format3,
    parse: parse3,
    fromFileUrl: fromFileUrl3,
    toFileUrl: toFileUrl
};
const sep4 = "/";
const delimiter4 = ":";
function resolve4(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path40;
        if (i >= 0) path40 = pathSegments[i];
        else {
            const { Deno  } = globalThis;
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path40 = Deno.cwd();
        }
        assertPath1(path40);
        if (path40.length === 0) {
            continue;
        }
        resolvedPath = `${path40}/${resolvedPath}`;
        resolvedAbsolute = path40.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize4(path41) {
    assertPath1(path41);
    if (path41.length === 0) return ".";
    const isAbsolute12 = path41.charCodeAt(0) === 47;
    const trailingSeparator = path41.charCodeAt(path41.length - 1) === 47;
    path41 = normalizeString1(path41, !isAbsolute12, "/", isPosixPathSeparator1);
    if (path41.length === 0 && !isAbsolute12) path41 = ".";
    if (path41.length > 0 && trailingSeparator) path41 += "/";
    if (isAbsolute12) return `/${path41}`;
    return path41;
}
function isAbsolute4(path42) {
    assertPath1(path42);
    return path42.length > 0 && path42.charCodeAt(0) === 47;
}
function join4(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path43 = paths[i];
        assertPath1(path43);
        if (path43.length > 0) {
            if (!joined) joined = path43;
            else joined += `/${path43}`;
        }
    }
    if (!joined) return ".";
    return normalize4(joined);
}
function relative4(from, to) {
    assertPath1(from);
    assertPath1(to);
    if (from === to) return "";
    from = resolve4(from);
    to = resolve4(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath4(path44) {
    return path44;
}
function dirname4(path45) {
    assertPath1(path45);
    if (path45.length === 0) return ".";
    const hasRoot = path45.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path45.length - 1; i >= 1; --i){
        if (path45.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path45.slice(0, end);
}
function basename4(path46, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path46);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path46.length) {
        if (ext.length === path46.length && ext === path46) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path46.length - 1; i >= 0; --i){
            const code = path46.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path46.length;
        return path46.slice(start, end);
    } else {
        for(i = path46.length - 1; i >= 0; --i){
            if (path46.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path46.slice(start, end);
    }
}
function extname4(path47) {
    assertPath1(path47);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path47.length - 1; i >= 0; --i){
        const code = path47.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path47.slice(startDot, end);
}
function format4(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("/", pathObject);
}
function parse4(path48) {
    assertPath1(path48);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path48.length === 0) return ret;
    const isAbsolute22 = path48.charCodeAt(0) === 47;
    let start;
    if (isAbsolute22) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path48.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path48.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute22) {
                ret.base = ret.name = path48.slice(1, end);
            } else {
                ret.base = ret.name = path48.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute22) {
            ret.name = path48.slice(1, startDot);
            ret.base = path48.slice(1, end);
        } else {
            ret.name = path48.slice(startPart, startDot);
            ret.base = path48.slice(startPart, end);
        }
        ret.ext = path48.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path48.slice(0, startPart - 1);
    else if (isAbsolute22) ret.dir = "/";
    return ret;
}
function fromFileUrl4(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl1(path49) {
    if (!isAbsolute4(path49)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(path49.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod5 = {
    sep: sep4,
    delimiter: delimiter4,
    resolve: resolve4,
    normalize: normalize4,
    isAbsolute: isAbsolute4,
    join: join4,
    relative: relative4,
    toNamespacedPath: toNamespacedPath4,
    dirname: dirname4,
    basename: basename4,
    extname: extname4,
    format: format4,
    parse: parse4,
    fromFileUrl: fromFileUrl4,
    toFileUrl: toFileUrl1
};
const path1 = isWindows1 ? mod4 : mod5;
const { join: join5 , normalize: normalize5  } = path1;
const path2 = isWindows1 ? mod4 : mod5;
const { basename: basename5 , delimiter: delimiter5 , dirname: dirname5 , extname: extname5 , format: format5 , fromFileUrl: fromFileUrl5 , isAbsolute: isAbsolute5 , join: join6 , normalize: normalize6 , parse: parse5 , relative: relative5 , resolve: resolve5 , sep: sep5 , toFileUrl: toFileUrl2 , toNamespacedPath: toNamespacedPath5 ,  } = path2;
const osType1 = (()=>{
    if (globalThis.Deno != null) {
        return Deno.build.os;
    }
    const navigator2 = globalThis.navigator;
    if (navigator2?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
const isWindows2 = osType1 === "windows";
const CHAR_FORWARD_SLASH2 = 47;
function assertPath2(path50) {
    if (typeof path50 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path50)}`);
    }
}
function isPosixPathSeparator2(code) {
    return code === 47;
}
function isPathSeparator2(code) {
    return isPosixPathSeparator2(code) || code === 92;
}
function isWindowsDeviceRoot2(code) {
    return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
function normalizeString2(path51, allowAboveRoot, separator, isPathSeparator12) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i = 0, len = path51.length; i <= len; ++i){
        if (i < len) code = path51.charCodeAt(i);
        else if (isPathSeparator12(code)) break;
        else code = CHAR_FORWARD_SLASH2;
        if (isPathSeparator12(code)) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path51.slice(lastSlash + 1, i);
                else res = path51.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format2(sep12, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep12 + base;
}
const WHITESPACE_ENCODINGS1 = {
    "\u0009": "%09",
    "\u000A": "%0A",
    "\u000B": "%0B",
    "\u000C": "%0C",
    "\u000D": "%0D",
    "\u0020": "%20"
};
function encodeWhitespace1(string) {
    return string.replaceAll(/[\s]/g, (c)=>{
        return WHITESPACE_ENCODINGS1[c] ?? c;
    });
}
class DenoStdInternalError2 extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert2(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError2(msg);
    }
}
const sep6 = "\\";
const delimiter6 = ";";
function resolve6(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1; i--){
        let path52;
        if (i >= 0) {
            path52 = pathSegments[i];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path52 = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path52 = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path52 === undefined || path52.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path52 = `${resolvedDevice}\\`;
            }
        }
        assertPath2(path52);
        const len = path52.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute13 = false;
        const code = path52.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator2(code)) {
                isAbsolute13 = true;
                if (isPathSeparator2(path52.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator2(path52.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path52.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator2(path52.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator2(path52.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path52.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path52.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot2(code)) {
                if (path52.charCodeAt(1) === 58) {
                    device = path52.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator2(path52.charCodeAt(2))) {
                            isAbsolute13 = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        } else if (isPathSeparator2(code)) {
            rootEnd = 1;
            isAbsolute13 = true;
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path52.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute13;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString2(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator2);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize7(path53) {
    assertPath2(path53);
    const len = path53.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute23 = false;
    const code = path53.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            isAbsolute23 = true;
            if (isPathSeparator2(path53.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path53.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path53.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path53.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path53.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path53.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path53.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot2(code)) {
            if (path53.charCodeAt(1) === 58) {
                device = path53.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator2(path53.charCodeAt(2))) {
                        isAbsolute23 = true;
                        rootEnd = 3;
                    }
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString2(path53.slice(rootEnd), !isAbsolute23, "\\", isPathSeparator2);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute23) tail = ".";
    if (tail.length > 0 && isPathSeparator2(path53.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute23) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute23) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isAbsolute6(path54) {
    assertPath2(path54);
    const len = path54.length;
    if (len === 0) return false;
    const code = path54.charCodeAt(0);
    if (isPathSeparator2(code)) {
        return true;
    } else if (isWindowsDeviceRoot2(code)) {
        if (len > 2 && path54.charCodeAt(1) === 58) {
            if (isPathSeparator2(path54.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join7(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i = 0; i < pathsCount; ++i){
        const path55 = paths[i];
        assertPath2(path55);
        if (path55.length > 0) {
            if (joined === undefined) joined = firstPart = path55;
            else joined += `\\${path55}`;
        }
    }
    if (joined === undefined) return ".";
    let needsReplace = true;
    let slashCount = 0;
    assert2(firstPart != null);
    if (isPathSeparator2(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
            if (isPathSeparator2(firstPart.charCodeAt(1))) {
                ++slashCount;
                if (firstLen > 2) {
                    if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
                    else {
                        needsReplace = false;
                    }
                }
            }
        }
    }
    if (needsReplace) {
        for(; slashCount < joined.length; ++slashCount){
            if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
        }
        if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
    }
    return normalize7(joined);
}
function relative6(from, to) {
    assertPath2(from);
    assertPath2(to);
    if (from === to) return "";
    const fromOrig = resolve6(from);
    const toOrig = resolve6(to);
    if (fromOrig === toOrig) return "";
    from = fromOrig.toLowerCase();
    to = toOrig.toLowerCase();
    if (from === to) return "";
    let fromStart = 0;
    let fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 92) break;
    }
    for(; fromEnd - 1 > fromStart; --fromEnd){
        if (from.charCodeAt(fromEnd - 1) !== 92) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 0;
    let toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 92) break;
    }
    for(; toEnd - 1 > toStart; --toEnd){
        if (to.charCodeAt(toEnd - 1) !== 92) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 92) {
                    return toOrig.slice(toStart + i + 1);
                } else if (i === 2) {
                    return toOrig.slice(toStart + i);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 92) {
                    lastCommonSep = i;
                } else if (i === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i;
    }
    if (i !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 92) {
            if (out.length === 0) out += "..";
            else out += "\\..";
        }
    }
    if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
    } else {
        toStart += lastCommonSep;
        if (toOrig.charCodeAt(toStart) === 92) ++toStart;
        return toOrig.slice(toStart, toEnd);
    }
}
function toNamespacedPath6(path56) {
    if (typeof path56 !== "string") return path56;
    if (path56.length === 0) return "";
    const resolvedPath = resolve6(path56);
    if (resolvedPath.length >= 3) {
        if (resolvedPath.charCodeAt(0) === 92) {
            if (resolvedPath.charCodeAt(1) === 92) {
                const code = resolvedPath.charCodeAt(2);
                if (code !== 63 && code !== 46) {
                    return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                }
            }
        } else if (isWindowsDeviceRoot2(resolvedPath.charCodeAt(0))) {
            if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
                return `\\\\?\\${resolvedPath}`;
            }
        }
    }
    return path56;
}
function dirname6(path57) {
    assertPath2(path57);
    const len = path57.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path57.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator2(path57.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path57.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path57.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path57.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path57;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot2(code)) {
            if (path57.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator2(path57.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        return path57;
    }
    for(let i = len - 1; i >= offset; --i){
        if (isPathSeparator2(path57.charCodeAt(i))) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) {
        if (rootEnd === -1) return ".";
        else end = rootEnd;
    }
    return path57.slice(0, end);
}
function basename6(path58, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath2(path58);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (path58.length >= 2) {
        const drive = path58.charCodeAt(0);
        if (isWindowsDeviceRoot2(drive)) {
            if (path58.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path58.length) {
        if (ext.length === path58.length && ext === path58) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path58.length - 1; i >= start; --i){
            const code = path58.charCodeAt(i);
            if (isPathSeparator2(code)) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path58.length;
        return path58.slice(start, end);
    } else {
        for(i = path58.length - 1; i >= start; --i){
            if (isPathSeparator2(path58.charCodeAt(i))) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path58.slice(start, end);
    }
}
function extname6(path59) {
    assertPath2(path59);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path59.length >= 2 && path59.charCodeAt(1) === 58 && isWindowsDeviceRoot2(path59.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i = path59.length - 1; i >= start; --i){
        const code = path59.charCodeAt(i);
        if (isPathSeparator2(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path59.slice(startDot, end);
}
function format6(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format2("\\", pathObject);
}
function parse6(path60) {
    assertPath2(path60);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path60.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path60.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator2(code)) {
            rootEnd = 1;
            if (isPathSeparator2(path60.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator2(path60.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator2(path60.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator2(path60.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            rootEnd = j;
                        } else if (j !== last) {
                            rootEnd = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot2(code)) {
            if (path60.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator2(path60.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path60;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path60;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator2(code)) {
        ret.root = ret.dir = path60;
        return ret;
    }
    if (rootEnd > 0) ret.root = path60.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i = path60.length - 1;
    let preDotState = 0;
    for(; i >= rootEnd; --i){
        code = path60.charCodeAt(i);
        if (isPathSeparator2(code)) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path60.slice(startPart, end);
        }
    } else {
        ret.name = path60.slice(startPart, startDot);
        ret.base = path60.slice(startPart, end);
        ret.ext = path60.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path60.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl6(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path61 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path61 = `\\\\${url.hostname}${path61}`;
    }
    return path61;
}
function toFileUrl3(path62) {
    if (!isAbsolute6(path62)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path62.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(pathname.replace(/%/g, "%25"));
    if (hostname != null && hostname != "localhost") {
        url.hostname = hostname;
        if (!url.hostname) {
            throw new TypeError("Invalid hostname.");
        }
    }
    return url;
}
const mod6 = {
    sep: sep6,
    delimiter: delimiter6,
    resolve: resolve6,
    normalize: normalize7,
    isAbsolute: isAbsolute6,
    join: join7,
    relative: relative6,
    toNamespacedPath: toNamespacedPath6,
    dirname: dirname6,
    basename: basename6,
    extname: extname6,
    format: format6,
    parse: parse6,
    fromFileUrl: fromFileUrl6,
    toFileUrl: toFileUrl3
};
const sep7 = "/";
const delimiter7 = ":";
function resolve7(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
        let path63;
        if (i >= 0) path63 = pathSegments[i];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path63 = Deno.cwd();
        }
        assertPath2(path63);
        if (path63.length === 0) {
            continue;
        }
        resolvedPath = `${path63}/${resolvedPath}`;
        resolvedAbsolute = path63.charCodeAt(0) === CHAR_FORWARD_SLASH2;
    }
    resolvedPath = normalizeString2(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator2);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize8(path64) {
    assertPath2(path64);
    if (path64.length === 0) return ".";
    const isAbsolute14 = path64.charCodeAt(0) === 47;
    const trailingSeparator = path64.charCodeAt(path64.length - 1) === 47;
    path64 = normalizeString2(path64, !isAbsolute14, "/", isPosixPathSeparator2);
    if (path64.length === 0 && !isAbsolute14) path64 = ".";
    if (path64.length > 0 && trailingSeparator) path64 += "/";
    if (isAbsolute14) return `/${path64}`;
    return path64;
}
function isAbsolute7(path65) {
    assertPath2(path65);
    return path65.length > 0 && path65.charCodeAt(0) === 47;
}
function join8(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i = 0, len = paths.length; i < len; ++i){
        const path66 = paths[i];
        assertPath2(path66);
        if (path66.length > 0) {
            if (!joined) joined = path66;
            else joined += `/${path66}`;
        }
    }
    if (!joined) return ".";
    return normalize8(joined);
}
function relative7(from, to) {
    assertPath2(from);
    assertPath2(to);
    if (from === to) return "";
    from = resolve7(from);
    to = resolve7(to);
    if (from === to) return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for(; fromStart < fromEnd; ++fromStart){
        if (from.charCodeAt(fromStart) !== 47) break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for(; toStart < toEnd; ++toStart){
        if (to.charCodeAt(toStart) !== 47) break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for(; i <= length; ++i){
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                    return to.slice(toStart + i + 1);
                } else if (i === 0) {
                    return to.slice(toStart + i);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                    lastCommonSep = i;
                } else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i;
    }
    let out = "";
    for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        if (i === fromEnd || from.charCodeAt(i) === 47) {
            if (out.length === 0) out += "..";
            else out += "/..";
        }
    }
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47) ++toStart;
        return to.slice(toStart);
    }
}
function toNamespacedPath7(path67) {
    return path67;
}
function dirname7(path68) {
    assertPath2(path68);
    if (path68.length === 0) return ".";
    const hasRoot = path68.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i = path68.length - 1; i >= 1; --i){
        if (path68.charCodeAt(i) === 47) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path68.slice(0, end);
}
function basename7(path69, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath2(path69);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path69.length) {
        if (ext.length === path69.length && ext === path69) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i = path69.length - 1; i >= 0; --i){
            const code = path69.charCodeAt(i);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path69.length;
        return path69.slice(start, end);
    } else {
        for(i = path69.length - 1; i >= 0; --i){
            if (path69.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1) return "";
        return path69.slice(start, end);
    }
}
function extname7(path70) {
    assertPath2(path70);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i = path70.length - 1; i >= 0; --i){
        const code = path70.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path70.slice(startDot, end);
}
function format7(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format2("/", pathObject);
}
function parse7(path71) {
    assertPath2(path71);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path71.length === 0) return ret;
    const isAbsolute24 = path71.charCodeAt(0) === 47;
    let start;
    if (isAbsolute24) {
        ret.root = "/";
        start = 1;
    } else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path71.length - 1;
    let preDotState = 0;
    for(; i >= start; --i){
        const code = path71.charCodeAt(i);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute24) {
                ret.base = ret.name = path71.slice(1, end);
            } else {
                ret.base = ret.name = path71.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute24) {
            ret.name = path71.slice(1, startDot);
            ret.base = path71.slice(1, end);
        } else {
            ret.name = path71.slice(startPart, startDot);
            ret.base = path71.slice(startPart, end);
        }
        ret.ext = path71.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path71.slice(0, startPart - 1);
    else if (isAbsolute24) ret.dir = "/";
    return ret;
}
function fromFileUrl7(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl4(path72) {
    if (!isAbsolute7(path72)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace1(path72.replace(/%/g, "%25").replace(/\\/g, "%5C"));
    return url;
}
const mod7 = {
    sep: sep7,
    delimiter: delimiter7,
    resolve: resolve7,
    normalize: normalize8,
    isAbsolute: isAbsolute7,
    join: join8,
    relative: relative7,
    toNamespacedPath: toNamespacedPath7,
    dirname: dirname7,
    basename: basename7,
    extname: extname7,
    format: format7,
    parse: parse7,
    fromFileUrl: fromFileUrl7,
    toFileUrl: toFileUrl4
};
const path3 = isWindows2 ? mod6 : mod7;
const { join: join9 , normalize: normalize9  } = path3;
const path4 = isWindows2 ? mod6 : mod7;
const { basename: basename8 , delimiter: delimiter8 , dirname: dirname8 , extname: extname8 , format: format8 , fromFileUrl: fromFileUrl8 , isAbsolute: isAbsolute8 , join: join10 , normalize: normalize10 , parse: parse8 , relative: relative8 , resolve: resolve8 , sep: sep8 , toFileUrl: toFileUrl5 , toNamespacedPath: toNamespacedPath8 ,  } = path4;
function getFileInfoType(fileInfo) {
    return fileInfo.isFile ? "file" : fileInfo.isDirectory ? "dir" : fileInfo.isSymlink ? "symlink" : undefined;
}
function ensureDirSync(dir) {
    try {
        const fileInfo = Deno.lstatSync(dir);
        if (!fileInfo.isDirectory) {
            throw new Error(`Ensure path exists, expected 'dir', got '${getFileInfoType(fileInfo)}'`);
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            Deno.mkdirSync(dir, {
                recursive: true
            });
            return;
        }
        throw err;
    }
}
function existsSync1(filePath) {
    try {
        Deno.lstatSync(filePath);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
var EOL;
(function(EOL1) {
    EOL1["LF"] = "\n";
    EOL1["CRLF"] = "\r\n";
})(EOL || (EOL = {
}));
function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const MIN_READ = 32 * 1024;
const MAX_SIZE = 2 ** 32 - 2;
class Buffer1 {
    #buf;
    #off = 0;
    constructor(ab){
        this.#buf = ab === undefined ? new Uint8Array(0) : new Uint8Array(ab);
    }
    bytes(options = {
        copy: true
    }) {
        if (options.copy === false) return this.#buf.subarray(this.#off);
        return this.#buf.slice(this.#off);
    }
    empty() {
        return this.#buf.byteLength <= this.#off;
    }
    get length() {
        return this.#buf.byteLength - this.#off;
    }
    get capacity() {
        return this.#buf.buffer.byteLength;
    }
    truncate(n) {
        if (n === 0) {
            this.reset();
            return;
        }
        if (n < 0 || n > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        this.#reslice(this.#off + n);
    }
    reset() {
        this.#reslice(0);
        this.#off = 0;
    }
     #tryGrowByReslice(n) {
        const l = this.#buf.byteLength;
        if (n <= this.capacity - l) {
            this.#reslice(l + n);
            return l;
        }
        return -1;
    }
     #reslice(len) {
        assert1(len <= this.#buf.buffer.byteLength);
        this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
    }
    readSync(p) {
        if (this.empty()) {
            this.reset();
            if (p.byteLength === 0) {
                return 0;
            }
            return null;
        }
        const nread = copy(this.#buf.subarray(this.#off), p);
        this.#off += nread;
        return nread;
    }
    read(p) {
        const rr = this.readSync(p);
        return Promise.resolve(rr);
    }
    writeSync(p) {
        const m = this.#grow(p.byteLength);
        return copy(p, this.#buf, m);
    }
    write(p) {
        const n1 = this.writeSync(p);
        return Promise.resolve(n1);
    }
     #grow(n2) {
        const m = this.length;
        if (m === 0 && this.#off !== 0) {
            this.reset();
        }
        const i = this.#tryGrowByReslice(n2);
        if (i >= 0) {
            return i;
        }
        const c = this.capacity;
        if (n2 <= Math.floor(c / 2) - m) {
            copy(this.#buf.subarray(this.#off), this.#buf);
        } else if (c + n2 > MAX_SIZE) {
            throw new Error("The buffer cannot be grown beyond the maximum size.");
        } else {
            const buf = new Uint8Array(Math.min(2 * c + n2, MAX_SIZE));
            copy(this.#buf.subarray(this.#off), buf);
            this.#buf = buf;
        }
        this.#off = 0;
        this.#reslice(Math.min(m + n2, MAX_SIZE));
        return m;
    }
    grow(n3) {
        if (n3 < 0) {
            throw Error("Buffer.grow: negative count");
        }
        const m = this.#grow(n3);
        this.#reslice(m);
    }
    async readFrom(r) {
        let n4 = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = await r.read(buf);
            if (nread === null) {
                return n4;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n4 += nread;
        }
    }
    readFromSync(r) {
        let n5 = 0;
        const tmp = new Uint8Array(MIN_READ);
        while(true){
            const shouldGrow = this.capacity - this.length < MIN_READ;
            const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
            const nread = r.readSync(buf);
            if (nread === null) {
                return n5;
            }
            if (shouldGrow) this.writeSync(buf.subarray(0, nread));
            else this.#reslice(this.length + nread);
            n5 += nread;
        }
    }
}
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    partial;
    name = "BufferFullError";
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
    }
}
class PartialReadError extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader {
    #buf;
    #rd;
    #r = 0;
    #w = 0;
    #eof = false;
    static create(r, size = 4096) {
        return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    size() {
        return this.#buf.byteLength;
    }
    buffered() {
        return this.#w - this.#r;
    }
    #fill = async ()=>{
        if (this.#r > 0) {
            this.#buf.copyWithin(0, this.#r, this.#w);
            this.#w -= this.#r;
            this.#r = 0;
        }
        if (this.#w >= this.#buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i = 100; i > 0; i--){
            const rr = await this.#rd.read(this.#buf.subarray(this.#w));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert1(rr >= 0, "negative read");
            this.#w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    };
    reset(r) {
        this.#reset(this.#buf, r);
    }
    #reset = (buf, rd)=>{
        this.#buf = buf;
        this.#rd = rd;
        this.#eof = false;
    };
    async read(p) {
        let rr = p.byteLength;
        if (p.byteLength === 0) return rr;
        if (this.#r === this.#w) {
            if (p.byteLength >= this.#buf.byteLength) {
                const rr = await this.#rd.read(p);
                const nread = rr ?? 0;
                assert1(nread >= 0, "negative read");
                return rr;
            }
            this.#r = 0;
            this.#w = 0;
            rr = await this.#rd.read(this.#buf);
            if (rr === 0 || rr === null) return rr;
            assert1(rr >= 0, "negative read");
            this.#w += rr;
        }
        const copied = copy(this.#buf.subarray(this.#r, this.#w), p, 0);
        this.#r += copied;
        return copied;
    }
    async readFull(p) {
        let bytesRead = 0;
        while(bytesRead < p.length){
            try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = p.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = p.subarray(0, bytesRead);
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p;
    }
    async readByte() {
        while(this.#r === this.#w){
            if (this.#eof) return null;
            await this.#fill();
        }
        const c = this.#buf[this.#r];
        this.#r++;
        return c;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError) {
                partial = err.partial;
                assert1(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError)) {
                throw err;
            }
            partial = err.partial;
            if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
                assert1(this.#r > 0, "bufio: tried to rewind past start of buffer");
                this.#r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.#eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s = 0;
        let slice;
        while(true){
            let i = this.#buf.subarray(this.#r + s, this.#w).indexOf(delim);
            if (i >= 0) {
                i += s;
                slice = this.#buf.subarray(this.#r, this.#r + i + 1);
                this.#r += i + 1;
                break;
            }
            if (this.#eof) {
                if (this.#r === this.#w) {
                    return null;
                }
                slice = this.#buf.subarray(this.#r, this.#w);
                this.#r = this.#w;
                break;
            }
            if (this.buffered() >= this.#buf.byteLength) {
                this.#r = this.#w;
                const oldbuf = this.#buf;
                const newbuf = this.#buf.slice(0);
                this.#buf = newbuf;
                throw new BufferFullError(oldbuf);
            }
            s = this.#w - this.#r;
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = slice;
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.#w - this.#r;
        while(avail < n6 && avail < this.#buf.byteLength && !this.#eof){
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = this.#buf.subarray(this.#r, this.#w);
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = this.#buf.subarray(this.#r, this.#w);
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.#w - this.#r;
        }
        if (avail === 0 && this.#eof) {
            return null;
        } else if (avail < n6 && this.#eof) {
            return this.#buf.subarray(this.#r, this.#r + avail);
        } else if (avail < n6) {
            throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
        }
        return this.#buf.subarray(this.#r, this.#r + n6);
    }
}
class AbstractBufBase {
    buf;
    usedBufferBytes = 0;
    err = null;
    constructor(buf){
        this.buf = buf;
    }
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer, size = 4096){
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        const buf = new Uint8Array(size);
        super(buf);
        this.#writer = writer;
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p.length){
                nwritten += await this.#writer.write(p.subarray(nwritten));
            }
        } catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.#writer.write(data);
                } catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            } else {
                numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
    }
    constructor(writer, size = 4096){
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        const buf = new Uint8Array(size);
        super(buf);
        this.#writer = writer;
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p.length){
                nwritten += this.#writer.writeSync(p.subarray(nwritten));
            }
        } catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.#writer.writeSync(data);
                } catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            } else {
                numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
const DEFAULT_BUFFER_SIZE = 32 * 1024;
function readerFromStreamReader(streamReader) {
    const buffer = new Buffer1();
    return {
        async read (p) {
            if (buffer.empty()) {
                const res = await streamReader.read();
                if (res.done) {
                    return null;
                }
                await writeAll(buffer, res.value);
            }
            return buffer.read(p);
        }
    };
}
async function writeAll(w, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += await w.write(arr.subarray(nwritten));
    }
}
async function copy1(src, dst, options) {
    let n1 = 0;
    const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    let gotEOF = false;
    while(gotEOF === false){
        const result = await src.read(b);
        if (result === null) {
            gotEOF = true;
        } else {
            let nwritten = 0;
            while(nwritten < result){
                nwritten += await dst.write(b.subarray(nwritten, result));
            }
            n1 += nwritten;
        }
    }
    return n1;
}
async function __default(src, destination) {
    const res1 = await fetch(src + '.json');
    const files2 = await res1.json();
    Object.keys(files2).forEach(async (key)=>{
        const segments = key.split('/');
        if (segments[0] && segments[0] !== segments.at(-1)) ensureDirSync(resolve5(`./${segments[0]}`));
        if (segments[1] && segments[1] !== segments.at(-1)) ensureDirSync(resolve5(`./${segments[0]}`, segments[1]));
        if (segments[2] && segments[2] !== segments.at(-1)) ensureDirSync(resolve5(`./${segments[0]}`, segments[1], segments[2]));
        if (segments[3] && segments[3] !== segments.at(-1)) ensureDirSync(resolve5(`./${segments[0]}`, segments[1], segments[2], segments[3]));
        if (segments[4] && segments[4] !== segments.at(-1)) ensureDirSync(resolve5(`./${segments[0]}`, segments[1], segments[2], segments[3], segments[4]));
        if (/.png$|.ico$|.jpg$|.jpeg$/.test(key)) {
            const res = await fetch(files2[key]);
            const reader = res.body?.getReader();
            if (reader) {
                const source = readerFromStreamReader(reader);
                const newFile = await Deno.open('.' + key, {
                    create: true,
                    write: true
                });
                await copy1(source, newFile);
                newFile.close();
            }
        } else {
            Deno.writeTextFileSync(resolve5('./' + key), files2[key]);
        }
    });
}
async function exec(cmd) {
    return new Promise(async (resolve10)=>{
        const p = Deno.run({
            cmd: cmd.split(' '),
            stderr: 'piped',
            stdout: 'piped'
        });
        const [_, stdout] = await Promise.all([
            p.status(),
            p.output(),
            p.stderrOutput()
        ]);
        const outStr = new TextDecoder().decode(stdout);
        resolve10(outStr.trim());
    });
}
const ANSI_BACKGROUND_OFFSET = 10;
const wrapAnsi16 = (offset = 0)=>(code)=>`\u001B[${code + offset}m`
;
const wrapAnsi256 = (offset = 0)=>(code)=>`\u001B[${38 + offset};5;${code}m`
;
const wrapAnsi16m = (offset = 0)=>(red, green, blue)=>`\u001B[${38 + offset};2;${red};${green};${blue}m`
;
function assembleStyles() {
    const codes = new Map();
    const styles2 = {
        modifier: {
            reset: [
                0,
                0
            ],
            bold: [
                1,
                22
            ],
            dim: [
                2,
                22
            ],
            italic: [
                3,
                23
            ],
            underline: [
                4,
                24
            ],
            overline: [
                53,
                55
            ],
            inverse: [
                7,
                27
            ],
            hidden: [
                8,
                28
            ],
            strikethrough: [
                9,
                29
            ]
        },
        color: {
            black: [
                30,
                39
            ],
            red: [
                31,
                39
            ],
            green: [
                32,
                39
            ],
            yellow: [
                33,
                39
            ],
            blue: [
                34,
                39
            ],
            magenta: [
                35,
                39
            ],
            cyan: [
                36,
                39
            ],
            white: [
                37,
                39
            ],
            blackBright: [
                90,
                39
            ],
            redBright: [
                91,
                39
            ],
            greenBright: [
                92,
                39
            ],
            yellowBright: [
                93,
                39
            ],
            blueBright: [
                94,
                39
            ],
            magentaBright: [
                95,
                39
            ],
            cyanBright: [
                96,
                39
            ],
            whiteBright: [
                97,
                39
            ]
        },
        bgColor: {
            bgBlack: [
                40,
                49
            ],
            bgRed: [
                41,
                49
            ],
            bgGreen: [
                42,
                49
            ],
            bgYellow: [
                43,
                49
            ],
            bgBlue: [
                44,
                49
            ],
            bgMagenta: [
                45,
                49
            ],
            bgCyan: [
                46,
                49
            ],
            bgWhite: [
                47,
                49
            ],
            bgBlackBright: [
                100,
                49
            ],
            bgRedBright: [
                101,
                49
            ],
            bgGreenBright: [
                102,
                49
            ],
            bgYellowBright: [
                103,
                49
            ],
            bgBlueBright: [
                104,
                49
            ],
            bgMagentaBright: [
                105,
                49
            ],
            bgCyanBright: [
                106,
                49
            ],
            bgWhiteBright: [
                107,
                49
            ]
        }
    };
    styles2.color.gray = styles2.color.blackBright;
    styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
    styles2.color.grey = styles2.color.blackBright;
    styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles2)){
        for (const [styleName, style2] of Object.entries(group)){
            styles2[styleName] = {
                open: `\u001B[${style2[0]}m`,
                close: `\u001B[${style2[1]}m`
            };
            group[styleName] = styles2[styleName];
            codes.set(style2[0], style2[1]);
        }
        Object.defineProperty(styles2, groupName, {
            value: group,
            enumerable: false
        });
    }
    Object.defineProperty(styles2, 'codes', {
        value: codes,
        enumerable: false
    });
    styles2.color.close = '\u001B[39m';
    styles2.bgColor.close = '\u001B[49m';
    styles2.color.ansi = wrapAnsi16();
    styles2.color.ansi256 = wrapAnsi256();
    styles2.color.ansi16m = wrapAnsi16m();
    styles2.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
    styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    Object.defineProperties(styles2, {
        rgbToAnsi256: {
            value: (red, green, blue)=>{
                if (red === green && green === blue) {
                    if (red < 8) {
                        return 16;
                    }
                    if (red > 248) {
                        return 231;
                    }
                    return Math.round((red - 8) / 247 * 24) + 232;
                }
                return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
            },
            enumerable: false
        },
        hexToRgb: {
            value: (hex)=>{
                const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
                if (!matches) {
                    return [
                        0,
                        0,
                        0
                    ];
                }
                let { colorString  } = matches.groups;
                if (colorString.length === 3) {
                    colorString = colorString.split('').map((character)=>character + character
                    ).join('');
                }
                const integer = Number.parseInt(colorString, 16);
                return [
                    integer >> 16 & 255,
                    integer >> 8 & 255,
                    integer & 255
                ];
            },
            enumerable: false
        },
        hexToAnsi256: {
            value: (hex)=>styles2.rgbToAnsi256(...styles2.hexToRgb(hex))
            ,
            enumerable: false
        },
        ansi256ToAnsi: {
            value: (code)=>{
                if (code < 8) {
                    return 30 + code;
                }
                if (code < 16) {
                    return 90 + (code - 8);
                }
                let red;
                let green;
                let blue;
                if (code >= 232) {
                    red = ((code - 232) * 10 + 8) / 255;
                    green = red;
                    blue = red;
                } else {
                    code -= 16;
                    const remainder = code % 36;
                    red = Math.floor(code / 36) / 5;
                    green = Math.floor(remainder / 6) / 5;
                    blue = remainder % 6 / 5;
                }
                const value = Math.max(red, green, blue) * 2;
                if (value === 0) {
                    return 30;
                }
                let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
                if (value === 2) {
                    result += 60;
                }
                return result;
            },
            enumerable: false
        },
        rgbToAnsi: {
            value: (red, green, blue)=>styles2.ansi256ToAnsi(styles2.rgbToAnsi256(red, green, blue))
            ,
            enumerable: false
        },
        hexToAnsi: {
            value: (hex)=>styles2.ansi256ToAnsi(styles2.hexToAnsi256(hex))
            ,
            enumerable: false
        }
    });
    return styles2;
}
const ansiStyles = assembleStyles();
function hasFlag(flag, argv4 = Deno.args) {
    const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
    const position = argv4.indexOf(prefix + flag);
    const terminatorPosition = argv4.indexOf('--');
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function isatty(fd) {
    if (typeof fd !== "number") {
        return false;
    }
    try {
        return Deno.isatty(fd);
    } catch (_) {
        return false;
    }
}
const env1 = Deno.env.toObject();
let flagForceColor;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never')) {
    flagForceColor = 0;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
    flagForceColor = 1;
}
function envForceColor() {
    if ('FORCE_COLOR' in env1) {
        if (env1.FORCE_COLOR === 'true') {
            return 1;
        }
        if (env1.FORCE_COLOR === 'false') {
            return 0;
        }
        return env1.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env1.FORCE_COLOR, 10), 3);
    }
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function _supportsColor(haveStream, { streamIsTTY , sniffFlags =true  } = {
}) {
    const noFlagForceColor = envForceColor();
    if (noFlagForceColor !== undefined) {
        flagForceColor = noFlagForceColor;
    }
    const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
    if (forceColor === 0) {
        return 0;
    }
    if (sniffFlags) {
        if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
            return 3;
        }
        if (hasFlag('color=256')) {
            return 2;
        }
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    const min = forceColor || 0;
    if (env1.TERM === 'dumb') {
        return min;
    }
    if (Deno.build.os === 'win32') {
        return 1;
    }
    if ('CI' in env1) {
        if ([
            'TRAVIS',
            'CIRCLECI',
            'APPVEYOR',
            'GITLAB_CI',
            'GITHUB_ACTIONS',
            'BUILDKITE',
            'DRONE'
        ].some((sign)=>sign in env1
        ) || env1.CI_NAME === 'codeship') {
            return 1;
        }
        return min;
    }
    if ('TEAMCITY_VERSION' in env1) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env1.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env1.COLORTERM === 'truecolor') {
        return 3;
    }
    if ('TERM_PROGRAM' in env1) {
        const version2 = Number.parseInt((env1.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
        switch(env1.TERM_PROGRAM){
            case 'iTerm.app':
                return version2 >= 3 ? 3 : 2;
            case 'Apple_Terminal':
                return 2;
        }
    }
    if (/-256(color)?$/i.test(env1.TERM)) {
        return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env1.TERM)) {
        return 1;
    }
    if ('COLORTERM' in env1) {
        return 1;
    }
    return min;
}
function createSupportsColor(stream, options = {
}) {
    const level = _supportsColor(stream, {
        streamIsTTY: stream && stream.isTTY,
        ...options
    });
    return translateLevel(level);
}
const supportsColor = {
    stdout: createSupportsColor({
        isTTY: isatty(1)
    }),
    stderr: createSupportsColor({
        isTTY: isatty(2)
    })
};
function stringReplaceAll(string, substring, replacer) {
    let index = string.indexOf(substring);
    if (index === -1) {
        return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = '';
    do {
        returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
        endIndex = index + substringLength;
        index = string.indexOf(substring, endIndex);
    }while (index !== -1)
    returnValue += string.slice(endIndex);
    return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
    let endIndex = 0;
    let returnValue = '';
    do {
        const gotCR = string[index - 1] === '\r';
        returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
        endIndex = index + 1;
        index = string.indexOf('\n', endIndex);
    }while (index !== -1)
    returnValue += string.slice(endIndex);
    return returnValue;
}
const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
const ESCAPES = new Map([
    [
        'n',
        '\n'
    ],
    [
        'r',
        '\r'
    ],
    [
        't',
        '\t'
    ],
    [
        'b',
        '\b'
    ],
    [
        'f',
        '\f'
    ],
    [
        'v',
        '\v'
    ],
    [
        '0',
        '\0'
    ],
    [
        '\\',
        '\\'
    ],
    [
        'e',
        '\u001B'
    ],
    [
        'a',
        '\u0007'
    ]
]);
function unescape(c) {
    const u = c[0] === 'u';
    const bracket = c[1] === '{';
    if (u && !bracket && c.length === 5 || c[0] === 'x' && c.length === 3) {
        return String.fromCharCode(Number.parseInt(c.slice(1), 16));
    }
    if (u && bracket) {
        return String.fromCodePoint(Number.parseInt(c.slice(2, -1), 16));
    }
    return ESCAPES.get(c) || c;
}
function parseArguments(name, arguments_) {
    const results = [];
    const chunks = arguments_.trim().split(/\s*,\s*/g);
    let matches;
    for (const chunk of chunks){
        const number = Number(chunk);
        if (!Number.isNaN(number)) {
            results.push(number);
        } else if (matches = chunk.match(STRING_REGEX)) {
            results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character)=>escape ? unescape(escape) : character
            ));
        } else {
            throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
        }
    }
    return results;
}
function parseStyle(style3) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while((matches = STYLE_REGEX.exec(style3)) !== null){
        const name = matches[1];
        if (matches[2]) {
            const args = parseArguments(name, matches[2]);
            results.push([
                name,
                ...args
            ]);
        } else {
            results.push([
                name
            ]);
        }
    }
    return results;
}
function buildStyle(chalk4, styles3) {
    const enabled = {
    };
    for (const layer of styles3){
        for (const style4 of layer.styles){
            enabled[style4[0]] = layer.inverse ? null : style4.slice(1);
        }
    }
    let current = chalk4;
    for (const [styleName1, styles1] of Object.entries(enabled)){
        if (!Array.isArray(styles1)) {
            continue;
        }
        if (!(styleName1 in current)) {
            throw new Error(`Unknown Chalk style: ${styleName1}`);
        }
        current = styles1.length > 0 ? current[styleName1](...styles1) : current[styleName1];
    }
    return current;
}
function template(chalk5, temporary) {
    const styles4 = [];
    const chunks = [];
    let chunk = [];
    temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style5, close, character)=>{
        if (escapeCharacter) {
            chunk.push(unescape(escapeCharacter));
        } else if (style5) {
            const string = chunk.join('');
            chunk = [];
            chunks.push(styles4.length === 0 ? string : buildStyle(chalk5, styles4)(string));
            styles4.push({
                inverse,
                styles: parseStyle(style5)
            });
        } else if (close) {
            if (styles4.length === 0) {
                throw new Error('Found extraneous } in Chalk template literal');
            }
            chunks.push(buildStyle(chalk5, styles4)(chunk.join('')));
            chunk = [];
            styles4.pop();
        } else {
            chunk.push(character);
        }
    });
    chunks.push(chunk.join(''));
    if (styles4.length > 0) {
        const errorMessage = `Chalk template literal is missing ${styles4.length} closing bracket${styles4.length === 1 ? '' : 's'} (\`}\`)`;
        throw new Error(errorMessage);
    }
    return chunks.join('');
}
const { stdout: stdoutColor , stderr: stderrColor  } = supportsColor;
const { isArray  } = Array;
const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');
const levelMapping = [
    'ansi',
    'ansi',
    'ansi256',
    'ansi16m'
];
const styles1 = Object.create(null);
const applyOptions = (object, options = {
})=>{
    if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
        throw new Error('The `level` option should be an integer from 0 to 3');
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === undefined ? colorLevel : options.level;
};
class Chalk {
    constructor(options){
        return chalkFactory(options);
    }
}
const chalkFactory = (options)=>{
    const chalk1 = {
    };
    applyOptions(chalk1, options);
    chalk1.template = (...arguments_)=>chalkTag(chalk1.template, ...arguments_)
    ;
    Object.setPrototypeOf(chalk1, createChalk.prototype);
    Object.setPrototypeOf(chalk1.template, chalk1);
    chalk1.template.Chalk = Chalk;
    return chalk1.template;
};
function createChalk(options) {
    return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansiStyles)){
    styles1[styleName] = {
        get () {
            const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
            Object.defineProperty(this, styleName, {
                value: builder
            });
            return builder;
        }
    };
}
styles1.visible = {
    get () {
        const builder = createBuilder(this, this[STYLER], true);
        Object.defineProperty(this, 'visible', {
            value: builder
        });
        return builder;
    }
};
const getModelAnsi = (model1, level, type, ...arguments_)=>{
    if (model1 === 'rgb') {
        if (level === 'ansi16m') {
            return ansiStyles[type].ansi16m(...arguments_);
        }
        if (level === 'ansi256') {
            return ansiStyles[type].ansi256(ansiStyles.rgbToAnsi256(...arguments_));
        }
        return ansiStyles[type].ansi(ansiStyles.rgbToAnsi(...arguments_));
    }
    if (model1 === 'hex') {
        return getModelAnsi('rgb', level, type, ...ansiStyles.hexToRgb(...arguments_));
    }
    return ansiStyles[type][model1](...arguments_);
};
const usedModels = [
    'rgb',
    'hex',
    'ansi256'
];
for (const model of usedModels){
    styles1[model] = {
        get () {
            const { level  } = this;
            return function(...arguments_) {
                const styler = createStyler(getModelAnsi(model, levelMapping[level], 'color', ...arguments_), ansiStyles.color.close, this[STYLER]);
                return createBuilder(this, styler, this[IS_EMPTY]);
            };
        }
    };
    const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
    styles1[bgModel] = {
        get () {
            const { level  } = this;
            return function(...arguments_) {
                const styler = createStyler(getModelAnsi(model, levelMapping[level], 'bgColor', ...arguments_), ansiStyles.bgColor.close, this[STYLER]);
                return createBuilder(this, styler, this[IS_EMPTY]);
            };
        }
    };
}
const proto = Object.defineProperties(()=>{
}, {
    ...styles1,
    level: {
        enumerable: true,
        get () {
            return this[GENERATOR].level;
        },
        set (level) {
            this[GENERATOR].level = level;
        }
    }
});
const createStyler = (open, close, parent)=>{
    let openAll;
    let closeAll;
    if (parent === undefined) {
        openAll = open;
        closeAll = close;
    } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
    }
    return {
        open,
        close,
        openAll,
        closeAll,
        parent
    };
};
const createBuilder = (self, _styler, _isEmpty)=>{
    const builder = (...arguments_)=>{
        if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
            return applyStyle(builder, chalkTag(builder, ...arguments_));
        }
        return applyStyle(builder, arguments_.length === 1 ? '' + arguments_[0] : arguments_.join(' '));
    };
    Object.setPrototypeOf(builder, proto);
    builder[GENERATOR] = self;
    builder[STYLER] = _styler;
    builder[IS_EMPTY] = _isEmpty;
    return builder;
};
const applyStyle = (self, string)=>{
    if (self.level <= 0 || !string) {
        return self[IS_EMPTY] ? '' : string;
    }
    let styler = self[STYLER];
    if (styler === undefined) {
        return string;
    }
    const { openAll , closeAll  } = styler;
    if (string.includes('\u001B')) {
        while(styler !== undefined){
            string = stringReplaceAll(string, styler.close, styler.open);
            styler = styler.parent;
        }
    }
    const lfIndex = string.indexOf('\n');
    if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
};
const chalkTag = (chalk2, ...strings)=>{
    const [firstString] = strings;
    if (!isArray(firstString) || !isArray(firstString.raw)) {
        return strings.join(' ');
    }
    const arguments_ = strings.slice(1);
    const parts = [
        firstString.raw[0]
    ];
    for(let i = 1; i < firstString.length; i++){
        parts.push(String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'), String(firstString.raw[i]));
    }
    return template(chalk2, parts.join(''));
};
Object.defineProperties(createChalk.prototype, styles1);
createChalk();
createChalk({
    level: stderrColor ? stderrColor.level : 0
});
const chalk = new Chalk();
class Config {
    static prefix = chalk.grey('sculptr:    ');
    prefix = Config.prefix;
}
const config = new Config();
function print1(str) {
    return console.log(config.prefix + str?.replaceAll('\n', '\n' + config.prefix));
}
function changeCWD(dir) {
    ensureDirSync(resolve5(dir));
    Deno.chdir(resolve5(dir));
    return;
}
function createOptions(args) {
    return {
        script: args.booleanOptions.typescript === true ? 'typescript' : args.booleanOptions.javascript === true ? 'javascript' : 'ASK',
        platform: args.platform,
        strict: args.booleanOptions.strict,
        style: args.booleanOptions.scss ? 'scss' : args.booleanOptions.css ? 'css' : args.booleanOptions.sass ? 'sass' : 'ASK'
    };
}
function getQuestions(options) {
    const newOpts = options;
    const scriptQuestion = {
        message: 'Do you want to build it in Javascript or Typescript?',
        choices: [
            'Typescript',
            'Javascript'
        ]
    };
    const styleQuestion = {
        message: 'Do you want use SCSS, Sass, or CSS?',
        choices: [
            'SCSS',
            'Sass',
            'CSS'
        ]
    };
    const questions = [];
    if (newOpts.script === 'ASK') questions.push(scriptQuestion);
    if (newOpts.style === 'ASK') questions.push(styleQuestion);
    return questions;
}
function makeLicense(name) {
    return `MIT License

Copyright (c) 2021 ${name}

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;
}
const importMeta = {
    url: "file:///Users/cooperrunyan/Documents/Coding/Projects/Sculptr-Deno/src/root.ts",
    main: false
};
const root = importMeta.url.replace('/src/root.ts', '');
new Chalk();
const files = [
    {
        name: 'tsconfig',
        accessors: [
            'tsc',
            'ts',
            'typescript',
            'tsconfig'
        ]
    }, 
];
async function add(inputFile, { log , strict , react , next , overwrite  }) {
    const getFile = (input3)=>{
        for (const file of files){
            for (const accessor of file.accessors){
                if (input3 === accessor) return file.name;
            }
        }
        throw new Error('Invalid file type');
    };
    const file1 = getFile(inputFile);
    if (file1 === 'tsconfig') {
        const getDir = (name)=>{
            if (!next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-${strict ? 'strict' : 'loose'}.json`;
            if (next && !react) return `${root}/assets/out/files/tsconfig/tsconfig-next--${strict ? 'strict' : 'loose'}.json`;
            if (!next && react) return `${root}/assets/out/files/tsconfig/tsconfig-react--${strict ? 'strict' : 'loose'}.json`;
            throw new Error('You cannot use --next AND --react');
        };
        const dir = getDir(file1);
        const res = await fetch(dir);
        const fileContent = await res.text();
        if ((existsSync1(resolve5('tsconfig.json')) || log) && !overwrite) return console.log(`${existsSync1(resolve5('tsconfig.json')) ? "error: File: 'tsconfig.json' already exists. Here is the new code:\n\n" : ''}${fileContent}`);
        Deno.writeTextFileSync(resolve5('tsconfig.json'), fileContent);
    }
}
async function rewriteFiles(options, username) {
    const oldPackage = JSON.parse(Deno.readTextFileSync(resolve5('./package.json')));
    Deno.removeSync(resolve5('./package.json'));
    await exec('npm init -y');
    const newPackageFile = JSON.parse(Deno.readTextFileSync(resolve5('./package.json')));
    newPackageFile.main = oldPackage.main;
    newPackageFile.author = username;
    newPackageFile.scripts = oldPackage.scripts;
    newPackageFile.dependencies = oldPackage.dependencies;
    newPackageFile.devDependencies = oldPackage.devDependencies;
    newPackageFile.version = '0.0.0';
    newPackageFile.license = 'MIT';
    if (options.platform === 'next' || options.platform === 'react') newPackageFile.browserslist = {
        production: [
            '>0.2%',
            'not dead',
            'not op_mini all'
        ],
        development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version'
        ]
    };
    const projectName = newPackageFile.name;
    Deno.writeTextFileSync(resolve5('./package.json'), JSON.stringify(newPackageFile, null, 2));
    Deno.writeTextFileSync(resolve5('./.gitignore'), 'node_modules\n');
    Deno.writeTextFileSync(resolve5('./LICENSE'), makeLicense(username || 'YOUR NAME'));
    await add('tsc', {
        strict: true,
        [options.platform]: true,
        overwrite: true
    });
    Deno.writeTextFileSync(resolve5('./README.md'), `# ${projectName} \n\n###### - ${username}`);
    const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
    const hpDir = options.platform === 'next' ? resolve5('pages/index' + extension) : options.platform === 'react' ? resolve5('src/App' + extension) : '';
    const script = Deno.readTextFileSync(hpDir).replaceAll('PROJECT-NAME', projectName).replaceAll('SCRIPT', options.script).replaceAll('PLATFORM', options.platform).replaceAll('STYLE', options.style);
    Deno.writeTextFileSync(hpDir, script);
    return newPackageFile;
}
function makePrefix(key, last) {
    let str = last ? '└' : '├';
    if (key) {
        str += '─ ';
    } else {
        str += '──┐';
    }
    return str;
}
function filterKeys(obj, hideFunctions) {
    let keys = [];
    for(let branch in obj){
        if (!obj.hasOwnProperty(branch)) {
            continue;
        }
        if (hideFunctions && typeof obj[branch] === "function") {
            continue;
        }
        keys.push(branch);
    }
    return keys;
}
function growBranch(key, root1, last, lastStates, showValues, hideFunctions, callback) {
    let line = '', index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);
    if (lastStatesCopy.push([
        root1,
        last
    ]) && lastStates.length > 0) {
        lastStates.forEach(function(lastState, idx) {
            if (idx > 0) {
                line += (lastState[1] ? ' ' : '│') + '  ';
            }
            if (!circular && lastState[0] === root1) {
                circular = true;
            }
        });
        line += makePrefix(key, last) + key;
        showValues && (typeof root1 !== 'object' || root1 instanceof Date) && (line += ': ' + root1);
        circular && (line += ' (circular ref.)');
        callback(line);
    }
    if (!circular && typeof root1 === 'object') {
        let keys = filterKeys(root1, hideFunctions);
        keys.forEach(function(branch) {
            lastKey = ++index === keys.length;
            growBranch(branch, root1[branch], lastKey, lastStatesCopy, showValues, hideFunctions, callback);
        });
    }
}
let jsonTree = function(obj, showValues, hideFunctions) {
    let tree1 = '';
    growBranch('.', obj, false, [], showValues, hideFunctions, function(line) {
        tree1 += line + '\n';
    });
    return tree1;
};
const chalk1 = new Chalk();
let files1 = [];
async function __default1() {
    const tree2 = makeTree();
    let str;
    str = tree2.replaceAll(/((\d)|(\d\d)): /gm, '').split('\n').slice(0, -1);
    for(let i = 0; i < str.length; i++){
        str[i] = config.prefix + str[i];
    }
    str = str.join('\n').padEnd(str.length + 10, ' ').padStart(str.length + 10, ' ');
    const color = function(extension, color) {
        const string = str.slice();
        let newStr = string.split(`.${extension} `).join('.' + chalk1[color](extension));
        newStr = newStr.split(`.${extension}\n`).join('.' + chalk1[color](`${extension}\n`));
        newStr = newStr.split(`.${extension}\r`).join('.' + chalk1[color](`${extension}\r`));
        return newStr;
    };
    str = str.split('|').join(chalk1.grey('|')).split('│').join(chalk1.grey('│')).split('└').join(chalk1.grey('└')).split('─').join(chalk1.grey('─')).split('├').join(chalk1.grey('├')).split('\r\n').join('  \r\n');
    str = color('css', 'cyan');
    str = color('scss', 'red');
    str = color('sass', 'red');
    str = color('tsx', 'blue');
    str = color('jsx', 'cyan');
    str = color('json', 'red');
    str = color('js', 'yellowBright');
    str = color('html', 'yellow');
    str = color('d.ts', 'green');
    str = color('ts', 'blue');
    str = str.split('.js.map ').join('.' + chalk1.yellowBright('js') + '.' + chalk1.yellowBright('map')).split('.js.map\n').join('.' + chalk1.yellowBright('js') + '.' + chalk1.yellowBright('map\n')).split('.js.map\r').join('.' + chalk1.yellowBright('js') + '.' + chalk1.yellowBright('map\r')).split('.d.ts').join('.' + chalk1.green('d.ts')).split('.d.ts\n').join('.' + chalk1.green('d.ts\n')).split('.d.ts\r').join('.' + chalk1.green('d.ts\r')).split('LICENSE').join(chalk1.yellow('LICENSE')).split('LICENSE\n').join(chalk1.yellow('LICENSE\n')).split('LICENSE\r').join(chalk1.yellow('LICENSE\r'));
    return str.trim();
}
function makeTree() {
    dirTree('.');
    files1.forEach((file)=>file.replace('./', '')
    );
    const info = {
    };
    files1.forEach((file)=>{
        const arr = file.split('/');
        info[arr[0]] = Deno.lstatSync(resolve5(arr[0] || '')).isDirectory && !Deno.lstatSync(resolve5(arr[0] || '')).isFile ? info[arr[0]] || {
        } : arr[0];
        if (typeof info[arr[0]] !== 'string') info[arr[0]][arr[1]] = Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '')).isDirectory && !Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '')).isFile ? info[arr[0]][arr[1]] || {
        } : arr[1];
        if (info[arr[0]] && info[arr[0]][arr[1]] && typeof info[arr[0]][arr[1]] !== 'string') info[arr[0]][arr[1]][arr[2]] = Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '')).isDirectory && !Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '')).isFile ? info[arr[0]][arr[1]][arr[2]] || {
        } : arr[2];
        if (info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && typeof info[arr[0]][arr[1]][arr[2]] !== 'string') info[arr[0]][arr[1]][arr[2]][arr[3]] = Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isDirectory && !Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isFile ? info[arr[0]][arr[1]][arr[2]][arr[3]] || {
        } : arr[3];
        if (info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && info[arr[0]][arr[1]][arr[2]][arr[3]] && typeof info[arr[0]][arr[1]][arr[2]][arr[3]] !== 'string') info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] = Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isDirectory && !Deno.lstatSync(resolve5(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isFile ? info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] || {
        } : arr[4];
    });
    const t = jsonTree(info['.'], true, false).replaceAll(/: \w+.\w+.+|: .\w+/gi, '').split('\n').map((value)=>value.replaceAll(/.+undefined/gi, '')
    ).filter((value)=>value.trim() !== ''
    ).join('\n');
    return t;
}
function dirTree(filename) {
    files1.push(filename);
    const stats = Deno.lstatSync(filename);
    const info = {
        name: filename
    };
    if (stats.isDirectory) {
        Array.from(Deno.readDirSync(filename))?.forEach((child)=>{
            info[child.name] = child.name;
            dirTree(filename + '/' + child.name);
        });
    } else return info;
}
async function tree() {
    print1('Files written');
    print1('');
    print1(`Making an visual representation of the folder tree...`);
    const tree1 = await __default1();
    print1('Tree created:');
    print1('');
    console.log(tree1);
    print1('');
}
async function install(args) {
    if (args.booleanOptions.skip !== true) {
        print1(`Installing dependencies...`);
        await exec('npm i');
        print1('Dependencies installed');
        print1('');
    }
}
const chalk2 = new Chalk();
function makeScripts(scriptsObj) {
    let str = [];
    Object.entries(scriptsObj).forEach(([key, value])=>{
        str.push(`${config.prefix}  ${(chalk2.red(key) + ':').padEnd('/x1B[31mstyle/x1B[39m:  '.length - 8)}  ${chalk2.green(`'${value}'`)}`);
    });
    return str.join(',\n');
}
const chalk3 = new Chalk();
function complete(options, { name , username , scripts: scripts1  }) {
    print1(`${chalk3.yellow('Task completed')}
  Project Name:  ${chalk3.cyan("'" + name + "'")}
  Username:      ${chalk3.cyan("'" + username + "'")}
  `);
    print1(`Built a new project with: ${chalk3.blue(options.platform.charAt(0).toUpperCase() + options.platform.slice(1).toLowerCase())}, ${chalk3.blue(options.script.charAt(0).toUpperCase() + options.script.slice(1).toLowerCase())}, ${chalk3.blue(options.style.charAt(0).toUpperCase() + options.style.slice(1).toLowerCase())}`);
    print1('\nPrewritten scripts (in ./package.json):');
    console.log(makeScripts(scripts1));
}
async function build(dir, args) {
    changeCWD(dir);
    const options = createOptions(args);
    const answers = await ask(getQuestions(options));
    if (answers.style) options.style = answers.style.toLowerCase();
    if (answers.script) options.script = answers.script.toLowerCase();
    const origin = `${options.platform}-template/${options.script}/${options.style}`;
    print1(`Writing files...`);
    await __default(`${root}/assets/out/${origin}`, resolve5('.'));
    const username = await exec('git config --global --get user.name').catch((err)=>console.error(err)
    );
    const packageJSON = await rewriteFiles(options, username);
    const { scripts: scripts2 , name  } = packageJSON;
    await tree();
    await install(args);
    complete(options, {
        name,
        username,
        scripts: scripts2
    });
    return;
}
async function use(number = 'latest') {
    const response = await fetch('https://api.github.com/repos/cooperrunyan/Sculptr/releases');
    const releases = await response.json();
    const [exists, version3] = (()=>{
        for (const release of releases){
            if (release.tag_name === number) return [
                true,
                number
            ];
        }
        if (number === 'latest' || number === '@latest') return [
            true,
            releases[0].tag_name
        ];
        return [
            false
        ];
    })();
    if (!version3 || !exists) throw new Error('Ivalid version number');
    if (exists) {
        await exec(`deno install --unstable --allow-write --allow-read --allow-net --allow-run -n sculptr --allow-env -f https://deno.land/x/sculptr@${version3}/mod.js`);
    }
    console.log(`Successfully installed sculptr@${version3}`);
}
const program = new Command();
const version1 = '0.0.27';
program.version(version1).description('A command line tool for creating your projects');
program.command('build <platform> <name>').alias('b').description("Builds scaffolding for a new project. <platform> should be 'next' or 'react'. <name> should be the name of the project, or directory to the project.").option('--s,--skip').option('--scss').option('--sass').option('--css').option('--ts,--typescript').option('--js,--javascript').action((platform1, dir, args)=>{
    if (platform1 === 'n') platform1 = 'next';
    if (platform1 === 'r') platform1 = 'react';
    build(dir, {
        platform: platform1,
        booleanOptions: {
            ...args
        }
    });
});
program.command('add <file>').option('--log', 'Log the file instead of writing it').option('-S --no-strict', 'Uses stricter typescript settings').option('--react').option('--next').option('--overwrite').description('Adds a new asset to your project.').action(add);
program.command('use [version]').alias('install').alias('update').description('Installs a given version of sculptr').action(use);
program.parse(Deno.args);
const __default2 = {
    build,
    add,
    use
};
export { __default2 as default };
