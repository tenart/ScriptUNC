$(".resizer").draggable();

$(".resizer").each(function() {
    var width = parseInt($(this).css("left")+15);
    var height = parseInt($(this).css("top")+15);
    $(this).closest("#lessons").css("width", width);
    $(this).closest("#lessons").css("height", height);
});

$("#editorBar.toolButtons.collapse").click(function(){
        alert("Editor collapse button pressed");
});

$("#lessonBar.toolButtons.collapse").click(function(){
        alert("Lessons collapse button pressed");
});

$("#lessons_open").click(function(){
    alert("open lessons");
});

$("#menu_open").click(function(){
    alert("open lessons");
});

$("#editor_open").click(function(){
    alert("open editor");
});
                      
     
                      
