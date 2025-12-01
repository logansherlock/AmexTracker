#!/bin/bash

# Usage: ./make_icns.sh path/to/icon.png output.icns

if [ $# -ne 2 ]; then
  echo "Usage: $0 image.png output.icns"
  exit 1
fi

INPUT=$1
OUTPUT=$2
TEMP_DIR=$(mktemp -d)

echo "Creating iconset in $TEMP_DIR/icon.iconset"

mkdir -p "$TEMP_DIR/icon.iconset"

# Resize input PNG into all required macOS icon sizes
sips -z 16 16     "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_16x16.png"
sips -z 32 32     "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_16x16@2x.png"
sips -z 32 32     "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_32x32.png"
sips -z 64 64     "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_32x32@2x.png"
sips -z 128 128   "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_128x128.png"
sips -z 256 256   "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_128x128@2x.png"
sips -z 256 256   "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_256x256.png"
sips -z 512 512   "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_256x256@2x.png"
sips -z 512 512   "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_512x512.png"
sips -z 1024 1024 "$INPUT" --out "$TEMP_DIR/icon.iconset/icon_512x512@2x.png"

# Generate .icns
iconutil -c icns "$TEMP_DIR/icon.iconset" -o "$OUTPUT"

# Clean up
rm -rf "$TEMP_DIR"

echo "✅ ICNS generated: $OUTPUT"