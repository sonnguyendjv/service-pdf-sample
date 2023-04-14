import { Injectable, Logger } from "@nestjs/common";
import puppeteer from "puppeteer";
import { promisify } from "util";
import {
  PdfGeneratingRequest,
  PdfGeneratingResponse
} from "../generated/proto/pdf";
import * as fs from "fs";
import * as os from "os";

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly TEMP_DIR = os.tmpdir();
  private readonly PDF_EXTENSION = ".pdf";
  private readonly SEP = "/";
  private readonly PDF_FORMAT = "A4";

  async generatePdf(
    request: PdfGeneratingRequest
  ): Promise<PdfGeneratingResponse> {
    const promises = [];
    request.files.forEach((pdf) => {
      promises.push(this.makePdfFile(pdf.data, pdf.fileName));
    });

    const filePaths = await Promise.all(promises);

    return { paths: filePaths };
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
    const pdf = await page.pdf({ format: this.PDF_FORMAT });

    // Close the browser
    await browser.close();

    // Return the pdf buffer
    return pdf;
  }

  async savePDF(pdf: Buffer, fileName: string): Promise<string> {
    const writeFile = promisify(fs.writeFile);

    // Write the buffer to a file with the given name
    const path = `${this.TEMP_DIR}${this.SEP}${fileName}${this.PDF_EXTENSION}`;
    await writeFile(path, pdf);
    return path;
  }
}
