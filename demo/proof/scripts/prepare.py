#!/usr/bin/env python3
"""Download and verify the frozen release-generated OBI source."""
import hashlib
import json
from pathlib import Path
import tarfile
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation/releases/download/v0.14.0/"
ARCHIVE = "obi-v0.14.0-source-generated.tar.gz"
# Freeze the hash recorded in the release checksum manifest, not a moving tag.
EXPECTED = "c6ff8d052da23695b46b94678b611d19a3f50b9b3800d1b5d54f5f586ce08eaf"


def main():
    artifacts = ROOT / ".artifacts"
    artifacts.mkdir(exist_ok=True)
    archive = artifacts / ARCHIVE
    if not archive.exists():
        temporary = archive.with_suffix(".download")
        with urllib.request.urlopen(BASE + ARCHIVE, timeout=60) as source, temporary.open("wb") as target:
            while block := source.read(1024 * 1024):
                target.write(block)
        temporary.replace(archive)
    actual = hashlib.sha256(archive.read_bytes()).hexdigest()
    if actual != EXPECTED:
        raise SystemExit(f"OBI archive checksum mismatch: {actual}")
    target = artifacts / "obi"
    if not (target / "obi-v0.14.0-source-generated" / "go.mod").exists():
        target.mkdir(exist_ok=True)
        with tarfile.open(archive) as source:
            source.extractall(target, filter="data")
    (artifacts / "source-artifact.json").write_text(json.dumps({
        "url": BASE + ARCHIVE, "sha256": actual, "release": "v0.14.0",
        "source_commit": "13d9b0c3f600a060bd78820a63ebec882b10757e",
    }, indent=2) + "\n")
    print("Verified OBI release-generated source", actual)


if __name__ == "__main__":
    main()
