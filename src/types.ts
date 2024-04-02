type Widgets =
  | 'boolean'
  | 'code'
  | 'color'
  | 'datetime'
  | 'hidden'
  | 'file'
  | 'image'
  | 'list'
  | 'map'
  | 'number'
  | 'object'
  | 'relation'
  | 'select'
  | 'string'
  | 'text'
  | 'markdown';

export interface Widget {
  name: string;
  label?: string;
  widget: Widgets;
  required?: boolean;
  pattern?: string[];
  comment?: string;
}

export interface BooleanWidget extends Widget {
  widget: 'boolean';
  default?: boolean;
}

export interface CodeWidget extends Widget {
  widget: 'code';
  default_language?: string;
  allow_language_selection?: boolean;
  keys?: string;
  output_code_only?: boolean;
}

export interface ColorWidget extends Widget {
  widget: 'color';
  default?: string;
  allowInput?: boolean;
  enableAlpha?: boolean;
}

export interface DateTimeWidget extends Widget {
  widget: 'datetime';
  default?: string;
  format?: string;
  date_format?: string | boolean;
  time_format?: string | boolean;
  picker_utc?: boolean;
}

export interface HiddenWidget extends Widget {
  widget: 'hidden';
  default?: any;
}

export interface FileWidget extends Widget {
  widget: 'file';
  default?: string;
  media_library?: Record<string, unknown>;
  allow_multiple?: boolean;
  config?: Record<string, unknown>;
  media_folder?: string;
  choose_url?: boolean;
}

export interface ImageWidget extends Widget {
  widget: 'image';
  default?: string;
  media_library?: Record<string, unknown>;
  allow_multiple?: boolean;
  config?: Record<string, unknown>;
  media_folder?: string;
  choose_url?: boolean;
}

export interface ListWidget extends Widget {
  widget: 'list';
  default?: string[] | CollectionField[];
  allow_add?: boolean;
  collapsed?: boolean;
  summary?: string;
  minimize_collapsed?: boolean;
  label_singular?: string;
  field?: CollectionField;
  fields?: CollectionField[];
  types?: ObjectWidget[];
  max?: number;
  min?: number;
  add_to_top?: boolean;
}

export interface MapWidget extends Widget {
  widget: 'map';
  default?: string;
  decimals?: number;
  type?: 'Point' | 'LineString' | 'Polygon';
}

export interface NumberWidget extends Widget {
  widget: 'number';
  default?: string | number;
  value_type?: 'int' | 'float';
  min?: number;
  max?: number;
  step?: number;
}

export interface ObjectWidget extends Widget {
  widget: 'object';
  default?: CollectionField[];
  collapsed?: boolean;
  summary?: string;
  fields: CollectionField[];
}

export interface RelationWidget extends Widget {
  widget: 'relation';
  default?: any;
  collection: string;
  value_field: string;
  search_fields: string[];
  file?: string;
  display_fields?: string[];
  multiple?: boolean;
  min?: number;
  max?: number;
  options_length?: number;
}

export interface SelectWidget extends Widget {
  widget: 'select';
  default?: string | { label: string; value: string };
  options?: string[] | { label: string; value: string }[];
  multiple?: boolean;
  min?: number;
  max?: number;
}

export interface StringWidget extends Widget {
  widget: 'string';
  default?: string;
}

export interface TextWidget extends Widget {
  widget: 'text';
  default?: string;
}

type MarkdownButtons = 'bold' | 'italic' | 'code' | 'link' | 'heading-one' | 'heading-two' | 'heading-three | heading-four' | 'heading-five' | 'heading-six' | 'quote' | 'bulleted-list' | 'numbered-list';

export interface MarkdownWidget extends Widget {
  widget: 'markdown';
  default?: string;
  buttons?: MarkdownButtons[];
  editor_components?: ('image' | 'code-block')[];
  modes?: ('raw' | 'rich_text')[];
  sanitize_preview?: boolean;
}

export type CollectionField =
  | BooleanWidget
  | CodeWidget
  | ColorWidget
  | DateTimeWidget
  | HiddenWidget
  | FileWidget
  | ImageWidget
  | ListWidget
  | MapWidget
  | NumberWidget
  | ObjectWidget
  | RelationWidget
  | SelectWidget
  | StringWidget
  | TextWidget
  | MarkdownWidget;

export interface Collection {
  /**
   * unique identifier for the collection, used as the key
   * when referenced in other contexts (like the relation widget)
   */
  name: string;

  /**
   * Identifier field for the collection.
   *
   * defaults to title
   */
  identifier_field?: string;

  /**
   * label for the collection in the editor UI;
   * defaults to the value of name
   */
  label?: string;

  /**
   * singular label for certain elements in the editor;
   * defaults to the value of label
   */
  label_singular?: string;

  /**
   * optional text, displayed below the label when viewing a collection
   */
  description?: string;

  /**
   * for publish_mode: editorial_workflow only;
   * false hides UI publishing controls for a collection;
   *
   * defaults to true
   */
  publish?: boolean;

  /**
   * true hides a collection in the CMS UI;
   *
   * defaults to false.
   * Useful when using the relation widget to hide referenced collections.
   */
  hide?: boolean;

  /**
   * false prevents users from deleting items in a collection;
   *
   * defaults to true
   */
  delete?: boolean;

  /**
   * These settings determine how collection files are parsed and saved.
   */
  extension?: 'yml' | 'yaml' | 'toml' | 'json' | 'md' | 'markdown' | 'html';

  /**
   * These settings determine how collection files are parsed and saved.
   */
  format?:
    | 'yml'
    | 'yaml'
    | 'toml'
    | 'json'
    | 'frontmatter'
    | 'yaml-frontmatter'
    | 'toml-frontmatter'
    | 'json-frontmatter';

  frontmatter_delimiter?: string;

  /**
   * specifies a template for generating new filenames
   * based on a file's creation date and title field
   */
  slug?: string;

  /**
   * A string representing the path where content in this collection can be found on the live site.
   */
  preview_path?: string;

  /**
   * The name of a date field for parsing date-based template tags from preview_path
   */
  preview_path_date_field?: string;

  /**
   * The fields option maps editor UI widgets to field-value pairs in the saved file
   */
  fields: CollectionField[];

  /**
   * changes options for the editor view of a collection
   */
  editor?: {
    preview?: boolean;
  };

  summary?: string;

  /**
   * An optional list of sort fields to show in the UI.
   */
  sortable_fields?: string;

  /**
   * An optional list of predefined view filters to show in the UI.
   */
  view_filters?: string;

  /**
   * An optional list of predefined view groups to show in the UI.
   */
  view_groups?: string;
}

export interface FileCollection {
  name: string;
  label?: string;
  files: FileCollectionEntry[];
}

export interface FileCollectionEntry extends Collection {
  /**
   * specifies the collection type and location;
   * details in Collection Types
   */
  file: string;
}

export interface FolderCollection extends Collection {
  /**
   * specifies the collection type and location;
   * details in Collection Types
   */
  folder: string;

  /**
   * optional filter for folder collections; details in Collection Types
   */
  filter?: string;

  /**
   * true allows users to create new items in the collection;
   *
   * defaults to false
   */
  create?: boolean;
}

type Locales = 'bg' | 'ca' | 'cs' | 'da' | 'de' | 'en' | 'es' | 'fa' | 'fr' | 'he' | 'hr' | 'hu' | 'it' | 'ja' | 'ko' | 'lt' | 'nb_no' | 'nl' | 'nn_no' | 'pl' | 'pt' | 'ro' | 'ru' | 'sl' | 'sv' | 'th' | 'tr' | 'uk' | 'vi' | 'zh-Hans' | 'zh-Hant';

interface CloudinaryMediaLibrary {
  name: 'cloudinary';
  config: {
    [key: string]: unknown;
    cloud_name: string;
    api_key: string;

    /**
     * By default, the value provided for a selected image is a complete URL
     * for the asset on Cloudinary's CDN. Setting output_filename_only to true
     * will instead produce just the filename (e.g. image.jpg). This should be
     * true if you will be directly embedding cloudinary transformation urls in page templates
     *
     * @default false
     */
    output_filename_only?: boolean;

    /**
     * If true, uses derived url when available (the url will have image
     * transformation segments included). Has no effect if output_filename_only
     * is set to true
     *
     * @default true
     */
    use_transformations?: boolean;

    /**
     * Controls whether an http or https URL is provided.
     * Has no effect if output_filename_only is set to true
     *
     * @default true
     */
    use_secure_url?: boolean;
  };
}

interface UploadcareMediaLibrary {
  name: 'uploadcare';
  /** @see  https://uploadcare.com/docs/uploads/file-uploader-options/ */
  config: {
    [key: string]: unknown;

    /**
     * specify whether to add a filename to the end of the url
     *
     * @example http://ucarecdn.com/:uuid/filename.png
     */
    autoFilename?: boolean;

    /**
     * specify a string added at the end of the url.
     * This could be useful to apply a set of CDN operations to each image,
     * for example resizing or compression.
     *
     * @see https://uploadcare.com/docs/transformations/image/#image-transformations-list
     */
    defaultOperations?: string;
    publicKey: string;
    multiple?: boolean;
    multipleMax?: number;
    multipleMin?: number;
    onlyImages?: boolean;
    crop?: string;
    clearable?: boolean;
    previewStep?: boolean;
    imageShrink?: string;
    inputAcceptTypes?: string;
    locale?: Locales | string;
  };
}

type MediaLibrary = CloudinaryMediaLibrary | UploadcareMediaLibrary;

export interface NetlifyCMSConfig {
  /**
   * Enable the local backend for testing
   *
   * Requires to run a local backend server (npx decap-server)
   *
   * @see https://decapcms.org/docs/beta-features/?#working-with-a-local-git-repository
   */
  local_backend?: boolean;
  backend: {
    /**
     * The name of the backend to use.
     */
    name: 'git-gateway' | 'github' | 'gitlab' | 'bitbucket' | 'azure' | 'gitea';

    /**
     * [org-or-username]/[repo-name] Required for github, gitlab,
     * bitbucket, azure, gitea and ignored by git-gateway.
     */
    repo?: string;

    /**
     * The branch where published content is stored.
     * All CMS commits and PRs are made to this branch.
     *
     * @default master
     */
    branch?: string;

    /**
     * The API endpoint. Only necessary in certain cases,
     * like with GitHub Enterprise or self-hosted GitLab.
     *
     * @default https://api.github.com (GitHub),
     * @default https://gitlab.com/api/v4 (GitLab)
     * @default https://api.bitbucket.org/2.0 (Bitbucket)
     */
    api_root?: string;

    /**
     * Sets the site_id query param sent to the API endpoint.
     * Non-Netlify auth setups will often need to set this for
     * local development to work properly.
     *
     * @default location.hostname (or cms.netlify.com when on localhost)
     */
    site_doamin?: string;

    /**
     * OAuth client hostname (just the base domain, no path).
     * Required when using an external OAuth server or self-hosted GitLab.
     *
     * @default https://api.netlify.com (GitHub, Bitbucket)
     * @default https://gitlab.com (GitLab)
     */
    base_url?: string;

    /**
     * Path to append to base_url for authentication requests.
     *
     * @default auth (GitHub, Bitbucket)
     * @default oauth/authorize (GitLab)
     */
    auth_endpoint?: string;

    /**
     * Pull (or Merge) Requests label prefix when using editorial workflow.
     *
     * @default decap-cms/
     */
    cms_label_prefix?: string;
  };

  /**
   * By default, all entries created or edited in the Decap CMS are committed directly
   * into the main repository branch.
   *
   * The publish_mode option allows you to enable "Editorial Workflow" mode
   * for more control over the content publishing phases. All unpublished
   * entries will be arranged in a board according to their status,
   * and they can be further reviewed and edited before going live.
   * Note: Editorial workflow works with GitHub repositories,
   * and support for GitLab and Bitbucket is in beta.
   *
   * @see https://decapcms.org/docs/configuration-options/#publish-mode
   */
  publish_mode?: 'editorial_workflow';

  /**
   * The media_folder option specifies the folder path where
   * uploaded files should be saved, relative to the base of the repo.
   *
   * @example media_folder: "static/images/uploads"
   */
  media_folder: string;

  /**
   * The public_folder option specifies the folder path where the
   * files uploaded by the media library will be accessed, relative to
   * the base of the built site. For fields controlled by [file] or [image]
   * widgets, the value of the field is generated by prepending this path to
   * the filename of the selected file. Defaults to the value of media_folder,
   * with an opening / if one is not already included.
   *
   * @example public_folder: "/images/uploads"
   */
  public_folder?: string;

  /**
   * Media library integrations are configured via the media_library property,
   * and its value should be an object with at least a name property.
   * A config property can also be used for options that should be passed to the library in use.
   */
  media_library?: MediaLibrary;

  site_url?: string;
  display_url?: string;
  logo_url?: string;

  /**
   * Define the cms language,
   *
   * If uses a language not supported, requires to be registered in the cms
   *
   * @see https://decapcms.org/docs/configuration-options/#locale
   *
   * @default en
   */
  locale?: Locales | string;

  show_preview_links?: boolean;

  /**
   * The search functionally requires loading all collection(s) entries,
   * which can exhaust rate limits on large repositories.
   * It can be disabled by setting the top level search property to false
   *
   * @default true
   */
  search?: boolean;

  slug?: {
    encoding?: 'unicode' | 'ascii';
    clean_accents?: boolean;
    sanitize_replacement?: string;
  };

  collections: (FileCollection | FolderCollection)[];
}
