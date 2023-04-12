import { ConfigData } from "./config.interface";
import * as process from "process";
import * as dotenv from "dotenv";

dotenv.config();
export const DEFAULT_CONFIG: ConfigData = {
  port: Number(process.env.GRPC_SERVER_PORT || 50051),
  host: process.env.HOST || "localhost",
  protoPath: process.env.PROTO_PATH || "proto/pdf.proto",
  protoPackage: process.env.PROTO_PACKAGE || "pdf"
};
