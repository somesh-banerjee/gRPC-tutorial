const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/../service.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor  = grpc.loadPackageDefinition(packageDefinition);

console.log('protoDescriptor :', protoDescriptor );

const server = new grpc.Server();
server.addService(protoDescriptor.example.ExampleService.service, {
  UnaryCall: (call, callback) => {
    console.log('UnaryCall:', call.request.message);
    callback(null, { message: 'Hello from gRPC Server' });
  },
  StreamCall: (call) => {
    call.on('data', (request) => {
      console.log('StreamCall:', request.message);
      call.write({ message: 'Hello from gRPC Server' });
    });
    call.on('end', () => {
      call.end();
    });
  },
});

server.bindAsync('localhost:50055', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
        console.error(error);
    } else {
        console.log(`gRPC Server started on port ${port}`);
    }
});

