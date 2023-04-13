## Description

`service-pdf` A NestJS-based project rendering .html files to .pdf files. 

## Installation

```bash
# Install required dependencies
$ npm install
```

## Generation
```
Protoc - the compiler transforms .proto files to .ts files
[Protoc](https://grpc.io/docs/protoc-installation)
```

```
# Linux
$ protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=src/generated/ proto/*.proto \
--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false,outputServices=false

# Windows
$ protoc --plugin=protoc-gen-ts_proto=.\node_modules\.bin\protoc-gen-ts_proto.cmd --ts_proto_out="src\generated" "proto\*.proto" --ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false,outputServices=false
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker
```bash
docker build -t service-pdf .
docker run --name service-pdf -p 50052:50052 service-pdf
```

