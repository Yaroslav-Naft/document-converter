import {Request, Response} from "express";
import {convertDocument} from "../services/conversionService";

/**
 * Handles the document conversion request and sends back the response.
 *
 * @param {Request} req - Incoming request object.
 * @param {Response} res - Outgoing response object.
 */
export const resultDocument = (req: Request, res: Response): void => {
  const {document, targetFormat, separators} = req.body;

  if (!document || !targetFormat) {
    res.status(400).json({
      message: "Validation failed: Missing Document and/or Target format",
    });
  }
  try {
    const result = convertDocument(document); //, targetFormat, separators
    res.status(200).json({result});
  } catch (err) {
    console.error(`Conversion failed with the following error: ${err}`);
    res.status(500).json({error: err});
  }
};
