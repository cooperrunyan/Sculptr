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
const arch2 = Deno.build.arch;
const chdir2 = Deno.chdir;
const cwd2 = Deno.cwd;
const exit2 = Deno.exit;
const pid2 = Deno.pid;
const platform2 = Deno.build.os === "windows" ? "win32" : Deno.build.os;
const version2 = `v${Deno.version.deno}`;
const versions2 = {
    node: Deno.version.deno,
    ...Deno.version
};
const process3 = {
    arch: arch2,
    chdir: chdir2,
    cwd: cwd2,
    exit: exit2,
    pid: pid2,
    platform: platform2,
    version: version2,
    versions: versions2,
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
const argv6 = new Proxy(process3.argv, {
});
const env3 = new Proxy(process3.env, {
});
Object.defineProperty(process3, Symbol.toStringTag, {
    enumerable: false,
    writable: true,
    configurable: false,
    value: "process"
});
Object.defineProperty(globalThis, "process", {
    value: process3,
    enumerable: false,
    writable: true,
    configurable: true
});
const mod = {
    arch: arch2,
    chdir: chdir2,
    cwd: cwd2,
    exit: exit2,
    pid: pid2,
    platform: platform2,
    version: version2,
    versions: versions2,
    process: process3,
    argv: argv6,
    env: env3,
    default: process3
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
        return new Promise((resolve6, reject)=>{
            original.call(this, ...args, (err, ...values)=>{
                if (err) {
                    return reject(err);
                }
                if (argumentNames !== undefined && values.length > 1) {
                    const obj = {
                    };
                    for(let i2 = 0; i2 < argumentNames.length; i2++){
                        obj[argumentNames[i2]] = values[i2];
                    }
                    resolve6(obj);
                } else {
                    resolve6(values[0]);
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
function validateIntegerRange(value, name1, min1 = -2147483648, max = 2147483647) {
    if (!Number.isInteger(value)) {
        throw new Error(`${name1} must be 'an integer' but was ${value}`);
    }
    if (value < min1 || value > max) {
        throw new Error(`${name1} must be >= ${min1} && <= ${max}.  Value was ${value}`);
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
        for(let i3 = 0; i3 < arr.length; i3++){
            unwrappedListeners[i3] = arr[i3]["listener"] || arr[i3];
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
            for(let i4 = arr.length - 1; i4 >= 0; i4--){
                if (arr[i4] == listener || arr[i4] && arr[i4]["listener"] == listener) {
                    listenerIndex = i4;
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
    for(let i5 = 0; i5 < dst.length; i5++){
        const v = src[i5];
        dst[i5 * 2] = hextable[v >> 4];
        dst[i5 * 2 + 1] = hextable[v & 15];
    }
    return dst;
}
function encodeToString(src) {
    return new TextDecoder().decode(encode(src));
}
function decode(src) {
    const dst = new Uint8Array(decodedLen(src.length));
    for(let i6 = 0; i6 < dst.length; i6++){
        const a = fromHexChar(src[i6 * 2]);
        const b = fromHexChar(src[i6 * 2 + 1]);
        dst[i6] = a << 4 | b;
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
        for(let i7 = 0; i7 < d.length; ++i7){
            dataString += String.fromCharCode(d[i7]);
        }
        return btoa(dataString);
    }
}
function decode1(data) {
    const binaryString = decodeString1(data);
    const binary = new Uint8Array(binaryString.length);
    for(let i8 = 0; i8 < binary.length; ++i8){
        binary[i8] = binaryString.charCodeAt(i8);
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
        for(let i9 = 0; i9 < this.length; i9++){
            if (this[i9] !== otherBuffer[i9]) return false;
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
    for(let i10 = 0; i10 < glob.length; i10++){
        c = glob[i10];
        n = glob[i10 + 1];
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
                    i10++;
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
                i10++;
                let value = "";
                while(glob[++i10] !== ":")value += glob[i10];
                if (value === "alnum") add1("(?:\\w|\\d)");
                else if (value === "space") add1("\\s");
                else if (value === "digit") add1("\\d");
                i10++;
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
            const prevChar = glob[i10 - 1];
            let starCount = 1;
            while(glob[i10 + 1] === "*"){
                starCount++;
                i10++;
            }
            const nextChar = glob[i10 + 1];
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
                    i10++;
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
function assertPath(path3) {
    if (typeof path3 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path3)}`);
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
function normalizeString(path4, allowAboveRoot, separator, isPathSeparator1) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i11 = 0, len = path4.length; i11 <= len; ++i11){
        if (i11 < len) code = path4.charCodeAt(i11);
        else if (isPathSeparator1(code)) break;
        else code = CHAR_FORWARD_SLASH;
        if (isPathSeparator1(code)) {
            if (lastSlash === i11 - 1 || dots === 1) {
            } else if (lastSlash !== i11 - 1 && dots === 2) {
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
                        lastSlash = i11;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i11;
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
                if (res.length > 0) res += separator + path4.slice(lastSlash + 1, i11);
                else res = path4.slice(lastSlash + 1, i11);
                lastSegmentLength = i11 - lastSlash - 1;
            }
            lastSlash = i11;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format(sep6, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base1 = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base1;
    if (dir === pathObject.root) return dir + base1;
    return dir + sep6 + base1;
}
const sep = "\\";
const delimiter = ";";
function resolve(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i12 = pathSegments.length - 1; i12 >= -1; i12--){
        let path5;
        if (i12 >= 0) {
            path5 = pathSegments[i12];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path5 = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path5 = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path5 === undefined || path5.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path5 = `${resolvedDevice}\\`;
            }
        }
        assertPath(path5);
        const len = path5.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute1 = false;
        const code = path5.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code)) {
                isAbsolute1 = true;
                if (isPathSeparator(path5.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator(path5.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path5.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator(path5.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator(path5.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path5.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path5.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot(code)) {
                if (path5.charCodeAt(1) === 58) {
                    device = path5.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator(path5.charCodeAt(2))) {
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
            resolvedTail = `${path5.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute1;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path6) {
    assertPath(path6);
    const len = path6.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute2 = false;
    const code = path6.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            isAbsolute2 = true;
            if (isPathSeparator(path6.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path6.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path6.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path6.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path6.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path6.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path6.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path6.charCodeAt(1) === 58) {
                device = path6.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path6.charCodeAt(2))) {
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
        tail = normalizeString(path6.slice(rootEnd), !isAbsolute2, "\\", isPathSeparator);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute2) tail = ".";
    if (tail.length > 0 && isPathSeparator(path6.charCodeAt(len - 1))) {
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
function isAbsolute(path7) {
    assertPath(path7);
    const len = path7.length;
    if (len === 0) return false;
    const code = path7.charCodeAt(0);
    if (isPathSeparator(code)) {
        return true;
    } else if (isWindowsDeviceRoot(code)) {
        if (len > 2 && path7.charCodeAt(1) === 58) {
            if (isPathSeparator(path7.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i13 = 0; i13 < pathsCount; ++i13){
        const path8 = paths[i13];
        assertPath(path8);
        if (path8.length > 0) {
            if (joined === undefined) joined = firstPart = path8;
            else joined += `\\${path8}`;
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
    let i14 = 0;
    for(; i14 <= length; ++i14){
        if (i14 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i14) === 92) {
                    return toOrig.slice(toStart + i14 + 1);
                } else if (i14 === 2) {
                    return toOrig.slice(toStart + i14);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i14) === 92) {
                    lastCommonSep = i14;
                } else if (i14 === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i14);
        const toCode = to.charCodeAt(toStart + i14);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i14;
    }
    if (i14 !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i14 = fromStart + lastCommonSep + 1; i14 <= fromEnd; ++i14){
        if (i14 === fromEnd || from.charCodeAt(i14) === 92) {
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
function toNamespacedPath(path9) {
    if (typeof path9 !== "string") return path9;
    if (path9.length === 0) return "";
    const resolvedPath = resolve(path9);
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
    return path9;
}
function dirname(path10) {
    assertPath(path10);
    const len = path10.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path10.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator(path10.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path10.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path10.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path10.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path10;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot(code)) {
            if (path10.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator(path10.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        return path10;
    }
    for(let i15 = len - 1; i15 >= offset; --i15){
        if (isPathSeparator(path10.charCodeAt(i15))) {
            if (!matchedSlash) {
                end = i15;
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
    return path10.slice(0, end);
}
function basename(path11, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path11);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i16;
    if (path11.length >= 2) {
        const drive = path11.charCodeAt(0);
        if (isWindowsDeviceRoot(drive)) {
            if (path11.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path11.length) {
        if (ext.length === path11.length && ext === path11) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i16 = path11.length - 1; i16 >= start; --i16){
            const code = path11.charCodeAt(i16);
            if (isPathSeparator(code)) {
                if (!matchedSlash) {
                    start = i16 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i16 + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i16;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path11.length;
        return path11.slice(start, end);
    } else {
        for(i16 = path11.length - 1; i16 >= start; --i16){
            if (isPathSeparator(path11.charCodeAt(i16))) {
                if (!matchedSlash) {
                    start = i16 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i16 + 1;
            }
        }
        if (end === -1) return "";
        return path11.slice(start, end);
    }
}
function extname(path12) {
    assertPath(path12);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path12.length >= 2 && path12.charCodeAt(1) === 58 && isWindowsDeviceRoot(path12.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i17 = path12.length - 1; i17 >= start; --i17){
        const code = path12.charCodeAt(i17);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i17 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i17 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i17;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path12.slice(startDot, end);
}
function format6(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("\\", pathObject);
}
function parse(path13) {
    assertPath(path13);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path13.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path13.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code)) {
            rootEnd = 1;
            if (isPathSeparator(path13.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path13.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path13.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path13.charCodeAt(j))) break;
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
            if (path13.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator(path13.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path13;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path13;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator(code)) {
        ret.root = ret.dir = path13;
        return ret;
    }
    if (rootEnd > 0) ret.root = path13.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i18 = path13.length - 1;
    let preDotState = 0;
    for(; i18 >= rootEnd; --i18){
        code = path13.charCodeAt(i18);
        if (isPathSeparator(code)) {
            if (!matchedSlash) {
                startPart = i18 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i18 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i18;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path13.slice(startPart, end);
        }
    } else {
        ret.name = path13.slice(startPart, startDot);
        ret.base = path13.slice(startPart, end);
        ret.ext = path13.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path13.slice(0, startPart - 1);
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
    format: format6,
    parse: parse,
    fromFileUrl: fromFileUrl
};
const sep1 = "/";
const delimiter1 = ":";
function resolve1(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for(let i19 = pathSegments.length - 1; i19 >= -1 && !resolvedAbsolute; i19--){
        let path14;
        if (i19 >= 0) path14 = pathSegments[i19];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path14 = Deno.cwd();
        }
        assertPath(path14);
        if (path14.length === 0) {
            continue;
        }
        resolvedPath = `${path14}/${resolvedPath}`;
        resolvedAbsolute = path14.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize1(path15) {
    assertPath(path15);
    if (path15.length === 0) return ".";
    const isAbsolute1 = path15.charCodeAt(0) === 47;
    const trailingSeparator = path15.charCodeAt(path15.length - 1) === 47;
    path15 = normalizeString(path15, !isAbsolute1, "/", isPosixPathSeparator);
    if (path15.length === 0 && !isAbsolute1) path15 = ".";
    if (path15.length > 0 && trailingSeparator) path15 += "/";
    if (isAbsolute1) return `/${path15}`;
    return path15;
}
function isAbsolute1(path16) {
    assertPath(path16);
    return path16.length > 0 && path16.charCodeAt(0) === 47;
}
function join1(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i20 = 0, len = paths.length; i20 < len; ++i20){
        const path17 = paths[i20];
        assertPath(path17);
        if (path17.length > 0) {
            if (!joined) joined = path17;
            else joined += `/${path17}`;
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
    let i21 = 0;
    for(; i21 <= length; ++i21){
        if (i21 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i21) === 47) {
                    return to.slice(toStart + i21 + 1);
                } else if (i21 === 0) {
                    return to.slice(toStart + i21);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i21) === 47) {
                    lastCommonSep = i21;
                } else if (i21 === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i21);
        const toCode = to.charCodeAt(toStart + i21);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i21;
    }
    let out = "";
    for(i21 = fromStart + lastCommonSep + 1; i21 <= fromEnd; ++i21){
        if (i21 === fromEnd || from.charCodeAt(i21) === 47) {
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
function toNamespacedPath1(path18) {
    return path18;
}
function dirname1(path19) {
    assertPath(path19);
    if (path19.length === 0) return ".";
    const hasRoot = path19.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i22 = path19.length - 1; i22 >= 1; --i22){
        if (path19.charCodeAt(i22) === 47) {
            if (!matchedSlash) {
                end = i22;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path19.slice(0, end);
}
function basename1(path20, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path20);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i23;
    if (ext !== undefined && ext.length > 0 && ext.length <= path20.length) {
        if (ext.length === path20.length && ext === path20) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i23 = path20.length - 1; i23 >= 0; --i23){
            const code = path20.charCodeAt(i23);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i23 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i23 + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i23;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path20.length;
        return path20.slice(start, end);
    } else {
        for(i23 = path20.length - 1; i23 >= 0; --i23){
            if (path20.charCodeAt(i23) === 47) {
                if (!matchedSlash) {
                    start = i23 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i23 + 1;
            }
        }
        if (end === -1) return "";
        return path20.slice(start, end);
    }
}
function extname1(path21) {
    assertPath(path21);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i24 = path21.length - 1; i24 >= 0; --i24){
        const code = path21.charCodeAt(i24);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i24 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i24 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i24;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path21.slice(startDot, end);
}
function format1(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
function parse1(path22) {
    assertPath(path22);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path22.length === 0) return ret;
    const isAbsolute2 = path22.charCodeAt(0) === 47;
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
    let i25 = path22.length - 1;
    let preDotState = 0;
    for(; i25 >= start; --i25){
        const code = path22.charCodeAt(i25);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i25 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i25 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i25;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute2) {
                ret.base = ret.name = path22.slice(1, end);
            } else {
                ret.base = ret.name = path22.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute2) {
            ret.name = path22.slice(1, startDot);
            ret.base = path22.slice(1, end);
        } else {
            ret.name = path22.slice(startPart, startDot);
            ret.base = path22.slice(startPart, end);
        }
        ret.ext = path22.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path22.slice(0, startPart - 1);
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
function common(paths, sep7 = SEP) {
    const [first = "", ...remaining] = paths;
    if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep7) + 1);
    }
    const parts = first.split(sep7);
    let endOfPrefix = parts.length;
    for (const path23 of remaining){
        const compare = path23.split(sep7);
        for(let i26 = 0; i26 < endOfPrefix; i26++){
            if (compare[i26] !== parts[i26]) {
                endOfPrefix = i26;
            }
        }
        if (endOfPrefix === 0) {
            return "";
        }
    }
    const prefix = parts.slice(0, endOfPrefix).join(sep7);
    return prefix.endsWith(sep7) ? prefix : `${prefix}${sep7}`;
}
const path50 = isWindows ? mod1 : mod2;
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
const { basename: basename2 , delimiter: delimiter2 , dirname: dirname2 , extname: extname2 , format: format2 , fromFileUrl: fromFileUrl2 , isAbsolute: isAbsolute2 , join: join2 , normalize: normalize2 , parse: parse2 , relative: relative2 , resolve: resolve2 , sep: sep2 , toNamespacedPath: toNamespacedPath2 ,  } = path50;
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
        const open2 = match[1];
        const close1 = open2 ? chars[open2] : null;
        if (open2 && close1) {
            const n = str.indexOf(close1, idx);
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
        const path24 = glob;
        if (path24.length > 0) {
            if (!joined) joined = path24;
            else joined += `${SEP}${path24}`;
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
    constructor(name2){
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._args = [];
        this.rawArgs = null;
        this._scriptPath = null;
        this._name = name2 || '';
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
    createCommand(name3) {
        return new Command(name3);
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
        this._args.forEach((arg, i27)=>{
            if (arg.variadic && i27 < this._args.length - 1) {
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
        const name4 = option.attributeName();
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
                defaultValue = this._findOption(positiveLongFlag) ? this._getOptionValue(name4) : true;
            }
            if (defaultValue !== undefined) {
                this._setOptionValue(name4, defaultValue);
                option.defaultValue = defaultValue;
            }
        }
        this.options.push(option);
        this.on('option:' + oname, (val)=>{
            if (val !== null && fn) {
                val = fn(val, this._getOptionValue(name4) === undefined ? defaultValue : this._getOptionValue(name4));
            }
            if (typeof this._getOptionValue(name4) === 'boolean' || typeof this._getOptionValue(name4) === 'undefined') {
                if (val == null) {
                    this._setOptionValue(name4, option.negate ? false : defaultValue || true);
                } else {
                    this._setOptionValue(name4, val);
                }
            } else if (val !== null) {
                this._setOptionValue(name4, option.negate ? false : val);
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
    parse(argv2, parseOptions) {
        if (argv2 !== undefined && !Array.isArray(argv2)) {
            throw new Error('first parameter to parse must be array or undefined');
        }
        parseOptions = parseOptions || {
        };
        parseOptions.from = parseOptions.from || 'deno';
        if (argv2 === undefined) {
            argv2 = process1.argv;
            if (process1.versions && process1.versions.electron) {
                parseOptions.from = 'electron';
            }
        }
        this.rawArgs = argv2.slice();
        let userArgs;
        switch(parseOptions.from){
            case undefined:
            case 'node':
                this._scriptPath = argv2[1];
                userArgs = argv2.slice(2);
                break;
            case 'electron':
                if (process1.defaultApp) {
                    this._scriptPath = argv2[1];
                    userArgs = argv2.slice(2);
                } else {
                    userArgs = argv2.slice(1);
                }
                break;
            case 'user':
            case 'deno':
                userArgs = argv2.slice(0);
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
    parseAsync(argv3, parseOptions) {
        this.parse(argv3, parseOptions);
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
                this._args.forEach((arg, i28)=>{
                    if (arg.required && args[i28] == null) {
                        this.missingArgument(arg.name);
                    } else if (arg.variadic) {
                        args[i28] = args.splice(i28);
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
    _findCommand(name5) {
        if (!name5) return undefined;
        return this.commands.find((cmd)=>cmd._name === name5 || cmd._aliases.includes(name5)
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
    parseOptions(argv4) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv4.slice();
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
            for(let i29 = 0; i29 < len; i29++){
                const key = this.options[i29].attributeName();
                result[key] = key === this._versionOptionName ? this._version : this[key];
            }
            return result;
        }
        return this._optionValues;
    }
    missingArgument(name6) {
        const message = `error: missing required argument '${name6}'`;
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
    return lines.map((line, i30)=>{
        if (line.slice(-1) === '\n') {
            line = line.slice(0, line.length - 1);
        }
        return (i30 > 0 && indent ? Array(indent + 1).join(' ') : '') + line.trimRight();
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
    for(let i31 = 0; i31 < str.length; i31++){
        let unicode = str.charCodeAt(i31).toString(16).toUpperCase();
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
async function list3(label1, options, listOptions) {
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
            return list3(...opts);
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
        for(let i32 = 0; i32 < 10; i32++){
            if (answer?.toLowerCase() === scripts[i32]?.toLowerCase()) script = answer.slice().toLowerCase();
            if (answer?.toLowerCase() === styles[i32]?.toLowerCase()) style1 = answer.slice().toLowerCase();
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
function assertPath1(path25) {
    if (typeof path25 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path25)}`);
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
function normalizeString1(path26, allowAboveRoot, separator, isPathSeparator11) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for(let i33 = 0, len = path26.length; i33 <= len; ++i33){
        if (i33 < len) code = path26.charCodeAt(i33);
        else if (isPathSeparator11(code)) break;
        else code = CHAR_FORWARD_SLASH1;
        if (isPathSeparator11(code)) {
            if (lastSlash === i33 - 1 || dots === 1) {
            } else if (lastSlash !== i33 - 1 && dots === 2) {
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
                        lastSlash = i33;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i33;
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
                if (res.length > 0) res += separator + path26.slice(lastSlash + 1, i33);
                else res = path26.slice(lastSlash + 1, i33);
                lastSegmentLength = i33 - lastSlash - 1;
            }
            lastSlash = i33;
            dots = 0;
        } else if (code === 46 && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep8, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base2 = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base2;
    if (dir === pathObject.root) return dir + base2;
    return dir + sep8 + base2;
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
    for(let i34 = pathSegments.length - 1; i34 >= -1; i34--){
        let path27;
        const { Deno  } = globalThis;
        if (i34 >= 0) {
            path27 = pathSegments[i34];
        } else if (!resolvedDevice) {
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path27 = Deno.cwd();
        } else {
            if (typeof Deno?.env?.get !== "function" || typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path27 = Deno.cwd();
            if (path27 === undefined || path27.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path27 = `${resolvedDevice}\\`;
            }
        }
        assertPath1(path27);
        const len = path27.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        let isAbsolute11 = false;
        const code = path27.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator1(code)) {
                isAbsolute11 = true;
                if (isPathSeparator1(path27.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator1(path27.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path27.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator1(path27.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator1(path27.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path27.slice(last)}`;
                                rootEnd = j;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path27.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                } else {
                    rootEnd = 1;
                }
            } else if (isWindowsDeviceRoot1(code)) {
                if (path27.charCodeAt(1) === 58) {
                    device = path27.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (isPathSeparator1(path27.charCodeAt(2))) {
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
            resolvedTail = `${path27.slice(rootEnd)}\\${resolvedTail}`;
            resolvedAbsolute = isAbsolute11;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString1(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator1);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize3(path28) {
    assertPath1(path28);
    const len = path28.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute21 = false;
    const code = path28.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            isAbsolute21 = true;
            if (isPathSeparator1(path28.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path28.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path28.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path28.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path28.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path28.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path28.slice(last, j)}`;
                            rootEnd = j;
                        }
                    }
                }
            } else {
                rootEnd = 1;
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path28.charCodeAt(1) === 58) {
                device = path28.slice(0, 2);
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path28.charCodeAt(2))) {
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
        tail = normalizeString1(path28.slice(rootEnd), !isAbsolute21, "\\", isPathSeparator1);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute21) tail = ".";
    if (tail.length > 0 && isPathSeparator1(path28.charCodeAt(len - 1))) {
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
function isAbsolute3(path29) {
    assertPath1(path29);
    const len = path29.length;
    if (len === 0) return false;
    const code = path29.charCodeAt(0);
    if (isPathSeparator1(code)) {
        return true;
    } else if (isWindowsDeviceRoot1(code)) {
        if (len > 2 && path29.charCodeAt(1) === 58) {
            if (isPathSeparator1(path29.charCodeAt(2))) return true;
        }
    }
    return false;
}
function join3(...paths) {
    const pathsCount = paths.length;
    if (pathsCount === 0) return ".";
    let joined;
    let firstPart = null;
    for(let i35 = 0; i35 < pathsCount; ++i35){
        const path30 = paths[i35];
        assertPath1(path30);
        if (path30.length > 0) {
            if (joined === undefined) joined = firstPart = path30;
            else joined += `\\${path30}`;
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
    let i36 = 0;
    for(; i36 <= length; ++i36){
        if (i36 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i36) === 92) {
                    return toOrig.slice(toStart + i36 + 1);
                } else if (i36 === 2) {
                    return toOrig.slice(toStart + i36);
                }
            }
            if (fromLen > length) {
                if (from.charCodeAt(fromStart + i36) === 92) {
                    lastCommonSep = i36;
                } else if (i36 === 2) {
                    lastCommonSep = 3;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i36);
        const toCode = to.charCodeAt(toStart + i36);
        if (fromCode !== toCode) break;
        else if (fromCode === 92) lastCommonSep = i36;
    }
    if (i36 !== length && lastCommonSep === -1) {
        return toOrig;
    }
    let out = "";
    if (lastCommonSep === -1) lastCommonSep = 0;
    for(i36 = fromStart + lastCommonSep + 1; i36 <= fromEnd; ++i36){
        if (i36 === fromEnd || from.charCodeAt(i36) === 92) {
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
function toNamespacedPath3(path31) {
    if (typeof path31 !== "string") return path31;
    if (path31.length === 0) return "";
    const resolvedPath = resolve3(path31);
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
    return path31;
}
function dirname3(path32) {
    assertPath1(path32);
    const len = path32.length;
    if (len === 0) return ".";
    let rootEnd = -1;
    let end = -1;
    let matchedSlash = true;
    let offset = 0;
    const code = path32.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = offset = 1;
            if (isPathSeparator1(path32.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path32.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path32.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path32.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return path32;
                        }
                        if (j !== last) {
                            rootEnd = offset = j + 1;
                        }
                    }
                }
            }
        } else if (isWindowsDeviceRoot1(code)) {
            if (path32.charCodeAt(1) === 58) {
                rootEnd = offset = 2;
                if (len > 2) {
                    if (isPathSeparator1(path32.charCodeAt(2))) rootEnd = offset = 3;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        return path32;
    }
    for(let i37 = len - 1; i37 >= offset; --i37){
        if (isPathSeparator1(path32.charCodeAt(i37))) {
            if (!matchedSlash) {
                end = i37;
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
    return path32.slice(0, end);
}
function basename3(path33, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path33);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i38;
    if (path33.length >= 2) {
        const drive = path33.charCodeAt(0);
        if (isWindowsDeviceRoot1(drive)) {
            if (path33.charCodeAt(1) === 58) start = 2;
        }
    }
    if (ext !== undefined && ext.length > 0 && ext.length <= path33.length) {
        if (ext.length === path33.length && ext === path33) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i38 = path33.length - 1; i38 >= start; --i38){
            const code = path33.charCodeAt(i38);
            if (isPathSeparator1(code)) {
                if (!matchedSlash) {
                    start = i38 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i38 + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i38;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path33.length;
        return path33.slice(start, end);
    } else {
        for(i38 = path33.length - 1; i38 >= start; --i38){
            if (isPathSeparator1(path33.charCodeAt(i38))) {
                if (!matchedSlash) {
                    start = i38 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i38 + 1;
            }
        }
        if (end === -1) return "";
        return path33.slice(start, end);
    }
}
function extname3(path34) {
    assertPath1(path34);
    let start = 0;
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    if (path34.length >= 2 && path34.charCodeAt(1) === 58 && isWindowsDeviceRoot1(path34.charCodeAt(0))) {
        start = startPart = 2;
    }
    for(let i39 = path34.length - 1; i39 >= start; --i39){
        const code = path34.charCodeAt(i39);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i39 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i39 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i39;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path34.slice(startDot, end);
}
function format3(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("\\", pathObject);
}
function parse3(path35) {
    assertPath1(path35);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    const len = path35.length;
    if (len === 0) return ret;
    let rootEnd = 0;
    let code = path35.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator1(code)) {
            rootEnd = 1;
            if (isPathSeparator1(path35.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator1(path35.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator1(path35.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator1(path35.charCodeAt(j))) break;
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
            if (path35.charCodeAt(1) === 58) {
                rootEnd = 2;
                if (len > 2) {
                    if (isPathSeparator1(path35.charCodeAt(2))) {
                        if (len === 3) {
                            ret.root = ret.dir = path35;
                            return ret;
                        }
                        rootEnd = 3;
                    }
                } else {
                    ret.root = ret.dir = path35;
                    return ret;
                }
            }
        }
    } else if (isPathSeparator1(code)) {
        ret.root = ret.dir = path35;
        return ret;
    }
    if (rootEnd > 0) ret.root = path35.slice(0, rootEnd);
    let startDot = -1;
    let startPart = rootEnd;
    let end = -1;
    let matchedSlash = true;
    let i40 = path35.length - 1;
    let preDotState = 0;
    for(; i40 >= rootEnd; --i40){
        code = path35.charCodeAt(i40);
        if (isPathSeparator1(code)) {
            if (!matchedSlash) {
                startPart = i40 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i40 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i40;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            ret.base = ret.name = path35.slice(startPart, end);
        }
    } else {
        ret.name = path35.slice(startPart, startDot);
        ret.base = path35.slice(startPart, end);
        ret.ext = path35.slice(startDot, end);
    }
    if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path35.slice(0, startPart - 1);
    } else ret.dir = ret.root;
    return ret;
}
function fromFileUrl3(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    let path36 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
    if (url.hostname != "") {
        path36 = `\\\\${url.hostname}${path36}`;
    }
    return path36;
}
function toFileUrl(path37) {
    if (!isAbsolute3(path37)) {
        throw new TypeError("Must be an absolute path.");
    }
    const [, hostname, pathname] = path37.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
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
    for(let i41 = pathSegments.length - 1; i41 >= -1 && !resolvedAbsolute; i41--){
        let path38;
        if (i41 >= 0) path38 = pathSegments[i41];
        else {
            const { Deno  } = globalThis;
            if (typeof Deno?.cwd !== "function") {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path38 = Deno.cwd();
        }
        assertPath1(path38);
        if (path38.length === 0) {
            continue;
        }
        resolvedPath = `${path38}/${resolvedPath}`;
        resolvedAbsolute = path38.charCodeAt(0) === CHAR_FORWARD_SLASH1;
    }
    resolvedPath = normalizeString1(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator1);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0) return `/${resolvedPath}`;
        else return "/";
    } else if (resolvedPath.length > 0) return resolvedPath;
    else return ".";
}
function normalize4(path39) {
    assertPath1(path39);
    if (path39.length === 0) return ".";
    const isAbsolute12 = path39.charCodeAt(0) === 47;
    const trailingSeparator = path39.charCodeAt(path39.length - 1) === 47;
    path39 = normalizeString1(path39, !isAbsolute12, "/", isPosixPathSeparator1);
    if (path39.length === 0 && !isAbsolute12) path39 = ".";
    if (path39.length > 0 && trailingSeparator) path39 += "/";
    if (isAbsolute12) return `/${path39}`;
    return path39;
}
function isAbsolute4(path40) {
    assertPath1(path40);
    return path40.length > 0 && path40.charCodeAt(0) === 47;
}
function join4(...paths) {
    if (paths.length === 0) return ".";
    let joined;
    for(let i42 = 0, len = paths.length; i42 < len; ++i42){
        const path41 = paths[i42];
        assertPath1(path41);
        if (path41.length > 0) {
            if (!joined) joined = path41;
            else joined += `/${path41}`;
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
    let i43 = 0;
    for(; i43 <= length; ++i43){
        if (i43 === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i43) === 47) {
                    return to.slice(toStart + i43 + 1);
                } else if (i43 === 0) {
                    return to.slice(toStart + i43);
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i43) === 47) {
                    lastCommonSep = i43;
                } else if (i43 === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i43);
        const toCode = to.charCodeAt(toStart + i43);
        if (fromCode !== toCode) break;
        else if (fromCode === 47) lastCommonSep = i43;
    }
    let out = "";
    for(i43 = fromStart + lastCommonSep + 1; i43 <= fromEnd; ++i43){
        if (i43 === fromEnd || from.charCodeAt(i43) === 47) {
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
function toNamespacedPath4(path42) {
    return path42;
}
function dirname4(path43) {
    assertPath1(path43);
    if (path43.length === 0) return ".";
    const hasRoot = path43.charCodeAt(0) === 47;
    let end = -1;
    let matchedSlash = true;
    for(let i44 = path43.length - 1; i44 >= 1; --i44){
        if (path43.charCodeAt(i44) === 47) {
            if (!matchedSlash) {
                end = i44;
                break;
            }
        } else {
            matchedSlash = false;
        }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path43.slice(0, end);
}
function basename4(path44, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath1(path44);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i45;
    if (ext !== undefined && ext.length > 0 && ext.length <= path44.length) {
        if (ext.length === path44.length && ext === path44) return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for(i45 = path44.length - 1; i45 >= 0; --i45){
            const code = path44.charCodeAt(i45);
            if (code === 47) {
                if (!matchedSlash) {
                    start = i45 + 1;
                    break;
                }
            } else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i45 + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i45;
                        }
                    } else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path44.length;
        return path44.slice(start, end);
    } else {
        for(i45 = path44.length - 1; i45 >= 0; --i45){
            if (path44.charCodeAt(i45) === 47) {
                if (!matchedSlash) {
                    start = i45 + 1;
                    break;
                }
            } else if (end === -1) {
                matchedSlash = false;
                end = i45 + 1;
            }
        }
        if (end === -1) return "";
        return path44.slice(start, end);
    }
}
function extname4(path45) {
    assertPath1(path45);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for(let i46 = path45.length - 1; i46 >= 0; --i46){
        const code = path45.charCodeAt(i46);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i46 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i46 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i46;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
    }
    return path45.slice(startDot, end);
}
function format4(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format1("/", pathObject);
}
function parse4(path46) {
    assertPath1(path46);
    const ret = {
        root: "",
        dir: "",
        base: "",
        ext: "",
        name: ""
    };
    if (path46.length === 0) return ret;
    const isAbsolute22 = path46.charCodeAt(0) === 47;
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
    let i47 = path46.length - 1;
    let preDotState = 0;
    for(; i47 >= start; --i47){
        const code = path46.charCodeAt(i47);
        if (code === 47) {
            if (!matchedSlash) {
                startPart = i47 + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i47 + 1;
        }
        if (code === 46) {
            if (startDot === -1) startDot = i47;
            else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute22) {
                ret.base = ret.name = path46.slice(1, end);
            } else {
                ret.base = ret.name = path46.slice(startPart, end);
            }
        }
    } else {
        if (startPart === 0 && isAbsolute22) {
            ret.name = path46.slice(1, startDot);
            ret.base = path46.slice(1, end);
        } else {
            ret.name = path46.slice(startPart, startDot);
            ret.base = path46.slice(startPart, end);
        }
        ret.ext = path46.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path46.slice(0, startPart - 1);
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
function toFileUrl1(path47) {
    if (!isAbsolute4(path47)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = encodeWhitespace(path47.replace(/%/g, "%25").replace(/\\/g, "%5C"));
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
const SEP2 = isWindows1 ? "\\" : "/";
const SEP_PATTERN1 = isWindows1 ? /[\\/]+/ : /\/+/;
function common1(paths, sep9 = SEP2) {
    const [first = "", ...remaining] = paths;
    if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep9) + 1);
    }
    const parts = first.split(sep9);
    let endOfPrefix = parts.length;
    for (const path48 of remaining){
        const compare = path48.split(sep9);
        for(let i48 = 0; i48 < endOfPrefix; i48++){
            if (compare[i48] !== parts[i48]) {
                endOfPrefix = i48;
            }
        }
        if (endOfPrefix === 0) {
            return "";
        }
    }
    const prefix = parts.slice(0, endOfPrefix).join(sep9);
    return prefix.endsWith(sep9) ? prefix : `${prefix}${sep9}`;
}
const path1 = isWindows1 ? mod4 : mod5;
const { join: join5 , normalize: normalize5  } = path1;
const regExpEscapeChars = [
    "!",
    "$",
    "(",
    ")",
    "*",
    "+",
    ".",
    "=",
    "?",
    "[",
    "\\",
    "^",
    "{",
    "|", 
];
const rangeEscapeChars = [
    "-",
    "\\",
    "]"
];
function globToRegExp1(glob, { extended =true , globstar: globstarOption = true , os: os1 = osType , caseInsensitive =false  } = {
}) {
    if (glob == "") {
        return /(?!)/;
    }
    const sep10 = os1 == "windows" ? "(?:\\\\|/)+" : "/+";
    const sepMaybe = os1 == "windows" ? "(?:\\\\|/)*" : "/*";
    const seps = os1 == "windows" ? [
        "\\",
        "/"
    ] : [
        "/"
    ];
    const globstar = os1 == "windows" ? "(?:[^\\\\/]*(?:\\\\|/|$)+)*" : "(?:[^/]*(?:/|$)+)*";
    const wildcard = os1 == "windows" ? "[^\\\\/]*" : "[^/]*";
    const escapePrefix = os1 == "windows" ? "`" : "\\";
    let newLength = glob.length;
    for(; newLength > 1 && seps.includes(glob[newLength - 1]); newLength--);
    glob = glob.slice(0, newLength);
    let regExpString = "";
    for(let j = 0; j < glob.length;){
        let segment = "";
        const groupStack = [];
        let inRange = false;
        let inEscape = false;
        let endsWithSep = false;
        let i49 = j;
        for(; i49 < glob.length && !seps.includes(glob[i49]); i49++){
            if (inEscape) {
                inEscape = false;
                const escapeChars = inRange ? rangeEscapeChars : regExpEscapeChars;
                segment += escapeChars.includes(glob[i49]) ? `\\${glob[i49]}` : glob[i49];
                continue;
            }
            if (glob[i49] == escapePrefix) {
                inEscape = true;
                continue;
            }
            if (glob[i49] == "[") {
                if (!inRange) {
                    inRange = true;
                    segment += "[";
                    if (glob[i49 + 1] == "!") {
                        i49++;
                        segment += "^";
                    } else if (glob[i49 + 1] == "^") {
                        i49++;
                        segment += "\\^";
                    }
                    continue;
                } else if (glob[i49 + 1] == ":") {
                    let k = i49 + 1;
                    let value = "";
                    while(glob[k + 1] != null && glob[k + 1] != ":"){
                        value += glob[k + 1];
                        k++;
                    }
                    if (glob[k + 1] == ":" && glob[k + 2] == "]") {
                        i49 = k + 2;
                        if (value == "alnum") segment += "\\dA-Za-z";
                        else if (value == "alpha") segment += "A-Za-z";
                        else if (value == "ascii") segment += "\x00-\x7F";
                        else if (value == "blank") segment += "\t ";
                        else if (value == "cntrl") segment += "\x00-\x1F\x7F";
                        else if (value == "digit") segment += "\\d";
                        else if (value == "graph") segment += "\x21-\x7E";
                        else if (value == "lower") segment += "a-z";
                        else if (value == "print") segment += "\x20-\x7E";
                        else if (value == "punct") {
                            segment += "!\"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_‘{|}~";
                        } else if (value == "space") segment += "\\s\v";
                        else if (value == "upper") segment += "A-Z";
                        else if (value == "word") segment += "\\w";
                        else if (value == "xdigit") segment += "\\dA-Fa-f";
                        continue;
                    }
                }
            }
            if (glob[i49] == "]" && inRange) {
                inRange = false;
                segment += "]";
                continue;
            }
            if (inRange) {
                if (glob[i49] == "\\") {
                    segment += `\\\\`;
                } else {
                    segment += glob[i49];
                }
                continue;
            }
            if (glob[i49] == ")" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += ")";
                const type = groupStack.pop();
                if (type == "!") {
                    segment += wildcard;
                } else if (type != "@") {
                    segment += type;
                }
                continue;
            }
            if (glob[i49] == "|" && groupStack.length > 0 && groupStack[groupStack.length - 1] != "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i49] == "+" && extended && glob[i49 + 1] == "(") {
                i49++;
                groupStack.push("+");
                segment += "(?:";
                continue;
            }
            if (glob[i49] == "@" && extended && glob[i49 + 1] == "(") {
                i49++;
                groupStack.push("@");
                segment += "(?:";
                continue;
            }
            if (glob[i49] == "?") {
                if (extended && glob[i49 + 1] == "(") {
                    i49++;
                    groupStack.push("?");
                    segment += "(?:";
                } else {
                    segment += ".";
                }
                continue;
            }
            if (glob[i49] == "!" && extended && glob[i49 + 1] == "(") {
                i49++;
                groupStack.push("!");
                segment += "(?!";
                continue;
            }
            if (glob[i49] == "{") {
                groupStack.push("BRACE");
                segment += "(?:";
                continue;
            }
            if (glob[i49] == "}" && groupStack[groupStack.length - 1] == "BRACE") {
                groupStack.pop();
                segment += ")";
                continue;
            }
            if (glob[i49] == "," && groupStack[groupStack.length - 1] == "BRACE") {
                segment += "|";
                continue;
            }
            if (glob[i49] == "*") {
                if (extended && glob[i49 + 1] == "(") {
                    i49++;
                    groupStack.push("*");
                    segment += "(?:";
                } else {
                    const prevChar = glob[i49 - 1];
                    let numStars = 1;
                    while(glob[i49 + 1] == "*"){
                        i49++;
                        numStars++;
                    }
                    const nextChar = glob[i49 + 1];
                    if (globstarOption && numStars == 2 && [
                        ...seps,
                        undefined
                    ].includes(prevChar) && [
                        ...seps,
                        undefined
                    ].includes(nextChar)) {
                        segment += globstar;
                        endsWithSep = true;
                    } else {
                        segment += wildcard;
                    }
                }
                continue;
            }
            segment += regExpEscapeChars.includes(glob[i49]) ? `\\${glob[i49]}` : glob[i49];
        }
        if (groupStack.length > 0 || inRange || inEscape) {
            segment = "";
            for (const c of glob.slice(j, i49)){
                segment += regExpEscapeChars.includes(c) ? `\\${c}` : c;
                endsWithSep = false;
            }
        }
        regExpString += segment;
        if (!endsWithSep) {
            regExpString += i49 < glob.length ? sep10 : sepMaybe;
            endsWithSep = true;
        }
        while(seps.includes(glob[i49]))i49++;
        if (!(i49 > j)) {
            throw new Error("Assertion failure: i > j (potential infinite loop)");
        }
        j = i49;
    }
    regExpString = `^${regExpString}$`;
    return new RegExp(regExpString, caseInsensitive ? "i" : "");
}
function isGlob1(str) {
    const chars = {
        "{": "}",
        "(": ")",
        "[": "]"
    };
    const regex = /\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str === "") {
        return false;
    }
    let match;
    while(match = regex.exec(str)){
        if (match[2]) return true;
        let idx = match.index + match[0].length;
        const open3 = match[1];
        const close2 = open3 ? chars[open3] : null;
        if (open3 && close2) {
            const n = str.indexOf(close2, idx);
            if (n !== -1) {
                idx = n + 1;
            }
        }
        str = str.slice(idx);
    }
    return false;
}
function normalizeGlob1(glob, { globstar =false  } = {
}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize5(glob);
    }
    const s = SEP_PATTERN1.source;
    const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
    return normalize5(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
function joinGlobs1(globs, { extended =false , globstar =false  } = {
}) {
    if (!globstar || globs.length == 0) {
        return join5(...globs);
    }
    if (globs.length === 0) return ".";
    let joined;
    for (const glob of globs){
        const path110 = glob;
        if (path110.length > 0) {
            if (!joined) joined = path110;
            else joined += `${SEP2}${path110}`;
        }
    }
    if (!joined) return ".";
    return normalizeGlob1(joined, {
        extended,
        globstar
    });
}
const path2 = isWindows1 ? mod4 : mod5;
const { basename: basename5 , delimiter: delimiter5 , dirname: dirname5 , extname: extname5 , format: format5 , fromFileUrl: fromFileUrl5 , isAbsolute: isAbsolute5 , join: join6 , normalize: normalize6 , parse: parse5 , relative: relative5 , resolve: resolve5 , sep: sep5 , toFileUrl: toFileUrl2 , toNamespacedPath: toNamespacedPath5 ,  } = path2;
const mod6 = {
    SEP: SEP2,
    SEP_PATTERN: SEP_PATTERN1,
    win32: mod4,
    posix: mod5,
    basename: basename5,
    delimiter: delimiter5,
    dirname: dirname5,
    extname: extname5,
    format: format5,
    fromFileUrl: fromFileUrl5,
    isAbsolute: isAbsolute5,
    join: join6,
    normalize: normalize6,
    parse: parse5,
    relative: relative5,
    resolve: resolve5,
    sep: sep5,
    toFileUrl: toFileUrl2,
    toNamespacedPath: toNamespacedPath5,
    common: common1,
    globToRegExp: globToRegExp1,
    isGlob: isGlob1,
    normalizeGlob: normalizeGlob1,
    joinGlobs: joinGlobs1
};
const _toString = Object.prototype.toString;
const _isObjectLike = (value)=>value !== null && typeof value === "object"
;
const _isFunctionLike = (value)=>value !== null && typeof value === "function"
;
function isAnyArrayBuffer(value) {
    return _isObjectLike(value) && (_toString.call(value) === "[object ArrayBuffer]" || _toString.call(value) === "[object SharedArrayBuffer]");
}
function isArgumentsObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Arguments]";
}
function isArrayBuffer(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object ArrayBuffer]";
}
function isAsyncFunction(value) {
    return _isFunctionLike(value) && _toString.call(value) === "[object AsyncFunction]";
}
function isBooleanObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Boolean]";
}
function isBoxedPrimitive(value) {
    return isBooleanObject(value) || isStringObject(value) || isNumberObject(value) || isSymbolObject(value) || isBigIntObject(value);
}
function isDataView(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object DataView]";
}
function isDate(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Date]";
}
function isGeneratorFunction(value) {
    return _isFunctionLike(value) && _toString.call(value) === "[object GeneratorFunction]";
}
function isGeneratorObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Generator]";
}
function isMap(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Map]";
}
function isMapIterator(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Map Iterator]";
}
function isModuleNamespaceObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Module]";
}
function isNativeError(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Error]";
}
function isNumberObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Number]";
}
function isBigIntObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object BigInt]";
}
function isPromise(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Promise]";
}
function isRegExp(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object RegExp]";
}
function isSet(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Set]";
}
function isSetIterator(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Set Iterator]";
}
function isSharedArrayBuffer(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object SharedArrayBuffer]";
}
function isStringObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object String]";
}
function isSymbolObject(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object Symbol]";
}
function isWeakMap(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object WeakMap]";
}
function isWeakSet(value) {
    return _isObjectLike(value) && _toString.call(value) === "[object WeakSet]";
}
const __default = {
    isAsyncFunction,
    isGeneratorFunction,
    isAnyArrayBuffer,
    isArrayBuffer,
    isArgumentsObject,
    isBoxedPrimitive,
    isDataView,
    isMap,
    isMapIterator,
    isModuleNamespaceObject,
    isNativeError,
    isPromise,
    isSet,
    isSetIterator,
    isWeakMap,
    isWeakSet,
    isRegExp,
    isDate,
    isStringObject,
    isNumberObject,
    isBooleanObject,
    isBigIntObject
};
const mod7 = {
    isAnyArrayBuffer: isAnyArrayBuffer,
    isArgumentsObject: isArgumentsObject,
    isArrayBuffer: isArrayBuffer,
    isAsyncFunction: isAsyncFunction,
    isBooleanObject: isBooleanObject,
    isBoxedPrimitive: isBoxedPrimitive,
    isDataView: isDataView,
    isDate: isDate,
    isGeneratorFunction: isGeneratorFunction,
    isGeneratorObject: isGeneratorObject,
    isMap: isMap,
    isMapIterator: isMapIterator,
    isModuleNamespaceObject: isModuleNamespaceObject,
    isNativeError: isNativeError,
    isNumberObject: isNumberObject,
    isBigIntObject: isBigIntObject,
    isPromise: isPromise,
    isRegExp: isRegExp,
    isSet: isSet,
    isSetIterator: isSetIterator,
    isSharedArrayBuffer: isSharedArrayBuffer,
    isStringObject: isStringObject,
    isSymbolObject: isSymbolObject,
    isWeakMap: isWeakMap,
    isWeakSet: isWeakSet,
    default: __default
};
const _toString1 = Object.prototype.toString;
const _isObjectLike1 = (value)=>value !== null && typeof value === "object"
;
function isArrayBufferView(value) {
    return ArrayBuffer.isView(value);
}
function isBigUint64Array(value) {
    return _isObjectLike1(value) && _toString1.call(value) === "[object BigUint64Array]";
}
function isFloat32Array(value) {
    return _isObjectLike1(value) && _toString1.call(value) === "[object Float32Array]";
}
function isFloat64Array(value) {
    return _isObjectLike1(value) && _toString1.call(value) === "[object Float64Array]";
}
function isTypedArray(value) {
    const reTypedTag = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;
    return _isObjectLike1(value) && reTypedTag.test(_toString1.call(value));
}
function isUint8Array(value) {
    return _isObjectLike1(value) && _toString1.call(value) === "[object Uint8Array]";
}
const { isDate: isDate1 , isArgumentsObject: isArgumentsObject1 , isBigIntObject: isBigIntObject1 , isBooleanObject: isBooleanObject1 , isNumberObject: isNumberObject1 , isStringObject: isStringObject1 , isSymbolObject: isSymbolObject1 , isNativeError: isNativeError1 , isRegExp: isRegExp1 , isAsyncFunction: isAsyncFunction1 , isGeneratorFunction: isGeneratorFunction1 , isGeneratorObject: isGeneratorObject1 , isPromise: isPromise1 , isMap: isMap1 , isSet: isSet1 , isMapIterator: isMapIterator1 , isSetIterator: isSetIterator1 , isWeakMap: isWeakMap1 , isWeakSet: isWeakSet1 , isArrayBuffer: isArrayBuffer1 , isDataView: isDataView1 , isSharedArrayBuffer: isSharedArrayBuffer1 , isModuleNamespaceObject: isModuleNamespaceObject1 , isAnyArrayBuffer: isAnyArrayBuffer1 , isBoxedPrimitive: isBoxedPrimitive1  } = mod7;
function delay(ms, options = {
}) {
    const { signal  } = options;
    if (signal?.aborted) {
        return Promise.reject(new DOMException("Delay was aborted.", "AbortError"));
    }
    return new Promise((resolve7, reject)=>{
        const abort = ()=>{
            clearTimeout(i50);
            reject(new DOMException("Delay was aborted.", "AbortError"));
        };
        const done = ()=>{
            signal?.removeEventListener("abort", abort);
            resolve7();
        };
        const i50 = setTimeout(done, ms);
        signal?.addEventListener("abort", abort, {
            once: true
        });
    });
}
const { Deno: Deno1  } = globalThis;
typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
var DiffType;
(function(DiffType1) {
    DiffType1["removed"] = "removed";
    DiffType1["common"] = "common";
    DiffType1["added"] = "added";
})(DiffType || (DiffType = {
}));
class AssertionError extends Error {
    name = "AssertionError";
    constructor(message){
        super(message);
    }
}
function assert2(expr, msg = "") {
    if (!expr) {
        throw new AssertionError(msg);
    }
}
function unreachable() {
    throw new AssertionError("unreachable");
}
function indexOf(source, pattern, fromIndex = 0) {
    if (fromIndex >= source.length) {
        return -1;
    }
    if (fromIndex < 0) {
        fromIndex = Math.max(0, source.length + fromIndex);
    }
    const s = pattern[0];
    for(let i51 = fromIndex; i51 < source.length; i51++){
        if (source[i51] !== s) continue;
        const pin = i51;
        let matched = 1;
        let j = i51;
        while(matched < pattern.length){
            j++;
            if (source[j] !== pattern[j - pin]) {
                break;
            }
            matched++;
        }
        if (matched === pattern.length) {
            return pin;
        }
    }
    return -1;
}
function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
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
        for(let i52 = 100; i52 > 0; i52--){
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
            let i53 = this.#buf.subarray(this.#r + s, this.#w).indexOf(delim);
            if (i53 >= 0) {
                i53 += s;
                slice = this.#buf.subarray(this.#r, this.#r + i53 + 1);
                this.#r += i53 + 1;
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
async function writeAll(w, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += await w.write(arr.subarray(nwritten));
    }
}
function writeAllSync(w, arr) {
    let nwritten = 0;
    while(nwritten < arr.length){
        nwritten += w.writeSync(arr.subarray(nwritten));
    }
}
function notImplemented1(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    throw new Error(message);
}
function warnNotImplemented(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    console.warn(message);
}
function intoCallbackAPIWithIntercept(func, interceptor, cb, ...args) {
    func(...args).then((value)=>cb && cb(null, interceptor(value))
    , (err)=>cb && cb(err)
    );
}
function spliceOne(list2, index) {
    for(; index + 1 < list2.length; index++)list2[index] = list2[index + 1];
    list2.pop();
}
function normalizeEncoding1(enc) {
    if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
    return slowCases1(enc);
}
function slowCases1(enc) {
    switch(enc.length){
        case 4:
            if (enc === "UTF8") return "utf8";
            if (enc === "ucs2" || enc === "UCS2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf8") return "utf8";
            if (enc === "ucs2") return "utf16le";
            break;
        case 3:
            if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
                return "hex";
            }
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
            if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
                return "utf16le";
            }
            break;
        case 8:
            if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
                return "utf16le";
            }
            break;
        default:
            if (enc === "") return "utf8";
    }
}
function guessHandleType(_fd) {
    notImplemented1();
}
const isNumericLookup = {
};
function isArrayIndex(value) {
    switch(typeof value){
        case "number":
            return value >= 0 && (value | 0) === value;
        case "string":
            {
                const result = isNumericLookup[value];
                if (result !== void 0) {
                    return result;
                }
                const length = value.length;
                if (length === 0) {
                    return isNumericLookup[value] = false;
                }
                let ch = 0;
                let i54 = 0;
                for(; i54 < length; ++i54){
                    ch = value.charCodeAt(i54);
                    if (i54 === 0 && ch === 48 && length > 1 || ch < 48 || ch > 57) {
                        return isNumericLookup[value] = false;
                    }
                }
                return isNumericLookup[value] = true;
            }
        default:
            return false;
    }
}
function getOwnNonIndexProperties(obj, filter) {
    let allProperties = [
        ...Object.getOwnPropertyNames(obj),
        ...Object.getOwnPropertySymbols(obj), 
    ];
    if (Array.isArray(obj)) {
        allProperties = allProperties.filter((k)=>!isArrayIndex(k)
        );
    }
    if (filter === 0) {
        return allProperties;
    }
    const result = [];
    for (const key of allProperties){
        const desc = Object.getOwnPropertyDescriptor(obj, key);
        if (desc === undefined) {
            continue;
        }
        if (filter & 1 && !desc.writable) {
            continue;
        }
        if (filter & 2 && !desc.enumerable) {
            continue;
        }
        if (filter & 4 && !desc.configurable) {
            continue;
        }
        if (filter & 8 && typeof key === "string") {
            continue;
        }
        if (filter & 16 && typeof key === "symbol") {
            continue;
        }
        result.push(key);
    }
    return result;
}
const mod8 = function() {
    return {
        guessHandleType: guessHandleType,
        ALL_PROPERTIES: 0,
        ONLY_WRITABLE: 1,
        ONLY_ENUMERABLE: 2,
        ONLY_CONFIGURABLE: 4,
        ONLY_ENUM_WRITABLE: 6,
        SKIP_STRINGS: 8,
        SKIP_SYMBOLS: 16,
        isArrayIndex: isArrayIndex,
        getOwnNonIndexProperties: getOwnNonIndexProperties
    };
}();
var Encodings;
(function(Encodings1) {
    Encodings1[Encodings1["ASCII"] = 0] = "ASCII";
    Encodings1[Encodings1["UTF8"] = 1] = "UTF8";
    Encodings1[Encodings1["BASE64"] = 2] = "BASE64";
    Encodings1[Encodings1["UCS2"] = 3] = "UCS2";
    Encodings1[Encodings1["BINARY"] = 4] = "BINARY";
    Encodings1[Encodings1["HEX"] = 5] = "HEX";
    Encodings1[Encodings1["BUFFER"] = 6] = "BUFFER";
    Encodings1[Encodings1["BASE64URL"] = 7] = "BASE64URL";
    Encodings1[Encodings1["LATIN1"] = 4] = "LATIN1";
})(Encodings || (Encodings = {
}));
const encodings = [];
encodings[Encodings.ASCII] = "ascii";
encodings[Encodings.BASE64] = "base64";
encodings[Encodings.BASE64URL] = "base64url";
encodings[Encodings.BUFFER] = "buffer";
encodings[Encodings.HEX] = "hex";
encodings[Encodings.LATIN1] = "latin1";
encodings[Encodings.UCS2] = "utf16le";
encodings[Encodings.UTF8] = "utf8";
const __default1 = {
    encodings
};
const mod9 = {
    encodings: encodings,
    default: __default1
};
function numberToBytes(n) {
    if (n === 0) return new Uint8Array([
        0
    ]);
    const bytes = [];
    bytes.unshift(n & 255);
    while(n >= 256){
        n = n >>> 8;
        bytes.unshift(n & 255);
    }
    return new Uint8Array(bytes);
}
function findLastIndex(targetBuffer, buffer, offset) {
    offset = offset > targetBuffer.length ? targetBuffer.length : offset;
    const searchableBuffer = targetBuffer.slice(0, offset + buffer.length);
    const searchableBufferLastIndex = searchableBuffer.length - 1;
    const bufferLastIndex = buffer.length - 1;
    let lastMatchIndex = -1;
    let matches = 0;
    let index = -1;
    for(let x = 0; x <= searchableBufferLastIndex; x++){
        if (searchableBuffer[searchableBufferLastIndex - x] === buffer[bufferLastIndex - matches]) {
            if (lastMatchIndex === -1) {
                lastMatchIndex = x;
            }
            matches++;
        } else {
            matches = 0;
            if (lastMatchIndex !== -1) {
                x = lastMatchIndex + 1;
                lastMatchIndex = -1;
            }
            continue;
        }
        if (matches === buffer.length) {
            index = x;
            break;
        }
    }
    if (index === -1) return index;
    return searchableBufferLastIndex - index;
}
function indexOfBuffer(targetBuffer, buffer, byteOffset, encoding, forwardDirection) {
    if (!Encodings[encoding] === undefined) {
        throw new Error(`Unknown encoding code ${encoding}`);
    }
    if (!forwardDirection) {
        if (byteOffset < 0) {
            byteOffset = targetBuffer.length + byteOffset;
        }
        if (buffer.length === 0) {
            return byteOffset <= targetBuffer.length ? byteOffset : targetBuffer.length;
        }
        return findLastIndex(targetBuffer, buffer, byteOffset);
    }
    if (buffer.length === 0) {
        return byteOffset <= targetBuffer.length ? byteOffset : targetBuffer.length;
    }
    return indexOf(targetBuffer, buffer, byteOffset);
}
function indexOfNumber(targetBuffer, number, byteOffset, forwardDirection) {
    const bytes = numberToBytes(number);
    if (bytes.length > 1) {
        throw new Error("Multi byte number search is not supported");
    }
    return indexOfBuffer(targetBuffer, numberToBytes(number), byteOffset, Encodings.UTF8, forwardDirection);
}
const __default2 = {
    indexOfBuffer,
    indexOfNumber
};
const mod10 = {
    indexOfBuffer: indexOfBuffer,
    indexOfNumber: indexOfNumber,
    numberToBytes: numberToBytes,
    default: __default2
};
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/", 
];
function encode3(data) {
    const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    let result = "", i55;
    const l = uint8.length;
    for(i55 = 2; i55 < l; i55 += 3){
        result += base64abc[uint8[i55 - 2] >> 2];
        result += base64abc[(uint8[i55 - 2] & 3) << 4 | uint8[i55 - 1] >> 4];
        result += base64abc[(uint8[i55 - 1] & 15) << 2 | uint8[i55] >> 6];
        result += base64abc[uint8[i55] & 63];
    }
    if (i55 === l + 1) {
        result += base64abc[uint8[i55 - 2] >> 2];
        result += base64abc[(uint8[i55 - 2] & 3) << 4];
        result += "==";
    }
    if (i55 === l) {
        result += base64abc[uint8[i55 - 2] >> 2];
        result += base64abc[(uint8[i55 - 2] & 3) << 4 | uint8[i55 - 1] >> 4];
        result += base64abc[(uint8[i55 - 1] & 15) << 2];
        result += "=";
    }
    return result;
}
function decode3(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i56 = 0; i56 < size; i56++){
        bytes[i56] = binString.charCodeAt(i56);
    }
    return bytes;
}
function addPaddingToBase64url(base64url) {
    if (base64url.length % 4 === 2) return base64url + "==";
    if (base64url.length % 4 === 3) return base64url + "=";
    if (base64url.length % 4 === 1) {
        throw new TypeError("Illegal base64url string!");
    }
    return base64url;
}
function convertBase64urlToBase64(b64url) {
    if (!/^[-_A-Z0-9]*?={0,2}$/i.test(b64url)) {
        throw new TypeError("Failed to decode base64url: invalid character");
    }
    return addPaddingToBase64url(b64url).replace(/\-/g, "+").replace(/_/g, "/");
}
function convertBase64ToBase64url(b64) {
    return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function encode4(data) {
    return convertBase64ToBase64url(encode3(data));
}
function decode4(b64url) {
    return decode3(convertBase64urlToBase64(b64url));
}
function asciiToBytes(str) {
    const byteArray = [];
    for(let i57 = 0; i57 < str.length; ++i57){
        byteArray.push(str.charCodeAt(i57) & 255);
    }
    return new Uint8Array(byteArray);
}
function base64ToBytes(str) {
    return decode3(str);
}
function base64UrlToBytes(str) {
    return decode4(str);
}
function hexToBytes(str) {
    const byteArray = new Uint8Array(Math.floor((str || "").length / 2));
    let i58;
    for(i58 = 0; i58 < byteArray.length; i58++){
        const a = Number.parseInt(str[i58 * 2], 16);
        const b = Number.parseInt(str[i58 * 2 + 1], 16);
        if (Number.isNaN(a) && Number.isNaN(b)) {
            break;
        }
        byteArray[i58] = a << 4 | b;
    }
    return new Uint8Array(i58 === byteArray.length ? byteArray : byteArray.slice(0, i58));
}
function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for(let i59 = 0; i59 < str.length; ++i59){
        if ((units -= 2) < 0) {
            break;
        }
        c = str.charCodeAt(i59);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return new Uint8Array(byteArray);
}
function bytesToAscii(bytes) {
    let ret = "";
    for(let i60 = 0; i60 < bytes.length; ++i60){
        ret += String.fromCharCode(bytes[i60] & 127);
    }
    return ret;
}
function bytesToUtf16le(bytes) {
    let res = "";
    for(let i61 = 0; i61 < bytes.length - 1; i61 += 2){
        res += String.fromCharCode(bytes[i61] + bytes[i61 + 1] * 256);
    }
    return res;
}
const __default3 = {
    ...mod6
};
"use strict";
const base = 36;
const damp = 700;
const delimiter6 = "-";
const regexNonASCII = /[^\0-\x7E]/;
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
const errors = {
    "overflow": "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input"
};
const baseMinusTMin = 36 - 1;
function _error(type) {
    throw new RangeError(errors[type]);
}
function _mapDomain(str, fn) {
    const parts = str.split("@");
    let result = "";
    if (parts.length > 1) {
        result = parts[0] + "@";
        str = parts[1];
    }
    str = str.replace(regexSeparators, "\x2E");
    const labels = str.split(".");
    const encoded = labels.map(fn).join(".");
    return result + encoded;
}
function _ucs2decode(str) {
    const output = [];
    let counter = 0;
    const length = str.length;
    while(counter < length){
        const value = str.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
            const extra = str.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}
function _digitToBasic(digit, flag) {
    return digit + 22 + 75 * Number(digit < 26) - (Number(flag != 0) << 5);
}
function _adapt(delta, numPoints, firstTime) {
    let k = 0;
    delta = firstTime ? Math.floor(delta / damp) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    for(; delta > baseMinusTMin * 26 >> 1; k += base){
        delta = Math.floor(delta / baseMinusTMin);
    }
    return Math.floor(k + (baseMinusTMin + 1) * delta / (delta + 38));
}
function _encode(str) {
    const output = [];
    const input3 = _ucs2decode(str);
    const inputLength = input3.length;
    let n = 128;
    let delta = 0;
    let bias = 72;
    for (const currentValue of input3){
        if (currentValue < 128) {
            output.push(String.fromCharCode(currentValue));
        }
    }
    const basicLength = output.length;
    let handledCPCount = basicLength;
    if (basicLength) {
        output.push(delimiter6);
    }
    while(handledCPCount < inputLength){
        let m = 2147483647;
        for (const currentValue of input3){
            if (currentValue >= n && currentValue < m) {
                m = currentValue;
            }
        }
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > Math.floor((2147483647 - delta) / handledCPCountPlusOne)) {
            _error("overflow");
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (const currentValue1 of input3){
            if (currentValue1 < n && ++delta > 2147483647) {
                _error("overflow");
            }
            if (currentValue1 == n) {
                let q = delta;
                for(let k = 36;; k += base){
                    const t = k <= bias ? 1 : k >= bias + 26 ? 26 : k - bias;
                    if (q < t) {
                        break;
                    }
                    const qMinusT = q - t;
                    const baseMinusT = 36 - t;
                    output.push(String.fromCharCode(_digitToBasic(t + qMinusT % baseMinusT, 0)));
                    q = Math.floor(qMinusT / baseMinusT);
                }
                output.push(String.fromCharCode(_digitToBasic(q, 0)));
                bias = _adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
            }
        }
        ++delta;
        ++n;
    }
    return output.join("");
}
function _toASCII(input4) {
    return _mapDomain(input4, function(str) {
        return regexNonASCII.test(str) ? "xn--" + _encode(str) : str;
    });
}
function toASCII(str) {
    return _toASCII(str);
}
const kCustomPromisifiedSymbol1 = Symbol.for("nodejs.util.promisify.custom");
const kCustomPromisifyArgsSymbol1 = Symbol.for("nodejs.util.promisify.customArgs");
class NodeInvalidArgTypeError1 extends TypeError {
    code = "ERR_INVALID_ARG_TYPE";
    constructor(argumentName, type, received){
        super(`The "${argumentName}" argument must be of type ${type}. Received ${typeof received}`);
    }
}
function promisify1(original) {
    if (typeof original !== "function") {
        throw new NodeInvalidArgTypeError1("original", "Function", original);
    }
    if (original[kCustomPromisifiedSymbol1]) {
        const fn = original[kCustomPromisifiedSymbol1];
        if (typeof fn !== "function") {
            throw new NodeInvalidArgTypeError1("util.promisify.custom", "Function", fn);
        }
        return Object.defineProperty(fn, kCustomPromisifiedSymbol1, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    const argumentNames = original[kCustomPromisifyArgsSymbol1];
    function fn(...args) {
        return new Promise((resolve8, reject)=>{
            original.call(this, ...args, (err, ...values)=>{
                if (err) {
                    return reject(err);
                }
                if (argumentNames !== undefined && values.length > 1) {
                    const obj = {
                    };
                    for(let i62 = 0; i62 < argumentNames.length; i62++){
                        obj[argumentNames[i62]] = values[i62];
                    }
                    resolve8(obj);
                } else {
                    resolve8(values[0]);
                }
            });
        });
    }
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    Object.defineProperty(fn, kCustomPromisifiedSymbol1, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
    });
    return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify1.custom = kCustomPromisifiedSymbol1;
var State;
(function(State1) {
    State1[State1["PASSTHROUGH"] = 0] = "PASSTHROUGH";
    State1[State1["PERCENT"] = 1] = "PERCENT";
    State1[State1["POSITIONAL"] = 2] = "POSITIONAL";
    State1[State1["PRECISION"] = 3] = "PRECISION";
    State1[State1["WIDTH"] = 4] = "WIDTH";
})(State || (State = {
}));
var WorP;
(function(WorP1) {
    WorP1[WorP1["WIDTH"] = 0] = "WIDTH";
    WorP1[WorP1["PRECISION"] = 1] = "PRECISION";
})(WorP || (WorP = {
}));
class Flags {
    plus;
    dash;
    sharp;
    space;
    zero;
    lessthan;
    width = -1;
    precision = -1;
}
const min = Math.min;
const UNICODE_REPLACEMENT_CHARACTER = "\ufffd";
const FLOAT_REGEXP = /(-?)(\d)\.?(\d*)e([+-])(\d+)/;
var F;
(function(F1) {
    F1[F1["sign"] = 1] = "sign";
    F1[F1["mantissa"] = 2] = "mantissa";
    F1[F1["fractional"] = 3] = "fractional";
    F1[F1["esign"] = 4] = "esign";
    F1[F1["exponent"] = 5] = "exponent";
})(F || (F = {
}));
class Printf {
    format;
    args;
    i;
    state = State.PASSTHROUGH;
    verb = "";
    buf = "";
    argNum = 0;
    flags = new Flags();
    haveSeen;
    tmpError;
    constructor(format, ...args){
        this.format = format;
        this.args = args;
        this.haveSeen = Array.from({
            length: args.length
        });
        this.i = 0;
    }
    doPrintf() {
        for(; this.i < this.format.length; ++this.i){
            const c = this.format[this.i];
            switch(this.state){
                case State.PASSTHROUGH:
                    if (c === "%") {
                        this.state = State.PERCENT;
                    } else {
                        this.buf += c;
                    }
                    break;
                case State.PERCENT:
                    if (c === "%") {
                        this.buf += c;
                        this.state = State.PASSTHROUGH;
                    } else {
                        this.handleFormat();
                    }
                    break;
                default:
                    throw Error("Should be unreachable, certainly a bug in the lib.");
            }
        }
        let extras = false;
        let err = "%!(EXTRA";
        for(let i = 0; i !== this.haveSeen.length; ++i){
            if (!this.haveSeen[i]) {
                extras = true;
                err += ` '${Deno.inspect(this.args[i])}'`;
            }
        }
        err += ")";
        if (extras) {
            this.buf += err;
        }
        return this.buf;
    }
    handleFormat() {
        this.flags = new Flags();
        const flags = this.flags;
        for(; this.i < this.format.length; ++this.i){
            const c = this.format[this.i];
            switch(this.state){
                case State.PERCENT:
                    switch(c){
                        case "[":
                            this.handlePositional();
                            this.state = State.POSITIONAL;
                            break;
                        case "+":
                            flags.plus = true;
                            break;
                        case "<":
                            flags.lessthan = true;
                            break;
                        case "-":
                            flags.dash = true;
                            flags.zero = false;
                            break;
                        case "#":
                            flags.sharp = true;
                            break;
                        case " ":
                            flags.space = true;
                            break;
                        case "0":
                            flags.zero = !flags.dash;
                            break;
                        default:
                            if ("1" <= c && c <= "9" || c === "." || c === "*") {
                                if (c === ".") {
                                    this.flags.precision = 0;
                                    this.state = State.PRECISION;
                                    this.i++;
                                } else {
                                    this.state = State.WIDTH;
                                }
                                this.handleWidthAndPrecision(flags);
                            } else {
                                this.handleVerb();
                                return;
                            }
                    }
                    break;
                case State.POSITIONAL:
                    if (c === "*") {
                        const worp = this.flags.precision === -1 ? WorP.WIDTH : WorP.PRECISION;
                        this.handleWidthOrPrecisionRef(worp);
                        this.state = State.PERCENT;
                        break;
                    } else {
                        this.handleVerb();
                        return;
                    }
                default:
                    throw new Error(`Should not be here ${this.state}, library bug!`);
            }
        }
    }
    handleWidthOrPrecisionRef(wOrP) {
        if (this.argNum >= this.args.length) {
            return;
        }
        const arg = this.args[this.argNum];
        this.haveSeen[this.argNum] = true;
        if (typeof arg === "number") {
            switch(wOrP){
                case WorP.WIDTH:
                    this.flags.width = arg;
                    break;
                default:
                    this.flags.precision = arg;
            }
        } else {
            const tmp = wOrP === WorP.WIDTH ? "WIDTH" : "PREC";
            this.tmpError = `%!(BAD ${tmp} '${this.args[this.argNum]}')`;
        }
        this.argNum++;
    }
    handleWidthAndPrecision(flags) {
        const fmt = this.format;
        for(; this.i !== this.format.length; ++this.i){
            const c = fmt[this.i];
            switch(this.state){
                case State.WIDTH:
                    switch(c){
                        case ".":
                            this.flags.precision = 0;
                            this.state = State.PRECISION;
                            break;
                        case "*":
                            this.handleWidthOrPrecisionRef(WorP.WIDTH);
                            break;
                        default:
                            {
                                const val = parseInt(c);
                                if (isNaN(val)) {
                                    this.i--;
                                    this.state = State.PERCENT;
                                    return;
                                }
                                flags.width = flags.width == -1 ? 0 : flags.width;
                                flags.width *= 10;
                                flags.width += val;
                            }
                    }
                    break;
                case State.PRECISION:
                    {
                        if (c === "*") {
                            this.handleWidthOrPrecisionRef(WorP.PRECISION);
                            break;
                        }
                        const val = parseInt(c);
                        if (isNaN(val)) {
                            this.i--;
                            this.state = State.PERCENT;
                            return;
                        }
                        flags.precision *= 10;
                        flags.precision += val;
                        break;
                    }
                default:
                    throw new Error("can't be here. bug.");
            }
        }
    }
    handlePositional() {
        if (this.format[this.i] !== "[") {
            throw new Error("Can't happen? Bug.");
        }
        let positional = 0;
        const format = this.format;
        this.i++;
        let err = false;
        for(; this.i !== this.format.length; ++this.i){
            if (format[this.i] === "]") {
                break;
            }
            positional *= 10;
            const val = parseInt(format[this.i]);
            if (isNaN(val)) {
                this.tmpError = "%!(BAD INDEX)";
                err = true;
            }
            positional += val;
        }
        if (positional - 1 >= this.args.length) {
            this.tmpError = "%!(BAD INDEX)";
            err = true;
        }
        this.argNum = err ? this.argNum : positional - 1;
        return;
    }
    handleLessThan() {
        const arg = this.args[this.argNum];
        if ((arg || {
        }).constructor.name !== "Array") {
            throw new Error(`arg ${arg} is not an array. Todo better error handling`);
        }
        let str = "[ ";
        for(let i = 0; i !== arg.length; ++i){
            if (i !== 0) str += ", ";
            str += this._handleVerb(arg[i]);
        }
        return str + " ]";
    }
    handleVerb() {
        const verb = this.format[this.i];
        this.verb = verb;
        if (this.tmpError) {
            this.buf += this.tmpError;
            this.tmpError = undefined;
            if (this.argNum < this.haveSeen.length) {
                this.haveSeen[this.argNum] = true;
            }
        } else if (this.args.length <= this.argNum) {
            this.buf += `%!(MISSING '${verb}')`;
        } else {
            const arg = this.args[this.argNum];
            this.haveSeen[this.argNum] = true;
            if (this.flags.lessthan) {
                this.buf += this.handleLessThan();
            } else {
                this.buf += this._handleVerb(arg);
            }
        }
        this.argNum++;
        this.state = State.PASSTHROUGH;
    }
    _handleVerb(arg) {
        switch(this.verb){
            case "t":
                return this.pad(arg.toString());
            case "b":
                return this.fmtNumber(arg, 2);
            case "c":
                return this.fmtNumberCodePoint(arg);
            case "d":
                return this.fmtNumber(arg, 10);
            case "o":
                return this.fmtNumber(arg, 8);
            case "x":
                return this.fmtHex(arg);
            case "X":
                return this.fmtHex(arg, true);
            case "e":
                return this.fmtFloatE(arg);
            case "E":
                return this.fmtFloatE(arg, true);
            case "f":
            case "F":
                return this.fmtFloatF(arg);
            case "g":
                return this.fmtFloatG(arg);
            case "G":
                return this.fmtFloatG(arg, true);
            case "s":
                return this.fmtString(arg);
            case "T":
                return this.fmtString(typeof arg);
            case "v":
                return this.fmtV(arg);
            case "j":
                return this.fmtJ(arg);
            default:
                return `%!(BAD VERB '${this.verb}')`;
        }
    }
    pad(s) {
        const padding = this.flags.zero ? "0" : " ";
        if (this.flags.dash) {
            return s.padEnd(this.flags.width, padding);
        }
        return s.padStart(this.flags.width, padding);
    }
    padNum(nStr, neg) {
        let sign;
        if (neg) {
            sign = "-";
        } else if (this.flags.plus || this.flags.space) {
            sign = this.flags.plus ? "+" : " ";
        } else {
            sign = "";
        }
        const zero = this.flags.zero;
        if (!zero) {
            nStr = sign + nStr;
        }
        const pad1 = zero ? "0" : " ";
        const len = zero ? this.flags.width - sign.length : this.flags.width;
        if (this.flags.dash) {
            nStr = nStr.padEnd(len, pad1);
        } else {
            nStr = nStr.padStart(len, pad1);
        }
        if (zero) {
            nStr = sign + nStr;
        }
        return nStr;
    }
    fmtNumber(n, radix, upcase = false) {
        let num = Math.abs(n).toString(radix);
        const prec = this.flags.precision;
        if (prec !== -1) {
            this.flags.zero = false;
            num = n === 0 && prec === 0 ? "" : num;
            while(num.length < prec){
                num = "0" + num;
            }
        }
        let prefix = "";
        if (this.flags.sharp) {
            switch(radix){
                case 2:
                    prefix += "0b";
                    break;
                case 8:
                    prefix += num.startsWith("0") ? "" : "0";
                    break;
                case 16:
                    prefix += "0x";
                    break;
                default:
                    throw new Error("cannot handle base: " + radix);
            }
        }
        num = num.length === 0 ? num : prefix + num;
        if (upcase) {
            num = num.toUpperCase();
        }
        return this.padNum(num, n < 0);
    }
    fmtNumberCodePoint(n) {
        let s = "";
        try {
            s = String.fromCodePoint(n);
        } catch  {
            s = UNICODE_REPLACEMENT_CHARACTER;
        }
        return this.pad(s);
    }
    fmtFloatSpecial(n) {
        if (isNaN(n)) {
            this.flags.zero = false;
            return this.padNum("NaN", false);
        }
        if (n === Number.POSITIVE_INFINITY) {
            this.flags.zero = false;
            this.flags.plus = true;
            return this.padNum("Inf", false);
        }
        if (n === Number.NEGATIVE_INFINITY) {
            this.flags.zero = false;
            return this.padNum("Inf", true);
        }
        return "";
    }
    roundFractionToPrecision(fractional, precision) {
        let round = false;
        if (fractional.length > precision) {
            fractional = "1" + fractional;
            let tmp = parseInt(fractional.substr(0, precision + 2)) / 10;
            tmp = Math.round(tmp);
            fractional = Math.floor(tmp).toString();
            round = fractional[0] === "2";
            fractional = fractional.substr(1);
        } else {
            while(fractional.length < precision){
                fractional += "0";
            }
        }
        return [
            fractional,
            round
        ];
    }
    fmtFloatE(n, upcase = false) {
        const special = this.fmtFloatSpecial(n);
        if (special !== "") {
            return special;
        }
        const m = n.toExponential().match(FLOAT_REGEXP);
        if (!m) {
            throw Error("can't happen, bug");
        }
        let fractional = m[F.fractional];
        const precision = this.flags.precision !== -1 ? this.flags.precision : 6;
        let rounding = false;
        [fractional, rounding] = this.roundFractionToPrecision(fractional, precision);
        let e = m[F.exponent];
        let esign = m[F.esign];
        let mantissa = parseInt(m[F.mantissa]);
        if (rounding) {
            mantissa += 1;
            if (10 <= mantissa) {
                mantissa = 1;
                const r = parseInt(esign + e) + 1;
                e = r.toString();
                esign = r < 0 ? "-" : "+";
            }
        }
        e = e.length == 1 ? "0" + e : e;
        const val = `${mantissa}.${fractional}${upcase ? "E" : "e"}${esign}${e}`;
        return this.padNum(val, n < 0);
    }
    fmtFloatF(n1) {
        const special = this.fmtFloatSpecial(n1);
        if (special !== "") {
            return special;
        }
        function expandNumber(n) {
            if (Number.isSafeInteger(n)) {
                return n.toString() + ".";
            }
            const t = n.toExponential().split("e");
            let m = t[0].replace(".", "");
            const e = parseInt(t[1]);
            if (e < 0) {
                let nStr = "0.";
                for(let i = 0; i !== Math.abs(e) - 1; ++i){
                    nStr += "0";
                }
                return nStr += m;
            } else {
                const splIdx = e + 1;
                while(m.length < splIdx){
                    m += "0";
                }
                return m.substr(0, splIdx) + "." + m.substr(splIdx);
            }
        }
        const val = expandNumber(Math.abs(n1));
        const arr = val.split(".");
        let dig = arr[0];
        let fractional = arr[1];
        const precision = this.flags.precision !== -1 ? this.flags.precision : 6;
        let round = false;
        [fractional, round] = this.roundFractionToPrecision(fractional, precision);
        if (round) {
            dig = (parseInt(dig) + 1).toString();
        }
        return this.padNum(`${dig}.${fractional}`, n1 < 0);
    }
    fmtFloatG(n, upcase = false) {
        const special = this.fmtFloatSpecial(n);
        if (special !== "") {
            return special;
        }
        let P = this.flags.precision !== -1 ? this.flags.precision : 6;
        P = P === 0 ? 1 : P;
        const m = n.toExponential().match(FLOAT_REGEXP);
        if (!m) {
            throw Error("can't happen");
        }
        const X = parseInt(m[F.exponent]) * (m[F.esign] === "-" ? -1 : 1);
        let nStr = "";
        if (P > X && X >= -4) {
            this.flags.precision = P - (X + 1);
            nStr = this.fmtFloatF(n);
            if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*$/, "");
            }
        } else {
            this.flags.precision = P - 1;
            nStr = this.fmtFloatE(n);
            if (!this.flags.sharp) {
                nStr = nStr.replace(/\.?0*e/, upcase ? "E" : "e");
            }
        }
        return nStr;
    }
    fmtString(s) {
        if (this.flags.precision !== -1) {
            s = s.substr(0, this.flags.precision);
        }
        return this.pad(s);
    }
    fmtHex(val, upper = false) {
        switch(typeof val){
            case "number":
                return this.fmtNumber(val, 16, upper);
            case "string":
                {
                    const sharp = this.flags.sharp && val.length !== 0;
                    let hex = sharp ? "0x" : "";
                    const prec = this.flags.precision;
                    const end = prec !== -1 ? min(prec, val.length) : val.length;
                    for(let i = 0; i !== end; ++i){
                        if (i !== 0 && this.flags.space) {
                            hex += sharp ? " 0x" : " ";
                        }
                        const c = (val.charCodeAt(i) & 255).toString(16);
                        hex += c.length === 1 ? `0${c}` : c;
                    }
                    if (upper) {
                        hex = hex.toUpperCase();
                    }
                    return this.pad(hex);
                }
            default:
                throw new Error("currently only number and string are implemented for hex");
        }
    }
    fmtV(val) {
        if (this.flags.sharp) {
            const options = this.flags.precision !== -1 ? {
                depth: this.flags.precision
            } : {
            };
            return this.pad(Deno.inspect(val, options));
        } else {
            const p = this.flags.precision;
            return p === -1 ? val.toString() : val.toString().substr(0, p);
        }
    }
    fmtJ(val) {
        return JSON.stringify(val);
    }
}
function sprintf(format, ...args) {
    const printf1 = new Printf(format, ...args);
    return printf1.doPrintf();
}
let core;
if (Deno?.core) {
    core = Deno.core;
} else {
    core = {
        setNextTickCallback: undefined,
        evalContext (_code, _filename) {
            throw new Error("Deno.core.evalContext is not supported in this environment");
        },
        encode (chunk) {
            return new TextEncoder().encode(chunk);
        }
    };
}
const kSize = 2048;
const kMask = 2048 - 1;
class FixedCircularBuffer {
    bottom;
    top;
    list;
    next;
    constructor(){
        this.bottom = 0;
        this.top = 0;
        this.list = new Array(kSize);
        this.next = null;
    }
    isEmpty() {
        return this.top === this.bottom;
    }
    isFull() {
        return (this.top + 1 & kMask) === this.bottom;
    }
    push(data) {
        this.list[this.top] = data;
        this.top = this.top + 1 & kMask;
    }
    shift() {
        const nextItem = this.list[this.bottom];
        if (nextItem === undefined) {
            return null;
        }
        this.list[this.bottom] = undefined;
        this.bottom = this.bottom + 1 & kMask;
        return nextItem;
    }
}
class FixedQueue {
    head;
    tail;
    constructor(){
        this.head = this.tail = new FixedCircularBuffer();
    }
    isEmpty() {
        return this.head.isEmpty();
    }
    push(data) {
        if (this.head.isFull()) {
            this.head = this.head.next = new FixedCircularBuffer();
        }
        this.head.push(data);
    }
    shift() {
        const tail = this.tail;
        const next = tail.shift();
        if (tail.isEmpty() && tail.next !== null) {
            this.tail = tail.next;
        }
        return next;
    }
}
function uvTranslateSysError(sysErrno) {
    switch(sysErrno){
        case 5:
            return "EACCES";
        case 998:
            return "EACCES";
        case 10013:
            return "EACCES";
        case 1920:
            return "EACCES";
        case 1227:
            return "EADDRINUSE";
        case 10048:
            return "EADDRINUSE";
        case 10049:
            return "EADDRNOTAVAIL";
        case 10047:
            return "EAFNOSUPPORT";
        case 10035:
            return "EAGAIN";
        case 10037:
            return "EALREADY";
        case 1004:
            return "EBADF";
        case 6:
            return "EBADF";
        case 33:
            return "EBUSY";
        case 231:
            return "EBUSY";
        case 32:
            return "EBUSY";
        case 995:
            return "ECANCELED";
        case 10004:
            return "ECANCELED";
        case 1113:
            return "ECHARSET";
        case 1236:
            return "ECONNABORTED";
        case 10053:
            return "ECONNABORTED";
        case 1225:
            return "ECONNREFUSED";
        case 10061:
            return "ECONNREFUSED";
        case 64:
            return "ECONNRESET";
        case 10054:
            return "ECONNRESET";
        case 183:
            return "EEXIST";
        case 80:
            return "EEXIST";
        case 111:
            return "EFAULT";
        case 10014:
            return "EFAULT";
        case 1232:
            return "EHOSTUNREACH";
        case 10065:
            return "EHOSTUNREACH";
        case 122:
            return "EINVAL";
        case 13:
            return "EINVAL";
        case 123:
            return "EINVAL";
        case 87:
            return "EINVAL";
        case 10022:
            return "EINVAL";
        case 10046:
            return "EINVAL";
        case 1102:
            return "EIO";
        case 1111:
            return "EIO";
        case 23:
            return "EIO";
        case 1166:
            return "EIO";
        case 1165:
            return "EIO";
        case 1393:
            return "EIO";
        case 1129:
            return "EIO";
        case 1101:
            return "EIO";
        case 31:
            return "EIO";
        case 1106:
            return "EIO";
        case 1117:
            return "EIO";
        case 1104:
            return "EIO";
        case 205:
            return "EIO";
        case 110:
            return "EIO";
        case 1103:
            return "EIO";
        case 156:
            return "EIO";
        case 10056:
            return "EISCONN";
        case 1921:
            return "ELOOP";
        case 4:
            return "EMFILE";
        case 10024:
            return "EMFILE";
        case 10040:
            return "EMSGSIZE";
        case 206:
            return "ENAMETOOLONG";
        case 1231:
            return "ENETUNREACH";
        case 10051:
            return "ENETUNREACH";
        case 10055:
            return "ENOBUFS";
        case 161:
            return "ENOENT";
        case 267:
            return "ENOENT";
        case 203:
            return "ENOENT";
        case 2:
            return "ENOENT";
        case 15:
            return "ENOENT";
        case 4392:
            return "ENOENT";
        case 126:
            return "ENOENT";
        case 3:
            return "ENOENT";
        case 11001:
            return "ENOENT";
        case 11004:
            return "ENOENT";
        case 8:
            return "ENOMEM";
        case 14:
            return "ENOMEM";
        case 82:
            return "ENOSPC";
        case 112:
            return "ENOSPC";
        case 277:
            return "ENOSPC";
        case 1100:
            return "ENOSPC";
        case 39:
            return "ENOSPC";
        case 2250:
            return "ENOTCONN";
        case 10057:
            return "ENOTCONN";
        case 145:
            return "ENOTEMPTY";
        case 10038:
            return "ENOTSOCK";
        case 50:
            return "ENOTSUP";
        case 109:
            return "EOF";
        case 1314:
            return "EPERM";
        case 230:
            return "EPIPE";
        case 232:
            return "EPIPE";
        case 233:
            return "EPIPE";
        case 10058:
            return "EPIPE";
        case 10043:
            return "EPROTONOSUPPORT";
        case 19:
            return "EROFS";
        case 121:
            return "ETIMEDOUT";
        case 10060:
            return "ETIMEDOUT";
        case 17:
            return "EXDEV";
        case 1:
            return "EISDIR";
        case 208:
            return "E2BIG";
        case 10044:
            return "ESOCKTNOSUPPORT";
        default:
            return "UNKNOWN";
    }
}
const codeToErrorWindows = [
    [
        -4093,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -4092,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -4091,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -4090,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -4089,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -4088,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -4084,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -4083,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -4082,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -4081,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -4079,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -4078,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -4077,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -4076,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -4075,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -4074,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -4036,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -4073,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4072,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -4071,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -4070,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -4069,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -4068,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -4067,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -4066,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -4065,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -4064,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -4063,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -4062,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -4061,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -4060,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -4059,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -4058,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -4057,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -4035,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -4055,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -4054,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -4053,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -4052,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -4051,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -4050,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -4049,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -4048,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -4047,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -4046,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -4045,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -4044,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -4034,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -4043,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -4042,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -4041,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -4040,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -4039,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -4038,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -4037,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -4033,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -4032,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -4031,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -4029,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -4027,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const errorToCodeWindows = codeToErrorWindows.map(([status, [error]])=>[
        error,
        status
    ]
);
const codeToErrorDarwin = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -48,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -49,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -47,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -35,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -37,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -89,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -53,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -61,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -54,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -39,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -65,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -56,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -62,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -40,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -63,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -50,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -51,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -55,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -42,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -78,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -57,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -66,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -38,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -45,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -100,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -43,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -41,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -58,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -60,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -64,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -79,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -92,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const errorToCodeDarwin = codeToErrorDarwin.map(([status, [code]])=>[
        code,
        status
    ]
);
const codeToErrorLinux = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -98,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -99,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -97,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -11,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -114,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -125,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -103,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -111,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -104,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -89,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -113,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -106,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -40,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -90,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -36,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -100,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -101,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -105,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -64,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -92,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -38,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -107,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -39,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -88,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -95,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -71,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -93,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -91,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -108,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -110,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -112,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -121,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -84,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const errorToCodeLinux = codeToErrorLinux.map(([status, [code]])=>[
        code,
        status
    ]
);
const errorMap = new Map(osType === "windows" ? codeToErrorWindows : osType === "darwin" ? codeToErrorDarwin : osType === "linux" ? codeToErrorLinux : unreachable());
const codeMap = new Map(osType === "windows" ? errorToCodeWindows : osType === "darwin" ? errorToCodeDarwin : osType === "linux" ? errorToCodeLinux : unreachable());
function mapSysErrnoToUvErrno(sysErrno) {
    if (osType === "windows") {
        const code = uvTranslateSysError(sysErrno);
        return codeMap.get(code) ?? -sysErrno;
    } else {
        return -sysErrno;
    }
}
const mod11 = {
    errorMap: errorMap,
    codeMap: codeMap,
    mapSysErrnoToUvErrno: mapSysErrnoToUvErrno
};
const os = {
    UV_UDP_REUSEADDR: 4,
    dlopen: {
        RTLD_LAZY: 1,
        RTLD_NOW: 2,
        RTLD_GLOBAL: 8,
        RTLD_LOCAL: 4
    },
    errno: {
        E2BIG: 7,
        EACCES: 13,
        EADDRINUSE: 48,
        EADDRNOTAVAIL: 49,
        EAFNOSUPPORT: 47,
        EAGAIN: 35,
        EALREADY: 37,
        EBADF: 9,
        EBADMSG: 94,
        EBUSY: 16,
        ECANCELED: 89,
        ECHILD: 10,
        ECONNABORTED: 53,
        ECONNREFUSED: 61,
        ECONNRESET: 54,
        EDEADLK: 11,
        EDESTADDRREQ: 39,
        EDOM: 33,
        EDQUOT: 69,
        EEXIST: 17,
        EFAULT: 14,
        EFBIG: 27,
        EHOSTUNREACH: 65,
        EIDRM: 90,
        EILSEQ: 92,
        EINPROGRESS: 36,
        EINTR: 4,
        EINVAL: 22,
        EIO: 5,
        EISCONN: 56,
        EISDIR: 21,
        ELOOP: 62,
        EMFILE: 24,
        EMLINK: 31,
        EMSGSIZE: 40,
        EMULTIHOP: 95,
        ENAMETOOLONG: 63,
        ENETDOWN: 50,
        ENETRESET: 52,
        ENETUNREACH: 51,
        ENFILE: 23,
        ENOBUFS: 55,
        ENODATA: 96,
        ENODEV: 19,
        ENOENT: 2,
        ENOEXEC: 8,
        ENOLCK: 77,
        ENOLINK: 97,
        ENOMEM: 12,
        ENOMSG: 91,
        ENOPROTOOPT: 42,
        ENOSPC: 28,
        ENOSR: 98,
        ENOSTR: 99,
        ENOSYS: 78,
        ENOTCONN: 57,
        ENOTDIR: 20,
        ENOTEMPTY: 66,
        ENOTSOCK: 38,
        ENOTSUP: 45,
        ENOTTY: 25,
        ENXIO: 6,
        EOPNOTSUPP: 102,
        EOVERFLOW: 84,
        EPERM: 1,
        EPIPE: 32,
        EPROTO: 100,
        EPROTONOSUPPORT: 43,
        EPROTOTYPE: 41,
        ERANGE: 34,
        EROFS: 30,
        ESPIPE: 29,
        ESRCH: 3,
        ESTALE: 70,
        ETIME: 101,
        ETIMEDOUT: 60,
        ETXTBSY: 26,
        EWOULDBLOCK: 35,
        EXDEV: 18
    },
    signals: {
        SIGHUP: 1,
        SIGINT: 2,
        SIGQUIT: 3,
        SIGILL: 4,
        SIGTRAP: 5,
        SIGABRT: 6,
        SIGIOT: 6,
        SIGBUS: 10,
        SIGFPE: 8,
        SIGKILL: 9,
        SIGUSR1: 30,
        SIGSEGV: 11,
        SIGUSR2: 31,
        SIGPIPE: 13,
        SIGALRM: 14,
        SIGTERM: 15,
        SIGCHLD: 20,
        SIGCONT: 19,
        SIGSTOP: 17,
        SIGTSTP: 18,
        SIGTTIN: 21,
        SIGTTOU: 22,
        SIGURG: 16,
        SIGXCPU: 24,
        SIGXFSZ: 25,
        SIGVTALRM: 26,
        SIGPROF: 27,
        SIGWINCH: 28,
        SIGIO: 23,
        SIGINFO: 29,
        SIGSYS: 12
    },
    priority: {
        PRIORITY_LOW: 19,
        PRIORITY_BELOW_NORMAL: 10,
        PRIORITY_NORMAL: 0,
        PRIORITY_ABOVE_NORMAL: -7,
        PRIORITY_HIGH: -14,
        PRIORITY_HIGHEST: -20
    }
};
const fs1 = {
    UV_FS_SYMLINK_DIR: 1,
    UV_FS_SYMLINK_JUNCTION: 2,
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    UV_DIRENT_UNKNOWN: 0,
    UV_DIRENT_FILE: 1,
    UV_DIRENT_DIR: 2,
    UV_DIRENT_LINK: 3,
    UV_DIRENT_FIFO: 4,
    UV_DIRENT_SOCKET: 5,
    UV_DIRENT_CHAR: 6,
    UV_DIRENT_BLOCK: 7,
    S_IFMT: 61440,
    S_IFREG: 32768,
    S_IFDIR: 16384,
    S_IFCHR: 8192,
    S_IFBLK: 24576,
    S_IFIFO: 4096,
    S_IFLNK: 40960,
    S_IFSOCK: 49152,
    O_CREAT: 512,
    O_EXCL: 2048,
    UV_FS_O_FILEMAP: 0,
    O_NOCTTY: 131072,
    O_TRUNC: 1024,
    O_APPEND: 8,
    O_DIRECTORY: 1048576,
    O_NOFOLLOW: 256,
    O_SYNC: 128,
    O_DSYNC: 4194304,
    O_SYMLINK: 2097152,
    O_NONBLOCK: 4,
    S_IRWXU: 448,
    S_IRUSR: 256,
    S_IWUSR: 128,
    S_IXUSR: 64,
    S_IRWXG: 56,
    S_IRGRP: 32,
    S_IWGRP: 16,
    S_IXGRP: 8,
    S_IRWXO: 7,
    S_IROTH: 4,
    S_IWOTH: 2,
    S_IXOTH: 1,
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1,
    UV_FS_COPYFILE_EXCL: 1,
    COPYFILE_EXCL: 1,
    UV_FS_COPYFILE_FICLONE: 2,
    COPYFILE_FICLONE: 2,
    UV_FS_COPYFILE_FICLONE_FORCE: 4,
    COPYFILE_FICLONE_FORCE: 4
};
const crypto = {
    OPENSSL_VERSION_NUMBER: 269488319,
    SSL_OP_ALL: 2147485780,
    SSL_OP_ALLOW_NO_DHE_KEX: 1024,
    SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144,
    SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304,
    SSL_OP_CISCO_ANYCONNECT: 32768,
    SSL_OP_COOKIE_EXCHANGE: 8192,
    SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648,
    SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048,
    SSL_OP_EPHEMERAL_RSA: 0,
    SSL_OP_LEGACY_SERVER_CONNECT: 4,
    SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 0,
    SSL_OP_MICROSOFT_SESS_ID_BUG: 0,
    SSL_OP_MSIE_SSLV2_RSA_PADDING: 0,
    SSL_OP_NETSCAPE_CA_DN_BUG: 0,
    SSL_OP_NETSCAPE_CHALLENGE_BUG: 0,
    SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 0,
    SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 0,
    SSL_OP_NO_COMPRESSION: 131072,
    SSL_OP_NO_ENCRYPT_THEN_MAC: 524288,
    SSL_OP_NO_QUERY_MTU: 4096,
    SSL_OP_NO_RENEGOTIATION: 1073741824,
    SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536,
    SSL_OP_NO_SSLv2: 0,
    SSL_OP_NO_SSLv3: 33554432,
    SSL_OP_NO_TICKET: 16384,
    SSL_OP_NO_TLSv1: 67108864,
    SSL_OP_NO_TLSv1_1: 268435456,
    SSL_OP_NO_TLSv1_2: 134217728,
    SSL_OP_NO_TLSv1_3: 536870912,
    SSL_OP_PKCS1_CHECK_1: 0,
    SSL_OP_PKCS1_CHECK_2: 0,
    SSL_OP_PRIORITIZE_CHACHA: 2097152,
    SSL_OP_SINGLE_DH_USE: 0,
    SSL_OP_SINGLE_ECDH_USE: 0,
    SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 0,
    SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0,
    SSL_OP_TLS_BLOCK_PADDING_BUG: 0,
    SSL_OP_TLS_D5_BUG: 0,
    SSL_OP_TLS_ROLLBACK_BUG: 8388608,
    ENGINE_METHOD_RSA: 1,
    ENGINE_METHOD_DSA: 2,
    ENGINE_METHOD_DH: 4,
    ENGINE_METHOD_RAND: 8,
    ENGINE_METHOD_EC: 2048,
    ENGINE_METHOD_CIPHERS: 64,
    ENGINE_METHOD_DIGESTS: 128,
    ENGINE_METHOD_PKEY_METHS: 512,
    ENGINE_METHOD_PKEY_ASN1_METHS: 1024,
    ENGINE_METHOD_ALL: 65535,
    ENGINE_METHOD_NONE: 0,
    DH_CHECK_P_NOT_SAFE_PRIME: 2,
    DH_CHECK_P_NOT_PRIME: 1,
    DH_UNABLE_TO_CHECK_GENERATOR: 4,
    DH_NOT_SUITABLE_GENERATOR: 8,
    ALPN_ENABLED: 1,
    RSA_PKCS1_PADDING: 1,
    RSA_SSLV23_PADDING: 2,
    RSA_NO_PADDING: 3,
    RSA_PKCS1_OAEP_PADDING: 4,
    RSA_X931_PADDING: 5,
    RSA_PKCS1_PSS_PADDING: 6,
    RSA_PSS_SALTLEN_DIGEST: -1,
    RSA_PSS_SALTLEN_MAX_SIGN: -2,
    RSA_PSS_SALTLEN_AUTO: -2,
    defaultCoreCipherList: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
    TLS1_VERSION: 769,
    TLS1_1_VERSION: 770,
    TLS1_2_VERSION: 771,
    TLS1_3_VERSION: 772,
    POINT_CONVERSION_COMPRESSED: 2,
    POINT_CONVERSION_UNCOMPRESSED: 4,
    POINT_CONVERSION_HYBRID: 6
};
const zlib = {
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    Z_VERSION_ERROR: -6,
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    ZLIB_VERNUM: 4784,
    DEFLATE: 1,
    INFLATE: 2,
    GZIP: 3,
    GUNZIP: 4,
    DEFLATERAW: 5,
    INFLATERAW: 6,
    UNZIP: 7,
    BROTLI_DECODE: 8,
    BROTLI_ENCODE: 9,
    Z_MIN_WINDOWBITS: 8,
    Z_MAX_WINDOWBITS: 15,
    Z_DEFAULT_WINDOWBITS: 15,
    Z_MIN_CHUNK: 64,
    Z_MAX_CHUNK: Infinity,
    Z_DEFAULT_CHUNK: 16384,
    Z_MIN_MEMLEVEL: 1,
    Z_MAX_MEMLEVEL: 9,
    Z_DEFAULT_MEMLEVEL: 8,
    Z_MIN_LEVEL: -1,
    Z_MAX_LEVEL: 9,
    Z_DEFAULT_LEVEL: -1,
    BROTLI_OPERATION_PROCESS: 0,
    BROTLI_OPERATION_FLUSH: 1,
    BROTLI_OPERATION_FINISH: 2,
    BROTLI_OPERATION_EMIT_METADATA: 3,
    BROTLI_PARAM_MODE: 0,
    BROTLI_MODE_GENERIC: 0,
    BROTLI_MODE_TEXT: 1,
    BROTLI_MODE_FONT: 2,
    BROTLI_DEFAULT_MODE: 0,
    BROTLI_PARAM_QUALITY: 1,
    BROTLI_MIN_QUALITY: 0,
    BROTLI_MAX_QUALITY: 11,
    BROTLI_DEFAULT_QUALITY: 11,
    BROTLI_PARAM_LGWIN: 2,
    BROTLI_MIN_WINDOW_BITS: 10,
    BROTLI_MAX_WINDOW_BITS: 24,
    BROTLI_LARGE_MAX_WINDOW_BITS: 30,
    BROTLI_DEFAULT_WINDOW: 22,
    BROTLI_PARAM_LGBLOCK: 3,
    BROTLI_MIN_INPUT_BLOCK_BITS: 16,
    BROTLI_MAX_INPUT_BLOCK_BITS: 24,
    BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
    BROTLI_PARAM_SIZE_HINT: 5,
    BROTLI_PARAM_LARGE_WINDOW: 6,
    BROTLI_PARAM_NPOSTFIX: 7,
    BROTLI_PARAM_NDIRECT: 8,
    BROTLI_DECODER_RESULT_ERROR: 0,
    BROTLI_DECODER_RESULT_SUCCESS: 1,
    BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
    BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
    BROTLI_DECODER_NO_ERROR: 0,
    BROTLI_DECODER_SUCCESS: 1,
    BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
    BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
    BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
    BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
    BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
    BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
    BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
    BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
    BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
    BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
    BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
    BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
    BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
    BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
    BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
    BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
    BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
    BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
    BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
    BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
    BROTLI_DECODER_ERROR_UNREACHABLE: -31
};
const trace = {
    TRACE_EVENT_PHASE_BEGIN: 66,
    TRACE_EVENT_PHASE_END: 69,
    TRACE_EVENT_PHASE_COMPLETE: 88,
    TRACE_EVENT_PHASE_INSTANT: 73,
    TRACE_EVENT_PHASE_ASYNC_BEGIN: 83,
    TRACE_EVENT_PHASE_ASYNC_STEP_INTO: 84,
    TRACE_EVENT_PHASE_ASYNC_STEP_PAST: 112,
    TRACE_EVENT_PHASE_ASYNC_END: 70,
    TRACE_EVENT_PHASE_NESTABLE_ASYNC_BEGIN: 98,
    TRACE_EVENT_PHASE_NESTABLE_ASYNC_END: 101,
    TRACE_EVENT_PHASE_NESTABLE_ASYNC_INSTANT: 110,
    TRACE_EVENT_PHASE_FLOW_BEGIN: 115,
    TRACE_EVENT_PHASE_FLOW_STEP: 116,
    TRACE_EVENT_PHASE_FLOW_END: 102,
    TRACE_EVENT_PHASE_METADATA: 77,
    TRACE_EVENT_PHASE_COUNTER: 67,
    TRACE_EVENT_PHASE_SAMPLE: 80,
    TRACE_EVENT_PHASE_CREATE_OBJECT: 78,
    TRACE_EVENT_PHASE_SNAPSHOT_OBJECT: 79,
    TRACE_EVENT_PHASE_DELETE_OBJECT: 68,
    TRACE_EVENT_PHASE_MEMORY_DUMP: 118,
    TRACE_EVENT_PHASE_MARK: 82,
    TRACE_EVENT_PHASE_CLOCK_SYNC: 99,
    TRACE_EVENT_PHASE_ENTER_CONTEXT: 40,
    TRACE_EVENT_PHASE_LEAVE_CONTEXT: 41,
    TRACE_EVENT_PHASE_LINK_IDS: 61
};
const mod12 = {
    os: os,
    fs: fs1,
    crypto: crypto,
    zlib: zlib,
    trace: trace
};
function isInt32(value) {
    return value === (value | 0);
}
const { errno: { ENOTDIR , ENOENT ,  } ,  } = os;
const queue = new FixedQueue();
let _nextTick;
const kIsNodeError = Symbol("kIsNodeError");
const classRegExp = /^([A-Z][a-z0-9]*)+$/;
const kTypes = [
    "string",
    "function",
    "number",
    "object",
    "Function",
    "Object",
    "boolean",
    "bigint",
    "symbol", 
];
class AbortError extends Error {
    code;
    constructor(){
        super("The operation was aborted");
        this.code = "ABORT_ERR";
        this.name = "AbortError";
    }
}
function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for(; i >= start + 4; i -= 3){
        res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
}
function hideStackFrames(fn) {
    const hidden = "__node_internal_" + fn.name;
    Object.defineProperty(fn, "name", {
        value: hidden
    });
    return fn;
}
const kObjectType = 0;
const kArrayExtrasType = 2;
const kRejected = 2;
const meta1 = [
    '\\x00',
    '\\x01',
    '\\x02',
    '\\x03',
    '\\x04',
    '\\x05',
    '\\x06',
    '\\x07',
    '\\b',
    '\\t',
    '\\n',
    '\\x0B',
    '\\f',
    '\\r',
    '\\x0E',
    '\\x0F',
    '\\x10',
    '\\x11',
    '\\x12',
    '\\x13',
    '\\x14',
    '\\x15',
    '\\x16',
    '\\x17',
    '\\x18',
    '\\x19',
    '\\x1A',
    '\\x1B',
    '\\x1C',
    '\\x1D',
    '\\x1E',
    '\\x1F',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    "\\'",
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '\\\\',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '\\x7F',
    '\\x80',
    '\\x81',
    '\\x82',
    '\\x83',
    '\\x84',
    '\\x85',
    '\\x86',
    '\\x87',
    '\\x88',
    '\\x89',
    '\\x8A',
    '\\x8B',
    '\\x8C',
    '\\x8D',
    '\\x8E',
    '\\x8F',
    '\\x90',
    '\\x91',
    '\\x92',
    '\\x93',
    '\\x94',
    '\\x95',
    '\\x96',
    '\\x97',
    '\\x98',
    '\\x99',
    '\\x9A',
    '\\x9B',
    '\\x9C',
    '\\x9D',
    '\\x9E',
    '\\x9F'
];
const isUndetectableObject = (v)=>typeof v === "undefined" && v !== undefined
;
const strEscapeSequencesRegExp = /[\x00-\x1f\x27\x5c\x7f-\x9f]/;
const strEscapeSequencesReplacer = /[\x00-\x1f\x27\x5c\x7f-\x9f]/g;
const strEscapeSequencesRegExpSingle = /[\x00-\x1f\x5c\x7f-\x9f]/;
const strEscapeSequencesReplacerSingle = /[\x00-\x1f\x5c\x7f-\x9f]/g;
const keyStrRegExp = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
const numberRegExp = /^(0|[1-9][0-9]*)$/;
const nodeModulesRegExp = /[/\\]node_modules[/\\](.+?)(?=[/\\])/g;
const classRegExp1 = /^(\s+[^(]*?)\s*{/;
const stripCommentsRegExp = /(\/\/.*?\n)|(\/\*(.|\n)*?\*\/)/g;
const inspectDefaultOptions = {
    showHidden: false,
    depth: 2,
    colors: false,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    maxStringLength: 10000,
    breakLength: 80,
    compact: 3,
    sorted: false,
    getters: false
};
function getUserOptions(ctx, isCrossContext) {
    const ret = {
        stylize: ctx.stylize,
        showHidden: ctx.showHidden,
        depth: ctx.depth,
        colors: ctx.colors,
        customInspect: ctx.customInspect,
        showProxy: ctx.showProxy,
        maxArrayLength: ctx.maxArrayLength,
        maxStringLength: ctx.maxStringLength,
        breakLength: ctx.breakLength,
        compact: ctx.compact,
        sorted: ctx.sorted,
        getters: ctx.getters,
        ...ctx.userOptions
    };
    if (isCrossContext) {
        Object.setPrototypeOf(ret, null);
        for (const key of Object.keys(ret)){
            if ((typeof ret[key] === "object" || typeof ret[key] === "function") && ret[key] !== null) {
                delete ret[key];
            }
        }
        ret.stylize = Object.setPrototypeOf((value, flavour)=>{
            let stylized;
            try {
                stylized = `${ctx.stylize(value, flavour)}`;
            } catch  {
            }
            if (typeof stylized !== "string") return value;
            return stylized;
        }, null);
    }
    return ret;
}
function inspect(value, opts) {
    const ctx = {
        budget: {
        },
        indentationLvl: 0,
        seen: [],
        currentDepth: 0,
        stylize: stylizeNoColor,
        showHidden: inspectDefaultOptions.showHidden,
        depth: inspectDefaultOptions.depth,
        colors: inspectDefaultOptions.colors,
        customInspect: inspectDefaultOptions.customInspect,
        showProxy: inspectDefaultOptions.showProxy,
        maxArrayLength: inspectDefaultOptions.maxArrayLength,
        maxStringLength: inspectDefaultOptions.maxStringLength,
        breakLength: inspectDefaultOptions.breakLength,
        compact: inspectDefaultOptions.compact,
        sorted: inspectDefaultOptions.sorted,
        getters: inspectDefaultOptions.getters
    };
    if (arguments.length > 1) {
        if (arguments.length > 2) {
            if (arguments[2] !== undefined) {
                ctx.depth = arguments[2];
            }
            if (arguments.length > 3 && arguments[3] !== undefined) {
                ctx.colors = arguments[3];
            }
        }
        if (typeof opts === "boolean") {
            ctx.showHidden = opts;
        } else if (opts) {
            const optKeys = Object.keys(opts);
            for(let i = 0; i < optKeys.length; ++i){
                const key = optKeys[i];
                if (inspectDefaultOptions.hasOwnProperty(key) || key === "stylize") {
                    ctx[key] = opts[key];
                } else if (ctx.userOptions === undefined) {
                    ctx.userOptions = opts;
                }
            }
        }
    }
    if (ctx.colors) ctx.stylize = stylizeWithColor;
    if (ctx.maxArrayLength === null) ctx.maxArrayLength = Infinity;
    if (ctx.maxStringLength === null) ctx.maxStringLength = Infinity;
    return formatValue(ctx, value, 0);
}
const customInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
inspect.custom = customInspectSymbol;
const captureLargerStackTrace = hideStackFrames(function captureLargerStackTrace(err) {
    Error.captureStackTrace(err);
    return err;
});
hideStackFrames(function uvExceptionWithHostPort(err, syscall, address, port) {
    const { 0: code , 1: uvmsg  } = uvErrmapGet(err) || uvUnmappedError;
    const message = `${syscall} ${code}: ${uvmsg}`;
    let details = "";
    if (port && port > 0) {
        details = ` ${address}:${port}`;
    } else if (address) {
        details = ` ${address}`;
    }
    const ex = new Error(`${message}${details}`);
    ex.code = code;
    ex.errno = err;
    ex.syscall = syscall;
    ex.address = address;
    if (port) {
        ex.port = port;
    }
    return captureLargerStackTrace(ex);
});
class ERR_INVALID_ARG_TYPE extends NodeTypeError {
    constructor(name, expected, actual){
        const msg = createInvalidArgType(name, expected);
        super("ERR_INVALID_ARG_TYPE", `${msg}.${invalidArgTypeHelper(actual)}`);
    }
    static RangeError = ERR_INVALID_ARG_TYPE_RANGE;
}
function isUint32(value) {
    return value === value >>> 0;
}
const octalReg = /^[0-7]+$/;
const modeDesc = "must be a 32-bit unsigned integer or an octal string";
inspect.colors = Object.assign(Object.create(null), {
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
    blink: [
        5,
        25
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
    ],
    doubleunderline: [
        21,
        24
    ],
    black: [
        30,
        defaultFG
    ],
    red: [
        31,
        defaultFG
    ],
    green: [
        32,
        defaultFG
    ],
    yellow: [
        33,
        defaultFG
    ],
    blue: [
        34,
        defaultFG
    ],
    magenta: [
        35,
        defaultFG
    ],
    cyan: [
        36,
        defaultFG
    ],
    white: [
        37,
        defaultFG
    ],
    bgBlack: [
        40,
        defaultBG
    ],
    bgRed: [
        41,
        defaultBG
    ],
    bgGreen: [
        42,
        defaultBG
    ],
    bgYellow: [
        43,
        defaultBG
    ],
    bgBlue: [
        44,
        defaultBG
    ],
    bgMagenta: [
        45,
        defaultBG
    ],
    bgCyan: [
        46,
        defaultBG
    ],
    bgWhite: [
        47,
        defaultBG
    ],
    framed: [
        51,
        54
    ],
    overlined: [
        53,
        55
    ],
    gray: [
        90,
        defaultFG
    ],
    redBright: [
        91,
        defaultFG
    ],
    greenBright: [
        92,
        defaultFG
    ],
    yellowBright: [
        93,
        defaultFG
    ],
    blueBright: [
        94,
        defaultFG
    ],
    magentaBright: [
        95,
        defaultFG
    ],
    cyanBright: [
        96,
        defaultFG
    ],
    whiteBright: [
        97,
        defaultFG
    ],
    bgGray: [
        100,
        defaultBG
    ],
    bgRedBright: [
        101,
        defaultBG
    ],
    bgGreenBright: [
        102,
        defaultBG
    ],
    bgYellowBright: [
        103,
        defaultBG
    ],
    bgBlueBright: [
        104,
        defaultBG
    ],
    bgMagentaBright: [
        105,
        defaultBG
    ],
    bgCyanBright: [
        106,
        defaultBG
    ],
    bgWhiteBright: [
        107,
        defaultBG
    ]
});
const defaultFG = 39;
const defaultBG = 49;
const validateObject = hideStackFrames((value, name, options)=>{
    const useDefaultOptions = options == null;
    const allowArray = useDefaultOptions ? false : options.allowArray;
    const allowFunction = useDefaultOptions ? false : options.allowFunction;
    const nullable = useDefaultOptions ? false : options.nullable;
    if (!nullable && value === null || !allowArray && Array.isArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
        throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
    }
});
Object.defineProperty(inspect, "defaultOptions", {
    get () {
        return inspectDefaultOptions;
    },
    set (options) {
        validateObject(options, "options");
        return Object.assign(inspectDefaultOptions, options);
    }
});
function defineColorAlias(target, alias) {
    Object.defineProperty(inspect.colors, alias, {
        get () {
            return this[target];
        },
        set (value) {
            this[target] = value;
        },
        configurable: true,
        enumerable: false
    });
}
defineColorAlias("gray", "grey");
defineColorAlias("gray", "blackBright");
defineColorAlias("bgGray", "bgGrey");
defineColorAlias("bgGray", "bgBlackBright");
defineColorAlias("dim", "faint");
defineColorAlias("strikethrough", "crossedout");
defineColorAlias("strikethrough", "strikeThrough");
defineColorAlias("strikethrough", "crossedOut");
defineColorAlias("hidden", "conceal");
defineColorAlias("inverse", "swapColors");
defineColorAlias("inverse", "swapcolors");
defineColorAlias("doubleunderline", "doubleUnderline");
inspect.styles = Object.assign(Object.create(null), {
    special: "cyan",
    number: "yellow",
    bigint: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    symbol: "green",
    date: "magenta",
    regexp: "red",
    module: "underline"
});
function addQuotes(str, quotes) {
    if (quotes === -1) {
        return `"${str}"`;
    }
    if (quotes === -2) {
        return `\`${str}\``;
    }
    return `'${str}'`;
}
const escapeFn = (str)=>meta1[str.charCodeAt(0)]
;
function strEscape(str) {
    let escapeTest = strEscapeSequencesRegExp;
    let escapeReplace = strEscapeSequencesReplacer;
    let singleQuote = 39;
    if (str.includes("'")) {
        if (!str.includes('"')) {
            singleQuote = -1;
        } else if (!str.includes("`") && !str.includes("${")) {
            singleQuote = -2;
        }
        if (singleQuote !== 39) {
            escapeTest = strEscapeSequencesRegExpSingle;
            escapeReplace = strEscapeSequencesReplacerSingle;
        }
    }
    if (str.length < 5000 && !escapeTest.test(str)) {
        return addQuotes(str, singleQuote);
    }
    if (str.length > 100) {
        str = str.replace(escapeReplace, escapeFn);
        return addQuotes(str, singleQuote);
    }
    let result = "";
    let last = 0;
    const lastIndex = str.length;
    for(let i = 0; i < lastIndex; i++){
        const point = str.charCodeAt(i);
        if (point === singleQuote || point === 92 || point < 32 || point > 126 && point < 160) {
            if (last === i) {
                result += meta1[point];
            } else {
                result += `${str.slice(last, i)}${meta1[point]}`;
            }
            last = i + 1;
        }
    }
    if (last !== lastIndex) {
        result += str.slice(last);
    }
    return addQuotes(result, singleQuote);
}
function stylizeWithColor(str, styleType) {
    const style2 = inspect.styles[styleType];
    if (style2 !== undefined) {
        const color = inspect.colors[style2];
        if (color !== undefined) {
            return `\u001b[${color[0]}m${str}\u001b[${color[1]}m`;
        }
    }
    return str;
}
function stylizeNoColor(str) {
    return str;
}
function formatValue(ctx, value, recurseTimes, typedArray) {
    if (typeof value !== "object" && typeof value !== "function" && !isUndetectableObject(value)) {
        return formatPrimitive(ctx.stylize, value, ctx);
    }
    if (value === null) {
        return ctx.stylize("null", "null");
    }
    const context = value;
    const proxy = undefined;
    if (ctx.customInspect) {
        const maybeCustom = value[customInspectSymbol];
        if (typeof maybeCustom === "function" && maybeCustom !== inspect && !(value.constructor && value.constructor.prototype === value)) {
            const depth = ctx.depth === null ? null : ctx.depth - recurseTimes;
            const isCrossContext = proxy !== undefined || !(context instanceof Object);
            const ret = maybeCustom.call(context, depth, getUserOptions(ctx, isCrossContext));
            if (ret !== context) {
                if (typeof ret !== "string") {
                    return formatValue(ctx, ret, recurseTimes);
                }
                return ret.replace(/\n/g, `\n${" ".repeat(ctx.indentationLvl)}`);
            }
        }
    }
    if (ctx.seen.includes(value)) {
        let index = 1;
        if (ctx.circular === undefined) {
            ctx.circular = new Map();
            ctx.circular.set(value, index);
        } else {
            index = ctx.circular.get(value);
            if (index === undefined) {
                index = ctx.circular.size + 1;
                ctx.circular.set(value, index);
            }
        }
        return ctx.stylize(`[Circular *${index}]`, "special");
    }
    return formatRaw(ctx, value, recurseTimes, typedArray);
}
function formatRaw(ctx, value, recurseTimes, typedArray) {
    let keys;
    let protoProps;
    if (ctx.showHidden && (recurseTimes <= ctx.depth || ctx.depth === null)) {
        protoProps = [];
    }
    const constructor = getConstructorName(value, ctx, recurseTimes, protoProps);
    if (protoProps !== undefined && protoProps.length === 0) {
        protoProps = undefined;
    }
    let tag = value[Symbol.toStringTag];
    if (typeof tag !== "string") {
        tag = "";
    }
    let base3 = "";
    let formatter = getEmptyFormatArray;
    let braces;
    let noIterator = true;
    let i = 0;
    const filter = ctx.showHidden ? 0 : 2;
    let extrasType = 0;
    if (value[Symbol.iterator] || constructor === null) {
        noIterator = false;
        if (Array.isArray(value)) {
            const prefix = constructor !== "Array" || tag !== "" ? getPrefix(constructor, tag, "Array", `(${value.length})`) : "";
            keys = getOwnNonIndexProperties(value, filter);
            braces = [
                `${prefix}[`,
                "]"
            ];
            if (value.length === 0 && keys.length === 0 && protoProps === undefined) {
                return `${braces[0]}]`;
            }
            extrasType = kArrayExtrasType;
            formatter = formatArray;
        } else if (isSet1(value)) {
            const size = value.size;
            const prefix = getPrefix(constructor, tag, "Set", `(${size})`);
            keys = getKeys(value, ctx.showHidden);
            formatter = constructor !== null ? formatSet.bind(null, value) : formatSet.bind(null, value.values());
            if (size === 0 && keys.length === 0 && protoProps === undefined) {
                return `${prefix}{}`;
            }
            braces = [
                `${prefix}{`,
                "}"
            ];
        } else if (isMap1(value)) {
            const size = value.size;
            const prefix = getPrefix(constructor, tag, "Map", `(${size})`);
            keys = getKeys(value, ctx.showHidden);
            formatter = constructor !== null ? formatMap.bind(null, value) : formatMap.bind(null, value.entries());
            if (size === 0 && keys.length === 0 && protoProps === undefined) {
                return `${prefix}{}`;
            }
            braces = [
                `${prefix}{`,
                "}"
            ];
        } else if (isTypedArray(value)) {
            keys = getOwnNonIndexProperties(value, filter);
            const bound = value;
            const fallback = "";
            const size = value.length;
            const prefix = getPrefix(constructor, tag, fallback, `(${size})`);
            braces = [
                `${prefix}[`,
                "]"
            ];
            if (value.length === 0 && keys.length === 0 && !ctx.showHidden) {
                return `${braces[0]}]`;
            }
            formatter = formatTypedArray.bind(null, bound, size);
            extrasType = kArrayExtrasType;
        } else if (isMapIterator1(value)) {
            keys = getKeys(value, ctx.showHidden);
            braces = getIteratorBraces("Map", tag);
            formatter = formatIterator.bind(null, braces);
        } else if (isSetIterator1(value)) {
            keys = getKeys(value, ctx.showHidden);
            braces = getIteratorBraces("Set", tag);
            formatter = formatIterator.bind(null, braces);
        } else {
            noIterator = true;
        }
    }
    if (noIterator) {
        keys = getKeys(value, ctx.showHidden);
        braces = [
            "{",
            "}"
        ];
        if (constructor === "Object") {
            if (isArgumentsObject1(value)) {
                braces[0] = "[Arguments] {";
            } else if (tag !== "") {
                braces[0] = `${getPrefix(constructor, tag, "Object")}{`;
            }
            if (keys.length === 0 && protoProps === undefined) {
                return `${braces[0]}}`;
            }
        } else if (typeof value === "function") {
            base3 = getFunctionBase(value, constructor, tag);
            if (keys.length === 0 && protoProps === undefined) {
                return ctx.stylize(base3, "special");
            }
        } else if (isRegExp1(value)) {
            base3 = RegExp(constructor !== null ? value : new RegExp(value)).toString();
            const prefix = getPrefix(constructor, tag, "RegExp");
            if (prefix !== "RegExp ") {
                base3 = `${prefix}${base3}`;
            }
            if (keys.length === 0 && protoProps === undefined || recurseTimes > ctx.depth && ctx.depth !== null) {
                return ctx.stylize(base3, "regexp");
            }
        } else if (isDate1(value)) {
            base3 = Number.isNaN(value.getTime()) ? value.toString() : value.toISOString();
            const prefix = getPrefix(constructor, tag, "Date");
            if (prefix !== "Date ") {
                base3 = `${prefix}${base3}`;
            }
            if (keys.length === 0 && protoProps === undefined) {
                return ctx.stylize(base3, "date");
            }
        } else if (value instanceof Error) {
            base3 = formatError(value, constructor, tag, ctx, keys);
            if (keys.length === 0 && protoProps === undefined) {
                return base3;
            }
        } else if (isAnyArrayBuffer1(value)) {
            const arrayType = isArrayBuffer1(value) ? "ArrayBuffer" : "SharedArrayBuffer";
            const prefix = getPrefix(constructor, tag, arrayType);
            if (typedArray === undefined) {
                formatter = formatArrayBuffer;
            } else if (keys.length === 0 && protoProps === undefined) {
                return prefix + `{ byteLength: ${formatNumber(ctx.stylize, value.byteLength)} }`;
            }
            braces[0] = `${prefix}{`;
            Array.prototype.unshift(keys, "byteLength");
        } else if (isDataView1(value)) {
            braces[0] = `${getPrefix(constructor, tag, "DataView")}{`;
            Array.prototype.unshift(keys, "byteLength", "byteOffset", "buffer");
        } else if (isPromise1(value)) {
            braces[0] = `${getPrefix(constructor, tag, "Promise")}{`;
            formatter = formatPromise;
        } else if (isWeakSet1(value)) {
            braces[0] = `${getPrefix(constructor, tag, "WeakSet")}{`;
            formatter = ctx.showHidden ? formatWeakSet : formatWeakCollection;
        } else if (isWeakMap1(value)) {
            braces[0] = `${getPrefix(constructor, tag, "WeakMap")}{`;
            formatter = ctx.showHidden ? formatWeakMap : formatWeakCollection;
        } else if (isModuleNamespaceObject1(value)) {
            braces[0] = `${getPrefix(constructor, tag, "Module")}{`;
            formatter = formatNamespaceObject.bind(null, keys);
        } else if (isBoxedPrimitive1(value)) {
            base3 = getBoxedBase(value, ctx, keys, constructor, tag);
            if (keys.length === 0 && protoProps === undefined) {
                return base3;
            }
        } else {
            if (keys.length === 0 && protoProps === undefined) {
                return `${getCtxStyle(value, constructor, tag)}{}`;
            }
            braces[0] = `${getCtxStyle(value, constructor, tag)}{`;
        }
    }
    if (recurseTimes > ctx.depth && ctx.depth !== null) {
        let constructorName = getCtxStyle(value, constructor, tag).slice(0, -1);
        if (constructor !== null) {
            constructorName = `[${constructorName}]`;
        }
        return ctx.stylize(constructorName, "special");
    }
    recurseTimes += 1;
    ctx.seen.push(value);
    ctx.currentDepth = recurseTimes;
    let output;
    const indentationLvl = ctx.indentationLvl;
    try {
        output = formatter(ctx, value, recurseTimes);
        for(i = 0; i < keys.length; i++){
            output.push(formatProperty(ctx, value, recurseTimes, keys[i], extrasType));
        }
        if (protoProps !== undefined) {
            output.push(...protoProps);
        }
    } catch (err) {
        const constructorName = getCtxStyle(value, constructor, tag).slice(0, -1);
        return handleMaxCallStackSize(ctx, err, constructorName, indentationLvl);
    }
    if (ctx.circular !== undefined) {
        const index = ctx.circular.get(value);
        if (index !== undefined) {
            const reference = ctx.stylize(`<ref *${index}>`, "special");
            if (ctx.compact !== true) {
                base3 = base3 === "" ? reference : `${reference} ${base3}`;
            } else {
                braces[0] = `${reference} ${braces[0]}`;
            }
        }
    }
    ctx.seen.pop();
    if (ctx.sorted) {
        const comparator = ctx.sorted === true ? undefined : ctx.sorted;
        if (extrasType === 0) {
            output = output.sort(comparator);
        } else if (keys.length > 1) {
            const sorted = output.slice(output.length - keys.length).sort(comparator);
            output.splice(output.length - keys.length, keys.length, ...sorted);
        }
    }
    const res = reduceToSingleString(ctx, output, base3, braces, extrasType, recurseTimes, value);
    const budget = ctx.budget[ctx.indentationLvl] || 0;
    const newLength = budget + res.length;
    ctx.budget[ctx.indentationLvl] = newLength;
    if (newLength > 2 ** 27) {
        ctx.depth = -1;
    }
    return res;
}
const builtInObjects = new Set(Object.getOwnPropertyNames(globalThis).filter((e)=>/^[A-Z][a-zA-Z0-9]+$/.test(e)
));
function addPrototypeProperties(ctx, main, obj, recurseTimes, output) {
    let depth = 0;
    let keys;
    let keySet;
    do {
        if (depth !== 0 || main === obj) {
            obj = Object.getPrototypeOf(obj);
            if (obj === null) {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(obj, "constructor");
            if (descriptor !== undefined && typeof descriptor.value === "function" && builtInObjects.has(descriptor.value.name)) {
                return;
            }
        }
        if (depth === 0) {
            keySet = new Set();
        } else {
            Array.prototype.forEach(keys, (key)=>keySet.add(key)
            );
        }
        keys = Reflect.ownKeys(obj);
        Array.prototype.push(ctx.seen, main);
        for (const key1 of keys){
            if (key1 === "constructor" || main.hasOwnProperty(key1) || depth !== 0 && keySet.has(key1)) {
                continue;
            }
            const desc = Object.getOwnPropertyDescriptor(obj, key1);
            if (typeof desc.value === "function") {
                continue;
            }
            const value = formatProperty(ctx, obj, recurseTimes, key1, 0, desc, main);
            if (ctx.colors) {
                Array.prototype.push(output, `\u001b[2m${value}\u001b[22m`);
            } else {
                Array.prototype.push(output, value);
            }
        }
        Array.prototype.pop(ctx.seen);
    }while (++depth !== 3)
}
function getConstructorName(obj, ctx, recurseTimes, protoProps) {
    let firstProto;
    const tmp = obj;
    while(obj || isUndetectableObject(obj)){
        const descriptor = Object.getOwnPropertyDescriptor(obj, "constructor");
        if (descriptor !== undefined && typeof descriptor.value === "function" && descriptor.value.name !== "" && isInstanceof(tmp, descriptor.value)) {
            if (protoProps !== undefined && (firstProto !== obj || !builtInObjects.has(descriptor.value.name))) {
                addPrototypeProperties(ctx, tmp, firstProto || tmp, recurseTimes, protoProps);
            }
            return descriptor.value.name;
        }
        obj = Object.getPrototypeOf(obj);
        if (firstProto === undefined) {
            firstProto = obj;
        }
    }
    if (firstProto === null) {
        return null;
    }
    const res = undefined;
    if (recurseTimes > ctx.depth && ctx.depth !== null) {
        return `${res} <Complex prototype>`;
    }
    const protoConstr = getConstructorName(firstProto, ctx, recurseTimes + 1, protoProps);
    if (protoConstr === null) {
        return `${res} <${inspect(firstProto, {
            ...ctx,
            customInspect: false,
            depth: -1
        })}>`;
    }
    return `${res} <${protoConstr}>`;
}
function formatPrimitive(fn, value, ctx) {
    if (typeof value === "string") {
        let trailer = "";
        if (value.length > ctx.maxStringLength) {
            const remaining = value.length - ctx.maxStringLength;
            value = value.slice(0, ctx.maxStringLength);
            trailer = `... ${remaining} more character${remaining > 1 ? "s" : ""}`;
        }
        if (ctx.compact !== true && value.length > 16 && value.length > ctx.breakLength - ctx.indentationLvl - 4) {
            return value.split(/(?<=\n)/).map((line)=>fn(strEscape(line), "string")
            ).join(` +\n${" ".repeat(ctx.indentationLvl + 2)}`) + trailer;
        }
        return fn(strEscape(value), "string") + trailer;
    }
    if (typeof value === "number") {
        return formatNumber(fn, value);
    }
    if (typeof value === "bigint") {
        return formatBigInt(fn, value);
    }
    if (typeof value === "boolean") {
        return fn(`${value}`, "boolean");
    }
    if (typeof value === "undefined") {
        return fn("undefined", "undefined");
    }
    return fn(value.toString(), "symbol");
}
function getEmptyFormatArray() {
    return [];
}
function isInstanceof(object, proto1) {
    try {
        return object instanceof proto1;
    } catch  {
        return false;
    }
}
function getPrefix(constructor, tag, fallback, size = "") {
    if (constructor === null) {
        if (tag !== "" && fallback !== tag) {
            return `[${fallback}${size}: null prototype] [${tag}] `;
        }
        return `[${fallback}${size}: null prototype] `;
    }
    if (tag !== "" && constructor !== tag) {
        return `${constructor}${size} [${tag}] `;
    }
    return `${constructor}${size} `;
}
function formatArray(ctx, value, recurseTimes) {
    const valLen = value.length;
    const len = Math.min(Math.max(0, ctx.maxArrayLength), valLen);
    const remaining = valLen - len;
    const output = [];
    for(let i = 0; i < len; i++){
        if (!value.hasOwnProperty(i)) {
            return formatSpecialArray(ctx, value, recurseTimes, len, output, i);
        }
        output.push(formatProperty(ctx, value, recurseTimes, i, 1));
    }
    if (remaining > 0) {
        output.push(`... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    }
    return output;
}
function getCtxStyle(_value, constructor, tag) {
    let fallback = "";
    if (constructor === null) {
        if (fallback === tag) {
            fallback = "Object";
        }
    }
    return getPrefix(constructor, tag, fallback);
}
function getKeys(value, showHidden) {
    let keys;
    const symbols = Object.getOwnPropertySymbols(value);
    if (showHidden) {
        keys = Object.getOwnPropertyNames(value);
        if (symbols.length !== 0) {
            Array.prototype.push.apply(keys, symbols);
        }
    } else {
        try {
            keys = Object.keys(value);
        } catch (_err) {
            keys = Object.getOwnPropertyNames(value);
        }
        if (symbols.length !== 0) {
        }
    }
    return keys;
}
function formatSet(value, ctx, _ignored, recurseTimes) {
    const output = [];
    ctx.indentationLvl += 2;
    for (const v of value){
        Array.prototype.push(output, formatValue(ctx, v, recurseTimes));
    }
    ctx.indentationLvl -= 2;
    return output;
}
function formatMap(value, ctx, _gnored, recurseTimes) {
    const output = [];
    ctx.indentationLvl += 2;
    for (const { 0: k , 1: v  } of value){
        output.push(`${formatValue(ctx, k, recurseTimes)} => ${formatValue(ctx, v, recurseTimes)}`);
    }
    ctx.indentationLvl -= 2;
    return output;
}
function formatTypedArray(value, length, ctx, _ignored, recurseTimes) {
    const maxLength = Math.min(Math.max(0, ctx.maxArrayLength), length);
    const remaining = value.length - maxLength;
    const output = new Array(maxLength);
    const elementFormatter = value.length > 0 && typeof value[0] === "number" ? formatNumber : formatBigInt;
    for(let i = 0; i < maxLength; ++i){
        output[i] = elementFormatter(ctx.stylize, value[i]);
    }
    if (remaining > 0) {
        output[maxLength] = `... ${remaining} more item${remaining > 1 ? "s" : ""}`;
    }
    if (ctx.showHidden) {
        ctx.indentationLvl += 2;
        for (const key of [
            "BYTES_PER_ELEMENT",
            "length",
            "byteLength",
            "byteOffset",
            "buffer", 
        ]){
            const str = formatValue(ctx, value[key], recurseTimes, true);
            Array.prototype.push(output, `[${key}]: ${str}`);
        }
        ctx.indentationLvl -= 2;
    }
    return output;
}
function getIteratorBraces(type, tag) {
    if (tag !== `${type} Iterator`) {
        if (tag !== "") {
            tag += "] [";
        }
        tag += `${type} Iterator`;
    }
    return [
        `[${tag}] {`,
        "}"
    ];
}
function formatIterator(braces, ctx, value, recurseTimes) {
    const { 0: entries , 1: isKeyValue  } = value;
    if (isKeyValue) {
        braces[0] = braces[0].replace(/ Iterator] {$/, " Entries] {");
        return formatMapIterInner(ctx, recurseTimes, entries, 2);
    }
    return formatSetIterInner(ctx, recurseTimes, entries, 1);
}
function getFunctionBase(value, constructor, tag) {
    const stringified = Function.prototype.toString(value);
    if (stringified.slice(0, 5) === "class" && stringified.endsWith("}")) {
        const slice = stringified.slice(5, -1);
        const bracketIndex = slice.indexOf("{");
        if (bracketIndex !== -1 && (!slice.slice(0, bracketIndex).includes("(") || classRegExp1.test(slice.replace(stripCommentsRegExp)))) {
            return getClassBase(value, constructor, tag);
        }
    }
    let type = "Function";
    if (isGeneratorFunction1(value)) {
        type = `Generator${type}`;
    }
    if (isAsyncFunction1(value)) {
        type = `Async${type}`;
    }
    let base4 = `[${type}`;
    if (constructor === null) {
        base4 += " (null prototype)";
    }
    if (value.name === "") {
        base4 += " (anonymous)";
    } else {
        base4 += `: ${value.name}`;
    }
    base4 += "]";
    if (constructor !== type && constructor !== null) {
        base4 += ` ${constructor}`;
    }
    if (tag !== "" && constructor !== tag) {
        base4 += ` [${tag}]`;
    }
    return base4;
}
function formatError(err, constructor, tag, ctx, keys) {
    const name = err.name != null ? String(err.name) : "Error";
    let len = name.length;
    let stack = err.stack ? String(err.stack) : err.toString();
    if (!ctx.showHidden && keys.length !== 0) {
        for (const name of [
            "name",
            "message",
            "stack"
        ]){
            const index = keys.indexOf(name);
            if (index !== -1 && stack.includes(err[name])) {
                keys.splice(index, 1);
            }
        }
    }
    if (constructor === null || name.endsWith("Error") && stack.startsWith(name) && (stack.length === len || stack[len] === ":" || stack[len] === "\n")) {
        let fallback = "Error";
        if (constructor === null) {
            const start = stack.match(/^([A-Z][a-z_ A-Z0-9[\]()-]+)(?::|\n {4}at)/) || stack.match(/^([a-z_A-Z0-9-]*Error)$/);
            fallback = start && start[1] || "";
            len = fallback.length;
            fallback = fallback || "Error";
        }
        const prefix = getPrefix(constructor, tag, fallback).slice(0, -1);
        if (name !== prefix) {
            if (prefix.includes(name)) {
                if (len === 0) {
                    stack = `${prefix}: ${stack}`;
                } else {
                    stack = `${prefix}${stack.slice(len)}`;
                }
            } else {
                stack = `${prefix} [${name}]${stack.slice(len)}`;
            }
        }
    }
    let pos = err.message && stack.indexOf(err.message) || -1;
    if (pos !== -1) {
        pos += err.message.length;
    }
    const stackStart = stack.indexOf("\n    at", pos);
    if (stackStart === -1) {
        stack = `[${stack}]`;
    } else if (ctx.colors) {
        let newStack = stack.slice(0, stackStart);
        const lines = stack.slice(stackStart + 1).split("\n");
        for (const line of lines){
            let nodeModule;
            newStack += "\n";
            let pos = 0;
            while(nodeModule = nodeModulesRegExp.exec(line)){
                newStack += line.slice(pos, nodeModule.index + 14);
                newStack += ctx.stylize(nodeModule[1], "module");
                pos = nodeModule.index + nodeModule[0].length;
            }
            newStack += pos === 0 ? line : line.slice(pos);
        }
        stack = newStack;
    }
    if (ctx.indentationLvl !== 0) {
        const indentation = " ".repeat(ctx.indentationLvl);
        stack = stack.replace(/\n/g, `\n${indentation}`);
    }
    return stack;
}
let hexSlice;
function formatArrayBuffer(ctx, value) {
    let buffer;
    try {
        buffer = new Uint8Array(value);
    } catch  {
        return [
            ctx.stylize("(detached)", "special")
        ];
    }
    let str = hexSlice(buffer, 0, Math.min(ctx.maxArrayLength, buffer.length)).replace(/(.{2})/g, "$1 ").trim();
    const remaining = buffer.length - ctx.maxArrayLength;
    if (remaining > 0) {
        str += ` ... ${remaining} more byte${remaining > 1 ? "s" : ""}`;
    }
    return [
        `${ctx.stylize("[Uint8Contents]", "special")}: <${str}>`
    ];
}
function formatNumber(fn, value) {
    return fn(Object.is(value, -0) ? "-0" : `${value}`, "number");
}
function formatPromise(ctx, value, recurseTimes) {
    let output;
    const { 0: state , 1: result  } = value;
    if (state === 0) {
        output = [
            ctx.stylize("<pending>", "special")
        ];
    } else {
        ctx.indentationLvl += 2;
        const str = formatValue(ctx, result, recurseTimes);
        ctx.indentationLvl -= 2;
        output = [
            state === kRejected ? `${ctx.stylize("<rejected>", "special")} ${str}` : str, 
        ];
    }
    return output;
}
function formatWeakCollection(ctx) {
    return [
        ctx.stylize("<items unknown>", "special")
    ];
}
function formatWeakSet(ctx, value, recurseTimes) {
    const entries = value;
    return formatSetIterInner(ctx, recurseTimes, entries, 0);
}
function formatWeakMap(ctx, value, recurseTimes) {
    const entries = value;
    return formatMapIterInner(ctx, recurseTimes, entries, 0);
}
function formatProperty(ctx, value, recurseTimes, key, type, desc, original = value) {
    let name, str;
    let extra = " ";
    desc = desc || Object.getOwnPropertyDescriptor(value, key) || {
        value: value[key],
        enumerable: true
    };
    if (desc.value !== undefined) {
        const diff = ctx.compact !== true || type !== 0 ? 2 : 3;
        ctx.indentationLvl += diff;
        str = formatValue(ctx, desc.value, recurseTimes);
        if (diff === 3 && ctx.breakLength < getStringWidth(str, ctx.colors)) {
            extra = `\n${" ".repeat(ctx.indentationLvl)}`;
        }
        ctx.indentationLvl -= diff;
    } else if (desc.get !== undefined) {
        const label = desc.set !== undefined ? "Getter/Setter" : "Getter";
        const s = ctx.stylize;
        const sp = "special";
        if (ctx.getters && (ctx.getters === true || ctx.getters === "get" && desc.set === undefined || ctx.getters === "set" && desc.set !== undefined)) {
            try {
                const tmp = desc.get.call(original);
                ctx.indentationLvl += 2;
                if (tmp === null) {
                    str = `${s(`[${label}:`, sp)} ${s("null", "null")}${s("]", sp)}`;
                } else if (typeof tmp === "object") {
                    str = `${s(`[${label}]`, sp)} ${formatValue(ctx, tmp, recurseTimes)}`;
                } else {
                    const primitive = formatPrimitive(s, tmp, ctx);
                    str = `${s(`[${label}:`, sp)} ${primitive}${s("]", sp)}`;
                }
                ctx.indentationLvl -= 2;
            } catch (err) {
                const message = `<Inspection threw (${err.message})>`;
                str = `${s(`[${label}:`, sp)} ${message}${s("]", sp)}`;
            }
        } else {
            str = ctx.stylize(`[${label}]`, sp);
        }
    } else if (desc.set !== undefined) {
        str = ctx.stylize("[Setter]", "special");
    } else {
        str = ctx.stylize("undefined", "undefined");
    }
    if (type === 1) {
        return str;
    }
    if (typeof key === "symbol") {
        const tmp = key.toString().replace(strEscapeSequencesReplacer, escapeFn);
        name = `[${ctx.stylize(tmp, "symbol")}]`;
    } else if (key === "__proto__") {
        name = "['__proto__']";
    } else if (desc.enumerable === false) {
        const tmp = key.replace(strEscapeSequencesReplacer, escapeFn);
        name = `[${tmp}]`;
    } else if (keyStrRegExp.test(key)) {
        name = ctx.stylize(key, "name");
    } else {
        name = ctx.stylize(strEscape(key), "string");
    }
    return `${name}:${extra}${str}`;
}
function handleMaxCallStackSize(_ctx, _err, _constructorName, _indentationLvl) {
}
const colorRegExp = /\u001b\[\d\d?m/g;
function removeColors(str) {
    return str.replace(colorRegExp, "");
}
function isBelowBreakLength(ctx, output, start, base5) {
    let totalLength = output.length + start;
    if (totalLength + output.length > ctx.breakLength) {
        return false;
    }
    for(let i = 0; i < output.length; i++){
        if (ctx.colors) {
            totalLength += removeColors(output[i]).length;
        } else {
            totalLength += output[i].length;
        }
        if (totalLength > ctx.breakLength) {
            return false;
        }
    }
    return base5 === "" || !base5.includes("\n");
}
function formatBigInt(fn, value) {
    return fn(`${value}n`, "bigint");
}
function formatNamespaceObject(keys, ctx, value, recurseTimes) {
    const output = new Array(keys.length);
    for(let i = 0; i < keys.length; i++){
        try {
            output[i] = formatProperty(ctx, value, recurseTimes, keys[i], kObjectType);
        } catch (_err) {
            const tmp = {
                [keys[i]]: ""
            };
            output[i] = formatProperty(ctx, tmp, recurseTimes, keys[i], kObjectType);
            const pos = output[i].lastIndexOf(" ");
            output[i] = output[i].slice(0, pos + 1) + ctx.stylize("<uninitialized>", "special");
        }
    }
    keys.length = 0;
    return output;
}
function formatSpecialArray(ctx, value, recurseTimes, maxLength, output, i) {
    const keys = Object.keys(value);
    let index = i;
    for(; i < keys.length && output.length < maxLength; i++){
        const key = keys[i];
        const tmp = +key;
        if (tmp > 2 ** 32 - 2) {
            break;
        }
        if (`${index}` !== key) {
            if (!numberRegExp.test(key)) {
                break;
            }
            const emptyItems = tmp - index;
            const ending = emptyItems > 1 ? "s" : "";
            const message = `<${emptyItems} empty item${ending}>`;
            output.push(ctx.stylize(message, "undefined"));
            index = tmp;
            if (output.length === maxLength) {
                break;
            }
        }
        output.push(formatProperty(ctx, value, recurseTimes, key, 1));
        index++;
    }
    const remaining = value.length - index;
    if (output.length !== maxLength) {
        if (remaining > 0) {
            const ending = remaining > 1 ? "s" : "";
            const message = `<${remaining} empty item${ending}>`;
            output.push(ctx.stylize(message, "undefined"));
        }
    } else if (remaining > 0) {
        output.push(`... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    }
    return output;
}
function getBoxedBase(value, ctx, keys, constructor, tag) {
    let type;
    if (isNumberObject1(value)) {
        type = "Number";
    } else if (isStringObject1(value)) {
        type = "String";
        keys.splice(0, value.length);
    } else if (isBooleanObject1(value)) {
        type = "Boolean";
    } else if (isBigIntObject1(value)) {
        type = "BigInt";
    } else {
        type = "Symbol";
    }
    let base6 = `[${type}`;
    if (type !== constructor) {
        if (constructor === null) {
            base6 += " (null prototype)";
        } else {
            base6 += ` (${constructor})`;
        }
    }
    base6 += `: ${formatPrimitive(stylizeNoColor, value.valueOf(), ctx)}]`;
    if (tag !== "" && tag !== constructor) {
        base6 += ` [${tag}]`;
    }
    if (keys.length !== 0 || ctx.stylize === stylizeNoColor) {
        return base6;
    }
    return ctx.stylize(base6, type.toLowerCase());
}
function getClassBase(value, constructor, tag) {
    const hasName = value.hasOwnProperty("name");
    const name = hasName && value.name || "(anonymous)";
    let base7 = `class ${name}`;
    if (constructor !== "Function" && constructor !== null) {
        base7 += ` [${constructor}]`;
    }
    if (tag !== "" && constructor !== tag) {
        base7 += ` [${tag}]`;
    }
    if (constructor !== null) {
        const superName = Object.getPrototypeOf(value).name;
        if (superName) {
            base7 += ` extends ${superName}`;
        }
    } else {
        base7 += " extends [null prototype]";
    }
    return `[${base7}]`;
}
function reduceToSingleString(ctx, output, base8, braces, extrasType, recurseTimes, value) {
    if (ctx.compact !== true) {
        if (typeof ctx.compact === "number" && ctx.compact >= 1) {
            const entries = output.length;
            if (extrasType === 2 && entries > 6) {
                output = groupArrayElements(ctx, output, value);
            }
            if (ctx.currentDepth - recurseTimes < ctx.compact && entries === output.length) {
                const start = output.length + ctx.indentationLvl + braces[0].length + base8.length + 10;
                if (isBelowBreakLength(ctx, output, start, base8)) {
                    return `${base8 ? `${base8} ` : ""}${braces[0]} ${join7(output, ", ")}` + ` ${braces[1]}`;
                }
            }
        }
        const indentation = `\n${" ".repeat(ctx.indentationLvl)}`;
        return `${base8 ? `${base8} ` : ""}${braces[0]}${indentation}  ` + `${join7(output, `,${indentation}  `)}${indentation}${braces[1]}`;
    }
    if (isBelowBreakLength(ctx, output, 0, base8)) {
        return `${braces[0]}${base8 ? ` ${base8}` : ""} ${join7(output, ", ")} ` + braces[1];
    }
    const indentation = " ".repeat(ctx.indentationLvl);
    const ln = base8 === "" && braces[0].length === 1 ? " " : `${base8 ? ` ${base8}` : ""}\n${indentation}  `;
    return `${braces[0]}${ln}${join7(output, `,\n${indentation}  `)} ${braces[1]}`;
}
function join7(output, separator) {
    let str = "";
    if (output.length !== 0) {
        const lastIndex = output.length - 1;
        for(let i = 0; i < lastIndex; i++){
            str += output[i];
            str += separator;
        }
        str += output[lastIndex];
    }
    return str;
}
function groupArrayElements(ctx, output, value) {
    let totalLength = 0;
    let maxLength = 0;
    let i = 0;
    let outputLength = output.length;
    if (ctx.maxArrayLength < output.length) {
        outputLength--;
    }
    const separatorSpace = 2;
    const dataLen = new Array(outputLength);
    for(; i < outputLength; i++){
        const len = getStringWidth(output[i], ctx.colors);
        dataLen[i] = len;
        totalLength += len + separatorSpace;
        if (maxLength < len) {
            maxLength = len;
        }
    }
    const actualMax = maxLength + 2;
    if (actualMax * 3 + ctx.indentationLvl < ctx.breakLength && (totalLength / actualMax > 5 || maxLength <= 6)) {
        const averageBias = Math.sqrt(actualMax - totalLength / output.length);
        const biasedMax = Math.max(actualMax - 3 - averageBias, 1);
        const columns = Math.min(Math.round(Math.sqrt(2.5 * biasedMax * outputLength) / biasedMax), Math.floor((ctx.breakLength - ctx.indentationLvl) / actualMax), ctx.compact * 4, 15);
        if (columns <= 1) {
            return output;
        }
        const tmp = [];
        const maxLineLength = [];
        for(let i = 0; i < columns; i++){
            let lineMaxLength = 0;
            for(let j = i; j < output.length; j += columns){
                if (dataLen[j] > lineMaxLength) {
                    lineMaxLength = dataLen[j];
                }
            }
            lineMaxLength += separatorSpace;
            maxLineLength[i] = lineMaxLength;
        }
        let order = String.prototype.padStart;
        if (value !== undefined) {
            for(let i = 0; i < output.length; i++){
                if (typeof value[i] !== "number" && typeof value[i] !== "bigint") {
                    order = String.prototype.padEnd;
                    break;
                }
            }
        }
        for(let i1 = 0; i1 < outputLength; i1 += columns){
            const max = Math.min(i1 + columns, outputLength);
            let str = "";
            let j = i1;
            for(; j < max - 1; j++){
                const padding = maxLineLength[j - i1] + output[j].length - dataLen[j];
                str += `${output[j]}, `.padStart(padding, " ");
            }
            if (order === String.prototype.padStart) {
                const padding = maxLineLength[j - i1] + output[j].length - dataLen[j] - 2;
                str += output[j].padStart(padding, " ");
            } else {
                str += output[j];
            }
            Array.prototype.push(tmp, str);
        }
        if (ctx.maxArrayLength < output.length) {
            Array.prototype.push(tmp, output[outputLength]);
        }
        output = tmp;
    }
    return output;
}
function formatMapIterInner(ctx, recurseTimes, entries, state) {
    const maxArrayLength = Math.max(ctx.maxArrayLength, 0);
    const len = entries.length / 2;
    const remaining = len - maxArrayLength;
    const maxLength = Math.min(maxArrayLength, len);
    let output = new Array(maxLength);
    let i = 0;
    ctx.indentationLvl += 2;
    if (state === 0) {
        for(; i < maxLength; i++){
            const pos = i * 2;
            output[i] = `${formatValue(ctx, entries[pos], recurseTimes)} => ${formatValue(ctx, entries[pos + 1], recurseTimes)}`;
        }
        if (!ctx.sorted) {
            output = output.sort();
        }
    } else {
        for(; i < maxLength; i++){
            const pos = i * 2;
            const res = [
                formatValue(ctx, entries[pos], recurseTimes),
                formatValue(ctx, entries[pos + 1], recurseTimes), 
            ];
            output[i] = reduceToSingleString(ctx, res, "", [
                "[",
                "]"
            ], kArrayExtrasType, recurseTimes);
        }
    }
    ctx.indentationLvl -= 2;
    if (remaining > 0) {
        output.push(`... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    }
    return output;
}
function formatSetIterInner(ctx, recurseTimes, entries, state) {
    const maxArrayLength = Math.max(ctx.maxArrayLength, 0);
    const maxLength = Math.min(maxArrayLength, entries.length);
    const output = new Array(maxLength);
    ctx.indentationLvl += 2;
    for(let i = 0; i < maxLength; i++){
        output[i] = formatValue(ctx, entries[i], recurseTimes);
    }
    ctx.indentationLvl -= 2;
    if (state === 0 && !ctx.sorted) {
        output.sort();
    }
    const remaining = entries.length - maxLength;
    if (remaining > 0) {
        Array.prototype.push(output, `... ${remaining} more item${remaining > 1 ? "s" : ""}`);
    }
    return output;
}
const ansiPattern = "[\\u001B\\u009B][[\\]()#;?]*" + "(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*" + "|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)" + "|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))";
const ansi = new RegExp(ansiPattern, "g");
function getStringWidth(str, removeControlChars = true) {
    let width = 0;
    if (removeControlChars) {
        str = stripVTControlCharacters(str);
    }
    str = str.normalize("NFC");
    for (const __char of str[Symbol.iterator]()){
        const code = __char.codePointAt(0);
        if (isFullWidthCodePoint(code)) {
            width += 2;
        } else if (!isZeroWidthCodePoint(code)) {
            width++;
        }
    }
    return width;
}
const isFullWidthCodePoint = (code)=>{
    return code >= 4352 && (code <= 4447 || code === 9001 || code === 9002 || code >= 11904 && code <= 12871 && code !== 12351 || code >= 12880 && code <= 19903 || code >= 19968 && code <= 42182 || code >= 43360 && code <= 43388 || code >= 44032 && code <= 55203 || code >= 63744 && code <= 64255 || code >= 65040 && code <= 65049 || code >= 65072 && code <= 65131 || code >= 65281 && code <= 65376 || code >= 65504 && code <= 65510 || code >= 110592 && code <= 110593 || code >= 127488 && code <= 127569 || code >= 127744 && code <= 128591 || code >= 131072 && code <= 262141);
};
const isZeroWidthCodePoint = (code)=>{
    return code <= 31 || code >= 127 && code <= 159 || code >= 768 && code <= 879 || code >= 8203 && code <= 8207 || code >= 8400 && code <= 8447 || code >= 65024 && code <= 65039 || code >= 65056 && code <= 65071 || code >= 917760 && code <= 917999;
};
function nextTick2(callback, ...args) {
    _nextTick(callback, ...args);
}
let debugImpls;
let testEnabled;
function initializeDebugEnv(debugEnv) {
    debugImpls = Object.create(null);
    if (debugEnv) {
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replaceAll("*", ".*").replaceAll(",", "$|^");
        const debugEnvRegex = new RegExp(`^${debugEnv}$`, "i");
        testEnabled = (str)=>debugEnvRegex.exec(str) !== null
        ;
    } else {
        testEnabled = ()=>false
        ;
    }
}
function emitWarningIfNeeded(set) {
    if ("HTTP" === set || "HTTP2" === set) {
        console.warn("Setting the NODE_DEBUG environment variable " + "to '" + set.toLowerCase() + "' can expose sensitive " + "data (such as passwords, tokens and authentication headers) " + "in the resulting log.");
    }
}
const noop = ()=>{
};
function debuglogImpl(enabled, set) {
    if (debugImpls[set] === undefined) {
        if (enabled) {
            emitWarningIfNeeded(set);
            debugImpls[set] = function debug(...args) {
                const msg = args.map((arg)=>inspect(arg)
                ).join(" ");
                console.error(sprintf("%s %s: %s\n", set, String(Deno.pid), msg));
            };
        } else {
            debugImpls[set] = noop;
        }
    }
    return debugImpls[set];
}
function debuglog(set, cb) {
    function init() {
        set = set.toUpperCase();
        enabled = testEnabled(set);
    }
    let debug1 = (...args)=>{
        init();
        debug1 = debuglogImpl(enabled, set);
        if (typeof cb === "function") {
            cb(debug1);
        }
        return debug1(...args);
    };
    let enabled;
    let test = ()=>{
        init();
        test = ()=>enabled
        ;
        return enabled;
    };
    const logger = (...args)=>debug1(...args)
    ;
    Object.defineProperty(logger, "enabled", {
        get () {
            return test();
        },
        configurable: true,
        enumerable: true
    });
    return logger;
}
function uvErrmapGet(name) {
    return errorMap.get(name);
}
const uvUnmappedError = [
    "UNKNOWN",
    "unknown error"
];
const uvException = hideStackFrames(function uvException(ctx) {
    const { 0: code , 1: uvmsg  } = uvErrmapGet(ctx.errno) || uvUnmappedError;
    let message = `${code}: ${ctx.message || uvmsg}, ${ctx.syscall}`;
    let path49;
    let dest;
    if (ctx.path) {
        path49 = ctx.path.toString();
        message += ` '${path49}'`;
    }
    if (ctx.dest) {
        dest = ctx.dest.toString();
        message += ` -> '${dest}'`;
    }
    const err = new Error(message);
    for (const prop of Object.keys(ctx)){
        if (prop === "message" || prop === "path" || prop === "dest") {
            continue;
        }
        err[prop] = ctx[prop];
    }
    err.code = code;
    if (path49) {
        err.path = path49;
    }
    if (dest) {
        err.dest = dest;
    }
    return captureLargerStackTrace(err);
});
class ERR_OUT_OF_RANGE extends RangeError {
    code = "ERR_OUT_OF_RANGE";
    constructor(str, range, input5, replaceDefaultBoolean = false){
        assert1(range, 'Missing "range" argument');
        let msg = replaceDefaultBoolean ? str : `The value of "${str}" is out of range.`;
        let received;
        if (Number.isInteger(input5) && Math.abs(input5) > 2 ** 32) {
            received = addNumericalSeparator(String(input5));
        } else if (typeof input5 === "bigint") {
            received = String(input5);
            if (input5 > 2n ** 32n || input5 < -(2n ** 32n)) {
                received = addNumericalSeparator(received);
            }
            received += "n";
        } else {
            received = inspect(input5);
        }
        msg += ` It must be ${range}. Received ${received}`;
        super(msg);
        const { name  } = this;
        this.name = `${name} [${this.code}]`;
        this.stack;
        this.name = name;
    }
}
const validateBuffer = hideStackFrames((buffer, name = "buffer")=>{
    if (!isArrayBufferView(buffer)) {
        throw new ERR_INVALID_ARG_TYPE(name, [
            "Buffer",
            "TypedArray",
            "DataView"
        ], buffer);
    }
});
const NumberIsSafeInteger = Number.isSafeInteger;
function validateString(value, name) {
    if (typeof value !== "string") {
        throw new ERR_INVALID_ARG_TYPE(name, "string", value);
    }
}
function normalizeEncoding2(enc) {
    if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
    return slowCases2(enc);
}
function slowCases2(enc) {
    switch(enc.length){
        case 4:
            if (enc === "UTF8") return "utf8";
            if (enc === "ucs2" || enc === "UCS2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf8") return "utf8";
            if (enc === "ucs2") return "utf16le";
            break;
        case 3:
            if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
                return "hex";
            }
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
            if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
                return "utf16le";
            }
            break;
        case 8:
            if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
                return "utf16le";
            }
            break;
        case 9:
            if (enc === "base64url" || enc === "BASE64URL" || `${enc}`.toLowerCase() === "base64url") {
                return "base64url";
            }
            break;
        default:
            if (enc === "") return "utf8";
    }
}
function once(callback) {
    let called = false;
    return function(...args) {
        if (called) return;
        called = true;
        Reflect.apply(callback, this, args);
    };
}
function createDeferredPromise() {
    let resolve9;
    let reject;
    const promise = new Promise((res, rej)=>{
        resolve9 = res;
        reject = rej;
    });
    return {
        promise,
        resolve: resolve9,
        reject
    };
}
new Set();
function stripVTControlCharacters(str) {
    validateString(str, "str");
    return str.replace(ansi, "");
}
const kMaxLength = 2147483647;
const customInspectSymbol1 = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
const INSPECT_MAX_BYTES = 50;
Object.defineProperty(Buffer1.prototype, "parent", {
    enumerable: true,
    get: function() {
        if (!Buffer1.isBuffer(this)) {
            return void 0;
        }
        return this.buffer;
    }
});
Object.defineProperty(Buffer1.prototype, "offset", {
    enumerable: true,
    get: function() {
        if (!Buffer1.isBuffer(this)) {
            return void 0;
        }
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > 2147483647) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer1.prototype);
    return buf;
}
function Buffer1(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
            throw new ERR_INVALID_ARG_TYPE("string", "string", arg);
        }
        return _allocUnsafe(arg);
    }
    return _from(arg, encodingOrOffset, length);
}
Buffer1.poolSize = 8192;
function _from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
    }
    if (typeof value === "object" && value !== null) {
        if (isAnyArrayBuffer1(value)) {
            return fromArrayBuffer(value, encodingOrOffset, length);
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value && (typeof valueOf === "string" || typeof valueOf === "object")) {
            return _from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) {
            return b;
        }
        if (typeof value[Symbol.toPrimitive] === "function") {
            const primitive = value[Symbol.toPrimitive]("string");
            if (typeof primitive === "string") {
                return fromString(primitive, encodingOrOffset);
            }
        }
    }
    throw new ERR_INVALID_ARG_TYPE("first argument", [
        "string",
        "Buffer",
        "ArrayBuffer",
        "Array",
        "Array-like Object"
    ], value);
}
Buffer1.from = function from(value, encodingOrOffset, length) {
    return _from(value, encodingOrOffset, length);
};
Object.setPrototypeOf(Buffer1.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer1, Uint8Array);
const utf8Encoder = new TextEncoder();
const float32Array = new Float32Array(1);
const uInt8Float32Array = new Uint8Array(float32Array.buffer);
const float64Array = new Float64Array(1);
const uInt8Float64Array = new Uint8Array(float64Array.buffer);
float32Array[0] = -1;
const bigEndian = uInt8Float32Array[3] === 0;
function readUInt48LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 5];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 6);
    }
    return first + buf[++offset] * 2 ** 8 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 24 + (buf[++offset] + last * 2 ** 8) * 2 ** 32;
}
function readUInt40LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 4];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 5);
    }
    return first + buf[++offset] * 2 ** 8 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 24 + last * 2 ** 32;
}
function readUInt24LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 2];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 3);
    }
    return first + buf[++offset] * 2 ** 8 + last * 2 ** 16;
}
function readUInt48BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 5];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 6);
    }
    return (first * 2 ** 8 + buf[++offset]) * 2 ** 32 + buf[++offset] * 2 ** 24 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
}
function readUInt40BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 4];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 5);
    }
    return first * 2 ** 32 + buf[++offset] * 2 ** 24 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
}
function readUInt24BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 2];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 3);
    }
    return first * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
}
function readUInt16BE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 1];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 2);
    }
    return first * 2 ** 8 + last;
}
function readUInt32BE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 4);
    }
    return first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
}
function readDoubleBackwards(buffer, offset = 0) {
    validateNumber(offset, "offset");
    const first = buffer[offset];
    const last = buffer[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, buffer.length - 8);
    }
    uInt8Float64Array[7] = first;
    uInt8Float64Array[6] = buffer[++offset];
    uInt8Float64Array[5] = buffer[++offset];
    uInt8Float64Array[4] = buffer[++offset];
    uInt8Float64Array[3] = buffer[++offset];
    uInt8Float64Array[2] = buffer[++offset];
    uInt8Float64Array[1] = buffer[++offset];
    uInt8Float64Array[0] = last;
    return float64Array[0];
}
function readDoubleForwards(buffer, offset = 0) {
    validateNumber(offset, "offset");
    const first = buffer[offset];
    const last = buffer[offset + 7];
    if (first === undefined || last === undefined) {
        boundsError(offset, buffer.length - 8);
    }
    uInt8Float64Array[0] = first;
    uInt8Float64Array[1] = buffer[++offset];
    uInt8Float64Array[2] = buffer[++offset];
    uInt8Float64Array[3] = buffer[++offset];
    uInt8Float64Array[4] = buffer[++offset];
    uInt8Float64Array[5] = buffer[++offset];
    uInt8Float64Array[6] = buffer[++offset];
    uInt8Float64Array[7] = last;
    return float64Array[0];
}
function writeDoubleForwards(buffer, val, offset = 0) {
    val = +val;
    checkBounds(buffer, offset, 7);
    float64Array[0] = val;
    buffer[offset++] = uInt8Float64Array[0];
    buffer[offset++] = uInt8Float64Array[1];
    buffer[offset++] = uInt8Float64Array[2];
    buffer[offset++] = uInt8Float64Array[3];
    buffer[offset++] = uInt8Float64Array[4];
    buffer[offset++] = uInt8Float64Array[5];
    buffer[offset++] = uInt8Float64Array[6];
    buffer[offset++] = uInt8Float64Array[7];
    return offset;
}
function writeDoubleBackwards(buffer, val, offset = 0) {
    val = +val;
    checkBounds(buffer, offset, 7);
    float64Array[0] = val;
    buffer[offset++] = uInt8Float64Array[7];
    buffer[offset++] = uInt8Float64Array[6];
    buffer[offset++] = uInt8Float64Array[5];
    buffer[offset++] = uInt8Float64Array[4];
    buffer[offset++] = uInt8Float64Array[3];
    buffer[offset++] = uInt8Float64Array[2];
    buffer[offset++] = uInt8Float64Array[1];
    buffer[offset++] = uInt8Float64Array[0];
    return offset;
}
function readFloatBackwards(buffer, offset = 0) {
    validateNumber(offset, "offset");
    const first = buffer[offset];
    const last = buffer[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, buffer.length - 4);
    }
    uInt8Float32Array[3] = first;
    uInt8Float32Array[2] = buffer[++offset];
    uInt8Float32Array[1] = buffer[++offset];
    uInt8Float32Array[0] = last;
    return float32Array[0];
}
function readFloatForwards(buffer, offset = 0) {
    validateNumber(offset, "offset");
    const first = buffer[offset];
    const last = buffer[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, buffer.length - 4);
    }
    uInt8Float32Array[0] = first;
    uInt8Float32Array[1] = buffer[++offset];
    uInt8Float32Array[2] = buffer[++offset];
    uInt8Float32Array[3] = last;
    return float32Array[0];
}
function writeFloatForwards(buffer, val, offset = 0) {
    val = +val;
    checkBounds(buffer, offset, 3);
    float32Array[0] = val;
    buffer[offset++] = uInt8Float32Array[0];
    buffer[offset++] = uInt8Float32Array[1];
    buffer[offset++] = uInt8Float32Array[2];
    buffer[offset++] = uInt8Float32Array[3];
    return offset;
}
function writeFloatBackwards(buffer, val, offset = 0) {
    val = +val;
    checkBounds(buffer, offset, 3);
    float32Array[0] = val;
    buffer[offset++] = uInt8Float32Array[3];
    buffer[offset++] = uInt8Float32Array[2];
    buffer[offset++] = uInt8Float32Array[1];
    buffer[offset++] = uInt8Float32Array[0];
    return offset;
}
function readInt24LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 2];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 3);
    }
    const val = first + buf[++offset] * 2 ** 8 + last * 2 ** 16;
    return val | (val & 2 ** 23) * 510;
}
function readInt40LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 4];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 5);
    }
    return (last | (last & 2 ** 7) * 33554430) * 2 ** 32 + first + buf[++offset] * 2 ** 8 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 24;
}
function readInt48LE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 5];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 6);
    }
    const val = buf[offset + 4] + last * 2 ** 8;
    return (val | (val & 2 ** 15) * 131070) * 2 ** 32 + first + buf[++offset] * 2 ** 8 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 24;
}
function readInt24BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 2];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 3);
    }
    const val = first * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
    return val | (val & 2 ** 23) * 510;
}
function readInt48BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 5];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 6);
    }
    const val = buf[++offset] + first * 2 ** 8;
    return (val | (val & 2 ** 15) * 131070) * 2 ** 32 + buf[++offset] * 2 ** 24 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
}
function readInt40BE(buf, offset = 0) {
    validateNumber(offset, "offset");
    const first = buf[offset];
    const last = buf[offset + 4];
    if (first === undefined || last === undefined) {
        boundsError(offset, buf.length - 5);
    }
    return (first | (first & 2 ** 7) * 33554430) * 2 ** 32 + buf[++offset] * 2 ** 24 + buf[++offset] * 2 ** 16 + buf[++offset] * 2 ** 8 + last;
}
function byteLengthUtf8(str) {
    return utf8Encoder.encode(str).length;
}
function base64ByteLength1(str, bytes) {
    if (str.charCodeAt(bytes - 1) === 61) {
        bytes--;
    }
    if (bytes > 1 && str.charCodeAt(bytes - 1) === 61) {
        bytes--;
    }
    return bytes * 3 >>> 2;
}
const encodingsMap = Object.create(null);
for(let i63 = 0; i63 < encodings.length; ++i63){
    encodingsMap[encodings[i63]] = i63;
}
const encodingOps1 = {
    ascii: {
        byteLength: (string)=>string.length
        ,
        encoding: "ascii",
        encodingVal: encodingsMap.ascii,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, asciiToBytes(val), byteOffset, encodingsMap.ascii, dir)
        ,
        slice: (buf, start, end)=>buf.asciiSlice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.asciiWrite(string, offset, len)
    },
    base64: {
        byteLength: (string)=>base64ByteLength1(string, string.length)
        ,
        encoding: "base64",
        encodingVal: encodingsMap.base64,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, base64ToBytes(val), byteOffset, encodingsMap.base64, dir)
        ,
        slice: (buf, start, end)=>buf.base64Slice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.base64Write(string, offset, len)
    },
    base64url: {
        byteLength: (string)=>base64ByteLength1(string, string.length)
        ,
        encoding: "base64url",
        encodingVal: encodingsMap.base64url,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, base64UrlToBytes(val), byteOffset, encodingsMap.base64url, dir)
        ,
        slice: (buf, start, end)=>buf.base64urlSlice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.base64urlWrite(string, offset, len)
    },
    hex: {
        byteLength: (string)=>string.length >>> 1
        ,
        encoding: "hex",
        encodingVal: encodingsMap.hex,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, hexToBytes(val), byteOffset, encodingsMap.hex, dir)
        ,
        slice: (buf, start, end)=>buf.hexSlice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.hexWrite(string, offset, len)
    },
    latin1: {
        byteLength: (string)=>string.length
        ,
        encoding: "latin1",
        encodingVal: encodingsMap.latin1,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, asciiToBytes(val), byteOffset, encodingsMap.latin1, dir)
        ,
        slice: (buf, start, end)=>buf.latin1Slice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.latin1Write(string, offset, len)
    },
    ucs2: {
        byteLength: (string)=>string.length * 2
        ,
        encoding: "ucs2",
        encodingVal: encodingsMap.utf16le,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, utf16leToBytes(val), byteOffset, encodingsMap.utf16le, dir)
        ,
        slice: (buf, start, end)=>buf.ucs2Slice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.ucs2Write(string, offset, len)
    },
    utf8: {
        byteLength: byteLengthUtf8,
        encoding: "utf8",
        encodingVal: encodingsMap.utf8,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, utf8Encoder.encode(val), byteOffset, encodingsMap.utf8, dir)
        ,
        slice: (buf, start, end)=>buf.utf8Slice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.utf8Write(string, offset, len)
    },
    utf16le: {
        byteLength: (string)=>string.length * 2
        ,
        encoding: "utf16le",
        encodingVal: encodingsMap.utf16le,
        indexOf: (buf, val, byteOffset, dir)=>indexOfBuffer(buf, utf16leToBytes(val), byteOffset, encodingsMap.utf16le, dir)
        ,
        slice: (buf, start, end)=>buf.ucs2Slice(start, end)
        ,
        write: (buf, string, offset, len)=>buf.ucs2Write(string, offset, len)
    }
};
function getEncodingOps(encoding) {
    encoding = String(encoding).toLowerCase();
    switch(encoding.length){
        case 4:
            if (encoding === "utf8") return encodingOps1.utf8;
            if (encoding === "ucs2") return encodingOps1.ucs2;
            break;
        case 5:
            if (encoding === "utf-8") return encodingOps1.utf8;
            if (encoding === "ascii") return encodingOps1.ascii;
            if (encoding === "ucs-2") return encodingOps1.ucs2;
            break;
        case 7:
            if (encoding === "utf16le") {
                return encodingOps1.utf16le;
            }
            break;
        case 8:
            if (encoding === "utf-16le") {
                return encodingOps1.utf16le;
            }
            break;
        case 6:
            if (encoding === "latin1" || encoding === "binary") {
                return encodingOps1.latin1;
            }
            if (encoding === "base64") return encodingOps1.base64;
        case 3:
            if (encoding === "hex") {
                return encodingOps1.hex;
            }
            break;
        case 9:
            if (encoding === "base64url") {
                return encodingOps1.base64url;
            }
            break;
    }
}
function _copyActual(source, target, targetStart, sourceStart, sourceEnd) {
    if (sourceEnd - sourceStart > target.length - targetStart) {
        sourceEnd = sourceStart + target.length - targetStart;
    }
    let nb = sourceEnd - sourceStart;
    const sourceLen = source.length - sourceStart;
    if (nb > sourceLen) {
        nb = sourceLen;
    }
    if (sourceStart !== 0 || sourceEnd < source.length) {
        source = new Uint8Array(source.buffer, source.byteOffset + sourceStart, nb);
    }
    target.set(source, targetStart);
    return nb;
}
function validateNumber(value, name) {
    if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
}
Buffer1.alloc = function alloc(size, fill, encoding) {
    return _alloc(size, fill, encoding);
};
function getSystemErrorName(code) {
    if (typeof code !== "number") {
        throw new ERR_INVALID_ARG_TYPE("err", "number", code);
    }
    if (code >= 0 || !NumberIsSafeInteger(code)) {
        throw new ERR_OUT_OF_RANGE("err", "a negative integer", code);
    }
    return errorMap.get(code)?.[0];
}
hideStackFrames(function errnoException(err, syscall, original) {
    const code = getSystemErrorName(err);
    const message = original ? `${syscall} ${code} ${original}` : `${syscall} ${code}`;
    const ex = new Error(message);
    ex.errno = err;
    ex.code = code;
    ex.syscall = syscall;
    return captureLargerStackTrace(ex);
});
hideStackFrames(function exceptionWithHostPort(err, syscall, address, port, additional) {
    const code = getSystemErrorName(err);
    let details = "";
    if (port && port > 0) {
        details = ` ${address}:${port}`;
    } else if (address) {
        details = ` ${address}`;
    }
    if (additional) {
        details += ` - Local (${additional})`;
    }
    const ex = new Error(`${syscall} ${code}${details}`);
    ex.errno = err;
    ex.code = code;
    ex.syscall = syscall;
    ex.address = address;
    if (port) {
        ex.port = port;
    }
    return captureLargerStackTrace(ex);
});
hideStackFrames(function(code, syscall, hostname) {
    let errno;
    if (typeof code === "number") {
        errno = code;
        if (code === codeMap.get("EAI_NODATA") || code === codeMap.get("EAI_NONAME")) {
            code = "ENOTFOUND";
        } else {
            code = getSystemErrorName(code);
        }
    }
    const message = `${syscall} ${code}${hostname ? ` ${hostname}` : ""}`;
    const ex = new Error(message);
    ex.errno = errno;
    ex.code = code;
    ex.syscall = syscall;
    if (hostname) {
        ex.hostname = hostname;
    }
    return captureLargerStackTrace(ex);
});
class NodeErrorAbstraction extends Error {
    code;
    constructor(name, code, message){
        super(message);
        this.code = code;
        this.name = name;
        this.stack = this.stack && `${name} [${this.code}]${this.stack.slice(20)}`;
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
}
class NodeError extends NodeErrorAbstraction {
    constructor(code, message){
        super(Error.prototype.name, code, message);
    }
}
class NodeRangeError extends NodeErrorAbstraction {
    constructor(code, message){
        super(RangeError.prototype.name, code, message);
        Object.setPrototypeOf(this, RangeError.prototype);
        this.toString = function() {
            return `${this.name} [${this.code}]: ${this.message}`;
        };
    }
}
class NodeTypeError extends NodeErrorAbstraction {
    constructor(code, message){
        super(TypeError.prototype.name, code, message);
        Object.setPrototypeOf(this, TypeError.prototype);
        this.toString = function() {
            return `${this.name} [${this.code}]: ${this.message}`;
        };
    }
}
class NodeURIError extends NodeErrorAbstraction {
    constructor(code, message){
        super(URIError.prototype.name, code, message);
        Object.setPrototypeOf(this, URIError.prototype);
        this.toString = function() {
            return `${this.name} [${this.code}]: ${this.message}`;
        };
    }
}
class NodeSystemError extends NodeErrorAbstraction {
    constructor(key, context, msgPrefix){
        let message = `${msgPrefix}: ${context.syscall} returned ` + `${context.code} (${context.message})`;
        if (context.path !== undefined) {
            message += ` ${context.path}`;
        }
        if (context.dest !== undefined) {
            message += ` => ${context.dest}`;
        }
        super("SystemError", key, message);
        captureLargerStackTrace(this);
        Object.defineProperties(this, {
            [kIsNodeError]: {
                value: true,
                enumerable: false,
                writable: false,
                configurable: true
            },
            info: {
                value: context,
                enumerable: true,
                configurable: true,
                writable: false
            },
            errno: {
                get () {
                    return context.errno;
                },
                set: (value)=>{
                    context.errno = value;
                },
                enumerable: true,
                configurable: true
            },
            syscall: {
                get () {
                    return context.syscall;
                },
                set: (value)=>{
                    context.syscall = value;
                },
                enumerable: true,
                configurable: true
            }
        });
        if (context.path !== undefined) {
            Object.defineProperty(this, "path", {
                get () {
                    return context.path;
                },
                set: (value)=>{
                    context.path = value;
                },
                enumerable: true,
                configurable: true
            });
        }
        if (context.dest !== undefined) {
            Object.defineProperty(this, "dest", {
                get () {
                    return context.dest;
                },
                set: (value)=>{
                    context.dest = value;
                },
                enumerable: true,
                configurable: true
            });
        }
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
}
function makeSystemErrorWithCode(key, msgPrfix) {
    return class NodeError extends NodeSystemError {
        constructor(ctx){
            super(key, ctx, msgPrfix);
        }
    };
}
const ERR_FS_EISDIR = makeSystemErrorWithCode("ERR_FS_EISDIR", "Path is a directory");
function createInvalidArgType(name, expected) {
    expected = Array.isArray(expected) ? expected : [
        expected
    ];
    let msg = "The ";
    if (name.endsWith(" argument")) {
        msg += `${name} `;
    } else {
        const type = name.includes(".") ? "property" : "argument";
        msg += `"${name}" ${type} `;
    }
    msg += "must be ";
    const types = [];
    const instances = [];
    const other = [];
    for (const value of expected){
        if (kTypes.includes(value)) {
            types.push(value.toLocaleLowerCase());
        } else if (classRegExp.test(value)) {
            instances.push(value);
        } else {
            other.push(value);
        }
    }
    if (instances.length > 0) {
        const pos = types.indexOf("object");
        if (pos !== -1) {
            types.splice(pos, 1);
            instances.push("Object");
        }
    }
    if (types.length > 0) {
        if (types.length > 2) {
            const last = types.pop();
            msg += `one of type ${types.join(", ")}, or ${last}`;
        } else if (types.length === 2) {
            msg += `one of type ${types[0]} or ${types[1]}`;
        } else {
            msg += `of type ${types[0]}`;
        }
        if (instances.length > 0 || other.length > 0) {
            msg += " or ";
        }
    }
    if (instances.length > 0) {
        if (instances.length > 2) {
            const last = instances.pop();
            msg += `an instance of ${instances.join(", ")}, or ${last}`;
        } else {
            msg += `an instance of ${instances[0]}`;
            if (instances.length === 2) {
                msg += ` or ${instances[1]}`;
            }
        }
        if (other.length > 0) {
            msg += " or ";
        }
    }
    if (other.length > 0) {
        if (other.length > 2) {
            const last = other.pop();
            msg += `one of ${other.join(", ")}, or ${last}`;
        } else if (other.length === 2) {
            msg += `one of ${other[0]} or ${other[1]}`;
        } else {
            if (other[0].toLowerCase() !== other[0]) {
                msg += "an ";
            }
            msg += `${other[0]}`;
        }
    }
    return msg;
}
class ERR_INVALID_ARG_TYPE_RANGE extends NodeRangeError {
    constructor(name, expected, actual){
        const msg = createInvalidArgType(name, expected);
        super("ERR_INVALID_ARG_TYPE", `${msg}.${invalidArgTypeHelper(actual)}`);
    }
}
class ERR_INVALID_ARG_VALUE_RANGE extends NodeRangeError {
    constructor(name, value, reason = "is invalid"){
        const type = name.includes(".") ? "property" : "argument";
        const inspected = inspect(value);
        super("ERR_INVALID_ARG_VALUE", `The ${type} '${name}' ${reason}. Received ${inspected}`);
    }
}
class ERR_INVALID_ARG_VALUE extends NodeTypeError {
    constructor(name, value, reason = "is invalid"){
        const type = name.includes(".") ? "property" : "argument";
        const inspected = inspect(value);
        super("ERR_INVALID_ARG_VALUE", `The ${type} '${name}' ${reason}. Received ${inspected}`);
    }
    static RangeError = ERR_INVALID_ARG_VALUE_RANGE;
}
function assertSize(size) {
    validateNumber(size, "size");
    if (!(size >= 0 && size <= 2147483647)) {
        throw new ERR_INVALID_ARG_VALUE.RangeError("size", size);
    }
}
function _alloc(size, fill, encoding) {
    assertSize(size);
    const buffer = createBuffer(size);
    if (fill !== undefined) {
        return buffer.fill(fill, encoding);
    }
    return buffer;
}
function _allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
Buffer1.allocUnsafe = function allocUnsafe(size) {
    return _allocUnsafe(size);
};
Buffer1.allocUnsafeSlow = function allocUnsafeSlow(size) {
    return _allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
    }
    if (!Buffer1.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) {
        buf = buf.slice(0, actual);
    }
    return buf;
}
function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for(let i = 0; i < length; i += 1){
        buf[i] = array[i] & 255;
    }
    return buf;
}
function fromObject(obj) {
    if (obj.length !== undefined || isAnyArrayBuffer1(obj.buffer)) {
        if (typeof obj.length !== "number") {
            return createBuffer(0);
        }
        return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
    }
}
function checked(length) {
    if (length >= 2147483647) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647..toString(16) + " bytes");
    }
    return length | 0;
}
function SlowBuffer(length) {
    assertSize(length);
    return Buffer1.alloc(+length);
}
Object.setPrototypeOf(SlowBuffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(SlowBuffer, Uint8Array);
Buffer1.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer1.prototype;
};
Buffer1.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) {
        a = Buffer1.from(a, a.offset, a.byteLength);
    }
    if (isInstance(b, Uint8Array)) {
        b = Buffer1.from(b, b.offset, b.byteLength);
    }
    if (!Buffer1.isBuffer(a) || !Buffer1.isBuffer(b)) {
        throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }
    if (a === b) {
        return 0;
    }
    let x = a.length;
    let y = b.length;
    for(let i = 0, len = Math.min(x, y); i < len; ++i){
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }
    if (x < y) {
        return -1;
    }
    if (y < x) {
        return 1;
    }
    return 0;
};
Buffer1.isEncoding = function isEncoding(encoding) {
    return typeof encoding === "string" && encoding.length !== 0 && normalizeEncoding2(encoding) !== undefined;
};
function invalidArgTypeHelper(input6) {
    if (input6 == null) {
        return ` Received ${input6}`;
    }
    if (typeof input6 === "function" && input6.name) {
        return ` Received function ${input6.name}`;
    }
    if (typeof input6 === "object") {
        if (input6.constructor && input6.constructor.name) {
            return ` Received an instance of ${input6.constructor.name}`;
        }
        return ` Received ${inspect(input6, {
            depth: -1
        })}`;
    }
    let inspected = inspect(input6, {
        colors: false
    });
    if (inspected.length > 25) {
        inspected = `${inspected.slice(0, 25)}...`;
    }
    return ` Received type ${typeof input6} (${inspected})`;
}
class ERR_BUFFER_OUT_OF_BOUNDS extends NodeRangeError {
    constructor(name){
        super("ERR_BUFFER_OUT_OF_BOUNDS", name ? `"${name}" is outside of buffer bounds` : "Attempt to access memory outside buffer bounds");
    }
}
function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length < 0) {
        throw new ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
}
function checkBounds(buf, offset, byteLength1) {
    validateNumber(offset, "offset");
    if (buf[offset] === undefined || buf[offset + byteLength1] === undefined) {
        boundsError(offset, buf.length - (byteLength1 + 1));
    }
}
function checkInt(value, min2, max, buf, offset, byteLength2) {
    if (value > max || value < min2) {
        const n = typeof min2 === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
            if (min2 === 0 || min2 === 0n) {
                range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
                range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and ` + `< 2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
        } else {
            range = `>= ${min2}${n} and <= ${max}${n}`;
        }
        throw new ERR_OUT_OF_RANGE("value", range, value);
    }
    checkBounds(buf, offset, byteLength2);
}
function toInteger(n, defaultVal) {
    n = +n;
    if (!Number.isNaN(n) && n >= Number.MIN_SAFE_INTEGER && n <= Number.MAX_SAFE_INTEGER) {
        return n % 1 === 0 ? n : Math.floor(n);
    }
    return defaultVal;
}
function writeU_Int8(buf, value, offset, min3, max) {
    value = +value;
    validateNumber(offset, "offset");
    if (value > max || value < min3) {
        throw new ERR_OUT_OF_RANGE("value", `>= ${min3} and <= ${max}`, value);
    }
    if (buf[offset] === undefined) {
        boundsError(offset, buf.length - 1);
    }
    buf[offset] = value;
    return offset + 1;
}
function writeU_Int16BE(buf, value, offset, min4, max) {
    value = +value;
    checkInt(value, min4, max, buf, offset, 1);
    buf[offset++] = value >>> 8;
    buf[offset++] = value;
    return offset;
}
function _writeUInt32LE(buf, value, offset, min5, max) {
    value = +value;
    checkInt(value, min5, max, buf, offset, 3);
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    return offset;
}
function writeU_Int16LE(buf, value, offset, min6, max) {
    value = +value;
    checkInt(value, min6, max, buf, offset, 1);
    buf[offset++] = value;
    buf[offset++] = value >>> 8;
    return offset;
}
function _writeUInt32BE(buf, value, offset, min7, max) {
    value = +value;
    checkInt(value, min7, max, buf, offset, 3);
    buf[offset + 3] = value;
    value = value >>> 8;
    buf[offset + 2] = value;
    value = value >>> 8;
    buf[offset + 1] = value;
    value = value >>> 8;
    buf[offset] = value;
    return offset + 4;
}
function writeU_Int48BE(buf, value, offset, min8, max) {
    value = +value;
    checkInt(value, min8, max, buf, offset, 5);
    const newVal = Math.floor(value * 2 ** -32);
    buf[offset++] = newVal >>> 8;
    buf[offset++] = newVal;
    buf[offset + 3] = value;
    value = value >>> 8;
    buf[offset + 2] = value;
    value = value >>> 8;
    buf[offset + 1] = value;
    value = value >>> 8;
    buf[offset] = value;
    return offset + 4;
}
function writeU_Int40BE(buf, value, offset, min9, max) {
    value = +value;
    checkInt(value, min9, max, buf, offset, 4);
    buf[offset++] = Math.floor(value * 2 ** -32);
    buf[offset + 3] = value;
    value = value >>> 8;
    buf[offset + 2] = value;
    value = value >>> 8;
    buf[offset + 1] = value;
    value = value >>> 8;
    buf[offset] = value;
    return offset + 4;
}
function writeU_Int32BE(buf, value, offset, min10, max) {
    value = +value;
    checkInt(value, min10, max, buf, offset, 3);
    buf[offset + 3] = value;
    value = value >>> 8;
    buf[offset + 2] = value;
    value = value >>> 8;
    buf[offset + 1] = value;
    value = value >>> 8;
    buf[offset] = value;
    return offset + 4;
}
function writeU_Int24BE(buf, value, offset, min11, max) {
    value = +value;
    checkInt(value, min11, max, buf, offset, 2);
    buf[offset + 2] = value;
    value = value >>> 8;
    buf[offset + 1] = value;
    value = value >>> 8;
    buf[offset] = value;
    return offset + 3;
}
function validateOffset(value, name, min12 = 0, max = Number.MAX_SAFE_INTEGER) {
    if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!Number.isInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    if (value < min12 || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min12} && <= ${max}`, value);
    }
}
Buffer1.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
        throw new ERR_INVALID_ARG_TYPE("list", "Array", list);
    }
    if (list.length === 0) {
        return Buffer1.alloc(0);
    }
    if (length === undefined) {
        length = 0;
        for(let i = 0; i < list.length; i++){
            if (list[i].length) {
                length += list[i].length;
            }
        }
    } else {
        validateOffset(length, "length");
    }
    const buffer = Buffer1.allocUnsafe(length);
    let pos = 0;
    for(let i = 0; i < list.length; i++){
        const buf = list[i];
        if (!isUint8Array(buf)) {
            throw new ERR_INVALID_ARG_TYPE(`list[${i}]`, [
                "Buffer",
                "Uint8Array"
            ], list[i]);
        }
        pos += _copyActual(buf, buffer, pos, 0, buf.length);
    }
    if (pos < length) {
        buffer.fill(0, pos, length);
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (typeof string !== "string") {
        if (isArrayBufferView(string) || isAnyArrayBuffer1(string)) {
            return string.byteLength;
        }
        throw new ERR_INVALID_ARG_TYPE("string", [
            "string",
            "Buffer",
            "ArrayBuffer"
        ], string);
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) {
        return 0;
    }
    if (!encoding) {
        return mustMatch ? -1 : byteLengthUtf8(string);
    }
    const ops = getEncodingOps(encoding);
    if (ops === undefined) {
        return mustMatch ? -1 : byteLengthUtf8(string);
    }
    return ops.byteLength(string);
}
Buffer1.byteLength = byteLength;
Buffer1.prototype._isBuffer = true;
function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer1.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for(let i = 0; i < len; i += 2){
        swap(this, i, i + 1);
    }
    return this;
};
Buffer1.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for(let i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer1.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for(let i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
class ERR_FS_INVALID_SYMLINK_TYPE extends NodeError {
    constructor(x){
        super("ERR_FS_INVALID_SYMLINK_TYPE", `Symlink type must be one of "dir", "file", or "junction". Received "${x}"`);
    }
}
class ERR_INVALID_CALLBACK extends NodeTypeError {
    constructor(object){
        super("ERR_INVALID_CALLBACK", `Callback must be a function. Received ${inspect(object)}`);
    }
}
class ERR_INVALID_FILE_URL_HOST extends NodeTypeError {
    constructor(x){
        super("ERR_INVALID_FILE_URL_HOST", `File URL host must be "localhost" or empty on ${x}`);
    }
}
class ERR_INVALID_FILE_URL_PATH extends NodeTypeError {
    constructor(x){
        super("ERR_INVALID_FILE_URL_PATH", `File URL path ${x}`);
    }
}
class ERR_INVALID_OPT_VALUE_ENCODING extends NodeTypeError {
    constructor(x){
        super("ERR_INVALID_OPT_VALUE_ENCODING", `The value "${x}" is invalid for option "encoding"`);
    }
}
class ERR_INVALID_URI extends NodeURIError {
    constructor(){
        super("ERR_INVALID_URI", `URI malformed`);
    }
}
class ERR_METHOD_NOT_IMPLEMENTED extends NodeError {
    constructor(x){
        super("ERR_METHOD_NOT_IMPLEMENTED", `The ${x} method is not implemented`);
    }
}
class ERR_MISSING_ARGS extends NodeTypeError {
    constructor(...args){
        let msg = "The ";
        const len = args.length;
        const wrap2 = (a)=>`"${a}"`
        ;
        args = args.map((a)=>Array.isArray(a) ? a.map(wrap2).join(" or ") : wrap2(a)
        );
        switch(len){
            case 1:
                msg += `${args[0]} argument`;
                break;
            case 2:
                msg += `${args[0]} and ${args[1]} arguments`;
                break;
            default:
                msg += args.slice(0, len - 1).join(", ");
                msg += `, and ${args[len - 1]} arguments`;
                break;
        }
        super("ERR_MISSING_ARGS", `${msg} must be specified`);
    }
}
class ERR_MULTIPLE_CALLBACK extends NodeError {
    constructor(){
        super("ERR_MULTIPLE_CALLBACK", `Callback called multiple times`);
    }
}
class ERR_STREAM_ALREADY_FINISHED extends NodeError {
    constructor(x){
        super("ERR_STREAM_ALREADY_FINISHED", `Cannot call ${x} after a stream was finished`);
    }
}
class ERR_STREAM_CANNOT_PIPE extends NodeError {
    constructor(){
        super("ERR_STREAM_CANNOT_PIPE", `Cannot pipe, not readable`);
    }
}
class ERR_STREAM_DESTROYED extends NodeError {
    constructor(x){
        super("ERR_STREAM_DESTROYED", `Cannot call ${x} after a stream was destroyed`);
    }
}
class ERR_STREAM_NULL_VALUES extends NodeTypeError {
    constructor(){
        super("ERR_STREAM_NULL_VALUES", `May not write null values to stream`);
    }
}
class ERR_STREAM_PREMATURE_CLOSE extends NodeError {
    constructor(){
        super("ERR_STREAM_PREMATURE_CLOSE", `Premature close`);
    }
}
class ERR_STREAM_PUSH_AFTER_EOF extends NodeError {
    constructor(){
        super("ERR_STREAM_PUSH_AFTER_EOF", `stream.push() after EOF`);
    }
}
class ERR_STREAM_UNSHIFT_AFTER_END_EVENT extends NodeError {
    constructor(){
        super("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", `stream.unshift() after end event`);
    }
}
class ERR_STREAM_WRITE_AFTER_END extends NodeError {
    constructor(){
        super("ERR_STREAM_WRITE_AFTER_END", `write after end`);
    }
}
class ERR_UNHANDLED_ERROR extends NodeError {
    constructor(x){
        super("ERR_UNHANDLED_ERROR", `Unhandled error. (${x})`);
    }
}
class ERR_UNKNOWN_ENCODING extends NodeTypeError {
    constructor(x){
        super("ERR_UNKNOWN_ENCODING", `Unknown encoding: ${x}`);
    }
}
Buffer1.prototype.toString = function toString(encoding, start, end) {
    if (arguments.length === 0) {
        return this.utf8Slice(0, this.length);
    }
    const len = this.length;
    if (start <= 0) {
        start = 0;
    } else if (start >= len) {
        return "";
    } else {
        start |= 0;
    }
    if (end === undefined || end > len) {
        end = len;
    } else {
        end |= 0;
    }
    if (end <= start) {
        return "";
    }
    if (encoding === undefined) {
        return this.utf8Slice(start, end);
    }
    const ops = getEncodingOps(encoding);
    if (ops === undefined) {
        throw new ERR_UNKNOWN_ENCODING(encoding);
    }
    return ops.slice(this, start, end);
};
Buffer1.prototype.toLocaleString = Buffer1.prototype.toString;
Buffer1.prototype.equals = function equals(b) {
    if (!isUint8Array(b)) {
        throw new ERR_INVALID_ARG_TYPE("otherBuffer", [
            "Buffer",
            "Uint8Array"
        ], b);
    }
    if (this === b) {
        return true;
    }
    return Buffer1.compare(this, b) === 0;
};
Buffer1.prototype.inspect = function inspect() {
    let str = "";
    const max = INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max) {
        str += " ... ";
    }
    return "<Buffer " + str + ">";
};
if (customInspectSymbol1) {
    Buffer1.prototype[customInspectSymbol1] = Buffer1.prototype.inspect;
}
Buffer1.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
        target = Buffer1.from(target, target.offset, target.byteLength);
    }
    if (!Buffer1.isBuffer(target)) {
        throw new ERR_INVALID_ARG_TYPE("target", [
            "Buffer",
            "Uint8Array"
        ], target);
    }
    if (start === undefined) {
        start = 0;
    } else {
        validateOffset(start, "targetStart", 0, kMaxLength);
    }
    if (end === undefined) {
        end = target.length;
    } else {
        validateOffset(end, "targetEnd", 0, target.length);
    }
    if (thisStart === undefined) {
        thisStart = 0;
    } else {
        validateOffset(start, "sourceStart", 0, kMaxLength);
    }
    if (thisEnd === undefined) {
        thisEnd = this.length;
    } else {
        validateOffset(end, "sourceEnd", 0, this.length);
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new ERR_OUT_OF_RANGE("out of range index", "range");
    }
    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }
    if (thisStart >= thisEnd) {
        return -1;
    }
    if (start >= end) {
        return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) {
        return 0;
    }
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for(let i = 0; i < len; ++i){
        if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
        }
    }
    if (x < y) {
        return -1;
    }
    if (y < x) {
        return 1;
    }
    return 0;
};
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    validateBuffer(buffer);
    if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = undefined;
    } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (Number.isNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length || buffer.byteLength;
    }
    dir = !!dir;
    if (typeof val === "number") {
        return indexOfNumber(buffer, val >>> 0, byteOffset, dir);
    }
    let ops;
    if (encoding === undefined) {
        ops = encodingOps1.utf8;
    } else {
        ops = getEncodingOps(encoding);
    }
    if (typeof val === "string") {
        if (ops === undefined) {
            throw new ERR_UNKNOWN_ENCODING(encoding);
        }
        return ops.indexOf(buffer, val, byteOffset, dir);
    }
    if (isUint8Array(val)) {
        const encodingVal = ops === undefined ? encodingsMap.utf8 : ops.encodingVal;
        return indexOfBuffer(buffer, val, byteOffset, encodingVal, dir);
    }
    throw new ERR_INVALID_ARG_TYPE("value", [
        "number",
        "string",
        "Buffer",
        "Uint8Array"
    ], val);
}
Buffer1.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer1.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer1.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
Buffer1.prototype.asciiSlice = function asciiSlice(offset, length) {
    if (offset === 0 && length === this.length) {
        return bytesToAscii(this);
    } else {
        return bytesToAscii(this.slice(offset, length));
    }
};
Buffer1.prototype.asciiWrite = function asciiWrite(string, offset, length) {
    return blitBuffer(asciiToBytes(string), this, offset, length);
};
Buffer1.prototype.base64Slice = function base64Slice(offset, length) {
    if (offset === 0 && length === this.length) {
        return encode3(this);
    } else {
        return encode3(this.slice(offset, length));
    }
};
Buffer1.prototype.base64Write = function base64Write(string, offset, length) {
    return blitBuffer(base64ToBytes(string), this, offset, length);
};
Buffer1.prototype.base64urlSlice = function base64urlSlice(offset, length) {
    if (offset === 0 && length === this.length) {
        return encode4(this);
    } else {
        return encode4(this.slice(offset, length));
    }
};
Buffer1.prototype.base64urlWrite = function base64urlWrite(string, offset, length) {
    return blitBuffer(base64UrlToBytes(string), this, offset, length);
};
Buffer1.prototype.hexWrite = function hexWrite(string, offset, length) {
    return blitBuffer(hexToBytes(string, this.length - offset), this, offset, length);
};
Buffer1.prototype.hexSlice = function hexSlice(string, offset, length) {
    return _hexSlice(this, string, offset, length);
};
Buffer1.prototype.latin1Slice = function latin1Slice(string, offset, length) {
    return _latin1Slice(this, string, offset, length);
};
Buffer1.prototype.latin1Write = function latin1Write(string, offset, length) {
    return blitBuffer(asciiToBytes(string), this, offset, length);
};
Buffer1.prototype.ucs2Slice = function ucs2Slice(offset, length) {
    if (offset === 0 && length === this.length) {
        return bytesToUtf16le(this);
    } else {
        return bytesToUtf16le(this.slice(offset, length));
    }
};
Buffer1.prototype.ucs2Write = function ucs2Write(string, offset, length) {
    return blitBuffer(utf16leToBytes(string, this.length - offset), this, offset, length);
};
Buffer1.prototype.utf8Slice = function utf8Slice(string, offset, length) {
    return _utf8Slice(this, string, offset, length);
};
Buffer1.prototype.utf8Write = function utf8Write(string, offset, length) {
    return blitBuffer(utf8ToBytes(string, this.length - offset), this, offset, length);
};
Buffer1.prototype.write = function write(string, offset, length, encoding) {
    if (offset === undefined) {
        return this.utf8Write(string, 0, this.length);
    }
    if (length === undefined && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
    } else {
        validateOffset(offset, "offset", 0, this.length);
        const remaining = this.length - offset;
        if (length === undefined) {
            length = remaining;
        } else if (typeof length === "string") {
            encoding = length;
            length = remaining;
        } else {
            validateOffset(length, "length", 0, this.length);
            if (length > remaining) {
                length = remaining;
            }
        }
    }
    if (!encoding) {
        return this.utf8Write(string, offset, length);
    }
    const ops = getEncodingOps(encoding);
    if (ops === undefined) {
        throw new ERR_UNKNOWN_ENCODING(encoding);
    }
    return ops.write(this, string, offset, length);
};
Buffer1.prototype.toJSON = function toJSON() {
    return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function fromArrayBuffer(obj, byteOffset, length) {
    if (byteOffset === undefined) {
        byteOffset = 0;
    } else {
        byteOffset = +byteOffset;
        if (Number.isNaN(byteOffset)) {
            byteOffset = 0;
        }
    }
    const maxLength = obj.byteLength - byteOffset;
    if (maxLength < 0) {
        throw new ERR_BUFFER_OUT_OF_BOUNDS("offset");
    }
    if (length === undefined) {
        length = maxLength;
    } else {
        length = +length;
        if (length > 0) {
            if (length > maxLength) {
                throw new ERR_BUFFER_OUT_OF_BOUNDS("length");
            }
        } else {
            length = 0;
        }
    }
    const buffer = new Uint8Array(obj, byteOffset, length);
    Object.setPrototypeOf(buffer, Buffer1.prototype);
    return buffer;
}
function _utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while(i < end){
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 128) {
                        codePoint = firstByte;
                    }
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 192) === 128) {
                        tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                        if (tempCodePoint > 127) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                        if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                        if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                            codePoint = tempCodePoint;
                        }
                    }
            }
        }
        if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
        } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
const MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= 4096) {
        return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while(i < len){
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
}
function _latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for(let i = start; i < end; ++i){
        ret += String.fromCharCode(buf[i]);
    }
    return ret;
}
function _hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) {
        start = 0;
    }
    if (!end || end < 0 || end > len) {
        end = len;
    }
    let out = "";
    for(let i = start; i < end; ++i){
        out += hexSliceLookupTable[buf[i]];
    }
    return out;
}
Buffer1.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) {
            start = 0;
        }
    } else if (start > len) {
        start = len;
    }
    if (end < 0) {
        end += len;
        if (end < 0) {
            end = 0;
        }
    } else if (end > len) {
        end = len;
    }
    if (end < start) {
        end = start;
    }
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer1.prototype);
    return newBuf;
};
Buffer1.prototype.readUintLE = Buffer1.prototype.readUIntLE = function readUIntLE(offset, byteLength1) {
    if (offset === undefined) {
        throw new ERR_INVALID_ARG_TYPE("offset", "number", offset);
    }
    if (byteLength1 === 6) {
        return readUInt48LE(this, offset);
    }
    if (byteLength1 === 5) {
        return readUInt40LE(this, offset);
    }
    if (byteLength1 === 3) {
        return readUInt24LE(this, offset);
    }
    if (byteLength1 === 4) {
        return this.readUInt32LE(offset);
    }
    if (byteLength1 === 2) {
        return this.readUInt16LE(offset);
    }
    if (byteLength1 === 1) {
        return this.readUInt8(offset);
    }
    boundsError(byteLength1, 6, "byteLength");
};
Buffer1.prototype.readUintBE = Buffer1.prototype.readUIntBE = function readUIntBE(offset, byteLength2) {
    if (offset === undefined) {
        throw new ERR_INVALID_ARG_TYPE("offset", "number", offset);
    }
    if (byteLength2 === 6) {
        return readUInt48BE(this, offset);
    }
    if (byteLength2 === 5) {
        return readUInt40BE(this, offset);
    }
    if (byteLength2 === 3) {
        return readUInt24BE(this, offset);
    }
    if (byteLength2 === 4) {
        return this.readUInt32BE(offset);
    }
    if (byteLength2 === 2) {
        return this.readUInt16BE(offset);
    }
    if (byteLength2 === 1) {
        return this.readUInt8(offset);
    }
    boundsError(byteLength2, 6, "byteLength");
};
Buffer1.prototype.readUint8 = Buffer1.prototype.readUInt8 = function readUInt8(offset = 0) {
    validateNumber(offset, "offset");
    const val = this[offset];
    if (val === undefined) {
        boundsError(offset, this.length - 1);
    }
    return val;
};
Buffer1.prototype.readUint16BE = Buffer1.prototype.readUInt16BE = readUInt16BE;
Buffer1.prototype.readUint16LE = Buffer1.prototype.readUInt16LE = function readUInt16LE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 1];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 2);
    }
    return first + last * 2 ** 8;
};
Buffer1.prototype.readUint32LE = Buffer1.prototype.readUInt32LE = function readUInt32LE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 4);
    }
    return first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
};
Buffer1.prototype.readUint32BE = Buffer1.prototype.readUInt32BE = readUInt32BE;
Buffer1.prototype.readBigUint64LE = Buffer1.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
});
Buffer1.prototype.readBigUint64BE = Buffer1.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
});
Buffer1.prototype.readIntLE = function readIntLE(offset, byteLength3) {
    if (offset === undefined) {
        throw new ERR_INVALID_ARG_TYPE("offset", "number", offset);
    }
    if (byteLength3 === 6) {
        return readInt48LE(this, offset);
    }
    if (byteLength3 === 5) {
        return readInt40LE(this, offset);
    }
    if (byteLength3 === 3) {
        return readInt24LE(this, offset);
    }
    if (byteLength3 === 4) {
        return this.readInt32LE(offset);
    }
    if (byteLength3 === 2) {
        return this.readInt16LE(offset);
    }
    if (byteLength3 === 1) {
        return this.readInt8(offset);
    }
    boundsError(byteLength3, 6, "byteLength");
};
Buffer1.prototype.readIntBE = function readIntBE(offset, byteLength4) {
    if (offset === undefined) {
        throw new ERR_INVALID_ARG_TYPE("offset", "number", offset);
    }
    if (byteLength4 === 6) {
        return readInt48BE(this, offset);
    }
    if (byteLength4 === 5) {
        return readInt40BE(this, offset);
    }
    if (byteLength4 === 3) {
        return readInt24BE(this, offset);
    }
    if (byteLength4 === 4) {
        return this.readInt32BE(offset);
    }
    if (byteLength4 === 2) {
        return this.readInt16BE(offset);
    }
    if (byteLength4 === 1) {
        return this.readInt8(offset);
    }
    boundsError(byteLength4, 6, "byteLength");
};
Buffer1.prototype.readInt8 = function readInt8(offset = 0) {
    validateNumber(offset, "offset");
    const val = this[offset];
    if (val === undefined) {
        boundsError(offset, this.length - 1);
    }
    return val | (val & 2 ** 7) * 33554430;
};
Buffer1.prototype.readInt16LE = function readInt16LE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 1];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 2);
    }
    const val = first + last * 2 ** 8;
    return val | (val & 2 ** 15) * 131070;
};
Buffer1.prototype.readInt16BE = function readInt16BE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 1];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 2);
    }
    const val = first * 2 ** 8 + last;
    return val | (val & 2 ** 15) * 131070;
};
Buffer1.prototype.readInt32LE = function readInt32LE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 4);
    }
    return first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + (last << 24);
};
Buffer1.prototype.readInt32BE = function readInt32BE(offset = 0) {
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 3];
    if (first === undefined || last === undefined) {
        boundsError(offset, this.length - 4);
    }
    return (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
};
Buffer1.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
});
Buffer1.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
});
Buffer1.prototype.readFloatLE = function readFloatLE(offset) {
    return bigEndian ? readFloatBackwards(this, offset) : readFloatForwards(this, offset);
};
Buffer1.prototype.readFloatBE = function readFloatBE(offset) {
    return bigEndian ? readFloatForwards(this, offset) : readFloatBackwards(this, offset);
};
Buffer1.prototype.readDoubleLE = function readDoubleLE(offset) {
    return bigEndian ? readDoubleBackwards(this, offset) : readDoubleForwards(this, offset);
};
Buffer1.prototype.readDoubleBE = function readDoubleBE(offset) {
    return bigEndian ? readDoubleForwards(this, offset) : readDoubleBackwards(this, offset);
};
function writeU_Int48LE(buf, value, offset, min13, max) {
    value = +value;
    checkInt(value, min13, max, buf, offset, 5);
    const newVal = Math.floor(value * 2 ** -32);
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    buf[offset++] = newVal;
    buf[offset++] = newVal >>> 8;
    return offset;
}
function writeU_Int40LE(buf, value, offset, min14, max) {
    value = +value;
    checkInt(value, min14, max, buf, offset, 4);
    const newVal = value;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    buf[offset++] = Math.floor(newVal * 2 ** -32);
    return offset;
}
function writeU_Int32LE(buf, value, offset, min15, max) {
    value = +value;
    checkInt(value, min15, max, buf, offset, 3);
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    return offset;
}
function writeU_Int24LE(buf, value, offset, min16, max) {
    value = +value;
    checkInt(value, min16, max, buf, offset, 2);
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    value = value >>> 8;
    buf[offset++] = value;
    return offset;
}
Buffer1.prototype.writeUintLE = Buffer1.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength5) {
    if (byteLength5 === 6) {
        return writeU_Int48LE(this, value, offset, 0, 281474976710655);
    }
    if (byteLength5 === 5) {
        return writeU_Int40LE(this, value, offset, 0, 1099511627775);
    }
    if (byteLength5 === 3) {
        return writeU_Int24LE(this, value, offset, 0, 16777215);
    }
    if (byteLength5 === 4) {
        return writeU_Int32LE(this, value, offset, 0, 4294967295);
    }
    if (byteLength5 === 2) {
        return writeU_Int16LE(this, value, offset, 0, 65535);
    }
    if (byteLength5 === 1) {
        return writeU_Int8(this, value, offset, 0, 255);
    }
    boundsError(byteLength5, 6, "byteLength");
};
Buffer1.prototype.writeUintBE = Buffer1.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength6) {
    if (byteLength6 === 6) {
        return writeU_Int48BE(this, value, offset, 0, 281474976710655);
    }
    if (byteLength6 === 5) {
        return writeU_Int40BE(this, value, offset, 0, 1099511627775);
    }
    if (byteLength6 === 3) {
        return writeU_Int24BE(this, value, offset, 0, 16777215);
    }
    if (byteLength6 === 4) {
        return writeU_Int32BE(this, value, offset, 0, 4294967295);
    }
    if (byteLength6 === 2) {
        return writeU_Int16BE(this, value, offset, 0, 65535);
    }
    if (byteLength6 === 1) {
        return writeU_Int8(this, value, offset, 0, 255);
    }
    boundsError(byteLength6, 6, "byteLength");
};
Buffer1.prototype.writeUint8 = Buffer1.prototype.writeUInt8 = function writeUInt8(value, offset = 0) {
    return writeU_Int8(this, value, offset, 0, 255);
};
Buffer1.prototype.writeUint16LE = Buffer1.prototype.writeUInt16LE = function writeUInt16LE(value, offset = 0) {
    return writeU_Int16LE(this, value, offset, 0, 65535);
};
Buffer1.prototype.writeUint16BE = Buffer1.prototype.writeUInt16BE = function writeUInt16BE(value, offset = 0) {
    return writeU_Int16BE(this, value, offset, 0, 65535);
};
Buffer1.prototype.writeUint32LE = Buffer1.prototype.writeUInt32LE = function writeUInt32LE(value, offset = 0) {
    return _writeUInt32LE(this, value, offset, 0, 4294967295);
};
Buffer1.prototype.writeUint32BE = Buffer1.prototype.writeUInt32BE = function writeUInt32BE(value, offset = 0) {
    return _writeUInt32BE(this, value, offset, 0, 4294967295);
};
function wrtBigUInt64LE(buf, value, offset, min17, max) {
    checkIntBI(value, min17, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
}
function wrtBigUInt64BE(buf, value, offset, min18, max) {
    checkIntBI(value, min18, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
}
Buffer1.prototype.writeBigUint64LE = Buffer1.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
});
Buffer1.prototype.writeBigUint64BE = Buffer1.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
});
Buffer1.prototype.writeIntLE = function writeIntLE(value, offset, byteLength7) {
    if (byteLength7 === 6) {
        return writeU_Int48LE(this, value, offset, -140737488355328, 140737488355327);
    }
    if (byteLength7 === 5) {
        return writeU_Int40LE(this, value, offset, -549755813888, 549755813887);
    }
    if (byteLength7 === 3) {
        return writeU_Int24LE(this, value, offset, -8388608, 8388607);
    }
    if (byteLength7 === 4) {
        return writeU_Int32LE(this, value, offset, -2147483648, 2147483647);
    }
    if (byteLength7 === 2) {
        return writeU_Int16LE(this, value, offset, -32768, 32767);
    }
    if (byteLength7 === 1) {
        return writeU_Int8(this, value, offset, -128, 127);
    }
    boundsError(byteLength7, 6, "byteLength");
};
Buffer1.prototype.writeIntBE = function writeIntBE(value, offset, byteLength8) {
    if (byteLength8 === 6) {
        return writeU_Int48BE(this, value, offset, -140737488355328, 140737488355327);
    }
    if (byteLength8 === 5) {
        return writeU_Int40BE(this, value, offset, -549755813888, 549755813887);
    }
    if (byteLength8 === 3) {
        return writeU_Int24BE(this, value, offset, -8388608, 8388607);
    }
    if (byteLength8 === 4) {
        return writeU_Int32BE(this, value, offset, -2147483648, 2147483647);
    }
    if (byteLength8 === 2) {
        return writeU_Int16BE(this, value, offset, -32768, 32767);
    }
    if (byteLength8 === 1) {
        return writeU_Int8(this, value, offset, -128, 127);
    }
    boundsError(byteLength8, 6, "byteLength");
};
Buffer1.prototype.writeInt8 = function writeInt8(value, offset = 0) {
    return writeU_Int8(this, value, offset, -128, 127);
};
Buffer1.prototype.writeInt16LE = function writeInt16LE(value, offset = 0) {
    return writeU_Int16LE(this, value, offset, -32768, 32767);
};
Buffer1.prototype.writeInt16BE = function writeInt16BE(value, offset = 0) {
    return writeU_Int16BE(this, value, offset, -32768, 32767);
};
Buffer1.prototype.writeInt32LE = function writeInt32LE(value, offset = 0) {
    return writeU_Int32LE(this, value, offset, -2147483648, 2147483647);
};
Buffer1.prototype.writeInt32BE = function writeInt32BE(value, offset = 0) {
    return writeU_Int32BE(this, value, offset, -2147483648, 2147483647);
};
Buffer1.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
});
Buffer1.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
});
Buffer1.prototype.writeFloatLE = function writeFloatLE(value, offset) {
    return bigEndian ? writeFloatBackwards(this, value, offset) : writeFloatForwards(this, value, offset);
};
Buffer1.prototype.writeFloatBE = function writeFloatBE(value, offset) {
    return bigEndian ? writeFloatForwards(this, value, offset) : writeFloatBackwards(this, value, offset);
};
Buffer1.prototype.writeDoubleLE = function writeDoubleLE(value, offset) {
    return bigEndian ? writeDoubleBackwards(this, value, offset) : writeDoubleForwards(this, value, offset);
};
Buffer1.prototype.writeDoubleBE = function writeDoubleBE(value, offset) {
    return bigEndian ? writeDoubleForwards(this, value, offset) : writeDoubleBackwards(this, value, offset);
};
Buffer1.prototype.copy = function copy(target, targetStart, sourceStart, sourceEnd) {
    if (!isUint8Array(this)) {
        throw new ERR_INVALID_ARG_TYPE("source", [
            "Buffer",
            "Uint8Array"
        ], this);
    }
    if (!isUint8Array(target)) {
        throw new ERR_INVALID_ARG_TYPE("target", [
            "Buffer",
            "Uint8Array"
        ], target);
    }
    if (targetStart === undefined) {
        targetStart = 0;
    } else {
        targetStart = toInteger(targetStart, 0);
        if (targetStart < 0) {
            throw new ERR_OUT_OF_RANGE("targetStart", ">= 0", targetStart);
        }
    }
    if (sourceStart === undefined) {
        sourceStart = 0;
    } else {
        sourceStart = toInteger(sourceStart, 0);
        if (sourceStart < 0) {
            throw new ERR_OUT_OF_RANGE("sourceStart", ">= 0", sourceStart);
        }
    }
    if (sourceEnd === undefined) {
        sourceEnd = this.length;
    } else {
        sourceEnd = toInteger(sourceEnd, 0);
        if (sourceEnd < 0) {
            throw new ERR_OUT_OF_RANGE("sourceEnd", ">= 0", sourceEnd);
        }
    }
    if (targetStart >= target.length) {
        return 0;
    }
    if (sourceEnd > 0 && sourceEnd < sourceStart) {
        sourceEnd = sourceStart;
    }
    if (sourceEnd === sourceStart) {
        return 0;
    }
    if (target.length === 0 || this.length === 0) {
        return 0;
    }
    if (sourceEnd > this.length) {
        sourceEnd = this.length;
    }
    if (target.length - targetStart < sourceEnd - sourceStart) {
        sourceEnd = target.length - targetStart + sourceStart;
    }
    const len = sourceEnd - sourceStart;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, sourceStart, sourceEnd);
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(sourceStart, sourceEnd), targetStart);
    }
    return len;
};
Buffer1.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
        if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer1.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
                val = code;
            }
        }
    } else if (typeof val === "number") {
        val = val & 255;
    } else if (typeof val === "boolean") {
        val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
    }
    if (end <= start) {
        return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val) {
        val = 0;
    }
    let i;
    if (typeof val === "number") {
        for(i = start; i < end; ++i){
            this[i] = val;
        }
    } else {
        const bytes = Buffer1.isBuffer(val) ? val : Buffer1.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for(i = 0; i < end - start; ++i){
            this[i + start] = bytes[i % len];
        }
    }
    return this;
};
function checkBounds1(buf, offset, byteLength2) {
    validateNumber(offset, "offset");
    if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
    }
}
function checkIntBI(value, min19, max, buf, offset, byteLength2) {
    if (value > max || value < min19) {
        const n = typeof min19 === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
            if (min19 === 0 || min19 === BigInt(0)) {
                range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
                range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
        } else {
            range = `>= ${min19}${n} and <= ${max}${n}`;
        }
        throw new ERR_OUT_OF_RANGE("value", range, value);
    }
    checkBounds1(buf, offset, byteLength2);
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for(let i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
                if (codePoint > 56319) {
                    if ((units -= 3) > -1) {
                        bytes.push(239, 191, 189);
                    }
                    continue;
                } else if (i + 1 === length) {
                    if ((units -= 3) > -1) {
                        bytes.push(239, 191, 189);
                    }
                    continue;
                }
                leadSurrogate = codePoint;
                continue;
            }
            if (codePoint < 56320) {
                if ((units -= 3) > -1) {
                    bytes.push(239, 191, 189);
                }
                leadSurrogate = codePoint;
                continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
            if ((units -= 3) > -1) {
                bytes.push(239, 191, 189);
            }
        }
        leadSurrogate = null;
        if (codePoint < 128) {
            if ((units -= 1) < 0) {
                break;
            }
            bytes.push(codePoint);
        } else if (codePoint < 2048) {
            if ((units -= 2) < 0) {
                break;
            }
            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
            if ((units -= 3) < 0) {
                break;
            }
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) {
                break;
            }
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else {
            throw new Error("Invalid code point");
        }
    }
    return bytes;
}
function blitBuffer(src, dst, offset, length) {
    let i;
    for(i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) {
            break;
        }
        dst[i + offset] = src[i];
    }
    return i;
}
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
const hexSliceLookupTable = function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for(let i = 0; i < 16; ++i){
        const i16 = i * 16;
        for(let j = 0; j < 16; ++j){
            table[i16 + j] = alphabet[i] + alphabet[j];
        }
    }
    return table;
}();
function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
}
function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
}
globalThis.atob;
globalThis.Blob;
globalThis.btoa;
var valueType;
(function(valueType1) {
    valueType1[valueType1["noIterator"] = 0] = "noIterator";
    valueType1[valueType1["isArray"] = 1] = "isArray";
    valueType1[valueType1["isSet"] = 2] = "isSet";
    valueType1[valueType1["isMap"] = 3] = "isMap";
})(valueType || (valueType = {
}));
let memo;
function parseFileMode(value, name, def) {
    value ??= def;
    if (typeof value === "string") {
        if (!octalReg.test(value)) {
            throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
        }
        value = Number.parseInt(value, 8);
    }
    validateInt32(value, name, 0, 2 ** 32 - 1);
    return value;
}
const validateInteger = hideStackFrames((value, name, min20 = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER)=>{
    if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
    }
    if (!Number.isInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
    }
    if (value < min20 || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min20} && <= ${max}`, value);
    }
});
const validateInt32 = hideStackFrames((value, name, min21 = -2147483648, max = 2147483647)=>{
    if (!isInt32(value)) {
        if (typeof value !== "number") {
            throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        }
        if (!Number.isInteger(value)) {
            throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        throw new ERR_OUT_OF_RANGE(name, `>= ${min21} && <= ${max}`, value);
    }
    if (value < min21 || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min21} && <= ${max}`, value);
    }
});
const validateUint32 = hideStackFrames((value, name, positive)=>{
    if (!isUint32(value)) {
        if (typeof value !== "number") {
            throw new ERR_INVALID_ARG_TYPE(name, "number", value);
        }
        if (!Number.isInteger(value)) {
            throw new ERR_OUT_OF_RANGE(name, "an integer", value);
        }
        const min22 = positive ? 1 : 0;
        throw new ERR_OUT_OF_RANGE(name, `>= ${min22} && < 4294967296`, value);
    }
    if (positive && value === 0) {
        throw new ERR_OUT_OF_RANGE(name, ">= 1 && < 4294967296", value);
    }
});
function validateBoolean(value, name) {
    if (typeof value !== "boolean") {
        throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
    }
}
hideStackFrames((value, name, oneOf)=>{
    if (!Array.prototype.includes.call(oneOf, value)) {
        const allowed = Array.prototype.join.call(Array.prototype.map.call(oneOf, (v)=>typeof v === "string" ? `'${v}'` : String(v)
        ), ", ");
        const reason = "must be one of: " + allowed;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
});
const validateCallback = hideStackFrames((callback)=>{
    if (typeof callback !== "function") {
        throw new ERR_INVALID_CALLBACK(callback);
    }
});
const validateAbortSignal = hideStackFrames((signal, name)=>{
    if (signal !== undefined && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
});
const validateFunction = hideStackFrames((value, name)=>{
    if (typeof value !== "function") {
        throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    }
});
hideStackFrames((value, name, minLength = 0)=>{
    if (!Array.isArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
    }
    if (value.length < minLength) {
        const reason = `must be longer than ${minLength}`;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
    }
});
let _exiting1 = false;
if (typeof core.setNextTickCallback !== "undefined") {
    function runNextTicks() {
        if (!core.hasTickScheduled()) {
            core.runMicrotasks();
        }
        if (!core.hasTickScheduled()) {
            return true;
        }
        processTicksAndRejections();
        return true;
    }
    function processTicksAndRejections() {
        let tock;
        do {
            while(tock = queue.shift()){
                try {
                    const callback = tock.callback;
                    if (tock.args === undefined) {
                        callback();
                    } else {
                        const args = tock.args;
                        switch(args.length){
                            case 1:
                                callback(args[0]);
                                break;
                            case 2:
                                callback(args[0], args[1]);
                                break;
                            case 3:
                                callback(args[0], args[1], args[2]);
                                break;
                            case 4:
                                callback(args[0], args[1], args[2], args[3]);
                                break;
                            default:
                                callback(...args);
                        }
                    }
                } finally{
                }
            }
            core.runMicrotasks();
        }while (!queue.isEmpty())
        core.setHasTickScheduled(false);
    }
    core.setNextTickCallback(processTicksAndRejections);
    core.setMacrotaskCallback(runNextTicks);
    function __nextTickNative(callback, ...args) {
        validateCallback(callback);
        if (_exiting1) {
            return;
        }
        let args_;
        switch(args.length){
            case 0:
                break;
            case 1:
                args_ = [
                    args[0]
                ];
                break;
            case 2:
                args_ = [
                    args[0],
                    args[1]
                ];
                break;
            case 3:
                args_ = [
                    args[0],
                    args[1],
                    args[2]
                ];
                break;
            default:
                args_ = new Array(args.length);
                for(let i = 0; i < args.length; i++){
                    args_[i] = args[i];
                }
        }
        if (queue.isEmpty()) {
            core.setHasTickScheduled(true);
        }
        const tickObject = {
            callback,
            args: args_
        };
        queue.push(tickObject);
    }
    _nextTick = __nextTickNative;
} else {
    function __nextTickQueueMicrotask(callback, ...args) {
        if (args) {
            queueMicrotask(()=>callback.call(this, ...args)
            );
        } else {
            queueMicrotask(callback);
        }
    }
    _nextTick = __nextTickQueueMicrotask;
}
const forwardSlashRegEx = /\//g;
const hexTable = new Array(256);
function buildReturnPropertyType(value) {
    if (value && value.constructor && value.constructor.name) {
        return `instance of ${value.constructor.name}`;
    } else {
        return `type ${typeof value}`;
    }
}
class ERR_INVALID_RETURN_VALUE extends NodeTypeError {
    constructor(input7, name, value){
        super("ERR_INVALID_RETURN_VALUE", `Expected ${input7} to be returned from the "${name}" function but got ${buildReturnPropertyType(value)}.`);
    }
}
class ERR_INVALID_URL_SCHEME extends NodeTypeError {
    constructor(expected){
        expected = Array.isArray(expected) ? expected : [
            expected
        ];
        const res = expected.length === 2 ? `one of scheme ${expected[0]} or ${expected[1]}` : `of scheme ${expected[0]}`;
        super("ERR_INVALID_URL_SCHEME", `The URL must be ${res}`);
    }
}
const protocolPattern = /^[a-z0-9.+-]+:/i;
const portPattern = /:[0-9]*$/;
const hostPattern = /^\/\/[^@/]+@[^@/]+/;
const simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
const unsafeProtocol = new Set([
    "javascript",
    "javascript:"
]);
const hostlessProtocol = new Set([
    "javascript",
    "javascript:"
]);
const slashedProtocol = new Set([
    "http",
    "http:",
    "https",
    "https:",
    "ftp",
    "ftp:",
    "gopher",
    "gopher:",
    "file",
    "file:",
    "ws",
    "ws:",
    "wss",
    "wss:", 
]);
const noEscapeAuth = new Int8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    0
]);
let querystring = null;
for(let i1 = 0; i1 < 256; ++i1){
    hexTable[i1] = "%" + ((i1 < 16 ? "0" : "") + i1.toString(16)).toUpperCase();
}
new Int8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
]);
function encodeStr(str, noEscapeTable, hexTable1) {
    const len = str.length;
    if (len === 0) return "";
    let out = "";
    let lastPos = 0;
    for(let i110 = 0; i110 < len; i110++){
        let c = str.charCodeAt(i110);
        if (c < 128) {
            if (noEscapeTable[c] === 1) continue;
            if (lastPos < i110) out += str.slice(lastPos, i110);
            lastPos = i110 + 1;
            out += hexTable1[c];
            continue;
        }
        if (lastPos < i110) out += str.slice(lastPos, i110);
        if (c < 2048) {
            lastPos = i110 + 1;
            out += hexTable1[192 | c >> 6] + hexTable1[128 | c & 63];
            continue;
        }
        if (c < 55296 || c >= 57344) {
            lastPos = i110 + 1;
            out += hexTable1[224 | c >> 12] + hexTable1[128 | c >> 6 & 63] + hexTable1[128 | c & 63];
            continue;
        }
        ++i110;
        if (i110 >= len) throw new ERR_INVALID_URI();
        const c2 = str.charCodeAt(i110) & 1023;
        lastPos = i110 + 1;
        c = 65536 + ((c & 1023) << 10 | c2);
        out += hexTable1[240 | c >> 18] + hexTable1[128 | c >> 12 & 63] + hexTable1[128 | c >> 6 & 63] + hexTable1[128 | c & 63];
    }
    if (lastPos === 0) return str;
    if (lastPos < len) return out + str.slice(lastPos);
    return out;
}
class Url {
    protocol;
    slashes;
    auth;
    host;
    port;
    hostname;
    hash;
    search;
    query;
    pathname;
    path;
    href;
    constructor(){
        this.protocol = null;
        this.slashes = null;
        this.auth = null;
        this.host = null;
        this.port = null;
        this.hostname = null;
        this.hash = null;
        this.search = null;
        this.query = null;
        this.pathname = null;
        this.path = null;
        this.href = null;
    }
    parseHost() {
        let host = this.host || "";
        let port = portPattern.exec(host);
        if (port) {
            port = port[0];
            if (port !== ":") {
                this.port = port.slice(1);
            }
            host = host.slice(0, host.length - port.length);
        }
        if (host) this.hostname = host;
    }
    resolveObject(relative6) {
        if (typeof relative6 === "string") {
            const rel = new Url();
            rel.urlParse(relative6, false, true);
            relative6 = rel;
        }
        const result = new Url();
        const tkeys = Object.keys(this);
        for(let tk = 0; tk < tkeys.length; tk++){
            const tkey = tkeys[tk];
            result[tkey] = this[tkey];
        }
        result.hash = relative6.hash;
        if (relative6.href === "") {
            result.href = result.format();
            return result;
        }
        if (relative6.slashes && !relative6.protocol) {
            const rkeys = Object.keys(relative6);
            for(let rk = 0; rk < rkeys.length; rk++){
                const rkey = rkeys[rk];
                if (rkey !== "protocol") result[rkey] = relative6[rkey];
            }
            if (result.protocol && slashedProtocol.has(result.protocol) && result.hostname && !result.pathname) {
                result.path = result.pathname = "/";
            }
            result.href = result.format();
            return result;
        }
        if (relative6.protocol && relative6.protocol !== result.protocol) {
            if (!slashedProtocol.has(relative6.protocol)) {
                const keys = Object.keys(relative6);
                for(let v = 0; v < keys.length; v++){
                    const k = keys[v];
                    result[k] = relative6[k];
                }
                result.href = result.format();
                return result;
            }
            result.protocol = relative6.protocol;
            if (!relative6.host && !/^file:?$/.test(relative6.protocol) && !hostlessProtocol.has(relative6.protocol)) {
                const relPath = (relative6.pathname || "").split("/");
                while(relPath.length && !(relative6.host = relPath.shift() || null));
                if (!relative6.host) relative6.host = "";
                if (!relative6.hostname) relative6.hostname = "";
                if (relPath[0] !== "") relPath.unshift("");
                if (relPath.length < 2) relPath.unshift("");
                result.pathname = relPath.join("/");
            } else {
                result.pathname = relative6.pathname;
            }
            result.search = relative6.search;
            result.query = relative6.query;
            result.host = relative6.host || "";
            result.auth = relative6.auth;
            result.hostname = relative6.hostname || relative6.host;
            result.port = relative6.port;
            if (result.pathname || result.search) {
                const p = result.pathname || "";
                const s = result.search || "";
                result.path = p + s;
            }
            result.slashes = result.slashes || relative6.slashes;
            result.href = result.format();
            return result;
        }
        const isSourceAbs = result.pathname && result.pathname.charAt(0) === "/";
        const isRelAbs = relative6.host || relative6.pathname && relative6.pathname.charAt(0) === "/";
        let mustEndAbs = isRelAbs || isSourceAbs || result.host && relative6.pathname;
        const removeAllDots = mustEndAbs;
        let srcPath = result.pathname && result.pathname.split("/") || [];
        const relPath = relative6.pathname && relative6.pathname.split("/") || [];
        const noLeadingSlashes = result.protocol && !slashedProtocol.has(result.protocol);
        if (noLeadingSlashes) {
            result.hostname = "";
            result.port = null;
            if (result.host) {
                if (srcPath[0] === "") srcPath[0] = result.host;
                else srcPath.unshift(result.host);
            }
            result.host = "";
            if (relative6.protocol) {
                relative6.hostname = null;
                relative6.port = null;
                result.auth = null;
                if (relative6.host) {
                    if (relPath[0] === "") relPath[0] = relative6.host;
                    else relPath.unshift(relative6.host);
                }
                relative6.host = null;
            }
            mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
        }
        if (isRelAbs) {
            if (relative6.host || relative6.host === "") {
                if (result.host !== relative6.host) result.auth = null;
                result.host = relative6.host;
                result.port = relative6.port;
            }
            if (relative6.hostname || relative6.hostname === "") {
                if (result.hostname !== relative6.hostname) result.auth = null;
                result.hostname = relative6.hostname;
            }
            result.search = relative6.search;
            result.query = relative6.query;
            srcPath = relPath;
        } else if (relPath.length) {
            if (!srcPath) srcPath = [];
            srcPath.pop();
            srcPath = srcPath.concat(relPath);
            result.search = relative6.search;
            result.query = relative6.query;
        } else if (relative6.search !== null && relative6.search !== undefined) {
            if (noLeadingSlashes) {
                result.hostname = result.host = srcPath.shift() || null;
                const authInHost = result.host && result.host.indexOf("@") > 0 && result.host.split("@");
                if (authInHost) {
                    result.auth = authInHost.shift() || null;
                    result.host = result.hostname = authInHost.shift() || null;
                }
            }
            result.search = relative6.search;
            result.query = relative6.query;
            if (result.pathname !== null || result.search !== null) {
                result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
            }
            result.href = result.format();
            return result;
        }
        if (!srcPath.length) {
            result.pathname = null;
            if (result.search) {
                result.path = "/" + result.search;
            } else {
                result.path = null;
            }
            result.href = result.format();
            return result;
        }
        let last = srcPath.slice(-1)[0];
        const hasTrailingSlash = (result.host || relative6.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
        let up = 0;
        for(let i = srcPath.length - 1; i >= 0; i--){
            last = srcPath[i];
            if (last === ".") {
                srcPath.slice(i);
            } else if (last === "..") {
                srcPath.slice(i);
                up++;
            } else if (up) {
                srcPath.splice(i);
                up--;
            }
        }
        if (!mustEndAbs && !removeAllDots) {
            while(up--){
                srcPath.unshift("..");
            }
        }
        if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
            srcPath.unshift("");
        }
        if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
            srcPath.push("");
        }
        const isAbsolute6 = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
        if (noLeadingSlashes) {
            result.hostname = result.host = isAbsolute6 ? "" : srcPath.length ? srcPath.shift() || null : "";
            const authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
            if (authInHost) {
                result.auth = authInHost.shift() || null;
                result.host = result.hostname = authInHost.shift() || null;
            }
        }
        mustEndAbs = mustEndAbs || result.host && srcPath.length;
        if (mustEndAbs && !isAbsolute6) {
            srcPath.unshift("");
        }
        if (!srcPath.length) {
            result.pathname = null;
            result.path = null;
        } else {
            result.pathname = srcPath.join("/");
        }
        if (result.pathname !== null || result.search !== null) {
            result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.auth = relative6.auth || result.auth;
        result.slashes = result.slashes || relative6.slashes;
        result.href = result.format();
        return result;
    }
    format() {
        let auth = this.auth || "";
        if (auth) {
            auth = encodeStr(auth, noEscapeAuth, hexTable);
            auth += "@";
        }
        let protocol = this.protocol || "";
        let pathname = this.pathname || "";
        let hash = this.hash || "";
        let host = "";
        let query = "";
        if (this.host) {
            host = auth + this.host;
        } else if (this.hostname) {
            host = auth + (this.hostname.includes(":") && !isIpv6Hostname(this.hostname) ? "[" + this.hostname + "]" : this.hostname);
            if (this.port) {
                host += ":" + this.port;
            }
        }
        if (this.query !== null && typeof this.query === "object") {
            if (querystring === undefined) {
                querystring = import("./querystring.ts");
            }
            query = querystring.stringify(this.query);
        }
        let search = this.search || query && "?" + query || "";
        if (protocol && protocol.charCodeAt(protocol.length - 1) !== 58) {
            protocol += ":";
        }
        let newPathname = "";
        let lastPos = 0;
        for(let i = 0; i < pathname.length; ++i){
            switch(pathname.charCodeAt(i)){
                case 35:
                    if (i - lastPos > 0) {
                        newPathname += pathname.slice(lastPos, i);
                    }
                    newPathname += "%23";
                    lastPos = i + 1;
                    break;
                case 63:
                    if (i - lastPos > 0) {
                        newPathname += pathname.slice(lastPos, i);
                    }
                    newPathname += "%3F";
                    lastPos = i + 1;
                    break;
            }
        }
        if (lastPos > 0) {
            if (lastPos !== pathname.length) {
                pathname = newPathname + pathname.slice(lastPos);
            } else pathname = newPathname;
        }
        if (this.slashes || slashedProtocol.has(protocol)) {
            if (this.slashes || host) {
                if (pathname && pathname.charCodeAt(0) !== 47) {
                    pathname = "/" + pathname;
                }
                host = "//" + host;
            } else if (protocol.length >= 4 && protocol.charCodeAt(0) === 102 && protocol.charCodeAt(1) === 105 && protocol.charCodeAt(2) === 108 && protocol.charCodeAt(3) === 101) {
                host = "//";
            }
        }
        search = search.replace(/#/g, "%23");
        if (hash && hash.charCodeAt(0) !== 35) {
            hash = "#" + hash;
        }
        if (search && search.charCodeAt(0) !== 63) {
            search = "?" + search;
        }
        return protocol + host + pathname + search + hash;
    }
    urlParse(url, parseQueryString, slashesDenoteHost) {
        let hasHash = false;
        let start = -1;
        let end = -1;
        let rest = "";
        let lastPos = 0;
        for(let i = 0, inWs = false, split = false; i < url.length; ++i){
            const code = url.charCodeAt(i);
            const isWs = code === 32 || code === 9 || code === 13 || code === 10 || code === 12 || code === 160 || code === 65279;
            if (start === -1) {
                if (isWs) continue;
                lastPos = start = i;
            } else if (inWs) {
                if (!isWs) {
                    end = -1;
                    inWs = false;
                }
            } else if (isWs) {
                end = i;
                inWs = true;
            }
            if (!split) {
                switch(code){
                    case 35:
                        hasHash = true;
                    case 63:
                        split = true;
                        break;
                    case 92:
                        if (i - lastPos > 0) rest += url.slice(lastPos, i);
                        rest += "/";
                        lastPos = i + 1;
                        break;
                }
            } else if (!hasHash && code === 35) {
                hasHash = true;
            }
        }
        if (start !== -1) {
            if (lastPos === start) {
                if (end === -1) {
                    if (start === 0) rest = url;
                    else rest = url.slice(start);
                } else {
                    rest = url.slice(start, end);
                }
            } else if (end === -1 && lastPos < url.length) {
                rest += url.slice(lastPos);
            } else if (end !== -1 && lastPos < end) {
                rest += url.slice(lastPos, end);
            }
        }
        if (!slashesDenoteHost && !hasHash) {
            const simplePath = simplePathPattern.exec(rest);
            if (simplePath) {
                this.path = rest;
                this.href = rest;
                this.pathname = simplePath[1];
                if (simplePath[2]) {
                    this.search = simplePath[2];
                    if (parseQueryString) {
                        if (querystring === undefined) {
                            querystring = import("./querystring.ts");
                        }
                        this.query = querystring.parse(this.search.slice(1));
                    } else {
                        this.query = this.search.slice(1);
                    }
                } else if (parseQueryString) {
                    this.search = null;
                    this.query = Object.create(null);
                }
                return this;
            }
        }
        let proto2 = protocolPattern.exec(rest);
        let lowerProto = "";
        if (proto2) {
            proto2 = proto2[0];
            lowerProto = proto2.toLowerCase();
            this.protocol = lowerProto;
            rest = rest.slice(proto2.length);
        }
        let slashes;
        if (slashesDenoteHost || proto2 || hostPattern.test(rest)) {
            slashes = rest.charCodeAt(0) === CHAR_FORWARD_SLASH1 && rest.charCodeAt(1) === CHAR_FORWARD_SLASH1;
            if (slashes && !(proto2 && hostlessProtocol.has(lowerProto))) {
                rest = rest.slice(2);
                this.slashes = true;
            }
        }
        if (!hostlessProtocol.has(lowerProto) && (slashes || proto2 && !slashedProtocol.has(proto2))) {
            let hostEnd = -1;
            let atSign = -1;
            let nonHost = -1;
            for(let i = 0; i < rest.length; ++i){
                switch(rest.charCodeAt(i)){
                    case 9:
                    case 10:
                    case 13:
                    case 32:
                    case 34:
                    case 37:
                    case 39:
                    case 59:
                    case 60:
                    case 62:
                    case 92:
                    case 94:
                    case 96:
                    case 123:
                    case 124:
                    case 125:
                        if (nonHost === -1) nonHost = i;
                        break;
                    case 35:
                    case 47:
                    case 63:
                        if (nonHost === -1) nonHost = i;
                        hostEnd = i;
                        break;
                    case 64:
                        atSign = i;
                        nonHost = -1;
                        break;
                }
                if (hostEnd !== -1) break;
            }
            start = 0;
            if (atSign !== -1) {
                this.auth = decodeURIComponent(rest.slice(0, atSign));
                start = atSign + 1;
            }
            if (nonHost === -1) {
                this.host = rest.slice(start);
                rest = "";
            } else {
                this.host = rest.slice(start, nonHost);
                rest = rest.slice(nonHost);
            }
            this.parseHost();
            if (typeof this.hostname !== "string") this.hostname = "";
            const hostname = this.hostname;
            const ipv6Hostname = isIpv6Hostname(hostname);
            if (!ipv6Hostname) {
                rest = getHostname(this, rest, hostname);
            }
            if (this.hostname.length > 255) {
                this.hostname = "";
            } else {
                this.hostname = this.hostname.toLowerCase();
            }
            if (!ipv6Hostname) {
                this.hostname = toASCII(this.hostname);
            }
            const p = this.port ? ":" + this.port : "";
            const h = this.hostname || "";
            this.host = h + p;
            if (ipv6Hostname) {
                this.hostname = this.hostname.slice(1, -1);
                if (rest[0] !== "/") {
                    rest = "/" + rest;
                }
            }
        }
        if (!unsafeProtocol.has(lowerProto)) {
            rest = autoEscapeStr(rest);
        }
        let questionIdx = -1;
        let hashIdx = -1;
        for(let i111 = 0; i111 < rest.length; ++i111){
            const code = rest.charCodeAt(i111);
            if (code === 35) {
                this.hash = rest.slice(i111);
                hashIdx = i111;
                break;
            } else if (code === 63 && questionIdx === -1) {
                questionIdx = i111;
            }
        }
        if (questionIdx !== -1) {
            if (hashIdx === -1) {
                this.search = rest.slice(questionIdx);
                this.query = rest.slice(questionIdx + 1);
            } else {
                this.search = rest.slice(questionIdx, hashIdx);
                this.query = rest.slice(questionIdx + 1, hashIdx);
            }
            if (parseQueryString) {
                if (querystring === undefined) {
                    querystring = import("./querystring.ts");
                }
                this.query = querystring.parse(this.query);
            }
        } else if (parseQueryString) {
            this.search = null;
            this.query = Object.create(null);
        }
        const useQuestionIdx = questionIdx !== -1 && (hashIdx === -1 || questionIdx < hashIdx);
        const firstIdx = useQuestionIdx ? questionIdx : hashIdx;
        if (firstIdx === -1) {
            if (rest.length > 0) this.pathname = rest;
        } else if (firstIdx > 0) {
            this.pathname = rest.slice(0, firstIdx);
        }
        if (slashedProtocol.has(lowerProto) && this.hostname && !this.pathname) {
            this.pathname = "/";
        }
        if (this.pathname || this.search) {
            const p = this.pathname || "";
            const s = this.search || "";
            this.path = p + s;
        }
        this.href = this.format();
        return this;
    }
}
function isIpv6Hostname(hostname) {
    return hostname.charCodeAt(0) === 91 && hostname.charCodeAt(hostname.length - 1) === 93;
}
function getHostname(self, rest, hostname) {
    for(let i = 0; i < hostname.length; ++i){
        const code = hostname.charCodeAt(i);
        const isValid = code >= 97 && code <= 122 || code === 46 || code >= 65 && code <= 90 || code >= 48 && code <= 57 || code === 45 || code === 43 || code === 95 || code > 127;
        if (!isValid) {
            self.hostname = hostname.slice(0, i);
            return `/${hostname.slice(i)}${rest}`;
        }
    }
    return rest;
}
const escapedCodes = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '%09',
    '%0A',
    '',
    '',
    '%0D',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '%20',
    '',
    '%22',
    '',
    '',
    '',
    '',
    '%27',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '%3C',
    '',
    '%3E',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '%5C',
    '',
    '%5E',
    '',
    '%60',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '%7B',
    '%7C',
    '%7D', 
];
function autoEscapeStr(rest) {
    let escaped = "";
    let lastEscapedPos = 0;
    for(let i = 0; i < rest.length; ++i){
        const escapedChar = escapedCodes[rest.charCodeAt(i)];
        if (escapedChar) {
            if (i > lastEscapedPos) {
                escaped += rest.slice(lastEscapedPos, i);
            }
            escaped += escapedChar;
            lastEscapedPos = i + 1;
        }
    }
    if (lastEscapedPos === 0) {
        return rest;
    }
    if (lastEscapedPos < rest.length) {
        escaped += rest.slice(lastEscapedPos);
    }
    return escaped;
}
function fileURLToPath(path) {
    if (typeof path === "string") path = new URL(path);
    else if (!(path instanceof URL)) {
        throw new ERR_INVALID_ARG_TYPE("path", [
            "string",
            "URL"
        ], path);
    }
    if (path.protocol !== "file:") {
        throw new ERR_INVALID_URL_SCHEME("file");
    }
    return isWindows1 ? getPathFromURLWin(path) : getPathFromURLPosix(path);
}
function getPathFromURLWin(url) {
    const hostname = url.hostname;
    let pathname = url.pathname;
    for(let n = 0; n < pathname.length; n++){
        if (pathname[n] === "%") {
            const third = pathname.codePointAt(n + 2) | 32;
            if (pathname[n + 1] === "2" && third === 102 || pathname[n + 1] === "5" && third === 99) {
                throw new ERR_INVALID_FILE_URL_PATH("must not include encoded \\ or / characters");
            }
        }
    }
    pathname = pathname.replace(forwardSlashRegEx, "\\");
    pathname = decodeURIComponent(pathname);
    if (hostname !== "") {
        return `\\\\${hostname}${pathname}`;
    } else {
        const letter = pathname.codePointAt(1) | 32;
        const sep11 = pathname[2];
        if (letter < 97 || letter > 122 || sep11 !== ":") {
            throw new ERR_INVALID_FILE_URL_PATH("must be absolute");
        }
        return pathname.slice(1);
    }
}
function getPathFromURLPosix(url) {
    if (url.hostname !== "") {
        throw new ERR_INVALID_FILE_URL_HOST(osType);
    }
    const pathname = url.pathname;
    for(let n = 0; n < pathname.length; n++){
        if (pathname[n] === "%") {
            const third = pathname.codePointAt(n + 2) | 32;
            if (pathname[n + 1] === "2" && third === 102) {
                throw new ERR_INVALID_FILE_URL_PATH("must not include encoded / characters");
            }
        }
    }
    return decodeURIComponent(pathname);
}
class ERR_INTERNAL_ASSERTION extends NodeError {
    constructor(message){
        const suffix = "This is caused by either a bug in Node.js " + "or incorrect usage of Node.js internals.\n" + "Please open an issue with this stack trace at " + "https://github.com/nodejs/node/issues\n";
        super("ERR_INTERNAL_ASSERTION", message === undefined ? suffix : `${message}\n${suffix}`);
    }
}
class ERR_FS_RMDIR_ENOTDIR extends NodeSystemError {
    constructor(path){
        const code = isWindows1 ? "ENOENT" : "ENOTDIR";
        const ctx = {
            message: "not a directory",
            path,
            syscall: "rmdir",
            code,
            errno: isWindows1 ? ENOENT : ENOTDIR
        };
        super(code, ctx, "Path is not a directory");
    }
}
function denoErrorToNodeError(e, ctx) {
    const errno = extractOsErrorNumberFromErrorMessage(e);
    if (typeof errno === "undefined") {
        return e;
    }
    const ex = uvException({
        errno: mapSysErrnoToUvErrno(errno),
        ...ctx
    });
    return ex;
}
function extractOsErrorNumberFromErrorMessage(e) {
    const match = e instanceof Error ? e.message.match(/\(os error (\d+)\)/) : false;
    if (match) {
        return +match[1];
    }
    return undefined;
}
function _arch() {
    if (Deno.build.arch == "x86_64") {
        return "x64";
    } else if (Deno.build.arch == "aarch64") {
        return "arm64";
    } else {
        throw Error("unreachable");
    }
}
const arch1 = _arch();
const chdir1 = Deno.chdir;
const cwd1 = Deno.cwd;
const nextTick1 = nextTick2;
const env1 = new Proxy({
}, {
    get (_target, prop) {
        return Deno.env.get(String(prop));
    },
    ownKeys: ()=>Reflect.ownKeys(Deno.env.toObject())
    ,
    getOwnPropertyDescriptor: ()=>({
            enumerable: true,
            configurable: true
        })
    ,
    set (_target, prop, value) {
        Deno.env.set(String(prop), String(value));
        return value;
    }
});
const pid1 = Deno.pid;
const platform1 = isWindows1 ? "win32" : Deno.build.os;
const version1 = "v16.11.1";
const versions1 = {
    node: "16.11.1",
    uv: "1.42.0",
    zlib: "1.2.11",
    brotli: "1.0.9",
    ares: "1.17.2",
    modules: "93",
    nghttp2: "1.45.1",
    napi: "8",
    llhttp: "6.0.4",
    openssl: "1.1.1l",
    cldr: "39.0",
    icu: "69.1",
    tz: "2021a",
    unicode: "13.0",
    ...Deno.version
};
function hrtime2(time) {
    const milli = performance.now();
    const sec = Math.floor(milli / 1000);
    const nano = Math.floor(milli * 1000000 - sec * 1000000000);
    if (!time) {
        return [
            sec,
            nano
        ];
    }
    const [prevSec, prevNano] = time;
    return [
        sec - prevSec,
        nano - prevNano
    ];
}
hrtime2.bigint = function() {
    const [sec, nano] = hrtime2();
    return BigInt(sec) * 1000000000n + BigInt(nano);
};
function memoryUsage2() {
    return {
        ...Deno.memoryUsage(),
        arrayBuffers: 0
    };
}
memoryUsage2.rss = function() {
    return memoryUsage2().rss;
};
let state1 = "";
if (Deno.permissions) {
    state1 = (await Deno.permissions.query({
        name: "env",
        variable: "NODE_DEBUG"
    })).state;
}
if (state1 === "granted") {
    initializeDebugEnv(Deno.env.get("NODE_DEBUG") ?? "");
} else {
    initializeDebugEnv("");
}
function isDeepEqual(val1, val2, strict, memos = memo) {
    if (val1 === val2) {
        if (val1 !== 0) return true;
        return strict ? Object.is(val1, val2) : true;
    }
    if (strict) {
        if (typeof val1 !== "object") {
            return typeof val1 === "number" && Number.isNaN(val1) && Number.isNaN(val2);
        }
        if (typeof val2 !== "object" || val1 === null || val2 === null) {
            return false;
        }
        if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
            return false;
        }
    } else {
        if (val1 === null || typeof val1 !== "object") {
            if (val2 === null || typeof val2 !== "object") {
                return val1 == val2 || Number.isNaN(val1) && Number.isNaN(val2);
            }
            return false;
        }
        if (val2 === null || typeof val2 !== "object") {
            return false;
        }
    }
    let val1Tag;
    let val2Tag;
    if (typeof val1 === "object" && val1 !== null) {
        val1Tag = val1.toString();
    }
    if (typeof val2 === "object" && val2 !== null) {
        val2Tag = val2.toString();
    }
    if (val1Tag !== val2Tag) {
        return false;
    }
    if (Array.isArray(val1)) {
        if (!Array.isArray(val2) || val1.length !== val2.length) {
            return false;
        }
        const filter = strict ? 2 : 2 | 16;
        const keys1 = getOwnNonIndexProperties(val1, filter);
        const keys2 = getOwnNonIndexProperties(val2, filter);
        if (keys1.length !== keys2.length) {
            return false;
        }
        return keyCheck(val1, val2, strict, memos, valueType.isArray, keys1);
    } else if (val1Tag === "[object Object]") {
        return keyCheck(val1, val2, strict, memos, valueType.noIterator);
    } else if (val1 instanceof Date) {
        if (!(val2 instanceof Date) || val1.getTime() !== val2.getTime()) {
            return false;
        }
    } else if (val1 instanceof RegExp) {
        if (!(val2 instanceof RegExp) || !areSimilarRegExps(val1, val2)) {
            return false;
        }
    } else if (isNativeError1(val1) || val1 instanceof Error) {
        if (!isNativeError1(val2) && !(val2 instanceof Error) || val1.message !== val2.message || val1.name !== val2.name) {
            return false;
        }
    } else if (isArrayBufferView(val1)) {
        const TypedArrayPrototypeGetSymbolToStringTag = (val)=>Object.getOwnPropertySymbols(val).map((item)=>item.toString()
            ).toString()
        ;
        if (isTypedArray(val1) && isTypedArray(val2) && TypedArrayPrototypeGetSymbolToStringTag(val1) !== TypedArrayPrototypeGetSymbolToStringTag(val2)) {
            return false;
        }
        if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
            if (!areSimilarFloatArrays(val1, val2)) {
                return false;
            }
        } else if (!areSimilarTypedArrays(val1, val2)) {
            return false;
        }
        const filter = strict ? 2 : 2 | 16;
        const keysVal1 = getOwnNonIndexProperties(val1, filter);
        const keysVal2 = getOwnNonIndexProperties(val2, filter);
        if (keysVal1.length !== keysVal2.length) {
            return false;
        }
        return keyCheck(val1, val2, strict, memos, valueType.noIterator, keysVal1);
    } else if (isSet1(val1)) {
        if (!isSet1(val2) || val1.size !== val2.size) {
            return false;
        }
        return keyCheck(val1, val2, strict, memos, valueType.isSet);
    } else if (isMap1(val1)) {
        if (!isMap1(val2) || val1.size !== val2.size) {
            return false;
        }
        return keyCheck(val1, val2, strict, memos, valueType.isMap);
    } else if (isAnyArrayBuffer1(val1)) {
        if (!isAnyArrayBuffer1(val2) || !areEqualArrayBuffers(val1, val2)) {
            return false;
        }
    } else if (isBoxedPrimitive1(val1)) {
        if (!isEqualBoxedPrimitive(val1, val2)) {
            return false;
        }
    } else if (Array.isArray(val2) || isArrayBufferView(val2) || isSet1(val2) || isMap1(val2) || isDate1(val2) || isRegExp1(val2) || isAnyArrayBuffer1(val2) || isBoxedPrimitive1(val2) || isNativeError1(val2) || val2 instanceof Error) {
        return false;
    }
    return keyCheck(val1, val2, strict, memos, valueType.noIterator);
}
function keyCheck(val1, val2, strict, memos, iterationType, aKeys = []) {
    if (arguments.length === 5) {
        aKeys = Object.keys(val1);
        const bKeys = Object.keys(val2);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
    }
    let i = 0;
    for(; i < aKeys.length; i++){
        if (!val2.propertyIsEnumerable(aKeys[i])) {
            return false;
        }
    }
    if (strict && arguments.length === 5) {
        const symbolKeysA = Object.getOwnPropertySymbols(val1);
        if (symbolKeysA.length !== 0) {
            let count = 0;
            for(i = 0; i < symbolKeysA.length; i++){
                const key = symbolKeysA[i];
                if (val1.propertyIsEnumerable(key)) {
                    if (!val2.propertyIsEnumerable(key)) {
                        return false;
                    }
                    aKeys.push(key.toString());
                    count++;
                } else if (val2.propertyIsEnumerable(key)) {
                    return false;
                }
            }
            const symbolKeysB = Object.getOwnPropertySymbols(val2);
            if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
                return false;
            }
        } else {
            const symbolKeysB = Object.getOwnPropertySymbols(val2);
            if (symbolKeysB.length !== 0 && getEnumerables(val2, symbolKeysB).length !== 0) {
                return false;
            }
        }
    }
    if (aKeys.length === 0 && (iterationType === valueType.noIterator || iterationType === valueType.isArray && val1.length === 0 || val1.size === 0)) {
        return true;
    }
    if (memos === undefined) {
        memos = {
            val1: new Map(),
            val2: new Map(),
            position: 0
        };
    } else {
        const val2MemoA = memos.val1.get(val1);
        if (val2MemoA !== undefined) {
            const val2MemoB = memos.val2.get(val2);
            if (val2MemoB !== undefined) {
                return val2MemoA === val2MemoB;
            }
        }
        memos.position++;
    }
    memos.val1.set(val1, memos.position);
    memos.val2.set(val2, memos.position);
    const areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
    memos.val1.delete(val1);
    memos.val2.delete(val2);
    return areEq;
}
function areSimilarRegExps(a, b) {
    return a.source === b.source && a.flags === b.flags;
}
function areSimilarFloatArrays(arr1, arr2) {
    if (arr1.byteLength !== arr2.byteLength) {
        return false;
    }
    for(let i = 0; i < arr1.byteLength; i++){
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
function areSimilarTypedArrays(arr1, arr2) {
    if (arr1.byteLength !== arr2.byteLength) {
        return false;
    }
    return Buffer1.compare(new Uint8Array(arr1.buffer, arr1.byteOffset, arr1.byteLength), new Uint8Array(arr2.buffer, arr2.byteOffset, arr2.byteLength)) === 0;
}
function areEqualArrayBuffers(buf1, buf2) {
    return buf1.byteLength === buf2.byteLength && Buffer1.compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
}
function isEqualBoxedPrimitive(a, b) {
    if (isNumberObject1(a)) {
        return isNumberObject1(b) && Object.is(a.valueOf(), b.valueOf());
    }
    if (isStringObject1(a)) {
        return isStringObject1(b) && a.valueOf() === b.valueOf();
    }
    if (isBooleanObject1(a)) {
        return isBooleanObject1(b) && a.valueOf() === b.valueOf();
    }
    if (isBigIntObject1(a)) {
        return isBigIntObject1(b) && a.valueOf() === b.valueOf();
    }
    if (isSymbolObject1(a)) {
        return isSymbolObject1(b) && a.valueOf() === b.valueOf();
    }
    return false;
}
function getEnumerables(val, keys) {
    return keys.filter((key)=>val.propertyIsEnumerable(key)
    );
}
function objEquiv(obj1, obj2, strict, keys, memos, iterationType) {
    let i = 0;
    if (iterationType === valueType.isSet) {
        if (!setEquiv(obj1, obj2, strict, memos)) {
            return false;
        }
    } else if (iterationType === valueType.isMap) {
        if (!mapEquiv(obj1, obj2, strict, memos)) {
            return false;
        }
    } else if (iterationType === valueType.isArray) {
        for(; i < obj1.length; i++){
            if (obj1.hasOwnProperty(i)) {
                if (!obj2.hasOwnProperty(i) || !isDeepEqual(obj1[i], obj2[i], strict, memos)) {
                    return false;
                }
            } else if (obj2.hasOwnProperty(i)) {
                return false;
            } else {
                const keys1 = Object.keys(obj1);
                for(; i < keys1.length; i++){
                    const key = keys1[i];
                    if (!obj2.hasOwnProperty(key) || !isDeepEqual(obj1[key], obj2[key], strict, memos)) {
                        return false;
                    }
                }
                if (keys1.length !== Object.keys(obj2).length) {
                    return false;
                }
                if (keys1.length !== Object.keys(obj2).length) {
                    return false;
                }
                return true;
            }
        }
    }
    for(i = 0; i < keys.length; i++){
        const key = keys[i];
        if (!isDeepEqual(obj1[key], obj2[key], strict, memos)) {
            return false;
        }
    }
    return true;
}
function setEquiv(set1, set2, strict, memos) {
    let set = null;
    for (const item of set1){
        if (typeof item === "object" && item !== null) {
            if (set === null) {
                set = new Set();
            }
            set.add(item);
        } else if (!set2.has(item)) {
            if (strict) return false;
        }
    }
    if (set !== null) {
        for (const item of set2){
            if (typeof item === "object" && item !== null) {
                if (!setHasEqualElement(set, item, strict, memos)) return false;
            } else if (!strict && !set1.has(item) && !setHasEqualElement(set, item, strict, memos)) {
                return false;
            }
        }
        return set.size === 0;
    }
    return true;
}
function mapEquiv(map1, map2, strict, memos) {
    let set = null;
    for (const { 0: key , 1: item1  } of map1){
        if (typeof key === "object" && key !== null) {
            if (set === null) {
                set = new Set();
            }
            set.add(key);
        } else {
            const item2 = map2.get(key);
            if (item2 === undefined && !map2.has(key) || !isDeepEqual(item1, item2, strict, memos)) {
                if (strict) return false;
            }
        }
    }
    if (set !== null) {
        for (const { 0: key , 1: item  } of map2){
            if (typeof key === "object" && key !== null) {
                if (!mapHasEqualEntry(set, map1, key, item, strict, memos)) {
                    return false;
                }
            }
        }
        return set.size === 0;
    }
    return true;
}
function setHasEqualElement(set, val1, strict, memos) {
    for (const val2 of set){
        if (isDeepEqual(val1, val2, strict, memos)) {
            set.delete(val2);
            return true;
        }
    }
    return false;
}
function mapHasEqualEntry(set, map, key1, item1, strict, memos) {
    for (const key2 of set){
        if (isDeepEqual(key1, key2, strict, memos) && isDeepEqual(item1, map.get(key2), strict, memos)) {
            set.delete(key2);
            return true;
        }
    }
    return false;
}
function isFileOptions(fileOptions) {
    if (!fileOptions) return false;
    return fileOptions.encoding != undefined || fileOptions.flag != undefined || fileOptions.signal != undefined || fileOptions.mode != undefined;
}
function getEncoding(optOrCallback) {
    if (!optOrCallback || typeof optOrCallback === "function") {
        return null;
    }
    const encoding = typeof optOrCallback === "string" ? optOrCallback : optOrCallback.encoding;
    if (!encoding) return null;
    return encoding;
}
function checkEncoding1(encoding) {
    if (!encoding) return null;
    encoding = encoding.toLowerCase();
    if ([
        "utf8",
        "hex",
        "base64"
    ].includes(encoding)) return encoding;
    if (encoding === "utf-8") {
        return "utf8";
    }
    if (encoding === "binary") {
        return "binary";
    }
    const notImplementedEncodings1 = [
        "utf16le",
        "latin1",
        "ascii",
        "ucs2"
    ];
    if (notImplementedEncodings1.includes(encoding)) {
        notImplemented1(`"${encoding}" encoding`);
    }
    throw new Error(`The value "${encoding}" is invalid for option "encoding"`);
}
function getOpenOptions(flag) {
    if (!flag) {
        return {
            create: true,
            append: true
        };
    }
    let openOptions;
    switch(flag){
        case "a":
            {
                openOptions = {
                    create: true,
                    append: true
                };
                break;
            }
        case "ax":
            {
                openOptions = {
                    createNew: true,
                    write: true,
                    append: true
                };
                break;
            }
        case "a+":
            {
                openOptions = {
                    read: true,
                    create: true,
                    append: true
                };
                break;
            }
        case "ax+":
            {
                openOptions = {
                    read: true,
                    createNew: true,
                    append: true
                };
                break;
            }
        case "r":
            {
                openOptions = {
                    read: true
                };
                break;
            }
        case "r+":
            {
                openOptions = {
                    read: true,
                    write: true
                };
                break;
            }
        case "w":
            {
                openOptions = {
                    create: true,
                    write: true,
                    truncate: true
                };
                break;
            }
        case "wx":
            {
                openOptions = {
                    createNew: true,
                    write: true
                };
                break;
            }
        case "w+":
            {
                openOptions = {
                    create: true,
                    write: true,
                    truncate: true,
                    read: true
                };
                break;
            }
        case "wx+":
            {
                openOptions = {
                    createNew: true,
                    write: true,
                    read: true
                };
                break;
            }
        case "as":
            {
                openOptions = {
                    create: true,
                    append: true
                };
                break;
            }
        case "as+":
            {
                openOptions = {
                    create: true,
                    read: true,
                    append: true
                };
                break;
            }
        case "rs+":
            {
                openOptions = {
                    create: true,
                    read: true,
                    write: true
                };
                break;
            }
        default:
            {
                throw new Error(`Unrecognized file system flag: ${flag}`);
            }
    }
    return openOptions;
}
function maybeCallback(cb) {
    validateCallback(cb);
    return cb;
}
function makeCallback(cb) {
    validateCallback(cb);
    return (...args)=>Reflect.apply(cb, this, args)
    ;
}
Symbol("query");
function toPathIfFileURL(fileURLOrPath) {
    if (!(fileURLOrPath instanceof URL)) {
        return fileURLOrPath;
    }
    return fileURLToPath(fileURLOrPath);
}
function assert3(value, message) {
    if (!value) {
        throw new ERR_INTERNAL_ASSERTION(message);
    }
}
function fail(message) {
    throw new ERR_INTERNAL_ASSERTION(message);
}
assert3.fail = fail;
"use strict";
const kRejection = Symbol.for("nodejs.rejection");
const kCapture = Symbol("kCapture");
const kErrorMonitor = Symbol("events.errorMonitor");
const kMaxEventTargetListeners = Symbol("events.maxEventTargetListeners");
const kMaxEventTargetListenersWarned = Symbol("events.maxEventTargetListenersWarned");
function EventEmitter1(opts) {
    EventEmitter1.init.call(this, opts);
}
EventEmitter1.on = on;
EventEmitter1.once = once1;
EventEmitter1.getEventListeners = getEventListeners;
EventEmitter1.EventEmitter = EventEmitter1;
EventEmitter1.usingDomains = false;
EventEmitter1.captureRejectionSymbol = kRejection;
EventEmitter1.captureRejectionSymbol;
EventEmitter1.errorMonitor;
Object.defineProperty(EventEmitter1, "captureRejections", {
    get () {
        return EventEmitter1.prototype[kCapture];
    },
    set (value) {
        validateBoolean(value, "EventEmitter.captureRejections");
        EventEmitter1.prototype[kCapture] = value;
    },
    enumerable: true
});
EventEmitter1.errorMonitor = kErrorMonitor;
Object.defineProperty(EventEmitter1.prototype, kCapture, {
    value: false,
    writable: true,
    enumerable: false
});
EventEmitter1.prototype._events = undefined;
EventEmitter1.prototype._eventsCount = 0;
EventEmitter1.prototype._maxListeners = undefined;
let defaultMaxListeners1 = 10;
let isEventTarget;
function checkListener(listener) {
    validateFunction(listener, "listener");
}
Object.defineProperty(EventEmitter1, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
        return defaultMaxListeners1;
    },
    set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || Number.isNaN(arg)) {
            throw new ERR_OUT_OF_RANGE("defaultMaxListeners", "a non-negative number", arg);
        }
        defaultMaxListeners1 = arg;
    }
});
Object.defineProperties(EventEmitter1, {
    kMaxEventTargetListeners: {
        value: kMaxEventTargetListeners,
        enumerable: false,
        configurable: false,
        writable: false
    },
    kMaxEventTargetListenersWarned: {
        value: kMaxEventTargetListenersWarned,
        enumerable: false,
        configurable: false,
        writable: false
    }
});
EventEmitter1.setMaxListeners = function(n = defaultMaxListeners1, ...eventTargets) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
        throw new ERR_OUT_OF_RANGE("n", "a non-negative number", n);
    }
    if (eventTargets.length === 0) {
        defaultMaxListeners1 = n;
    } else {
        if (isEventTarget === undefined) {
            isEventTarget = require("internal/event_target").isEventTarget;
        }
        for(let i = 0; i < eventTargets.length; i++){
            const target = eventTargets[i];
            if (isEventTarget(target)) {
                target[kMaxEventTargetListeners] = n;
                target[kMaxEventTargetListenersWarned] = false;
            } else if (typeof target.setMaxListeners === "function") {
                target.setMaxListeners(n);
            } else {
                throw new ERR_INVALID_ARG_TYPE("eventTargets", [
                    "EventEmitter",
                    "EventTarget"
                ], target);
            }
        }
    }
};
EventEmitter1.init = function(opts) {
    if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || undefined;
    if (opts?.captureRejections) {
        validateBoolean(opts.captureRejections, "options.captureRejections");
        this[kCapture] = Boolean(opts.captureRejections);
    } else {
        this[kCapture] = EventEmitter1.prototype[kCapture];
    }
};
function addCatch(that, promise, type, args) {
    if (!that[kCapture]) {
        return;
    }
    try {
        const then = promise.then;
        if (typeof then === "function") {
            then.call(promise, undefined, function(err) {
                process.nextTick(emitUnhandledRejectionOrErr, that, err, type, args);
            });
        }
    } catch (err) {
        that.emit("error", err);
    }
}
function emitUnhandledRejectionOrErr(ee, err, type, args) {
    if (typeof ee[kRejection] === "function") {
        ee[kRejection](err, type, ...args);
    } else {
        const prev = ee[kCapture];
        try {
            ee[kCapture] = false;
            ee.emit("error", err);
        } finally{
            ee[kCapture] = prev;
        }
    }
}
EventEmitter1.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || Number.isNaN(n)) {
        throw new ERR_OUT_OF_RANGE("n", "a non-negative number", n);
    }
    this._maxListeners = n;
    return this;
};
function _getMaxListeners(that) {
    if (that._maxListeners === undefined) {
        return EventEmitter1.defaultMaxListeners;
    }
    return that._maxListeners;
}
EventEmitter1.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
};
EventEmitter1.prototype.emit = function emit(type, ...args) {
    let doError = type === "error";
    const events = this._events;
    if (events !== undefined) {
        if (doError && events[kErrorMonitor] !== undefined) {
            this.emit(kErrorMonitor, ...args);
        }
        doError = doError && events.error === undefined;
    } else if (!doError) {
        return false;
    }
    if (doError) {
        let er;
        if (args.length > 0) {
            er = args[0];
        }
        if (er instanceof Error) {
            try {
                const capture = {
                };
                Error.captureStackTrace(capture, EventEmitter1.prototype.emit);
            } catch  {
            }
            throw er;
        }
        let stringifiedEr;
        try {
            stringifiedEr = inspect(er);
        } catch  {
            stringifiedEr = er;
        }
        const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
        err.context = er;
        throw err;
    }
    const handler = events[type];
    if (handler === undefined) {
        return false;
    }
    if (typeof handler === "function") {
        const result = handler.apply(this, args);
        if (result !== undefined && result !== null) {
            addCatch(this, result, type, args);
        }
    } else {
        const len = handler.length;
        const listeners = arrayClone(handler);
        for(let i = 0; i < len; ++i){
            const result = listeners[i].apply(this, args);
            if (result !== undefined && result !== null) {
                addCatch(this, result, type, args);
            }
        }
    }
    return true;
};
function _addListener(target, type, listener, prepend) {
    let m;
    let events;
    let existing;
    checkListener(listener);
    events = target._events;
    if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
    } else {
        if (events.newListener !== undefined) {
            target.emit("newListener", type, listener.listener ?? listener);
            events = target._events;
        }
        existing = events[type];
    }
    if (existing === undefined) {
        events[type] = listener;
        ++target._eventsCount;
    } else {
        if (typeof existing === "function") {
            existing = events[type] = prepend ? [
                listener,
                existing
            ] : [
                existing,
                listener
            ];
        } else if (prepend) {
            existing.unshift(listener);
        } else {
            existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            const w = new Error("Possible EventEmitter memory leak detected. " + `${existing.length} ${String(type)} listeners ` + `added to ${inspect(target, {
                depth: -1
            })}. Use ` + "emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            process.emitWarning(w);
        }
    }
    return target;
}
EventEmitter1.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
};
EventEmitter1.prototype.on = EventEmitter1.prototype.addListener;
EventEmitter1.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
};
function onceWrapper() {
    if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0) {
            return this.listener.call(this.target);
        }
        return this.listener.apply(this.target, arguments);
    }
}
function _onceWrap(target, type, listener) {
    const state = {
        fired: false,
        wrapFn: undefined,
        target,
        type,
        listener
    };
    const wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
}
EventEmitter1.prototype.once = function once(type, listener) {
    checkListener(listener);
    this.on(type, _onceWrap(this, type, listener));
    return this;
};
EventEmitter1.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    checkListener(listener);
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
};
EventEmitter1.prototype.removeListener = function removeListener(type, listener) {
    checkListener(listener);
    const events = this._events;
    if (events === undefined) {
        return this;
    }
    const list = events[type];
    if (list === undefined) {
        return this;
    }
    if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) {
            this._events = Object.create(null);
        } else {
            delete events[type];
            if (events.removeListener) {
                this.emit("removeListener", type, list.listener || listener);
            }
        }
    } else if (typeof list !== "function") {
        let position = -1;
        for(let i = list.length - 1; i >= 0; i--){
            if (list[i] === listener || list[i].listener === listener) {
                position = i;
                break;
            }
        }
        if (position < 0) {
            return this;
        }
        if (position === 0) {
            list.shift();
        } else {
            spliceOne(list, position);
        }
        if (list.length === 1) {
            events[type] = list[0];
        }
        if (events.removeListener !== undefined) {
            this.emit("removeListener", type, listener);
        }
    }
    return this;
};
EventEmitter1.prototype.off = EventEmitter1.prototype.removeListener;
EventEmitter1.prototype.removeAllListeners = function removeAllListeners(type) {
    const events = this._events;
    if (events === undefined) {
        return this;
    }
    if (events.removeListener === undefined) {
        if (arguments.length === 0) {
            this._events = Object.create(null);
            this._eventsCount = 0;
        } else if (events[type] !== undefined) {
            if (--this._eventsCount === 0) {
                this._events = Object.create(null);
            } else {
                delete events[type];
            }
        }
        return this;
    }
    if (arguments.length === 0) {
        for (const key of Reflect.ownKeys(events)){
            if (key === "removeListener") continue;
            this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
    }
    const listeners = events[type];
    if (typeof listeners === "function") {
        this.removeListener(type, listeners);
    } else if (listeners !== undefined) {
        for(let i = listeners.length - 1; i >= 0; i--){
            this.removeListener(type, listeners[i]);
        }
    }
    return this;
};
function _listeners(target, type, unwrap) {
    const events = target._events;
    if (events === undefined) {
        return [];
    }
    const evlistener = events[type];
    if (evlistener === undefined) {
        return [];
    }
    if (typeof evlistener === "function") {
        return unwrap ? [
            evlistener.listener || evlistener
        ] : [
            evlistener
        ];
    }
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener);
}
EventEmitter1.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
};
EventEmitter1.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
};
EventEmitter1.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
    }
    return listenerCount.call(emitter, type);
};
EventEmitter1.prototype.listenerCount = listenerCount;
function listenerCount(type) {
    const events = this._events;
    if (events !== undefined) {
        const evlistener = events[type];
        if (typeof evlistener === "function") {
            return 1;
        } else if (evlistener !== undefined) {
            return evlistener.length;
        }
    }
    return 0;
}
EventEmitter1.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};
function arrayClone(arr) {
    switch(arr.length){
        case 2:
            return [
                arr[0],
                arr[1]
            ];
        case 3:
            return [
                arr[0],
                arr[1],
                arr[2]
            ];
        case 4:
            return [
                arr[0],
                arr[1],
                arr[2],
                arr[3]
            ];
        case 5:
            return [
                arr[0],
                arr[1],
                arr[2],
                arr[3],
                arr[4]
            ];
        case 6:
            return [
                arr[0],
                arr[1],
                arr[2],
                arr[3],
                arr[4],
                arr[5]
            ];
    }
    return arr.slice();
}
function unwrapListeners(arr) {
    const ret = arrayClone(arr);
    for(let i = 0; i < ret.length; ++i){
        const orig = ret[i].listener;
        if (typeof orig === "function") {
            ret[i] = orig;
        }
    }
    return ret;
}
function getEventListeners(emitterOrTarget, type) {
    if (typeof emitterOrTarget.listeners === "function") {
        return emitterOrTarget.listeners(type);
    }
    const { isEventTarget: isEventTarget1 , kEvents  } = require("internal/event_target");
    if (isEventTarget1(emitterOrTarget)) {
        const root1 = emitterOrTarget[kEvents].get(type);
        const listeners = [];
        let handler = root1?.next;
        while(handler?.listener !== undefined){
            const listener = handler.listener?.deref ? handler.listener.deref() : handler.listener;
            listeners.push(listener);
            handler = handler.next;
        }
        return listeners;
    }
    throw new ERR_INVALID_ARG_TYPE("emitter", [
        "EventEmitter",
        "EventTarget"
    ], emitterOrTarget);
}
async function once1(emitter, name, options = {
}) {
    const signal = options?.signal;
    validateAbortSignal(signal, "options.signal");
    if (signal?.aborted) {
        throw new AbortError();
    }
    return new Promise((resolve10, reject)=>{
        const errorListener = (err)=>{
            emitter.removeListener(name, resolver);
            if (signal != null) {
                eventTargetAgnosticRemoveListener(signal, "abort", abortListener);
            }
            reject(err);
        };
        const resolver = (...args)=>{
            if (typeof emitter.removeListener === "function") {
                emitter.removeListener("error", errorListener);
            }
            if (signal != null) {
                eventTargetAgnosticRemoveListener(signal, "abort", abortListener);
            }
            resolve10(args);
        };
        eventTargetAgnosticAddListener(emitter, name, resolver, {
            once: true
        });
        if (name !== "error" && typeof emitter.once === "function") {
            emitter.once("error", errorListener);
        }
        function abortListener() {
            eventTargetAgnosticRemoveListener(emitter, name, resolver);
            eventTargetAgnosticRemoveListener(emitter, "error", errorListener);
            reject(new AbortError());
        }
        if (signal != null) {
            eventTargetAgnosticAddListener(signal, "abort", abortListener, {
                once: true
            });
        }
    });
}
const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function*() {
}).prototype);
function createIterResult(value, done) {
    return {
        value,
        done
    };
}
function eventTargetAgnosticRemoveListener(emitter, name, listener, flags) {
    if (typeof emitter.removeListener === "function") {
        emitter.removeListener(name, listener);
    } else if (typeof emitter.removeEventListener === "function") {
        emitter.removeEventListener(name, listener, flags);
    } else {
        throw new ERR_INVALID_ARG_TYPE("emitter", "EventEmitter", emitter);
    }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
        if (flags?.once) {
            emitter.once(name, listener);
        } else {
            emitter.on(name, listener);
        }
    } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, (arg)=>{
            listener(arg);
        }, flags);
    } else {
        throw new ERR_INVALID_ARG_TYPE("emitter", "EventEmitter", emitter);
    }
}
function on(emitter, event, options) {
    const signal = options?.signal;
    validateAbortSignal(signal, "options.signal");
    if (signal?.aborted) {
        throw new AbortError();
    }
    const unconsumedEvents = [];
    const unconsumedPromises = [];
    let error = null;
    let finished1 = false;
    const iterator = Object.setPrototypeOf({
        next () {
            const value = unconsumedEvents.shift();
            if (value) {
                return Promise.resolve(createIterResult(value, false));
            }
            if (error) {
                const p = Promise.reject(error);
                error = null;
                return p;
            }
            if (finished1) {
                return Promise.resolve(createIterResult(undefined, true));
            }
            return new Promise(function(resolve11, reject) {
                unconsumedPromises.push({
                    resolve: resolve11,
                    reject
                });
            });
        },
        return () {
            eventTargetAgnosticRemoveListener(emitter, event, eventHandler);
            eventTargetAgnosticRemoveListener(emitter, "error", errorHandler);
            if (signal) {
                eventTargetAgnosticRemoveListener(signal, "abort", abortListener, {
                    once: true
                });
            }
            finished1 = true;
            for (const promise of unconsumedPromises){
                promise.resolve(createIterResult(undefined, true));
            }
            return Promise.resolve(createIterResult(undefined, true));
        },
        throw (err) {
            if (!err || !(err instanceof Error)) {
                throw new ERR_INVALID_ARG_TYPE("EventEmitter.AsyncIterator", "Error", err);
            }
            error = err;
            eventTargetAgnosticRemoveListener(emitter, event, eventHandler);
            eventTargetAgnosticRemoveListener(emitter, "error", errorHandler);
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    }, AsyncIteratorPrototype);
    eventTargetAgnosticAddListener(emitter, event, eventHandler);
    if (event !== "error" && typeof emitter.on === "function") {
        emitter.on("error", errorHandler);
    }
    if (signal) {
        eventTargetAgnosticAddListener(signal, "abort", abortListener, {
            once: true
        });
    }
    return iterator;
    function abortListener() {
        errorHandler(new AbortError());
    }
    function eventHandler(...args) {
        const promise = unconsumedPromises.shift();
        if (promise) {
            promise.resolve(createIterResult(args, false));
        } else {
            unconsumedEvents.push(args);
        }
    }
    function errorHandler(err) {
        finished1 = true;
        const toError = unconsumedPromises.shift();
        if (toError) {
            toError.reject(err);
        } else {
            error = err;
        }
        iterator.return();
    }
}
const { hasOwn  } = Object;
function get(obj, key) {
    if (hasOwn(obj, key)) {
        return obj[key];
    }
}
function getForce(obj, key) {
    const v = get(obj, key);
    assert1(v != null);
    return v;
}
function isNumber(x) {
    if (typeof x === "number") return true;
    if (/^0x[0-9a-f]+$/i.test(String(x))) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
}
function hasKey(obj, keys) {
    let o = obj;
    keys.slice(0, -1).forEach((key)=>{
        o = get(o, key) ?? {
        };
    });
    const key1 = keys[keys.length - 1];
    return key1 in o;
}
function parse6(args, { "--": doubleDash = false , alias: alias2 = {
} , boolean: __boolean = false , default: defaults = {
} , stopEarly =false , string =[] , unknown =(i)=>i
  } = {
}) {
    const flags = {
        bools: {
        },
        strings: {
        },
        unknownFn: unknown,
        allBools: false
    };
    if (__boolean !== undefined) {
        if (typeof __boolean === "boolean") {
            flags.allBools = !!__boolean;
        } else {
            const booleanArgs = typeof __boolean === "string" ? [
                __boolean
            ] : __boolean;
            for (const key of booleanArgs.filter(Boolean)){
                flags.bools[key] = true;
            }
        }
    }
    const aliases = {
    };
    if (alias2 !== undefined) {
        for(const key in alias2){
            const val = getForce(alias2, key);
            if (typeof val === "string") {
                aliases[key] = [
                    val
                ];
            } else {
                aliases[key] = val;
            }
            for (const alias1 of getForce(aliases, key)){
                aliases[alias1] = [
                    key
                ].concat(aliases[key].filter((y)=>alias1 !== y
                ));
            }
        }
    }
    if (string !== undefined) {
        const stringArgs = typeof string === "string" ? [
            string
        ] : string;
        for (const key of stringArgs.filter(Boolean)){
            flags.strings[key] = true;
            const alias = get(aliases, key);
            if (alias) {
                for (const al of alias){
                    flags.strings[al] = true;
                }
            }
        }
    }
    const argv5 = {
        _: []
    };
    function argDefined(key, arg) {
        return flags.allBools && /^--[^=]+$/.test(arg) || get(flags.bools, key) || !!get(flags.strings, key) || !!get(aliases, key);
    }
    function setKey(obj, keys, value) {
        let o = obj;
        keys.slice(0, -1).forEach(function(key) {
            if (get(o, key) === undefined) {
                o[key] = {
                };
            }
            o = get(o, key);
        });
        const key4 = keys[keys.length - 1];
        if (get(o, key4) === undefined || get(flags.bools, key4) || typeof get(o, key4) === "boolean") {
            o[key4] = value;
        } else if (Array.isArray(get(o, key4))) {
            o[key4].push(value);
        } else {
            o[key4] = [
                get(o, key4),
                value
            ];
        }
    }
    function setArg(key, val, arg = undefined) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg, key, val) === false) return;
        }
        const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
        setKey(argv5, key.split("."), value);
        const alias = get(aliases, key);
        if (alias) {
            for (const x of alias){
                setKey(argv5, x.split("."), value);
            }
        }
    }
    function aliasIsBoolean(key) {
        return getForce(aliases, key).some((x)=>typeof get(flags.bools, x) === "boolean"
        );
    }
    for (const key3 of Object.keys(flags.bools)){
        setArg(key3, defaults[key3] === undefined ? false : defaults[key3]);
    }
    let notFlags = [];
    if (args.includes("--")) {
        notFlags = args.slice(args.indexOf("--") + 1);
        args = args.slice(0, args.indexOf("--"));
    }
    for(let i = 0; i < args.length; i++){
        const arg = args[i];
        if (/^--.+=/.test(arg)) {
            const m = arg.match(/^--([^=]+)=(.*)$/s);
            assert1(m != null);
            const [, key, value] = m;
            if (flags.bools[key]) {
                const booleanValue = value !== "false";
                setArg(key, booleanValue, arg);
            } else {
                setArg(key, value, arg);
            }
        } else if (/^--no-.+/.test(arg)) {
            const m = arg.match(/^--no-(.+)/);
            assert1(m != null);
            setArg(m[1], false, arg);
        } else if (/^--.+/.test(arg)) {
            const m = arg.match(/^--(.+)/);
            assert1(m != null);
            const [, key] = m;
            const next = args[i + 1];
            if (next !== undefined && !/^-/.test(next) && !get(flags.bools, key) && !flags.allBools && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            } else if (/^(true|false)$/.test(next)) {
                setArg(key, next === "true", arg);
                i++;
            } else {
                setArg(key, get(flags.strings, key) ? "" : true, arg);
            }
        } else if (/^-[^-]+/.test(arg)) {
            const letters = arg.slice(1, -1).split("");
            let broken = false;
            for(let j = 0; j < letters.length; j++){
                const next = arg.slice(j + 2);
                if (next === "-") {
                    setArg(letters[j], next, arg);
                    continue;
                }
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split(/=(.+)/)[1], arg);
                    broken = true;
                    break;
                }
                if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j + 2), arg);
                    broken = true;
                    break;
                } else {
                    setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                }
            }
            const [key] = arg.slice(-1);
            if (!broken && key !== "-") {
                if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) && !get(flags.bools, key) && (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i + 1], arg);
                    i++;
                } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                    setArg(key, args[i + 1] === "true", arg);
                    i++;
                } else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
        } else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv5._.push(flags.strings["_"] ?? !isNumber(arg) ? arg : Number(arg));
            }
            if (stopEarly) {
                argv5._.push(...args.slice(i + 1));
                break;
            }
        }
    }
    for (const key2 of Object.keys(defaults)){
        if (!hasKey(argv5, key2.split("."))) {
            setKey(argv5, key2.split("."), defaults[key2]);
            if (aliases[key2]) {
                for (const x of aliases[key2]){
                    setKey(argv5, x.split("."), defaults[key2]);
                }
            }
        }
    }
    if (doubleDash) {
        argv5["--"] = [];
        for (const key of notFlags){
            argv5["--"].push(key);
        }
    } else {
        for (const key of notFlags){
            argv5._.push(key);
        }
    }
    return argv5;
}
function getOptions() {
    const args = parse6(Deno.args);
    const options = new Map(Object.entries(args).map(([key, value])=>[
            key,
            {
                value
            }
        ]
    ));
    return {
        options
    };
}
let optionsMap;
function getOptionsFromBinding() {
    if (!optionsMap) {
        ({ options: optionsMap  } = getOptions());
    }
    return optionsMap;
}
function getOptionValue(optionName) {
    const options = getOptionsFromBinding();
    if (optionName.startsWith("--no-")) {
        const option = options.get("--" + optionName.slice(5));
        return option && !option.value;
    }
    return options.get(optionName)?.value;
}
function _uint8ArrayToBuffer(chunk) {
    return Buffer1.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
}
function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === "function";
}
function isServerResponse(stream) {
    return typeof stream._sent100 === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean" && typeof stream._removedTE === "boolean" && typeof stream._closed === "boolean";
}
function isReadable(stream) {
    return typeof stream.readable === "boolean" || typeof stream.readableEnded === "boolean" || !!stream._readableState;
}
function isWritable(stream) {
    return typeof stream.writable === "boolean" || typeof stream.writableEnded === "boolean" || !!stream._writableState;
}
function isWritableFinished(stream) {
    if (stream.writableFinished) return true;
    const wState = stream._writableState;
    if (!wState || wState.errored) return false;
    return wState.finished || wState.ended && wState.length === 0;
}
const nop = ()=>{
};
function isReadableEnded(stream) {
    if (stream.readableEnded) return true;
    const rState = stream._readableState;
    if (!rState || rState.errored) return false;
    return rState.endEmitted || rState.ended && rState.length === 0;
}
function eos(stream, options, callback) {
    if (arguments.length === 2) {
        callback = options;
        options = {
        };
    } else if (options == null) {
        options = {
        };
    } else {
        validateObject(options, "options");
    }
    validateFunction(callback, "callback");
    validateAbortSignal(options.signal, "options.signal");
    callback = once(callback);
    const readable = options.readable || options.readable !== false && isReadable(stream);
    const writable = options.writable || options.writable !== false && isWritable(stream);
    const wState = stream._writableState;
    const rState = stream._readableState;
    const state = wState || rState;
    const onlegacyfinish = ()=>{
        if (!stream.writable) onfinish();
    };
    let willEmitClose = isServerResponse(stream) || state && state.autoDestroy && state.emitClose && state.closed === false && isReadable(stream) === readable && isWritable(stream) === writable;
    let writableFinished = stream.writableFinished || wState && wState.finished;
    const onfinish = ()=>{
        writableFinished = true;
        if (stream.destroyed) willEmitClose = false;
        if (willEmitClose && (!stream.readable || readable)) return;
        if (!readable || readableEnded) callback.call(stream);
    };
    let readableEnded = stream.readableEnded || rState && rState.endEmitted;
    const onend = ()=>{
        readableEnded = true;
        if (stream.destroyed) willEmitClose = false;
        if (willEmitClose && (!stream.writable || writable)) return;
        if (!writable || writableFinished) callback.call(stream);
    };
    const onerror = (err)=>{
        callback.call(stream, err);
    };
    const onclose = ()=>{
        if (readable && !readableEnded) {
            if (!isReadableEnded(stream)) {
                return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
            }
        }
        if (writable && !writableFinished) {
            if (!isWritableFinished(stream)) {
                return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
            }
        }
        callback.call(stream);
    };
    const onrequest = ()=>{
        stream.req.on("finish", onfinish);
    };
    if (isRequest(stream)) {
        stream.on("complete", onfinish);
        if (!willEmitClose) {
            stream.on("abort", onclose);
        }
        if (stream.req) onrequest();
        else stream.on("request", onrequest);
    } else if (writable && !wState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
    }
    if (!willEmitClose && typeof stream.aborted === "boolean") {
        stream.on("aborted", onclose);
    }
    stream.on("end", onend);
    stream.on("finish", onfinish);
    if (options.error !== false) stream.on("error", onerror);
    stream.on("close", onclose);
    const closed = !wState && !rState && stream._closed === true || wState && wState.closed || rState && rState.closed || wState && wState.errorEmitted || rState && rState.errorEmitted || rState && stream.req && stream.aborted || (!wState || !willEmitClose || typeof wState.closed !== "boolean") && (!rState || !willEmitClose || typeof rState.closed !== "boolean") && (!writable || wState && wState.finished) && (!readable || rState && rState.endEmitted);
    if (closed) {
        nextTick2(()=>{
            callback();
        });
    }
    const cleanup = ()=>{
        callback = nop;
        stream.removeListener("aborted", onclose);
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req) stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
    };
    if (options.signal && !closed) {
        const abort = ()=>{
            const endCallback = callback;
            cleanup();
            endCallback.call(stream, new AbortError());
        };
        if (options.signal.aborted) {
            nextTick2(abort);
        } else {
            const originalCallback = callback;
            callback = once((...args)=>{
                options.signal.removeEventListener("abort", abort);
                originalCallback.apply(stream, args);
            });
            options.signal.addEventListener("abort", abort);
        }
    }
    return cleanup;
}
const validateAbortSignal1 = (signal, name)=>{
    if (typeof signal !== "object" || !("aborted" in signal)) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
    }
};
function isStream(obj) {
    return !!(obj && typeof obj.pipe === "function");
}
function addAbortSignal(signal, stream) {
    validateAbortSignal1(signal, "signal");
    if (!isStream(stream)) {
        throw new ERR_INVALID_ARG_TYPE("stream", "stream.Stream", stream);
    }
    return addAbortSignalNoValidate(signal, stream);
}
function addAbortSignalNoValidate(signal, stream) {
    if (typeof signal !== "object" || !("aborted" in signal)) {
        return stream;
    }
    const onAbort = ()=>{
        stream.destroy(new AbortError());
    };
    if (signal.aborted) {
        onAbort();
    } else {
        signal.addEventListener("abort", onAbort);
        eos(stream, ()=>signal.removeEventListener("abort", onAbort)
        );
    }
    return stream;
}
function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}
function getDefaultHighWaterMark(objectMode) {
    return objectMode ? 16 : 16 * 1024;
}
function getHighWaterMark(state, options, duplexKey, isDuplex) {
    const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
    if (hwm != null) {
        if (!Number.isInteger(hwm) || hwm < 0) {
            const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
            throw new ERR_INVALID_ARG_VALUE(name, hwm);
        }
        return Math.floor(hwm);
    }
    return getDefaultHighWaterMark(state.objectMode);
}
function Stream(opts) {
    EventEmitter1.call(this, opts);
}
Object.setPrototypeOf(Stream.prototype, EventEmitter1.prototype);
Object.setPrototypeOf(Stream, EventEmitter1);
Stream.prototype.pipe = function(dest, options) {
    const source = this;
    function ondata(chunk) {
        if (dest.writable && dest.write(chunk) === false && source.pause) {
            source.pause();
        }
    }
    source.on("data", ondata);
    function ondrain() {
        if (source.readable && source.resume) {
            source.resume();
        }
    }
    dest.on("drain", ondrain);
    if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend);
        source.on("close", onclose);
    }
    let didOnEnd = false;
    function onend() {
        if (didOnEnd) return;
        didOnEnd = true;
        dest.end();
    }
    function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;
        if (typeof dest.destroy === "function") dest.destroy();
    }
    function onerror(er) {
        cleanup();
        if (EventEmitter1.listenerCount(this, "error") === 0) {
            this.emit("error", er);
        }
    }
    prependListener(source, "error", onerror);
    prependListener(dest, "error", onerror);
    function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
    }
    source.on("end", cleanup);
    source.on("close", cleanup);
    dest.on("close", cleanup);
    dest.emit("pipe", source);
    return dest;
};
function prependListener(emitter, event, fn) {
    if (typeof emitter.prependListener === "function") {
        return emitter.prependListener(event, fn);
    }
    if (!emitter._events || !emitter._events[event]) {
        emitter.on(event, fn);
    } else if (Array.isArray(emitter._events[event])) {
        emitter._events[event].unshift(fn);
    } else {
        emitter._events[event] = [
            fn,
            emitter._events[event]
        ];
    }
}
function aggregateTwoErrors(innerError, outerError) {
    if (innerError && outerError && innerError !== outerError) {
        if (Array.isArray(outerError.errors)) {
            outerError.errors.push(innerError);
            return outerError;
        }
        const err = new AggregateError([
            outerError,
            innerError, 
        ], outerError.message);
        err.code = outerError.code;
        return err;
    }
    return innerError || outerError;
}
const kDestroy = Symbol("kDestroy");
const kConstruct = Symbol("kConstruct");
function checkError(err, w, r) {
    if (err) {
        err.stack;
        if (w && !w.errored) {
            w.errored = err;
        }
        if (r && !r.errored) {
            r.errored = err;
        }
    }
}
function destroy(err, cb) {
    const r = this._readableState;
    const w = this._writableState;
    const s = w || r;
    if (w && w.destroyed || r && r.destroyed) {
        if (typeof cb === "function") {
            cb();
        }
        return this;
    }
    checkError(err, w, r);
    if (w) {
        w.destroyed = true;
    }
    if (r) {
        r.destroyed = true;
    }
    if (!s.constructed) {
        this.once(kDestroy, function(er) {
            _destroy(this, aggregateTwoErrors(er, err), cb);
        });
    } else {
        _destroy(this, err, cb);
    }
    return this;
}
function _destroy(self, err1, cb) {
    let called = false;
    function onDestroy(err) {
        if (called) {
            return;
        }
        called = true;
        const r = self._readableState;
        const w = self._writableState;
        checkError(err, w, r);
        if (w) {
            w.closed = true;
        }
        if (r) {
            r.closed = true;
        }
        if (typeof cb === "function") {
            cb(err);
        }
        if (err) {
            nextTick2(emitErrorCloseNT, self, err);
        } else {
            nextTick2(emitCloseNT, self);
        }
    }
    try {
        const result = self._destroy(err1 || null, onDestroy);
        if (result != null) {
            const then = result.then;
            if (typeof then === "function") {
                then.call(result, function() {
                    nextTick2(onDestroy, null);
                }, function(err) {
                    nextTick2(onDestroy, err);
                });
            }
        }
    } catch (err) {
        onDestroy(err);
    }
}
function emitErrorCloseNT(self, err) {
    emitErrorNT(self, err);
    emitCloseNT(self);
}
function emitCloseNT(self) {
    const r = self._readableState;
    const w = self._writableState;
    if (w) {
        w.closeEmitted = true;
    }
    if (r) {
        r.closeEmitted = true;
    }
    if (w && w.emitClose || r && r.emitClose) {
        self.emit("close");
    }
}
function emitErrorNT(self, err) {
    const r = self._readableState;
    const w = self._writableState;
    if (w && w.errorEmitted || r && r.errorEmitted) {
        return;
    }
    if (w) {
        w.errorEmitted = true;
    }
    if (r) {
        r.errorEmitted = true;
    }
    self.emit("error", err);
}
function undestroy() {
    const r = this._readableState;
    const w = this._writableState;
    if (r) {
        r.constructed = true;
        r.closed = false;
        r.closeEmitted = false;
        r.destroyed = false;
        r.errored = null;
        r.errorEmitted = false;
        r.reading = false;
        r.ended = false;
        r.endEmitted = false;
    }
    if (w) {
        w.constructed = true;
        w.destroyed = false;
        w.closed = false;
        w.closeEmitted = false;
        w.errored = null;
        w.errorEmitted = false;
        w.ended = false;
        w.ending = false;
        w.finalCalled = false;
        w.prefinished = false;
        w.finished = false;
    }
}
function errorOrDestroy(stream, err, sync) {
    const r = stream._readableState;
    const w = stream._writableState;
    if (w && w.destroyed || r && r.destroyed) {
        return this;
    }
    if (r && r.autoDestroy || w && w.autoDestroy) {
        stream.destroy(err);
    } else if (err) {
        err.stack;
        if (w && !w.errored) {
            w.errored = err;
        }
        if (r && !r.errored) {
            r.errored = err;
        }
        if (sync) {
            nextTick2(emitErrorNT, stream, err);
        } else {
            emitErrorNT(stream, err);
        }
    }
}
function construct(stream, cb) {
    if (typeof stream._construct !== "function") {
        return;
    }
    const r = stream._readableState;
    const w = stream._writableState;
    if (r) {
        r.constructed = false;
    }
    if (w) {
        w.constructed = false;
    }
    stream.once(kConstruct, cb);
    if (stream.listenerCount(kConstruct) > 1) {
        return;
    }
    nextTick2(constructNT, stream);
}
function constructNT(stream) {
    let called = false;
    function onConstruct(err) {
        if (called) {
            errorOrDestroy(stream, err ?? new ERR_MULTIPLE_CALLBACK());
            return;
        }
        called = true;
        const r = stream._readableState;
        const w = stream._writableState;
        const s = w || r;
        if (r) {
            r.constructed = true;
        }
        if (w) {
            w.constructed = true;
        }
        if (s.destroyed) {
            stream.emit(kDestroy, err);
        } else if (err) {
            errorOrDestroy(stream, err, true);
        } else {
            nextTick2(emitConstructNT, stream);
        }
    }
    try {
        const result = stream._construct(onConstruct);
        if (result != null) {
            const then = result.then;
            if (typeof then === "function") {
                then.call(result, function() {
                    nextTick2(onConstruct, null);
                }, function(err) {
                    nextTick2(onConstruct, err);
                });
            }
        }
    } catch (err) {
        onConstruct(err);
    }
}
function emitConstructNT(stream) {
    stream.emit(kConstruct);
}
function isRequest1(stream) {
    return stream && stream.setHeader && typeof stream.abort === "function";
}
function destroyer(stream, err) {
    if (!stream) return;
    if (isRequest1(stream)) return stream.abort();
    if (isRequest1(stream.req)) return stream.req.abort();
    if (typeof stream.destroy === "function") return stream.destroy(err);
    if (typeof stream.close === "function") return stream.close();
}
const __default4 = {
    construct,
    destroyer,
    destroy,
    undestroy,
    errorOrDestroy
};
var NotImplemented;
(function(NotImplemented1) {
    NotImplemented1[NotImplemented1["ascii"] = 0] = "ascii";
    NotImplemented1[NotImplemented1["latin1"] = 1] = "latin1";
    NotImplemented1[NotImplemented1["utf16le"] = 2] = "utf16le";
})(NotImplemented || (NotImplemented = {
}));
function normalizeEncoding3(enc) {
    const encoding = normalizeEncoding1(enc ?? null);
    if (encoding && encoding in NotImplemented) notImplemented1(encoding);
    if (!encoding && typeof enc === "string" && enc.toLowerCase() !== "raw") {
        throw new Error(`Unknown encoding: ${enc}`);
    }
    return String(encoding);
}
function utf8CheckByte(__byte) {
    if (__byte <= 127) return 0;
    else if (__byte >> 5 === 6) return 2;
    else if (__byte >> 4 === 14) return 3;
    else if (__byte >> 3 === 30) return 4;
    return __byte >> 6 === 2 ? -1 : -2;
}
function utf8CheckIncomplete(self, buf, i) {
    let j = buf.length - 1;
    if (j < i) return 0;
    let nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 1;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) self.lastNeed = nb - 2;
        return nb;
    }
    if (--j < i || nb === -2) return 0;
    nb = utf8CheckByte(buf[j]);
    if (nb >= 0) {
        if (nb > 0) {
            if (nb === 2) nb = 0;
            else self.lastNeed = nb - 3;
        }
        return nb;
    }
    return 0;
}
function utf8CheckExtraBytes(self, buf) {
    if ((buf[0] & 192) !== 128) {
        self.lastNeed = 0;
        return "\ufffd";
    }
    if (self.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
            self.lastNeed = 1;
            return "\ufffd";
        }
        if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 192) !== 128) {
                self.lastNeed = 2;
                return "\ufffd";
            }
        }
    }
}
function utf8FillLastComplete(buf) {
    const p = this.lastTotal - this.lastNeed;
    const r = utf8CheckExtraBytes(this, buf);
    if (r !== undefined) return r;
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, p, 0, buf.length);
    this.lastNeed -= buf.length;
}
function utf8FillLastIncomplete(buf) {
    if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
    this.lastNeed -= buf.length;
}
function utf8Text(buf, i) {
    const total = utf8CheckIncomplete(this, buf, i);
    if (!this.lastNeed) return buf.toString("utf8", i);
    this.lastTotal = total;
    const end = buf.length - (total - this.lastNeed);
    buf.copy(this.lastChar, 0, end);
    return buf.toString("utf8", i, end);
}
function utf8End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) return r + "\ufffd";
    return r;
}
function utf8Write(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    if (buf.length === 0) return "";
    let r;
    let i;
    if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === undefined) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
    } else {
        i = 0;
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
    return r || "";
}
function base64Text(buf, i) {
    const n = (buf.length - i) % 3;
    if (n === 0) return buf.toString("base64", i);
    this.lastNeed = 3 - n;
    this.lastTotal = 3;
    if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
    } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
    }
    return buf.toString("base64", i, buf.length - n);
}
function base64End(buf) {
    const r = buf && buf.length ? this.write(buf) : "";
    if (this.lastNeed) {
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
    }
    return r;
}
function simpleWrite(buf) {
    if (typeof buf === "string") {
        return buf;
    }
    return buf.toString(this.encoding);
}
function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : "";
}
class StringDecoderBase {
    encoding;
    lastChar;
    lastNeed = 0;
    lastTotal = 0;
    constructor(encoding, nb){
        this.encoding = encoding;
        this.lastChar = Buffer1.allocUnsafe(nb);
    }
}
class Base64Decoder extends StringDecoderBase {
    end = base64End;
    fillLast = utf8FillLastIncomplete;
    text = base64Text;
    write = utf8Write;
    constructor(encoding){
        super(normalizeEncoding3(encoding), 3);
    }
}
class GenericDecoder extends StringDecoderBase {
    end = simpleEnd;
    fillLast = undefined;
    text = utf8Text;
    write = simpleWrite;
    constructor(encoding){
        super(normalizeEncoding3(encoding), 4);
    }
}
class Utf8Decoder extends StringDecoderBase {
    end = utf8End;
    fillLast = utf8FillLastComplete;
    text = utf8Text;
    write = utf8Write;
    constructor(encoding){
        super(normalizeEncoding3(encoding), 4);
    }
}
class StringDecoder {
    encoding;
    end;
    fillLast;
    lastChar;
    lastNeed;
    lastTotal;
    text;
    write;
    constructor(encoding){
        let decoder1;
        switch(encoding){
            case "utf8":
                decoder1 = new Utf8Decoder(encoding);
                break;
            case "base64":
                decoder1 = new Base64Decoder(encoding);
                break;
            default:
                decoder1 = new GenericDecoder(encoding);
        }
        this.encoding = decoder1.encoding;
        this.end = decoder1.end;
        this.fillLast = decoder1.fillLast;
        this.lastChar = decoder1.lastChar;
        this.lastNeed = decoder1.lastNeed;
        this.lastTotal = decoder1.lastTotal;
        this.text = decoder1.text;
        this.write = decoder1.write;
    }
}
new Proxy(StringDecoder, {
    apply (_target, thisArg, args) {
        return Object.assign(thisArg, new StringDecoder(...args));
    }
});
function _from1(Readable1, iterable, opts) {
    let iterator;
    if (typeof iterable === "string" || iterable instanceof Buffer1) {
        return new Readable1({
            objectMode: true,
            ...opts,
            read () {
                this.push(iterable);
                this.push(null);
            }
        });
    }
    let isAsync;
    if (iterable && iterable[Symbol.asyncIterator]) {
        isAsync = true;
        iterator = iterable[Symbol.asyncIterator]();
    } else if (iterable && iterable[Symbol.iterator]) {
        isAsync = false;
        iterator = iterable[Symbol.iterator]();
    } else {
        throw new ERR_INVALID_ARG_TYPE("iterable", [
            "Iterable"
        ], iterable);
    }
    const readable = new Readable1({
        objectMode: true,
        highWaterMark: 1,
        ...opts
    });
    let reading = false;
    readable._read = function() {
        if (!reading) {
            reading = true;
            next();
        }
    };
    readable._destroy = function(error, cb) {
        close3(error).then(()=>nextTick1(cb, error)
        , (e)=>nextTick1(cb, e || error)
        );
    };
    async function close3(error) {
        const hadError = error !== undefined && error !== null;
        const hasThrow = typeof iterator.throw === "function";
        if (hadError && hasThrow) {
            const { value , done  } = await iterator.throw(error);
            await value;
            if (done) {
                return;
            }
        }
        if (typeof iterator.return === "function") {
            const { value  } = await iterator.return();
            await value;
        }
    }
    async function next() {
        for(;;){
            try {
                const { value , done  } = isAsync ? await iterator.next() : iterator.next();
                if (done) {
                    readable.push(null);
                } else {
                    const res = value && typeof value.then === "function" ? await value : value;
                    if (res === null) {
                        reading = false;
                        throw new ERR_STREAM_NULL_VALUES();
                    } else if (readable.push(res)) {
                        continue;
                    } else {
                        reading = false;
                    }
                }
            } catch (err) {
                readable.destroy(err);
            }
            break;
        }
    }
    return readable;
}
class BufferList {
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
    push(v) {
        const entry = {
            data: v,
            next: null
        };
        if (this.length > 0) {
            this.tail.next = entry;
        } else {
            this.head = entry;
        }
        this.tail = entry;
        ++this.length;
    }
    unshift(v) {
        const entry = {
            data: v,
            next: this.head
        };
        if (this.length === 0) {
            this.tail = entry;
        }
        this.head = entry;
        ++this.length;
    }
    shift() {
        if (this.length === 0) {
            return;
        }
        const ret = this.head.data;
        if (this.length === 1) {
            this.head = this.tail = null;
        } else {
            this.head = this.head.next;
        }
        --this.length;
        return ret;
    }
    clear() {
        this.head = this.tail = null;
        this.length = 0;
    }
    join(s) {
        if (this.length === 0) {
            return "";
        }
        let p = this.head;
        let ret = "" + p.data;
        while(p = p.next){
            ret += s + p.data;
        }
        return ret;
    }
    concat(n) {
        if (this.length === 0) {
            return Buffer1.alloc(0);
        }
        const ret = Buffer1.allocUnsafe(n >>> 0);
        let p = this.head;
        let i = 0;
        while(p){
            ret.set(p.data, i);
            i += p.data.length;
            p = p.next;
        }
        return ret;
    }
    consume(n, hasStrings) {
        const data = this.head.data;
        if (n < data.length) {
            const slice = data.slice(0, n);
            this.head.data = data.slice(n);
            return slice;
        }
        if (n === data.length) {
            return this.shift();
        }
        return hasStrings ? this._getString(n) : this._getBuffer(n);
    }
    first() {
        return this.head.data;
    }
    *[Symbol.iterator]() {
        for(let p = this.head; p; p = p.next){
            yield p.data;
        }
    }
    _getString(n) {
        let ret = "";
        let p = this.head;
        let c = 0;
        do {
            const str = p.data;
            if (n > str.length) {
                ret += str;
                n -= str.length;
            } else {
                if (n === str.length) {
                    ret += str;
                    ++c;
                    if (p.next) {
                        this.head = p.next;
                    } else {
                        this.head = this.tail = null;
                    }
                } else {
                    ret += str.slice(0, n);
                    this.head = p;
                    p.data = str.slice(n);
                }
                break;
            }
            ++c;
        }while (p = p.next)
        this.length -= c;
        return ret;
    }
    _getBuffer(n) {
        const ret = Buffer1.allocUnsafe(n);
        const retLen = n;
        let p = this.head;
        let c = 0;
        do {
            const buf = p.data;
            if (n > buf.length) {
                ret.set(buf, retLen - n);
                n -= buf.length;
            } else {
                if (n === buf.length) {
                    ret.set(buf, retLen - n);
                    ++c;
                    if (p.next) {
                        this.head = p.next;
                    } else {
                        this.head = this.tail = null;
                    }
                } else {
                    ret.set(new Uint8Array(buf.buffer, buf.byteOffset, n), retLen - n);
                    this.head = p;
                    p.data = buf.slice(n);
                }
                break;
            }
            ++c;
        }while (p = p.next)
        this.length -= c;
        return ret;
    }
    [inspect.custom](_, options) {
        return inspect(this, {
            ...options,
            depth: 0,
            customInspect: false
        });
    }
}
let debug = debuglog("stream", (fn)=>{
    debug = fn;
});
const { errorOrDestroy: errorOrDestroy1  } = __default4;
const kPaused = Symbol("kPaused");
function isDuplexStream(maybe_duplex) {
    const isReadable2 = Readable.prototype.isPrototypeOf(maybe_duplex);
    let prototype = maybe_duplex;
    let isDuplex = false;
    while(prototype?.constructor && prototype.constructor.name !== "Object"){
        if (prototype.constructor.name === "Duplex") {
            isDuplex = true;
            break;
        }
        prototype = Object.getPrototypeOf(prototype);
    }
    return isReadable2 && isDuplex;
}
Object.setPrototypeOf(Readable.prototype, Stream.prototype);
Object.setPrototypeOf(Readable, Stream);
const nop1 = ()=>{
};
const { errorOrDestroy: errorOrDestroy2  } = __default4;
function ReadableState(options, stream, isDuplex) {
    if (typeof isDuplex !== "boolean") {
        isDuplex = stream instanceof Stream.Duplex;
    }
    this.objectMode = !!(options && options.objectMode);
    if (isDuplex) {
        this.objectMode = this.objectMode || !!(options && options.readableObjectMode);
    }
    this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.buffer = new BufferList();
    this.length = 0;
    this.pipes = [];
    this.flowing = null;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.constructed = true;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.resumeScheduled = false;
    this[kPaused] = null;
    this.errorEmitted = false;
    this.emitClose = !options || options.emitClose !== false;
    this.autoDestroy = !options || options.autoDestroy !== false;
    this.destroyed = false;
    this.errored = null;
    this.closed = false;
    this.closeEmitted = false;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.awaitDrainWriters = null;
    this.multiAwaitDrain = false;
    this.readingMore = false;
    this.dataEmitted = false;
    this.decoder = null;
    this.encoding = null;
    if (options && options.encoding) {
        this.decoder = new StringDecoder(options.encoding);
        this.encoding = options.encoding;
    }
}
function Readable(options) {
    if (!(this instanceof Readable)) {
        return new Readable(options);
    }
    const isDuplex = this instanceof Stream.Duplex;
    this._readableState = new ReadableState(options, this, isDuplex);
    if (options) {
        if (typeof options.read === "function") {
            this._read = options.read;
        }
        if (typeof options.destroy === "function") {
            this._destroy = options.destroy;
        }
        if (typeof options.construct === "function") {
            this._construct = options.construct;
        }
        if (options.signal && !isDuplex) {
            addAbortSignalNoValidate(options.signal, this);
        }
    }
    Stream.call(this, options);
    __default4.construct(this, ()=>{
        if (this._readableState.needReadable) {
            maybeReadMore(this, this._readableState);
        }
    });
}
Readable.prototype.destroy = __default4.destroy;
Readable.prototype._undestroy = __default4.undestroy;
Readable.prototype._destroy = function(err, cb) {
    cb(err);
};
Readable.prototype[EventEmitter1.captureRejectionSymbol] = function(err) {
    this.destroy(err);
};
Readable.prototype.push = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, false);
};
Readable.prototype.unshift = function(chunk, encoding) {
    return readableAddChunk(this, chunk, encoding, true);
};
function readableAddChunk(stream, chunk, encoding, addToFront) {
    debug("readableAddChunk", chunk);
    const state = stream._readableState;
    let err;
    if (!state.objectMode) {
        if (typeof chunk === "string") {
            encoding = encoding || state.defaultEncoding;
            if (state.encoding !== encoding) {
                if (addToFront && state.encoding) {
                    chunk = Buffer1.from(chunk, encoding).toString(state.encoding);
                } else {
                    chunk = Buffer1.from(chunk, encoding);
                    encoding = "";
                }
            }
        } else if (chunk instanceof Buffer1) {
            encoding = "";
        } else if (Stream._isUint8Array(chunk)) {
            chunk = Stream._uint8ArrayToBuffer(chunk);
            encoding = "";
        } else if (chunk != null) {
            err = new ERR_INVALID_ARG_TYPE("chunk", [
                "string",
                "Buffer",
                "Uint8Array"
            ], chunk);
        }
    }
    if (err) {
        errorOrDestroy2(stream, err);
    } else if (chunk === null) {
        state.reading = false;
        onEofChunk(stream, state);
    } else if (state.objectMode || chunk && chunk.length > 0) {
        if (addToFront) {
            if (state.endEmitted) {
                errorOrDestroy2(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            } else {
                addChunk(stream, state, chunk, true);
            }
        } else if (state.ended) {
            errorOrDestroy2(stream, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state.destroyed || state.errored) {
            return false;
        } else {
            state.reading = false;
            if (state.decoder && !encoding) {
                chunk = state.decoder.write(chunk);
                if (state.objectMode || chunk.length !== 0) {
                    addChunk(stream, state, chunk, false);
                } else {
                    maybeReadMore(stream, state);
                }
            } else {
                addChunk(stream, state, chunk, false);
            }
        }
    } else if (!addToFront) {
        state.reading = false;
        maybeReadMore(stream, state);
    }
    return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}
function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
        if (state.multiAwaitDrain) {
            state.awaitDrainWriters.clear();
        } else {
            state.awaitDrainWriters = null;
        }
        state.dataEmitted = true;
        stream.emit("data", chunk);
    } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) {
            state.buffer.unshift(chunk);
        } else {
            state.buffer.push(chunk);
        }
        if (state.needReadable) {
            emitReadable(stream);
        }
    }
    maybeReadMore(stream, state);
}
Readable.prototype.isPaused = function() {
    const state = this._readableState;
    return state[kPaused] === true || state.flowing === false;
};
Readable.prototype.setEncoding = function(enc) {
    const decoder2 = new StringDecoder(enc);
    this._readableState.decoder = decoder2;
    this._readableState.encoding = this._readableState.decoder.encoding;
    const buffer = this._readableState.buffer;
    let content = "";
    for (const data of buffer){
        content += decoder2.write(data);
    }
    buffer.clear();
    if (content !== "") {
        buffer.push(content);
    }
    this._readableState.length = content.length;
    return this;
};
const MAX_HWM = 1073741824;
function computeNewHighWaterMark(n) {
    if (n >= 1073741824) {
        n = MAX_HWM;
    } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
    }
    return n;
}
function howMuchToRead(n, state) {
    if (n <= 0 || state.length === 0 && state.ended) {
        return 0;
    }
    if (state.objectMode) {
        return 1;
    }
    if (Number.isNaN(n)) {
        if (state.flowing && state.length) {
            return state.buffer.first().length;
        }
        return state.length;
    }
    if (n <= state.length) {
        return n;
    }
    return state.ended ? state.length : 0;
}
Readable.prototype.read = function(n) {
    debug("read", n);
    if (n === undefined) {
        n = NaN;
    } else if (!Number.isInteger(n)) {
        n = Number.parseInt(n, 10);
    }
    const state = this._readableState;
    const nOrig = n;
    if (n > state.highWaterMark) {
        state.highWaterMark = computeNewHighWaterMark(n);
    }
    if (n !== 0) {
        state.emittedReadable = false;
    }
    if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended) {
            endReadable(this);
        } else {
            emitReadable(this);
        }
        return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
        if (state.length === 0) {
            endReadable(this);
        }
        return null;
    }
    let doRead = state.needReadable;
    debug("need readable", doRead);
    if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
    }
    if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
        doRead = false;
        debug("reading, ended or constructing", doRead);
    } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0) {
            state.needReadable = true;
        }
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading) {
            n = howMuchToRead(nOrig, state);
        }
    }
    let ret;
    if (n > 0) {
        ret = fromList(n, state);
    } else {
        ret = null;
    }
    if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
    } else {
        state.length -= n;
        if (state.multiAwaitDrain) {
            state.awaitDrainWriters.clear();
        } else {
            state.awaitDrainWriters = null;
        }
    }
    if (state.length === 0) {
        if (!state.ended) {
            state.needReadable = true;
        }
        if (nOrig !== n && state.ended) {
            endReadable(this);
        }
    }
    if (ret !== null) {
        state.dataEmitted = true;
        this.emit("data", ret);
    }
    return ret;
};
function onEofChunk(stream, state) {
    debug("onEofChunk");
    if (state.ended) return;
    if (state.decoder) {
        const chunk = state.decoder.end();
        if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
        }
    }
    state.ended = true;
    if (state.sync) {
        emitReadable(stream);
    } else {
        state.needReadable = false;
        state.emittedReadable = true;
        emitReadable_(stream);
    }
}
function emitReadable(stream) {
    const state = stream._readableState;
    debug("emitReadable", state.needReadable, state.emittedReadable);
    state.needReadable = false;
    if (!state.emittedReadable) {
        debug("emitReadable", state.flowing);
        state.emittedReadable = true;
        nextTick2(emitReadable_, stream);
    }
}
function emitReadable_(stream) {
    const state = stream._readableState;
    debug("emitReadable_", state.destroyed, state.length, state.ended);
    if (!state.destroyed && !state.errored && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
    }
    state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
    flow(stream);
}
function maybeReadMore(stream, state) {
    if (!state.readingMore && state.constructed) {
        state.readingMore = true;
        nextTick2(maybeReadMore_, stream, state);
    }
}
function maybeReadMore_(stream, state) {
    while(!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)){
        const len = state.length;
        debug("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length) {
            break;
        }
    }
    state.readingMore = false;
}
Readable.prototype._read = function(n) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
};
Readable.prototype.pipe = function(dest, pipeOpts) {
    const src = this;
    const state = this._readableState;
    if (state.pipes.length === 1) {
        if (!state.multiAwaitDrain) {
            state.multiAwaitDrain = true;
            state.awaitDrainWriters = new Set(state.awaitDrainWriters ? [
                state.awaitDrainWriters
            ] : []);
        }
    }
    state.pipes.push(dest);
    debug("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
    const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== stdout1 && dest !== stderr1;
    const endFn = doEnd ? onend : unpipe;
    if (state.endEmitted) {
        nextTick1(endFn);
    } else {
        src.once("end", endFn);
    }
    dest.on("unpipe", onunpipe);
    function onunpipe(readable, unpipeInfo) {
        debug("onunpipe");
        if (readable === src) {
            if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                unpipeInfo.hasUnpiped = true;
                cleanup();
            }
        }
    }
    function onend() {
        debug("onend");
        dest.end();
    }
    let ondrain;
    let cleanedUp = false;
    function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        if (ondrain) {
            dest.removeListener("drain", ondrain);
        }
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain)) {
            ondrain();
        }
    }
    function pause() {
        if (!cleanedUp) {
            if (state.pipes.length === 1 && state.pipes[0] === dest) {
                debug("false write response, pause", 0);
                state.awaitDrainWriters = dest;
                state.multiAwaitDrain = false;
            } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
                debug("false write response, pause", state.awaitDrainWriters.size);
                state.awaitDrainWriters.add(dest);
            }
            src.pause();
        }
        if (!ondrain) {
            ondrain = pipeOnDrain(src, dest);
            dest.on("drain", ondrain);
        }
    }
    src.on("data", ondata);
    function ondata(chunk) {
        debug("ondata");
        const ret = dest.write(chunk);
        debug("dest.write", ret);
        if (ret === false) {
            pause();
        }
    }
    function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EventEmitter1.listenerCount(dest, "error") === 0) {
            const s = dest._writableState || dest._readableState;
            if (s && !s.errorEmitted) {
                errorOrDestroy2(dest, er);
            } else {
                dest.emit("error", er);
            }
        }
    }
    prependListener(dest, "error", onerror);
    function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
    }
    dest.once("close", onclose);
    function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
    }
    dest.once("finish", onfinish);
    function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
    }
    dest.emit("pipe", src);
    if (dest.writableNeedDrain === true) {
        if (state.flowing) {
            pause();
        }
    } else if (!state.flowing) {
        debug("pipe resume");
        src.resume();
    }
    return dest;
};
function pipeOnDrain(src, dest) {
    return function pipeOnDrainFunctionResult() {
        const state = src._readableState;
        if (state.awaitDrainWriters === dest) {
            debug("pipeOnDrain", 1);
            state.awaitDrainWriters = null;
        } else if (state.multiAwaitDrain) {
            debug("pipeOnDrain", state.awaitDrainWriters.size);
            state.awaitDrainWriters.delete(dest);
        }
        if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && EventEmitter1.listenerCount(src, "data")) {
            state.flowing = true;
            flow(src);
        }
    };
}
Readable.prototype.unpipe = function(dest) {
    const state = this._readableState;
    const unpipeInfo = {
        hasUnpiped: false
    };
    if (state.pipes.length === 0) {
        return this;
    }
    if (!dest) {
        const dests = state.pipes;
        state.pipes = [];
        this.pause();
        for(let i = 0; i < dests.length; i++){
            dests[i].emit("unpipe", this, {
                hasUnpiped: false
            });
        }
        return this;
    }
    const index = state.pipes.indexOf(dest);
    if (index === -1) {
        return this;
    }
    state.pipes.splice(index, 1);
    if (state.pipes.length === 0) {
        this.pause();
    }
    dest.emit("unpipe", this, unpipeInfo);
    return this;
};
Readable.prototype.on = function(ev, fn) {
    const res = Stream.prototype.on.call(this, ev, fn);
    const state = this._readableState;
    if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false) {
            this.resume();
        }
    } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.flowing = false;
            state.emittedReadable = false;
            debug("on readable", state.length, state.reading);
            if (state.length) {
                emitReadable(this);
            } else if (!state.reading) {
                nextTick1(nReadingNextTick, this);
            }
        }
    }
    return res;
};
Readable.prototype.addListener = Readable.prototype.on;
Readable.prototype.removeListener = function(ev, fn) {
    const res = Stream.prototype.removeListener.call(this, ev, fn);
    if (ev === "readable") {
        nextTick1(updateReadableListening, this);
    }
    return res;
};
Readable.prototype.off = Readable.prototype.removeListener;
Readable.prototype.removeAllListeners = function(ev) {
    const res = Stream.prototype.removeAllListeners.apply(this, arguments);
    if (ev === "readable" || ev === undefined) {
        nextTick1(updateReadableListening, this);
    }
    return res;
};
function updateReadableListening(self) {
    const state = self._readableState;
    state.readableListening = self.listenerCount("readable") > 0;
    if (state.resumeScheduled && state[kPaused] === false) {
        state.flowing = true;
    } else if (self.listenerCount("data") > 0) {
        self.resume();
    } else if (!state.readableListening) {
        state.flowing = null;
    }
}
function nReadingNextTick(self) {
    debug("readable nexttick read 0");
    self.read(0);
}
Readable.prototype.resume = function() {
    const state = this._readableState;
    if (!state.flowing) {
        debug("resume");
        state.flowing = !state.readableListening;
        resume(this, state);
    }
    state[kPaused] = false;
    return this;
};
function resume(stream, state) {
    if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        nextTick2(resume_, stream, state);
    }
}
function resume_(stream, state) {
    debug("resume", state.reading);
    if (!state.reading) {
        stream.read(0);
    }
    state.resumeScheduled = false;
    stream.emit("resume");
    flow(stream);
    if (state.flowing && !state.reading) {
        stream.read(0);
    }
}
Readable.prototype.pause = function() {
    debug("call pause flowing=%j", this._readableState.flowing);
    if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
    }
    this._readableState[kPaused] = true;
    return this;
};
function flow(stream) {
    const state = stream._readableState;
    debug("flow", state.flowing);
    while(state.flowing && stream.read() !== null);
}
Readable.prototype.wrap = function(stream) {
    let paused = false;
    stream.on("data", (chunk)=>{
        if (!this.push(chunk) && stream.pause) {
            paused = true;
            stream.pause();
        }
    });
    stream.on("end", ()=>{
        this.push(null);
    });
    stream.on("error", (err)=>{
        errorOrDestroy2(this, err);
    });
    stream.on("close", ()=>{
        this.destroy();
    });
    stream.on("destroy", ()=>{
        this.destroy();
    });
    this._read = ()=>{
        if (paused && stream.resume) {
            paused = false;
            stream.resume();
        }
    };
    const streamKeys = Object.keys(stream);
    for(let j = 1; j < streamKeys.length; j++){
        const i = streamKeys[j];
        if (this[i] === undefined && typeof stream[i] === "function") {
            this[i] = stream[i].bind(stream);
        }
    }
    return this;
};
Readable.prototype[Symbol.asyncIterator] = function() {
    return streamToAsyncIterator(this);
};
Readable.prototype.iterator = function(options) {
    if (options !== undefined) {
        validateObject(options, "options");
    }
    return streamToAsyncIterator(this, options);
};
function streamToAsyncIterator(stream, options) {
    if (typeof stream.read !== "function") {
        stream = Readable.wrap(stream, {
            objectMode: true
        });
    }
    const iter = createAsyncIterator(stream, options);
    iter.stream = stream;
    return iter;
}
async function* createAsyncIterator(stream, options) {
    let callback = nop1;
    const opts = {
        destroyOnReturn: true,
        destroyOnError: true,
        ...options
    };
    function next(resolve12) {
        if (this === stream) {
            callback();
            callback = nop1;
        } else {
            callback = resolve12;
        }
    }
    const state = stream._readableState;
    let error = state.errored;
    let errorEmitted = state.errorEmitted;
    let endEmitted = state.endEmitted;
    let closeEmitted = state.closeEmitted;
    stream.on("readable", next).on("error", function(err) {
        error = err;
        errorEmitted = true;
        next.call(this);
    }).on("end", function() {
        endEmitted = true;
        next.call(this);
    }).on("close", function() {
        closeEmitted = true;
        next.call(this);
    });
    let errorThrown = false;
    try {
        while(true){
            const chunk = stream.destroyed ? null : stream.read();
            if (chunk !== null) {
                yield chunk;
            } else if (errorEmitted) {
                throw error;
            } else if (endEmitted) {
                break;
            } else if (closeEmitted) {
                break;
            } else {
                await new Promise(next);
            }
        }
    } catch (err) {
        if (opts.destroyOnError) {
            __default4.destroyer(stream, err);
        }
        errorThrown = true;
        throw err;
    } finally{
        if (!errorThrown && opts.destroyOnReturn) {
            if (state.autoDestroy || !endEmitted) {
                __default4.destroyer(stream, null);
            }
        }
    }
}
Object.defineProperties(Readable.prototype, {
    readable: {
        get () {
            const r = this._readableState;
            return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
        },
        set (val) {
            if (this._readableState) {
                this._readableState.readable = !!val;
            }
        }
    },
    readableDidRead: {
        enumerable: false,
        get: function() {
            return this._readableState.dataEmitted;
        }
    },
    readableAborted: {
        enumerable: false,
        get: function() {
            return !!(this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted;
        }
    },
    readableHighWaterMark: {
        enumerable: false,
        get: function() {
            return this._readableState.highWaterMark;
        }
    },
    readableBuffer: {
        enumerable: false,
        get: function() {
            return this._readableState && this._readableState.buffer;
        }
    },
    readableFlowing: {
        enumerable: false,
        get: function() {
            return this._readableState.flowing;
        },
        set: function(state) {
            if (this._readableState) {
                this._readableState.flowing = state;
            }
        }
    },
    readableLength: {
        enumerable: false,
        get () {
            return this._readableState.length;
        }
    },
    readableObjectMode: {
        enumerable: false,
        get () {
            return this._readableState ? this._readableState.objectMode : false;
        }
    },
    readableEncoding: {
        enumerable: false,
        get () {
            return this._readableState ? this._readableState.encoding : null;
        }
    },
    destroyed: {
        enumerable: false,
        get () {
            if (this._readableState === undefined) {
                return false;
            }
            return this._readableState.destroyed;
        },
        set (value) {
            if (!this._readableState) {
                return;
            }
            this._readableState.destroyed = value;
        }
    },
    readableEnded: {
        enumerable: false,
        get () {
            return this._readableState ? this._readableState.endEmitted : false;
        }
    }
});
Object.defineProperties(ReadableState.prototype, {
    pipesCount: {
        get () {
            return this.pipes.length;
        }
    },
    paused: {
        get () {
            return this[kPaused] !== false;
        },
        set (value) {
            this[kPaused] = !!value;
        }
    }
});
function fromList(n, state) {
    if (state.length === 0) {
        return null;
    }
    let ret;
    if (state.objectMode) {
        ret = state.buffer.shift();
    } else if (!n || n >= state.length) {
        if (state.decoder) {
            ret = state.buffer.join("");
        } else if (state.buffer.length === 1) {
            ret = state.buffer.first();
        } else {
            ret = state.buffer.concat(state.length);
        }
        state.buffer.clear();
    } else {
        ret = state.buffer.consume(n, state.decoder);
    }
    return ret;
}
function endReadable(stream) {
    const state = stream._readableState;
    debug("endReadable", state.endEmitted);
    if (!state.endEmitted) {
        state.ended = true;
        nextTick2(endReadableNT, state, stream);
    }
}
function endReadableNT(state, stream) {
    debug("endReadableNT", state.endEmitted, state.length);
    if (!state.errorEmitted && !state.closeEmitted && !state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.emit("end");
        if (stream.writable && stream.allowHalfOpen === false) {
            nextTick2(endWritableNT, stream);
        } else if (state.autoDestroy) {
            const wState = stream._writableState;
            const autoDestroy = !wState || wState.autoDestroy && (wState.finished || wState.writable === false);
            if (autoDestroy) {
                stream.destroy();
            }
        }
    }
}
function endWritableNT(stream) {
    const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
    if (writable) {
        stream.end();
    }
}
function readableFrom(iterable, opts) {
    return _from1(Readable, iterable, opts);
}
function wrap1(src, options) {
    return new Readable({
        objectMode: (src.readableObjectMode ?? src.objectMode) ?? true,
        ...options,
        destroy (err, callback) {
            __default4.destroyer(src, err);
            callback(err);
        }
    }).wrap(src);
}
Readable._fromList = fromList;
Readable.ReadableState = ReadableState;
Readable.from = readableFrom;
Readable.wrap = wrap1;
function createWritableStdioStream(writer) {
    const stream = new Writable({
        write (buf, enc, cb) {
            writer.writeSync(buf instanceof Uint8Array ? buf : Buffer1.from(buf, enc));
            cb();
        },
        destroy (err, cb) {
            cb(err);
            this._undestroy();
            if (!this._writableState.emitClose) {
                nextTick(()=>this.emit("close")
                );
            }
        }
    });
    stream.fd = writer.rid;
    stream.destroySoon = stream.destroy;
    stream._isStdio = true;
    stream.once("close", ()=>writer.close()
    );
    Object.defineProperties(stream, {
        columns: {
            enumerable: true,
            configurable: true,
            get: ()=>Deno.isatty(writer.rid) ? Deno.consoleSize(writer.rid).columns : undefined
        },
        rows: {
            enumerable: true,
            configurable: true,
            get: ()=>Deno.isatty(writer.rid) ? Deno.consoleSize(writer.rid).rows : undefined
        },
        isTTY: {
            enumerable: true,
            configurable: true,
            get: ()=>Deno.isatty(writer.rid)
        },
        getWindowSize: {
            enumerable: true,
            configurable: true,
            value: ()=>Deno.isatty(writer.rid) ? Object.values(Deno.consoleSize(writer.rid)) : undefined
        }
    });
    return stream;
}
const stderr1 = createWritableStdioStream(Deno.stderr);
const stdout1 = createWritableStdioStream(Deno.stdout);
Object.setPrototypeOf(Writable.prototype, Stream.prototype);
Object.setPrototypeOf(Writable, Stream);
function nop2() {
}
const kOnFinished = Symbol("kOnFinished");
function WritableState(options, stream, isDuplex) {
    if (typeof isDuplex !== "boolean") {
        isDuplex = isDuplexStream(stream);
    }
    this.objectMode = !!(options && options.objectMode);
    if (isDuplex) {
        this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
    }
    this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
    this.finalCalled = false;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    this.destroyed = false;
    const noDecode = !!(options && options.decodeStrings === false);
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options && options.defaultEncoding || "utf8";
    this.length = 0;
    this.writing = false;
    this.corked = 0;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = onwrite.bind(undefined, stream);
    this.writecb = null;
    this.writelen = 0;
    this.afterWriteTickInfo = null;
    resetBuffer(this);
    this.pendingcb = 0;
    this.constructed = true;
    this.prefinished = false;
    this.errorEmitted = false;
    this.emitClose = !options || options.emitClose !== false;
    this.autoDestroy = !options || options.autoDestroy !== false;
    this.errored = null;
    this.closed = false;
    this.closeEmitted = false;
    this[kOnFinished] = [];
}
function resetBuffer(state) {
    state.buffered = [];
    state.bufferedIndex = 0;
    state.allBuffers = true;
    state.allNoop = true;
}
WritableState.prototype.getBuffer = function getBuffer() {
    return this.buffered.slice(this.bufferedIndex);
};
Object.defineProperty(WritableState.prototype, "bufferedRequestCount", {
    get () {
        return this.buffered.length - this.bufferedIndex;
    }
});
function Writable(options) {
    const isDuplex = isDuplexStream(this);
    if (!isDuplex && !Function.prototype[Symbol.hasInstance].call(Writable, this)) {
        return new Writable(options);
    }
    this._writableState = new WritableState(options, this, isDuplex);
    if (options) {
        if (typeof options.write === "function") {
            this._write = options.write;
        }
        if (typeof options.writev === "function") {
            this._writev = options.writev;
        }
        if (typeof options.destroy === "function") {
            this._destroy = options.destroy;
        }
        if (typeof options.final === "function") {
            this._final = options.final;
        }
        if (typeof options.construct === "function") {
            this._construct = options.construct;
        }
        if (options.signal) {
            addAbortSignalNoValidate(options.signal, this);
        }
    }
    Stream.call(this, options);
    __default4.construct(this, ()=>{
        const state = this._writableState;
        if (!state.writing) {
            clearBuffer(this, state);
        }
        finishMaybe(this, state);
    });
}
Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function(object) {
        if (Function.prototype[Symbol.hasInstance].call(this, object)) return true;
        if (this !== Writable) return false;
        return object && object._writableState instanceof WritableState;
    }
});
Writable.prototype.pipe = function() {
    errorOrDestroy1(this, new ERR_STREAM_CANNOT_PIPE());
};
function _write(stream, chunk, encoding, cb) {
    const state = stream._writableState;
    if (typeof encoding === "function") {
        cb = encoding;
        encoding = state.defaultEncoding;
    } else {
        if (!encoding) {
            encoding = state.defaultEncoding;
        } else if (encoding !== "buffer" && !Buffer1.isEncoding(encoding)) {
            throw new ERR_UNKNOWN_ENCODING(encoding);
        }
        if (typeof cb !== "function") {
            cb = nop2;
        }
    }
    if (chunk === null) {
        throw new ERR_STREAM_NULL_VALUES();
    } else if (!state.objectMode) {
        if (typeof chunk === "string") {
            if (state.decodeStrings !== false) {
                chunk = Buffer1.from(chunk, encoding);
                encoding = "buffer";
            }
        } else if (chunk instanceof Buffer1) {
            encoding = "buffer";
        } else if (isUint8Array(chunk)) {
            chunk = _uint8ArrayToBuffer(chunk);
            encoding = "buffer";
        } else {
            throw new ERR_INVALID_ARG_TYPE("chunk", [
                "string",
                "Buffer",
                "Uint8Array"
            ], chunk);
        }
    }
    let err;
    if (state.ending) {
        err = new ERR_STREAM_WRITE_AFTER_END();
    } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("write");
    }
    if (err) {
        nextTick2(cb, err);
        errorOrDestroy1(stream, err, true);
        return err;
    }
    state.pendingcb++;
    return writeOrBuffer(stream, state, chunk, encoding, cb);
}
Writable.prototype.write = function(chunk, encoding, cb) {
    return _write(this, chunk, encoding, cb) === true;
};
Writable.prototype.cork = function() {
    this._writableState.corked++;
};
Writable.prototype.uncork = function() {
    const state = this._writableState;
    if (state.corked) {
        state.corked--;
        if (!state.writing) {
            clearBuffer(this, state);
        }
    }
};
Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    if (typeof encoding === "string") {
        encoding = encoding.toLowerCase();
    }
    if (!Buffer1.isEncoding(encoding)) {
        throw new ERR_UNKNOWN_ENCODING(encoding);
    }
    this._writableState.defaultEncoding = encoding;
    return this;
};
function writeOrBuffer(stream, state, chunk, encoding, callback) {
    const len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    const ret = state.length < state.highWaterMark;
    if (!ret) {
        state.needDrain = true;
    }
    if (state.writing || state.corked || state.errored || !state.constructed) {
        state.buffered.push({
            chunk,
            encoding,
            callback
        });
        if (state.allBuffers && encoding !== "buffer") {
            state.allBuffers = false;
        }
        if (state.allNoop && callback !== nop2) {
            state.allNoop = false;
        }
    } else {
        state.writelen = len;
        state.writecb = callback;
        state.writing = true;
        state.sync = true;
        stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
    }
    return ret && !state.errored && !state.destroyed;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    if (state.destroyed) {
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
    } else if (writev) {
        stream._writev(chunk, state.onwrite);
    } else {
        stream._write(chunk, encoding, state.onwrite);
    }
    state.sync = false;
}
function onwriteError(stream, state, er, cb) {
    --state.pendingcb;
    cb(er);
    errorBuffer(state);
    errorOrDestroy1(stream, er);
}
function onwrite(stream, er) {
    const state = stream._writableState;
    const sync = state.sync;
    const cb = state.writecb;
    if (typeof cb !== "function") {
        errorOrDestroy1(stream, new ERR_MULTIPLE_CALLBACK());
        return;
    }
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
    if (er) {
        er.stack;
        if (!state.errored) {
            state.errored = er;
        }
        if (stream._readableState && !stream._readableState.errored) {
            stream._readableState.errored = er;
        }
        if (sync) {
            nextTick2(onwriteError, stream, state, er, cb);
        } else {
            onwriteError(stream, state, er, cb);
        }
    } else {
        if (state.buffered.length > state.bufferedIndex) {
            clearBuffer(stream, state);
        }
        if (sync) {
            if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
                state.afterWriteTickInfo.count++;
            } else {
                state.afterWriteTickInfo = {
                    count: 1,
                    cb,
                    stream,
                    state
                };
                nextTick2(afterWriteTick, state.afterWriteTickInfo);
            }
        } else {
            afterWrite(stream, state, 1, cb);
        }
    }
}
function afterWriteTick({ stream , state , count , cb  }) {
    state.afterWriteTickInfo = null;
    return afterWrite(stream, state, count, cb);
}
function afterWrite(stream, state, count, cb) {
    const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
    if (needDrain) {
        state.needDrain = false;
        stream.emit("drain");
    }
    while(count-- > 0){
        state.pendingcb--;
        cb();
    }
    if (state.destroyed) {
        errorBuffer(state);
    }
    finishMaybe(stream, state);
}
function errorBuffer(state) {
    if (state.writing) {
        return;
    }
    for(let n = state.bufferedIndex; n < state.buffered.length; ++n){
        const { chunk , callback  } = state.buffered[n];
        const len = state.objectMode ? 1 : chunk.length;
        state.length -= len;
        callback(new ERR_STREAM_DESTROYED("write"));
    }
    const onfinishCallbacks = state[kOnFinished].splice(0);
    for(let i = 0; i < onfinishCallbacks.length; i++){
        onfinishCallbacks[i](new ERR_STREAM_DESTROYED("end"));
    }
    resetBuffer(state);
}
function clearBuffer(stream, state) {
    if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
        return;
    }
    const { buffered , bufferedIndex , objectMode  } = state;
    const bufferedLength = buffered.length - bufferedIndex;
    if (!bufferedLength) {
        return;
    }
    let i = bufferedIndex;
    state.bufferProcessing = true;
    if (bufferedLength > 1 && stream._writev) {
        state.pendingcb -= bufferedLength - 1;
        const callback = state.allNoop ? nop2 : (err)=>{
            for(let n = i; n < buffered.length; ++n){
                buffered[n].callback(err);
            }
        };
        const chunks = state.allNoop && i === 0 ? buffered : buffered.slice(i);
        chunks.allBuffers = state.allBuffers;
        doWrite(stream, state, true, state.length, chunks, "", callback);
        resetBuffer(state);
    } else {
        do {
            const { chunk , encoding , callback  } = buffered[i];
            buffered[i++] = null;
            const len = objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, callback);
        }while (i < buffered.length && !state.writing)
        if (i === buffered.length) {
            resetBuffer(state);
        } else if (i > 256) {
            buffered.splice(0, i);
            state.bufferedIndex = 0;
        } else {
            state.bufferedIndex = i;
        }
    }
    state.bufferProcessing = false;
}
Writable.prototype._write = function(chunk, encoding, cb) {
    if (this._writev) {
        this._writev([
            {
                chunk,
                encoding
            }
        ], cb);
    } else {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
    }
};
Writable.prototype._writev = null;
Writable.prototype.end = function(chunk, encoding, cb) {
    const state = this._writableState;
    if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
    } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
    }
    let err;
    if (chunk !== null && chunk !== undefined) {
        const ret = _write(this, chunk, encoding);
        if (ret instanceof Error) {
            err = ret;
        }
    }
    if (state.corked) {
        state.corked = 1;
        this.uncork();
    }
    if (err) {
    } else if (!state.errored && !state.ending) {
        state.ending = true;
        finishMaybe(this, state, true);
        state.ended = true;
    } else if (state.finished) {
        err = new ERR_STREAM_ALREADY_FINISHED("end");
    } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("end");
    }
    if (typeof cb === "function") {
        if (err || state.finished) {
            nextTick1(cb, err);
        } else {
            state[kOnFinished].push(cb);
        }
    }
    return this;
};
function needFinish(state) {
    return state.ending && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
}
function callFinal(stream, state) {
    let called = false;
    function onFinish(err) {
        if (called) {
            errorOrDestroy1(stream, err ?? ERR_MULTIPLE_CALLBACK());
            return;
        }
        called = true;
        state.pendingcb--;
        if (err) {
            const onfinishCallbacks = state[kOnFinished].splice(0);
            for(let i = 0; i < onfinishCallbacks.length; i++){
                onfinishCallbacks[i](err);
            }
            errorOrDestroy1(stream, err, state.sync);
        } else if (needFinish(state)) {
            state.prefinished = true;
            stream.emit("prefinish");
            state.pendingcb++;
            nextTick2(finish, stream, state);
        }
    }
    state.sync = true;
    state.pendingcb++;
    try {
        const result = stream._final(onFinish);
        if (result != null) {
            const then = result.then;
            if (typeof then === "function") {
                then.call(result, function() {
                    nextTick2(onFinish, null);
                }, function(err) {
                    nextTick2(onFinish, err);
                });
            }
        }
    } catch (err) {
        onFinish(stream, state, err);
    }
    state.sync = false;
}
function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
            state.finalCalled = true;
            callFinal(stream, state);
        } else {
            state.prefinished = true;
            stream.emit("prefinish");
        }
    }
}
function finishMaybe(stream, state, sync) {
    if (needFinish(state)) {
        prefinish(stream, state);
        if (state.pendingcb === 0 && needFinish(state)) {
            state.pendingcb++;
            if (sync) {
                nextTick2(finish, stream, state);
            } else {
                finish(stream, state);
            }
        }
    }
}
function finish(stream, state) {
    state.pendingcb--;
    state.finished = true;
    const onfinishCallbacks = state[kOnFinished].splice(0);
    for(let i = 0; i < onfinishCallbacks.length; i++){
        onfinishCallbacks[i]();
    }
    stream.emit("finish");
    if (state.autoDestroy) {
        const rState = stream._readableState;
        const autoDestroy = !rState || rState.autoDestroy && (rState.endEmitted || rState.readable === false);
        if (autoDestroy) {
            stream.destroy();
        }
    }
}
Object.defineProperties(Writable.prototype, {
    destroyed: {
        get () {
            return this._writableState ? this._writableState.destroyed : false;
        },
        set (value) {
            if (this._writableState) {
                this._writableState.destroyed = value;
            }
        }
    },
    writable: {
        get () {
            const w = this._writableState;
            return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
        },
        set (val) {
            if (this._writableState) {
                this._writableState.writable = !!val;
            }
        }
    },
    writableFinished: {
        get () {
            return this._writableState ? this._writableState.finished : false;
        }
    },
    writableObjectMode: {
        get () {
            return this._writableState ? this._writableState.objectMode : false;
        }
    },
    writableBuffer: {
        get () {
            return this._writableState && this._writableState.getBuffer();
        }
    },
    writableEnded: {
        get () {
            return this._writableState ? this._writableState.ending : false;
        }
    },
    writableNeedDrain: {
        get () {
            const wState = this._writableState;
            if (!wState) return false;
            return !wState.destroyed && !wState.ending && wState.needDrain;
        }
    },
    writableHighWaterMark: {
        get () {
            return this._writableState && this._writableState.highWaterMark;
        }
    },
    writableCorked: {
        get () {
            return this._writableState ? this._writableState.corked : 0;
        }
    },
    writableLength: {
        get () {
            return this._writableState && this._writableState.length;
        }
    }
});
const destroy1 = __default4.destroy;
Writable.prototype.destroy = function(err, cb) {
    const state = this._writableState;
    if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
        nextTick1(errorBuffer, state);
    }
    destroy1.call(this, err, cb);
    return this;
};
Writable.prototype._undestroy = __default4.undestroy;
Writable.prototype._destroy = function(err, cb) {
    cb(err);
};
Writable.prototype[EventEmitter1.captureRejectionSymbol] = function(err) {
    this.destroy(err);
};
Writable.WritableState = WritableState;
const kIsDisturbed = Symbol("kIsDisturbed");
function isReadableNodeStream(obj) {
    return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!obj._writableState || obj._readableState?.readable !== false) && (!obj._writableState || obj._readableState));
}
function isWritableNodeStream(obj) {
    return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || obj._writableState?.writable !== false));
}
function isDuplexNodeStream(obj) {
    return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
}
function isNodeStream(obj) {
    return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
}
function isIterable(obj, isAsync) {
    if (obj == null) return false;
    if (isAsync === true) return typeof obj[Symbol.asyncIterator] === "function";
    if (isAsync === false) return typeof obj[Symbol.iterator] === "function";
    return typeof obj[Symbol.asyncIterator] === "function" || typeof obj[Symbol.iterator] === "function";
}
function isDestroyed(stream) {
    if (!isNodeStream(stream)) return null;
    const wState = stream._writableState;
    const rState = stream._readableState;
    const state = wState || rState;
    return !!(stream.destroyed || state?.destroyed);
}
function isWritableEnded(stream) {
    if (!isWritableNodeStream(stream)) return null;
    if (stream.writableEnded === true) return true;
    const wState = stream._writableState;
    if (wState?.errored) return false;
    if (typeof wState?.ended !== "boolean") return null;
    return wState.ended;
}
function isReadableFinished(stream, strict) {
    if (!isReadableNodeStream(stream)) return null;
    const rState = stream._readableState;
    if (rState?.errored) return false;
    if (typeof rState?.endEmitted !== "boolean") return null;
    return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
}
function isDisturbed(stream) {
    return !!(stream && (stream.readableDidRead || stream.readableAborted || stream[kIsDisturbed]));
}
function isReadable1(stream) {
    const r = isReadableNodeStream(stream);
    if (r === null || typeof stream?.readable !== "boolean") return null;
    if (isDestroyed(stream)) return false;
    return r && stream.readable && !isReadableFinished(stream);
}
function isWritable1(stream) {
    const r = isWritableNodeStream(stream);
    if (r === null || typeof stream?.writable !== "boolean") return null;
    if (isDestroyed(stream)) return false;
    return r && stream.writable && !isWritableEnded(stream);
}
function isBlob(object) {
    return object instanceof Blob;
}
Object.setPrototypeOf(Duplex.prototype, Readable.prototype);
Object.setPrototypeOf(Duplex, Readable);
{
    for (const method of Object.keys(Writable.prototype)){
        if (!Duplex.prototype[method]) {
            Duplex.prototype[method] = Writable.prototype[method];
        }
    }
}function Duplex(options) {
    if (!(this instanceof Duplex)) {
        return new Duplex(options);
    }
    Readable.call(this, options);
    Writable.call(this, options);
    this.allowHalfOpen = true;
    if (options) {
        if (options.readable === false) {
            this.readable = false;
        }
        if (options.writable === false) {
            this.writable = false;
        }
        if (options.allowHalfOpen === false) {
            this.allowHalfOpen = false;
        }
    }
}
Object.defineProperties(Duplex.prototype, {
    writable: Object.getOwnPropertyDescriptor(Writable.prototype, "writable"),
    writableHighWaterMark: Object.getOwnPropertyDescriptor(Writable.prototype, "writableHighWaterMark"),
    writableObjectMode: Object.getOwnPropertyDescriptor(Writable.prototype, "writableObjectMode"),
    writableBuffer: Object.getOwnPropertyDescriptor(Writable.prototype, "writableBuffer"),
    writableLength: Object.getOwnPropertyDescriptor(Writable.prototype, "writableLength"),
    writableFinished: Object.getOwnPropertyDescriptor(Writable.prototype, "writableFinished"),
    writableCorked: Object.getOwnPropertyDescriptor(Writable.prototype, "writableCorked"),
    writableEnded: Object.getOwnPropertyDescriptor(Writable.prototype, "writableEnded"),
    writableNeedDrain: Object.getOwnPropertyDescriptor(Writable.prototype, "writableNeedDrain"),
    destroyed: {
        get () {
            if (this._readableState === undefined || this._writableState === undefined) {
                return false;
            }
            return this._readableState.destroyed && this._writableState.destroyed;
        },
        set (value) {
            if (this._readableState && this._writableState) {
                this._readableState.destroyed = value;
                this._writableState.destroyed = value;
            }
        }
    }
});
class Duplexify extends Duplex {
    constructor(options){
        super(options);
        if (options?.readable === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
        }
        if (options?.writable === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
        }
    }
}
function duplexify(body, name) {
    if (isDuplexNodeStream(body)) {
        return body;
    }
    if (isReadableNodeStream(body)) {
        return _duplexify({
            readable: body
        });
    }
    if (isWritableNodeStream(body)) {
        return _duplexify({
            writable: body
        });
    }
    if (isNodeStream(body)) {
        return _duplexify({
            writable: false,
            readable: false
        });
    }
    if (typeof body === "function") {
        const { value , write , final: __final1 , destroy: destroy2  } = fromAsyncGen(body);
        if (isIterable(value)) {
            return _from1(Duplexify, value, {
                objectMode: true,
                write,
                final: __final1,
                destroy: destroy2
            });
        }
        const then = value?.then;
        if (typeof then === "function") {
            let d;
            const promise = then.call(value, (val)=>{
                if (val != null) {
                    throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
                }
            }, (err)=>{
                destroyer(d, err);
            });
            return d = new Duplexify({
                objectMode: true,
                readable: false,
                write,
                final (cb) {
                    __final1(async ()=>{
                        try {
                            await promise;
                            nextTick1(cb, null);
                        } catch (err) {
                            nextTick1(cb, err);
                        }
                    });
                },
                destroy: destroy2
            });
        }
        throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
    }
    if (isBlob(body)) {
        return duplexify(body.arrayBuffer());
    }
    if (isIterable(body)) {
        return _from1(Duplexify, body, {
            objectMode: true,
            writable: false
        });
    }
    if (typeof body?.writable === "object" || typeof body?.readable === "object") {
        const readable = body?.readable ? isReadableNodeStream(body?.readable) ? body?.readable : duplexify(body.readable) : undefined;
        const writable = body?.writable ? isWritableNodeStream(body?.writable) ? body?.writable : duplexify(body.writable) : undefined;
        return _duplexify({
            readable,
            writable
        });
    }
    const then = body?.then;
    if (typeof then === "function") {
        let d;
        then.call(body, (val)=>{
            if (val != null) {
                d.push(val);
            }
            d.push(null);
        }, (err)=>{
            destroyer(d, err);
        });
        return d = new Duplexify({
            objectMode: true,
            writable: false,
            read () {
            }
        });
    }
    throw new ERR_INVALID_ARG_TYPE(name, [
        "Blob",
        "ReadableStream",
        "WritableStream",
        "Stream",
        "Iterable",
        "AsyncIterable",
        "Function",
        "{ readable, writable } pair",
        "Promise", 
    ], body);
}
function fromAsyncGen(fn) {
    let { promise , resolve: resolve13  } = createDeferredPromise();
    const ac = new AbortController();
    const signal = ac.signal;
    const value = fn(async function*() {
        while(true){
            const _promise = promise;
            promise = null;
            const { chunk , done , cb  } = await _promise;
            nextTick2(cb);
            if (done) return;
            if (signal.aborted) throw new AbortError();
            ({ promise , resolve: resolve13  } = createDeferredPromise());
            yield chunk;
        }
    }(), {
        signal
    });
    return {
        value,
        write (chunk, encoding, cb) {
            const _resolve = resolve13;
            resolve13 = null;
            _resolve({
                chunk,
                done: false,
                cb
            });
        },
        final (cb) {
            const _resolve = resolve13;
            resolve13 = null;
            _resolve({
                done: true,
                cb
            });
        },
        destroy (err, cb) {
            ac.abort();
            cb(err);
        }
    };
}
function _duplexify(pair) {
    const r = pair.readable && typeof pair.readable.read !== "function" ? Readable.wrap(pair.readable) : pair.readable;
    const w = pair.writable;
    let readable = !!isReadable1(r);
    let writable = !!isWritable1(w);
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
            cb(err);
        } else if (err) {
            d.destroy(err);
        } else if (!readable && !writable) {
            d.destroy();
        }
    }
    d = new Duplexify({
        readableObjectMode: !!r?.readableObjectMode,
        writableObjectMode: !!w?.writableObjectMode,
        readable,
        writable
    });
    if (writable) {
        eos(w, (err)=>{
            writable = false;
            if (err) {
                destroyer(r, err);
            }
            onfinished(err);
        });
        d._write = function(chunk, encoding, callback) {
            if (w.write(chunk, encoding)) {
                callback();
            } else {
                ondrain = callback;
            }
        };
        d._final = function(callback) {
            w.end();
            onfinish = callback;
        };
        w.on("drain", function() {
            if (ondrain) {
                const cb = ondrain;
                ondrain = null;
                cb();
            }
        });
        w.on("finish", function() {
            if (onfinish) {
                const cb = onfinish;
                onfinish = null;
                cb();
            }
        });
    }
    if (readable) {
        eos(r, (err)=>{
            readable = false;
            if (err) {
                destroyer(r, err);
            }
            onfinished(err);
        });
        r.on("readable", function() {
            if (onreadable) {
                const cb = onreadable;
                onreadable = null;
                cb();
            }
        });
        r.on("end", function() {
            d.push(null);
        });
        d._read = function() {
            while(true){
                const buf = r.read();
                if (buf === null) {
                    onreadable = d._read;
                    return;
                }
                if (!d.push(buf)) {
                    return;
                }
            }
        };
    }
    d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
            err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
            callback(err);
        } else {
            onclose = callback;
            destroyer(w, err);
            destroyer(r, err);
        }
    };
    return d;
}
function duplexFrom(body) {
    return duplexify(body, "body");
}
Duplex.from = duplexFrom;
Object.setPrototypeOf(Transform.prototype, Duplex.prototype);
Object.setPrototypeOf(Transform, Duplex);
const kCallback = Symbol("kCallback");
function Transform(options) {
    if (!(this instanceof Transform)) {
        return new Transform(options);
    }
    Duplex.call(this, options);
    this._readableState.sync = false;
    this[kCallback] = null;
    if (options) {
        if (typeof options.transform === "function") {
            this._transform = options.transform;
        }
        if (typeof options.flush === "function") {
            this._flush = options.flush;
        }
    }
    this.on("prefinish", prefinish1);
}
function __final(cb) {
    let called = false;
    if (typeof this._flush === "function" && !this.destroyed) {
        const result = this._flush((er, data)=>{
            called = true;
            if (er) {
                if (cb) {
                    cb(er);
                } else {
                    this.destroy(er);
                }
                return;
            }
            if (data != null) {
                this.push(data);
            }
            this.push(null);
            if (cb) {
                cb();
            }
        });
        if (result !== undefined && result !== null) {
            try {
                const then = result.then;
                if (typeof then === "function") {
                    then.call(result, (data)=>{
                        if (called) {
                            return;
                        }
                        if (data != null) {
                            this.push(data);
                        }
                        this.push(null);
                        if (cb) {
                            nextTick2(cb);
                        }
                    }, (err)=>{
                        if (cb) {
                            nextTick2(cb, err);
                        } else {
                            nextTick2(()=>this.destroy(err)
                            );
                        }
                    });
                }
            } catch (err) {
                nextTick2(()=>this.destroy(err)
                );
            }
        }
    } else {
        this.push(null);
        if (cb) {
            cb();
        }
    }
}
function prefinish1() {
    if (this._final !== __final) {
        __final.call(this);
    }
}
Transform.prototype._final = __final;
Transform.prototype._transform = function(chunk, encoding, callback) {
    throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
};
Transform.prototype._write = function(chunk, encoding, callback) {
    const rState = this._readableState;
    const wState = this._writableState;
    const length = rState.length;
    let called = false;
    const result = this._transform(chunk, encoding, (err, val)=>{
        called = true;
        if (err) {
            callback(err);
            return;
        }
        if (val != null) {
            this.push(val);
        }
        if (wState.ended || length === rState.length || rState.length < rState.highWaterMark || rState.length === 0) {
            callback();
        } else {
            this[kCallback] = callback;
        }
    });
    if (result !== undefined && result != null) {
        try {
            const then = result.then;
            if (typeof then === "function") {
                then.call(result, (val)=>{
                    if (called) {
                        return;
                    }
                    if (val != null) {
                        this.push(val);
                    }
                    if (wState.ended || length === rState.length || rState.length < rState.highWaterMark || rState.length === 0) {
                        nextTick1(callback);
                    } else {
                        this[kCallback] = callback;
                    }
                }, (err)=>{
                    nextTick1(callback, err);
                });
            }
        } catch (err) {
            nextTick1(callback, err);
        }
    }
};
Transform.prototype._read = function() {
    if (this[kCallback]) {
        const callback = this[kCallback];
        this[kCallback] = null;
        callback();
    }
};
Object.setPrototypeOf(PassThrough.prototype, Transform.prototype);
Object.setPrototypeOf(PassThrough, Transform);
function PassThrough(options) {
    if (!(this instanceof PassThrough)) {
        return new PassThrough(options);
    }
    Transform.call(this, options);
}
PassThrough.prototype._transform = function(chunk, encoding, cb) {
    cb(null, chunk);
};
function destroyer1(stream, reading, writing, callback) {
    callback = once(callback);
    let finished2 = false;
    stream.on("close", ()=>{
        finished2 = true;
    });
    eos(stream, {
        readable: reading,
        writable: writing
    }, (err)=>{
        finished2 = !err;
        const rState = stream._readableState;
        if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && reading && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
            stream.once("end", callback).once("error", callback);
        } else {
            callback(err);
        }
    });
    return (err)=>{
        if (finished2) return;
        finished2 = true;
        __default4.destroyer(stream, err);
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
    };
}
function popCallback(streams) {
    validateCallback(streams[streams.length - 1]);
    return streams.pop();
}
function makeAsyncIterable(val) {
    if (isIterable(val)) {
        return val;
    } else if (isReadableNodeStream(val)) {
        return fromReadable(val);
    }
    throw new ERR_INVALID_ARG_TYPE("val", [
        "Readable",
        "Iterable",
        "AsyncIterable"
    ], val);
}
async function* fromReadable(val) {
    yield* Readable.prototype[Symbol.asyncIterator].call(val);
}
async function pump(iterable, writable, finish1) {
    let error;
    let onresolve = null;
    const resume1 = (err)=>{
        if (err) {
            error = err;
        }
        if (onresolve) {
            const callback = onresolve;
            onresolve = null;
            callback();
        }
    };
    const wait = ()=>new Promise((resolve14, reject)=>{
            if (error) {
                reject(error);
            } else {
                onresolve = ()=>{
                    if (error) {
                        reject(error);
                    } else {
                        resolve14();
                    }
                };
            }
        })
    ;
    writable.on("drain", resume1);
    const cleanup = eos(writable, {
        readable: false
    }, resume1);
    try {
        if (writable.writableNeedDrain) {
            await wait();
        }
        for await (const chunk of iterable){
            if (!writable.write(chunk)) {
                await wait();
            }
        }
        writable.end();
        await wait();
        finish1();
    } catch (err) {
        finish1(error !== err ? aggregateTwoErrors(error, err) : err);
    } finally{
        cleanup();
        writable.off("drain", resume1);
    }
}
function pipeline(...streams) {
    const callback = once(popCallback(streams));
    if (Array.isArray(streams[0]) && streams.length === 1) {
        streams = streams[0];
    }
    return pipelineImpl(streams, callback);
}
function pipelineImpl(streams, callback, opts) {
    if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
    }
    const ac = new AbortController();
    const signal = ac.signal;
    const outerSignal = opts?.signal;
    validateAbortSignal(outerSignal, "options.signal");
    function abort() {
        finishImpl(new AbortError());
    }
    outerSignal?.addEventListener("abort", abort);
    let error;
    let value;
    const destroys = [];
    let finishCount = 0;
    function finish2(err) {
        finishImpl(err, --finishCount === 0);
    }
    function finishImpl(err, __final2) {
        if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
            error = err;
        }
        if (!error && !__final2) {
            return;
        }
        while(destroys.length){
            destroys.shift()(error);
        }
        outerSignal?.removeEventListener("abort", abort);
        ac.abort();
        if (__final2) {
            callback(error, value);
        }
    }
    let ret;
    for(let i = 0; i < streams.length; i++){
        const stream = streams[i];
        const reading = i < streams.length - 1;
        const writing = i > 0;
        if (isNodeStream(stream)) {
            finishCount++;
            destroys.push(destroyer1(stream, reading, writing, finish2));
        }
        if (i === 0) {
            if (typeof stream === "function") {
                ret = stream({
                    signal
                });
                if (!isIterable(ret)) {
                    throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
                }
            } else if (isIterable(stream) || isReadableNodeStream(stream)) {
                ret = stream;
            } else {
                ret = Duplex.from(stream);
            }
        } else if (typeof stream === "function") {
            ret = makeAsyncIterable(ret);
            ret = stream(ret, {
                signal
            });
            if (reading) {
                if (!isIterable(ret, true)) {
                    throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
                }
            } else {
                const pt = new PassThrough({
                    objectMode: true
                });
                const then = ret?.then;
                if (typeof then === "function") {
                    then.call(ret, (val)=>{
                        value = val;
                        pt.end(val);
                    }, (err)=>{
                        pt.destroy(err);
                    });
                } else if (isIterable(ret, true)) {
                    finishCount++;
                    pump(ret, pt, finish2);
                } else {
                    throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
                }
                ret = pt;
                finishCount++;
                destroys.push(destroyer1(ret, false, true, finish2));
            }
        } else if (isNodeStream(stream)) {
            if (isReadableNodeStream(ret)) {
                ret.pipe(stream);
                if (stream === stdout1 || stream === stderr1) {
                    ret.on("end", ()=>stream.end()
                    );
                }
            } else {
                ret = makeAsyncIterable(ret);
                finishCount++;
                pump(ret, stream, finish2);
            }
            ret = stream;
        } else {
            ret = Duplex.from(stream);
        }
    }
    if (signal?.aborted || outerSignal?.aborted) {
        nextTick2(abort);
    }
    return ret;
}
class ComposeDuplex extends Duplex {
    constructor(options){
        super(options);
        if (options?.readable === false) {
            this._readableState.readable = false;
            this._readableState.ended = true;
            this._readableState.endEmitted = true;
        }
        if (options?.writable === false) {
            this._writableState.writable = false;
            this._writableState.ending = true;
            this._writableState.ended = true;
            this._writableState.finished = true;
        }
    }
}
function compose(...streams) {
    if (streams.length === 0) {
        throw new ERR_MISSING_ARGS("streams");
    }
    if (streams.length === 1) {
        return Duplex.from(streams[0]);
    }
    const orgStreams = [
        ...streams
    ];
    if (typeof streams[0] === "function") {
        streams[0] = Duplex.from(streams[0]);
    }
    if (typeof streams[streams.length - 1] === "function") {
        const idx = streams.length - 1;
        streams[idx] = Duplex.from(streams[idx]);
    }
    for(let n = 0; n < streams.length; ++n){
        if (!isNodeStream(streams[n])) {
            continue;
        }
        if (n < streams.length - 1 && !isReadable1(streams[n])) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
        }
        if (n > 0 && !isWritable1(streams[n])) {
            throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
        }
    }
    let ondrain;
    let onfinish;
    let onreadable;
    let onclose;
    let d;
    function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
            cb(err);
        } else if (err) {
            d.destroy(err);
        } else if (!readable && !writable) {
            d.destroy();
        }
    }
    const head = streams[0];
    const tail = pipeline(streams, onfinished);
    const writable = !!isWritable1(head);
    const readable = !!isReadable1(tail);
    d = new ComposeDuplex({
        writableObjectMode: !!head?.writableObjectMode,
        readableObjectMode: !!tail?.writableObjectMode,
        writable,
        readable
    });
    if (writable) {
        d._write = function(chunk, encoding, callback) {
            if (head.write(chunk, encoding)) {
                callback();
            } else {
                ondrain = callback;
            }
        };
        d._final = function(callback) {
            head.end();
            onfinish = callback;
        };
        head.on("drain", function() {
            if (ondrain) {
                const cb = ondrain;
                ondrain = null;
                cb();
            }
        });
        tail.on("finish", function() {
            if (onfinish) {
                const cb = onfinish;
                onfinish = null;
                cb();
            }
        });
    }
    if (readable) {
        tail.on("readable", function() {
            if (onreadable) {
                const cb = onreadable;
                onreadable = null;
                cb();
            }
        });
        tail.on("end", function() {
            d.push(null);
        });
        d._read = function() {
            while(true){
                const buf = tail.read();
                if (buf === null) {
                    onreadable = d._read;
                    return;
                }
                if (!d.push(buf)) {
                    return;
                }
            }
        };
    }
    d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
            err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
            callback(err);
        } else {
            onclose = callback;
            destroyer(tail, err);
        }
    };
    return d;
}
function pipeline1(...streams) {
    return new Promise((resolve15, reject)=>{
        let signal;
        let end;
        const lastArg = streams[streams.length - 1];
        if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg)) {
            const options = streams.pop();
            signal = options.signal;
            end = options.end;
        }
        pipelineImpl(streams, (err, value)=>{
            if (err) {
                reject(err);
            } else {
                resolve15(value);
            }
        }, {
            signal,
            end
        });
    });
}
function finished(stream, opts) {
    return new Promise((resolve16, reject)=>{
        eos(stream, opts, (err)=>{
            if (err) {
                reject(err);
            } else {
                resolve16();
            }
        });
    });
}
const __default5 = {
    finished,
    pipeline: pipeline1
};
const { custom: customPromisify  } = promisify1;
Stream.isDisturbed = isDisturbed;
Stream.Readable = Readable;
Stream.Writable = Writable;
Stream.Duplex = Duplex;
Stream.Transform = Transform;
Stream.PassThrough = PassThrough;
Stream.pipeline = pipeline;
Stream.addAbortSignal = addAbortSignal;
Stream.finished = eos;
Stream.destroy = destroyer;
Stream.compose = compose;
Object.defineProperty(Stream, "promises", {
    configurable: true,
    enumerable: true,
    get () {
        return __default5;
    }
});
Object.defineProperty(pipeline, customPromisify, {
    enumerable: true,
    get () {
        return __default5.pipeline;
    }
});
Object.defineProperty(eos, customPromisify, {
    enumerable: true,
    get () {
        return __default5.finished;
    }
});
Stream.Stream = Stream;
Stream._isUint8Array = isUint8Array;
Stream._uint8ArrayToBuffer = _uint8ArrayToBuffer;
const stdin1 = new Readable({
    highWaterMark: 0,
    emitClose: false,
    read (size) {
        const p = Buffer1.alloc(size || 16 * 1024);
        Deno.stdin.read(p).then((length)=>{
            this.push(length === null ? null : p.slice(0, length));
        }, (error)=>{
            this.destroy(error);
        });
    }
});
stdin1.on("close", ()=>Deno.stdin.close()
);
stdin1.fd = Deno.stdin.rid;
Object.defineProperty(stdin1, "isTTY", {
    enumerable: true,
    configurable: true,
    get () {
        return Deno.isatty(Deno.stdin.rid);
    }
});
stdin1._isRawMode = false;
stdin1.setRawMode = (enable)=>{
    Deno.setRaw(Deno.stdin.rid, enable);
    stdin1._isRawMode = enable;
    return stdin1;
};
Object.defineProperty(stdin1, "isRaw", {
    enumerable: true,
    configurable: true,
    get () {
        return stdin1._isRawMode;
    }
});
function registerDestroyHook(_target, _asyncId, _prop) {
}
var constants;
(function(constants3) {
    constants3[constants3["kInit"] = 0] = "kInit";
    constants3[constants3["kBefore"] = 1] = "kBefore";
    constants3[constants3["kAfter"] = 2] = "kAfter";
    constants3[constants3["kDestroy"] = 3] = "kDestroy";
    constants3[constants3["kPromiseResolve"] = 4] = "kPromiseResolve";
    constants3[constants3["kTotals"] = 5] = "kTotals";
    constants3[constants3["kCheck"] = 6] = "kCheck";
    constants3[constants3["kExecutionAsyncId"] = 7] = "kExecutionAsyncId";
    constants3[constants3["kTriggerAsyncId"] = 8] = "kTriggerAsyncId";
    constants3[constants3["kAsyncIdCounter"] = 9] = "kAsyncIdCounter";
    constants3[constants3["kDefaultTriggerAsyncId"] = 10] = "kDefaultTriggerAsyncId";
    constants3[constants3["kUsesExecutionAsyncResource"] = 11] = "kUsesExecutionAsyncResource";
    constants3[constants3["kStackLength"] = 12] = "kStackLength";
})(constants || (constants = {
}));
const asyncHookFields = new Uint32Array(Object.keys(constants).length);
function newAsyncId() {
    return ++asyncIdFields[constants.kAsyncIdCounter];
}
var UidFields;
(function(UidFields1) {
    UidFields1[UidFields1["kExecutionAsyncId"] = 0] = "kExecutionAsyncId";
    UidFields1[UidFields1["kTriggerAsyncId"] = 1] = "kTriggerAsyncId";
    UidFields1[UidFields1["kAsyncIdCounter"] = 2] = "kAsyncIdCounter";
    UidFields1[UidFields1["kDefaultTriggerAsyncId"] = 3] = "kDefaultTriggerAsyncId";
    UidFields1[UidFields1["kUidFieldsCount"] = 4] = "kUidFieldsCount";
})(UidFields || (UidFields = {
}));
const asyncIdFields = new Float64Array(Object.keys(UidFields).length);
asyncIdFields[UidFields.kAsyncIdCounter] = 1;
asyncIdFields[UidFields.kDefaultTriggerAsyncId] = -1;
var providerType;
(function(providerType1) {
    providerType1[providerType1["NONE"] = 0] = "NONE";
    providerType1[providerType1["GETADDRINFOREQWRAP"] = 1] = "GETADDRINFOREQWRAP";
    providerType1[providerType1["PIPECONNECTWRAP"] = 2] = "PIPECONNECTWRAP";
    providerType1[providerType1["PIPESERVERWRAP"] = 3] = "PIPESERVERWRAP";
    providerType1[providerType1["PIPEWRAP"] = 4] = "PIPEWRAP";
    providerType1[providerType1["SHUTDOWNWRAP"] = 5] = "SHUTDOWNWRAP";
    providerType1[providerType1["TCPCONNECTWRAP"] = 6] = "TCPCONNECTWRAP";
    providerType1[providerType1["TCPSERVERWRAP"] = 7] = "TCPSERVERWRAP";
    providerType1[providerType1["TCPWRAP"] = 8] = "TCPWRAP";
    providerType1[providerType1["WRITEWRAP"] = 9] = "WRITEWRAP";
})(providerType || (providerType = {
}));
const kInvalidAsyncId = -1;
class AsyncWrap {
    provider = providerType.NONE;
    asyncId = kInvalidAsyncId;
    constructor(provider){
        this.provider = provider;
        this.getAsyncId();
    }
    getAsyncId() {
        this.asyncId = this.asyncId === kInvalidAsyncId ? newAsyncId() : this.asyncId;
        return this.asyncId;
    }
    getProviderType() {
        return this.provider;
    }
}
const mod13 = {
    async_hook_fields: asyncHookFields,
    asyncIdFields: asyncIdFields,
    registerDestroyHook: registerDestroyHook,
    constants: constants,
    newAsyncId: newAsyncId,
    UidFields: UidFields,
    providerType: providerType,
    AsyncWrap: AsyncWrap
};
const mod14 = {
};
const v4Seg = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
const v4Str = `(${v4Seg}[.]){3}${v4Seg}`;
const IPv4Reg = new RegExp(`^${v4Str}$`);
const v6Seg = "(?:[0-9a-fA-F]{1,4})";
const IPv6Reg = new RegExp("^(" + `(?:${v6Seg}:){7}(?:${v6Seg}|:)|` + `(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|` + `(?:${v6Seg}:){5}(?::${v4Str}|(:${v6Seg}){1,2}|:)|` + `(?:${v6Seg}:){4}(?:(:${v6Seg}){0,1}:${v4Str}|(:${v6Seg}){1,3}|:)|` + `(?:${v6Seg}:){3}(?:(:${v6Seg}){0,2}:${v4Str}|(:${v6Seg}){1,4}|:)|` + `(?:${v6Seg}:){2}(?:(:${v6Seg}){0,3}:${v4Str}|(:${v6Seg}){1,5}|:)|` + `(?:${v6Seg}:){1}(?:(:${v6Seg}){0,4}:${v4Str}|(:${v6Seg}){1,6}|:)|` + `(?::((?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:))` + ")(%[0-9a-zA-Z-.:]{1,})?$");
function isIPv4(ip) {
    return RegExp.prototype.test.call(IPv4Reg, ip);
}
function isIPv6(ip) {
    return RegExp.prototype.test.call(IPv6Reg, ip);
}
function isIP(ip) {
    if (isIPv4(ip)) {
        return 4;
    }
    if (isIPv6(ip)) {
        return 6;
    }
    return 0;
}
Symbol("normalizedArgs");
const ARES_AI_CANONNAME = 1 << 0;
const ARES_AI_NUMERICHOST = 1 << 1;
const ARES_AI_PASSIVE = 1 << 2;
const ARES_AI_NUMERICSERV = 1 << 3;
const AI_V4MAPPED = 1 << 4;
const AI_ALL = 1 << 5;
const AI_ADDRCONFIG = 1 << 6;
const ARES_AI_NOSORT = 1 << 7;
const ARES_AI_ENVHOSTS = 1 << 8;
class GetAddrInfoReqWrap extends AsyncWrap {
    callback;
    family;
    hostname;
    oncomplete;
    constructor(){
        super(providerType.GETADDRINFOREQWRAP);
    }
}
function getaddrinfo(req, hostname, family, _hints, verbatim) {
    (async ()=>{
        const addresses = [];
        const recordTypes = [];
        if (family === 0 || family === 4) {
            recordTypes.push("A");
        }
        if (family === 0 || family === 6) {
            recordTypes.push("AAAA");
        }
        await Promise.allSettled(recordTypes.map((recordType)=>Deno.resolveDns(hostname, recordType).then((records)=>{
                records.forEach((record)=>addresses.push(record)
                );
            })
        ));
        const error = addresses.length ? null : codeMap.get("EAI_NODATA");
        if (!verbatim) {
            addresses.sort((a, b)=>{
                if (isIPv4(a)) {
                    return -1;
                } else if (isIPv4(b)) {
                    return 1;
                }
                return 0;
            });
        }
        req.oncomplete(error, addresses);
    })();
}
const mod15 = {
    ARES_AI_CANONNAME: ARES_AI_CANONNAME,
    ARES_AI_NUMERICHOST: ARES_AI_NUMERICHOST,
    ARES_AI_PASSIVE: ARES_AI_PASSIVE,
    ARES_AI_NUMERICSERV: ARES_AI_NUMERICSERV,
    AI_V4MAPPED: AI_V4MAPPED,
    AI_ALL: AI_ALL,
    AI_ADDRCONFIG: AI_ADDRCONFIG,
    ARES_AI_NOSORT: ARES_AI_NOSORT,
    ARES_AI_ENVHOSTS: ARES_AI_ENVHOSTS,
    GetAddrInfoReqWrap: GetAddrInfoReqWrap,
    getaddrinfo: getaddrinfo
};
const mod16 = {
};
const mod17 = {
};
const mod18 = {
};
const mod19 = {
};
const mod20 = {
};
const mod21 = {
};
const mod22 = {
};
const mod23 = {
};
const mod24 = {
};
const mod25 = {
};
const mod26 = {
};
const mod27 = {
};
const mod28 = {
};
const mod29 = {
};
const mod30 = {
};
const mod31 = {
};
const mod32 = {
};
const mod33 = {
};
class HandleWrap extends AsyncWrap {
    constructor(provider){
        super(provider);
    }
    async close(cb = ()=>{
    }) {
        await this._onClose();
        nextTick2(cb);
    }
    ref() {
        notImplemented1();
    }
    unref() {
        notImplemented1();
    }
    async _onClose() {
    }
}
BigInt(Number.MAX_SAFE_INTEGER);
var StreamBaseStateFields;
(function(StreamBaseStateFields1) {
    StreamBaseStateFields1[StreamBaseStateFields1["kReadBytesOrError"] = 0] = "kReadBytesOrError";
    StreamBaseStateFields1[StreamBaseStateFields1["kArrayBufferOffset"] = 1] = "kArrayBufferOffset";
    StreamBaseStateFields1[StreamBaseStateFields1["kBytesWritten"] = 2] = "kBytesWritten";
    StreamBaseStateFields1[StreamBaseStateFields1["kLastWriteWasAsync"] = 3] = "kLastWriteWasAsync";
    StreamBaseStateFields1[StreamBaseStateFields1["kNumStreamBaseStateFields"] = 4] = "kNumStreamBaseStateFields";
})(StreamBaseStateFields || (StreamBaseStateFields = {
}));
const kReadBytesOrError = StreamBaseStateFields.kReadBytesOrError;
const kArrayBufferOffset = StreamBaseStateFields.kArrayBufferOffset;
const kBytesWritten = StreamBaseStateFields.kBytesWritten;
const kLastWriteWasAsync = StreamBaseStateFields.kLastWriteWasAsync;
const kNumStreamBaseStateFields = StreamBaseStateFields.kNumStreamBaseStateFields;
const streamBaseState = new Uint8Array(5);
streamBaseState[kLastWriteWasAsync] = 1;
class WriteWrap extends AsyncWrap {
    handle;
    oncomplete;
    async;
    bytes;
    buffer;
    callback;
    _chunks;
    constructor(){
        super(providerType.WRITEWRAP);
    }
}
class ShutdownWrap extends AsyncWrap {
    handle;
    oncomplete;
    callback;
    constructor(){
        super(providerType.SHUTDOWNWRAP);
    }
}
const kStreamBaseField = Symbol("kStreamBaseField");
const SUGGESTED_SIZE = 64 * 1024;
class LibuvStreamWrap extends HandleWrap {
    [kStreamBaseField];
    reading;
    #reading = false;
    #currentReads = new Set();
    #currentWrites = new Set();
    destroyed = false;
    writeQueueSize = 0;
    bytesRead = 0;
    bytesWritten = 0;
    onread;
    constructor(provider, stream){
        super(provider);
        this.#attachToObject(stream);
    }
    readStart() {
        if (!this.#reading) {
            this.#reading = true;
            const readPromise = this.#read();
            this.#currentReads.add(readPromise);
            readPromise.then(()=>this.#currentReads.delete(readPromise)
            , ()=>this.#currentReads.delete(readPromise)
            );
        }
        return 0;
    }
    readStop() {
        this.#reading = false;
        return 0;
    }
    shutdown(req) {
        (async ()=>{
            const status = await this._onClose();
            try {
                req.oncomplete(status);
            } catch  {
            }
        })();
        return 0;
    }
    useUserBuffer(_userBuf) {
        notImplemented1();
    }
    writeBuffer(req, data) {
        const currentWrite = this.#write(req, data);
        this.#currentWrites.add(currentWrite);
        currentWrite.then(()=>this.#currentWrites.delete(currentWrite)
        , ()=>this.#currentWrites.delete(currentWrite)
        );
        return 0;
    }
    writev(_req, _chunks, _allBuffers) {
        notImplemented1();
    }
    writeAsciiString(req, data) {
        const buffer = new TextEncoder().encode(data);
        return this.writeBuffer(req, buffer);
    }
    writeUtf8String(req, data) {
        const buffer = new TextEncoder().encode(data);
        return this.writeBuffer(req, buffer);
    }
    writeUcs2String(_req, _data) {
        notImplemented1();
    }
    writeLatin1String(req, data) {
        const buffer = Buffer1.from(data, "latin1");
        return this.writeBuffer(req, buffer);
    }
    async _onClose() {
        let status = 0;
        this.#reading = false;
        try {
            this[kStreamBaseField]?.close();
        } catch  {
            status = codeMap.get("ENOTCONN");
        }
        await Promise.allSettled(this.#currentWrites);
        await Promise.allSettled(this.#currentReads);
        return status;
    }
     #attachToObject(stream) {
        this[kStreamBaseField] = stream;
    }
    async #read() {
        let buf = new Uint8Array(SUGGESTED_SIZE);
        let nread;
        try {
            nread = await this[kStreamBaseField].read(buf);
        } catch (e) {
            if (e instanceof Deno.errors.Interrupted || e instanceof Deno.errors.BadResource) {
                nread = codeMap.get("EOF");
            } else {
                nread = codeMap.get("UNKNOWN");
            }
            buf = new Uint8Array(0);
        }
        nread ??= codeMap.get("EOF");
        streamBaseState[kReadBytesOrError] = nread;
        if (nread > 0) {
            this.bytesRead += nread;
        }
        buf = buf.slice(0, nread);
        streamBaseState[kArrayBufferOffset] = 0;
        try {
            this.onread(buf, nread);
        } catch  {
        }
        if (nread >= 0 && this.#reading) {
            const readPromise = this.#read();
            this.#currentReads.add(readPromise);
            readPromise.then(()=>this.#currentReads.delete(readPromise)
            , ()=>this.#currentReads.delete(readPromise)
            );
        }
    }
    async #write(req, data) {
        const { byteLength  } = data;
        try {
            await writeAll(this[kStreamBaseField], data);
        } catch  {
            const status = codeMap.get("UNKNOWN");
            try {
                req.oncomplete(status);
            } catch  {
            }
            return;
        }
        streamBaseState[kBytesWritten] = byteLength;
        this.bytesWritten += byteLength;
        try {
            req.oncomplete(0);
        } catch  {
        }
        return;
    }
}
const mod34 = {
    kReadBytesOrError: kReadBytesOrError,
    kArrayBufferOffset: kArrayBufferOffset,
    kBytesWritten: kBytesWritten,
    kLastWriteWasAsync: kLastWriteWasAsync,
    kNumStreamBaseStateFields: kNumStreamBaseStateFields,
    streamBaseState: streamBaseState,
    WriteWrap: WriteWrap,
    ShutdownWrap: ShutdownWrap,
    kStreamBaseField: kStreamBaseField,
    LibuvStreamWrap: LibuvStreamWrap
};
class ConnectionWrap extends LibuvStreamWrap {
    onconnection = null;
    constructor(provider, object){
        super(provider, object);
    }
    afterConnect(req1, status) {
        const isSuccessStatus = !status;
        const readable = isSuccessStatus;
        const writable = isSuccessStatus;
        try {
            req1.oncomplete(status, this, req1, readable, writable);
        } catch  {
        }
        return;
    }
}
var socketType;
(function(socketType2) {
    socketType2[socketType2["SOCKET"] = 0] = "SOCKET";
    socketType2[socketType2["SERVER"] = 1] = "SERVER";
    socketType2[socketType2["IPC"] = 2] = "IPC";
})(socketType || (socketType = {
}));
class Pipe extends ConnectionWrap {
    reading = false;
    ipc;
    constructor(type){
        let provider;
        let ipc;
        switch(type){
            case socketType.SOCKET:
                {
                    provider = providerType.PIPEWRAP;
                    ipc = false;
                    break;
                }
            case socketType.SERVER:
                {
                    provider = providerType.PIPESERVERWRAP;
                    ipc = false;
                    break;
                }
            case socketType.IPC:
                {
                    provider = providerType.PIPEWRAP;
                    ipc = true;
                    break;
                }
            default:
                {
                    unreachable();
                }
        }
        super(provider);
        this.ipc = ipc;
    }
    bind() {
        notImplemented1();
    }
    listen() {
        notImplemented1();
    }
    connect(_req, _address, _afterConnect) {
        notImplemented1();
    }
    open(_fd) {
        notImplemented1();
    }
    setPendingInstances(_instances) {
        notImplemented1();
    }
    fchmod() {
        notImplemented1();
    }
}
class PipeConnectWrap extends AsyncWrap {
    oncomplete;
    address;
    constructor(){
        super(providerType.PIPECONNECTWRAP);
    }
}
var constants1;
(function(constants4) {
    constants4[constants4["SOCKET"] = socketType.SOCKET] = "SOCKET";
    constants4[constants4["SERVER"] = socketType.SERVER] = "SERVER";
    constants4[constants4["IPC"] = socketType.IPC] = "IPC";
    constants4[constants4["UV_READABLE"] = 0] = "UV_READABLE";
    constants4[constants4["UV_WRITABLE"] = 1] = "UV_WRITABLE";
})(constants1 || (constants1 = {
}));
const mod35 = {
    socketType: socketType,
    Pipe: Pipe,
    PipeConnectWrap: PipeConnectWrap,
    constants: constants1
};
const mod36 = {
};
const mod37 = {
};
const mod38 = {
};
const mod39 = {
};
const mod40 = {
};
const mod41 = {
};
const asyncIdSymbol = Symbol("asyncIdSymbol");
const ownerSymbol = Symbol("ownerSymbol");
const mod42 = {
    asyncIdSymbol: asyncIdSymbol,
    ownerSymbol: ownerSymbol
};
const mod43 = {
};
var socketType1;
(function(socketType3) {
    socketType3[socketType3["SOCKET"] = 0] = "SOCKET";
    socketType3[socketType3["SERVER"] = 1] = "SERVER";
})(socketType1 || (socketType1 = {
}));
const INITIAL_ACCEPT_BACKOFF_DELAY = 5;
const MAX_ACCEPT_BACKOFF_DELAY = 1000;
function _ceilPowOf2(n) {
    const roundPowOf2 = 1 << 31 - Math.clz32(n);
    return roundPowOf2 < n ? roundPowOf2 * 2 : roundPowOf2;
}
class TCPConnectWrap extends AsyncWrap {
    oncomplete;
    address;
    port;
    localAddress;
    localPort;
    constructor(){
        super(providerType.TCPCONNECTWRAP);
    }
}
var constants2;
(function(constants5) {
    constants5[constants5["SOCKET"] = socketType1.SOCKET] = "SOCKET";
    constants5[constants5["SERVER"] = socketType1.SERVER] = "SERVER";
    constants5[constants5["UV_TCP_IPV6ONLY"] = 0] = "UV_TCP_IPV6ONLY";
})(constants2 || (constants2 = {
}));
class TCP extends ConnectionWrap {
    [ownerSymbol] = null;
    reading = false;
    #address;
    #port;
    #remoteAddress;
    #remoteFamily;
    #remotePort;
    #backlog;
    #listener;
    #connections = 0;
    #closed = false;
    #acceptBackoffDelay;
    constructor(type, conn){
        let provider;
        switch(type){
            case socketType1.SOCKET:
                {
                    provider = providerType.TCPWRAP;
                    break;
                }
            case socketType1.SERVER:
                {
                    provider = providerType.TCPSERVERWRAP;
                    break;
                }
            default:
                {
                    unreachable();
                }
        }
        super(provider, conn);
        if (conn && provider === providerType.TCPWRAP) {
            const localAddr = conn.localAddr;
            this.#address = localAddr.hostname;
            this.#port = localAddr.port;
            const remoteAddr = conn.remoteAddr;
            this.#remoteAddress = remoteAddr.hostname;
            this.#remotePort = remoteAddr.port;
            this.#remoteFamily = isIP(remoteAddr.hostname) === 6 ? "IPv6" : "IPv4";
        }
    }
    open(_fd) {
        notImplemented1();
    }
    bind(address, port) {
        return this.#bind(address, port, 0);
    }
    bind6(address, port, flags) {
        return this.#bind(address, port, flags);
    }
    connect(req2, address, port) {
        return this.#connect(req2, address, port);
    }
    connect6(req3, address, port) {
        return this.#connect(req3, address, port);
    }
    listen(backlog) {
        this.#backlog = _ceilPowOf2(backlog + 1);
        const listenOptions = {
            hostname: this.#address,
            port: this.#port,
            transport: "tcp"
        };
        let listener;
        try {
            listener = Deno.listen(listenOptions);
        } catch (e) {
            if (e instanceof Deno.errors.AddrInUse) {
                return codeMap.get("EADDRINUSE");
            } else if (e instanceof Deno.errors.AddrNotAvailable) {
                return codeMap.get("EADDRNOTAVAIL");
            }
            return codeMap.get("UNKNOWN");
        }
        const address = listener.addr;
        this.#address = address.hostname;
        this.#port = address.port;
        this.#listener = listener;
        this.#accept();
        return 0;
    }
    getsockname(sockname) {
        if (typeof this.#address === "undefined" || typeof this.#port === "undefined") {
            return codeMap.get("EADDRNOTAVAIL");
        }
        sockname.address = this.#address;
        sockname.port = this.#port;
        sockname.family = isIP(this.#address) === 6 ? "IPv6" : "IPv4";
        return 0;
    }
    getpeername(peername) {
        if (typeof this.#remoteAddress === "undefined" || typeof this.#remotePort === "undefined") {
            return codeMap.get("EADDRNOTAVAIL");
        }
        peername.address = this.#remoteAddress;
        peername.port = this.#remotePort;
        peername.family = this.#remoteFamily;
        return 0;
    }
    setNoDelay(_noDelay) {
        notImplemented1();
    }
    setKeepAlive(_enable, _initialDelay) {
        notImplemented1();
    }
    setSimultaneousAccepts(_enable) {
        notImplemented1();
    }
     #bind(address, port, _flags) {
        this.#address = address;
        this.#port = port;
        return 0;
    }
     #connect(req4, address1, port1) {
        this.#remoteAddress = address1;
        this.#remotePort = port1;
        this.#remoteFamily = isIP(address1) === 6 ? "IPv6" : "IPv4";
        const connectOptions = {
            hostname: address1,
            port: port1,
            transport: "tcp"
        };
        Deno.connect(connectOptions).then((conn)=>{
            const localAddr = conn.localAddr;
            this.#address = req4.localAddress = localAddr.hostname;
            this.#port = req4.localPort = localAddr.port;
            this[kStreamBaseField] = conn;
            try {
                this.afterConnect(req4, 0);
            } catch  {
            }
        }, ()=>{
            try {
                this.afterConnect(req4, codeMap.get("ECONNREFUSED"));
            } catch  {
            }
        });
        return 0;
    }
    async #acceptBackoff() {
        if (!this.#acceptBackoffDelay) {
            this.#acceptBackoffDelay = INITIAL_ACCEPT_BACKOFF_DELAY;
        } else {
            this.#acceptBackoffDelay *= 2;
        }
        if (this.#acceptBackoffDelay >= 1000) {
            this.#acceptBackoffDelay = MAX_ACCEPT_BACKOFF_DELAY;
        }
        await delay(this.#acceptBackoffDelay);
        this.#accept();
    }
    async #accept() {
        if (this.#closed) {
            return;
        }
        if (this.#connections > this.#backlog) {
            this.#acceptBackoff();
            return;
        }
        let connection;
        try {
            connection = await this.#listener.accept();
        } catch (e) {
            if (e instanceof Deno.errors.BadResource && this.#closed) {
                return;
            }
            try {
                this.onconnection(codeMap.get("UNKNOWN"), undefined);
            } catch  {
            }
            this.#acceptBackoff();
            return;
        }
        this.#acceptBackoffDelay = undefined;
        const connectionHandle = new TCP(socketType1.SOCKET, connection);
        this.#connections++;
        try {
            this.onconnection(0, connectionHandle);
        } catch  {
        }
        return this.#accept();
    }
    async _onClose() {
        this.#closed = true;
        this.reading = false;
        this.#address = undefined;
        this.#port = undefined;
        this.#remoteAddress = undefined;
        this.#remoteFamily = undefined;
        this.#remotePort = undefined;
        this.#backlog = undefined;
        this.#connections = 0;
        this.#acceptBackoffDelay = undefined;
        if (this.provider === providerType.TCPSERVERWRAP) {
            try {
                this.#listener.close();
            } catch  {
            }
        }
        return await LibuvStreamWrap.prototype._onClose.call(this);
    }
}
const mod44 = {
    TCPConnectWrap: TCPConnectWrap,
    constants: constants2,
    TCP: TCP
};
const mod45 = {
};
const mod46 = {
};
const mod47 = {
};
const mod48 = {
};
const mod49 = {
};
const mod50 = {
};
const mod51 = {
};
const mod52 = {
};
const mod53 = {
};
const modules = {
    "async_wrap": mod13,
    buffer: mod10,
    "cares_wrap": mod15,
    config: mod14,
    constants: mod12,
    contextify: mod16,
    credentials: mod18,
    crypto: mod17,
    errors: mod19,
    fs: mod20,
    "fs_dir": mod21,
    "fs_event_wrap": mod22,
    "heap_utils": mod23,
    "http_parser": mod24,
    icu: mod25,
    inspector: mod26,
    "js_stream": mod27,
    messaging: mod28,
    "module_wrap": mod29,
    "native_module": mod30,
    natives: mod31,
    options: mod32,
    os: mod33,
    performance: mod36,
    "pipe_wrap": mod35,
    "process_methods": mod37,
    report: mod38,
    serdes: mod39,
    "signal_wrap": mod40,
    "spawn_sync": mod41,
    "stream_wrap": mod34,
    "string_decoder": mod9,
    symbols: mod42,
    "task_queue": mod43,
    "tcp_wrap": mod44,
    timers: mod45,
    "tls_wrap": mod46,
    "trace_events": mod47,
    "tty_wrap": mod48,
    types: mod7,
    "udp_wrap": mod49,
    url: mod50,
    util: mod8,
    uv: mod11,
    v8: mod51,
    worker: mod52,
    zlib: mod53
};
function getBinding(name) {
    const mod56 = modules[name];
    if (!mod56) {
        throw new Error(`No such module: ${name}`);
    }
    return mod56;
}
const notImplementedEvents = [
    "beforeExit",
    "disconnect",
    "message",
    "multipleResolves",
    "rejectionHandled",
    "uncaughtException",
    "uncaughtExceptionMonitor",
    "unhandledRejection", 
];
const argv1 = [
    "",
    "",
    ...Deno.args
];
Object.defineProperty(argv1, "0", {
    get: Deno.execPath
});
Object.defineProperty(argv1, "1", {
    get: ()=>fromFileUrl5(Deno.mainModule)
});
const exit1 = (code)=>{
    if (code || code === 0) {
        process2.exitCode = code;
    }
    if (!process2._exiting) {
        process2._exiting = true;
        process2.emit("exit", process2.exitCode || 0);
    }
    Deno.exit(process2.exitCode || 0);
};
function addReadOnlyProcessAlias(name, option, enumerable = true) {
    const value = getOptionValue(option);
    if (value) {
        Object.defineProperty(process2, name, {
            writable: false,
            configurable: true,
            enumerable,
            value
        });
    }
}
function createWarningObject(warning, type, code, ctor, detail) {
    assert1(typeof warning === "string");
    const warningErr = new Error(warning);
    warningErr.name = String(type || "Warning");
    if (code !== undefined) {
        warningErr.code = code;
    }
    if (detail !== undefined) {
        warningErr.detail = detail;
    }
    Error.captureStackTrace(warningErr, ctor || process2.emitWarning);
    return warningErr;
}
function doEmitWarning(warning) {
    process2.emit("warning", warning);
}
function emitWarning1(warning, type, code, ctor) {
    let detail;
    if (type !== null && typeof type === "object" && !Array.isArray(type)) {
        ctor = type.ctor;
        code = type.code;
        if (typeof type.detail === "string") {
            detail = type.detail;
        }
        type = type.type || "Warning";
    } else if (typeof type === "function") {
        ctor = type;
        code = undefined;
        type = "Warning";
    }
    if (type !== undefined) {
        validateString(type, "type");
    }
    if (typeof code === "function") {
        ctor = code;
        code = undefined;
    } else if (code !== undefined) {
        validateString(code, "code");
    }
    if (typeof warning === "string") {
        warning = createWarningObject(warning, type, code, ctor, detail);
    } else if (!(warning instanceof Error)) {
        throw new ERR_INVALID_ARG_TYPE("warning", [
            "Error",
            "string"
        ], warning);
    }
    if (warning.name === "DeprecationWarning") {
        if (process2.noDeprecation) {
            return;
        }
        if (process2.throwDeprecation) {
            return process2.nextTick(()=>{
                throw warning;
            });
        }
    }
    process2.nextTick(doEmitWarning, warning);
}
function hrtime1(time) {
    const milli = performance.now();
    const sec = Math.floor(milli / 1000);
    const nano = Math.floor(milli * 1000000 - sec * 1000000000);
    if (!time) {
        return [
            sec,
            nano
        ];
    }
    const [prevSec, prevNano] = time;
    return [
        sec - prevSec,
        nano - prevNano
    ];
}
hrtime1.bigint = function() {
    const [sec, nano] = hrtime1();
    return BigInt(sec) * 1000000000n + BigInt(nano);
};
function memoryUsage1() {
    return {
        ...Deno.memoryUsage(),
        arrayBuffers: 0
    };
}
memoryUsage1.rss = function() {
    return memoryUsage1().rss;
};
class Process extends EventEmitter1 {
    constructor(){
        super();
        globalThis.addEventListener("unload", ()=>{
            super.emit("exit", 0);
        });
    }
    arch = arch1;
    argv = argv1;
    chdir = chdir1;
    config = {
        target_defaults: {
        },
        variables: {
        }
    };
    cwd = cwd1;
    env = env1;
    execArgv = [];
    exit = exit1;
    _exiting = _exiting1;
    exitCode = undefined;
    mainModule = undefined;
    nextTick = nextTick2;
    on(event, listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.on("${event}")`);
        } else if (event.startsWith("SIG")) {
            Deno.addSignalListener(event, listener);
        } else {
            super.on(event, listener);
        }
        return this;
    }
    off(event, listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.off("${event}")`);
        } else if (event.startsWith("SIG")) {
            Deno.removeSignalListener(event, listener);
        } else {
            super.off(event, listener);
        }
        return this;
    }
    pid = pid1;
    platform = platform1;
    removeAllListeners(eventName) {
        return super.removeAllListeners(eventName);
    }
    removeListener(event, listener) {
        if (notImplementedEvents.includes(event)) {
            warnNotImplemented(`process.removeListener("${event}")`);
            return this;
        }
        super.removeListener("exit", listener);
        return this;
    }
    hrtime = hrtime1;
    memoryUsage = memoryUsage1;
    stderr = stderr1;
    stdin = stdin1;
    stdout = stdout1;
    version = version1;
    versions = versions1;
    emitWarning = emitWarning1;
    binding(name) {
        return getBinding(name);
    }
    umask = Deno.umask;
    getuid() {
        return NaN;
    }
    _eval = undefined;
}
const process2 = new Process();
Object.defineProperty(process2, Symbol.toStringTag, {
    enumerable: false,
    writable: true,
    configurable: false,
    value: "process"
});
addReadOnlyProcessAlias("noDeprecation", "--no-deprecation");
addReadOnlyProcessAlias("throwDeprecation", "--throw-deprecation");
process2.removeListener;
process2.removeAllListeners;
function close4(fd, callback) {
    setTimeout(()=>{
        let error = null;
        try {
            Deno.close(fd);
        } catch (err) {
            error = err instanceof Error ? err : new Error("[non-error thrown]");
        }
        callback(error);
    }, 0);
}
function closeSync(fd) {
    Deno.close(fd);
}
const mod54 = function() {
    return {
        F_OK: 0,
        R_OK: 4,
        W_OK: 2,
        X_OK: 1,
        S_IRUSR: 256,
        S_IWUSR: 128,
        S_IXUSR: 64,
        S_IRGRP: 32,
        S_IWGRP: 16,
        S_IXGRP: 8,
        S_IROTH: 4,
        S_IWOTH: 2,
        S_IXOTH: 1
    };
}();
function copyFile(source, destination, callback) {
    source = source instanceof URL ? fromFileUrl5(source) : source;
    Deno.copyFile(source, destination).then(()=>callback(null)
    , callback);
}
function copyFileSync(source, destination) {
    source = source instanceof URL ? fromFileUrl5(source) : source;
    Deno.copyFileSync(source, destination);
}
class Dirent {
    entry;
    constructor(entry){
        this.entry = entry;
    }
    isBlockDevice() {
        notImplemented1("Deno does not yet support identification of block devices");
        return false;
    }
    isCharacterDevice() {
        notImplemented1("Deno does not yet support identification of character devices");
        return false;
    }
    isDirectory() {
        return this.entry.isDirectory;
    }
    isFIFO() {
        notImplemented1("Deno does not yet support identification of FIFO named pipes");
        return false;
    }
    isFile() {
        return this.entry.isFile;
    }
    isSocket() {
        notImplemented1("Deno does not yet support identification of sockets");
        return false;
    }
    isSymbolicLink() {
        return this.entry.isSymlink;
    }
    get name() {
        return this.entry.name;
    }
}
class Dir {
    dirPath;
    syncIterator;
    asyncIterator;
    constructor(path){
        this.dirPath = path;
    }
    get path() {
        if (this.dirPath instanceof Uint8Array) {
            return new TextDecoder().decode(this.dirPath);
        }
        return this.dirPath;
    }
    read(callback) {
        return new Promise((resolve17, reject)=>{
            if (!this.asyncIterator) {
                this.asyncIterator = Deno.readDir(this.path)[Symbol.asyncIterator]();
            }
            assert1(this.asyncIterator);
            this.asyncIterator.next().then(({ value  })=>{
                resolve17(value ? value : null);
                if (callback) {
                    callback(null, value ? value : null);
                }
            }, (err)=>{
                if (callback) {
                    callback(err);
                }
                reject(err);
            });
        });
    }
    readSync() {
        if (!this.syncIterator) {
            this.syncIterator = Deno.readDirSync(this.path)[Symbol.iterator]();
        }
        const file = this.syncIterator.next().value;
        return file ? new Dirent(file) : null;
    }
    close(callback) {
        return new Promise((resolve18)=>{
            if (callback) {
                callback(null);
            }
            resolve18();
        });
    }
    closeSync() {
    }
    async *[Symbol.asyncIterator]() {
        try {
            while(true){
                const dirent = await this.read();
                if (dirent === null) {
                    break;
                }
                yield dirent;
            }
        } finally{
            await this.close();
        }
    }
}
function exists(path, callback) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    Deno.lstat(path).then(()=>callback(true)
    , ()=>callback(false)
    );
}
function existsSync1(path) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    try {
        Deno.lstatSync(path);
        return true;
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            return false;
        }
        throw err;
    }
}
function fdatasync(fd, callback) {
    Deno.fdatasync(fd).then(()=>callback(null)
    , callback);
}
function fdatasyncSync(fd) {
    Deno.fdatasyncSync(fd);
}
function convertFileInfoToStats(origin) {
    return {
        dev: origin.dev,
        ino: origin.ino,
        mode: origin.mode,
        nlink: origin.nlink,
        uid: origin.uid,
        gid: origin.gid,
        rdev: origin.rdev,
        size: origin.size,
        blksize: origin.blksize,
        blocks: origin.blocks,
        mtime: origin.mtime,
        atime: origin.atime,
        birthtime: origin.birthtime,
        mtimeMs: origin.mtime?.getTime() || null,
        atimeMs: origin.atime?.getTime() || null,
        birthtimeMs: origin.birthtime?.getTime() || null,
        isFile: ()=>origin.isFile
        ,
        isDirectory: ()=>origin.isDirectory
        ,
        isSymbolicLink: ()=>origin.isSymlink
        ,
        isBlockDevice: ()=>false
        ,
        isFIFO: ()=>false
        ,
        isCharacterDevice: ()=>false
        ,
        isSocket: ()=>false
        ,
        ctime: origin.mtime,
        ctimeMs: origin.mtime?.getTime() || null
    };
}
function toBigInt(number) {
    if (number === null || number === undefined) return null;
    return BigInt(number);
}
function convertFileInfoToBigIntStats(origin) {
    return {
        dev: toBigInt(origin.dev),
        ino: toBigInt(origin.ino),
        mode: toBigInt(origin.mode),
        nlink: toBigInt(origin.nlink),
        uid: toBigInt(origin.uid),
        gid: toBigInt(origin.gid),
        rdev: toBigInt(origin.rdev),
        size: toBigInt(origin.size) || 0n,
        blksize: toBigInt(origin.blksize),
        blocks: toBigInt(origin.blocks),
        mtime: origin.mtime,
        atime: origin.atime,
        birthtime: origin.birthtime,
        mtimeMs: origin.mtime ? BigInt(origin.mtime.getTime()) : null,
        atimeMs: origin.atime ? BigInt(origin.atime.getTime()) : null,
        birthtimeMs: origin.birthtime ? BigInt(origin.birthtime.getTime()) : null,
        mtimeNs: origin.mtime ? BigInt(origin.mtime.getTime()) * 1000000n : null,
        atimeNs: origin.atime ? BigInt(origin.atime.getTime()) * 1000000n : null,
        birthtimeNs: origin.birthtime ? BigInt(origin.birthtime.getTime()) * 1000000n : null,
        isFile: ()=>origin.isFile
        ,
        isDirectory: ()=>origin.isDirectory
        ,
        isSymbolicLink: ()=>origin.isSymlink
        ,
        isBlockDevice: ()=>false
        ,
        isFIFO: ()=>false
        ,
        isCharacterDevice: ()=>false
        ,
        isSocket: ()=>false
        ,
        ctime: origin.mtime,
        ctimeMs: origin.mtime ? BigInt(origin.mtime.getTime()) : null,
        ctimeNs: origin.mtime ? BigInt(origin.mtime.getTime()) * 1000000n : null
    };
}
function CFISBIS(fileInfo, bigInt) {
    if (bigInt) return convertFileInfoToBigIntStats(fileInfo);
    return convertFileInfoToStats(fileInfo);
}
function stat(path, optionsOrCallback, maybeCallback1) {
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback1;
    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {
        bigint: false
    };
    if (!callback) throw new Error("No callback function supplied");
    Deno.stat(path).then((stat1)=>callback(null, CFISBIS(stat1, options.bigint))
    , (err)=>callback(denoErrorToNodeError(err, {
            syscall: "stat"
        }))
    );
}
function statSync(path, options = {
    bigint: false,
    throwIfNoEntry: true
}) {
    try {
        const origin = Deno.statSync(path);
        return CFISBIS(origin, options.bigint);
    } catch (err) {
        if (options?.throwIfNoEntry === false && err instanceof Deno.errors.NotFound) {
            return;
        }
        if (err instanceof Error) {
            throw denoErrorToNodeError(err, {
                syscall: "stat"
            });
        } else {
            throw err;
        }
    }
}
function fstat(fd, optionsOrCallback, maybeCallback2) {
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback2;
    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {
        bigint: false
    };
    if (!callback) throw new Error("No callback function supplied");
    Deno.fstat(fd).then((stat2)=>callback(null, CFISBIS(stat2, options.bigint))
    , (err)=>callback(err)
    );
}
function fstatSync(fd, options) {
    const origin = Deno.fstatSync(fd);
    return CFISBIS(origin, options?.bigint || false);
}
function fsync(fd, callback) {
    Deno.fsync(fd).then(()=>callback(null)
    , callback);
}
function fsyncSync(fd) {
    Deno.fsyncSync(fd);
}
function ftruncate(fd, lenOrCallback, maybeCallback3) {
    const len = typeof lenOrCallback === "number" ? lenOrCallback : undefined;
    const callback = typeof lenOrCallback === "function" ? lenOrCallback : maybeCallback3;
    if (!callback) throw new Error("No callback function supplied");
    Deno.ftruncate(fd, len).then(()=>callback(null)
    , callback);
}
function ftruncateSync(fd, len) {
    Deno.ftruncateSync(fd, len);
}
function getValidTime(time, name) {
    if (typeof time === "string") {
        time = Number(time);
    }
    if (typeof time === "number" && (Number.isNaN(time) || !Number.isFinite(time))) {
        throw new Deno.errors.InvalidData(`invalid ${name}, must not be infinity or NaN`);
    }
    return time;
}
function futimes(fd, atime, mtime, callback) {
    if (!callback) {
        throw new Deno.errors.InvalidData("No callback function supplied");
    }
    atime = getValidTime(atime, "atime");
    mtime = getValidTime(mtime, "mtime");
    Deno.futime(fd, atime, mtime).then(()=>callback(null)
    , callback);
}
function futimesSync(fd, atime, mtime) {
    atime = getValidTime(atime, "atime");
    mtime = getValidTime(mtime, "mtime");
    Deno.futimeSync(fd, atime, mtime);
}
function link(existingPath, newPath, callback) {
    existingPath = existingPath instanceof URL ? fromFileUrl5(existingPath) : existingPath;
    newPath = newPath instanceof URL ? fromFileUrl5(newPath) : newPath;
    Deno.link(existingPath, newPath).then(()=>callback(null)
    , callback);
}
function linkSync(existingPath, newPath) {
    existingPath = existingPath instanceof URL ? fromFileUrl5(existingPath) : existingPath;
    newPath = newPath instanceof URL ? fromFileUrl5(newPath) : newPath;
    Deno.linkSync(existingPath, newPath);
}
function lstat(path, optionsOrCallback, maybeCallback4) {
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback4;
    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : {
        bigint: false
    };
    if (!callback) throw new Error("No callback function supplied");
    Deno.lstat(path).then((stat3)=>callback(null, CFISBIS(stat3, options.bigint))
    , (err)=>callback(err)
    );
}
function lstatSync(path, options) {
    const origin = Deno.lstatSync(path);
    return CFISBIS(origin, options?.bigint || false);
}
function mkdir(path, options, callback) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    let mode = 511;
    let recursive = false;
    if (typeof options == "function") {
        callback = options;
    } else if (typeof options === "number") {
        mode = options;
    } else if (typeof options === "boolean") {
        recursive = options;
    } else if (options) {
        if (options.recursive !== undefined) recursive = options.recursive;
        if (options.mode !== undefined) mode = options.mode;
    }
    if (typeof recursive !== "boolean") {
        throw new Deno.errors.InvalidData("invalid recursive option , must be a boolean");
    }
    Deno.mkdir(path, {
        recursive,
        mode
    }).then(()=>{
        if (typeof callback === "function") {
            callback(null);
        }
    }, (err)=>{
        if (typeof callback === "function") {
            callback(err);
        }
    });
}
function mkdirSync(path, options) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    let mode = 511;
    let recursive = false;
    if (typeof options === "number") {
        mode = options;
    } else if (typeof options === "boolean") {
        recursive = options;
    } else if (options) {
        if (options.recursive !== undefined) recursive = options.recursive;
        if (options.mode !== undefined) mode = options.mode;
    }
    if (typeof recursive !== "boolean") {
        throw new Deno.errors.InvalidData("invalid recursive option , must be a boolean");
    }
    Deno.mkdirSync(path, {
        recursive,
        mode
    });
}
function mkdtemp(prefix, optionsOrCallback, maybeCallback5) {
    const callback = typeof optionsOrCallback == "function" ? optionsOrCallback : maybeCallback5;
    if (!callback) throw new ERR_INVALID_CALLBACK(callback);
    const encoding = parseEncoding(optionsOrCallback);
    const path = tempDirPath(prefix);
    mkdir(path, {
        recursive: false,
        mode: 448
    }, (err)=>{
        if (err) callback(err);
        else callback(null, decode5(path, encoding));
    });
}
function mkdtempSync(prefix, options) {
    const encoding = parseEncoding(options);
    const path = tempDirPath(prefix);
    mkdirSync(path, {
        recursive: false,
        mode: 448
    });
    return decode5(path, encoding);
}
function parseEncoding(optionsOrCallback) {
    let encoding;
    if (typeof optionsOrCallback == "function") encoding = undefined;
    else if (optionsOrCallback instanceof Object) {
        encoding = optionsOrCallback?.encoding;
    } else encoding = optionsOrCallback;
    if (encoding) {
        try {
            new TextDecoder(encoding);
        } catch  {
            throw new ERR_INVALID_OPT_VALUE_ENCODING(encoding);
        }
    }
    return encoding;
}
function decode5(str, encoding) {
    if (!encoding) return str;
    else {
        const decoder3 = new TextDecoder(encoding);
        const encoder2 = new TextEncoder();
        return decoder3.decode(encoder2.encode(str));
    }
}
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randomName() {
    return [
        ...Array(6)
    ].map(()=>CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
}
function tempDirPath(prefix) {
    let path;
    do {
        path = prefix + randomName();
    }while (existsSync1(path))
    return path;
}
function existsSync2(filePath) {
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
function convertFlagAndModeToOptions(flag, mode) {
    if (!flag && !mode) return undefined;
    if (!flag && mode) return {
        mode
    };
    return {
        ...getOpenOptions(flag),
        mode
    };
}
function open(path, flagsOrCallback, callbackOrMode, maybeCallback6) {
    const flags = typeof flagsOrCallback === "string" ? flagsOrCallback : undefined;
    const callback = typeof flagsOrCallback === "function" ? flagsOrCallback : typeof callbackOrMode === "function" ? callbackOrMode : maybeCallback6;
    const mode = typeof callbackOrMode === "number" ? callbackOrMode : undefined;
    path = path instanceof URL ? fromFileUrl5(path) : path;
    if (!callback) throw new Error("No callback function supplied");
    if ([
        "ax",
        "ax+",
        "wx",
        "wx+"
    ].includes(flags || "") && existsSync2(path)) {
        const err = new Error(`EEXIST: file already exists, open '${path}'`);
        callback(err);
    } else {
        if (flags === "as" || flags === "as+") {
            let err = null, res;
            try {
                res = openSync(path, flags, mode);
            } catch (error) {
                err = error instanceof Error ? error : new Error("[non-error thrown]");
            }
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
            return;
        }
        Deno.open(path, convertFlagAndModeToOptions(flags, mode)).then((file)=>callback(null, file.rid)
        , (err)=>callback(err)
        );
    }
}
function openSync(path, flagsOrMode, maybeMode) {
    const flags = typeof flagsOrMode === "string" ? flagsOrMode : undefined;
    const mode = typeof flagsOrMode === "number" ? flagsOrMode : maybeMode;
    path = path instanceof URL ? fromFileUrl5(path) : path;
    if ([
        "ax",
        "ax+",
        "wx",
        "wx+"
    ].includes(flags || "") && existsSync2(path)) {
        throw new Error(`EEXIST: file already exists, open '${path}'`);
    }
    return Deno.openSync(path, convertFlagAndModeToOptions(flags, mode)).rid;
}
function read(fd, optOrBuffer, offsetOrCallback, length, position, callback) {
    let cb;
    let offset = 0, buffer;
    if (length == null) {
        length = 0;
    }
    if (typeof offsetOrCallback === "function") {
        cb = offsetOrCallback;
    } else if (typeof optOrBuffer === "function") {
        cb = optOrBuffer;
    } else {
        offset = offsetOrCallback;
        cb = callback;
    }
    if (!cb) throw new Error("No callback function supplied");
    if (optOrBuffer instanceof Buffer1 || optOrBuffer instanceof Uint8Array) {
        buffer = optOrBuffer;
    } else if (typeof optOrBuffer === "function") {
        offset = 0;
        buffer = Buffer1.alloc(16384);
        length = buffer.byteLength;
        position = null;
    } else {
        const opt = optOrBuffer;
        offset = opt.offset ?? 0;
        buffer = opt.buffer ?? Buffer1.alloc(16384);
        length = opt.length ?? buffer.byteLength;
        position = opt.position ?? null;
    }
    assert2(offset >= 0, "offset should be greater or equal to 0");
    assert2(offset + length <= buffer.byteLength, `buffer doesn't have enough data: byteLength = ${buffer.byteLength}, offset + length = ${offset + length}`);
    if (buffer.byteLength == 0) {
        throw new ERR_INVALID_ARG_VALUE("buffer", buffer, "is empty and cannot be written");
    }
    let err = null, numberOfBytesRead = null;
    if (position) {
        Deno.seekSync(fd, position, Deno.SeekMode.Current);
    }
    try {
        numberOfBytesRead = Deno.readSync(fd, buffer);
    } catch (error) {
        err = error instanceof Error ? error : new Error("[non-error thrown]");
    }
    if (err) {
        callback(err);
    } else {
        const data1 = Buffer1.from(buffer.buffer, offset, length);
        cb(null, numberOfBytesRead, data1);
    }
    return;
}
function readSync(fd, buffer, offsetOrOpt, length, position) {
    let offset = 0;
    if (length == null) {
        length = 0;
    }
    if (buffer.byteLength == 0) {
        throw new ERR_INVALID_ARG_VALUE("buffer", buffer, "is empty and cannot be written");
    }
    if (typeof offsetOrOpt === "number") {
        offset = offsetOrOpt;
    } else {
        const opt = offsetOrOpt;
        offset = opt.offset ?? 0;
        length = opt.length ?? buffer.byteLength;
        position = opt.position ?? null;
    }
    assert2(offset >= 0, "offset should be greater or equal to 0");
    assert2(offset + length <= buffer.byteLength, `buffer doesn't have enough data: byteLength = ${buffer.byteLength}, offset + length = ${offset + length}`);
    if (position) {
        Deno.seekSync(fd, position, Deno.SeekMode.Current);
    }
    const numberOfBytesRead = Deno.readSync(fd, buffer);
    return numberOfBytesRead ?? 0;
}
function asyncIterableToCallback(iter, callback) {
    const iterator = iter[Symbol.asyncIterator]();
    function next() {
        iterator.next().then((obj)=>{
            if (obj.done) {
                callback(obj.value, true);
                return;
            }
            callback(obj.value);
            next();
        });
    }
    next();
}
function watch(filename, optionsOrListener, optionsOrListener2) {
    const listener = typeof optionsOrListener === "function" ? optionsOrListener : typeof optionsOrListener2 === "function" ? optionsOrListener2 : undefined;
    const options = typeof optionsOrListener === "object" ? optionsOrListener : typeof optionsOrListener2 === "object" ? optionsOrListener2 : undefined;
    filename = filename instanceof URL ? fromFileUrl5(filename) : filename;
    const iterator = Deno.watchFs(filename, {
        recursive: options?.recursive || false
    });
    if (!listener) throw new Error("No callback function supplied");
    const fsWatcher = new FSWatcher(()=>{
        if (iterator.return) iterator.return();
    });
    fsWatcher.on("change", listener);
    asyncIterableToCallback(iterator, (val, done)=>{
        if (done) return;
        fsWatcher.emit("change", val.kind, val.paths[0]);
    });
    return fsWatcher;
}
class FSWatcher extends EventEmitter1 {
    close;
    constructor(closer){
        super();
        this.close = closer;
    }
    ref() {
        notImplemented1("FSWatcher.ref() is not implemented");
    }
    unref() {
        notImplemented1("FSWatcher.unref() is not implemented");
    }
}
function toDirent(val) {
    return new Dirent(val);
}
function readdir(path, optionsOrCallback, maybeCallback7) {
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback7;
    const options = typeof optionsOrCallback === "object" ? optionsOrCallback : null;
    const result = [];
    path = path instanceof URL ? fromFileUrl5(path) : path;
    if (!callback) throw new Error("No callback function supplied");
    if (options?.encoding) {
        try {
            new TextDecoder(options.encoding);
        } catch  {
            throw new Error(`TypeError [ERR_INVALID_OPT_VALUE_ENCODING]: The value "${options.encoding}" is invalid for option "encoding"`);
        }
    }
    try {
        asyncIterableToCallback(Deno.readDir(path), (val, done)=>{
            if (typeof path !== "string") return;
            if (done) {
                callback(null, result);
                return;
            }
            if (options?.withFileTypes) {
                result.push(toDirent(val));
            } else result.push(decode6(val.name));
        });
    } catch (error) {
        callback(error instanceof Error ? error : new Error("[non-error thrown]"));
    }
}
function decode6(str, encoding) {
    if (!encoding) return str;
    else {
        const decoder4 = new TextDecoder(encoding);
        const encoder3 = new TextEncoder();
        return decoder4.decode(encoder3.encode(str));
    }
}
function readdirSync(path, options) {
    const result = [];
    path = path instanceof URL ? fromFileUrl5(path) : path;
    if (options?.encoding) {
        try {
            new TextDecoder(options.encoding);
        } catch  {
            throw new Error(`TypeError [ERR_INVALID_OPT_VALUE_ENCODING]: The value "${options.encoding}" is invalid for option "encoding"`);
        }
    }
    for (const file of Deno.readDirSync(path)){
        if (options?.withFileTypes) {
            result.push(toDirent(file));
        } else result.push(decode6(file.name));
    }
    return result;
}
function maybeDecode(data2, encoding) {
    const buffer = Buffer1.from(data2.buffer, data2.byteOffset, data2.byteLength);
    if (encoding && encoding !== "binary") return buffer.toString(encoding);
    return buffer;
}
function readFile(path, optOrCallback, callback) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    let cb;
    if (typeof optOrCallback === "function") {
        cb = optOrCallback;
    } else {
        cb = callback;
    }
    const encoding = getEncoding(optOrCallback);
    const p = Deno.readFile(path);
    if (cb) {
        p.then((data3)=>{
            if (encoding && encoding !== "binary") {
                const text = maybeDecode(data3, encoding);
                return cb(null, text);
            }
            const buffer = maybeDecode(data3, encoding);
            cb(null, buffer);
        }, (err)=>cb && cb(err)
        );
    }
}
function readFileSync(path, opt) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    const data4 = Deno.readFileSync(path);
    const encoding = getEncoding(opt);
    if (encoding && encoding !== "binary") {
        const text = maybeDecode(data4, encoding);
        return text;
    }
    const buffer = maybeDecode(data4, encoding);
    return buffer;
}
function maybeEncode(data5, encoding) {
    if (encoding === "buffer") {
        return new TextEncoder().encode(data5);
    }
    return data5;
}
function getEncoding1(optOrCallback) {
    if (!optOrCallback || typeof optOrCallback === "function") {
        return null;
    } else {
        if (optOrCallback.encoding) {
            if (optOrCallback.encoding === "utf8" || optOrCallback.encoding === "utf-8") {
                return "utf8";
            } else if (optOrCallback.encoding === "buffer") {
                return "buffer";
            } else {
                notImplemented1();
            }
        }
        return null;
    }
}
function readlink(path, optOrCallback, callback) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    let cb;
    if (typeof optOrCallback === "function") {
        cb = optOrCallback;
    } else {
        cb = callback;
    }
    const encoding = getEncoding1(optOrCallback);
    intoCallbackAPIWithIntercept(Deno.readLink, (data6)=>maybeEncode(data6, encoding)
    , cb, path);
}
function readlinkSync(path, opt) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    return maybeEncode(Deno.readLinkSync(path), getEncoding1(opt));
}
function realpath(path111, options, callback) {
    if (typeof options === "function") {
        callback = options;
    }
    if (!callback) {
        throw new Error("No callback function supplied");
    }
    Deno.realPath(path111).then((path)=>callback(null, path)
    , (err)=>callback(err)
    );
}
function realpathSync(path) {
    return Deno.realPathSync(path);
}
function rename(oldPath, newPath, callback) {
    oldPath = oldPath instanceof URL ? fromFileUrl5(oldPath) : oldPath;
    newPath = newPath instanceof URL ? fromFileUrl5(newPath) : newPath;
    if (!callback) throw new Error("No callback function supplied");
    Deno.rename(oldPath, newPath).then((_)=>callback()
    , callback);
}
function renameSync(oldPath, newPath) {
    oldPath = oldPath instanceof URL ? fromFileUrl5(oldPath) : oldPath;
    newPath = newPath instanceof URL ? fromFileUrl5(newPath) : newPath;
    Deno.renameSync(oldPath, newPath);
}
function symlink(target, path, typeOrCallback, maybeCallback8) {
    target = target instanceof URL ? fromFileUrl5(target) : target;
    path = path instanceof URL ? fromFileUrl5(path) : path;
    const type = typeof typeOrCallback === "string" ? typeOrCallback : "file";
    const callback = typeof typeOrCallback === "function" ? typeOrCallback : maybeCallback8;
    if (!callback) throw new Error("No callback function supplied");
    Deno.symlink(target, path, {
        type
    }).then(()=>callback(null)
    , callback);
}
function symlinkSync(target, path, type) {
    target = target instanceof URL ? fromFileUrl5(target) : target;
    path = path instanceof URL ? fromFileUrl5(path) : path;
    type = type || "file";
    Deno.symlinkSync(target, path, {
        type
    });
}
function truncate(path, lenOrCallback, maybeCallback9) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    const len = typeof lenOrCallback === "number" ? lenOrCallback : undefined;
    const callback = typeof lenOrCallback === "function" ? lenOrCallback : maybeCallback9;
    if (!callback) throw new Error("No callback function supplied");
    Deno.truncate(path, len).then(()=>callback(null)
    , callback);
}
function truncateSync(path, len) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    Deno.truncateSync(path, len);
}
function unlink(path, callback) {
    if (!callback) throw new Error("No callback function supplied");
    Deno.remove(path).then((_)=>callback()
    , callback);
}
function unlinkSync(path) {
    Deno.removeSync(path);
}
function getValidTime1(time, name) {
    if (typeof time === "string") {
        time = Number(time);
    }
    if (typeof time === "number" && (Number.isNaN(time) || !Number.isFinite(time))) {
        throw new Deno.errors.InvalidData(`invalid ${name}, must not be infinity or NaN`);
    }
    return time;
}
function utimes(path, atime, mtime, callback) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    if (!callback) {
        throw new Deno.errors.InvalidData("No callback function supplied");
    }
    atime = getValidTime1(atime, "atime");
    mtime = getValidTime1(mtime, "mtime");
    Deno.utime(path, atime, mtime).then(()=>callback(null)
    , callback);
}
function utimesSync(path, atime, mtime) {
    path = path instanceof URL ? fromFileUrl5(path) : path;
    atime = getValidTime1(atime, "atime");
    mtime = getValidTime1(mtime, "mtime");
    Deno.utimeSync(path, atime, mtime);
}
const { F_OK , R_OK , W_OK , X_OK ,  } = mod54;
"use strict";
const kType = Symbol("type");
const kStats = Symbol("stats");
const { F_OK: F_OK1 = 0 , W_OK: W_OK1 = 0 , R_OK: R_OK1 = 0 , X_OK: X_OK1 = 0 , COPYFILE_EXCL , COPYFILE_FICLONE , COPYFILE_FICLONE_FORCE , O_APPEND , O_CREAT , O_EXCL , O_RDONLY , O_RDWR , O_SYNC , O_TRUNC , O_WRONLY , S_IFBLK , S_IFCHR , S_IFDIR , S_IFIFO , S_IFLNK , S_IFMT , S_IFREG , S_IFSOCK , UV_FS_SYMLINK_DIR , UV_FS_SYMLINK_JUNCTION , UV_DIRENT_UNKNOWN , UV_DIRENT_FILE , UV_DIRENT_DIR , UV_DIRENT_LINK , UV_DIRENT_FIFO , UV_DIRENT_SOCKET , UV_DIRENT_CHAR , UV_DIRENT_BLOCK ,  } = fs1;
const { errno: { EISDIR ,  } ,  } = os;
const kMinimumAccessMode = Math.min(F_OK1, W_OK1, R_OK1, X_OK1);
const kMaximumAccessMode = F_OK1 | W_OK1 | R_OK1 | X_OK1;
const kDefaultCopyMode = 0;
const kMinimumCopyMode = Math.min(0, COPYFILE_EXCL, COPYFILE_FICLONE, COPYFILE_FICLONE_FORCE);
const kMaximumCopyMode = COPYFILE_EXCL | COPYFILE_FICLONE | COPYFILE_FICLONE_FORCE;
const kIoMaxLength = 2 ** 31 - 1;
const kReadFileUnknownBufferLength = 64 * 1024;
const kReadFileBufferLength = 512 * 1024;
const kWriteFileMaxChunkSize = 512 * 1024;
const kMaxUserId = 2 ** 32 - 1;
function assertEncoding(encoding) {
    if (encoding && !Buffer1.isEncoding(encoding)) {
        const reason = "is invalid encoding";
        throw new ERR_INVALID_ARG_VALUE(encoding, "encoding", reason);
    }
}
class Dirent1 {
    constructor(name1, type){
        this.name = name1;
        this[kType] = type;
    }
    isDirectory() {
        return this[kType] === UV_DIRENT_DIR;
    }
    isFile() {
        return this[kType] === UV_DIRENT_FILE;
    }
    isBlockDevice() {
        return this[kType] === UV_DIRENT_BLOCK;
    }
    isCharacterDevice() {
        return this[kType] === UV_DIRENT_CHAR;
    }
    isSymbolicLink() {
        return this[kType] === UV_DIRENT_LINK;
    }
    isFIFO() {
        return this[kType] === UV_DIRENT_FIFO;
    }
    isSocket() {
        return this[kType] === UV_DIRENT_SOCKET;
    }
}
class DirentFromStats extends Dirent1 {
    constructor(name2, stats){
        super(name2, null);
        this[kStats] = stats;
    }
}
for (const name7 of Reflect.ownKeys(Dirent1.prototype)){
    if (name7 === "constructor") {
        continue;
    }
    DirentFromStats.prototype[name7] = function() {
        return this[kStats][name7]();
    };
}
function copyObject(source) {
    const target = {
    };
    for(const key in source){
        target[key] = source[key];
    }
    return target;
}
const bufferSep = Buffer1.from(__default3.sep);
function join8(path, name3) {
    if ((typeof path === "string" || isUint8Array(path)) && name3 === undefined) {
        return path;
    }
    if (typeof path === "string" && isUint8Array(name3)) {
        const pathBuffer = Buffer1.from(__default3.join(path, __default3.sep));
        return Buffer1.concat([
            pathBuffer,
            name3
        ]);
    }
    if (typeof path === "string" && typeof name3 === "string") {
        return __default3.join(path, name3);
    }
    if (isUint8Array(path) && isUint8Array(name3)) {
        return Buffer1.concat([
            path,
            bufferSep,
            name3
        ]);
    }
    throw new ERR_INVALID_ARG_TYPE("path", [
        "string",
        "Buffer"
    ], path);
}
const getValidatedPath = hideStackFrames((fileURLOrPath, propName = "path")=>{
    const path = toPathIfFileURL(fileURLOrPath);
    validatePath(path, propName);
    return path;
});
const getValidMode = hideStackFrames((mode, type)=>{
    let min23 = kMinimumAccessMode;
    let max = kMaximumAccessMode;
    let def = F_OK1;
    if (type === "copyFile") {
        min23 = kMinimumCopyMode;
        max = kMaximumCopyMode;
        def = mode || kDefaultCopyMode;
    } else {
        assert3(type === "access");
    }
    if (mode == null) {
        return def;
    }
    if (Number.isInteger(mode) && mode >= min23 && mode <= max) {
        return mode;
    }
    if (typeof mode !== "number") {
        throw new ERR_INVALID_ARG_TYPE("mode", "integer", mode);
    }
    throw new ERR_OUT_OF_RANGE("mode", `an integer >= ${min23} && <= ${max}`, mode);
});
function access(path, mode, callback) {
    if (typeof mode === "function") {
        callback = mode;
        mode = fs1.F_OK;
    }
    path = getValidatedPath(path).toString();
    mode = getValidMode(mode, "access");
    const cb = makeCallback(callback);
    Deno.lstat(path).then((info)=>{
        const m = +mode || 0;
        const fileMode = +info.mode || 0;
        if ((m & fileMode) === m) {
            cb(null);
        } else {
            const e = new Error(`EACCES: permission denied, access '${path}'`);
            e.code = "EACCES";
            e.path = path;
            e.syscall = "access";
            cb(e);
        }
    }, (err)=>{
        if (err instanceof Deno.errors.NotFound) {
            const e = new Error(`ENOENT: no such file or directory, access '${path}'`);
            e.code = "ENOENT";
            e.path = path;
            e.syscall = "access";
            cb(e);
        } else {
            cb(err);
        }
    });
}
function accessSync(path, mode) {
    path = getValidatedPath(path).toString();
    mode = getValidMode(mode, "access");
    try {
        const info = Deno.lstatSync(path.toString());
        const m = +mode || 0;
        const fileMode = +info.mode || 0;
        if ((m & fileMode) === m) {
        } else {
            const e = new Error(`EACCES: permission denied, access '${path}'`);
            e.code = "EACCES";
            e.path = path;
            e.syscall = "access";
            throw e;
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            const e = new Error(`ENOENT: no such file or directory, access '${path}'`);
            e.code = "ENOENT";
            e.path = path;
            e.syscall = "access";
            throw e;
        } else {
            throw err;
        }
    }
}
function getOptions1(options, defaultOptions) {
    if (options === null || options === undefined || typeof options === "function") {
        return defaultOptions;
    }
    if (typeof options === "string") {
        defaultOptions = {
            ...defaultOptions
        };
        defaultOptions.encoding = options;
        options = defaultOptions;
    } else if (typeof options !== "object") {
        throw new ERR_INVALID_ARG_TYPE("options", [
            "string",
            "Object"
        ], options);
    }
    if (options.encoding !== "buffer") {
        assertEncoding(options.encoding);
    }
    if (options.signal !== undefined) {
        validateAbortSignal(options.signal, "options.signal");
    }
    return options;
}
function handleErrorFromBinding(ctx) {
    if (ctx.errno !== undefined) {
        const err = uvException(ctx);
        Error.captureStackTrace(err, handleErrorFromBinding);
        throw err;
    }
    if (ctx.error !== undefined) {
        Error.captureStackTrace(ctx.error, handleErrorFromBinding);
        throw ctx.error;
    }
}
const nullCheck = hideStackFrames((path, propName, throwError = true)=>{
    const pathIsString = typeof path === "string";
    const pathIsUint8Array = isUint8Array(path);
    if (!pathIsString && !pathIsUint8Array || pathIsString && !path.includes("\u0000") || pathIsUint8Array && !path.includes(0)) {
        return;
    }
    const err = new ERR_INVALID_ARG_VALUE(propName, path, "must be a string or Uint8Array without null bytes");
    if (throwError) {
        throw err;
    }
    return err;
});
function preprocessSymlinkDestination(path, type, linkPath) {
    if (!isWindows1) {
        return path;
    }
    path = "" + path;
    if (type === "junction") {
        path = __default3.resolve(linkPath, "..", path);
        return __default3.toNamespacedPath(path);
    }
    if (__default3.isAbsolute(path)) {
        return __default3.toNamespacedPath(path);
    }
    return path.replace(/\//g, "\\");
}
function StatsBase(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks) {
    this.dev = dev;
    this.mode = mode;
    this.nlink = nlink;
    this.uid = uid;
    this.gid = gid;
    this.rdev = rdev;
    this.blksize = blksize;
    this.ino = ino;
    this.size = size;
    this.blocks = blocks;
}
StatsBase.prototype.isDirectory = function() {
    return this._checkModeProperty(S_IFDIR);
};
StatsBase.prototype.isFile = function() {
    return this._checkModeProperty(S_IFREG);
};
StatsBase.prototype.isBlockDevice = function() {
    return this._checkModeProperty(S_IFBLK);
};
StatsBase.prototype.isCharacterDevice = function() {
    return this._checkModeProperty(S_IFCHR);
};
StatsBase.prototype.isSymbolicLink = function() {
    return this._checkModeProperty(S_IFLNK);
};
StatsBase.prototype.isFIFO = function() {
    return this._checkModeProperty(S_IFIFO);
};
StatsBase.prototype.isSocket = function() {
    return this._checkModeProperty(S_IFSOCK);
};
const kNsPerMsBigInt = 10n ** 6n;
const kNsPerSecBigInt = 10n ** 9n;
const kMsPerSec = 10 ** 3;
const kNsPerMs = 10 ** 6;
function msFromTimeSpec(sec, nsec) {
    return sec * kMsPerSec + nsec / kNsPerMs;
}
function nsFromTimeSpecBigInt(sec, nsec) {
    return sec * kNsPerSecBigInt + nsec;
}
function dateFromMs(ms) {
    return new Date(Number(ms) + 0.5);
}
function BigIntStats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeNs, mtimeNs, ctimeNs, birthtimeNs) {
    Reflect.apply(StatsBase, this, [
        dev,
        mode,
        nlink,
        uid,
        gid,
        rdev,
        blksize,
        ino,
        size,
        blocks, 
    ]);
    this.atimeMs = atimeNs / kNsPerMsBigInt;
    this.mtimeMs = mtimeNs / kNsPerMsBigInt;
    this.ctimeMs = ctimeNs / kNsPerMsBigInt;
    this.birthtimeMs = birthtimeNs / kNsPerMsBigInt;
    this.atimeNs = atimeNs;
    this.mtimeNs = mtimeNs;
    this.ctimeNs = ctimeNs;
    this.birthtimeNs = birthtimeNs;
    this.atime = dateFromMs(this.atimeMs);
    this.mtime = dateFromMs(this.mtimeMs);
    this.ctime = dateFromMs(this.ctimeMs);
    this.birthtime = dateFromMs(this.birthtimeMs);
}
Object.setPrototypeOf(BigIntStats.prototype, StatsBase.prototype);
Object.setPrototypeOf(BigIntStats, StatsBase);
BigIntStats.prototype._checkModeProperty = function(property) {
    if (isWindows1 && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
        return false;
    }
    return (this.mode & BigInt(S_IFMT)) === BigInt(property);
};
function Stats(dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks, atimeMs, mtimeMs, ctimeMs, birthtimeMs) {
    StatsBase.call(this, dev, mode, nlink, uid, gid, rdev, blksize, ino, size, blocks);
    this.atimeMs = atimeMs;
    this.mtimeMs = mtimeMs;
    this.ctimeMs = ctimeMs;
    this.birthtimeMs = birthtimeMs;
    this.atime = dateFromMs(atimeMs);
    this.mtime = dateFromMs(mtimeMs);
    this.ctime = dateFromMs(ctimeMs);
    this.birthtime = dateFromMs(birthtimeMs);
}
Object.setPrototypeOf(Stats.prototype, StatsBase.prototype);
Object.setPrototypeOf(Stats, StatsBase);
Stats.prototype.isFile = StatsBase.prototype.isFile;
Stats.prototype._checkModeProperty = function(property) {
    if (isWindows1 && (property === S_IFIFO || property === S_IFBLK || property === S_IFSOCK)) {
        return false;
    }
    return (this.mode & S_IFMT) === property;
};
function getStatsFromBinding(stats, offset = 0) {
    if (isBigUint64Array(stats)) {
        return new BigIntStats(stats[0 + offset], stats[1 + offset], stats[2 + offset], stats[3 + offset], stats[4 + offset], stats[5 + offset], stats[6 + offset], stats[7 + offset], stats[8 + offset], stats[9 + offset], nsFromTimeSpecBigInt(stats[10 + offset], stats[11 + offset]), nsFromTimeSpecBigInt(stats[12 + offset], stats[13 + offset]), nsFromTimeSpecBigInt(stats[14 + offset], stats[15 + offset]), nsFromTimeSpecBigInt(stats[16 + offset], stats[17 + offset]));
    }
    return new Stats(stats[0 + offset], stats[1 + offset], stats[2 + offset], stats[3 + offset], stats[4 + offset], stats[5 + offset], stats[6 + offset], stats[7 + offset], stats[8 + offset], stats[9 + offset], msFromTimeSpec(stats[10 + offset], stats[11 + offset]), msFromTimeSpec(stats[12 + offset], stats[13 + offset]), msFromTimeSpec(stats[14 + offset], stats[15 + offset]), msFromTimeSpec(stats[16 + offset], stats[17 + offset]));
}
function stringToFlags(flags, name6 = "flags") {
    if (typeof flags === "number") {
        validateInt32(flags, name6);
        return flags;
    }
    if (flags == null) {
        return O_RDONLY;
    }
    switch(flags){
        case "r":
            return O_RDONLY;
        case "rs":
        case "sr":
            return O_RDONLY | O_SYNC;
        case "r+":
            return O_RDWR;
        case "rs+":
        case "sr+":
            return O_RDWR | O_SYNC;
        case "w":
            return O_TRUNC | O_CREAT | O_WRONLY;
        case "wx":
        case "xw":
            return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;
        case "w+":
            return O_TRUNC | O_CREAT | O_RDWR;
        case "wx+":
        case "xw+":
            return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;
        case "a":
            return O_APPEND | O_CREAT | O_WRONLY;
        case "ax":
        case "xa":
            return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;
        case "as":
        case "sa":
            return O_APPEND | O_CREAT | O_WRONLY | O_SYNC;
        case "a+":
            return O_APPEND | O_CREAT | O_RDWR;
        case "ax+":
        case "xa+":
            return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
        case "as+":
        case "sa+":
            return O_APPEND | O_CREAT | O_RDWR | O_SYNC;
    }
    throw new ERR_INVALID_ARG_VALUE("flags", flags);
}
const stringToSymlinkType = hideStackFrames((type)=>{
    let flags = 0;
    if (typeof type === "string") {
        switch(type){
            case "dir":
                flags |= UV_FS_SYMLINK_DIR;
                break;
            case "junction":
                flags |= UV_FS_SYMLINK_JUNCTION;
                break;
            case "file":
                break;
            default:
                throw new ERR_FS_INVALID_SYMLINK_TYPE(type);
        }
    }
    return flags;
});
function toUnixTimestamp(time, name71 = "time") {
    if (typeof time === "string" && +time == time) {
        return +time;
    }
    if (Number.isFinite(time)) {
        if (time < 0) {
            return Date.now() / 1000;
        }
        return time;
    }
    if (isDate1(time)) {
        return Date.getTime(time) / 1000;
    }
    throw new ERR_INVALID_ARG_TYPE(name71, [
        "Date",
        "Time in seconds"
    ], time);
}
const validateOffsetLengthRead = hideStackFrames((offset, length, bufferLength)=>{
    if (offset < 0) {
        throw new ERR_OUT_OF_RANGE("offset", ">= 0", offset);
    }
    if (length < 0) {
        throw new ERR_OUT_OF_RANGE("length", ">= 0", length);
    }
    if (offset + length > bufferLength) {
        throw new ERR_OUT_OF_RANGE("length", `<= ${bufferLength - offset}`, length);
    }
});
const validateOffsetLengthWrite = hideStackFrames((offset, length, byteLength3)=>{
    if (offset > byteLength3) {
        throw new ERR_OUT_OF_RANGE("offset", `<= ${byteLength3}`, offset);
    }
    if (length > byteLength3 - offset) {
        throw new ERR_OUT_OF_RANGE("length", `<= ${byteLength3 - offset}`, length);
    }
    if (length < 0) {
        throw new ERR_OUT_OF_RANGE("length", ">= 0", length);
    }
    validateInt32(length, "length", 0);
});
const validatePath = hideStackFrames((path, propName = "path")=>{
    if (typeof path !== "string" && !isUint8Array(path)) {
        throw new ERR_INVALID_ARG_TYPE(propName, [
            "string",
            "Buffer",
            "URL"
        ], path);
    }
    const err = nullCheck(path, propName, false);
    if (err !== undefined) {
        throw err;
    }
});
const validateStringAfterArrayBufferView = hideStackFrames((buffer, name8)=>{
    if (typeof buffer === "string") {
        return;
    }
    if (typeof buffer === "object" && buffer !== null && typeof buffer.toString === "function" && Object.prototype.hasOwnProperty.call(buffer, "toString")) {
        return;
    }
    throw new ERR_INVALID_ARG_TYPE(name8, [
        "string",
        "Buffer",
        "TypedArray",
        "DataView"
    ], buffer);
});
function writeFile(pathOrRid, data7, optOrCallback, callback) {
    const callbackFn = optOrCallback instanceof Function ? optOrCallback : callback;
    const options = optOrCallback instanceof Function ? undefined : optOrCallback;
    if (!callbackFn) {
        throw new TypeError("Callback must be a function.");
    }
    pathOrRid = pathOrRid instanceof URL ? fromFileUrl5(pathOrRid) : pathOrRid;
    const flag = isFileOptions(options) ? options.flag : undefined;
    const mode = isFileOptions(options) ? options.mode : undefined;
    const encoding = checkEncoding1(getEncoding(options)) || "utf8";
    const openOptions = getOpenOptions(flag || "w");
    if (!ArrayBuffer.isView(data7)) {
        validateStringAfterArrayBufferView(data7, "data");
        data7 = Buffer1.from(String(data7), encoding);
    }
    const isRid = typeof pathOrRid === "number";
    let file;
    let error = null;
    (async ()=>{
        try {
            file = isRid ? new Deno.File(pathOrRid) : await Deno.open(pathOrRid, openOptions);
            if (!isRid && mode && !isWindows1) {
                await Deno.chmod(pathOrRid, mode);
            }
            const signal = isFileOptions(options) ? options.signal : undefined;
            await writeAll1(file, data7, {
                signal
            });
        } catch (e) {
            error = e instanceof Error ? denoErrorToNodeError(e, {
                syscall: "write"
            }) : new Error("[non-error thrown]");
        } finally{
            if (!isRid && file) file.close();
            callbackFn(error);
        }
    })();
}
function appendFile(path, data8, options, callback) {
    callback = maybeCallback(callback || options);
    options = getOptions1(options, {
        encoding: "utf8",
        mode: 438,
        flag: "a"
    });
    options = copyObject(options);
    if (!options.flag || isUint32(path)) {
        options.flag = "a";
    }
    writeFile(path, data8, options, callback);
}
function writeFileSync(pathOrRid, data9, options) {
    pathOrRid = pathOrRid instanceof URL ? fromFileUrl5(pathOrRid) : pathOrRid;
    const flag = isFileOptions(options) ? options.flag : undefined;
    const mode = isFileOptions(options) ? options.mode : undefined;
    const encoding = checkEncoding1(getEncoding(options)) || "utf8";
    const openOptions = getOpenOptions(flag || "w");
    if (!ArrayBuffer.isView(data9)) {
        validateStringAfterArrayBufferView(data9, "data");
        data9 = Buffer1.from(String(data9), encoding);
    }
    const isRid = typeof pathOrRid === "number";
    let file;
    let error = null;
    try {
        file = isRid ? new Deno.File(pathOrRid) : Deno.openSync(pathOrRid, openOptions);
        if (!isRid && mode && !isWindows1) {
            Deno.chmodSync(pathOrRid, mode);
        }
        writeAllSync(file, data9);
    } catch (e) {
        error = e instanceof Error ? denoErrorToNodeError(e, {
            syscall: "write"
        }) : new Error("[non-error thrown]");
    } finally{
        if (!isRid && file) file.close();
    }
    if (error) throw error;
}
function appendFileSync(path, data10, options) {
    options = getOptions1(options, {
        encoding: "utf8",
        mode: 438,
        flag: "a"
    });
    options = copyObject(options);
    if (!options.flag || isUint32(path)) {
        options.flag = "a";
    }
    writeFileSync(path, data10, options);
}
function chmod(path, mode, callback) {
    path = getValidatedPath(path).toString();
    mode = parseFileMode(mode, "mode");
    Deno.chmod(toNamespacedPath5(path), mode).then(()=>callback(null)
    , callback);
}
function chmodSync(path, mode) {
    path = getValidatedPath(path).toString();
    mode = parseFileMode(mode, "mode");
    Deno.chmodSync(toNamespacedPath5(path), mode);
}
function chown(path, uid, gid, callback) {
    callback = makeCallback(callback);
    path = getValidatedPath(path).toString();
    validateInteger(uid, "uid", -1, kMaxUserId);
    validateInteger(gid, "gid", -1, kMaxUserId);
    Deno.chown(toNamespacedPath5(path), uid, gid).then(()=>callback(null)
    , callback);
}
function chownSync(path, uid, gid) {
    path = getValidatedPath(path).toString();
    validateInteger(uid, "uid", -1, kMaxUserId);
    validateInteger(gid, "gid", -1, kMaxUserId);
    Deno.chownSync(toNamespacedPath5(path), uid, gid);
}
const access1 = promisify1(access);
const copyFile1 = promisify1(copyFile);
const open1 = promisify1(open);
const rename1 = promisify1(rename);
const truncate1 = promisify1(truncate);
function rm(path, optionsOrCallback, maybeCallback10) {
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback10;
    const options1 = typeof optionsOrCallback === "object" ? optionsOrCallback : undefined;
    if (!callback) throw new Error("No callback function supplied");
    validateRmOptions(path, options1, false, (err1, options)=>{
        if (err1) {
            return callback(err1);
        }
        Deno.remove(path, {
            recursive: options?.recursive
        }).then((_)=>callback(null)
        , (err)=>{
            if (options?.force && err instanceof Deno.errors.NotFound) {
                callback(null);
            } else {
                callback(err instanceof Error ? denoErrorToNodeError(err, {
                    syscall: "rm"
                }) : err);
            }
        });
    });
}
const rm1 = promisify1(rm);
const getValidatedFd = hideStackFrames((fd, propName = "fd")=>{
    if (Object.is(fd, -0)) {
        return 0;
    }
    validateInt32(fd, propName, 0);
    return fd;
});
const validateBufferArray = hideStackFrames((buffers, propName = "buffers")=>{
    if (!Array.isArray(buffers)) {
        throw new ERR_INVALID_ARG_TYPE(propName, "ArrayBufferView[]", buffers);
    }
    for(let i = 0; i < buffers.length; i++){
        if (!isArrayBufferView(buffers[i])) {
            throw new ERR_INVALID_ARG_TYPE(propName, "ArrayBufferView[]", buffers);
        }
    }
    return buffers;
});
let nonPortableTemplateWarn = true;
function warnOnNonPortableTemplate(template1) {
    if (nonPortableTemplateWarn && template1.endsWith("X")) {
        process2.emitWarning("mkdtemp() templates ending with X are not portable. " + "For details see: https://nodejs.org/api/fs.html");
        nonPortableTemplateWarn = false;
    }
}
const defaultCpOptions = {
    dereference: false,
    errorOnExist: false,
    filter: undefined,
    force: true,
    preserveTimestamps: false,
    recursive: false
};
const defaultRmOptions = {
    recursive: false,
    force: false,
    retryDelay: 100,
    maxRetries: 0
};
const defaultRmdirOptions = {
    retryDelay: 100,
    maxRetries: 0,
    recursive: false
};
const validateCpOptions = hideStackFrames((options)=>{
    if (options === undefined) {
        return {
            ...defaultCpOptions
        };
    }
    validateObject(options, "options");
    options = {
        ...defaultCpOptions,
        ...options
    };
    validateBoolean(options.dereference, "options.dereference");
    validateBoolean(options.errorOnExist, "options.errorOnExist");
    validateBoolean(options.force, "options.force");
    validateBoolean(options.preserveTimestamps, "options.preserveTimestamps");
    validateBoolean(options.recursive, "options.recursive");
    if (options.filter !== undefined) {
        validateFunction(options.filter, "options.filter");
    }
    return options;
});
const rmdir = promisify1(rmdir1);
const mkdir1 = promisify1(mkdir);
const readdir1 = promisify1(readdir);
const readlink1 = promisify1(readlink);
const symlink1 = promisify1(symlink);
const lstat1 = promisify1(lstat);
const stat1 = promisify1(stat);
const link1 = promisify1(link);
const unlink1 = promisify1(unlink);
const chmod1 = promisify1(chmod);
const chown1 = promisify1(chown);
const utimes1 = promisify1(utimes);
const realpath1 = promisify1(realpath);
const mkdtemp1 = promisify1(mkdtemp);
const writeFile1 = promisify1(writeFile);
const appendFile1 = promisify1(appendFile);
const readFile1 = promisify1(readFile);
const watch1 = promisify1(watch);
const __default6 = {
    open: open1,
    rename: rename1,
    truncate: truncate1,
    rm: rm1,
    rmdir,
    mkdir: mkdir1,
    readdir: readdir1,
    readlink: readlink1,
    symlink: symlink1,
    lstat: lstat1,
    stat: stat1,
    link: link1,
    unlink: unlink1,
    chmod: chmod1,
    chown: chown1,
    utimes: utimes1,
    realpath: realpath1,
    mkdtemp: mkdtemp1,
    writeFile: writeFile1,
    appendFile: appendFile1,
    readFile: readFile1,
    watch: watch1
};
const mod55 = {
    access: access1,
    copyFile: copyFile1,
    open: open1,
    rename: rename1,
    truncate: truncate1,
    rm: rm1,
    rmdir: rmdir,
    mkdir: mkdir1,
    readdir: readdir1,
    readlink: readlink1,
    symlink: symlink1,
    lstat: lstat1,
    stat: stat1,
    link: link1,
    unlink: unlink1,
    chmod: chmod1,
    chown: chown1,
    utimes: utimes1,
    realpath: realpath1,
    mkdtemp: mkdtemp1,
    writeFile: writeFile1,
    appendFile: appendFile1,
    readFile: readFile1,
    watch: watch1,
    default: __default6
};
const validateRmOptions = hideStackFrames((path, options, expectDir, cb)=>{
    options = validateRmdirOptions(options, defaultRmOptions);
    validateBoolean(options.force, "options.force");
    __default7.stat(path, (err, stats)=>{
        if (err) {
            if (options.force && err.code === "ENOENT") {
                return cb(null, options);
            }
            return cb(err, options);
        }
        if (expectDir && !stats.isDirectory()) {
            return cb(false);
        }
        if (stats.isDirectory() && !options.recursive) {
            return cb(new ERR_FS_EISDIR({
                code: "EISDIR",
                message: "is a directory",
                path,
                syscall: "rm",
                errno: EISDIR
            }));
        }
        return cb(null, options);
    });
});
const validateRmOptionsSync = hideStackFrames((path, options, expectDir)=>{
    options = validateRmdirOptions(options, defaultRmOptions);
    validateBoolean(options.force, "options.force");
    if (!options.force || expectDir || !options.recursive) {
        const isDirectory = __default7.statSync(path, {
            throwIfNoEntry: !options.force
        })?.isDirectory();
        if (expectDir && !isDirectory) {
            return false;
        }
        if (isDirectory && !options.recursive) {
            throw new ERR_FS_EISDIR({
                code: "EISDIR",
                message: "is a directory",
                path,
                syscall: "rm",
                errno: EISDIR
            });
        }
    }
    return options;
});
let recursiveRmdirWarned = process2.noDeprecation;
function emitRecursiveRmdirWarning() {
    if (!recursiveRmdirWarned) {
        process2.emitWarning("In future versions of Node.js, fs.rmdir(path, { recursive: true }) " + "will be removed. Use fs.rm(path, { recursive: true }) instead", "DeprecationWarning", "DEP0147");
        recursiveRmdirWarned = true;
    }
}
const validateRmdirOptions = hideStackFrames((options, defaults = defaultRmdirOptions)=>{
    if (options === undefined) {
        return defaults;
    }
    validateObject(options, "options");
    options = {
        ...defaults,
        ...options
    };
    validateBoolean(options.recursive, "options.recursive");
    validateInt32(options.retryDelay, "options.retryDelay", 0);
    validateUint32(options.maxRetries, "options.maxRetries");
    return options;
});
function rmdir1(path, optionsOrCallback, maybeCallback11) {
    path = toNamespacedPath5(getValidatedPath(path));
    const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback11;
    const options1 = typeof optionsOrCallback === "object" ? optionsOrCallback : undefined;
    if (!callback) throw new Error("No callback function supplied");
    if (options1?.recursive) {
        emitRecursiveRmdirWarning();
        validateRmOptions(path, {
            ...options1,
            force: false
        }, true, (err, options)=>{
            if (err === false) {
                return callback(new ERR_FS_RMDIR_ENOTDIR(path.toString()));
            }
            if (err) {
                return callback(err);
            }
            Deno.remove(path, {
                recursive: options?.recursive
            }).then((_)=>callback()
            , callback);
        });
    } else {
        validateRmdirOptions(options1);
        Deno.remove(path, {
            recursive: options1?.recursive
        }).then((_)=>callback()
        , (err)=>{
            callback(err instanceof Error ? denoErrorToNodeError(err, {
                syscall: "rmdir"
            }) : err);
        });
    }
}
function rmdirSync(path, options) {
    path = getValidatedPath(path);
    if (options?.recursive) {
        emitRecursiveRmdirWarning();
        options = validateRmOptionsSync(path, {
            ...options,
            force: false
        }, true);
        if (options === false) {
            throw new ERR_FS_RMDIR_ENOTDIR(path.toString());
        }
    } else {
        validateRmdirOptions(options);
    }
    try {
        Deno.removeSync(toNamespacedPath5(path), {
            recursive: options?.recursive
        });
    } catch (err) {
        throw err instanceof Error ? denoErrorToNodeError(err, {
            syscall: "rmdir"
        }) : err;
    }
}
function rmSync(path, options) {
    options = validateRmOptionsSync(path, options, false);
    try {
        Deno.removeSync(path, {
            recursive: options?.recursive
        });
    } catch (err) {
        if (options?.force && err instanceof Deno.errors.NotFound) {
            return;
        }
        if (err instanceof Error) {
            throw denoErrorToNodeError(err, {
                syscall: "stat"
            });
        } else {
            throw err;
        }
    }
}
const __default7 = {
    access,
    accessSync,
    appendFile,
    appendFileSync,
    chmod,
    chmodSync,
    chown,
    chownSync,
    close: close4,
    closeSync,
    constants: mod54,
    copyFile,
    copyFileSync,
    Dir,
    Dirent,
    exists,
    existsSync: existsSync1,
    F_OK,
    fdatasync,
    fdatasyncSync,
    fstat,
    fstatSync,
    fsync,
    fsyncSync,
    ftruncate,
    ftruncateSync,
    futimes,
    futimesSync,
    link,
    linkSync,
    lstat,
    lstatSync,
    mkdir,
    mkdirSync,
    mkdtemp,
    mkdtempSync,
    open,
    openSync,
    read,
    readSync,
    promises: mod55,
    R_OK,
    readdir,
    readdirSync,
    readFile,
    readFileSync,
    readlink,
    readlinkSync,
    realpath,
    realpathSync,
    rename,
    renameSync,
    rmdir: rmdir1,
    rmdirSync,
    rm,
    rmSync,
    stat,
    Stats,
    statSync,
    symlink,
    symlinkSync,
    truncate,
    truncateSync,
    unlink,
    unlinkSync,
    utimes,
    utimesSync,
    W_OK,
    watch,
    watchFile: watch,
    writeFile,
    writeFileSync,
    X_OK
};
function getDirents(path, { 0: names , 1: types  }, callback) {
    let i;
    if (typeof callback === "function") {
        const len = names.length;
        let toFinish = 0;
        callback = once(callback);
        for(i = 0; i < len; i++){
            const type = types[i];
            if (type === UV_DIRENT_UNKNOWN) {
                const name4 = names[i];
                const idx = i;
                toFinish++;
                let filepath;
                try {
                    filepath = join8(path, name4);
                } catch (err1) {
                    callback(err1);
                    return;
                }
                __default7.lstat(filepath, (err, stats)=>{
                    if (err) {
                        callback(err);
                        return;
                    }
                    names[idx] = new DirentFromStats(name4, stats);
                    if (--toFinish === 0) {
                        callback(null, names);
                    }
                });
            } else {
                names[i] = new Dirent1(names[i], types[i]);
            }
        }
        if (toFinish === 0) {
            callback(null, names);
        }
    } else {
        const len = names.length;
        for(i = 0; i < len; i++){
            names[i] = getDirent(path, names[i], types[i]);
        }
        return names;
    }
}
function getDirent(path, name5, type, callback) {
    if (typeof callback === "function") {
        if (type === UV_DIRENT_UNKNOWN) {
            let filepath;
            try {
                filepath = join8(path, name5);
            } catch (err2) {
                callback(err2);
                return;
            }
            __default7.lstat(filepath, (err, stats)=>{
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, new DirentFromStats(name5, stats));
            });
        } else {
            callback(null, new Dirent1(name5, type));
        }
    } else if (type === UV_DIRENT_UNKNOWN) {
        const stats = __default7.lstatSync(join8(path, name5));
        return new DirentFromStats(name5, stats);
    } else {
        return new Dirent1(name5, type);
    }
}
const validatePosition = hideStackFrames((position)=>{
    if (typeof position === "number") {
        validateInteger(position, "position");
    } else if (typeof position === "bigint") {
        if (!(position >= -(2n ** 63n) && position <= 2n ** 63n - 1n)) {
            throw new ERR_OUT_OF_RANGE("position", `>= ${-(2n ** 63n)} && <= ${2n ** 63n - 1n}`, position);
        }
    } else {
        throw new ERR_INVALID_ARG_TYPE("position", [
            "integer",
            "bigint"
        ], position);
    }
});
({
    constants: {
        kIoMaxLength,
        kMaxUserId,
        kReadFileBufferLength,
        kReadFileUnknownBufferLength,
        kWriteFileMaxChunkSize
    },
    assertEncoding,
    BigIntStats,
    copyObject,
    Dirent: Dirent1,
    emitRecursiveRmdirWarning,
    getDirent,
    getDirents,
    getOptions: getOptions1,
    getValidatedFd,
    getValidatedPath,
    getValidMode,
    handleErrorFromBinding,
    nullCheck,
    preprocessSymlinkDestination,
    realpathCacheKey: Symbol("realpathCacheKey"),
    getStatsFromBinding,
    stringToFlags,
    stringToSymlinkType,
    Stats,
    toUnixTimestamp,
    validateBufferArray,
    validateCpOptions,
    validateOffsetLengthRead,
    validateOffsetLengthWrite,
    validatePath,
    validatePosition,
    validateRmOptions,
    validateRmOptionsSync,
    validateRmdirOptions,
    validateStringAfterArrayBufferView,
    warnOnNonPortableTemplate
});
async function writeAll1(w, arr, options = {
}) {
    const { offset =0 , length =arr.byteLength , signal  } = options;
    checkAborted(signal);
    const written = await w.write(arr.subarray(offset, offset + length));
    if (written === length) {
        return;
    }
    await writeAll1(w, arr, {
        offset: offset + written,
        length: length - written,
        signal
    });
}
function checkAborted(signal) {
    if (signal?.aborted) {
        throw new AbortError();
    }
}
function copyFile2(source, target) {
    var targetFile = target;
    if (existsSync1(target)) {
        if (lstatSync(target).isDirectory()) {
            targetFile = resolve5(join6(target, basename5(source)));
        }
    }
    writeFileSync(targetFile, readFileSync(source));
}
function cpRecursive(source, target, recursiveMode) {
    let files1 = [];
    let param2;
    recursiveMode ? param2 = basename5(source) : param2 = '';
    const targetFolder = resolve5(join6(target, param2));
    if (!existsSync1(targetFolder)) {
        mkdirSync(targetFolder);
    }
    if (lstatSync(source).isDirectory()) {
        files1 = readdirSync(source);
        files1.forEach(function(file) {
            const curSource = resolve5(join6(source, file));
            if (lstatSync(curSource).isDirectory()) {
                cpRecursive(curSource, targetFolder, true);
            } else {
                copyFile2(curSource, targetFolder);
            }
        });
    }
}
async function exec(cmd) {
    return new Promise(async (resolve19)=>{
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
        resolve19(outStr.trim());
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
        for (const [styleName, style3] of Object.entries(group)){
            styles2[styleName] = {
                open: `\u001B[${style3[0]}m`,
                close: `\u001B[${style3[1]}m`
            };
            group[styleName] = styles2[styleName];
            codes.set(style3[0], style3[1]);
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
function hasFlag(flag, argv = Deno.args) {
    const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf('--');
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
const env2 = Deno.env.toObject();
let flagForceColor;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never')) {
    flagForceColor = 0;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
    flagForceColor = 1;
}
function envForceColor() {
    if ('FORCE_COLOR' in env2) {
        if (env2.FORCE_COLOR === 'true') {
            return 1;
        }
        if (env2.FORCE_COLOR === 'false') {
            return 0;
        }
        return env2.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env2.FORCE_COLOR, 10), 3);
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
    const min24 = forceColor || 0;
    if (env2.TERM === 'dumb') {
        return min24;
    }
    if (Deno.build.os === 'win32') {
        return 1;
    }
    if ('CI' in env2) {
        if ([
            'TRAVIS',
            'CIRCLECI',
            'APPVEYOR',
            'GITLAB_CI',
            'GITHUB_ACTIONS',
            'BUILDKITE',
            'DRONE'
        ].some((sign)=>sign in env2
        ) || env2.CI_NAME === 'codeship') {
            return 1;
        }
        return min24;
    }
    if ('TEAMCITY_VERSION' in env2) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env2.COLORTERM === 'truecolor') {
        return 3;
    }
    if ('TERM_PROGRAM' in env2) {
        const version = Number.parseInt((env2.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
        switch(env2.TERM_PROGRAM){
            case 'iTerm.app':
                return version >= 3 ? 3 : 2;
            case 'Apple_Terminal':
                return 2;
        }
    }
    if (/-256(color)?$/i.test(env2.TERM)) {
        return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
        return 1;
    }
    if ('COLORTERM' in env2) {
        return 1;
    }
    return min24;
}
function createSupportsColor(stream1, options = {
}) {
    const level = _supportsColor(stream1, {
        streamIsTTY: stream1 && stream1.isTTY,
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
function parseStyle(style4) {
    STYLE_REGEX.lastIndex = 0;
    const results = [];
    let matches;
    while((matches = STYLE_REGEX.exec(style4)) !== null){
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
function buildStyle(chalk5, styles3) {
    const enabled = {
    };
    for (const layer of styles3){
        for (const style5 of layer.styles){
            enabled[style5[0]] = layer.inverse ? null : style5.slice(1);
        }
    }
    let current = chalk5;
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
function template(chalk6, temporary) {
    const styles4 = [];
    const chunks = [];
    let chunk = [];
    temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style6, close, character)=>{
        if (escapeCharacter) {
            chunk.push(unescape(escapeCharacter));
        } else if (style6) {
            const string = chunk.join('');
            chunk = [];
            chunks.push(styles4.length === 0 ? string : buildStyle(chalk6, styles4)(string));
            styles4.push({
                inverse,
                styles: parseStyle(style6)
            });
        } else if (close) {
            if (styles4.length === 0) {
                throw new Error('Found extraneous } in Chalk template literal');
            }
            chunks.push(buildStyle(chalk6, styles4)(chunk.join('')));
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
const createStyler = (open4, close, parent)=>{
    let openAll;
    let closeAll;
    if (parent === undefined) {
        openAll = open4;
        closeAll = close;
    } else {
        openAll = parent.openAll + open4;
        closeAll = close + parent.closeAll;
    }
    return {
        open: open4,
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
const config2 = new Config();
function print1(str) {
    return console.log(config2.prefix + str?.replaceAll('\n', '\n' + config2.prefix));
}
function changeCWD(dir) {
    mkdirSync(resolve5(dir), {
        recursive: true
    });
    chdir1(resolve5(dir));
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
const __dirname = dirname5(fromFileUrl5(importMeta.url));
const root = __dirname;
async function rewriteFiles(options, username) {
    const oldPackage = JSON.parse(readFileSync(resolve5('./package.json'), 'utf-8'));
    unlinkSync(resolve5('./package.json'));
    await exec('npm init -y');
    const newPackageFile = JSON.parse(readFileSync(resolve5('./package.json'), 'utf-8'));
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
    writeFileSync(resolve5('./package.json'), JSON.stringify(newPackageFile, null, 2));
    writeFileSync(resolve5('./.gitignore'), 'node_modules\n');
    writeFileSync(resolve5('./LICENSE'), makeLicense(username || 'YOUR NAME'));
    await exec(`node ${root}/index.js add tsc`);
    writeFileSync(resolve5('./README.md'), `# ${projectName} \n\n###### - ${username}`);
    const extension = options.script === 'typescript' ? '.tsx' : '.jsx';
    const hpDir = options.platform === 'next' ? resolve5('pages/index' + extension) : options.platform === 'react' ? resolve5('src/App' + extension) : '';
    const script = readFileSync(hpDir, 'utf-8').replaceAll('PROJECT-NAME', projectName).replaceAll('SCRIPT', options.script).replaceAll('PLATFORM', options.platform).replaceAll('STYLE', options.style);
    writeFileSync(hpDir, script);
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
function growBranch(key, root2, last, lastStates, showValues, hideFunctions, callback) {
    let line = '', index = 0, lastKey, circular, lastStatesCopy = lastStates.slice(0);
    if (lastStatesCopy.push([
        root2,
        last
    ]) && lastStates.length > 0) {
        lastStates.forEach(function(lastState, idx) {
            if (idx > 0) {
                line += (lastState[1] ? ' ' : '│') + '  ';
            }
            if (!circular && lastState[0] === root2) {
                circular = true;
            }
        });
        line += makePrefix(key, last) + key;
        showValues && (typeof root2 !== 'object' || root2 instanceof Date) && (line += ': ' + root2);
        circular && (line += ' (circular ref.)');
        callback(line);
    }
    if (!circular && typeof root2 === 'object') {
        let keys = filterKeys(root2, hideFunctions);
        keys.forEach(function(branch) {
            lastKey = ++index === keys.length;
            growBranch(branch, root2[branch], lastKey, lastStatesCopy, showValues, hideFunctions, callback);
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
let files = [];
async function __default8() {
    const tree2 = makeTree();
    let str;
    str = tree2.replaceAll(/((\d)|(\d\d)): /gm, '').split('\n').slice(0, -1);
    for(let i = 0; i < str.length; i++){
        str[i] = config2.prefix + str[i];
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
    files.forEach((file)=>file.replace('./', '')
    );
    const info = {
    };
    files.forEach((file)=>{
        const arr = file.split('/');
        info[arr[0]] = __default7.lstatSync(mod3.resolve(arr[0] || '')).isDirectory() && !__default7.lstatSync(mod3.resolve(arr[0] || '')).isFile() ? info[arr[0]] || {
        } : arr[0];
        if (typeof info[arr[0]] !== 'string') info[arr[0]][arr[1]] = __default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '')).isDirectory() && !__default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '')).isFile() ? info[arr[0]][arr[1]] || {
        } : arr[1];
        if (info[arr[0]] && info[arr[0]][arr[1]] && typeof info[arr[0]][arr[1]] !== 'string') info[arr[0]][arr[1]][arr[2]] = __default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '')).isDirectory() && !__default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '')).isFile() ? info[arr[0]][arr[1]][arr[2]] || {
        } : arr[2];
        if (info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && typeof info[arr[0]][arr[1]][arr[2]] !== 'string') info[arr[0]][arr[1]][arr[2]][arr[3]] = __default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isDirectory() && !__default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '')).isFile() ? info[arr[0]][arr[1]][arr[2]][arr[3]] || {
        } : arr[3];
        if (info[arr[0]] && info[arr[0]][arr[1]] && info[arr[0]][arr[1]][arr[2]] && info[arr[0]][arr[1]][arr[2]][arr[3]] && typeof info[arr[0]][arr[1]][arr[2]][arr[3]] !== 'string') info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] = __default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isDirectory() && !__default7.lstatSync(mod3.resolve(arr[0] || '', arr[1] || '', arr[2] || '', arr[3] || '', arr[4] || '')).isFile() ? info[arr[0]][arr[1]][arr[2]][arr[3]][arr[4]] || {
        } : arr[4];
    });
    const t = jsonTree(info['.'], true, false).replaceAll(/: \w+.\w+.+|: .\w+/gi, '').split('\n').map((value)=>value.replaceAll(/.+undefined/gi, '')
    ).filter((value)=>value.trim() !== ''
    ).join('\n');
    return t;
}
function dirTree(filename) {
    files.push(filename);
    const stats = __default7.lstatSync(filename);
    const info = {
        name: filename
    };
    if (stats.isDirectory()) {
        __default7.readdirSync(filename, {
            encoding: 'utf-8'
        })?.forEach((child)=>{
            info[child] = child;
            dirTree(filename + '/' + child);
        });
    } else return info;
}
async function tree() {
    print1('Files written');
    print1('');
    print1(`Making an visual representation of the folder tree...`);
    const tree1 = await __default8();
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
        str.push(`${config2.prefix}  ${(chalk2.red(key) + ':').padEnd('/x1B[31mstyle/x1B[39m:  '.length - 8)}  ${chalk2.green(`'${value}'`)}`);
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
    cpRecursive(resolve5(`${root}/../assets/${origin}`), '.');
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
async function generate({ logo ='public/logo.png' , manifest ='public/manifest.json'  }) {
    writeFileSync('public/_sculptr-pwa-assets-temp.html', '');
    const command = `npx pwa-asset-generator ${logo} public/icons --manifest ${manifest} --index public/_sculptr-pwa-assets-temp.html`;
    await exec(command);
    const res = readFileSync('public/_sculptr-pwa-assets-temp.html', 'utf8');
    unlinkSync('public/_sculptr-pwa-assets-temp.html');
    const links = res.split(`<head>`)[1].split(`</head>`)[0].trim().split('">').join('"/>');
    const srcExists = existsSync1('src');
    if (!srcExists) await exec('mkdir ./src');
    const ext = existsSync1('pages/_app.jsx') ? 'jsx' : existsSync1('pages/_app.tsx') ? 'tsx' : existsSync1('pages/_app.ts') ? 'ts' : 'js';
    writeFileSync(`src/PWAAssets.${ext}`, `import React from 'react';

  export default function PWAAssets()${ext.startsWith('ts') ? ': JSX.Element' : ''} {
    return (
      <>
        ${links}
      </>
    )
  }`);
    await exec(`npx prettier --write src/PWAAssets.${ext}`);
    const documentExists = existsSync1(`pages/_document.${ext}`);
    if (!documentExists) {
        writeFileSync(`pages/_document.${ext}`, `import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import PWAAssets from '../src/PWAAssets';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="icons/apple-icon-180.png" />
        <PWAAssets />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}`);
    } else {
        let doc = readFileSync(`pages/_document.${ext}`, 'utf8');
        if (!doc.includes('<PWAAssets />')) {
            if (!doc.includes('PWAAssets')) doc = `import PWAAssets from '../src/PWAAssets';\n` + doc;
            if (!doc.includes('Head')) {
                if (doc.includes("} from 'next/document'")) doc = doc.replace(`} from 'next/document'`, `,Head } from 'next/document'`);
                else if (doc.includes(" from 'next/document'")) doc = doc.replace(` from 'next/document'`, `, { Head } from 'next/document'`);
                else doc = 'import { Head } from "next/document";\n' + doc;
            }
            if (doc.includes('</Head>')) {
                doc = doc.replace(/<\/Head>/, `<PWAAssets />\n</Head>`);
            } else {
                doc = doc.replace(/<Html lang="en">/, `<Html lang="en"><Head><PWAAssets /></Head>`);
            }
        }
        doc = doc.split('{" "}').join('');
        writeFileSync(`pages/_document.${ext}`, doc);
    }
    await exec(`npx prettier --write pages/_document.${ext}`);
}
const chalk4 = new Chalk();
function add(file, { overwrite , loose  }) {
    const args = Deno.args.slice(1);
    const strict = loose !== true;
    let tsconfig = false;
    let sass = false;
    let scss = false;
    for(let i = 0; i < args.length; i++){
        if (file === 'tsconfig' || file === 'tsconfig.json' || file === 'tsc' || args[i] === 'tsconfig' || args[i] === 'tsconfig.json' || args[i] === 'tsc') tsconfig = true;
        if (file === 'sass' || args[i] === 'sass') sass = true;
        if (file === 'scss' || args[i] === 'scss') scss = true;
    }
    tsconfig && writeTs(overwrite, strict);
    sass && writeSass();
    scss && writeScss();
}
function writeTs(overwrite, strict) {
    const exists1 = existsSync1('./tsconfig.json');
    if (!exists1) copyFileSync(resolve5(`${root}/../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`), './tsconfig.json');
    else {
        if (!overwrite) {
            const tsc = JSON.parse(readFileSync(resolve5('./tsconfig.json'), 'utf-8'));
            const newTsc = JSON.parse(readFileSync(resolve5(`${root}/../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`), 'utf-8'));
            tsc.compilerOptions = {
                ...tsc.compilerOptions,
                ...newTsc.compilerOptions
            };
            writeFileSync('./tsconfig.json', JSON.stringify(tsc, null, 2));
        } else writeFileSync('./tsconfig.json', readFileSync(resolve5(`${root}/../assets/files/tsconfig${strict ? '-file' : '-loose'}.json`), 'utf8'));
    }
    console.log(chalk4.grey('sculptr:    ') + 'Added tsconfig.json');
}
function writeSass() {
    copyFolderRecursiveSync(resolve5(`${root}/../../../assets/files/sass`), resolve5('sass'));
}
function writeScss() {
    copyFolderRecursiveSync(resolve5(`${root}/../../../assets/files/scss`), resolve5('scss'));
}
const copyFileSync1 = function(source, target) {
    var targetFile = target;
    if (existsSync1(target)) {
        if (lstatSync(target).isDirectory()) {
            targetFile = join6(target, basename5(source));
        }
    }
    writeFileSync(targetFile, readFileSync(source));
};
function copyFolderRecursiveSync(source, target, recursiveMode) {
    let files2 = [];
    let param2;
    recursiveMode ? param2 = basename5(source) : param2 = '';
    const targetFolder = join6(target, param2);
    if (!existsSync1(targetFolder)) {
        mkdirSync(targetFolder);
    }
    if (lstatSync(source).isDirectory()) {
        files2 = readdirSync(source);
        files2.forEach(function(file) {
            const curSource = join6(source, file);
            if (lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder, true);
            } else {
                copyFileSync1(curSource, targetFolder);
            }
        });
    }
}
const program = new Command();
program.version('0.0.0').description('A command line tool for creating your projects');
program.command('build <platform> <name>').alias('b').description("Builds scaffolding for a new project. <platform> should be 'next' or 'react' (other platforms are currently in development). <name> should be the name of the project, or directory to the project.").option('--s,--skip').option('--scss').option('--sass').option('--css').option('--ts,--typescript').option('--js,--javascript').action((platform, dir, args)=>{
    if (platform === 'n') platform = 'next';
    if (platform === 'r') platform = 'react';
    build(dir, {
        platform,
        booleanOptions: {
            ...args
        }
    });
});
program.command('add <name>').alias('a').option('-y --overwrite').option('--no-strict --loose').description('Adds a new asset to your project.').action(add);
program.command('next-pwa').description('Generates assets for PWA').option('--logo <path>').option('--manifest <path>').action(generate);
program.parse(Deno.args);
const __default9 = {
    build,
    generate,
    add
};
export { __default9 as default };
