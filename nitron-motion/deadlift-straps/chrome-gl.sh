#!/bin/bash
# Chrome for the motion renderer on Linux: the renderer asks for ANGLE-Metal (macOS); use SwiftShader here.
args=(); for a in "$@"; do [[ "$a" == --use-angle=metal ]] && a=--use-angle=swiftshader; args+=("$a"); done
exec /opt/pw-browsers/chromium --no-sandbox --enable-unsafe-swiftshader "${args[@]}"
