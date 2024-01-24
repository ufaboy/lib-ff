interface User {
  id: number;
  username: string;
  password: string;
  salt: string;
  access_token: string;
  role: string | null;
}

interface SignInRequestBody {
  username: string;
  id: string;
  rawId: string;
  response: {
    attestationObject: string;
    clientDataJSON: string;
    transports: Array<string>;
    publicKeyAlgorithm: string;
    publicKey: string;
    authenticatorData: string;
  };
}
interface SignInVerificationData {
  username: string;
  id: string;
  rawId: ArrayBuffer;
  response: {
    attestationObject: ArrayBuffer;
    clientDataJSON: ArrayBuffer;
    transports: Array<string>;
    publicKeyAlgorithm: string;
    publicKey: string;
    authenticatorData: string;
  };
}

export type { User, SignInRequestBody, SignInVerificationData };
