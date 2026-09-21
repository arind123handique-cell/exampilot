#!/usr/bin/env python3
"""Provision the ExamPilot Supabase project and verify the PYQ uploader path.

Reads credentials from the environment (VITE_SUPABASE_URL / SUPABASE_URL,
VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY) so no secret is hardcoded here.
"""
import json, os, urllib.request, urllib.error

URL = (
    os.environ.get("SUPABASE_URL")
    or os.environ.get("VITE_SUPABASE_URL")
    or "https://beahwfkpgplnccrszjvl.supabase.co"
)
ANON_KEY = (
    os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("VITE_SUPABASE_ANON_KEY")
    or ""
)
HEADERS = {"Authorization": f"Bearer {ANON_KEY}", "apikey": ANON_KEY, "Content-Type": "application/json"}


def rest(method: str, path: str, body=None):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{path}",
        data=json.dumps(body).encode() if body is not None else None,
        headers=HEADERS,
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")


# 1. List existing tables
print("== Existing tables ==")
for t in ("questions", "published_papers", "custom_mock_tests"):
    status, content = rest("GET", f"{t}?select=id&limit=1")
    print(f"  {t:22s} -> HTTP {status}  {content[:120]}")

# 2. Create missing tables via SQL RPC
print("\n== Creating tables ==")
sql = open(os.path.join(os.path.dirname(__file__), "create_tables.sql"), encoding="utf-8").read()
status, content = rest("POST", "rpc/sql", {"query": sql})
print(f"  rpc/sql -> HTTP {status}  {content[:300]}")

# 3. Verify
print("\n== After migration ==")
for t in ("questions", "published_papers", "custom_mock_tests"):
    status, content = rest("GET", f"{t}?select=id&limit=1")
    print(f"  {t:22s} -> HTTP {status}  {content[:120]}")