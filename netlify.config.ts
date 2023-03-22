import { defineColorWidget, defineConfig, defineFileCollection, defineFileCollectionEntry, defineImageWidget, defineMarkdownWidget, defineStringWidget } from './index';

const about = defineFileCollectionEntry({
  name: 'about',
  label: 'Sobre',
  file: 'src/content/config/about.md',
  extension: 'md',
  editor: { preview: false },
  fields: [
    defineStringWidget({
      label: 'Título',
      name: 'title',
      default: 'Quem sou eu',
    }),
    defineMarkdownWidget({ label: 'Conteúdo', name: 'body' }),
    defineImageWidget({ label: 'Foto', name: 'image', media_library: { config: { multiple: false } } }),
  ],
});

const color = defineFileCollectionEntry({
  name: 'color',
  label: 'Cores',
  file: 'src/content/config/color.json',
  extension: 'json',
  editor: { preview: false },
  fields: [
    defineColorWidget({
      label: 'Padrão',
      name: 'default',
      allowInput: true,
    }),
    defineColorWidget({ label: 'Escura', name: 'dark', allowInput: true }),
    defineColorWidget({ label: 'Clara', name: 'light', allowInput: true }),
  ],
});

const budget = defineFileCollectionEntry({
  name: 'budget',
  label: 'Orçamento',
  file: 'src/content/config/form-entries.json',
  extension: 'json',
  editor: {
    preview: false,
  },
  fields: [
    defineStringWidget({
      label: 'Título',
      name: 'title',
      default: 'Formulário de orçamento',
    }),
    // getFormEntries('Campos do formulário'),
  ],
});

const config = defineFileCollection({
  name: 'config',
  label: 'Configurações',
  files: [about, budget, color],
});

export default defineConfig({
  backend: {
    name: 'git-gateway',
    branch: 'main',
  },

  locale: 'pt-BR',
  site_url: 'https://www.giomurakami.des.br',
  display_url: 'https://www.giomurakami.des.br',
  logo_url: 'https://www.giomurakami.des.br/pendente.svg',

  media_folder: 'public/images',
  public_folder: '/images',

  media_library: {
    name: 'uploadcare',
    config: {
      publicKey: 'f07c3de16a476579b849',
      multiple: true,
      crop: 'free',
      locale: 'pt',
    },
  },

  collections: [config],
});
