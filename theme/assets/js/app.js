$(function() {
    var simplemde = new SimpleMDE({
        element: document.getElementById("content_editor"),
        placeholder: "添加内容....",
    });

    $(".ticket-body").each(function() {
        var body = $(this).text();
        var body = simplemde.markdown(body);
        $(this).html(body);
    });

    $(".ticket-type label").bind("click", function(env) {
        $(".ticket-type-value").val($("input", this).val());
    });

    $(".ticket-priority label").bind("click", function(env) {
        $(".ticket-priority-value").val($("input", this).val());
    });

    var url = document.location.toString();
    if (url.match('#')) {
        $('.nav a[href="#' + url.split('#')[1] + '"]').tab('show');
    }

    // Change hash for page-reload
    $('.nav a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
    })

    // uploads.
    Dropzone.autoDiscover = false;
    var dropzoneUploadEle = new Dropzone("form.dropzone-uploads", {
        url: '/upload_file',
        success: function(data) {
            let oldv = simplemde.value();
            let res = data.xhr.response;
            let fulurl = res.split('/');
            let name = fulurl[fulurl.length-1];
            let resarr = name.split('.');
            let ext = resarr[resarr.length-1].toLowerCase();
            if(ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'jpeg') {
                simplemde.value(oldv + '![YES]('+res+')\r\n');
            } else {
                simplemde.value(oldv + '['+name+']('+res+')\r\n');
            }
        },
    });
    // add paste event listener to the page.
    document.onpaste = function(event){
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                // adds the file to your dropzone instance
                dropzoneUploadEle.addFile(item.getAsFile())
            }
        }
    };

    dropzoneUploadEle.success = function(data) {
        alert(data);
    };

    // $(".fileupload").dropzone({ url: "/file/post" });

    $('.changeStatusMenu button').bind("click", function() {
        var self = $(this);
        var text = self.text();
        var tid = self.parent('div').attr("ticket_id");
        var old = self.parent('div').attr("old");

        self.parent('div').prev('button').text(text);
        if (text == old) {
            return false;
        }

        // write comment.
        let body = '修改状态为 ***' +text+ '***';
        $.ajax({
            type: "POST",
            url: '/detail/' + tid,
            data: {'tid': tid, 'body': body}
        });

        // change status.
        $.ajax({
            type: "POST",
            url: '/change_status',
            data: {'tid': tid, 'status': text},
            success: function() {
                location.reload();
            }
        });
    });

    lightbox.option({
        fadeDuration: 0,
        'resizeDuration': 200,
        // 'wrapAround': true
    })
    $(".ticket_list img, .ticket-body img").each(function(index, img) {
        $(img).wrap('<a href="'+$(img).attr("src")+'" data-lightbox="ticketlist"></a>');
    });
});
