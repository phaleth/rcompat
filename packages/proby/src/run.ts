import blue from "@rcompat/cli/color/blue";
import green from "@rcompat/cli/color/green";
import red from "@rcompat/cli/color/red";
import print from "@rcompat/cli/print";
import type FileRef from "@rcompat/fs/FileRef";
import type Result from "@rcompat/test/Result";
import type Test from "@rcompat/test/Test";
import repository from "@rcompat/test/repository";

const endings = [".spec.ts", ".spec.js"];

export default async (root: FileRef, subrepo?: string) => {
  const files = await root.list(file =>
    endings.some(ending => file.path.endsWith(ending)), { recursive: true });

  if (files.length === 0) {
    return;
  }

  for (const file of files) {
    repository.current(file);
    await file.import();
  }

  if (subrepo !== undefined) {
    print(`${blue(subrepo)}\n`);
  }

  const failed: [Test, Result<unknown>][] = [];

  for await (const test of repository.run()) {
    for (const result of test.results) {
      if (result.passed) {
        print(green("o"));
      } else {
        failed.push([ test, result ]);
        print(red("x"));
      }
    }
  }

  repository.reset();

  if (failed.length > 0) {
    print("\n");
    for (const [ test, result ] of failed) {
      print(`${test.file.debase(root)} ${red(test.name)} \n`);
      print(`  expected  ${result.expected}\n`);
      print(`  actual    ${result.actual}\n`);
    }
  }
  print("\n");
};
