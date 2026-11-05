#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
source_dir=${OBI_SOURCE:-$HOME/work/obi}
work="$root/.artifacts/obi-redis"
image=${OBI_IMAGE:-far-wide-demo-obi:local}
arch=${OBI_ARCH:-amd64}
revision=$(git -C "$source_dir" rev-parse HEAD)
branch=$(git -C "$source_dir" branch --show-current)

mkdir -p "$work/source" "$work/tmp" "$work/go-build"
# Generate in a local snapshot so rebuilding does not modify the OBI checkout.
rsync -a --delete --exclude internal/test/ --exclude internal/tools/debug/ \
  "$source_dir/bpf" "$source_dir/cmd" "$source_dir/internal" "$source_dir/pkg" \
  "$source_dir/Makefile" "$source_dir/go.mod" "$source_dir/go.sum" \
  "$source_dir/LICENSE" "$source_dir/NOTICE" "$source_dir/NOTICES" "$work/source/"

export TMPDIR="$work/tmp" GOTMPDIR="$work/tmp" GOCACHE="$work/go-build"
make -C "$work/source" generate compile BPF_TARGETS="$arch" GOARCH="$arch" \
  CLANG="${CLANG:-clang-21}" RELEASE_VERSION="local-$branch" RELEASE_REVISION="$revision"

cat > "$work/source/Dockerfile.local" <<'EOF'
FROM scratch
COPY bin/obi /obi
COPY LICENSE NOTICE /native-licenses/
COPY NOTICES /native-licenses/NOTICES
ENTRYPOINT ["/obi"]
EOF
docker build -f "$work/source/Dockerfile.local" -t "$image" \
  --label "org.opencontainers.image.revision=$revision" "$work/source"
printf '%s\n' "source=$source_dir" "branch=$branch" "revision=$revision" "image=$image" \
  > "$work/build.txt"
printf 'Built %s from %s (%s).\n' "$image" "$branch" "$revision"
