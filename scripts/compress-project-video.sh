#!/usr/bin/env bash
# Compress a raw phone/camera export for the portfolio (H.264 + faststart for web).
# Usage: ./scripts/compress-project-video.sh public/projects/bloombot.MP4 bloombot
#
# Output: public/projects/<name>-web.mp4 (always -web suffix — macOS treats .MP4 and .mp4 as the same file!)

set -euo pipefail

INPUT="${1:?Usage: compress-project-video.sh <input-file> <output-basename>}"
BASENAME="${2:?Usage: compress-project-video.sh <input-file> <output-basename>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/projects/${BASENAME}-web.mp4"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Install ffmpeg first: brew install ffmpeg"
  exit 1
fi

echo "Input:  $INPUT ($(du -h "$INPUT" | cut -f1))"
echo "Output: $OUT"

ffmpeg -y -i "$INPUT" \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -crf 28 -preset medium \
  -movflags +faststart \
  -an \
  "$OUT"

echo "Done: $(du -h "$OUT" | cut -f1)"
echo "Point project-media.ts at: /projects/${BASENAME}-web.mp4"
