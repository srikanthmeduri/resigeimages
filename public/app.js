$('#myForm').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: new FormData(this),
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            var s = '';
            s += '<a target="_blank" href="' + data.small + '">Small</a><br>';
            s += '<a target="_blank" href="' + data.medium + '">Medium</a><br>';
            s += '<a target="_blank" href="' + data.large + '">Large</a><br>';
            $('#links').html(s).show();
        },
        error: function(e) {
            console.log(e);
        }
    });
});
