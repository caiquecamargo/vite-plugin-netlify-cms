import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { loadConfigFromFile } from 'vite';
import YAML from 'yaml';
import indexHTMLTemplate from './index.template';
import type {
  BooleanWidget,
  CodeWidget,
  ColorWidget,
  DateTimeWidget,
  FileCollection,
  FileCollectionEntry,
  FileWidget,
  FolderCollection,
  HiddenWidget,
  ImageWidget,
  ListWidget,
  MapWidget,
  MarkdownWidget,
  NetlifyCMSConfig,
  NumberWidget,
  ObjectWidget,
  RelationWidget,
  SelectWidget,
  StringWidget,
  TextWidget,
} from './types';

export function defineConfig(config: NetlifyCMSConfig): NetlifyCMSConfig {
  return config;
}
export function defineFolderCollection(collection: FolderCollection) {
  return collection;
}
export const defineFileCollection = (collection: FileCollection) => collection;
export const defineFileCollectionEntry = (collection: FileCollectionEntry) => collection;
export function defineBooleanWidget(widget: Omit<BooleanWidget, 'widget'>): BooleanWidget {
  return {
    widget: 'boolean',
    ...widget,
  };
}
export function defineCodeWidget(widget: Omit<CodeWidget, 'widget'>): CodeWidget {
  return {
    widget: 'code',
    ...widget,
  };
}
export function defineColorWidget(widget: Omit<ColorWidget, 'widget'>): ColorWidget {
  return {
    widget: 'color',
    ...widget,
  };
}
export function defineDateTimeWidget(widget: Omit<DateTimeWidget, 'widget'>): DateTimeWidget {
  return { widget: 'datetime', ...widget };
}
export function defineHiddenWidget(widget: Omit<HiddenWidget, 'widget'>): HiddenWidget {
  return {
    widget: 'hidden',
    ...widget,
  };
}
export function defineFileWidget(widget: Omit<FileWidget, 'widget'>): FileWidget {
  return {
    widget: 'file',
    ...widget,
  };
}
export function defineImageWidget(widget: Omit<ImageWidget, 'widget'>): ImageWidget {
  return {
    widget: 'image',
    ...widget,
  };
}
export function defineListWidget(widget: Omit<ListWidget, 'widget'>): ListWidget {
  return {
    widget: 'list',
    ...widget,
  };
}
export function defineMapWidget(widget: Omit<MapWidget, 'widget'>): MapWidget {
  return {
    widget: 'map',
    ...widget,
  };
}
export function defineNumberWidget(widget: Omit<NumberWidget, 'widget'>): NumberWidget {
  return {
    widget: 'number',
    ...widget,
  };
}
export function defineObjectWidget(widget: Omit<ObjectWidget, 'widget'>): ObjectWidget {
  return {
    widget: 'object',
    ...widget,
  };
}
export function defineRelationWidget(widget: Omit<RelationWidget, 'widget'>): RelationWidget {
  return { widget: 'relation', ...widget };
}
export function defineSelectWidget(widget: Omit<SelectWidget, 'widget'>): SelectWidget {
  return {
    widget: 'select',
    ...widget,
  };
}
export function defineStringWidget(widget: Omit<StringWidget, 'widget'>): StringWidget {
  return {
    widget: 'string',
    ...widget,
  };
}
export function defineTextWidget(widget: Omit<TextWidget, 'widget'>): TextWidget {
  return {
    widget: 'text',
    ...widget,
  };
}
export function defineMarkdownWidget(widget: Omit<MarkdownWidget, 'widget'>): MarkdownWidget {
  return {
    widget: 'markdown',
    ...widget,
  };
}

export interface NetlifyCMSEntry {
  /**
   * Name of config file
   *
   * @default cms.config
   */
  configFile?: string;

  /**
   * Netlify CMS config object
   */
  config?: NetlifyCMSConfig;

  /**
   * Folder to save config file
   *
   * @default ./public/admin
   */
  saveFolder?: string;

  /**
   * If has to create index.html file in the save folder
   */
  createIndexHTML?: boolean;

  /**
   * Title of the admin page
   *
   * @default Admin
   */
  title?: string;

  /**
   * Icon URL of the admin page
   *
   * @default https://decapcms.org/img/decap-logo.svg
   */
  iconUrl?: string;

  /**
   * If has to use identity widget
   *
   * @default true
   */
  useIdentityWidget?: boolean;
}

async function createFolderIfNotExists(path: string) {
  try {
    await readdir(path);
  }
  catch {
    await mkdir(path, { recursive: true });
  }
}

async function saveConfig(document: string, pathTo: string) {
  await writeFile(pathTo, document);
}

function resolveConfigFilePath(configFile: string) {
  const _path = configFile.startsWith('.') ? configFile.slice(2) : configFile;

  if (!_path)
    return configFile;
  if (['ts', 'js', 'cjs', 'mjs'].some(ext => _path.includes(ext)))
    return _path.split('.').slice(0, -1).join('.');

  return _path;
}

async function getConfigFile(root: string, configFile: string): Promise<NetlifyCMSConfig> {
  try {
    const files = await readdir(root);
    const configPath = resolveConfigFilePath(configFile);

    if (configPath.includes('/')) {
      const [folder, file] = configPath.split('/');
      return await getConfigFile(path.join(root, folder), file);
    }

    const file = files.find(file => file.startsWith(configPath));

    if (!file)
      throw new Error(`Config file not found`);

    const { config }
      = (await loadConfigFromFile(
        { command: 'build', mode: '' },
        path.join(root, file),
      )) ?? {};

    if (!config)
      throw new Error(`Config file not found`);

    return config as NetlifyCMSConfig;
  }
  catch {
    throw new Error(`Config file not found`);
  }
}

function createIndex(title: string, iconUrl: string, useIdentityWidget: boolean) {
  const icon = iconUrl ? `<link rel="icon" type="image/svg+xml" href="${iconUrl}" />` : '';
  const identity = useIdentityWidget ? `<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>` : '';

  const document = indexHTMLTemplate
    .replace('{{ title }}', title)
    .replace('{{ icon }}', icon)
    .replace('{{ identity }}', identity);

  return document;
}

export async function createConfig(root: string, entry?: NetlifyCMSEntry) {
  const {
    configFile = 'cms.config',
    config,
    saveFolder = './public/admin',
    createIndexHTML = true,
    title = 'Admin',
    iconUrl = 'https://decapcms.org/img/decap-logo.svg',
    useIdentityWidget = true,
  } = entry ?? {};

  const resolvedConfig = config ?? (await getConfigFile(root, configFile));
  await createFolderIfNotExists(path.join(root, saveFolder));

  const document = YAML.stringify(resolvedConfig);
  await saveConfig(document, path.join(root, saveFolder, 'config.yml'));

  if (!createIndexHTML)
    return;

  const indexHTML = createIndex(title, iconUrl, useIdentityWidget);
  await saveConfig(indexHTML, path.join(root, saveFolder, 'index.html'));
}

export default async function (entry?: NetlifyCMSEntry): Promise<Plugin> {
  let root = '';

  return {
    name: 'vite-plugin-netlify-cms',
    configResolved: (config) => {
      root = config.root;
    },
    buildStart: async () => {
      try {
        await createConfig(root, entry);
      }
      catch (error) {
        console.log(error);
      }
    },
    handleHotUpdate: async ({ file }) => {
      if (file.includes(entry?.configFile ?? 'cms.config')) {
        try {
          await createConfig(root, entry);
        }
        catch (error) {
          console.log(error);
        }
      }
    },
  };
}
