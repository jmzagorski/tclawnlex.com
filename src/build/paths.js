var appRoot = "src/";
var outputRoot = "dist/";
var exportSrvRoot = "export/";
var styleRoot = "styles/";

module.exports = {
  root: appRoot,
  source: appRoot + "**/*.js",
  html: appRoot + "**/*.html",
  css: appRoot + "**/*.css",
  style: [
    styleRoot + "**/*.css",
    "!" + styleRoot + "**/*.min.css"
  ],
  output: outputRoot,
  exportSrv: exportSrvRoot,
  styleRoot: styleRoot,
  doc: "./doc",
  e2eSpecsSrc: "test/e2e/src/**/*.js",
  e2eSpecsDist: "test/e2e/dist/"
};
