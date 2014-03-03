var to = new Date();
var from = new Date(to.getTime() - 1000 * 60 * 60 * 24 * 14);

$('#datepicker-calendar').DatePicker({
    inline: true,
    date: [from, to],
    calendars: 3,
    mode: 'range',
    current: new Date(to.getFullYear(), to.getMonth() - 1, 1),
    onChange: function (dates, el) {
        // update the range display
        $('#date-range-field span').text(
            convertDate(dates[0]) +' to ' +  convertDate(dates[1])
                );
        onDateSelected(convertDate(dates[0]),convertDate(dates[1]));
    }
});

$('#date-range-field span').text(
    convertDate(from) +' to ' + convertDate(to));

$('#date-range-field').bind('click', function () {
    $('#datepicker-calendar').toggle();
    if ($('#date-range-field a').text().charCodeAt(0) == 9660) {
        // switch to up-arrow
        $('#date-range-field a').html('&#9650;');
        $('#date-range-field').css({borderBottomLeftRadius: 0, borderBottomRightRadius: 0});
        $('#date-range-field a').css({borderBottomRightRadius: 0});
    } else {
        // switch to down-arrow
        $('#date-range-field a').html('&#9660;');
        $('#date-range-field').css({borderBottomLeftRadius: 5, borderBottomRightRadius: 5});
        $('#date-range-field a').css({borderBottomRightRadius: 5});
    }
    return false;
});

$('html').click(function () {
    if ($('#datepicker-calendar').is(":visible")) {
        $('#datepicker-calendar').hide();
        $('#date-range-field a').html('&#9660;');
        $('#date-range-field').css({borderBottomLeftRadius: 5, borderBottomRightRadius: 5});
        $('#date-range-field a').css({borderBottomRightRadius: 5});
    }
});

$('#datepicker-calendar').click(function (event) {
    event.stopPropagation();
});

