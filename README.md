# Document Format Converter API

## **Introduction**

Description: The following api converts documents between String, JSON & XML formats

Technologies: The project uses Express.js as the server framework in Node.js for handling HTTP requests

## **Table of Contents**

- [Requirements](#requirements)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)

## **Requirements**

- **Node.js**: Version 14 or above.
- **npm**: Version 6 or above.

## **Installation & Running Instructions**

For Install:

1. Clone the repo

2. Install modules and dependencies

3. Build and compile the code

To start the server and test the api:

1. npm start

2. To send a POST request either use Postman or send the following cURL directly to the running api

curl -X POST http://localhost:3000/convert \
-H "Content-Type: application/json" \
-d '{
"document": "ISA*00* _00_ *12*5032337522 *01*048337914 *190225*1532*^*00501*000001367*0*P*>~GS*PO*SENDER*RECEIVER*20190325*1532*572*X*005010~ST*850*000000579~BEG*00*SA*0097129080\*\*20190325~REF*DP*0041~REF*IA*34354104~PER*BD*LD*TE*(503) 232-8844~FOB*CC~CSH\*Y~ITD**2\*\*\***60**\***NET 60 DAYS~DTM*001*20190404~DTM*002*20190411~DTM*010*20190325~N9*ZZ*COMMENTS~MTX**REP:BOB:573-888-8888~MTX**FAX #:573-888-8888~MTX**PROVIDE A GENERAL COMPLIANCY CERTIFICATE FOR~MTX**APPLICABLE PRODUCTS MANUFACTURED AFTER~MTX**NOVEMBER 12, 2008 INDICATING THAT THE PRODUCTS~MTX**HAVE MET ALL APPLICABLE PRODUCT SAFETY STANDARDS~MTX**AS PER U.S. CONSUMER PRODUCTS SAFETY IMPROVEMENT~MTX**ACT OF 2008. CERTIFICATES THAT ARE NOT ALREADY~MTX**ACCESSIBLE IN ELECTRONIC FORMAT ACCORDING TO~MTX**CPSC GUIDELINES SHOULD BE~MTX\**EMAILED TO notarealemail@orderful.com~N1*BT*DEPT STORE, INC.*9*0079088090000~N3*

## **API Endpoints**

POST /convert/

Description: Takes a document in any fo the 3 formats and converts them to the new desired format.

Request Params:
document (string | object): The input document to convert.
targetFormat (string): The desired output format (string, json, xml).
separators (object, optional): Delimiters for string conversions.

## **Test**

The projects so far has a number of unit test which can be found with the `npm run test` command.

In future implementation, integration and end-to-end test should be added for better reliability and error-prevention.

## **Credits & Contribution**

The following project was developed by Yaroslav Naftulyev. For any bug reports or feature suggestion please reach out to naftulyevyaroslav@yahoo.ca
