//
// Copyright (c) 2014-2015, THUNDERBEAST GAMES LLC All rights reserved
// LICENSE: Atomic Game Engine Editor and Tools EULA
// Please see LICENSE_ATOMIC_EDITOR_AND_TOOLS.md in repository root for
// license information: https://github.com/AtomicGameEngine/AtomicGameEngine
//

import strings = require("ui/EditorStrings");
import EditorEvents = require("editor/EditorEvents");
import EditorUI = require("ui/EditorUI");
import MenuItemSources = require("./MenuItemSources");

class ProjectFrameMenus extends Atomic.ScriptObject {

    constructor() {

        super();

        MenuItemSources.createMenuItemSource("asset context folder", assetFolderContextItems);
        MenuItemSources.createMenuItemSource("asset context general", assetGeneralContextItems);
        MenuItemSources.createMenuItemSource("project create items", createItems);

        this.subscribeToEvent(EditorEvents.ContentFolderChanged, (ev: EditorEvents.ContentFolderChangedEvent) => {
            this.contentFolder = ev.path;
        });

    }

    handleAssetContextMenu(target: Atomic.UIWidget, refid: string):boolean {

        if (target.id == "asset context menu" || target.id == "create popup") {

            var path;
            var asset = <ToolCore.Asset> target["asset"];

            if (asset) {
                path = asset.path;
            } else {
                path = this.contentFolder;
            }

            if (refid == "rename_asset") {
                EditorUI.getModelOps().showRenameAsset(asset);
                return true;
            }

            if (refid == "delete_asset") {
                EditorUI.getModelOps().showResourceDelete(asset);
                return true;
            }

            if (refid == "create_folder") {
                EditorUI.getModelOps().showCreateFolder(path);
                return true;
            }

            if (refid == "create_component") {
                EditorUI.getModelOps().showCreateComponent(path);
                return true;
            }

            if (refid == "create_script") {
                EditorUI.getModelOps().showCreateScript(path);
                return true;
            }

            if (refid == "create_scene") {
                EditorUI.getModelOps().showCreateScene(path);
                return true;
            }

            if (refid == "create_material") {
                EditorUI.getModelOps().showCreateMaterial(path);
                return true;
            }

            if (refid == "reveal_folder") {
                var utils = new Editor.FileUtils();
                utils.revealInFinder(path);
                return true;
            }
        }

        return false;

    }

    createFolderContextMenu(parent: Atomic.UIWidget, id: string, folder: ToolCore.Asset, x: number, y: number) {


    }

    createAssetContextMenu(parent: Atomic.UIWidget, asset: ToolCore.Asset, x: number, y: number) {

        var menu = new Atomic.UIMenuWindow(parent, "asset context menu");
        menu["asset"] = asset;

        var srcName: string;

        if (asset.isFolder()) {
            srcName = "asset context folder";
        } else {
            srcName = "asset context general";
        }

        var src = MenuItemSources.getMenuItemSource(srcName);
        menu.show(src, x, y);

    }

    handlePopupMenu(target: Atomic.UIWidget, refid: string): boolean {

        if (!target || !refid) return;

        if (this.handleAssetContextMenu(target, refid)) {

            return true;

        }

        return false;

    }

    contentFolder: string;

}

export = ProjectFrameMenus;

// initialization
var StringID = strings.StringID;

var assetGeneralContextItems = {
    "Rename": ["rename_asset", undefined, ""],
    
};

var assetFolderContextItems = {
    "Create Folder": ["create_folder", undefined, "Folder.icon"],
    "Create Component": ["create_component", undefined, "ComponentBitmap"],
    "Create Script": ["create_script", undefined, "ComponentBitmap"],
    "Create Material": ["create_material", undefined, "ComponentBitmap"],
    "Create Scene": ["create_scene", undefined, "ComponentBitmap"],
    "-1": null,
    
};

//Change the words "Reveal in Finder" based on platform
if (Atomic.platform == "Windows") {
    assetGeneralContextItems["Reveal in Explorer"] = ["reveal_folder", undefined, ""];
    assetFolderContextItems["Reveal in Explorer"] = ["reveal_folder", undefined, ""];
} else if (Atomic.platform == "MacOSX") {
    assetGeneralContextItems["Reveal in Finder"] = ["reveal_folder", undefined, ""];
    assetFolderContextItems["Reveal in Finder"] = ["reveal_folder", undefined, ""];
}
else {
    assetGeneralContextItems["Reveal in File Manager"] = ["reveal_folder", undefined, ""];
    assetFolderContextItems["Reveal in File Manager"] = ["reveal_folder", undefined, ""];
}



//Ensures that delete is at the bottom of the menu lists
assetGeneralContextItems["-1"] = null;
assetGeneralContextItems["Delete"] = ["delete_asset", undefined, ""];
assetFolderContextItems["-2"] = null;
assetFolderContextItems["Delete"] = ["delete_asset", undefined, "FolderDeleteBitmap"];


var createItems = {
    "Create Folder": ["create_folder", undefined, "Folder.icon"],
    "Create Component": ["create_component", undefined, "ComponentBitmap"],
    "Create Script": ["create_script", undefined, "ComponentBitmap"],
    "Create Material": ["create_material", undefined, "ComponentBitmap"],
    "Create Scene": ["create_scene", undefined, "ComponentBitmap"],
};
