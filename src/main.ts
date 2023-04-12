import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { AppModule } from "./app.module";
import { DEFAULT_CONFIG } from "./config/config.default";
import * as process from "process";

async function bootstrap() {
  console.log(process.env.GRPC_SERVER_PORT);
  console.log(DEFAULT_CONFIG.port);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `${DEFAULT_CONFIG.host}:${DEFAULT_CONFIG.port}`,
        package: DEFAULT_CONFIG.protoPackage,
        protoPath: join(__dirname, DEFAULT_CONFIG.protoPath)
      }
    }
  );
  await app.listen();
}

bootstrap();
