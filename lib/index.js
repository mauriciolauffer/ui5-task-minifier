import {default as Clean} from 'clean-css';
import {minify as htmlMinifier} from 'html-minifier-terser';

/**
 * Get configuration from ui5.yaml. Defaults everything to true.
 * @param {object} options
 * @returns {object}
 */
function getConfiguration(options) {
  const config = options.configuration;
  return {
    html: config?.html === false ? false : true,
    css: config?.css === false ? false : true,
    json: config?.json === false ? false : true
  };
}

/**
 * Write resouces changes
 * @param {module:@ui5/fs.Resource[]} resources
 * @param {module:@ui5/fs.DuplexCollection} workspace
 * @returns {module:@ui5/fs.Resource[]}
 */
function writeResources(resources, workspace) {
  return resources.map((resource) => workspace.write(resource));
}

/**
 * Minify CSS files
 * @param {module:@ui5/fs.DuplexCollection} workspace
 * @param {module:@ui5/logger/Logger} logger
 * @returns {Promise<module:@ui5/fs.Resource[]>}
 */
async function minifyCss(workspace, logger) {
  logger.info('Minifying CSS files...');
  const resources = await workspace.byGlob('**/*.css');
  return Promise.all(resources.map(async (resource) => {
    logger.verbose(resource.getName());
    const source = await resource.getString();
    const output = await new Clean({returnPromise: true, sourceMap: true}).minify(source);
    resource.setString(output.styles);
    return resource;
  }));
}

/**
 * Minify HTML files
 * @param {module:@ui5/fs.DuplexCollection} workspace
 * @param {module:@ui5/logger/Logger} logger
 * @returns {Promise<@ui5/fs.Resource[]>}
 */
async function minifyHtml(workspace, logger) {
  logger.info('Minifying HTML files...');
  const resources = await workspace.byGlob('**/*.html');
  return Promise.all(resources.map(async (resource) => {
    logger.verbose(resource.getName());
    const source = await resource.getString();
    const output = await htmlMinifier(source, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true
    });
    resource.setString(output);
    return resource;
  }));
}

/**
 * Minify JSON files
 * @param {module:@ui5/fs.DuplexCollection} workspace
 * @param {module:@ui5/logger/Logger} logger
 * @returns {Promise<@ui5/fs.Resource[]>}
 */
async function minifyJson(workspace, logger) {
  logger.info('Minifying JSON files...');
  const resources = await workspace.byGlob('**/*.json');
  return Promise.all(resources.map(async (resource) => {
    logger.verbose(resource.getName());
    const source = await resource.getString();
    const output = JSON.stringify(JSON.parse(source));
    resource.setString(output);
    return resource;
  }));
}

/**
 * Custom task API
 * @param {object} parameters
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies
 *      Reader to access resources of the project's dependencies
 * @param {module:@ui5/logger/Logger} parameters.log
 *      Logger instance for use in the custom task.
 *      This parameter is only available to custom task extensions
 *      defining Specification Version 3.0 and later.
 * @param {object} parameters.options Options
 * @param {module:@ui5/builder.tasks.TaskUtil} parameters.taskUtil
 *      Specification Version-dependent interface to a TaskUtil instance.
 *      See the corresponding API reference for details:
 *      https://sap.github.io/ui5-tooling/v3/api/@ui5_project_build_helpers_TaskUtil.html
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace
 *      Reader/Writer to access and modify resources of the
 *      project currently being built
 * @returns {Promise} Promise resolving once the task has finished
 */
export default async function({dependencies, log, options, taskUtil, workspace}) { // eslint-disable-line no-unused-vars
  const resouces = [];
  const config = getConfiguration(options);
  if (config.html) {
    const htmlResources = await minifyHtml(workspace, log);
    resouces.push(htmlResources);
  }

  if (config.css) {
    const cssResources = await minifyCss(workspace, log);
    resouces.push(cssResources);
  }

  if (config.json) {
    const jsonResources = await minifyJson(workspace, log);
    resouces.push(jsonResources);
  }
  await Promise.all(writeResources(resouces.flat(), workspace));
}
