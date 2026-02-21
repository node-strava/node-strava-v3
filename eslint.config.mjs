import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.mocha,
                ...globals.node,
            },
        },

        rules: {
            "no-return-await": "off",
        },
    },
];
