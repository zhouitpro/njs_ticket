$(function() {
    new SimpleMDE({
        element: document.getElementById("content_editor"),
        placeholder: "添加内容....",
    });

    $(".ticket-type label").bind("click", function(env) {
        $(".ticket-type-value").val($("input", this).val());
    });

    $(".ticket-priority label").bind("click", function(env) {
        $(".ticket-priority-value").val($("input", this).val());
    });

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

            }
        });
    });
});
