# GIF Folders for Vencord
Organize your Discord GIFs into custom named folders.

<img width="505" height="200" alt="image" src="https://github.com/user-attachments/assets/e8e3aee3-f1bf-4965-ac63-94eb528a78cf" />

<img width="738" height="534" alt="image" src="https://github.com/user-attachments/assets/84ac922d-5d64-4950-9569-bb76d84aac75" />


The optional `HideDefaultGifCategories` plugin hides Discord's shit built-in gif folders for easier access to your custom folders.
## Requirements
- [Git](https://git-scm.com/downloads)
- [Node.js 22 or newer](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
Custom plugins must be compiled into Vencord. They cannot be copied into a
normal Vencord AppData installation. In other words, you must "manually" install Vencord, before using custom plugins.
## Installation
1. Clone Vencord and install its dependencies:
   ```sh
   git clone https://github.com/Vendicated/Vencord.git
   cd Vencord
   pnpm install --frozen-lockfile
   ```
2. Copy these folders into `Vencord/src/userplugins/`:
   ```text
   GifFolders/
   HideDefaultGifCategories/
   ```
3. Build and install your custom Vencord:
   ```sh
   pnpm build
   pnpm inject
   ```
4. Select your Discord installation in the installer and restart Discord.
5. Open **Discord Settings → Vencord → Plugins**, then enable:
   - **GifFolders**
   - **HideDefaultGifCategories** (optional)
## Updating
After updating Vencord or these plugins, rebuild and restart Discord:
```sh
git pull
pnpm install --frozen-lockfile
pnpm build
```
## Usage
- Open the GIF picker to create and browse folders.
- Right-click a GIF and select **GIF Folders** to assign it.
- Rename or delete folders from the **GifFolders** plugin settings.
- Folder data is stored locally for each Discord account.
Only install custom plugins whose source code you trust.
