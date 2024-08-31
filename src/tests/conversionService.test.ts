import {
  convertDocument,
  convertStringToJSON,
  convertJSONToXML,
  convertXMLToJSON,
  convertJSONToString,
  DocumentWithRoot,
} from "../services/conversionService";

describe("convertDocument function", () => {
  const separator = {
    line: "~",
    element: "*",
  };

  it("should correctly convert JSON to XML format", async () => {
    const document: DocumentWithRoot = {
      root: {productId: [{id: "value"}]},
    };
    const result = await convertDocument({document, outputFormat: "xml"});
    expect(result).toMatch(/<productId>\s*<id>value<\/id>\s*<\/productId>/);
  });

  it("should correctly convert a plain string to XML format", async () => {
    const document = "productId*123*456~contactId*789";
    const result = await convertDocument({
      document,
      outputFormat: "xml",
      separator,
    });
    expect(result).toMatch(
      /<productId>\s*<productId1>123<\/productId1>\s*<productId2>456<\/productId2>\s*<\/productId>/
    );
    expect(result).toMatch(
      /<contactId>\s*<contactId1>789<\/contactId1>\s*<\/contactId>/
    );
  });

  it("should correctly convert XML to JSON format", async () => {
    const document = "<root><productId>value</productId></root>";
    const result = await convertDocument({document, outputFormat: "json"});
    expect(result).toEqual({root: {productId: ["value"]}});
  });

  it("should correctly convert a plain string to JSON format", async () => {
    const document = "productId*123*456~contactId*789";
    const result = await convertDocument({
      document,
      outputFormat: "json",
      separator,
    });
    expect(result).toEqual({
      root: {
        productId: [{productId1: "123", productId2: "456"}],
        contactId: [{contactId1: "789"}],
      },
    });
  });

  it("should correctly convert JSON to a plain string format", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{productId1: "123", productId2: "456"}],
        contactId: [{contactId1: "789"}],
      },
    };
    const result = await convertDocument({
      document,
      outputFormat: "string",
      separator,
    });
    expect(result).toBe("productId*123*456~contactId*789");
  });
});

describe("convertStringToJSON function", () => {
  const separator = {
    line: "~",
    element: "*",
  };

  it("should convert a string with multiple segments and elements to JSON", async () => {
    const document = "productId*101*102~addressId*201*202~contactId*301";
    const result = await convertStringToJSON(document, separator);
    expect(result).toEqual({
      root: {
        productId: [{productId1: "101", productId2: "102"}],
        addressId: [{addressId1: "201", addressId2: "202"}],
        contactId: [{contactId1: "301"}],
      },
    });
  });

  it("should handle segments with no values properly", async () => {
    const document = "productId~addressId*789~contactId";
    const result = await convertStringToJSON(document, separator);
    expect(result).toEqual({
      root: {
        productId: [{}],
        addressId: [{addressId1: "789"}],
        contactId: [{}],
      },
    });
  });

  it("should return an empty object for an empty string input", async () => {
    const document = "";
    const result = await convertStringToJSON(document, separator);
    expect(result).toEqual({root: {}});
  });
});

describe("convertJSONToXML function", () => {
  it("should convert JSON objects to XML", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{id: "value1"}],
        addressId: [{street: "123 Street"}],
      },
    };
    const result = await convertJSONToXML(document);
    expect(result).toMatch(
      /<productId>\s*<id>value1<\/id>\s*<\/productId>\s*<addressId>\s*<street>123 Street<\/street>\s*<\/addressId>/
    );
  });

  it("should handle JSON arrays correctly when converting to XML", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{id: "123"}, {id: "456"}, {id: "789"}],
      },
    };
    const result = await convertJSONToXML(document);
    expect(result).toMatch(
      /<productId>\s*<id>123<\/id>\s*<\/productId>\s*<productId>\s*<id>456<\/id>\s*<\/productId>\s*<productId>\s*<id>789<\/id>\s*<\/productId>/
    );
  });
});

describe("convertXMLToJSON function", () => {
  it("should correctly convert nested XML to JSON", async () => {
    const document =
      "<root><productId>value1</productId><addressId><street>123 Street</street></addressId></root>";
    const result = await convertXMLToJSON(document);
    expect(result).toEqual({
      root: {
        productId: ["value1"],
        addressId: [{street: ["123 Street"]}],
      },
    });
  });

  it("should correctly handle XML attributes", async () => {
    const document = '<root><productId attr="value">content</productId></root>';
    const result = await convertXMLToJSON(document);
    expect(result).toEqual({
      root: {
        productId: [{$: {attr: "value"}, _: "content"}],
      },
    });
  });
});

describe("convertJSONToString function", () => {
  const separator = {
    line: "~",
    element: "*",
  };

  it("should handle objects correctly when converting JSON to string", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{productId1: "123", productId2: "456"}],
        contactId: [{contactId1: "789"}],
      },
    };
    const result = await convertJSONToString(document, separator);
    expect(result).toBe("productId*123*456~contactId*789");
  });

  it("should handle arrays as values in JSON objects correctly", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{productId1: "123,456", productId2: "789"}],
      },
    };
    const result = await convertJSONToString(document, separator);
    expect(result).toBe("productId*123,456*789");
  });

  it("should handle empty objects correctly when converting JSON to string", async () => {
    const document: DocumentWithRoot = {
      root: {
        productId: [{}],
        contactId: [{contactId1: "123"}],
      },
    };
    const result = await convertJSONToString(document, separator);
    expect(result).toBe("productId~contactId*123");
  });
});
