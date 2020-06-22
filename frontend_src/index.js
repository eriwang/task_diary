import $ from 'jquery';

import './style.css';

const Status = Object.freeze({
    'NOT_STARTED': 0,
    'IN_PROGRESS': 1,
    'COMPLETE': 2,
    'DROPPED': 3
});

$(document).ajaxError((event, jqXHR, settings, exception) => {
    const errorText = `"${settings.type}" request to URL "${settings.url}" failed ` +
                        `with status ${jqXHR.status}, "${exception}"`;
    console.error(errorText);
    if (jqXHR.hasOwnProperty('responseJSON'))
    {
        console.error(jqXHR.responseJSON['error']);
    }
});

$(document).ready(() => {
    $('#entry-submit').click(submitAccomplishmentForm);

    $.get('/all_accomplishments').done(populateAccomplishments);
});

function populateAccomplishments(data)
{
    console.log(data);
    $('#tasks').html('');
    for (let a of data['accomplishments'])
    {
        let htmlStr =   `<p data-id="${a['id']}">
                            ${a['date']}: ${a['description']}, is_planned=${a['is_planned']}, status=${a['status']}
                        </p>`;
        $('#tasks').append(htmlStr);
    }
}

// TODO: validation
function submitAccomplishmentForm()
{
    console.log('submitting');
    let data = {
        'date': (new Date()).toISOString().slice(0, '2020-06-22'.length),
        'description': $('#entry-notes').val(),
        'is_planned': $('#entry-is-planned').is(':checked'),
        'status': Status.NOT_STARTED,
        'notes': $('#entry-notes').val()
    };

    console.log(data);
    $.ajax('/accomplishment', {  // TODO: abstract this out. this is ridiculous to get right
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'method': 'POST',
        'processData': false
    }).done(() => {
        console.log('done');
        $.get('/all_accomplishments').done(populateAccomplishments);
    });
}