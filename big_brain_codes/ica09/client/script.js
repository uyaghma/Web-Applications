$(document).ready(function () {
    url = "https://localhost:7083/retrieve"
    table = `<table class='table table-sm table-light'>
                <thead class='bg-primary'>
                    <tr>
                        <th style="width: 25%;">Action</th>
                        <th style="width: 15%;">Student ID</th>
                        <th style="width: 15%;">First Name</th>
                        <th style="width: 15%;">Last Name</th>
                        <th style="width: 15%;">School ID</th>
                        <th style="width: 15%;">Action</th>
                    </tr>
                </thead>`

    AJAX(url, 'get', "", "JSON", Success, Error);
    AJAX("https://localhost:7083/classget", 'get', "", "JSON", ClassGet, Error);

    $(document).on('click', '.retrieve-info', function (e) {
        var id = $(this).attr('id');
        var url = "https://localhost:7083/studentinfo?id=" + id;

        AJAX(url, 'get', "", "JSON", InfoSuccess, Error);
    });

    function Success(response) {
        var data = JSON.parse(response.data);
        var rows = 0;

        table += `<tbody>`;
        for (var i = 0; i < data.length; i++) {
            rows++;
            table += "<tr>"
                + `<td><a id='${data[i]['student_id']}' class='btn btn-primary rounded-lg retrieve-info' role='button'>Retrieve Student Info</a></td>`
                + `<td class="sid-cell" id="${data[i]['student_id']}">${data[i]['student_id']}</td>`
                + `<td class="fn-cell" id="${data[i]['student_id']}">${data[i]['first_name']}</td>`
                + `<td class="ln-cell" id="${data[i]['student_id']}">${data[i]['last_name']}</td>`
                + `<td class="scid-cell" id="${data[i]['student_id']}">${data[i]['school_id']}</td>`
                + `<td><a id='${data[i]['student_id']}' class='btn btn-primary rounded-lg delete col-sm-7' role='button' style="padding: 0px; margin-bottom: 5px;">Delete</a>
                <a id='${data[i]['student_id']}' class='btn btn-primary rounded-lg edit col-sm-7' style="padding: 0px;" role='button'>Edit</a></td>`
                + `</tr>`
        }
        table += `</tbody><caption>${rows} row(s) retrieved</caption></table>`

        $(".retrieve").html(table);
    }

    function InfoSuccess(response) {
        var data = JSON.parse(response.data);
        var rows = 0;
        var classes = `<table class='table table-sm table-light'>
                        <thead class='bg-primary'>
                            <tr>
                                <th>Class ID</th>
                                <th>Class Desc</th>
                                <th>Days</th>
                                <th>Start Date</th>
                                <th>Instructor ID</th>
                                <th>Instructor First Name</th>
                                <th>Instructor Last Name</th>
                            </tr>
                        </thead>
                        <tbody>`
        for (var i = 0; i < data.length; i++) {
            rows++;
            classes += "<tr>"
                + `<td>${data[i]['class_id']}</td>`
                + `<td>${data[i]['class_desc']}</td>`
                + `<td>${data[i]['days'] ?? 0}</td>`
                + `<td>${data[i]['start_date']}</td>`
                + `<td>${data[i]['instructor_id']}</td>`
                + `<td>${data[i]['first_name']}</td>`
                + `<td>${data[i]['last_name']}</td>`
                + `</tr>`
        }
        classes += `</tbody><caption>${rows} row(s) retrieved</caption></table>`

        $('.studentinfo').html(classes);
    }

    function ClassGet(response) {
        var data = JSON.parse(response.data);

        var classes = "";
        for (var i = 0; i < data.length; i++) {
            classes += `<option val='${data[i]["class_id"]}'>${data[i]['class_desc']}</option>`
        }

        $('#class-id').html(classes);
    }

    function isEmpty(value) {
        return $.trim(value) === '';
    }

    function shakeStatus(statusDiv) {
        statusDiv.show();
        statusDiv.effect("shake", { times: 2, distance: 10 }, 400);
    }

    $('#fname').on('focus', function () {
        $('.fname-status').hide();
    });

    $('#lname').on('focus', function () {
        $('.lname-status').hide();
    });

    $('#id').on('focus', function () {
        $('.id-status').hide();
    });

    $('#class-id').on('focus', function () {
        $('.class-status').hide();
    });

    function validateForm() {
        var isValid = true;

        // Check first name
        var firstName = $('#fname').val();
        var firstNameStatus = $('.fname-status');
        if (isEmpty(firstName)) {
            shakeStatus(firstNameStatus);
            isValid = false;
        } else {
            firstNameStatus.hide();
        }

        // Check last name
        var lastName = $('#lname').val();
        var lastNameStatus = $('.lname-status');
        if (isEmpty(lastName)) {
            shakeStatus(lastNameStatus);
            isValid = false;
        } else {
            lastNameStatus.hide();
        }

        // Check school ID
        var schoolID = $('#id').val();
        var idStatus = $('.id-status');
        if (isEmpty(schoolID)) {
            shakeStatus(idStatus);
            isValid = false;
        } else {
            idStatus.hide();
        }

        // Check class ID
        var classID = $('#class-id').val();
        var classStatus = $('.class-status');
        if (!classID || classID.length === 0) {
            shakeStatus(classStatus);
            isValid = false;
        } else {
            classStatus.hide();
        }

        return isValid;
    }

    $('.add-student').on('click', function () {
        if (validateForm()) {
            var firstName = $('#fname').val();
            var lastName = $('#lname').val();
            var schoolID = $('#id').val();
            var classID = $('#class-id').val();

            var data = {}
            data.fname = firstName;
            data.lname = lastName;
            data.scid = schoolID;
            data.cid = classID;

            AJAX("https://localhost:7083/add", "post", data, "JSON", Success, Error);
        } else {
            console.log('Form validation failed.');
        }
    });

    // Edit button click event handler
    $(document).on('click', '.edit', function () {
        // Get the parent row of the clicked edit button
        var id = $(this).attr('id');

        // Get the columns containing the student information
        var firstNameColumn = $(`#${id}.fn-cell`);
        var lastNameColumn = $(`#${id}.ln-cell`);
        var schoolIDColumn = $(`#${id}.scid-cell`);

        // Get the current values
        var currentFirstName = firstNameColumn.html();
        var currentLastName = lastNameColumn.html();
        var currentSchoolID = schoolIDColumn.html();

        // Replace the columns with input fields
        firstNameColumn.html(`<input type="text" id="${id}" class="form-control fname" value="" placeholder="` + currentFirstName + '">');
        lastNameColumn.html(`<input type="text" id="${id}" class="form-control lname" value="" placeholder="` + currentLastName + '">');
        schoolIDColumn.html(`<input type="number" id="${id}" class="form-control scid" value="" placeholder="` + currentSchoolID + '" min="1">');

        // Change the edit button to an update button
        $(this).removeClass('edit btn-primary').addClass('update btn-primary').text('Update');
    });

    // Update button click event handler
    $(document).on('click', '.update', function () {
        var id = $(this).attr('id');
        var fnColumn = $(`#${id}.fname`);
        var lnColumn = $(`#${id}.lname`);
        var scIDColumn = $(`#${id}.scid`);

        $(this).removeClass('update btn-primary').addClass('edit btn-primary').text('Edit');
        if (fnColumn.val() == '' || lnColumn.val() == '' || scIDColumn.val() == '') {
            var firstNameColumn = $(`#${id}.fn-cell`);
            var lastNameColumn = $(`#${id}.ln-cell`);
            var schoolIDColumn = $(`#${id}.scid-cell`);

            firstNameColumn.html(fnColumn.attr('placeholder'));
            lastNameColumn.html(lnColumn.attr('placeholder'));
            schoolIDColumn.html(scIDColumn.attr('placeholder'));
        }
        else {
            var updatedFirstName = fnColumn.val();
            var updatedLastName = lnColumn.val();
            var updatedSchoolID = scIDColumn.val();

            var data = {}
            data.fname = updatedFirstName;
            data.lname = updatedLastName;
            data.scid = updatedSchoolID;

            AJAX("https://localhost:7083/update", "put", data, "JSON", Success, Error);
        }
    });

    // Delete button click event handler
    $(document).on('click', '.delete', function () {
        var studentID = $(this).attr('id');

        AJAX("https://localhost:7083/delete", "delete", id, "JSON", Success, Error);
    });

    function AJAX(url, method, data, dataType, successMethod, errorMethod) {
        let ajaxOptions = {};
        ajaxOptions['url'] = url;
        ajaxOptions['method'] = method;
        ajaxOptions['data'] = JSON.stringify(data);  // NEW for C#
        ajaxOptions['dataType'] = dataType;
        ajaxOptions['success'] = successMethod;
        ajaxOptions['error'] = errorMethod;
        ajaxOptions['contentType'] = "application/json";  // NEW for C#

        $.ajax(ajaxOptions);
    }
});