#!/usr/bin/env bash
# Ionic Framework patch release helper
#
# Usage:
#   ./scripts/release-patch.sh [<version>] [--from <branch>] [--step <N>] [--dry-run]
#   ./scripts/release-patch.sh [<version>] --tickets [--from <branch>]
#
# Leave out <version> to release the next patch after the version in
# lerna.json on the base branch. --step 7 and --step 8 need it spelled out,
# because once the release merges, lerna.json already holds the new version.
#
# The Jira site comes from ~/.config/ionic-release.env
# (override with IONIC_RELEASE_CONFIG), and the script stops without it. It also
# needs admin on the repo. See scripts/release.env.example.
#
# Examples:
#   ./scripts/release-patch.sh
#   ./scripts/release-patch.sh 8.8.2
#   ./scripts/release-patch.sh 8.8.2 --from feature-8.8
#   ./scripts/release-patch.sh 8.8.2 --step 6
#   ./scripts/release-patch.sh 8.8.2 --dry-run
#   ./scripts/release-patch.sh 8.8.2 --tickets
#
# The script walks through each step of the patch release process,
# executing mechanical steps automatically and pausing for human
# judgment where required. Use --step to resume from a specific step.
#
# --tickets skips the release entirely and only prints Jira search links
# for the tickets behind everything that shipped since the previous tag.
# Useful for prepping the Jira release without cutting one.
#
# --dry-run walks the entire flow without changing anything: read-only
# lookups (changelog, release dates, existing PRs, and opening the Jira
# ticket search in a browser) run for real, while
# every mutating or blocking call (branch creation, workflow trigger and
# watch, PR creation, merges) is printed instead of executed. Use it to
# preview the output and prompts without cutting a release.

set -euo pipefail

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
step() {
  local n="$1" total="$2" label="$3"
  echo ""
  echo -e "${BOLD}${CYAN}[Step $n/$total] $label${RESET}"
}

ok()   { echo -e "  ${GREEN}✓${RESET} $*"; }
info() { echo -e "  ${CYAN}→${RESET} $*"; }
warn() { echo -e "  ${YELLOW}⚠${RESET} $*"; }
err()  { echo -e "  ${RED}✗${RESET} $*"; exit 1; }

# Prints a prominent closed box to make critical instructions impossible to miss.
# Usage: alert_box COLOR "line 1" "line 2" ...
# Keep each line <= 60 chars so it fits the border width.
alert_box() {
  local color="$1"; shift
  local width=62
  local rule line padded
  rule=$(printf '─%.0s' $(seq 1 "$width"))
  echo ""
  echo -e "  ${color}${BOLD}┌${rule}┐${RESET}"
  for line in "$@"; do
    padded=$(printf '%-*s' "$width" " $line")
    echo -e "  ${color}${BOLD}│${RESET}${color}${padded}${RESET}${color}${BOLD}│${RESET}"
  done
  echo -e "  ${color}${BOLD}└${rule}┘${RESET}"
  echo ""
}

# Computes the previous release tag and the customer-facing (feat/fix/perf)
# commits since it. Sets globals: PREV_TAG, PREV_TAG_FOUND, CHANGELOG_COMMITS,
# COMMIT_COUNT. Safe to call from any step (used by step 2 and step 8).
compute_changelog() {
  local patch
  patch=$(echo "$VERSION" | cut -d. -f3)
  if [[ "$patch" -gt 0 ]]; then
    PREV_TAG="v${MAJOR}.${MINOR}.$(( patch - 1 ))"
  else
    # For X.Y.0 releases, find the most recent release tag
    PREV_TAG=$(gh release list --repo "$REPO" --limit 20 --json tagName -q '.[].tagName' | \
      grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -1)
    PREV_TAG="${PREV_TAG:-}"
  fi

  PREV_TAG_FOUND=false
  CHANGELOG_COMMITS=""
  COMMIT_COUNT=0
  if [[ -n "$PREV_TAG" ]] && gh api "repos/$REPO/git/ref/tags/$PREV_TAG" &>/dev/null; then
    PREV_TAG_FOUND=true
    CHANGELOG_COMMITS=$(gh api "repos/$REPO/compare/${PREV_TAG}...${BASE_BRANCH}" \
      --jq '.commits[].commit.message | split("\n") | .[0]' 2>/dev/null | \
      grep -E '^(feat|fix|perf)(\(|!?:)' || true)
    if [[ -n "$CHANGELOG_COMMITS" ]]; then
      COMMIT_COUNT=$(echo "$CHANGELOG_COMMITS" | wc -l | tr -d ' ')
    fi
  fi
  # Always succeed. An empty changelog is a valid outcome that callers handle,
  # but as the function's last status it would trip set -e and kill the script
  # before step 2 could offer its "release anyway?" prompt.
  return 0
}

# Prints the customer-facing commit list captured by compute_changelog.
print_changelog_list() {
  echo ""
  echo "$CHANGELOG_COMMITS" | while IFS= read -r msg; do
    echo -e "    ${GREEN}•${RESET} $msg"
  done
}

# Percent-encodes a string for use in a URL query value. Pure bash so the
# script keeps its only hard dependency on gh. Safe here because the only
# thing we ever encode is a JQL string built from ASCII PR URLs — commit
# subjects (which can carry non-ASCII) never make it into the query.
urlencode() {
  local str="$1" out="" esc i c
  for (( i = 0; i < ${#str}; i++ )); do
    c="${str:i:1}"
    case "$c" in
      [a-zA-Z0-9.~_-]) out+="$c" ;;
      *) printf -v esc '%%%02X' "'$c"; out+="$esc" ;;
    esac
  done
  printf '%s' "$out"
}

# Builds a Jira search URL matching any ticket whose text references one of
# the given PR numbers.
#
# Searching on the PR URL rather than the GitHub issue URL is deliberate.
# Our tickets carry the PR link in their "Code" section, and Jira indexes it,
# so a PR URL pins the ticket that actually shipped the fix. Searching the
# issue URL instead also matches every other ticket that ever discussed that
# issue — review tickets for superseded contributor PRs, duplicates that were
# closed as Won't Do — and the newest of those is often not the one you want.
# A PR URL also works for commits that closed no GitHub issue at all.
jira_search_url() {
  local jql="" num
  for num in "$@"; do
    [[ -n "$jql" ]] && jql+=" OR "
    jql+="text ~ \"${GH_PR_URL_BASE}/${num}\""
  done
  jql+=" order by created DESC"
  printf '%s/issues/?jql=%s' "$JIRA_BASE_URL" "$(urlencode "$jql")"
}

# Prints a Jira search link covering the commits captured by
# compute_changelog. Pass "list_commits" to print the commit list as well,
# for callers that haven't already shown it.
# Read-only: this only ever builds URLs, it never calls Jira.
print_jira_tickets() {
  local list_commits="${1:-}"
  local msg num url seen=" " start part
  local -a nums=() no_pr=() urls=()

  if [[ -z "$CHANGELOG_COMMITS" ]]; then
    warn "No customer-facing commits — nothing to look up in Jira"
    return
  fi

  # Pull the trailing PR number off each subject, e.g.
  # "fix(range): update knob positions when dualKnobs changes (#31365)" → 31365
  [[ "$list_commits" == "list_commits" ]] && echo ""
  while IFS= read -r msg; do
    [[ -z "$msg" ]] && continue
    num=$(printf '%s' "$msg" | sed -nE 's/.*\(#([0-9]+)\)[[:space:]]*$/\1/p')
    if [[ -z "$num" ]]; then
      no_pr+=("$msg")
      continue
    fi
    # Dedupe, preserving changelog order.
    if [[ "$seen" != *" $num "* ]]; then
      seen+="$num "
      nums+=("$num")
    fi
    if [[ "$list_commits" == "list_commits" ]]; then
      echo -e "    ${GREEN}•${RESET} $msg"
    fi
  done <<< "$CHANGELOG_COMMITS"

  if [[ ${#nums[@]} -eq 0 ]]; then
    warn "No PR references found in the changelog — look these up by hand"
  else
    # Chunk the OR-chain so a big release can't produce an unusable URL.
    start=0
    while [[ $start -lt ${#nums[@]} ]]; do
      urls+=("$(jira_search_url "${nums[@]:start:JQL_CHUNK_SIZE}")")
      start=$(( start + JQL_CHUNK_SIZE ))
    done

    echo ""
    ok "Jira search for the ${#nums[@]} PR(s) in this release:"
    echo ""
    if [[ ${#urls[@]} -eq 1 ]]; then
      echo "    ${urls[0]}"
    else
      part=1
      for url in "${urls[@]}"; do
        [[ $part -gt 1 ]] && echo ""
        echo -e "    ${BOLD}Part ${part}/${#urls[@]}${RESET}:"
        echo "    ${url}"
        part=$(( part + 1 ))
      done
    fi
    echo ""
    info "Assign them without reading a single ID: open the search, then"
    info "'...' > 'Bulk change work items' > select all > Edit >"
    info "'Fix versions' > ${BOLD}${JIRA_RELEASE_NAME}${RESET}."
    echo -e "      ${CYAN}·${RESET} Needs the 'Make bulk changes' global permission."
    echo -e "      ${CYAN}·${RESET} To see the keys instead, add the 'Work item key' column"
    echo -e "        via the 'Columns' control. There's no URL parameter for it,"
    echo -e "        but it's a per-user setting, so it sticks for later searches."
    echo ""
    info "Expect one ticket per PR, so read the count against the ${#nums[@]} PR(s):"
    echo -e "      ${CYAN}·${RESET} Fewer means a PR has no ticket, or its ticket doesn't link"
    echo -e "        the PR yet. Each ticket names its PR, so compare against the"
    echo -e "        commit list to find which."
    echo -e "      ${CYAN}·${RESET} Extra hits are usually [OpenPR] review tickets for superseded"
    echo -e "        contributor PRs, or duplicates resolved Won't Do. Assign the"
    echo -e "        ticket that shipped the fix and skip those."
  fi

  if [[ ${#no_pr[@]} -gt 0 ]]; then
    echo ""
    warn "${#no_pr[@]} commit(s) carry no PR reference — find these by hand:"
    for msg in "${no_pr[@]}"; do
      echo -e "    ${YELLOW}?${RESET} $msg"
    done
  fi

  # Only offer the browser when there's a terminal to answer from, so the
  # ticket list stays safe to pipe or redirect.
  #
  # This runs under --dry-run too. Opening a search reads Jira and changes
  # nothing, and previewing the tickets is exactly what you want a dry run
  # for, so it counts as a read-only lookup rather than a mutation.
  if [[ ${#urls[@]} -gt 0 ]] && [[ -t 0 ]] && command -v open &>/dev/null; then
    if confirm_yn "Open the Jira search in your browser?"; then
      for url in "${urls[@]}"; do
        open "$url"
      done
    fi
  fi
}

confirm() {
  local prompt="${1:-Press Enter to continue (Ctrl+C to abort)...}"
  echo ""
  read -r -p "  $(echo -e "${YELLOW}?${RESET}") $prompt"
}

# Prompts for confirmation, defaulting to yes. Takes a single keypress, so
# there's no Enter to press: Enter on its own accepts the default, y or Y
# accepts, and anything else declines. No re-prompt loop is needed because
# every key is a valid answer.
confirm_yn() {
  local prompt="$1"
  local reply drain
  # A failed read means stdin is closed. Falling through to the "yes" default
  # there would silently auto-approve every prompt in a non-interactive run,
  # so bail instead.
  if ! read -r -n 1 -p "  $(echo -e "${YELLOW}?${RESET}") $prompt [Y/n] " reply; then
    echo ""
    err "stdin closed while waiting for an answer — aborting."
  fi
  # Reading one key leaves the rest of a typed word behind (the "es" of
  # "yes", or the newline after "n"), where it would answer the next prompt
  # for us. Drain that, but only when a key was actually typed: an empty
  # reply means read already consumed the Enter as its delimiter, so anything
  # still buffered is the next answer, not our leftovers.
  if [[ -n "$reply" ]]; then
    read -r -t 0.01 -n 10000 drain 2>/dev/null || true
  fi
  echo ""
  case "$reply" in
    ""|[Yy]) return 0 ;;
    *) return 1 ;;
  esac
}

# ── Argument parsing ──────────────────────────────────────────────────────────
VERSION=""
BASE_BRANCH="main"
START_STEP=1
DRY_RUN=false
TICKETS_ONLY=false

# Logs a mutating action that is skipped in dry-run mode.
dry() { echo -e "  ${YELLOW}[dry-run]${RESET} would: $*"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --from requires a branch name argument"; exit 1
      fi
      BASE_BRANCH="$2"; shift 2 ;;
    --step)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --step requires a step number"; exit 1
      fi
      START_STEP="$2"; shift 2 ;;
    --dry-run)
      DRY_RUN=true; shift ;;
    --tickets)
      TICKETS_ONLY=true; shift ;;
    --help|-h)
      sed -n '3,/^$/p' "$0" | sed -E 's/^# ?//'
      exit 0
      ;;
    -*)
      echo "Unknown option: $1"; exit 1 ;;
    *)
      if [[ -z "$VERSION" ]]; then VERSION="$1"; shift
      else echo "Unexpected argument: $1"; exit 1; fi
      ;;
  esac
done

REPO="ionic-team/ionic-framework"

if ! gh auth status &>/dev/null; then
  echo "Error: not authenticated with gh CLI. Run: gh auth login"
  exit 1
fi

# Releasing needs repo admin: step 7 merges into the base branch with
# --admin and toggles 'Allow merge commits'. Checking up front means nobody
# outside the team gets partway through a release before GitHub stops them.
if [[ "$(gh api "repos/$REPO" --jq '.permissions.admin' 2>/dev/null)" != "true" ]]; then
  echo "Error: releasing needs admin access to ${REPO}, and $(gh api user --jq .login 2>/dev/null || echo 'this account') doesn't have it."
  exit 1
fi

# ── Internal config ───────────────────────────────────────────────────────────
# The Jira site is internal, so it lives in a local file instead of this
# script. Copy scripts/release.env.example to the path below and fill it in
# from the Releases page on Confluence. Nothing runs without it.
RELEASE_CONFIG="${IONIC_RELEASE_CONFIG:-$HOME/.config/ionic-release.env}"
if [[ ! -f "$RELEASE_CONFIG" ]]; then
  echo "Error: no release config at ${RELEASE_CONFIG}."
  echo "Copy scripts/release.env.example there and fill it in from the Releases page on Confluence."
  exit 1
fi

JIRA_BASE_URL=""; JIRA_PROJECT=""
# Parsed rather than sourced, so the file can only ever set these keys.
while IFS='=' read -r key value || [[ -n "$key" ]]; do
  value="${value%\"}"; value="${value#\"}"
  case "$key" in
    JIRA_BASE_URL) JIRA_BASE_URL="${value%/}" ;;
    JIRA_PROJECT)  JIRA_PROJECT="$value" ;;
  esac
done < "$RELEASE_CONFIG"

# Check the shape too, so a placeholder copied straight from the example
# fails here rather than producing dead links at the end of a release.
if [[ ! "$JIRA_BASE_URL" =~ ^https://[a-z0-9-]+\.atlassian\.net$ ]] || [[ "$JIRA_BASE_URL" == "https://your-site.atlassian.net" ]]; then
  echo "Error: JIRA_BASE_URL in ${RELEASE_CONFIG} is missing or not a Jira Cloud site (got: '${JIRA_BASE_URL}')."
  exit 1
fi
if [[ ! "$JIRA_PROJECT" =~ ^[A-Z][A-Z0-9]+$ ]] || [[ "$JIRA_PROJECT" == "ABC" ]]; then
  echo "Error: JIRA_PROJECT in ${RELEASE_CONFIG} is missing or not a Jira project key (got: '${JIRA_PROJECT}')."
  exit 1
fi
JIRA_RELEASES_URL="${JIRA_BASE_URL}/projects/${JIRA_PROJECT}?selectedItem=com.atlassian.jira.jira-projects-plugin:release-page"

# The workflow is dispatched with version=patch, so lerna bumps whatever
# lerna.json on the base branch says. That makes it the source of truth for
# the version npm will actually get.
CURRENT_VERSION=$(gh api -H "Accept: application/vnd.github.raw" \
  "repos/$REPO/contents/lerna.json?ref=$BASE_BRANCH" --jq '.version' 2>/dev/null || true)
NEXT_VERSION=""
if [[ "$CURRENT_VERSION" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
  NEXT_VERSION="${BASH_REMATCH[1]}.${BASH_REMATCH[2]}.$(( BASH_REMATCH[3] + 1 ))"
fi

VERSION_AUTO=false
if [[ -z "$VERSION" ]]; then
  if ! $TICKETS_ONLY && [[ "$START_STEP" == 7 || "$START_STEP" == 8 ]]; then
    echo "Error: --step ${START_STEP} needs an explicit version. Once the release merges,"
    echo "lerna.json on '${BASE_BRANCH}' already holds it, so the next patch would be one too far."
    exit 1
  fi
  if [[ -z "$NEXT_VERSION" ]]; then
    echo "Error: could not read a release version from lerna.json on '${BASE_BRANCH}' (got: '${CURRENT_VERSION}')."
    echo "Pass the version explicitly, e.g. $0 8.8.2"
    exit 1
  fi
  VERSION="$NEXT_VERSION"
  VERSION_AUTO=true
fi

if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: version must be in X.Y.Z format (e.g. 8.8.2), got: '$VERSION'"
  exit 1
fi

# Derive branch names from version (e.g. 8.8.2 → 8.8.x)
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
VERSION_BRANCH="${MAJOR}.${MINOR}.x"
RELEASE_BRANCH="release-${VERSION}"
PR_TITLE="merge ${RELEASE_BRANCH}"
WORKFLOW_NAME="Release - Ionic Framework"
TOTAL_STEPS=8
JIRA_RELEASE_NAME="Ionic Framework ${VERSION}"
GH_PR_URL_BASE="https://github.com/${REPO}/pull"
# Max PR clauses per Jira search URL, so a large release can't build a query
# string long enough for the browser or Jira to truncate it.
JQL_CHUNK_SIZE=25

# Placeholder PR URLs used by --dry-run when the real PRs don't exist yet.
# The trailing numbers let the PR-number extraction in step 7 succeed.
DRY_PR_MAIN_URL="https://github.com/${REPO}/pull/99999"
DRY_PR_VERSION_URL="https://github.com/${REPO}/pull/99998"

if [[ ! "$START_STEP" =~ ^[1-8]$ ]]; then
  echo "Error: --step must be between 1 and $TOTAL_STEPS, got: '$START_STEP'"
  exit 1
fi

# ── Ticket lookup only (--tickets) ────────────────────────────────────────────
# Prints the Jira searches for whatever shipped since the previous tag, then
# exits without touching the release. Read-only, so --dry-run adds nothing.
if $TICKETS_ONLY; then
  if ! gh auth status &>/dev/null; then
    err "Not authenticated with gh CLI. Run: gh auth login"
  fi

  echo ""
  echo -e "${BOLD}Jira tickets for v${VERSION}${RESET}"
  echo -e "  Base branch : ${CYAN}${BASE_BRANCH}${RESET}"
  echo ""

  compute_changelog
  if [[ -z "$PREV_TAG" ]]; then
    err "Could not determine the previous release tag — nothing to compare against."
  elif [[ "$PREV_TAG_FOUND" != true ]]; then
    err "Previous tag '$PREV_TAG' not found on remote — nothing to compare against."
  fi
  info "Comparing ${PREV_TAG}...${BASE_BRANCH}"

  print_jira_tickets list_commits
  echo ""
  exit 0
fi

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   Ionic Framework Patch Release v${VERSION}         ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════╝${RESET}"
echo ""
echo -e "  Release branch : ${CYAN}${RELEASE_BRANCH}${RESET}"
echo -e "  Base branch    : ${CYAN}${BASE_BRANCH}${RESET}"
echo -e "  Version branch : ${CYAN}${VERSION_BRANCH}${RESET}"
echo -e "  Repo           : ${CYAN}${REPO}${RESET}"
if [[ $START_STEP -gt 1 ]]; then
  echo -e "  Starting from  : ${YELLOW}step ${START_STEP}${RESET}"
fi
if $DRY_RUN; then
  echo ""
  alert_box "$YELLOW" \
    "DRY RUN — nothing will be created, triggered, or merged." \
    "Read-only lookups run for real; mutations are printed only."
fi

if $VERSION_AUTO; then
  echo ""
  info "lerna.json on ${BASE_BRANCH} is at ${CURRENT_VERSION}, so this releases ${BOLD}v${VERSION}${RESET}"
  confirm_yn "Release v${VERSION}?" || exit 1
elif [[ -n "$NEXT_VERSION" && "$VERSION" != "$NEXT_VERSION" && $START_STEP -le 6 ]]; then
  # From step 7 on, the release may already have merged into the base branch
  # and bumped lerna.json there, so a mismatch means nothing.
  echo ""
  warn "lerna.json on ${BASE_BRANCH} is at ${CURRENT_VERSION}, so the workflow will publish ${BOLD}${NEXT_VERSION}${RESET}, not ${VERSION}."
  warn "The branch, PRs and Jira release would all be named for the wrong version."
  confirm_yn "Continue with v${VERSION} anyway?" || exit 1
fi

# Looks up the release PR targeting branch $1, in ANY state. Echoes
# "<url> <state>", or nothing when no such PR exists.
#
# --state all matters: gh pr list defaults to open only, and step 7 merges both
# PRs. An open-only lookup therefore can never succeed once step 7 has run, and
# only half-succeeds when step 7 drops out between its two merges, which is
# exactly when someone reaches for --step.
find_pr() {
  gh pr list --repo "$REPO" --head "$RELEASE_BRANCH" --base "$1" \
    --state all --json url,state -q '.[0] | select(.) | "\(.url) \(.state)"' 2>/dev/null || true
}

# Watches a PR's checks until they finish. Returns non-zero when a check
# failed or no checks ever registered, so the caller can fall back to asking.
watch_checks() {
  local num="$1" i out
  # A PR opened seconds ago may not have registered its checks yet, and
  # `gh pr checks` errors out while there are none to report.
  for i in {1..20}; do
    out=$(gh pr checks "$num" --repo "$REPO" 2>&1 || true)
    [[ "$out" == *"no checks reported"* ]] || break
    [[ $i -eq 20 ]] && { warn "No checks registered on PR #${num} after 2 minutes"; return 1; }
    sleep 6
  done
  gh pr checks "$num" --repo "$REPO" --watch --fail-fast --interval 30
}

# The repo keeps 'Allow merge commits' off so contributor PRs get squashed,
# but the release PRs must be regular merges. Step 7 turns it on for the
# merges and turns it back off afterwards, including when the script exits
# early, via the EXIT trap.
MERGE_COMMITS_ENABLED_BY_US=false

enable_merge_commits() {
  if [[ "$(gh api "repos/$REPO" --jq '.allow_merge_commit' 2>/dev/null)" == "true" ]]; then
    ok "'Allow merge commits' is already on, leaving it as found"
  elif $DRY_RUN; then
    dry "enable 'Allow merge commits' for the merges and disable it again after"
  elif gh api -X PATCH "repos/$REPO" -F allow_merge_commit=true --silent; then
    MERGE_COMMITS_ENABLED_BY_US=true
    trap restore_merge_commits EXIT
    # Route Ctrl+C through exit so the EXIT trap still runs.
    trap 'exit 130' INT TERM
    ok "Enabled 'Allow merge commits' (it is disabled again after the merges)"
    # Reads lag the write by a few seconds and replicas disagree in the
    # meantime (seen: true, true, false, false), so a merge sent straight away
    # can still find the setting off. Wait for three consecutive reads of true.
    local streak=0 i
    for i in {1..30}; do
      if [[ "$(gh api "repos/$REPO" --jq '.allow_merge_commit' 2>/dev/null)" == "true" ]]; then
        streak=$(( streak + 1 ))
        [[ $streak -ge 3 ]] && break
      else
        streak=0
      fi
      sleep 1
    done
    [[ $streak -ge 3 ]] || warn "The setting hasn't settled yet. If a merge below fails, the manual fallback covers it."
  else
    warn "Could not enable 'Allow merge commits' (needs repo admin)."
    info "Enable it in repo settings, and disable it again after the merges."
    confirm "Press Enter once it's enabled..."
  fi
}

restore_merge_commits() {
  $MERGE_COMMITS_ENABLED_BY_US || return 0
  if gh api -X PATCH "repos/$REPO" -F allow_merge_commit=false --silent; then
    MERGE_COMMITS_ENABLED_BY_US=false
    ok "Disabled 'Allow merge commits' again"
  else
    alert_box "$RED" \
      "Could not disable 'Allow merge commits'." \
      "Turn it off in repo settings by hand."
  fi
}

# ── State recovery (when resuming from a later step) ──────────────────────────
# Each guard asserts only the state the STARTING step actually consumes, not
# everything the earlier steps produced. That distinction is the whole point:
# step 7 merges both PRs and GitHub deletes the release branch on merge, so by
# step 8 the branch and the open PRs are gone by design. Step 8 (Jira) needs
# neither; it recomputes the changelog from ${PREV_TAG}...${BASE_BRANCH}.
PR_MAIN_URL=""; PR_MAIN_STATE=""
PR_VERSION_URL=""; PR_VERSION_STATE=""
PR_MAIN_MERGED=false; PR_VERSION_MERGED=false

if [[ $START_STEP -gt 1 ]]; then
  echo ""
  info "Checking prerequisites for step ${START_STEP}..."

  # Steps 5-7 need the release branch (created in step 4). Step 8 does not,
  # it is deleted when step 7 merges.
  if [[ $START_STEP -ge 5 && $START_STEP -le 7 ]]; then
    if ! gh api "repos/$REPO/git/ref/heads/$RELEASE_BRANCH" &>/dev/null; then
      if $DRY_RUN; then
        dry "assume release branch '${RELEASE_BRANCH}' exists (not found)"
      else
        err "Release branch '${RELEASE_BRANCH}' not found on remote. Run from step 4."
      fi
    else
      ok "Release branch '${RELEASE_BRANCH}' exists"
    fi
  fi

  # Steps 6-7 need version bumps on the release branch (pushed by workflow in
  # step 5). The comparison needs the branch, so it cannot run at step 8 either.
  if [[ $START_STEP -ge 6 && $START_STEP -le 7 ]]; then
    AHEAD=$(gh api "repos/$REPO/compare/${BASE_BRANCH}...${RELEASE_BRANCH}" \
      --jq '.ahead_by' 2>/dev/null || echo "0")
    # Guard against non-numeric output (e.g. a 404 body when the branch is missing)
    [[ "$AHEAD" =~ ^[0-9]+$ ]] || AHEAD=0
    if [[ "$AHEAD" -eq 0 ]]; then
      if $DRY_RUN; then
        dry "assume ${RELEASE_BRANCH} has version-bump commits ahead of ${BASE_BRANCH}"
      else
        err "${RELEASE_BRANCH} has no commits ahead of ${BASE_BRANCH}. Run step 5 first (workflow pushes version bumps)."
      fi
    else
      ok "${RELEASE_BRANCH} is ${AHEAD} commit(s) ahead of ${BASE_BRANCH}"
    fi
  fi

  # Steps 7-8 need the PRs created in step 6. Step 7 merges them, step 8
  # only confirms they landed. PRs survive the branch deletion, so they are
  # the one piece of step 6's state that is still readable at step 8.
  if [[ $START_STEP -ge 7 ]]; then
    read -r PR_MAIN_URL PR_MAIN_STATE <<< "$(find_pr "$BASE_BRANCH")"
    read -r PR_VERSION_URL PR_VERSION_STATE <<< "$(find_pr "$VERSION_BRANCH")"

    if [[ -z "$PR_MAIN_URL" ]] && $DRY_RUN; then
      dry "assume PR ${RELEASE_BRANCH} → ${BASE_BRANCH} exists"
      PR_MAIN_URL="$DRY_PR_MAIN_URL"; PR_MAIN_STATE="OPEN"
    fi
    if [[ -z "$PR_VERSION_URL" ]] && $DRY_RUN; then
      dry "assume PR ${RELEASE_BRANCH} → ${VERSION_BRANCH} exists"
      PR_VERSION_URL="$DRY_PR_VERSION_URL"; PR_VERSION_STATE="OPEN"
    fi

    [[ "$PR_MAIN_STATE"    == "MERGED" ]] && PR_MAIN_MERGED=true
    [[ "$PR_VERSION_STATE" == "MERGED" ]] && PR_VERSION_MERGED=true

    if [[ $START_STEP -eq 7 ]]; then
      # Step 7 still has merging to do, so a missing PR is fatal. An already
      # merged one is not: step 7 skips the merges that already happened.
      [[ -n "$PR_MAIN_URL" ]]    || err "No PR found for ${RELEASE_BRANCH} → ${BASE_BRANCH}. Run step 6 first."
      [[ -n "$PR_VERSION_URL" ]] || err "No PR found for ${RELEASE_BRANCH} → ${VERSION_BRANCH}. Run step 6 first."
      ok "PR (→ ${BASE_BRANCH}): ${PR_MAIN_URL} [${PR_MAIN_STATE}]"
      ok "PR (→ ${VERSION_BRANCH}): ${PR_VERSION_URL} [${PR_VERSION_STATE}]"
    else
      # Step 8 has nothing left to merge, so this is advisory. Someone may be
      # rerunning the Jira half on a release that finished days ago.
      if $PR_MAIN_MERGED && $PR_VERSION_MERGED; then
        ok "Both release PRs merged"
      else
        warn "Release PRs are not both merged (${BASE_BRANCH}: ${PR_MAIN_STATE:-not found}, ${VERSION_BRANCH}: ${PR_VERSION_STATE:-not found})."
        warn "Step 7 may not have finished. The Jira release should come after the merges."
        confirm_yn "Continue to the Jira release anyway?" || exit 1
      fi
    fi
  fi
fi

# ── Step 1: Preflight checks ──────────────────────────────────────────────────
if [[ $START_STEP -le 1 ]]; then

step 1 $TOTAL_STEPS "Preflight checks"

# Verify gh is authenticated
if ! gh auth status &>/dev/null; then
  err "Not authenticated with gh CLI. Run: gh auth login"
fi
ok "gh CLI authenticated"

# Verify we're in the right repo
CURRENT_REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
if [[ "$CURRENT_REPO" != "$REPO" ]]; then
  warn "Current repo is '${CURRENT_REPO}', expected '${REPO}'"
  confirm_yn "Continue anyway?" || exit 1
fi

# Verify base branch exists on remote
if ! gh api "repos/$REPO/git/ref/heads/$BASE_BRANCH" &>/dev/null; then
  err "Base branch '$BASE_BRANCH' not found on remote"
fi
ok "Base branch '$BASE_BRANCH' exists"

# Verify version branch exists on remote
if ! gh api "repos/$REPO/git/ref/heads/$VERSION_BRANCH" &>/dev/null; then
  err "Version branch '$VERSION_BRANCH' not found on remote. For a patch release this should already exist."
fi
ok "Version branch '$VERSION_BRANCH' exists"

# Check release branch doesn't already exist
if gh api "repos/$REPO/git/ref/heads/$RELEASE_BRANCH" &>/dev/null 2>&1; then
  warn "Release branch '$RELEASE_BRANCH' already exists on remote"
  confirm_yn "Continue with existing branch?" || exit 1
fi

fi # end step 1

# ── Step 2: Changelog check ──────────────────────────────────────────────────
if [[ $START_STEP -le 2 ]]; then

step 2 $TOTAL_STEPS "Check for customer-facing changes"

compute_changelog

if [[ -z "$PREV_TAG" ]]; then
  warn "Could not determine previous release tag"
  confirm "Press Enter to continue without change verification..."
elif [[ "$PREV_TAG_FOUND" != true ]]; then
  warn "Previous tag '$PREV_TAG' not found on remote"
  confirm "Press Enter to continue without change verification..."
else
  info "Comparing ${PREV_TAG}...${BASE_BRANCH}..."
  if [[ -n "$CHANGELOG_COMMITS" ]]; then
    ok "Found $COMMIT_COUNT changelog commit(s) since $PREV_TAG:"
    print_changelog_list
  else
    warn "No feat/fix/perf commits found between $PREV_TAG and $BASE_BRANCH"
    if ! confirm_yn "No customer-facing changes — release anyway?"; then
      echo ""
      echo -e "${RED}Release aborted.${RESET} Nothing to release."
      exit 1
    fi
  fi
fi

fi # end step 2

# ── Step 3: Code freeze ───────────────────────────────────────────────────────
if [[ $START_STEP -le 3 ]]; then

step 3 $TOTAL_STEPS "Code freeze"

echo ""
echo -e "  Post this message in the relevant Slack channels:"
alert_box "$YELLOW" ":snowflake: Code freeze on ${BASE_BRANCH}, ${VERSION_BRANCH} :snowflake:"
confirm "Press Enter once you've posted the code freeze message..."

fi # end step 3

# ── Step 4: Create release branch ─────────────────────────────────────────────
if [[ $START_STEP -le 4 ]]; then

step 4 $TOTAL_STEPS "Create release branch"

if gh api "repos/$REPO/git/ref/heads/$RELEASE_BRANCH" &>/dev/null 2>&1; then
  warn "Branch '$RELEASE_BRANCH' already exists — skipping creation"
else
  info "Resolving HEAD SHA of '$BASE_BRANCH'..."
  BASE_SHA=$(gh api "repos/$REPO/git/ref/heads/$BASE_BRANCH" --jq '.object.sha') \
    || err "Failed to resolve HEAD SHA for '$BASE_BRANCH'"

  if $DRY_RUN; then
    dry "create branch '$RELEASE_BRANCH' from '$BASE_BRANCH' ($BASE_SHA)"
  else
    info "Creating '$RELEASE_BRANCH' from '$BASE_BRANCH' ($BASE_SHA)..."
    gh api "repos/$REPO/git/refs" \
      --method POST \
      -f ref="refs/heads/$RELEASE_BRANCH" \
      -f sha="$BASE_SHA" \
      --silent
    ok "Branch '$RELEASE_BRANCH' created on remote"
  fi
fi

fi # end step 4

# ── Step 5: Trigger release workflow ─────────────────────────────────────────
if [[ $START_STEP -le 5 ]]; then

step 5 $TOTAL_STEPS "Trigger release workflow"

if $DRY_RUN; then
  dry "trigger '${WORKFLOW_NAME}' on '$RELEASE_BRANCH' (release-type=production, version=patch, tag=latest)"
  dry "wait for the workflow run to complete (15–30 min) — skipped"
  ok "Workflow step skipped (dry-run)"
else

info "Triggering '${WORKFLOW_NAME}' on '$RELEASE_BRANCH'..."
gh workflow run "$WORKFLOW_NAME" \
  --repo "$REPO" \
  --ref "$RELEASE_BRANCH" \
  -f release-type=production \
  -f version=patch \
  -f tag=latest

info "Waiting for workflow run to register..."
RUN_URL=""
for i in {1..10}; do
  RUN_URL=$(gh run list \
    --repo "$REPO" \
    --workflow "$WORKFLOW_NAME" \
    --branch "$RELEASE_BRANCH" \
    --limit 1 \
    --json url \
    -q '.[0].url' 2>/dev/null || true)
  [[ -n "$RUN_URL" ]] && break
  sleep 3
done
RUN_URL="${RUN_URL:-https://github.com/${REPO}/actions}"

ok "Workflow triggered"
info "Monitor progress at: ${RUN_URL}"

# Extract run ID from URL (format: .../actions/runs/12345678)
RUN_ID=$(echo "$RUN_URL" | grep -oE '[0-9]+$' || true)

if [[ -n "$RUN_ID" ]]; then
  echo ""
  info "Waiting for workflow to complete (this may take 15–30 min)..."
  echo ""
  if ! gh run watch "$RUN_ID" --repo "$REPO" --exit-status; then
    err "Workflow failed — check: ${RUN_URL}"
  fi
  ok "Workflow completed successfully"
else
  warn "Could not determine run ID — monitor manually: ${RUN_URL}"
  confirm "Press Enter once the workflow has completed successfully..."
fi

fi # end dry-run guard

fi # end step 5

# ── Step 6: Create PRs ────────────────────────────────────────────────────────
if [[ $START_STEP -le 6 ]]; then

step 6 $TOTAL_STEPS "Create PRs"

# PR into main
PR_MAIN_URL=$(gh pr list --repo "$REPO" --head "$RELEASE_BRANCH" --base "$BASE_BRANCH" --state open --json url -q '.[0].url' 2>/dev/null || true)
if [[ -n "$PR_MAIN_URL" ]]; then
  ok "PR (→ ${BASE_BRANCH}) already exists: ${PR_MAIN_URL}"
elif $DRY_RUN; then
  dry "create PR ${RELEASE_BRANCH} → ${BASE_BRANCH} (title: '${PR_TITLE}', body: 'v${VERSION}')"
  PR_MAIN_URL="$DRY_PR_MAIN_URL"
else
  info "Creating PR: ${RELEASE_BRANCH} → ${BASE_BRANCH}..."
  PR_MAIN_URL=$(gh pr create \
    --repo "$REPO" \
    --head "$RELEASE_BRANCH" \
    --base "$BASE_BRANCH" \
    --title "$PR_TITLE" \
    --body "v${VERSION}") || err "Failed to create PR into ${BASE_BRANCH}"
  ok "PR (→ ${BASE_BRANCH}): ${PR_MAIN_URL}"
fi

# PR into version branch
PR_VERSION_URL=$(gh pr list --repo "$REPO" --head "$RELEASE_BRANCH" --base "$VERSION_BRANCH" --state open --json url -q '.[0].url' 2>/dev/null || true)
if [[ -n "$PR_VERSION_URL" ]]; then
  ok "PR (→ ${VERSION_BRANCH}) already exists: ${PR_VERSION_URL}"
elif $DRY_RUN; then
  dry "create PR ${RELEASE_BRANCH} → ${VERSION_BRANCH} (title: '${PR_TITLE}', body: 'Release ${VERSION}')"
  PR_VERSION_URL="$DRY_PR_VERSION_URL"
else
  info "Creating PR: ${RELEASE_BRANCH} → ${VERSION_BRANCH}..."
  PR_VERSION_URL=$(gh pr create \
    --repo "$REPO" \
    --head "$RELEASE_BRANCH" \
    --base "$VERSION_BRANCH" \
    --title "$PR_TITLE" \
    --body "Release ${VERSION}") || err "Failed to create PR into ${VERSION_BRANCH}"
  ok "PR (→ ${VERSION_BRANCH}): ${PR_VERSION_URL}"
fi

fi # end step 6

# ── Step 7: Wait and merge ────────────────────────────────────────────────────
if [[ $START_STEP -le 7 ]]; then

step 7 $TOTAL_STEPS "Merge PRs"

# A resume can land here with one merge already done. Step 7 is two separate
# merges with a manual gate in front of them, so it drops out half-finished more
# often than any other step. Report what is already merged and only ask about
# what is left.
if $PR_MAIN_MERGED && $PR_VERSION_MERGED; then
  ok "Both PRs are already merged — nothing to do in this step"
else

echo ""
info "Release PRs:"
$PR_MAIN_MERGED    && ok "1. ${PR_MAIN_URL} (already merged)"    || echo "    1. ${PR_MAIN_URL}"
$PR_VERSION_MERGED && ok "2. ${PR_VERSION_URL} (already merged)" || echo "    2. ${PR_VERSION_URL}"

# Extract PR numbers from URLs
PR_MAIN_NUM=$(echo "$PR_MAIN_URL" | grep -oE '[0-9]+$' || true)
PR_VERSION_NUM=$(echo "$PR_VERSION_URL" | grep -oE '[0-9]+$' || true)
if [[ -z "$PR_MAIN_NUM" || -z "$PR_VERSION_NUM" ]]; then
  err "Failed to extract PR numbers from URLs: '${PR_MAIN_URL}' / '${PR_VERSION_URL}'"
fi

# Wait for checks on whichever PRs still need merging. Any failure, or checks
# that never show up, falls back to the old manual confirmation rather than
# merging over a red PR.
CHECKS_GREEN=true
for num in $( $PR_VERSION_MERGED || echo "$PR_VERSION_NUM" ) $( $PR_MAIN_MERGED || echo "$PR_MAIN_NUM" ); do
  echo ""
  if $DRY_RUN; then
    dry "watch checks on PR #${num} until they finish"
  else
    info "Waiting for checks on PR #${num}..."
    watch_checks "$num" || CHECKS_GREEN=false
  fi
done

if ! $CHECKS_GREEN; then
  warn "Checks did not all pass (see above)."
  confirm "Press Enter once BOTH PRs are green and ready to merge (Ctrl+C to abort)..."
elif ! $DRY_RUN; then
  ok "Checks passed"
fi

enable_merge_commits

# Merge into version branch first (lower risk)
info "Merging ${RELEASE_BRANCH} → ${VERSION_BRANCH}..."
if $PR_VERSION_MERGED; then
  ok "Already merged into ${VERSION_BRANCH}, skipping"
elif $DRY_RUN; then
  dry "regular-merge PR #${PR_VERSION_NUM} → ${VERSION_BRANCH} (subject: '${PR_TITLE}', body: 'Release ${VERSION}')"
  ok "Merge into ${VERSION_BRANCH} skipped (dry-run)"
elif gh pr merge "$PR_VERSION_NUM" \
  --repo "$REPO" \
  --merge \
  --subject "$PR_TITLE" \
  --body "Release ${VERSION}" \
  --admin; then
  ok "Merged into ${VERSION_BRANCH}"
else
  warn "Could not auto-merge the ${VERSION_BRANCH} PR (may need admin bypass)."
  alert_box "$RED" "IMPORTANT: Use a regular merge commit — NOT squash/rebase."
  info "Merge it manually at: ${PR_VERSION_URL}"
  info "  Subject : ${PR_TITLE}"
  info "  Body    : Release ${VERSION}"
  confirm "Press Enter once that PR is merged..."
fi

# Merge into main (requires bypass)
info "Merging ${RELEASE_BRANCH} → ${BASE_BRANCH} (bypass branch protection required)..."
if $PR_MAIN_MERGED; then
  ok "Already merged into ${BASE_BRANCH}, skipping"
elif $DRY_RUN; then
  dry "regular-merge PR #${PR_MAIN_NUM} → ${BASE_BRANCH} (subject: '${PR_TITLE}', body: 'v${VERSION}')"
  ok "Merge into ${BASE_BRANCH} skipped (dry-run)"
elif gh pr merge "$PR_MAIN_NUM" \
  --repo "$REPO" \
  --merge \
  --subject "$PR_TITLE" \
  --body "v${VERSION}" \
  --admin; then
  ok "Merged into ${BASE_BRANCH}"
else
  warn "Could not auto-merge the ${BASE_BRANCH} PR (likely needs 'Bypass branch protection')."
  alert_box "$RED" "IMPORTANT: Use a regular merge commit — NOT squash/rebase."
  info "Merge it manually at: ${PR_MAIN_URL}"
  info "  Subject : ${PR_TITLE}"
  info "  Body    : v${VERSION}"
  confirm "Press Enter once that PR is merged..."
fi

restore_merge_commits
trap - EXIT INT TERM

fi # end "not already fully merged"

fi # end step 7

# ── Step 8: Jira release ──────────────────────────────────────────────────────
if [[ $START_STEP -le 8 ]]; then

step 8 $TOTAL_STEPS "Jira release"

# Recompute the customer-facing changes so they're visible here for the
# release notes, and surface the release date span for the Jira release field.
compute_changelog
PREV_RELEASE_DATE=""
if [[ -n "$PREV_TAG" ]]; then
  PREV_RELEASE_DATE=$(gh release view "$PREV_TAG" --repo "$REPO" --json publishedAt -q '.publishedAt' 2>/dev/null | cut -dT -f1 || true)
fi
TODAY=$(date +%Y-%m-%d)

echo ""
info "Create or locate the Jira release named: ${BOLD}${JIRA_RELEASE_NAME}${RESET}"
info "Releases page: ${JIRA_RELEASES_URL}"
echo ""
info "Release date for the Jira release field:"
if [[ -n "$PREV_RELEASE_DATE" ]]; then
  echo -e "    Previous release (${PREV_TAG}): ${PREV_RELEASE_DATE}"
fi
echo -e "    Release date (today)      : ${BOLD}${TODAY}${RESET}"

if [[ -n "$CHANGELOG_COMMITS" ]]; then
  echo ""
  ok "Customer-facing changes in this release (for release notes):"
  print_changelog_list
fi

print_jira_tickets

echo ""
echo -e "  Checklist:"
echo -e "    ${CYAN}□${RESET} Create release '${JIRA_RELEASE_NAME}' if it doesn't exist (requires admin)"
echo -e "    ${CYAN}□${RESET} Assign relevant bug fix / feature tickets to the release"
echo -e "        (use the search above; skip tickets already linked to included issues)"
echo -e "    ${CYAN}□${RESET} Click the 'Unreleased' dropdown → 'Release'"
echo -e "    ${CYAN}□${RESET} Uncheck 'Create release notes'"
echo -e "    ${CYAN}□${RESET} Click 'Release'"
echo ""
confirm "Press Enter once the Jira release is marked as published..."

fi # end step 8

# ── Post-release ──────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}${GREEN}║   v${VERSION} released successfully! 🎉              ║${RESET}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${RESET}"
echo ""
GH_RELEASE_URL="https://github.com/${REPO}/releases/tag/v${VERSION}"

echo -e "  Post this in the relevant Slack channels to end the code freeze:"
alert_box "$GREEN" ":fire: Code unfreeze on ${BASE_BRANCH}, ${VERSION_BRANCH} :fire:"

# Release announcement. We post a link to the GitHub release
# page with a random celebratory emoji (pick your own — this is just a suggestion).
EMOJIS=(🎉 🚀 🥳 🎊 🙌 ✨ 🔥 🎈 🌮 🦄 🍾 ⭐ 💜 🕺 🐙 🧨)
SUGGESTED_EMOJI="${EMOJIS[$((RANDOM % ${#EMOJIS[@]}))]}"

echo -e "  Also announce the release in the relevant Slack channels"
echo -e "  (the version should link to the GitHub release page):"
alert_box "$GREEN" "Ionic Framework v${VERSION} has been released! ${SUGGESTED_EMOJI}"
info "Release link: ${GH_RELEASE_URL}"
info "Suggested emoji: ${SUGGESTED_EMOJI}  (swap it for whatever's fun)"
echo ""
info "npm: https://www.npmjs.com/package/@ionic/core/v/${VERSION}"
info "GH release: ${GH_RELEASE_URL}"
echo ""
