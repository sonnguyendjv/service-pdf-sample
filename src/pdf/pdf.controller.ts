import { ServerUnaryCall } from "@grpc/grpc-js";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  PdfGeneratingRequest,
  PdfGeneratingResponse
} from "../generated/proto/pdf";
import { PdfService } from "./pdf.service";

@Controller()
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @GrpcMethod("PdfService", "generate")
  async generate(
    request: PdfGeneratingRequest,
    metadata: any,
    call: ServerUnaryCall<any, any>
  ): Promise<PdfGeneratingResponse> {
    console.log(`Processing - ${request.pdfData.length} files`);

    const res = await this.pdfService.generatePdf(request);

    console.log("Done!");

    return res;
  }
}
