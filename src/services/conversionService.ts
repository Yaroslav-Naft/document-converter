const express = require("express");
const app = express();
const xml2js = require("xml2js");

type ConvertOptions = {
  document: string | object; // The input document, which can be a string or a JSON object
  outputFormat: "string" | "json" | "xml"; // The target format for conversion
  separators?: {line: string; element: string}; // Optional separators for string format conversion
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
  separators,
}: ConvertOptions): Promise<ConvertedDocument> {
  switch (outputFormat) {
    case "xml":
    case "json":
    case "string":
      if (typeof document === "string") {
        convertStringToJSON;
      }

      return convertStringToJSON();

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

export async function convertStringToJSON(document: String = testString) {
  const arrayOfSegments = document.split("~");

  const newArr = arrayOfSegments.reduce((acc, segment) => {
    const arrayElements = segment.split("*");

    const arrayValues = arrayElements.slice(1);

    const arrayKey = arrayElements[0];

    const convertedArray = arrayValues.map((val, i) => ({
      [`${arrayKey}${i + 1}`]: val,
    }));

    if (!acc[arrayKey]) {
      acc[arrayKey] = [];
    }

    const mergedObjects = convertedArray.reduce(
      (acc, current) => ({...acc, ...current}),
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
  // Create a new builder instance with default options
  const builder = new xml2js.Builder();

  const xml = builder.buildObject(document);

  return xml;
}
/**
 * Converts an XML string to a JSON object.
 *
 * @param xml - The xml string to convert.
 * @returns {object} json - The converted JSON object.
 */
export async function convertXMLtoJSON(document: string): Promise<any> {
  try {
    const parser = new xml2js.Parser();

    const result = await parser.parseStringPromise(document);
    return result;
  } catch (error) {
    console.error(`Parsing failed with error: ${error}`);
    throw error;
  }
}

//Test Data
const testJSON = {
  root: {
    ProductID1: ["4", "8", "15", "16", "23"],
    ProductID2: ["a", "b", "c", "d", "e"],
    AddressID: ["42", "108", "3", "14"],
    ContactID: ["59", "26"],
  },
};

const xmlData = `<root>
      <ProductID>4</ProductID>
      <ProductID>8</ProductID>
      <ProductID>15</ProductID>
      <ProductID>16</ProductID>
      <ProductID>23</ProductID>
      <AddressID>42</AddressID>
      <AddressID>108</AddressID>
      <AddressID>3</AddressID>
      <AddressID>14</AddressID>
      <ContactID>59</ContactID>
      <ContactID>26</ContactID>
    </root>`;

const testString =
  "ProductID*4*8*15*16*23~ProductID*a*b*c*d*e~AddressID*42*108*3*14~ContactID*59*26~";
