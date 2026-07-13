/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

import {
    getCategoryTiles,
    getFavorites,
    getHeadingLabel,
    onSelectTile,
    patches,
    refreshViews,
    setGridInstance,
    setPickerInstance
} from "./categoryView";
import { messageContextMenuPatch } from "./contextMenu";
import { loadFolders, subscribe } from "./data";
import { FolderManager } from "./FolderManager";

const settings = definePluginSettings({
    folderManager: {
        type: OptionType.COMPONENT,
        component: FolderManager
    }
});

let unsubscribe: (() => void) | undefined;

export default definePlugin({
    name: "GifFolders",
    description: "Organize GIFs into local, named folders in Discord's GIF picker.",
    authors: [{ name: "Local User", id: 0n }],
    tags: ["Media", "Customisation"],
    settings,

    patches,
    contextMenus: {
        "message": messageContextMenuPatch
    },

    async start() {
        await loadFolders();
        unsubscribe = subscribe(refreshViews);
    },

    stop() {
        unsubscribe?.();
        unsubscribe = undefined;
    },

    getCategoryTiles,
    getFavorites,
    getHeadingLabel,
    onSelectTile,
    setGridInstance,
    setPickerInstance
});
