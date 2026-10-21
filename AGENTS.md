# Project file locations

- Never create project assets or working files in `/tmp` or another system
  temporary directory.
- Keep assets, previews, screenshots, recordings, intermediate files, validation
  output, and browser profiles inside this repository.
- Use `public/` for assets served with the presentation. The editable visual
  storyboard source is `public/storyboard.html`.
- Use `.artifacts/` for generated working files and validation output. Keep that
  directory ignored by Git; use `.artifacts/storyboard/` for storyboard work.
