import { watch, copyFile, lstatSync } from 'fs';
import { parseArgs } from 'util';

let { values: { src, dest, java, help } } = parseArgs({
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
    help: {
      type: 'boolean',
      default: false,
    },
  },
  allowPositionals: true,
});

if (java) {
  src = `${java}/src/main/resources`;
  dest = `${java}/target/classes`;
}

const usage = `
Usage: bunsync [--src <src> --dest <dest>] [--java <module>]

  --src  <folder> The source directory to watch

  --dest <folder> The destination directory to copy to

  --java <module> Use the default Java module layout.
                  Equivalent to --src <module>/src/main/resources --dest <module>/target/classes

  --help          Show this help message
`;

if (help) {
  console.log(usage);
  process.exit(0);
}

if (!src || !dest) {
  console.error(usage);
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
