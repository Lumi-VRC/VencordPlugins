/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { isPluginEnabled } from "@api/PluginManager";

import { openGifPickerContextMenu } from "./contextMenu";
import { getAssignedGifKeys, getFolder, getFolders, getGifKey, Gif } from "./data";
import { openFolderNameModal } from "./modals";

const FAVORITES_RESULT_TYPE = "Favorites";
const CREATE_FOLDER_ACTION = "create-folder";
const UNSORTED_FOLDER_ID = "__vc_unsorted";

interface CategoryTile {
    format: number;
    name: string;
    src?: string;
    type: string;
    vcAction?: string;
    vcFolderId?: string;
}

let activeFolder: { id: string; name: string; } | null = null;
let pickerInstance: any = null;
let gridInstance: any = null;
let fullFavorites: any[] = [];

function resolveCurrentFavorite(stored: Gif) {
    const storedKeys = new Set([getGifKey(stored.url), getGifKey(stored.src)]);

    return fullFavorites.find(candidate =>
        [candidate.url, candidate.src]
            .filter(Boolean)
            .some(url => storedKeys.has(getGifKey(url)))
    ) ?? stored;
}

function getFolderGifs(id: string) {
    if (id === UNSORTED_FOLDER_ID) {
        const assigned = getAssignedGifKeys();
        return fullFavorites.filter(gif =>
            ![gif.url, gif.src]
                .filter(Boolean)
                .some(url => assigned.has(getGifKey(url)))
        );
    }

    return getFolder(id)?.gifs.map(resolveCurrentFavorite) ?? [];
}

function folderTile(id: string, name: string, gifs: any[]): CategoryTile {
    const first = gifs[0];
    return {
        type: "Category",
        name,
        src: first?.src,
        format: first?.format ?? 1,
        vcFolderId: id
    };
}

export const patches = [
    {
        find: "renderCategoryExtras",
        replacement: [
            {
                match: /this\.props\.trendingCategories(?=,this\.props\.hideFavoritesTile)/,
                replace: "$self.getCategoryTiles(this.props.trendingCategories,this)"
            },
            {
                match: /(\{className:\i,trendingCategories:(\i)\}=this\.props;return )0===\2\.length\?/,
                replace: "$1false?"
            },
            {
                match: /onClick:\(\)=>(\i)\((\i)\.type,\2\.name\)/,
                replace: "onClick:()=>$self.onSelectTile($2,$1)"
            }
        ]
    },
    {
        find: "renderHeaderContent()",
        replacement: [
            {
                match: /(renderHeaderContent\(\)\{)/,
                replace: "$1$self.setPickerInstance(this);"
            },
            {
                match: /children:(\i\.intl\.string\(\i\.\i\.\i\))(?=\}\);case \i\.dD\.TRENDING_GIFS)/,
                replace: "children:$self.getHeadingLabel($1)"
            },
            {
                match: /(,suggestions:\i,favorites:)(\i),/,
                replace: "$1$self.getFavorites($2),"
            }
        ]
    }
];

export function setGridInstance(instance: any) {
    gridInstance = instance;
}

export function setPickerInstance(instance: any) {
    pickerInstance = instance;

    const existing = document.getElementById("gif-picker-tab-panel");
    if (existing?.dataset.vcGifFoldersContextMenu) return;

    requestAnimationFrame(() => {
        const root = document.getElementById("gif-picker-tab-panel");
        if (!root || root.dataset.vcGifFoldersContextMenu) return;

        root.dataset.vcGifFoldersContextMenu = "true";
        root.addEventListener("contextmenu", event => {
            let element = event.target as Element | null;

            while (element && element !== root) {
                const fiberKey = Object.keys(element).find(key => key.startsWith("__reactFiber"));
                if (fiberKey) {
                    let fiber: any = (element as any)[fiberKey];

                    for (let depth = 0; depth < 10; depth++) {
                        const item = fiber?.memoizedProps?.item;
                        if (item?.url && !item?.type) {
                            event.preventDefault();
                            event.stopPropagation();
                            openGifPickerContextMenu(event as any, item);
                            return;
                        }

                        if (!fiber?.return) break;
                        fiber = fiber.return;
                    }
                    break;
                }

                element = element.parentElement;
            }
        }, true);
    });
}

export function getCategoryTiles(original: CategoryTile[], instance?: any) {
    if (instance) gridInstance = instance;
    activeFolder = null;

    const customTiles = getFolders().map(folder => {
        const gifs = getFolderGifs(folder.id);
        return folderTile(folder.id, folder.name, gifs);
    });
    const unsorted = getFolderGifs(UNSORTED_FOLDER_ID);

    return [
        ...(isPluginEnabled("HideDefaultGifCategories") ? [] : original),
        ...customTiles,
        folderTile(UNSORTED_FOLDER_ID, "Unsorted", unsorted),
        {
            type: "Category",
            name: "New Folder",
            format: 1,
            vcAction: CREATE_FOLDER_ACTION
        }
    ];
}

export function getFavorites(original: any[]) {
    if (!activeFolder) {
        fullFavorites = original;
        return original;
    }

    return getFolderGifs(activeFolder.id);
}

export function getHeadingLabel(defaultLabel: string) {
    return activeFolder?.name ?? defaultLabel;
}

export function onSelectTile(
    item: CategoryTile,
    onSelectItem: (type: string, name: string) => void
) {
    if (item.vcAction === CREATE_FOLDER_ACTION) {
        openFolderNameModal(undefined, refreshViews);
        return;
    }

    if (item.vcFolderId) {
        activeFolder = { id: item.vcFolderId, name: item.name };

        if (!pickerInstance) {
            onSelectItem(FAVORITES_RESULT_TYPE, item.name);
        } else {
            pickerInstance.props.favorites = getFolderGifs(item.vcFolderId);
            pickerInstance.setState({ resultType: FAVORITES_RESULT_TYPE });
        }
        return;
    }

    activeFolder = null;
    if (pickerInstance) pickerInstance.props.favorites = fullFavorites;
    onSelectItem(item.type, item.name);
}

export function refreshViews() {
    gridInstance?.forceUpdate?.();
    pickerInstance?.forceUpdate?.();
}
