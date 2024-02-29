import { watch, copyFile, lstatSync } from 'fs';
import { parseArgs } from 'util';

let { values: { src, dest, java } } = parseArgs({
  args: Bun.argv,
  options: {
    src: {
      type: 'string',
    },
    dest: {
      type: 'string',
    },
    java: {
      type: 'string',
    },
  },
  allowPositionals: true,
});

if (java) {
  src = `${java}/src/main/resources`;
  dest = `${java}/target/classes`;
}

if (!src || !dest) {
  console.error('Usage: bunsync [--src <src> --dest <dest>] [--java <module>]');
  process.exit(1);
}

watch(src, { recursive: true }, async (event, filename) => {
  console.log(`Detected ${event} on ${src}/${filename}`);
  if (filename.endsWith('~')) {
    return;
  }
  if (event !== 'change') {
    return;
  }
  if (lstatSync(`${src}/${filename}`).isDirectory()) {
    return;
  }
  console.log(`Copying ${src}/${filename} to ${dest}/${filename}`);
  copyFile(`${src}/${filename}`, `${dest}/${filename}`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Copied ${src}/${filename} to ${dest}/${filename}`);
  });
});

console.log(`Watching ${src} for changes...`);
