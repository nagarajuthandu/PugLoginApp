$(document).ready(function(){
    $("form#change").on('submit', function(e){
        e.preventDefault();
        var data = $('input[name=name]').val();
        $.ajax({
            type: 'post',
            url: '/ajax',
            data: data,
            dataType: 'text'
        })
        .done(function(data){
            $('h1').html(data.name);
        });
    });
});