module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    rules: {
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
};