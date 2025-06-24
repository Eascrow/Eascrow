import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const Errors = {};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Constructor/Initialization Args for the contract's `__constructor` method */
    { admin }, 
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy({ admin }, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAADVDb25zdHJ1Y3QgdGhlIGRlcGxveWVyIHdpdGggYSBwcm92aWRlZCBhZG1pbmlzdHJhdG9yLgAAAAAAAA1fX2NvbnN0cnVjdG9yAAAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==",
            "AAAAAAAAAHdEZXBsb3lzIHRoZSBjb250cmFjdCBvbiBiZWhhbGYgb2YgdGhlIGBEZXBsb3llcmAgY29udHJhY3QuCgpUaGlzIGhhcyB0byBiZSBhdXRob3JpemVkIGJ5IHRoZSBgRGVwbG95ZXJgcyBhZG1pbmlzdHJhdG9yLgAAAAAGZGVwbG95AAAAAAACAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAAAAAAEc2FsdAAAA+4AAAAgAAAAAQAAABM=",
            "AAAAAAAAAAAAAAAFaW5kZXgAAAAAAAAAAAAAAQAAAAw="]), options);
        this.options = options;
    }
    fromJSON = {
        deploy: (this.txFromJSON),
        index: (this.txFromJSON)
    };
}
