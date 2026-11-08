#!/usr/bin/env bash
# AI Studio runner passes --host which Next.js dev does not accept.
# This wrapper binds to 0.0.0.0 on port 3000 cleanly.
exec npx next dev -p 3000 -H 0.0.0.0
