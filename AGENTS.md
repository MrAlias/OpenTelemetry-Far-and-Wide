# Project file locations

- Never create project assets or working files in `/tmp` or another system
  temporary directory.
- Keep assets, previews, screenshots, recordings, intermediate files, validation
  output, and browser profiles inside this repository.
- Use `public/` for assets served with the presentation. The editable visual
  storyboard source is `public/storyboard.html`.
- Use `.artifacts/` for generated working files and validation output. Keep that
  directory ignored by Git; use `.artifacts/storyboard/` for storyboard work.

# Synthetic voice recordings

- Never commit or push AI-generated renditions of Tyler's or Nikola's voice,
  including audio samples and narrated videos. Keep them local in ignored paths.
- Voice reference recordings and saved voice profiles must also stay untracked.
- Only silent demo clips may be versioned. Verify that they have no audio streams;
  muting a video player does not remove its audio track.
- Text scripts, transcripts, captions and speaker notes may remain versioned.
