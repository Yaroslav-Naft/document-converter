import {Request, Response, NextFunction} from "express";
import {XMLValidator} from "fast-xml-parser";

export function validateConversionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {document, outputFormat, separator} = req.body;

  if (!outputFormat) {
    return res.status(400).json({
      error: "Validation Error: Output format is required.",
    });
  }

  const format = outputFormat.toLowerCase();

  switch (format) {
    case "string":
      if (typeof document === "object") {
        if (!isValidJSON(document)) {
          return res.status(400).json({
            error: "Validation Error: Invalid JSON format provided.",
          });
        }
      } else if (typeof document === "string") {
        if (XMLValidator.validate(document)) {
          if (!hasValidSeparators(separator)) {
            return res.status(400).json({
              error:
                "Validation Error: Missing line or element separators for string format.",
            });
          }
        } else if (!isValidStringFormat(document, separator)) {
          return res.status(400).json({
            error:
              "Validation Error: Invalid string format. Each segment should have elements separated correctly.",
          });
        }
      } else {
        return res.status(400).json({
          error: "Validation Error: Unsupported input type for string format.",
        });
      }
      break;

    case "json":
      if (typeof document === "string" && !XMLValidator.validate(document)) {
        return res.status(400).json({
          error: "Validation Error: Invalid XML format provided.",
        });
      } else if (typeof document !== "string" && typeof document !== "object") {
        return res.status(400).json({
          error: "Validation Error: Unsupported input type for JSON format.",
        });
      }
      break;

    case "xml":
      if (typeof document === "object" && !isValidJSON(document)) {
        return res.status(400).json({
          error: "Validation Error: Invalid JSON format provided.",
        });
      } else if (typeof document === "string") {
        if (!XMLValidator.validate(document)) {
          return res.status(400).json({
            error: "Validation Error: Invalid XML format provided.",
          });
        } else if (!hasValidSeparators(separator)) {
          return res.status(400).json({
            error:
              "Validation Error: Missing line or element separators for string format.",
          });
        }
      }
      break;

    default:
      return res.status(400).json({
        error: "Validation Error: Unsupported output format.",
      });
  }

  next();
}

function isValidJSON(document: any): boolean {
  try {
    JSON.stringify(document);
    return true;
  } catch {
    return false;
  }
}

function hasValidSeparators(separator: any): boolean {
  return separator && separator.line && separator.element;
}

function isValidStringFormat(
  document: string,
  separator: {line: string; element: string}
): boolean {
  const lines = document.split(separator.line);
  return lines.every((line) => line.split(separator.element).length > 1);
}
