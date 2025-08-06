import crypto from 'crypto'

export default function createSHA256(value: string | number) {
  return crypto.createHash('sha256').update(String(value)).digest('hex')
}
