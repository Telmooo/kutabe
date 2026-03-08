import path from "path";
import Mocha from "mocha";
import { glob } from "glob";

export async function run(): Promise<void> {
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((c, error) => {
    glob("**/**.test.js", { cwd: testsRoot })
      .then((files) => {
        files.forEach((file) => mocha.addFile(path.resolve(testsRoot, file)));

        try {
          mocha.run((failures) => {
            if (failures > 0) {
              error(new Error(`${failures} tests failed.`));
            } else {
              c();
            }
          });
        } catch (err) {
          error(err);
        }
      })
      .catch((err) => {
        return error(err);
      });
  });
}
