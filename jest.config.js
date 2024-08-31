module.exports = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Environment to run the tests
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ["ts", "tsx", "js"], // Recognize file extensions
  testMatch: ["**/tests/**/*.(test|spec).(ts|tsx|js)"], // Match test files
};
