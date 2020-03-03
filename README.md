# ui5-task-minifier

Task for [ui5-builder](https://github.com/SAP/ui5-builder) which enables minifying HTML/CSS/JSON files. These files are not minified by ui5-builder therefore you need a custom task for it.

## Install

```bash
npm install ui5-task-minifier --save-dev
```

## Configuration options (in `$yourapp/ui5.yaml`)

- **css**: `true`|`false` - Should minify CSS files? By default set to `true`
- **html**: `true`|`false` - Should minify HTML files? By default set to `true`
- **json**: `true`|`false` - Should minify JSON files? By default set to `true`

## Usage

1. Define the dependency in `$yourapp/package.json`:

```json
"devDependencies": {
    // ...
    "ui5-task-minifier": "*"
    // ...
},
"ui5": {
  "dependencies": [
    // ...
    "ui5-task-minifier",
    // ...
  ]
}
```

> As the devDependencies are not recognized by the UI5 tooling, they need to be listed in the `ui5 > dependencies` array. In addition, once using the `ui5 > dependencies` array you need to list all UI5 tooling relevant dependencies.

2. configure it in `$yourapp/ui5.yaml`:

```yaml
builder:
  customTasks:
  - name: ui5-task-minifier
    afterTask: uglify
    configuration:
      html: true
      css: true
      json: false
```

## Author
Mauricio Lauffer

 - LinkedIn: [https://www.linkedin.com/in/mauriciolauffer](https://www.linkedin.com/in/mauriciolauffer)

## License
[MIT](LICENSE)
