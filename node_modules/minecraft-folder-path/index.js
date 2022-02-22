const path = require("path");
const os = require("os");

let folder = "";

switch (os.type()) {
    case "Darwin":
        folder = path.join(
            os.homedir(),
            "/Library",
            "Application Support",
            "minecraft"
        );
        break;

    case "win32":
    case "Windows_NT":
        folder = path.join(
            process.env.APPDATA ||
                path.join(os.homedir(), "AppData", "Roaming"),
            ".minecraft"
        );
        break;

    default:
        folder = path.join(os.homedir(), ".minecraft");
        break;
}

module.exports = folder;
