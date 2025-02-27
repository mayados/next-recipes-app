const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [
    ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:@next/next/recommended"),
    {
        rules: {
            "no-var": "off",
        },
    },
];