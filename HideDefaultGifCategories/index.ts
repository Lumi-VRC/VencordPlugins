/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

import { refreshViews } from "../GifFolders/categoryView";

export default definePlugin({
    name: "HideDefaultGifCategories",
    description: "Hides Discord's default GIF categories while preserving Favorites and custom GIF folders.",
    authors: [{ name: "Local User", id: 0n }],
    tags: ["Media", "Customisation"],
    dependencies: ["GifFolders"],

    start: refreshViews,
    stop: refreshViews
});
