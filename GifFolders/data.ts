/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as DataStore from "@api/DataStore";
import { UserStore } from "@webpack/common";

export interface Gif {
    format: number;
    src: string;
    width: number;
    height: number;
    order?: number;
    url: string;
}

export interface GifFolder {
    id: string;
    name: string;
    gifs: Gif[];
}

let folders: GifFolder[] = [];
const listeners = new Set<() => void>();

function getDataKey() {
    return `GifFolders_${UserStore.getCurrentUser()?.id ?? "logged-out"}`;
}

function makeId() {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

function emitChange() {
    listeners.forEach(listener => listener());
}

async function persist() {
    await DataStore.set(getDataKey(), folders);
    emitChange();
}

export async function loadFolders() {
    const stored = await DataStore.get<GifFolder[]>(getDataKey());
    folders = Array.isArray(stored)
        ? stored.filter(folder =>
            typeof folder?.id === "string"
            && typeof folder?.name === "string"
            && Array.isArray(folder?.gifs)
        )
        : [];
    emitChange();
}

export function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function getFolders() {
    return folders;
}

export function getFolder(id: string) {
    return folders.find(folder => folder.id === id);
}

export function getGifKey(url: string) {
    try {
        const parsed = new URL(url);
        return `${parsed.hostname.toLowerCase()}${decodeURIComponent(parsed.pathname)}`;
    } catch {
        return url.split(/[?#]/, 1)[0];
    }
}

function isSameGif(gif: Gif, url: string) {
    const key = getGifKey(url);
    return getGifKey(gif.url) === key || getGifKey(gif.src) === key;
}

export function getAssignedGifKeys() {
    return new Set(
        folders.flatMap(folder =>
            folder.gifs.flatMap(gif => [getGifKey(gif.url), getGifKey(gif.src)])
        )
    );
}

export function getFolderIdsForGif(gifUrl: string) {
    return new Set(
        folders
            .filter(folder => folder.gifs.some(gif => isSameGif(gif, gifUrl)))
            .map(folder => folder.id)
    );
}

export async function createFolder(name: string) {
    const folder: GifFolder = {
        id: makeId(),
        name: name.trim(),
        gifs: []
    };

    folders = [...folders, folder];
    await persist();
    return folder;
}

export async function renameFolder(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    folders = folders.map(folder =>
        folder.id === id ? { ...folder, name: trimmed } : folder
    );
    await persist();
}

export async function deleteFolder(id: string) {
    folders = folders.filter(folder => folder.id !== id);
    await persist();
}

export async function setGifInFolder(folderId: string, gif: Gif, included: boolean) {
    folders = folders.map(folder => {
        if (folder.id !== folderId) return folder;

        const withoutGif = folder.gifs.filter(item => !isSameGif(item, gif.url));
        return {
            ...folder,
            gifs: included ? [gif, ...withoutGif] : withoutGif
        };
    });
    await persist();
}
