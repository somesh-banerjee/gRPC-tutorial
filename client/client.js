const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH =  __dirname + '/../service.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).example;

const client = new protoDescriptor.ExampleService('localhost:50055', grpc.credentials.createInsecure());

// Unary Call
const unaryCall = () => {
  client.UnaryCall({ message: 'Hello from Node.js' }, (error, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Unary Response:', response.message);
    }
  });
};

// Stream Call
const streamCall = () => {
  const call = client.StreamCall();
  call.on('data', (response) => {
    console.log('Stream Response:', response.message);
  });
  call.on('end', () => {
    console.log('Stream Ended');
  });

  call.write({ message: 'Hello from Node.js' });
  call.write({ message: 'Hello again from Node.js' });
  call.end();
};

unaryCall();
streamCall();