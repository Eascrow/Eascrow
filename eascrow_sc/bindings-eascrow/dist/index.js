import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CC2P2SZKKEWCBJGD4BMM5AAGJNX2Z7FIVLNJCVJRXW4USVHK36DR7IKL",
    }
};
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABQAAAAAAAAAFYnV5ZXIAAAAAAAATAAAAAAAAAAZzZWxsZXIAAAAAABMAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAASYXV0aG9yaXplZF9hZGRyZXNzAAAAAAATAAAAAAAAAAVwcmljZQAAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAEZnVuZAAAAAIAAAAAAAAABWJ1eWVyAAAAAAAAEwAAAAAAAAASdG9rZW5zX3RvX3RyYW5zZmVyAAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAANcmVsZWFzZV9mdW5kcwAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAGcmVmdW5kAAAAAAAAAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        fund: (this.txFromJSON),
        release_funds: (this.txFromJSON),
        refund: (this.txFromJSON)
    };
}
