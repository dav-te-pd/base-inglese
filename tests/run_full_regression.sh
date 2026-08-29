#!/bin/bash
# Full regression suite (CLAUDE.md rule 15): every test file that must
# pass before publishing a change touching shared code. Run from anywhere;
# it cd's to its own directory. Requires:
#   - node with Playwright installed (require('playwright') resolvable)
#   - a Chromium binary Playwright can launch
#   - the app served at http://localhost:8955/index.html, e.g. from the
#     repo root: python3 -m http.server 8955
cd "$(dirname "$0")"
FILES="test_batch2.js test_batch2b.js test_batch3.js test_batch3b.js test_batch4.js test_batch4b.js test_batch5.js test_batch6.js test_batch7.js test_batch8.js test_batch9.js test_batch10.js test_batch11.js test_batch12.js test_batch13.js test_batch14.js test_batch15.js test_batch16.js test_batch17.js test_batch18.js test_batch19.js test_batch20.js test_dialogo_extra.js test_new_features.js test_voicecoach.js"
OVERALL_OK=1
for f in $FILES; do
  echo "=== $f ==="
  node "$f" > "${f%.js}.result.txt" 2>&1
  code=$?
  tail -3 "${f%.js}.result.txt"
  if [ $code -ne 0 ]; then
    echo "FILE FAILED: $f (exit $code)"
    OVERALL_OK=0
  fi
  echo ""
done
if [ $OVERALL_OK -eq 1 ]; then
  echo "=== ALL FILES GREEN ==="
else
  echo "=== SOME FILES FAILED ==="
fi
