const xml2js = require("xml2js");
import {XMLValidator} from "fast-xml-parser";

type ConvertOptions = {
  document: string | object;
  outputFormat: "string" | "json" | "xml";
  separator?: {line: string; element: string};
};

type ConvertedDocument = string | object;

/**
 * Converts a document from one format to another.
 *
 * @param {ConvertOptions} options - An object containing the document, target format, and optional separators.
 * @returns {ConvertedDocument} - The converted document in the specified target format.
 * @throws {Error} If an unsupported target format is specified.
 */

export async function convertDocument({
  document,
  outputFormat,
  separator = {line: "~", element: "*"},
}: ConvertOptions): Promise<ConvertedDocument> {
  switch (outputFormat.toLowerCase()) {
    case "xml":
      if (typeof document === "object") {
        return convertJSONToXML(document);
      } else {
        return convertJSONToXML(convertStringToJSON(document, separator));
      }
    case "json":
      if (typeof document === "string") {
        if (XMLValidator.validate(document) === true) {
          return convertXMLToJSON(document);
        } else {
          return convertStringToJSON(document, separator);
        }
      }
    case "string":
      if (typeof document === "object") {
        return convertJSONToString(document, separator);
      } else {
        return convertJSONToString(convertXMLToJSON(document), separator);
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
) {
  const arrayOfSegments = document.split(separator.line);

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
  }, {} as Record<string, any>);
  return newArr;
}

/**
 * Converts a JSON object to an XML string.
 *
 * @param {Object} json - ≠The JSON object to convert.
 * @returns {string} - The converted XML string.
 */

export async function convertJSONToXML(document: Record<string, any>) {
  try {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(document);
    return xml;
  } catch (error) {
    console.error(`Parsing failed with error: ${error}`);
    throw error;
  }
}
/**
 * Converts an XML string to a JSON object.
 *
 * @param xml - The xml string to convert.
 * @returns {object} json - The converted JSON object.
 */
export async function convertXMLToJSON(document: string): Promise<any> {
  try {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(document);
    return result;
  } catch (error) {
    console.error(`Parsing failed with error: ${error}`);
    throw error;
  }
}

/**
 * Converts a JSON object to a string
 *
 * @param {object} json - The JSON object to convert.
 * @returns {string} string - The converted string
 */
export async function convertJSONToString(
  document: any,
  separator: {line: string; element: string}
): Promise<string> {
  const linedSegments = Object.keys(document).reduce((acc, segmentKey) => {
    const valuesArr = document[segmentKey];

    const linedObject = valuesArr.map((valuesObj) => {
      const linedElements = Object.keys(valuesObj)
        .map((objKey) => valuesObj[objKey])
        .join(separator.element);
      return `${segmentKey}${separator.element}${linedElements}`;
    });
    return acc.concat(linedObject);
  }, [] as string[]);
  return linedSegments.join(separator.line);
}
