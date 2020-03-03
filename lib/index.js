'use strict';

const CssMinifier = require('clean-css');
const htmlMinifier = require('html-minifier-terser');

function getConfiguration(options) {
  const config = options.configuration;
  return {
    html: (config && config.html === false) ? false : true,
    css: (config && config.css === false) ? false : true,
    json: (config && config.json === false) ? false : true,
  };
}

function writeResources(resources, workspace) {
  return resources.map((resource) => workspace.write(resource));
}

async function minifyCss(workspace) {
  const resources = await workspace.byGlob('**/*.css');
  return Promise.all(resources.map(async (resource) => {
    const source = await resource.getString();
    const output = await new CssMinifier({returnPromise: true}).minify(source);
    resource.setString(output.styles);
    return resource;
  }));
}

async function minifyHtml(workspace) {
  const resources = await workspace.byGlob('**/*.{html,htm}');
  return Promise.all(resources.map(async (resource) => {
    const source = await resource.getString();
    const output = htmlMinifier.minify(source, {collapseWhitespace: true, removeComments: true});
    resource.setString(output);
    return resource;
  }));
}

async function minifyJson(workspace) {
  const resources = await workspace.byGlob('**/*.json');
  return Promise.all(resources.map(async (resource) => {
    const source = await resource.getString();
    const output = JSON.stringify(JSON.parse(source));
    resource.setString(output);
    return resource;
  }));
}

/**
 * Task to minify HTML/CSS/JSON files
 *
 * @param {Object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise} Promise resolving once data has been written
 */
module.exports = async function({workspace, dependencies, options}) {
  const config = getConfiguration(options);
  if (config.html) {
    const htmlResources = await minifyHtml(workspace);
    await Promise.all(writeResources(htmlResources, workspace));
  }

  if (config.css) {
    const cssResources = await minifyCss(workspace);
    await Promise.all(writeResources(cssResources, workspace));
  }

  if (config.json) {
    const jsonResources = await minifyJson(workspace);
    await Promise.all(writeResources(jsonResources, workspace));
  }
};
