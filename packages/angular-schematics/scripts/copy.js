const fs = require("fs-extra");
const path = require("path");

function copySchematicsJson() {
  const src = path.join(__dirname, "..", "src", "collection.json");
  const fileSrc = path.join(__dirname, "..", "src", "add", "files");
  const dst = path.join(__dirname, "..", "dist", "collection.json");
  const fileDst = path.join(__dirname, "..", "dist", "add", "files");
  const schemaSrc = path.join(__dirname, "..", "src", "add", "schema.json");
  const schemaDst = path.join(__dirname, "..", "dist", "add", "schema.json");

  fs.removeSync(dst);
  fs.removeSync(fileDst);
  fs.copySync(src, dst);
  fs.copySync(fileSrc, fileDst);
  fs.copySync(schemaSrc, schemaDst);
}

copySchematicsJson();
