## Description

`service-pdf` A NestJS-based project rendering .html files to .pdf files. Generated files will be saved in /tmp directory

# In case install with docker
```bash
docker build -t service-pdf .
docker run --name service-pdf -p 50052:50052 service-pdf
```

# In case install without docker
## Step1: Local Installation

```bash
# Install required dependencies
$ npm install
```

## Step2: Install Compiler for transforming
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

## Step3: Running the app

Comment file .puppeteerrc.cjs when running on local

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

