let stealTools = require("steal-tools");

stealTools.export({
    steal: {
        main: "src/export",
        config: __dirname + "/package.json!npm",
        "npmIgnore": ["devDependencies"]
    },
    options: {
        verbose: true
    },
    outputs: {
        /*"+global-js": {
            exports: {
                "build": "build",
            },
            dest: __dirname + "/dist/eric.js",
            minify: true
        },*/
        standalone: {
            format: "global",
            modules: ["src/export"],
            dest: __dirname + "/dist/eric.js",
            minify: true
        }
    }
});
