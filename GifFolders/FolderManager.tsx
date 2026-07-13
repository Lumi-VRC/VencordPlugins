/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { Button } from "@components/Button";
import { Forms, useEffect, useState } from "@webpack/common";

import { getFolders, subscribe } from "./data";
import { openDeleteFolderModal, openFolderNameModal } from "./modals";

export function FolderManager() {
    const [, setRevision] = useState(0);

    useEffect(() => subscribe(() => setRevision(value => value + 1)), []);

    const folders = getFolders();

    return (
        <div className="vc-gif-folders-manager">
            <Forms.FormText>
                Folders are stored locally for this Discord account. Removing a folder does not
                remove its GIFs from Discord Favorites.
            </Forms.FormText>

            <div className="vc-gif-folders-list">
                {folders.map(folder => (
                    <div className="vc-gif-folders-row" key={folder.id}>
                        <div className="vc-gif-folders-name">
                            {folder.name}
                            <Forms.FormText>{folder.gifs.length} GIFs</Forms.FormText>
                        </div>
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => openFolderNameModal(folder)}
                        >
                            Rename
                        </Button>
                        <Button
                            size="small"
                            variant="dangerSecondary"
                            onClick={() => openDeleteFolderModal(folder)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>

            <Button size="small" onClick={() => openFolderNameModal()}>
                New Folder
            </Button>
        </div>
    );
}
