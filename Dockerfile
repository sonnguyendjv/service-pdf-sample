FROM node:18

RUN apt-get update \
    && apt-get install -y protobuf-compiler

# config as guideline https://github.com/puppeteer/puppeteer/blob/main/docker/Dockerfile
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends

# copy fonts
COPY assets/fonts/*.ttf /usr/share/fonts/truetype/

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# generate model from proto
RUN protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=./src/generated/ ./proto/*.proto \
--ts_proto_opt=outputEncodeMethods=false,outputJsonMethods=false,outputClientImpl=false,outputServices=false

RUN npm run build

EXPOSE 50052

CMD ["npm", "run", "start:prod"]
