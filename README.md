# GIF Folders for Vencord
Organize your Discord GIFs into custom named folders straight from your Discord channels, or your existing favorited gifs.

(Image: Put your gif in a folder directly from your gif picker.)

<img width="505" height="200" alt="image" src="https://github.com/user-attachments/assets/69598934-2a71-4588-b5c6-e6eec03d2eaf" />

(Image: Put your gif in a folder out of a DM or server channel.)

<img width="505" height="200" alt="image" src="https://github.com/user-attachments/assets/e8e3aee3-f1bf-4965-ac63-94eb528a78cf" />

(Image: Use your gif folders right out of the default Discord GIF picker.)

<img width="505" height="200" alt="image" src="https://github.com/user-attachments/assets/84ac922d-5d64-4950-9569-bb76d84aac75" />

Custom Vencord plugins by [@lumi_vrc](https://github.com/Lumi-VRC).

`GifFolders` lets you organize Discord GIFs into named folders. The optional
`HideDefaultGifCategories` plugin hides Discord's built-in GIF categories while
keeping Favorites and your custom folders.

## Important

Normal Vencord installations cannot load loose plugin files. Custom plugins
must be copied into a Vencord source checkout and compiled into a custom build.
The generic downloadable Vencord installer cannot build these plugins.

In other words, you must "Manually" download and install vencord in order to *have* a "userplugins" folder, in order to use custom plugins.

Only install custom plugins whose source code you trust.

## Requirements

- [Git](https://git-scm.com/downloads)
- [Node.js 22 or newer](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

If pnpm is missing after installing Node.js, run:

```sh
npm install --global pnpm
```

## Installation

1. Clone Vencord and this plugin repository:

   ```sh
   git clone https://github.com/Vendicated/Vencord.git
   git clone https://github.com/Lumi-VRC/VencordPlugins.git
   ```

2. Create `Vencord/src/userplugins` if it does not already exist.

3. Copy the plugin folders from `VencordPlugins` (this repository) into
   `Vencord/src/userplugins`:

   ```text
   Vencord/src/userplugins/GifFolders/
   Vencord/src/userplugins/HideDefaultGifCategories/
   ```

   `GifFolders` is required. `HideDefaultGifCategories` is optional and depends
   on `GifFolders`.

4. Install Vencord's dependencies and build it:

   ```sh
   cd Vencord
   pnpm install --frozen-lockfile
   pnpm build
   ```

5. Close Discord and install the custom build using one of these methods.

   Interactive installer:

   ```sh
   pnpm inject
   ```

   Select Discord Stable, PTB, or Canary when prompted.

   Direct installation (alternative to using the installer included in the files) (optional "--branch canary" for Discord Canary):

   ```sh
   node scripts/runInstaller.mjs -- --install --branch canary
   ```

6. Restart Discord and open **Discord Settings → Vencord → Plugins**.

7. Enable:

   - **GifFolders**
   - **HideDefaultGifCategories** (optional)

## Usage

- Open the GIF picker to create and browse folders.
- Right-click a GIF in the picker or a message and select **GIF Folders**.
- A GIF can belong to multiple folders.
- Rename or delete folders from the **GifFolders** plugin settings.
- Deleting a folder does not remove its GIFs from Discord Favorites.
- Folder data is stored locally for each Discord account.

## Updating

1. Run `git pull` in both the `Vencord` and `VencordPlugins` repositories.
2. Copy the updated plugin folders into `Vencord/src/userplugins` again.
3. Reinstall dependencies, rebuild, and restart Discord:

   ```sh
   cd Vencord
   pnpm install --frozen-lockfile
   pnpm build
   ```

You normally do not need to inject again unless Vencord was removed or Discord
replaced its patched installation.

## Troubleshooting

### The plugins do not appear

- Confirm the folders are directly inside `Vencord/src/userplugins`.
- Confirm each folder contains its `index.ts` or `index.tsx`.
- Run `pnpm build` again and restart Discord.

### Git or pnpm is not recognized

Restart your terminal after installation and confirm both tools are available:

```sh
git --version
pnpm --version
```

### Discord Canary was not modified

Close Canary completely and run:

```sh
node scripts/runInstaller.mjs -- --install --branch canary
```

Contact @lumi_vrc on discord for limited support
I will not handhold you through the install if you've never used Vencord before. Go ask ChatGPT dumb questions.
