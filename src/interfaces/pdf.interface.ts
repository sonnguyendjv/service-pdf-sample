export const protobufPackage = "pdf";

export interface PdfGeneratingRequest {
  pdfData: PdfGeneratingRequest_Pdf[];
}

export interface PdfGeneratingRequest_Pdf {
  data: Uint8Array;
  fileName: string;
}

export interface PdfGeneratingResponse {
  fileName: string;
}

export interface PdfService {
  Generate(request: PdfGeneratingRequest): Promise<PdfGeneratingResponse>;
}
