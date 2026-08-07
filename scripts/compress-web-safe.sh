#!/usr/bin/env bash
# Quality-preserving in-place web compress for portfolio clips.
# Keeps existing path/filename. Preserves audio when present.
# Usage: ./scripts/compress-web-safe.sh path/to/video.mp4
set -euo pipefail

INPUT="${1:?Usage: compress-web-safe.sh <video-file>}"
if [[ ! -f "$INPUT" ]]; then
  echo "Missing file: $INPUT" >&2
  exit 1
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Install ffmpeg first: brew install ffmpeg" >&2
  exit 1
fi

ABS="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"
DIR="$(dirname "$ABS")"
BASE="$(basename "$ABS")"
TMP="$DIR/.${BASE}.compressing.mp4"
ORIG_SIZE="$(wc -c < "$ABS" | tr -d ' ')"

# Detect audio stream
HAS_AUDIO=0
if ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of csv=p=0 "$ABS" 2>/dev/null | grep -q audio; then
  HAS_AUDIO=1
fi

echo "Compressing: $ABS ($(du -h "$ABS" | cut -f1); audio=$HAS_AUDIO)"

AUDIO_ARGS=(-an)
if [[ "$HAS_AUDIO" == "1" ]]; then
  AUDIO_ARGS=(-c:a aac -b:a 160k -ac 2)
fi

# CRF 22 ≈ high visual quality for web; cap width at 1920; faststart for streaming.
ffmpeg -y -hide_banner -loglevel error -stats -i "$ABS" \
  -vf "scale='min(1920,iw)':-2" \
  -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p \
  -movflags +faststart \
  "${AUDIO_ARGS[@]}" \
  "$TMP"

NEW_SIZE="$(wc -c < "$TMP" | tr -d ' ')"

# Safety: never replace with tiny/corrupt output, and only if we actually save space.
if [[ "$NEW_SIZE" -lt 200000 ]]; then
  echo "Abort: output too small ($NEW_SIZE bytes). Keeping original." >&2
  rm -f "$TMP"
  exit 2
fi

# Require at least ~8% savings; otherwise keep original (already efficient).
THRESH=$(( ORIG_SIZE * 92 / 100 ))
if [[ "$NEW_SIZE" -ge "$THRESH" ]]; then
  echo "Skip replace: already efficient ($(du -h "$ABS" | cut -f1) -> $(du -h "$TMP" | cut -f1))"
  rm -f "$TMP"
  exit 0
fi

# Atomic-ish replace
mv "$TMP" "$ABS"
echo "Done: $(python3 -c "print(f'{$ORIG_SIZE/1024/1024:.1f}MB -> {$NEW_SIZE/1024/1024:.1f}MB')")"
