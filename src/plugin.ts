import { mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { Plugin, loadConfigFromFile } from "vite";
import YAML from "yaml";
import {
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
} from "./types";

export const defineConfig = (config: NetlifyCMSConfig): NetlifyCMSConfig =>
  config;
export const defineFolderCollection = (collection: FolderCollection) =>
  collection;
export const defineFileCollection = (collection: FileCollection) => collection;
export const defineFileCollectionEntry = (collection: FileCollectionEntry) => collection;
export const defineBooleanWidget = (
  widget: Omit<BooleanWidget, "widget">
): BooleanWidget => ({
  widget: "boolean",
  ...widget,
});
export const defineCodeWidget = (
  widget: Omit<CodeWidget, "widget">
): CodeWidget => ({
  widget: "code",
  ...widget,
});
export const defineColorWidget = (
  widget: Omit<ColorWidget, "widget">
): ColorWidget => ({
  widget: "color",
  ...widget,
});
export const defineDateTimeWidget = (
  widget: Omit<DateTimeWidget, "widget">
): DateTimeWidget => ({ widget: "datetime", ...widget });
export const defineHiddenWidget = (
  widget: Omit<HiddenWidget, "widget">
): HiddenWidget => ({
  widget: "hidden",
  ...widget,
});
export const defineFileWidget = (
  widget: Omit<FileWidget, "widget">
): FileWidget => ({
  widget: "file",
  ...widget,
});
export const defineImageWidget = (
  widget: Omit<ImageWidget, "widget">
): ImageWidget => ({
  widget: "image",
  ...widget,
});
export const defineListWidget = (
  widget: Omit<ListWidget, "widget">
): ListWidget => ({
  widget: "list",
  ...widget,
});
export const defineMapWidget = (
  widget: Omit<MapWidget, "widget">
): MapWidget => ({
  widget: "map",
  ...widget,
});
export const defineNumberWidget = (
  widget: Omit<NumberWidget, "widget">
): NumberWidget => ({
  widget: "number",
  ...widget,
});
export const defineObjectWidget = (
  widget: Omit<ObjectWidget, "widget">
): ObjectWidget => ({
  widget: "object",
  ...widget,
});
export const defineRelationWidget = (
  widget: Omit<RelationWidget, "widget">
): RelationWidget => ({ widget: "relation", ...widget });
export const defineSelectWidget = (
  widget: Omit<SelectWidget, "widget">
): SelectWidget => ({
  widget: "select",
  ...widget,
});
export const defineStringWidget = (
  widget: Omit<StringWidget, "widget">
): StringWidget => ({
  widget: "string",
  ...widget,
});
export const defineTextWidget = (
  widget: Omit<TextWidget, "widget">
): TextWidget => ({
  widget: "text",
  ...widget,
});
export const defineMarkdownWidget = (
  widget: Omit<MarkdownWidget, "widget">
): MarkdownWidget => ({
  widget: "markdown",
  ...widget,
});

export type NetlifyCMSEntry = {
  configFile?: string;
  config?: NetlifyCMSConfig;
  saveFolder?: string;
};

const createFolderIfNotExists = async (path: string) => {
  try {
    await readdir(path);
  } catch {
    await mkdir(path, { recursive: true });
  }
};

const saveConfig = async (document: string, pathTo: string) => {
  await writeFile(pathTo, document);
};

const resolveConfigFile = (configFile: string) => {
  const path = configFile.startsWith(".") ? configFile.slice(2) : configFile;

  if (!path) return configFile;
  if (["ts", "js", "cjs", "mjs"].some((ext) => path.includes(ext))) {
    return path.split(".").slice(0, -1).join(".");
  }

  return path;
};

const getConfigFile = async (
  root: string,
  configFile: string
): Promise<NetlifyCMSConfig> => {
  try {
    const files = await readdir(root);
    const configPath = resolveConfigFile(configFile);

    if (configPath.includes("/")) {
      const [folder, file] = configPath.split("/");
      return await getConfigFile(path.join(root, folder), file);
    }

    const file = files.find((file) => file.startsWith(configPath));

    if (!file) {
      throw new Error(`Config file not found`);
    }

    const { config } =
      (await loadConfigFromFile(
        { command: "build", mode: "" },
        path.join(root, file)
      )) ?? {};

    if (!config) {
      throw new Error(`Config file not found`);
    }

    return config as NetlifyCMSConfig;
  } catch (error) {
    console.log(error);
    throw new Error(`Config file not found`);
  }
};

export const createConfig = async (root: string, entry?: NetlifyCMSEntry) => {
  const {
    configFile = "./netlify.config.ts",
    config,
    saveFolder = "./public/admin",
  } = entry ?? {};

  const resolvedConfig = config ?? (await getConfigFile(root, configFile));
  await createFolderIfNotExists(path.join(root, saveFolder));

  const document = YAML.stringify(resolvedConfig);
  await saveConfig(document, path.join(root, saveFolder, "config.yml"));
};

export default async function (entry?: NetlifyCMSEntry): Promise<Plugin> {
  let root = "";

  return {
    name: "vite-plugin-netlify-cms",
    configResolved: (config) => {
      root = config.root;
    },
    buildStart: async () => {
      await createConfig(root, entry);
    },
    handleHotUpdate: async ({ file }) => {
      if (file.endsWith("netlify.config.ts")) {
        await createConfig(root, entry);
      }
    },
  };
}
