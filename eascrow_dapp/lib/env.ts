import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const envValues = createEnv({
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'NEXT_PUBLIC_',

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_TESTNET_ADMIN_PUBLIC_KEY: z.string().min(1),
    NEXT_PUBLIC_TESTNET_ADMIN_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_TESTNET_RPC_URL: z.string().url(),
    NEXT_PUBLIC_TESTNET_HORIZON_URL: z.string().url(),
    NEXT_PUBLIC_TESTNET_NETWORK_PASSPHRASE: z.string().min(1),
    NEXT_PUBLIC_TESTNET_EASCROW_WASM_HASH: z.string().min(1),

    NEXT_PUBLIC_MAINNET_ADMIN_PUBLIC_KEY: z.string().min(1),
    NEXT_PUBLIC_MAINNET_ADMIN_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_MAINNET_RPC_URL: z.string().url(),
    NEXT_PUBLIC_MAINNET_HORIZON_URL: z.string().url(),
    NEXT_PUBLIC_MAINNET_NETWORK_PASSPHRASE: z.string().min(1),
    NEXT_PUBLIC_MAINNET_EASCROW_WASM_HASH: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_TESTNET_ADMIN_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_TESTNET_ADMIN_PUBLIC_KEY,
    NEXT_PUBLIC_TESTNET_ADMIN_SECRET_KEY:
      process.env.NEXT_PUBLIC_TESTNET_ADMIN_SECRET_KEY,
    NEXT_PUBLIC_TESTNET_RPC_URL: process.env.NEXT_PUBLIC_TESTNET_RPC_URL,
    NEXT_PUBLIC_TESTNET_HORIZON_URL:
      process.env.NEXT_PUBLIC_TESTNET_HORIZON_URL,
    NEXT_PUBLIC_TESTNET_NETWORK_PASSPHRASE:
      process.env.NEXT_PUBLIC_TESTNET_NETWORK_PASSPHRASE,
    NEXT_PUBLIC_TESTNET_EASCROW_WASM_HASH:
      process.env.NEXT_PUBLIC_TESTNET_EASCROW_WASM_HASH,
    NEXT_PUBLIC_MAINNET_ADMIN_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MAINNET_ADMIN_PUBLIC_KEY,
    NEXT_PUBLIC_MAINNET_ADMIN_SECRET_KEY:
      process.env.NEXT_PUBLIC_MAINNET_ADMIN_SECRET_KEY,
    NEXT_PUBLIC_MAINNET_RPC_URL: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
    NEXT_PUBLIC_MAINNET_HORIZON_URL:
      process.env.NEXT_PUBLIC_MAINNET_HORIZON_URL,
    NEXT_PUBLIC_MAINNET_NETWORK_PASSPHRASE:
      process.env.NEXT_PUBLIC_MAINNET_NETWORK_PASSPHRASE,
    NEXT_PUBLIC_MAINNET_EASCROW_WASM_HASH:
      process.env.NEXT_PUBLIC_MAINNET_EASCROW_WASM_HASH,
  },
  /**
   * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

export class Env {
  private readonly testnet: {
    adminPublicKey: string;
    adminSecretKey: string;
    rpcUrl: string;
    horizonUrl: string;
    networkPassphrase: string;
    wasmHash: string;
  } = {
    adminPublicKey: envValues.NEXT_PUBLIC_TESTNET_ADMIN_PUBLIC_KEY,
    adminSecretKey: envValues.NEXT_PUBLIC_TESTNET_ADMIN_SECRET_KEY,
    rpcUrl: envValues.NEXT_PUBLIC_TESTNET_RPC_URL,
    horizonUrl: envValues.NEXT_PUBLIC_TESTNET_HORIZON_URL,
    networkPassphrase: envValues.NEXT_PUBLIC_TESTNET_NETWORK_PASSPHRASE,
    wasmHash: envValues.NEXT_PUBLIC_TESTNET_EASCROW_WASM_HASH,
  };

  private readonly mainnet: {
    adminPublicKey: string;
    adminSecretKey: string;
    rpcUrl: string;
    horizonUrl: string;
    networkPassphrase: string;
    wasmHash: string;
  } = {
    adminPublicKey: envValues.NEXT_PUBLIC_MAINNET_ADMIN_PUBLIC_KEY,
    adminSecretKey: envValues.NEXT_PUBLIC_MAINNET_ADMIN_SECRET_KEY,
    rpcUrl: envValues.NEXT_PUBLIC_MAINNET_RPC_URL,
    horizonUrl: envValues.NEXT_PUBLIC_MAINNET_HORIZON_URL,
    networkPassphrase: envValues.NEXT_PUBLIC_MAINNET_NETWORK_PASSPHRASE,
    wasmHash: envValues.NEXT_PUBLIC_MAINNET_EASCROW_WASM_HASH,
  };

  constructor(private readonly network: 'testnet' | 'mainnet' = 'testnet') {
    this.network = network;
  }

  get env() {
    return this.network?.toLowerCase() === 'testnet'
      ? this.testnet
      : this.mainnet;
  }
}
