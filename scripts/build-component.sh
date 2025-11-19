#!/bin/bash

# Build a single component
# Usage: ./scripts/build-component.sh Calculator

COMPONENT_NAME=$1

if [ -z "$COMPONENT_NAME" ]; then
  echo "Usage: ./scripts/build-component.sh <ComponentName>"
  echo "Example: ./scripts/build-component.sh Calculator"
  exit 1
fi

echo "Building $COMPONENT_NAME..."

# Check if component exists
COMPONENT_PATH="components/src/$COMPONENT_NAME"
if [ ! -d "$COMPONENT_PATH" ]; then
  echo "Error: Component '$COMPONENT_NAME' not found at $COMPONENT_PATH"
  exit 1
fi

# Run build
npm run build

echo "Build complete! Files are in components/dist/"
