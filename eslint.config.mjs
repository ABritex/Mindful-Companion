import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import boundaries from "eslint-plugin-boundaries";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            boundaries,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "boundaries/element-types": [
                "error",
                {
                    default: "disallow",
                    rules: [
                        {
                            from: "features",
                            allow: ["features", "components", "lib", "data", "services", "auth", "redis"],
                        },
                        {
                            from: "app",
                            allow: ["features", "components", "lib", "data", "services", "auth", "redis"],
                        },
                        {
                            from: "components",
                            allow: ["components", "lib", "services", "auth"],
                        },
                        {
                            from: "lib",
                            allow: ["lib", "data", "services"],
                        },
                        {
                            from: "data",
                            allow: ["data", "lib", "services"],
                        },
                        {
                            from: "services",
                            allow: ["services", "lib", "data", "components", "auth"],
                        },
                        {
                            from: "auth",
                            allow: ["auth", "lib", "data", "components", "services"],
                        },

                    ],
                },
            ],
        },
        settings: {
            "boundaries/elements": [
                {
                    type: "features",
                    pattern: "features/*",
                },
                {
                    type: "app",
                    pattern: "app/*",
                },
                {
                    type: "components",
                    pattern: "components/*",
                },
                {
                    type: "lib",
                    pattern: "lib/*",
                },
                {
                    type: "data",
                    pattern: "data/*",
                },
                {
                    type: "services",
                    pattern: "services/*",
                },
                {
                    type: "auth",
                    pattern: "auth/*",
                },

            ],
        },
    },
];

export default eslintConfig;
