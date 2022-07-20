const AdmZip = require("adm-zip");

const zip = new AdmZip();

// Add files & folders
zip.addLocalFile("./akane.exe");
zip.addLocalFile("./akane.bat");
zip.addLocalFile("./config.json.template");
zip.addLocalFile("./urls.json.template");
zip.addLocalFolder("./chromium-win", "./chromium-win");

// Write zip
zip.writeZip("./akane.zip");
