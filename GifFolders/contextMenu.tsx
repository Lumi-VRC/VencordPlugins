/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { ContextMenuApi, Menu, useState } from "@webpack/common";
import type { MouseEvent } from "react";

import { getFolderIdsForGif, getFolders, Gif, setGifInFolder } from "./data";
import { openFolderNameModal } from "./modals";

function isGifMedia(props: any) {
    const href: string = props?.itemHref ?? props?.itemSrc ?? "";
    const safeSrc: string = props?.itemSafeSrc ?? props?.itemSrc ?? "";
    const contentType: string | undefined = props?.mediaItem?.contentType;

    if (!href && !safeSrc) return false;
    if (contentType) return contentType === "image/gif";

    try {
        if (new URL(safeSrc).searchParams.get("animated") === "true") return true;
    } catch {
        // Fall through to extension checks.
    }

    return /\.(gif|mp4)(?:[?#]|$)/i.test(safeSrc)
        || /\.gif(?:[?#]|$)/i.test(href);
}

function gifFromMessageProps(props: any): Gif | null {
    const url: string | undefined = props?.itemHref ?? props?.itemSrc;
    if (!url) return null;

    const src: string = props?.itemSafeSrc ?? props?.itemSrc ?? url;
    let width = 200;
    let height = 200;

    try {
        const parsed = new URL(src);
        width = Number.parseInt(parsed.searchParams.get("width") ?? "200") || 200;
        height = Number.parseInt(parsed.searchParams.get("height") ?? "200") || 200;
    } catch {
        // Keep safe defaults for malformed URLs.
    }

    return {
        url,
        src,
        width,
        height,
        format: /\.mp4(?:[?#]|$)/i.test(src) ? 2 : 1
    };
}

function renderFolderSubmenu(
    gif: Gif,
    checkedIds: ReadonlySet<string>,
    setCheckedIds?: React.Dispatch<React.SetStateAction<ReadonlySet<string>>>
) {
    const folders = getFolders();

    return (
        <Menu.MenuItem id="vc-gif-folders" label="GIF Folders">
            <Menu.MenuItem
                id="vc-gif-folders-create"
                label="New Folder"
                color="brand"
                action={() => {
                    ContextMenuApi.closeContextMenu();
                    setTimeout(() => openFolderNameModal(), 0);
                }}
            />
            {folders.length > 0 && <Menu.MenuSeparator />}
            {folders.map(folder => {
                const checked = checkedIds.has(folder.id);
                return (
                    <Menu.MenuCheckboxItem
                        key={folder.id}
                        id={`vc-gif-folder-${folder.id}`}
                        label={folder.name}
                        checked={checked}
                        action={() => {
                            setCheckedIds?.(previous => {
                                const next = new Set(previous);
                                checked ? next.delete(folder.id) : next.add(folder.id);
                                return next;
                            });
                            void setGifInFolder(folder.id, gif, !checked);
                        }}
                    />
                );
            })}
        </Menu.MenuItem>
    );
}

export const messageContextMenuPatch: NavContextMenuPatchCallback = function MessageContextMenuPatch(children, props) {
    const gif = isGifMedia(props) ? gifFromMessageProps(props) : null;
    const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(
        () => gif ? getFolderIdsForGif(gif.url) : new Set()
    );
    if (!gif) return;

    const group = findGroupChildrenByChildId("copy-link", children) ?? children;
    group.push(renderFolderSubmenu(gif, checkedIds, setCheckedIds));
};

function GifPickerContextMenu({ gif, onClose }: { gif: Gif; onClose: () => void; }) {
    const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(
        () => getFolderIdsForGif(gif.url)
    );

    return (
        <Menu.Menu navId="vc-gif-folders-picker" onClose={onClose}>
            {renderFolderSubmenu(gif, checkedIds, setCheckedIds)}
        </Menu.Menu>
    );
}

export function openGifPickerContextMenu(event: MouseEvent, item: any) {
    const gif: Gif = {
        url: item.url ?? item.src,
        src: item.src ?? item.url,
        width: item.width ?? 200,
        height: item.height ?? 200,
        format: item.format ?? 1,
        order: item.order
    };

    ContextMenuApi.openContextMenu(event, ({ onClose }) => (
        <GifPickerContextMenu gif={gif} onClose={onClose} />
    ));
}
