import { Injectable, Logger } from "@nestjs/common";
import puppeteer, { Page } from "puppeteer";
import { promisify } from "util";
import {
  PdfGeneratingRequest,
  PdfGeneratingResponse
} from "../interfaces/pdf.interface";
import * as fs from "fs";
import * as os from "os";

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly TEMP_DIR = os.tmpdir();
  private readonly PDF_EXTENSION = ".pdf";
  private readonly OS_SEP = "/";

  async generatePdf(
    request: PdfGeneratingRequest
  ): Promise<PdfGeneratingResponse> {
    const promises = [];
    request.pdfData.forEach((pdf) => {
      promises.push(this.makePdfFile(pdf.data, pdf.fileName));
    });

    const promise = await Promise.all(promises);
    this.logger.log(promise);

    return { fileName: "mock_file_name" };
  }

  async mergeHTMLsToPDF(
    htmlList: string[],
    outputPath: string,
    callback: (htmlList: string[], outputPath: string, page: Page) => string
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // const pdfOptions: PDFOptions = {
    //   format: "A4",
    //   printBackground: true,
    //   margin: {
    //     top: "1cm",
    //     right: "1cm",
    //     bottom: "1cm",
    //     left: "1cm"
    //   }
    // };
    //
    // const pdfDocs = [];
    //
    // for (const html of htmlList) {
    //   await page.setContent(html);
    //   const pdfDoc = await page.pdf(pdfOptions);
    //   pdfDocs.push(pdfDoc);
    // }
    //
    // await browser.close();
    //
    // const mergedPDF = Buffer.concat(pdfDocs);
    //
    // // write the merged PDF to disk
    // fs.writeFileSync(outputPath, mergedPDF);

    return callback(htmlList, outputPath, page);
  }

  async makePdfFile(
    htmlFileString: Uint8Array,
    fileName: string
  ): Promise<string> {
    try {
      this.logger.log(`rendering for ${fileName}`);
      const pdf = await this.renderPDFFromString(htmlFileString);
      return await this.savePDF(pdf, fileName);
    } catch (error) {
      this.logger.error(`error_processing_file::${fileName}`);
      this.logger.error(error);
    }
  }

  async renderPDFFromString(htmlFileString: Uint8Array): Promise<Buffer> {
    // Launch a headless browser and create a new page
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();

    // read file as a string value
    await page.setContent(new TextDecoder().decode(htmlFileString));
    await page.evaluateHandle("document.fonts.ready");

    // Generate a pdf buffer from the page content
    const pdf = await page.pdf({ format: "A4" });

    // Close the browser
    await browser.close();
    // Return the pdf buffer
    return pdf;
  }

  async savePDF(pdf: Buffer, fileName: string): Promise<string> {
    const writeFile = promisify(fs.writeFile);

    // Write the buffer to a file with the given name
    const path = `${this.TEMP_DIR}${this.OS_SEP}${fileName}${this.PDF_EXTENSION}`;
    await writeFile(path, pdf);
    return path;
  }
}
