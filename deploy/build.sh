#!/bin/bash
echo "Building swagger-2-typescript..."
echo "Cleaning up previous build..."
rm -rf ./lib
echo "Building TypeScript files..."
rollup -c --bundleConfigAsCjs
echo "Done."
