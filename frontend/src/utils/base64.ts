class Base64 {
  static encode(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  static decode(str: string) {
    const binaryString = window.atob(str);
    const len = binaryString.length;
    const bytes = new Uint8Array(new ArrayBuffer(len));
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}

export default Base64;
