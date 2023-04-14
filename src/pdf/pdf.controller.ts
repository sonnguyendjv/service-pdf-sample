import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller, Logger } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  PdfGeneratingRequest,
  PdfGeneratingResponse
} from "../generated/proto/pdf";
import { PdfService } from "./pdf.service";

@Controller()
export class PdfController {
  private readonly logger = new Logger(PdfService.name);
  constructor(private readonly pdfService: PdfService) {}

  @GrpcMethod("PdfService", "generate")
  async generate(
    request: PdfGeneratingRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>
  ): Promise<PdfGeneratingResponse> {
    this.logger.log(`Processing : ${request.files.length} files`);

    const res = await this.pdfService.generatePdf(request);

    this.logger.log(res);
    this.logger.log("Done!");

    return res;
  }
}
