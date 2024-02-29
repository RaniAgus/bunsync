# bunsync
A Bun-based CLI tool to sync files

## Usage

```
bunsync [--src <src> --dest <dest>] [--java <module>]

  --src  <folder> The source directory to watch

  --dest <folder> The destination directory to copy to

  --java <module> Use the default Java module layout.
                  Equivalent to --src <module>/src/main/resources --dest <module>/target/classes

  --help          Show this help message
```
