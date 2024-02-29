import Base64 from './base64';

class Gzip {
  static async compress(text: string) {
    const stream = new Blob([text]).stream();
    const compressedReadableStream = stream.pipeThrough(new CompressionStream('gzip'));
    const response = new Response(compressedReadableStream);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const compressedBase64 = Base64.encode(buffer);
    return compressedBase64;
  }

  static async decompress(compressedBase64: string) {
    const stream = new Blob([Base64.decode(compressedBase64)]).stream();
    const compressedReadableStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const response = new Response(compressedReadableStream);
    const blob = await response.blob();
    const text = await blob.text();
    return text;
  }
}

export default Gzip;
