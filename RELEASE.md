# Release & Publishing Guide

This project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process.

## Release Process

### 1. Choose a Release Version

- The release version should be chosen according to [SemVer](https://semver.org/)
- Analyze the changes to see whether they include:
  - **Breaking changes** → Major version bump (e.g., 1.0.0 → 2.0.0)
  - **New features** → Minor version bump (e.g., 1.0.0 → 1.1.0)
  - **Bug fixes/patches** → Patch version bump (e.g., 1.0.0 → 1.0.1)
- See [the SemVer specification](https://semver.org/) for more information
- Removing public exports is a breaking change. Version 3.0.0 is the release that removed the legacy categorizers (V1, V2, V3, V5) and their translations.
- If the English translation source changed since the last release, sync translations before releasing (see [Translations](#translations))

### 2. Handle Backport Releases (if applicable)

If this release is backporting changes onto a previous release:

- Ensure there is a major version branch for that version (e.g., `1.x` for a `v1` backport release)
- The major version branch should be set to the most recent release with that major version
  - Example: When backporting a `v1.0.2` release, ensure there's a `1.x` branch set to the `v1.0.1` tag

### 3. Create the Release PR

Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action:

1. Go to **Actions** tab in GitHub
2. Select **"Create Release Pull Request"** workflow
3. Click **"Run workflow"**
4. Configure:
   - **Base branch**: 
     - For backport release: use the major version branch from step 2
     - For normal release: use `main` (default)
   - **Release type**: Choose `major`, `minor`, or `patch`
   - OR specify a **Release version**: Exact version number

This triggers the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

### 4. Update the Changelog

Edit the generated CHANGELOG.md in the release PR:

- Move each change entry into the appropriate category (see [Keep a Changelog](https://keepachangelog.com/en/1.0.0/#types)):
  - **Added** - for new features
  - **Changed** - for changes in existing functionality
  - **Deprecated** - for soon-to-be removed features
  - **Removed** - for now removed features
  - **Fixed** - for any bug fixes
  - **Security** - in case of vulnerabilities

- Edit entries to be user-friendly:
  - Generally omit changes that don't affect consumers (e.g., lockfile changes, dev environment changes)
  - Make exceptions for interesting changes (major test improvements, security improvements, documentation, etc.)
  - Explain changes in terms users would understand (avoid internal variables/concepts)
  - Consolidate related changes into one entry if it makes explanation easier

- Validate the changelog:
  ```bash
  npx @metamask/auto-changelog validate --rc
  ```

### 5. Review and QA the Release

- Thoroughly review all changes in the release PR
- Perform QA testing as appropriate
- **Important**: Avoid merging other PRs into the base branch during review
  - If changes are made to the base branch, the release branch must be updated and review/QA restarts

### 6. Merge the Release PR

- Use **Squash & Merge** to merge the release PR
- This triggers the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to:
  - Tag the final release commit
  - Publish the release on GitHub
  - Automatically publish to npm (if configured)

### 7. Verify the Release

After the automated workflows complete:

1. Check that the GitHub release was created successfully
2. Verify the npm package was published (if applicable):
   ```bash
   npm view @metamask/tx-categorize versions
   ```
3. Test installation of the new version:
   ```bash
   npm install @metamask/tx-categorize@latest
   ```

## Translations

Translations are managed in Crowdin and synced by the **Crowdin Sync** workflow (`.github/workflows/crowdin.yml`). Only the English source is edited by hand.

The workflow needs these repository secrets: `CROWDIN_PROJECT_ID`, `CROWDIN_PERSONAL_TOKEN` and `METAMASKBOT_CROWDIN_TOKEN` (a token that can push branches and open pull requests). Its file mapping is in `crowdin.yml` at the repository root.

Before a release that changes any English label:

1. Go to **Actions** → **Crowdin Sync** → **Run workflow**. This uploads `src/localizationV2/locales/en/translation.json` to Crowdin and opens a pull request with the translations Crowdin has. The pull request updates `src/localizationV2/locales/<code>/translation.json`.
2. Review and merge that pull request before creating the release PR. The `localizationV2` tests fail if a translation is missing a key or a placeholder.
3. Translations that are not finished yet stay in English until the next run after translators complete them.

## Manual NPM Publishing (Alternative)

If automated npm publishing is not configured or fails:

1. **Use a clean local environment**:
   ```bash
   git checkout main
   git pull origin main
   yarn install --immutable
   yarn build
   ```

2. **Dry run first**:
   ```bash
   npm publish --dry-run
   ```
   - Examine the output to ensure correct files are included
   - Compare to previous releases if necessary: `https://unpkg.com/browse/[package-name]@[version]/`

3. **Publish when confident**:
   ```bash
   npm publish
   ```

## Required GitHub Secrets

Ensure these secrets are configured in your repository settings:

- `NPM_TOKEN` - Passed to the npm publish step (set in `npm-publish` environment)
- `SLACK_WEBHOOK_URL` - For release notifications
- `SECURITY_SCAN_METRICS_TOKEN` - For security scanning metrics (optional)

## Quick Reference Commands

```bash
# Validate changelog
npx @metamask/auto-changelog validate --rc

# Build project
yarn build

# Run tests
yarn test

# Check types
yarn test:types

# Lint code
yarn lint

# Dry run npm publish
npm publish --dry-run

# View published versions
npm view @metamask/tx-categorize versions
```

## Resources

- [SemVer Specification](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [MetaMask action-create-release-pr](https://github.com/MetaMask/action-create-release-pr)
- [MetaMask action-publish-release](https://github.com/MetaMask/action-publish-release)
- [GitHub workflow_dispatch documentation](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch)

