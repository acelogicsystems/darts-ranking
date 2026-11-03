import js from "@eslint/js";
import globals from "globals";
import html from "eslint-plugin-html";

export default [
    {
        files: ["docs/*.html"],
        plugins: { html },
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: globals.browser,
        },
        rules: { ...js.configs.recommended.rules },
    },
];