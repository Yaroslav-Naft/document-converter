import xml2js from "xml2js";
import {XMLValidator} from "fast-xml-parser";

type ConvertOptions = {
  document: string | object;
  outputFormat: "string" | "json" | "xml";
  separator?: {line: string; element: string};
};

export interface DocumentWithRoot {
  root: Record<string, Array<Record<string, string>>>;
}

type ConvertedDocument = string | DocumentWithRoot;

/**
 * Converts a document from one format to another
 *
 * @param {ConvertOptions} options - The document,output format & separators
 * @returns {ConvertedDocument} - The Specified output format
 * @throws {Error}
 */

export async function convertDocument({
  document,
  outputFormat,
  separator = {line: "~", element: "*"}, //default seperators to be used for Json/XML-> string covnersions
}: ConvertOptions): Promise<ConvertedDocument> {
  if (!outputFormat) {
    throw new Error("Output format is required.");
  }

  switch (outputFormat.toLowerCase()) {
    case "xml":
      if (typeof document === "object") {
        return await convertJSONToXML(document as DocumentWithRoot);
      } else {
        return await convertJSONToXML(
          await convertStringToJSON(document, separator)
        );
      }
    case "json":
      if (typeof document === "string") {
        if (XMLValidator.validate(document) === true) {
          return await convertXMLToJSON(document);
        } else {
          return await convertStringToJSON(document, separator);
        }
      } else {
        throw new Error("Logger: Invalid input, Expected String input format");
      }
    case "string":
      if (typeof document === "object") {
        return await convertJSONToString(
          document as DocumentWithRoot,
          separator
        );
      } else {
        const jsonConverted = await convertXMLToJSON(document);
        return await convertJSONToString(jsonConverted, separator);
      }
    default:
      console.error("Incorrect output format specified");
      throw new Error(
        `The following format specified is incorrect: ${outputFormat}`
      );
  }
}

/**
 * Converts a string to a JSON object.
 *
 * @param {string} document - The string to convert.
 * @returns {Object} - The converted JSON-like object.
 */

export async function convertStringToJSON(
  document: string,
  separator: {line: string; element: string}
): Promise<DocumentWithRoot> {
  const arrayOfSegments = document
    .split(separator.line)
    .filter((segment) => segment.trim() !== "");

  const newArr = arrayOfSegments.reduce((acc, segment) => {
    const arrayElements = segment.split(separator.element);

    const arrayValues = arrayElements.slice(1);

    const arrayKey = arrayElements[0];

    const convertedArray = arrayValues.map((val, i) => ({
      [`${arrayKey}${i + 1}`]: val,
    }));

    if (!acc[arrayKey]) {
      acc[arrayKey] = [];
    }

    const mergedObjects = convertedArray.reduce(
      (accObj, currentObj) => ({...accObj, ...currentObj}),
      {}
    );

    acc[arrayKey].push(mergedObjects);

    return acc;
  }, {} as Record<string, Array<Record<string, string>>>);

  return {root: newArr};
}

/**
 * Converts a JSON object to an XML string.
 *
 * @param {Object} json -The JSON object to convert.
 * @returns {string} - The converted XML string.
 */

export async function convertJSONToXML(
  document: DocumentWithRoot
): Promise<string> {
  try {
    const builder = new xml2js.Builder({
      renderOpts: {pretty: false},
    });
    const xml = builder.buildObject(document);
    return xml;
  } catch (error) {
    throw new Error(`Parsing failed with error: ${error}`);
  }
}
/**
 * Converts an XML string to a JSON object.
 *
 * @param xml - The xml string to convert.
 * @returns {object} json - The converted JSON object.
 */
export async function convertXMLToJSON(
  document: string
): Promise<DocumentWithRoot> {
  try {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(document);
    return result;
  } catch (error) {
    throw new Error(`Parsing failed with error: ${error}`);
  }
}

/**
 * Converts a JSON object to a string
 *
 * @param {object} json - The JSON object to convert.
 * @returns {string} string - The converted string
 */
export async function convertJSONToString(
  document: DocumentWithRoot,
  separator: {line: string; element: string}
): Promise<string> {
  const root = document.root; //extract document from root object
  if (!root) {
    throw new Error("Logger: Missing root property in document");
  }
  const linedSegments = Object.keys(root).reduce(
    (acc: string[], segmentKey: string) => {
      const valuesArr = root[segmentKey];

      const linedObject = valuesArr.map((valuesObj) => {
        //Handle edge case with no elements
        if (Object.keys(valuesObj).length === 0) {
          return `${segmentKey}`;
        }
        const linedElements = Object.keys(valuesObj)
          .map((objKey) => valuesObj[objKey])
          .join(separator.element);
        return `${segmentKey}${separator.element}${linedElements}`;
      });
      return acc.concat(linedObject);
    },
    [] as string[]
  );
  return linedSegments
    .filter((segment) => segment.trim() !== "")
    .join(separator.line);
}
