export default {
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  testMatch: ["**/*.test.js"],
  moduleFileExtensions: ["js", "json"],
  transform: {}, // no Babel/ts-jest needed
};
