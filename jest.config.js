/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Loads next.config.ts and .env files into the test environment
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: "babel",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 30000,
  // Mirrors the "paths" aliases in tsconfig.json (most specific first)
  moduleNameMapper: {
    "^#components/(.*)$": "<rootDir>/src/components/$1",
    "^#elements/(.*)$": "<rootDir>/src/components/elements/$1",
    "^#layouts/(.*)$": "<rootDir>/src/components/layouts/$1",
    "^#general/(.*)$": "<rootDir>/src/components/general/$1",
    "^#hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^#assets/(.*)$": "<rootDir>/src/assets/$1",
    "^#config/(.*)$": "<rootDir>/src/config/$1",
    "^#model/(.*)$": "<rootDir>/src/model/$1",
    "^#store/(.*)$": "<rootDir>/src/store/$1",
    "^#styles/(.*)$": "<rootDir>/src/styles/$1",
    "^#utils/(.*)$": "<rootDir>/src/utils/$1",
    "^#/(.*)$": "<rootDir>/src/$1",
    "^#test/(.*)$": "<rootDir>/test/$1",
  },
  collectCoverageFrom: [
    "src/app/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "src/store/utils/**/*.{ts,tsx}",
    "src/utils/**/*.{ts,tsx}",
    "!src/**/index.{ts,tsx}",
    "!src/app/layout.tsx",
  ],
};

// antd and its helpers ship ES modules, so they have to be compiled for Jest
const esmPackages = [
  "antd",
  "@ant-design",
  "@rc-component",
  "rc-[^/]+",
  "@babel/runtime",
];

module.exports = async () => {
  const jestConfig = await createJestConfig(config)();

  return {
    ...jestConfig,
    transformIgnorePatterns: [
      `/node_modules/(?!(${esmPackages.join("|")})/)`,
      "^.+\\.module\\.(css|sass|scss)$",
    ],
  };
};
