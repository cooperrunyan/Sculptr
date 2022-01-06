# Sculptr

Sculptr is a cli that allows users to build project scaffolding. When a user tells it to build a project, it asks them a set of questions, and based on their answer, it will write the correct project files. For example, if the user answered: `Typescript`, then, `SCSS`, It will write the code for a project using Typescript as a scripting language, and SCSS as a styling language.

---

## Prerequisites

- Npm
- Github

---

## Installation

```bash
$ npm i -g sculptr
```

---

## Build

### Step 1:

- Open the folder you want to build the project in
- Run:

```bash
$ sculptr build <platform> <name> [options]
```

#### For example

```bash
$ sculptr build react my-new-app --typescript
```

This will make a `my-new-app` folder in the current working directory, and initialize the project there. You could also use:

It will then ask:

```
? Do you want use SCSS, Sass, or CSS? (YOUR_ANSWER)
```

In this demo, SCSS is selected. It will then output the following

### Step 2:

```bash
sculptr:    Writing files...
sculptr:    Files written
sculptr:
sculptr:    Making an visual representation of the folder tree...
sculptr:    Tree created:
sculptr:
sculptr:    ├── LICENSE
sculptr:    ├── README.md
sculptr:    ├── package.json
sculptr:    ├── public
sculptr:    |  ├── favicon.ico
sculptr:    |  ├── index.html
sculptr:    |  ├── logo192.png
sculptr:    |  ├── logo512.png
sculptr:    |  ├── manifest.json
sculptr:    |  └── robots.txt
sculptr:    ├── src
sculptr:    |  ├── App.tsx
sculptr:    |  ├── index.tsx
sculptr:    |  ├── logo.svg
sculptr:    |  ├── react-app-env.d.ts
sculptr:    |  └── style
sculptr:    |     ├── abstracts
sculptr:    |     |  ├── _mixins.scss
sculptr:    |     |  ├── _utils.scss
sculptr:    |     |  └── _variables.scss
sculptr:    |     ├── app.scss
sculptr:    |     ├── base
sculptr:    |     |  └── _reset.scss
sculptr:    |     └── base.scss
sculptr:
sculptr:    Task completed
sculptr:      Project Name:  'my-new-app'
sculptr:      Username:      'YOUR GITHUB NAME'
sculptr:
sculptr:    Built a new project with: React, Typescript, Scss
sculptr:
sculptr:    Prewritten scripts (in ./package.json):
sculptr:      start:  'react-scripts start',
sculptr:      build:  'react-scripts build',
sculptr:      test:   'react-scripts test',
sculptr:      eject:  'react-scripts eject'
```

---

### How it works

#### Username

It gets the Username for the project by running `git config --global --get user.name` to get the user's github name. I chose this to keep the cli and user experience simple, and a lot of people have github.

#### Project Name

Sculptr gets the project name from the parent folder; ie. if it was building a project in: `/Users/<USER>/Desktop/new-project/` it would read `new-project` as the project name.

#### Project Name/Username Usage

Sculptr uses the project name in the package.json file, and the README.md. It uses the Username in the package.json file (author), in the README.md, and the LICENSE file.

### Arguments

- `<platform>` The type of app that sculptr creates ('next', or 'react')
- `<name>` The name of the app. Could be a directory or a word, if the value for "name" is "." it uses the parent folder's name, and initializes in the parent folder

### Flags

- `--skip` This skips installing `node_modules` and doesn't run `npm i`
- `--typescript`, `--ts` This sets the script to typescript
- `--javascript`, `--js` This sets the script to javascript
- `--scss` This sets the style to scss
- `--sass` This sets the style to sass
- `--css` This sets the style to css

## Add

Adds an asset to the current working directory

Accepted values:

- `sass`
- `scss`
- `tsconfig`, `tsc`, or `ts`

```
$ sculptr add tsconfig
```
