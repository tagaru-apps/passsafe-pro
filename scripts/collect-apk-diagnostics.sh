#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/apk-publish-diagnostic.txt"

{
  echo "PassSafe Pro APK publishing diagnostic"
  echo "Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  echo "== Managed Android project status =="
  if [ -d "$ROOT/android" ]; then
    echo "android/: present"
    find "$ROOT/android" -maxdepth 2 -type f \( -name 'build.gradle' -o -name 'build.gradle.kts' -o -name 'gradle.properties' \) -print | sort
  else
    echo "android/: absent (Expo managed workflow; Gradle files are generated during native build/prebuild)"
  fi
  echo
  echo "== Expo public configuration =="
  cd "$ROOT"
  pnpm exec expo config --type public --json
  echo
  echo "== Native packages =="
  pnpm list react-native-google-mobile-ads react-native-purchases expo-notifications expo-tracking-transparency --depth 0
  echo
  echo "== Recent development service evidence =="
  if [ -f "$ROOT/.manus-logs/devserver.log" ]; then
    tail -n 180 "$ROOT/.manus-logs/devserver.log"
  else
    echo "No development-service log file found."
  fi
} > "$OUT" 2>&1

echo "$OUT"
