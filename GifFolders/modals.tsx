/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { RenderModalProps } from "@vencord/discord-types";
import { Forms, Modal, openModal, TextInput, useState } from "@webpack/common";
import type { FormEvent } from "react";

import { createFolder, deleteFolder, GifFolder, renameFolder } from "./data";

interface FolderNameModalProps {
    folder?: GifFolder;
    modalProps: RenderModalProps;
    onSaved?: () => void;
}

function FolderNameModal({ folder, modalProps, onSaved }: FolderNameModalProps) {
    const [name, setName] = useState(folder?.name ?? "");

    async function save() {
        const trimmed = name.trim();
        if (!trimmed) return;

        if (folder) {
            await renameFolder(folder.id, trimmed);
        } else {
            await createFolder(trimmed);
        }

        onSaved?.();
        modalProps.onClose();
    }

    return (
        <Modal
            {...modalProps}
            title={folder ? "Rename GIF Folder" : "New GIF Folder"}
            actions={[
                {
                    text: "Cancel",
                    variant: "secondary",
                    onClick: modalProps.onClose
                },
                {
                    text: folder ? "Save" : "Create",
                    variant: "primary",
                    onClick: save,
                    disabled: !name.trim()
                }
            ]}
        >
            <form
                onSubmit={(event: FormEvent) => {
                    event.preventDefault();
                    void save();
                }}
            >
                <Forms.FormTitle>Name</Forms.FormTitle>
                <TextInput
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Reactions"
                    autoFocus
                    maxLength={40}
                />
            </form>
        </Modal>
    );
}

interface DeleteFolderModalProps {
    folder: GifFolder;
    modalProps: RenderModalProps;
    onDeleted?: () => void;
}

function DeleteFolderModal({ folder, modalProps, onDeleted }: DeleteFolderModalProps) {
    async function remove() {
        await deleteFolder(folder.id);
        onDeleted?.();
        modalProps.onClose();
    }

    return (
        <Modal
            {...modalProps}
            title="Delete GIF Folder?"
            actions={[
                {
                    text: "Cancel",
                    variant: "secondary",
                    onClick: modalProps.onClose
                },
                {
                    text: "Delete",
                    variant: "primary",
                    onClick: remove
                }
            ]}
        >
            <Forms.FormText>
                Delete “{folder.name}”? Its GIFs will remain in Discord Favorites.
            </Forms.FormText>
        </Modal>
    );
}

export function openFolderNameModal(folder?: GifFolder, onSaved?: () => void) {
    openModal(modalProps => (
        <FolderNameModal folder={folder} modalProps={modalProps} onSaved={onSaved} />
    ));
}

export function openDeleteFolderModal(folder: GifFolder, onDeleted?: () => void) {
    openModal(modalProps => (
        <DeleteFolderModal folder={folder} modalProps={modalProps} onDeleted={onDeleted} />
    ));
}
