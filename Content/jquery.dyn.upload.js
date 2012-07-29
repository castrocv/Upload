    (function ($) {
    'use strict';

    var methods = {
        init: function (options) {

            // Create some defaults, extending them with any options that were provided
            var settings = $.extend({
                folder: 'def',
                subfolder: 'subdef',
                allowUpload: false,
                allowDelete: false,
                onUploadComplete: null,
                onDestroyComplete: null
            }, options);

            var $form = '<form id="customFileupload" action="../Upload/CustomUploadHandler.ashx" method="POST" enctype="multipart/form-data"><div class="row-fluid fileupload-buttonbar"><div class="span2 btnAnexar"><span class="btn-mini btn-success fileinput-button"><i class="icon-plus icon-white"></i><span>Anexar</span><input type="file" name="files[]"></span></div><div class="span10"><table class="table"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table></div></div></form>';
            this.append($form);

            var e = this.find('#customFileupload');

            // Initialize the jQuery File Upload widget:
            $(e).fileupload();

            $(e).fileupload('option', {
                acceptFileTypes: /(.|\/)(gif|jpe?g|png|pdf|xlsx?|docx?|rar|zip|txt)$/i,
                maxFileSize: 5120000,
                maxNumberOfFiles: 1,
                autoUpload: true,
                formData: {
                    folder: options.folder,
                    subfolder: options.subfolder
                }
            });

            if (!options.allowUpload) {
                $(this).find('.btnAnexar').hide();
            }

            $(e).bind('fileuploadstopped', function (r) {
                $(this).find('.btnAnexar').hide();

                var $filename = $(e).find('.name a').attr('title');

                if (typeof options.onUploadComplete == 'function' && $filename != undefined) {
                    options.onUploadComplete.call(this, $filename);
                }
            });

            $(e).bind('fileuploaddestroyed', function (r) {
                if (options.allowUpload) {
                    $(this).find('.btnAnexar').show();
                }

                if (typeof options.onDestroyComplete == 'function') {
                    options.onDestroyComplete.call(this);
                }
            });

            $(e).bind('fileuploadcompleted', function (e, data) {
                if (!options.allowDelete) {
                    $(this).find('.delete').hide();
                }
            });

            $(e).each(function () {
                var that = this;
                var data = {
                    folder: options.folder + "/" + options.subfolder
                };
                $.getJSON(this.action, data, function (result) {
                    if (result && result.length) {
                        $(that).fileupload('option', 'maxNumberOfFiles', 1 - result.length);
                        $(that).fileupload('option', 'done').call(that, null, { result: result });

                        $(that).find('.btnAnexar').hide();
                    }
                });
            });
        }
    };

    $.fn.upload = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.dyn.upload');
        }
    };

})(jQuery);

//        var $templateUp = '<script id="template-upload" type="text/x-tmpl">{% for (var i=0, file; file=o.files[i]; i++) { %}<tr class="template-upload fade"><td class="name"><span>{%=file.name%}</span></td>{% if (file.error) { %}<td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>{% } else if (o.files.valid && !i) { %}<td><div class="progress progress-success progress-striped active"><div class="bar" style="width:0%;"></div></div></td>{% } else { %}<td colspan="2"></td>{% } %}<td class="cancel">{% if (!i) { %}<button class="btn btn-warning"><i class="icon-ban-circle icon-white"></i><span>{%=locale.fileupload.cancel%}</span></button>{% } %}</td></tr>{% } %}</script>';
//        var $templateDown = '<script id="template-download" type="text/x-tmpl">{% for (var i=0, file; file=o.files[i]; i++) { %}<tr class="template-download fade">{% if (file.error) { %}<td></td><td class="name"><span>{%=file.name%}</span></td><td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td><td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>{% } else { %}<td class="name"><a href="{%=file.url%}" title="{%=file.name%}" rel="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.name%}">{%=file.name%}</a></td><td colspan="2"></td>{% } %}<td class="delete"><button class="btn btn-danger" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"><i class="icon-trash icon-white"></i><span>{%=locale.fileupload.destroy%}</span></button></td></tr>{% } %}</script>';
//        this.append($templateUp);
//        this.append($templateDown);

//(function ($) {
//    
//    $.fn.upload = function (options) {

//        // Create some defaults, extending them with any options that were provided
//        var settings = $.extend({
//            'folder': 'default',
//            'subfolder': 'subdef'
//        }, options);
//        
//    };
//})(jQuery);