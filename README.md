# Sculptr

Sculptr is a cli that allows users to build project scaffolding. When a user tells it to build a project, it asks them a set of questions, and based on their answer, it will write the correct project files. For example, if the user answered: `Typescript`, then, `SCSS`, It will write the code for a project using Typescript as a scripting language, and SCSS as a styling language.

---

## Installation

### Deno

```bash
$ deno install --unstable -qAfn sculptr https://deno.land/x/sculptr/src/index.ts
```

---

## Build Web/Front/Frontend

### Step 1:

- Open the folder you want to build the project in
- Run:

```bash
$ sculptr build web <platform> <name> [options]
```

#### For example

```bash
$ sculptr build front react my-new-app --typescript
```

This will make a `my-new-app` folder in the current working directory, and initialize the project there.

It will then ask:

```
? Do you want use SCSS, Sass, or CSS? (YOUR_ANSWER)
```

In this demo, SCSS is selected. It will then output the following

### Step 2:

```bash

  Wrote files (21) (0.754s)

```

### Arguments

- `<platform>` The type of app that sculptr creates ('next', or 'react')
- `<name>` The name of the app. Could be a directory or a word, if the value for "name" is "." it uses the parent folder's name, and initializes in the parent folder

### Flags

- `--typescript`, `--ts` This sets the script to typescript
- `--javascript`, `--js` This sets the script to javascript
- `--scss` This sets the style to scss
- `--sass` This sets the style to sass
- `--css` This sets the style to css

## Build Api/Back/Backend

### Step 1:

- Open the folder you want to build the project in
- Run:

```bash
$ sculptr build api <platform> <name> [options]
```

#### For example

```bash
$ sculptr build backend oak my-new-app --typescript
```

This will make a `my-new-app` folder in the current working directory, and initialize the project there.

### Step 2:

```bash

  Wrote files (16) (0.754s)

```

### Arguments

- `<platform>` The type of app that sculptr creates ('oak', or 'express')
- `<name>` The name of the app. Could be a directory or a word, if the value for "name" is "." it uses the parent folder's name, and initializes in the parent folder

### Flags

- `--typescript`, `--ts` This sets the script to typescript
- `--javascript`, `--js` This sets the script to javascript

## Add

Adds an asset to the current working directory

Accepted values:

- `tsconfig`, `tsc`, or `ts`
- `license`, `lic`, `license.txt`

### Flags

- `--log` Only log the file to the console instead of writing it
- `-S`, `--no-strict` Uses less strict typescript settings
- `--next` Writes a tsconfig that caters to nextjs projects
- `--react` Writes a tsconfig that caters to react projects
- `--overwrite` Overwrites the preexisting tsconfig if it exists

```
$ sculptr add tsconfig
```

#### License

With license you can add any github-supported license type. For example:

```bash
$ sculptr add license wtfpl
```

```bash
$ sculptr add license isc
```

```bash
$ sculptr add l mit
```

```bash
$ sculptr add l 'Academic Free License'
```

```bash
$ sculptr add license 'GNU General Public License 3'
```

###### Note: `l` and `license` are interchangeable

###### Note: You can use the technical name for a license `Academic Free License v3.0` or `afl-3.0`.

###### Note: License type detection is based off of RegEx, so small typos generally can be overlooked.

## Update/Upgrade/Install

Updates sculptr to a given version (defaults to the latest)

```bash
$ sculptr update
```

```bash
$ sculptr upgrade X.X.X
```

```bash
$ sculptr upgrade latest
```

```bash
$ sculptr install X.X.X
```
