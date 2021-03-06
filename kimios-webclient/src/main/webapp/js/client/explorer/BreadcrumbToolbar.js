/*
 * Kimios - Document Management System Software
 * Copyright (C) 2012-2013  DevLib'
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
kimios.explorer.BreadcrumbToolbar = Ext.extend(Ext.Toolbar, {

    constructor: function (config) {
        this.pathSeparator = '<img src="' + srcContextPath +
            '/images/icons/16x16/select.png" border="0" align="absmiddle" alt="&nbsp;&raquo;&nbsp;"/>';
        kimios.explorer.BreadcrumbToolbar.superclass.constructor.call(this, config);

        this.standardMode = true;
    },

    getPath: function () {
        return this.currentPath;
    },

    setPath: function (path, prettypath) {
        this.currentPath = path;
        this.prettyPath = prettypath;

        this.removeAll();
        if(this.standardMode){
            this.setStandardMode(path);
        }
        if(this.virtualMode){
            this.setVirtualMode(path, prettypath);
        }
        this.doLayout();
    },

    back: function (url, prettyUrl) {
        if(this.virtualMode){
            this.virtualTreePanel.setPath(url, prettyUrl);
        } else if(this.standardMode) {
            kimios.explorer.getTreePanel().synchronize(url);
            var node = kimios.explorer.getTreePanel().getSelectionModel().getSelectedNode();
            kimios.explorer.getActivePanel().loadEntity({
                uid: node.attributes.dmEntityUid,
                type: node.attributes.type
            });
        }
    },

    refreshLanguage: function () {
        if (!this.upButton)
            return;
        this.upButton.setTooltip(kimios.lang('Up'));
        this.refreshButton.setTooltip(kimios.lang('Refresh'));
        this.newWorkspaceButton.setTooltip(kimios.lang('NewWorkspace'));
        this.newFolderButton.setTooltip(kimios.lang('NewFolder'));
        this.importDocumentButton.setTooltip(kimios.lang('ImportDocument'));
        this.importDocumentButton.setTooltip(kimios.lang('ExportCsv'));
        this.doLayout();
    } ,

    setVirtualMode: function(path, prettypath){
        this.virtualMode = true;
        var ap = this.virtualTreePanel;
        this.upButton = new Ext.Toolbar.Button({
            disabled: path == undefined,
            tooltip: kimios.lang('Up'),
            iconCls: 'undo',
            handler: function (btn, evt) {
                btn.disable();
                ap.setPath(ap.currentPath.substr(0, path.lastIndexOf('/')), ap.prettyPath.substr(0, prettypath.lastIndexOf('/')));
            }
        });
        this.refreshButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('Refresh'),
            iconCls: 'refresh',
            scope: this,
            disabled: true,
            handler: function (btn, evt) {
                btn.disable();
                ap.setPath(ap.currentPath, ap.prettyPath);
            }
        });

        this.add(this.refreshButton);
        this.add(this.upButton);
        this.addSeparator();
        this.add(' ');


        var me = this;



        if (path != undefined) {
            var n = path.substr(1).split('/');
            var url = '';
            var prettyUrl = '';
            for (var i = 0; i < n.length; i++) {
                url += '/' + n[i];
                prettyUrl += '/' + (prettypath ?  prettypath.substr(1).split('/')[i] : '');
                this.add('/');
                this.add(new Ext.Toolbar.Button({
                    text: prettyUrl.substr(1).split('/')[i],
                    targetUrl: url,
                    prettyUrl: prettyUrl,
                    handler: function () {
                        if (this.handleMouseEvents == true) {
                            me.back(this.targetUrl, this.prettyUrl);
                        }
                    }
                }));
            }
        }

        this.doLayout();
    },

    setStandardMode: function(path){
        var ap = kimios.explorer.getActivePanel();
        this.standardMode = true;
        this.upButton = new Ext.Toolbar.Button({
            disabled: path == undefined,
            tooltip: kimios.lang('Up'),
            iconCls: 'undo',
            handler: function (btn, evt) {
                btn.disable();
                kimios.store.getEntityStore(ap.uid, ap.type).load({
                    scope: this,
                    callback: function (records, options, success) {
                        if (records[0].data.parentUid == -1) {
                            var treePanel = kimios.explorer.getTreePanel();
                            var rootNode = treePanel.getRootNode();
                            ap.loadEntity({
                                uid: undefined,
                                type: undefined
                            });
                        } else {
                            kimios.store.getEntityStore(records[0].data.parentUid, records[0].data.parentType).load({
                                scope: this,
                                callback: function (records, options, success) {
                                    ap.loadEntity({
                                        uid: records[0].data.uid,
                                        type: records[0].data.type,
                                        path: records[0].data.path,
                                        name: records[0].data.name
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
        this.refreshButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('Refresh'),
            iconCls: 'refresh',
            scope: this,
            disabled: true,
            handler: function (btn, evt) {
                btn.disable();
                ap.refresh();
            }
        });
        this.newWorkspaceButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('NewWorkspace'),
            iconCls: 'newworkspace',
            hidden: !kimios.explorer.getViewport().rights.isWorkspaceCreator,
            scope: this,
            handler: function () {
                new kimios.properties.PropertiesWindow({
                    createMode: true,
                    dmEntityPojo: new kimios.DMEntityPojo({
                        type: 1
                    })
                }).show();
            }
        });
        this.newFolderButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('NewFolder'),
            iconCls: 'newfolder',
            disabled: ap.type != 1 && ap.type != 2,
            scope: this,
            handler: function () {
                new kimios.properties.PropertiesWindow({
                    createMode: true,
                    dmEntityPojo: new kimios.DMEntityPojo({
                        parentType: ap.type,
                        parentUid: ap.uid,
                        path: ap.path,
                        type: 2
                    })
                }).show();
            }
        });
        this.importDocumentButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('ImportDocument'),
            iconCls: 'import',
            disabled: ap.type != 2,
            scope: this,
            handler: function () {
                new kimios.properties.PropertiesWindow({
                    createMode: true,
                    dmEntityPojo: new kimios.DMEntityPojo({
                        parentType: ap.type,
                        parentUid: ap.uid,
                        path: ap.path,
                        type: 3
                    })
                }).show();
            }
        });
        this.exportCsvButton = new Ext.Toolbar.Button({
            tooltip: kimios.lang('ExportCsv'),
            iconCls: 'exportcsv',
            disabled: ap.type != 2,
            scope: this,
            handler: function () {
                ap.csvExport();
            }
        });

        this.add(this.refreshButton);
        this.add(this.upButton);
        this.addSeparator();
        this.add(this.newWorkspaceButton);
        this.add(this.newFolderButton);
        this.add(this.importDocumentButton);
        this.add(this.exportCsvButton);
        this.add(' ');
        this.add(' ');
        this.add(' ');
        this.add(' ');
        this.add(' ');
        this.add(' ');

        if (path != undefined) {
            var n = path.substr(1).split('/');
            var url = '';
            for (var i = 0; i < n.length; i++) {
                url += '/' + n[i];

                this.add('/');
                this.add(new Ext.Toolbar.Button({
                    text: n[i],
//                    iconCls: url.substr(1).indexOf('/') == -1 ? 'dm-entity-tab-properties-workspace' :
//                        'dm-entity-tab-properties-folder',
                    targetUrl: url,
                    handler: function () {
                        if (this.handleMouseEvents == true) {
                            kimios.explorer.getActivePanel().breadcrumbToolbar.back(this.targetUrl);
                        }
                    }
                }));
            }
        }
    }
});
