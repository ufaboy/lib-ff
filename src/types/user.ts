import { RegistrationResponseJSON } from '@simplewebauthn/types';

interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  access_token: string;
  role: string | null;
  currentChallenge: string | null;
}

interface Authenticator {
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  credentialID: string;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  credentialPublicKey: Buffer;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number;
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  credentialDeviceType: string;
  // SQL: `BOOL` or whatever similar type is supported
  credentialBackedUp: boolean;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
  transports?: string;
};

interface RegistrationResponseJSONExtended extends RegistrationResponseJSON {
username: string
}

export type { User, Authenticator, RegistrationResponseJSONExtended };