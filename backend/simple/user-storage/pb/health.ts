/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 0.0.0
 * source: health.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
import * as grpc_1 from "@grpc/grpc-js";
export namespace grpc.health.v1 {
    export class HealthCheckRequest extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            service?: string;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("service" in data && data.service != undefined) {
                    this.service = data.service;
                }
            }
        }
        get service() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set service(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        static fromObject(data: {
            service?: string;
        }): HealthCheckRequest {
            const message = new HealthCheckRequest({});
            if (data.service != null) {
                message.service = data.service;
            }
            return message;
        }
        toObject() {
            const data: {
                service?: string;
            } = {};
            if (this.service != null) {
                data.service = this.service;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.service.length)
                writer.writeString(1, this.service);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): HealthCheckRequest {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new HealthCheckRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.service = reader.readString();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): HealthCheckRequest {
            return HealthCheckRequest.deserialize(bytes);
        }
    }
    export class HealthCheckResponse extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            status?: HealthCheckResponse.ServingStatus;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("status" in data && data.status != undefined) {
                    this.status = data.status;
                }
            }
        }
        get status() {
            return pb_1.Message.getFieldWithDefault(this, 1, HealthCheckResponse.ServingStatus.UNKNOWN) as HealthCheckResponse.ServingStatus;
        }
        set status(value: HealthCheckResponse.ServingStatus) {
            pb_1.Message.setField(this, 1, value);
        }
        static fromObject(data: {
            status?: HealthCheckResponse.ServingStatus;
        }): HealthCheckResponse {
            const message = new HealthCheckResponse({});
            if (data.status != null) {
                message.status = data.status;
            }
            return message;
        }
        toObject() {
            const data: {
                status?: HealthCheckResponse.ServingStatus;
            } = {};
            if (this.status != null) {
                data.status = this.status;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.status != HealthCheckResponse.ServingStatus.UNKNOWN)
                writer.writeEnum(1, this.status);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): HealthCheckResponse {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new HealthCheckResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.status = reader.readEnum();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): HealthCheckResponse {
            return HealthCheckResponse.deserialize(bytes);
        }
    }
    export namespace HealthCheckResponse {
        export enum ServingStatus {
            UNKNOWN = 0,
            SERVING = 1,
            NOT_SERVING = 2,
            SERVICE_UNKNOWN = 3
        }
    }
    interface GrpcUnaryServiceInterface<P, R> {
        (message: P, metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
        (message: P, metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
        (message: P, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
        (message: P, callback: grpc_1.requestCallback<R>): grpc_1.ClientUnaryCall;
    }
    interface GrpcStreamServiceInterface<P, R> {
        (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
        (message: P, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<R>;
    }
    interface GrpWritableServiceInterface<P, R> {
        (metadata: grpc_1.Metadata, options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
        (metadata: grpc_1.Metadata, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
        (options: grpc_1.CallOptions, callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
        (callback: grpc_1.requestCallback<R>): grpc_1.ClientWritableStream<P>;
    }
    interface GrpcChunkServiceInterface<P, R> {
        (metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
        (options?: grpc_1.CallOptions): grpc_1.ClientDuplexStream<P, R>;
    }
    interface GrpcPromiseServiceInterface<P, R> {
        (message: P, metadata: grpc_1.Metadata, options?: grpc_1.CallOptions): Promise<R>;
        (message: P, options?: grpc_1.CallOptions): Promise<R>;
    }
    export abstract class UnimplementedHealthService {
        static definition = {
            Check: {
                path: "/grpc.health.v1.Health/Check",
                requestStream: false,
                responseStream: false,
                requestSerialize: (message: HealthCheckRequest) => Buffer.from(message.serialize()),
                requestDeserialize: (bytes: Buffer) => HealthCheckRequest.deserialize(new Uint8Array(bytes)),
                responseSerialize: (message: HealthCheckResponse) => Buffer.from(message.serialize()),
                responseDeserialize: (bytes: Buffer) => HealthCheckResponse.deserialize(new Uint8Array(bytes))
            },
            Watch: {
                path: "/grpc.health.v1.Health/Watch",
                requestStream: false,
                responseStream: true,
                requestSerialize: (message: HealthCheckRequest) => Buffer.from(message.serialize()),
                requestDeserialize: (bytes: Buffer) => HealthCheckRequest.deserialize(new Uint8Array(bytes)),
                responseSerialize: (message: HealthCheckResponse) => Buffer.from(message.serialize()),
                responseDeserialize: (bytes: Buffer) => HealthCheckResponse.deserialize(new Uint8Array(bytes))
            }
        };
        [method: string]: grpc_1.UntypedHandleCall;
        abstract Check(call: grpc_1.ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>, callback: grpc_1.sendUnaryData<HealthCheckResponse>): void;
        abstract Watch(call: grpc_1.ServerWritableStream<HealthCheckRequest, HealthCheckResponse>): void;
    }
    export class HealthClient extends grpc_1.makeGenericClientConstructor(UnimplementedHealthService.definition, "Health", {}) {
        constructor(address: string, credentials: grpc_1.ChannelCredentials, options?: Partial<grpc_1.ChannelOptions>) {
            super(address, credentials, options);
        }
        Check: GrpcUnaryServiceInterface<HealthCheckRequest, HealthCheckResponse> = (message: HealthCheckRequest, metadata: grpc_1.Metadata | grpc_1.CallOptions | grpc_1.requestCallback<HealthCheckResponse>, options?: grpc_1.CallOptions | grpc_1.requestCallback<HealthCheckResponse>, callback?: grpc_1.requestCallback<HealthCheckResponse>): grpc_1.ClientUnaryCall => {
            return super.Check(message, metadata, options, callback);
        };
        Watch: GrpcStreamServiceInterface<HealthCheckRequest, HealthCheckResponse> = (message: HealthCheckRequest, metadata?: grpc_1.Metadata | grpc_1.CallOptions, options?: grpc_1.CallOptions): grpc_1.ClientReadableStream<HealthCheckResponse> => {
            return super.Watch(message, metadata, options);
        };
    }
}