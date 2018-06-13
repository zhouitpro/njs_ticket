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
});
