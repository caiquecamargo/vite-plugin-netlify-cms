import { defineConfig, defineFileCollection, defineFileCollectionEntry, defineStringWidget } from "../dist";

const fileConfig = defineFileCollection({
  name: 'files',
  label: 'Files',
  files: [
    defineFileCollectionEntry({
      name: 'file',
      label: 'File',
      file: 'content/file.md',
      fields: [
        defineStringWidget({
          name: 'title',
          label: 'Title'
        })
      ]
    })
  ]
})

export default defineConfig({
  local_backend: true,
  
  backend: {
    name: 'git-gateway',
    branch: 'main',
  },

  locale: 'pt',

  media_folder: 'public/images',
  public_folder: '/images',

  collections: [
    fileConfig
  ]
})