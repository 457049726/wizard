/**
 * Wizard
 *
 * @link      https://aicode.cc/
 * @copyright 管宜尧 <mylxsw@aicode.cc>
 */

/**
 * 创建markdown编辑器
 *
 * @param editor_id
 * @param params
 * @returns {*}
 */
$.wz.mdEditor = function (editor_id, params) {
    var editor_table_id = 0;
    var config = {
        // 模板数据源
        template: function () {
            return '';
        },
        templateSelected: function (dialog) {
            return '';
        },


        sqlCreateBox: function () {
            editor_table_id = (new Date()).getTime();
            return "<textarea class='form-control border wz-sql-create-box' style='width: 100%; height: 277px;' id='sql-create-box-editor-" + editor_table_id + "'></textarea>";
        },

        jsonToTableTemplate: function () {
            editor_table_id = (new Date()).getTime();
            return "<textarea class='form-control json-to-table-editor border' style='width: 100%; height: 277px;' id='json-to-table-editor-" + editor_table_id + "'></textarea>";
        },
        jsonToTableConvert: function (dialog, cm) {
            var jsonContent = $('#json-to-table-editor-' + editor_table_id).val();
            if (jsonContent.trim() === '') {
                return;
            }

            $.wz.request('post', '/tools/json-to-markdown', {content: jsonContent}, function (data) {
                cm.replaceSelection(data.markdown);
                dialog.hide().lockScreen(false).hideMask();
            });
        },

        sqlToTableTemplate: function () {
            editor_table_id = (new Date()).getTime();
            return "<textarea class='form-control sql-to-table-editor border' style='width: 100%; height: 277px;' id='sql-to-table-editor-" + editor_table_id + "'></textarea>";
        },
        sqlToTableConvert: function (dialog, cm) {
            var jsonContent = $('#sql-to-table-editor-' + editor_table_id).val();
            if (jsonContent.trim() === '') {
                return;
            }

            $.wz.request('post', '/tools/sql-to-markdown', {content: jsonContent}, function (data) {
                cm.replaceSelection(data.markdown);
                dialog.hide().lockScreen(false).hideMask();
            });
        },
        lang: {
            chooseTemplate: '选择模板',
            jsonToTable: '从json创建表格',
            sqlToTable: '从SQL创建表格',
            sqlCreateBox: 'SQL建表语句',
            confirmBtn: '确定',
            cancelBtn: '取消'
        }
    };

    $.extend(true, config, params);

    editormd.katexURL  = {
        css : "/assets/vendor/katex.min",
        js  : "/assets/vendor/katex.min"
    };

    var mdEditor = editormd(editor_id, {
        path: "/assets/vendor/editor-md/lib/",
        height: 800,
        taskList: true,
        tex: true,
        flowChart: true,
        sequenceDiagram: true,
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp"],
        imageUploadURL: "/upload",
        htmlDecode: true,
        toolbarIcons: function () {
            return ["undo", "redo", "|",
                "bold", "del", "italic", "quote", "|",
                "h2", "h3", "h4", "h5", "|",
                "list-ul", "list-ol", "hr", "|",
                "link", "image", "code", "code-block", "table", "pagebreak", "|",
                "template", "jsonToTable", "sqlToTable", "sqlCreateBox", "|",
                "watch", "preview", "fullscreen", "|",
                "help"
            ];
        },
        toolbarIconTexts: {
            template: "模板",
            jsonToTable: "JSON-&gt;表格",
            sqlToTable: "SQL-&gt;表格",
            sqlCreateBox: 'SQL建表语句',
        },
        toolbarHandlers: {
            template: function (cm, icon, cursor, selection) {
                this.createDialog({
                    title: config.lang.chooseTemplate,
                    width: 380,
                    height: 300,
                    content: config.template(),
                    mask: true,
                    drag: true,
                    lockScreen: true,
                    buttons: {
                        enter: [config.lang.confirmBtn, function () {

                            cm.replaceSelection(config.templateSelected(this));
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }],

                        cancel: [config.lang.cancelBtn, function () {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });
            },
            jsonToTable: function (cm, icon, cursor, selection) {
                this.createDialog({
                    title: config.lang.jsonToTable,
                    width: 480,
                    height: 400,
                    content: config.jsonToTableTemplate(),
                    mask: true,
                    drag: true,
                    lockScreen: true,
                    buttons: {
                        enter: [config.lang.confirmBtn, function () {
                            config.jsonToTableConvert(this, cm);
                            return false;
                        }],

                        cancel: [config.lang.cancelBtn, function () {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });
            },
            sqlToTable: function (cm, icon, cursor, selection) {
                this.createDialog({
                    title: config.lang.sqlToTable,
                    width: 480,
                    height: 400,
                    content: config.sqlToTableTemplate(),
                    mask: true,
                    drag: true,
                    lockScreen: true,
                    buttons: {
                        enter: [config.lang.confirmBtn, function () {
                            config.sqlToTableConvert(this, cm);
                            return false;
                        }],

                        cancel: [config.lang.cancelBtn, function () {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });
            },
            sqlCreateBox: function (cm, icon, cursor, selection) {
                this.createDialog({
                    title: config.lang.sqlCreateBox,
                    width: 480,
                    height: 400,
                    content: config.sqlCreateBox(),
                    mask: true,
                    drag: true,
                    lockScreen: true,
                    buttons: {
                        enter: [config.lang.confirmBtn, function () {
                            cm.replaceSelection("```sql_create\n" + $('#sql-create-box-editor-' + editor_table_id).val() + "\n```");
                            this.hide().lockScreen(false).hideMask();
                            return false;
                        }],

                        cancel: [config.lang.cancelBtn, function () {
                            this.hide().lockScreen(false).hideMask();

                            return false;
                        }]
                    }
                });
            }
        },
        lang: {
            toolbar: {
                template: config.lang.chooseTemplate,
                jsonToTable: config.lang.jsonToTable,
                sqlToTable: config.lang.sqlToTable,
                sqlCreateBox: config.lang.sqlCreateBox,
            }
        },
        onload: function () {
            editormd.loadPlugin("/assets/vendor/editor-md/plugins/image-handle-paste/image-handle-paste", function () {
                mdEditor.imagePaste();
            });

            editormd.loadPlugin('/assets/vendor/mermaid', function() {
                mermaid.init(undefined, $(".markdown-body .mermaid"));
            });

            $.wz.imageResize('.editormd-preview-container');
            $.wz.sqlCreateSyntaxParser('.editormd-preview-container .wz-sql-create');
        },
        onchange: function () {
            // 图片缩放支持
            $.wz.imageResize('.editormd-preview-container');
            // mermaid 支持
            var mermaidElements = $('.editormd-preview').find('.mermaid');
            if (mermaidElements.length > 0) {
                mermaidElements.each(function() {
                    $(this).html($(this).html()).removeAttr('data-processed');
                    mermaid.init(undefined, $(this));
                });
            }
            // sql 建表语句解析
            $.wz.sqlCreateSyntaxParser('.editormd-preview-container .wz-sql-create');
        }
    });

    return mdEditor;
};