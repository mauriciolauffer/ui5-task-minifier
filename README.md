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

```yaml
builder:
  customTasks:
  - name: ui5-task-minifier
    afterTask: minify
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
