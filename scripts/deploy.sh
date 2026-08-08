#!/usr/bin/env bash
#
# Build the Docker image and ship it to Google Cloud:
#   1. build (cross-compiled to linux/amd64 via buildx, matching the Dockerfile)
#   2. push to Artifact Registry
#   3. deploy that image to Cloud Run
#
# Usage:
#   ./scripts/deploy.sh              # build, push, and deploy
#   ./scripts/deploy.sh --no-deploy  # build and push only, skip the Cloud Run rollout
#
# Config comes from env vars if you need to override a default, e.g.:
#   REGION=asia-southeast1 ./scripts/deploy.sh

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-flashcard-buddies-lfj}"
REGION="${REGION:-us-central1}"
REPO="${REPO:-docker-repo}"
SERVICE="${SERVICE:-flashcard-buddy}"
IMAGE_NAME="${IMAGE_NAME:-flashcard-buddy}"

DO_DEPLOY=true
if [[ "${1:-}" == "--no-deploy" ]]; then
  DO_DEPLOY=false
fi

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Warning: you have uncommitted changes — they'll be included in the image build," >&2
  echo "         since Docker builds from the working tree, not from git history." >&2
fi

GIT_SHA="$(git rev-parse --short HEAD)"
REGISTRY="${REGION}-docker.pkg.dev"
IMAGE="${REGISTRY}/${PROJECT_ID}/${REPO}/${IMAGE_NAME}"

echo "==> Authenticating Docker with Artifact Registry (${REGISTRY})"
gcloud auth configure-docker "${REGISTRY}" --quiet --project "${PROJECT_ID}"

echo "==> Building and pushing ${IMAGE}:${GIT_SHA} (+ :latest)"
docker buildx build \
  --platform linux/amd64 \
  -t "${IMAGE}:${GIT_SHA}" \
  -t "${IMAGE}:latest" \
  --push \
  .

if [[ "${DO_DEPLOY}" == false ]]; then
  echo "==> --no-deploy passed, skipping Cloud Run rollout."
  echo "Image pushed: ${IMAGE}:${GIT_SHA}"
  exit 0
fi

echo "==> Deploying ${IMAGE}:${GIT_SHA} to Cloud Run service '${SERVICE}' (${REGION})"
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}:${GIT_SHA}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --quiet

echo "==> Done."
gcloud run services describe "${SERVICE}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format="value(status.url)"
