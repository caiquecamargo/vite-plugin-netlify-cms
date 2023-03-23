type Widgets =
  | "boolean"
  | "code"
  | "color"
  | "datetime"
  | "hidden"
  | "file"
  | "image"
  | "list"
  | "map"
  | "number"
  | "object"
  | "relation"
  | "select"
  | "string"
  | "text"
  | "markdown";

interface BaseCollectionField {
  name: string;
  label?: string;
  widget: Widgets;
  required?: boolean;
  pattern?: string[];
  comment?: string;
}

export interface BooleanWidget extends BaseCollectionField {
  widget: "boolean";
  default?: boolean;
}

export interface CodeWidget extends BaseCollectionField {
  widget: "code";
  default_language?: string;
  allow_language_selection?: boolean;
  keys?: string;
  output_code_only?: boolean;
}

export interface ColorWidget extends BaseCollectionField {
  widget: "color";
  default?: string;
  allowInput?: boolean;
  enableAlpha?: boolean;
}

export interface DateTimeWidget extends BaseCollectionField {
  widget: "datetime";
  default?: string;
  format?: string;
  date_format?: string | boolean;
  time_format?: string | boolean;
  picker_utc?: boolean;
}

export interface HiddenWidget extends BaseCollectionField {
  widget: "hidden";
  default?: any;
}

export interface FileWidget extends BaseCollectionField {
  widget: "file";
  default?: string;
  media_library?: Record<string, unknown>;
  allow_multiple?: boolean;
  config?: Record<string, unknown>;
  media_folder?: string;
  choose_url?: boolean;
}

export interface ImageWidget extends BaseCollectionField {
  widget: "image";
  default?: string;
  media_library?: Record<string, unknown>;
  allow_multiple?: boolean;
  config?: Record<string, unknown>;
  media_folder?: string;
  choose_url?: boolean;
}

export interface ListWidget extends BaseCollectionField {
  widget: "list";
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

export interface MapWidget extends BaseCollectionField {
  widget: "map";
  default?: string;
  decimals?: number;
  type?: "Point" | "LineString" | "Polygon";
}

export interface NumberWidget extends BaseCollectionField {
  widget: "number";
  default?: string | number;
  value_type?: "int" | "float";
  min?: number;
  max?: number;
  step?: number;
}

export interface ObjectWidget extends BaseCollectionField {
  widget: "object";
  default?: CollectionField[];
  collapsed?: boolean;
  summary?: string;
  fields: CollectionField[];
}

export interface RelationWidget extends BaseCollectionField {
  widget: "relation";
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

export interface SelectWidget extends BaseCollectionField {
  widget: "select";
  default?: string | { label: string; value: string };
  options?: string[] | { label: string; value: string }[];
  multiple?: boolean;
  min?: number;
  max?: number;
}

export interface StringWidget extends BaseCollectionField {
  widget: "string";
  default?: string;
}

export interface TextWidget extends BaseCollectionField {
  widget: "text";
  default?: string;
}

type MarkdownButtons = "bold" | "italic" | "code" | "link" | "heading-one" | "heading-two" | "heading-three | heading-four" | "heading-five" | "heading-six" | "quote" | "bulleted-list" | "numbered-list"

export interface MarkdownWidget extends BaseCollectionField {
  widget: "markdown";
  default?: string;
  buttons?: MarkdownButtons[];
  editor_components?: ("image" | "code-block")[];
  modes?: ("raw" | "rich_text")[],
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
  extension?: "yml" | "yaml" | "toml" | "json" | "md" | "markdown" | "html";

  /**
   * These settings determine how collection files are parsed and saved.
   */
  format?:
    | "yml"
    | "yaml"
    | "toml"
    | "json"
    | "frontmatter"
    | "yaml-frontmatter"
    | "toml-frontmatter"
    | "json-frontmatter";

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

export type NetlifyCMSConfig = {
  backend: {
    /**
     * The name of the backend to use.
     */
    name: "git-gateway" | "github" | "gitlab" | "bitbucket";

    /**
     * [org-or-username]/[repo-name] Required for github, gitlab,
     * bitbucket and ignored by git-gateway.
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
     * @default netlify-cms/
     */
    cms_label_prefix?: string;
  };

  publish_mode?: "editorial_workflow";

  media_folder: string;
  public_folder?: string;

  media_library?: {
    name: string;
    config?: Record<string, unknown>;
  };

  site_url?: string;
  display_url?: string;
  logo_url?: string;

  locale?: string;

  show_preview_links?: boolean;

  search?: boolean;

  slug?: {
    encoding?: "unicode" | "ascii";
    clean_accents?: boolean;
    sanitize_replacement?: string;
  };

  collections: (FileCollection | FolderCollection)[];
};
