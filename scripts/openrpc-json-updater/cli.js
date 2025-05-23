import fs from 'fs';
import { readJson, buildDatedFileName } from './utils/file.utils.js';
import { mergeDocuments } from './operations/merge.js';
import { generateReport } from './operations/report.js';
import { dereferenceDocument } from '@open-rpc/schema-utils-js';

const originalFilePath = './original-openrpc.json';
const modifiedFilePath = './modified-openrpc.json';

const originalJson = readJson(originalFilePath);
const modifiedJson = readJson(modifiedFilePath);

const [originalJsonDereferenced, modifiedJsonDereferenced] = await Promise.all([
  dereferenceDocument(originalJson),
  dereferenceDocument(modifiedJson),
]);

function parseArgs() {
  const argv = process.argv.slice(2);
  const result = { methodArg: undefined, keyArg: undefined, mergeFlag: false };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '-m':
      case '--method':
        result.methodArg = argv[i + 1];
        i++;
        break;
      case '-k':
      case '--key':
        result.keyArg = argv[i + 1];
        i++;
        break;
      case '-g':
      case '--merge':
        result.mergeFlag = true;
        break;
    }
  }
  return result;
}

(async () => {
  const { mergeFlag, methodArg, keyArg } = parseArgs();

  if (mergeFlag) {
    const merged = mergeDocuments(originalJsonDereferenced, modifiedJsonDereferenced);
    const outputPath = buildDatedFileName(modifiedFilePath);

    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`\n Merge completed. File created: '${outputPath}'.\n`);
    return;
  }

  await generateReport(originalJsonDereferenced, modifiedJsonDereferenced, {
    methodArg,
    keyArg,
  }).catch((err) => {
    console.error('Unexpected error while generating report:', err);
    process.exit(1);
  });
})();
