const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

export function Encrypt(content) {
  const publicPem = fs.readFileSync(path.join(__dirname, './pub.pem'));
  const pubKey = publicPem.toString();
  const iv = crypto.randomBytes(128 / 8);
  const key = crypto.randomBytes(256 / 8);
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64'; /* 加密 */
  const algorithm = 'aes-256-cbc';
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const cipherChunks = [];
  cipherChunks.push(cipher.update(content, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  const crypted = crypto.publicEncrypt(pubKey, key); // 加密
  return { crypted, cipherChunks, iv };
}

export function Decrypt(crypted, cipherChunks, iv) {
  const privatePem = fs.readFileSync(path.join(__dirname, './pri.pem'));
  const prikey = privatePem.toString();
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64'; /* 加密 */
  const algorithm = 'aes-256-cbc';
  const decrypted = crypto.privateDecrypt(prikey, crypted); // 解密
  const decipher = crypto.createDecipheriv(algorithm, decrypted, iv);
  const plainChunks = [];
  for (let i = 0; i < cipherChunks.length; i += 1) {
    plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
  }
  plainChunks.push(decipher.final(clearEncoding));
  return plainChunks;
}

