var courseRosters = {

    init: function(){
        courseRosters.switchToHomeView();
        courseRosters.listCurrentRosters();
        courseRosters.listAllRosters();
        $('#toDiv').on("click", ".remove-email", function(){
            $(this).parent()
            .remove();

        });
        //switch roster data when new course selected
        $('#allRostersList').change(function(){
            courseRosters.loadSpecificRoster($('#allRostersList :selected').val(),$('#allRostersList :selected').data().termcode);
        });
        //clear table and show loading gif while waiting for data
        $('#allRostersRosterList').change(function(){
            $('#rosterTable tr').not(function(){if ($(this).has('th').length){return true}})
            .remove();
            $('#loading').show();
            courseRosters.loadSpecificRoster($('#allRostersRosterList :selected').val(),$('#allRostersRosterList :selected').data().termcode);
        });

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //rosterList PRIMARY FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    listCurrentRosters:function() {
        var url = env.generateUrl('os_courseRosters', 'listCurrentRosters','','JSON');
        $.ajax(
            {
                url:url,
                dataType: "json",
                type: "POST",
                cache: false,
                success: function(data) {
                    var CurrentTermSectionInfo = data.DATA;

                    var parsedRosterList = courseRosters.parseRosterName(CurrentTermSectionInfo);

                    courseRosters.populateCurrentRosterLinks(CurrentTermSectionInfo, parsedRosterList);

                    if(data.recordcount===0){
                        $('#currentCourses').append('<tr>' +'<td style="text-align:center" colspan="2"><b>No Records Found For The Current Term</b></td>' + '</tr>');
                    }

                },
                error: function() {
                    $('#currentCourses').append('<tr>' +'<td style="text-align:center" colspan="2"><b>Error Retrieving Current Term Courses</b></td>' + '</tr>');
                }
            });

    },

    listAllRosters:function() {
        var url = env.generateUrl('os_courseRosters', 'listAllRosters','','JSON');
        $.ajax(
            {
                url:url,
                dataType: "json",
                type: "POST",
                cache: false,
                success: function(data) {
                    var AllTermSectionInfo = data.DATA;

                    var parsedRosterList = courseRosters.parseRosterName(AllTermSectionInfo);

                    courseRosters.populateAllRosterDropDown( AllTermSectionInfo, parsedRosterList);

                    //handle errors
                    if(data.recordcount===0){
                        $('#allRosterLabel').text("No Rosters Found");
                        $('#allRostersList').hide();
                        $('#currentBtn').prop("disabled",true);
                    }


                },
                error: function() {
                    $('#allRosterLabel').text("Error Retrieving Rosters");
                    $('#allRostersList').hide();
                    $('#currentBtn').prop("disabled",true);
                }
            });

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //rosterView PRIMARY FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    loadSpecificRoster:function(CRN, termCode) {
        var url = env.generateUrl('os_courseRosters', 'loadSpecificRoster','&CRN=' + CRN +'&termCode=' + termCode, 'JSON');
        $.ajax(
            {
                url:url,
                dataType: "json",
                type: "POST",
                cache: false,
                success: function(data) {

                    var specificRosterData = data.DATA;
                    $('#allEmails').val(CRN);
                    $('#numStudents').html(data.recordcount + " Student Records");
                    $('#loading').hide();
                    courseRosters.switchToRosterView(CRN, termCode);
                    courseRosters.populateRosterView(specificRosterData, CRN);

                    if(data.recordcount===0){
                        $('#rosterTable').append('<tr>' +'<td colspan="9">No Records Found For This Course</td>' + '</tr>');
                    }


                },
                error: function() {
                    $('#rosterTable').append('<tr>' +'<td colspan="9">An error occurred fetching course information.</td>' + '</tr>');
                }
            });
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //rosterLists HELPER FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    parseRosterName:function(rosterInfo) {
        var rosterNames= [];

        for(var i=0; i < rosterInfo.sirasgn_crn.length; i++){

            rosterNames[i]= rosterInfo.stvterm_desc[i] + " (" +rosterInfo.sirasgn_term_code[i] + ") - " + rosterInfo.ssbsect_subj_code[i] + " " + rosterInfo.ssbsect_crse_numb[i] + " sect " +rosterInfo.ssbsect_seq_numb[i] + " (CRN:" + rosterInfo.sirasgn_crn[i]+")";
        }
        return rosterNames;
    },

    populateCurrentRosterLinks:function(rosterInfo, rosterList) {
        for(var i=0; i < rosterInfo.sirasgn_crn.length; i++){
            $('#currentCourses').append('<tr>' +
                '<td>' + '<label class="currentLabel" onclick="courseRosters.loadSpecificRoster('+ rosterInfo.sirasgn_crn[i]+','+rosterInfo.sirasgn_term_code[i] +')"> '+ rosterList[i] +' </label>'+ '</td>' +
                '<td>' + '<input type="checkbox" class="courseEmailBox" value="' + rosterInfo.sirasgn_crn[i] + '" data-termCode="'+rosterInfo.sirasgn_term_code[i]+'">'+ '</td>'+
                '</tr>');
        }
    },

    populateAllRosterDropDown:function(rosterInfo, rosterList) {
        for(var i=0; i < rosterInfo.sirasgn_crn.length; i++){
            $('#allRostersList').append('<option value="' + rosterInfo.sirasgn_crn[i] + '" data-termCode="'+rosterInfo.sirasgn_term_code[i]+'"> ' + rosterList[i] +' </option>');
            $('#allRostersRosterList').append('<option value="' + rosterInfo.sirasgn_crn[i] + '" data-termCode="'+rosterInfo.sirasgn_term_code[i]+'"> ' + rosterList[i] +' </option>');
            $('#allRostersEmailList').append('<option value="' + rosterInfo.sirasgn_crn[i] + '" data-termCode="'+rosterInfo.sirasgn_term_code[i]+'"> ' + rosterList[i] +' </option>');


        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //rosterView HELPER FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    populateRosterView:function(rosterData) {
        for(var i=0; i < rosterData.bannerid.length; i++){
            $('#rosterTable').append(
                '<tr data="'+rosterData.student_pidm[i]+'">' +
                '<td class="trow studIMG">' + '<img class="studentIMG" src="'+courseRosters.getStudentIMG(rosterData.student_pidm[i]) +'">' + '</td>' +
                '<td class="trow studName">' + rosterData.last_name[i] + ', ' + rosterData.first_name[i] + '</td>' +
                '<td class="trow bannerID">' + rosterData.bannerid[i] + '</td>' +
                '<td class="trow class">' + rosterData.classdescription[i] + '</td>' +
                '<td class="trow dept">' + rosterData.dept[i] + '</td>' +
                '<td class="trow major">' + rosterData.major[i] + '</td>' +
                '<td class="trow studEmail">' + rosterData.emailaddress[i] + '</td>' +
                '<td class="tCheck">' + '<input type="checkbox" class="email-box" onclick="courseRosters.checkOneEmail()" value="'+ rosterData.emailaddress[i] +'">' + '</td></tr>'
            );
        }
        $(".trow").click(courseRosters.switchToIndividualView);
    },

    getStudentIMG:function(pidm) {
        var thumb = false;
        var url = env.generateUrl('img', 'onecard','&thumb=' + thumb +'&pidm=' + pidm, '');
        return url;
    },

    printPDF:function() {
        var CRN = $('#allRostersRosterList').val();
        var termCode= $('#allRostersRosterList option:selected').data().termcode;
        var url = env.generateUrl('os_courseRosters','rosterToPDF','&CRN=' + CRN +'&termCode=' + termCode,'');
        //rationale here: Less clicks to print, which is likely the #1 reason someone uses this feature.
        if(navigator.userAgent.match(/Trident\//)) {
            window.location.assign(url);
        }
        else {
            var win = window.open(url, "_blank", "noopener=yes");
            if(win && win.focus) win.focus();
        }
    },

    exportCSV:function() {
        var CRN = $('#allRostersRosterList').val();
        var termCode= $('#allRostersRosterList option:selected').data().termcode;
        var url = env.generateUrl('os_courseRosters','rosterToCSV','&CRN=' + CRN +'&termCode=' + termCode,'');
        window.location.assign(url);
    },

    checkAllEmails:function() {
        if ($('#allEmails').is(':checked')) {
            $('.email-box').prop('checked', true);
        }
        else {
            $('.email-box').prop('checked', false);
        }
    },

    checkOneEmail:function() {
        $('#allEmails').prop('checked', false);
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //emailView PRIMARY FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    emailInit:function() {
        if($('#allEmails').is(":checked")){
            var CRN = $('#allRostersRosterList').val();
            var termCode= $('#allRostersRosterList :selected').data().termcode;
            courseRosters.addCourseEmail(CRN,termCode);
            $('#allEmails').prop('checked', false);
            $(".email-box").each(function(){
                $(this).prop('checked', false);
            });

        }
        else{
            $(".email-box").each(function(){
                if($(this).is(":checked")){
                    courseRosters.addIndividualEmail($(this).val());
                    $(this).prop('checked', false);
                }
            });
        }
    },

    addCourseEmail:function(incomingCRN, incomingTermCode) {
        var emailText;
        var CRN;
        var termCode;

        //used by check boxes in RosterView and home/current rosters
        if(incomingCRN){
            $("#allRostersList > option").each(function(){
                if($(this).val() === incomingCRN && $(this).data().termcode === incomingTermCode){
                    emailText = $(this).text();
                    CRN = incomingCRN;
                    termCode = incomingTermCode;
                }
            });
        }
        else{
            //when selected from emailView
            emailText = $('#allRostersEmailList :selected').text();
            CRN = $('#allRostersEmailList').val();
            termCode = $('#allRostersEmailList :selected').data().termcode;
        }

        var duplicateCourse = courseRosters.isDuplicateCourse(CRN,termCode);
        //check for dupes
        if(duplicateCourse){
            // eslint-disable-next-line no-magic-numbers
            duplicateCourse.effect("shake", { times:3 }, 600);
        }
        else{
            $('#toField').append(
                '<div class="email-pill" data-crn="'+CRN+'" data-termCode="'+termCode+'">'+emailText+'<div class="remove-email"><i class="fa fa-times-circle fa-2x"></i></div></div>'
            );
        }
    },

    addIndividualEmail:function(emailAddress) {
        //used by checkboxes to import email from rosterView
        if(emailAddress){
            $('#toField').append(
                '<div class="email-pill" data-email="'+emailAddress+'"">'+emailAddress+'<div class="remove-email"><i class="fa fa-times fa-2x"></i></div></div>'
            );
        }
        else{
            //used for manually adding an address on emailView
            var email = $('#emailIndividualField').val();
            var duplicateIndividual = courseRosters.getDuplicateIndividual(email);

            //check for dupes
            if(duplicateIndividual){
                // eslint-disable-next-line no-magic-numbers
                duplicateIndividual.effect("shake", { times:3 }, 600);
            }
            else if(courseRosters.isValidEmail(email)){
                $('#toField').append(
                    '<div class="email-pill" data-email="'+email+'"">'+email+'<div class="remove-email"><i class="fa fa-times fa-2x"></i></div></div>'
                );
                $('#emailIndividualField').val("");
                $('#inivEmailDiv').removeClass("error");
            }
            else{
                // eslint-disable-next-line no-magic-numbers
                $("#emailIndividualField").effect("shake", { times:3 }, 600);
                $("#inivEmailDiv").addClass("error");
            }
        }
    },

    getDuplicateIndividual:function(email){
        var duplicate;
        $(".email-pill").each(function(){
            if(!duplicate){
                //individual -- double check
                if($(this).data().email){
                    var existingEmail = $(this).data().email;
                    if(email === existingEmail){
                        duplicate = $(this);
                    }
                }
            }
        });
        return duplicate;
    },

    isDuplicateCourse:function(CRN, termCode){
        var duplicate;
        $(".email-pill").each(function(){
            if(!duplicate){
                //course -- double check
                if($(this).data().crn){
                    var existingCRN = $(this).data().crn;
                    var existingTerm = $(this).data().termcode;
                    if((CRN === existingCRN) && (termCode === existingTerm)){
                        duplicate = $(this);
                    }
                }
            }
        });
        return duplicate;
    },

    sendEmail:function() {
        var emailToSend = courseRosters.buildEmail();
        courseRosters.emailBtnSuccess();
        var url = env.generateUrl('os_courseRosters', 'sendEmail','', 'JSON');
        $.ajax({
            url:url,
            dataType: "json",
            type: "POST",
            data: {email:emailToSend},
            cache: false,
            success: function() {
                //finish send button state
                courseRosters.emailBtnSent();
            },
            error: function() {
                courseRosters.emailBtnFailure();
            }
        });
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //emailView HELPER FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getInstructorEmail:function() {
        var url = env.generateUrl('os_courseRosters', 'getInstructorEmail', '', 'JSON');
        $.ajax({
            url:url,
            dataType: "json",
            type: "POST",
            cache: false,
            success: function(data) {
                var email = data.DATA;
                $('#instructorEmail').text(email);
            },
            error: function() {
                //Email built controller side later, will error/succeed safely later.
                $('#instructorEmail').text("Error Retrieving Email");
            }
        });
    },

    isValidEmail:function(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    },


    emailValidation:function(){
        //makes sure there is at least one email recipient
        var toField = courseRosters.compileEmailRecievers();
        var individualsCount = toField.individuals.length;
        var coursesCount = toField.courses.CRN.length;

        if((individualsCount + coursesCount)){
            courseRosters.sendEmail();
        }
        else{
            // eslint-disable-next-line no-magic-numbers
            $("#emailIndividualField").effect("shake", { times:3 }, 600);
            // eslint-disable-next-line no-magic-numbers
            $("#allRostersEmailList").effect("shake", { times:3 }, 600);
        }
    },

    buildEmail:function() {
        //populated in the controller
        var fromField = "";
        var toField = courseRosters.compileEmailRecievers();
        var subjectField = $('#subjectField').val();
        var bodyField = $('#emailBody').val();
        var email = {
            from:fromField,
            to:toField,
            subject:subjectField,
            body:bodyField
        };

        return JSON.stringify(email);
    },

    compileEmailRecievers:function() {
        //array of emails
        var individuals=[];
        //single object with two arrays holding all courses info in respective positions
        var courses={
            CRN:[],
            termCode:[]
        };
        $(".email-pill").each(function(){
            if($(this).data().email){
                individuals.push($(this).data().email);
            }
            else if($(this).data().crn){
                courses.CRN.push($(this).data().crn);
                courses.termCode.push($(this).data().termcode);
            }
        });
        var toField = {
            individuals:individuals,
            courses:courses
        };

        return toField;
    },

    emailBtnSuccess:function() {
        if($('#sendButton').hasClass("btn-success")){
            $('#sendButton').text('Sending');
            $('#sendButton').removeClass("btn-success")
            .addClass("btn-disabled");
            $('#sendButton').attr('disabled',true);
        }
    },

    emailBtnSent:function(){
        $('.email-pill').remove();
        if($('#sendButton').hasClass("btn-disabled")){
            $('#sendButton').text('Sent!');
            $('#sendButton').removeClass("btn-disabled")
            .addClass("btn-primary");
        }
        // eslint-disable-next-line no-magic-numbers
        setTimeout(courseRosters.emailBtnSend, 2000);
    },

    emailBtnSend:function() {
        $('#sendButton').text('Send');
        if($('#sendButton').hasClass("btn-primary")){
            $('#sendButton').removeClass("btn-primary")
            .addClass("btn-success");
            $('#sendButton').attr('disabled',false);
        }
        else if($('#sendButton').hasClass("btn-danger")){
            $('#sendButton').removeClass("btn-danger")
            .addClass("btn-success");
            $('#sendButton').attr('disabled',false);
        }
    },

    emailBtnFailure:function() {
        $('#sendButton').text('Error');
        $('#sendButton').removeClass("btn-success")
        .addClass("btn-danger");
        $('#sendButton').attr('disabled',true);
        //reset the button
        // eslint-disable-next-line no-magic-numbers
        setTimeout(courseRosters.emailBtnSend, 2000);
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //INDIVIDUAL VIEW FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //toggles check box it correlates to on rosterView
    indiCheck:function(){
        //check state, this fires AFTER the state of the checkbox has changed, not before.
        if($('#indiBox').is(":checked")){
            //change the corresponding checkbox status on rosterView to checked
            $(".email-box").each(function(){
                if($(this).val()===$('#indiBox').val()){
                    $(this).prop('checked', true);
                }
            });
        }
        else{
            //change the corresponding checkbox status on rosterView to NOT checked
            courseRosters.checkOneEmail();
            $(".email-box").each(function(){
                if($(this).val()===$('#indiBox').val()){
                    $(this).prop('checked', false);
                }
            });
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //SWITCHING FUNCTIONS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    email:function() {
        if(!($("#instructorEmail").text())){
            courseRosters.getInstructorEmail();
        }
        courseRosters.switchToEmailView();
    },

    switchToEmailView:function() {
        $('.email-pill').remove();
        $('#emailIndividualField').val('');
        $('#subjectField').val('');
        $('#emailBody').val('');
        $('.courseEmailBox').each(function(){
            if($(this).is(":checked")){
                courseRosters.addCourseEmail($(this).val(),$(this).data().termcode);
                $(this).prop('checked', false);
            }
        });
        $('#rosterLists').hide();
        $('#currentEmail').hide();
        $('#rosterView').hide();
        $('#individualView').hide();
        $('#emailView').show();
        var CRN = $('#allRostersRosterList').val();
        var termCode= $('#allRostersRosterList :selected').attr("data-termCode");
        $('#allRostersEmailList > option').each(function(){
            //avoids duplicates by forcing a match on both.
            if(($(this).val() === CRN) && ($(this).data().termcode === termCode)) {
                $(this).prop('selected',true);
            }
        });
        courseRosters.emailInit();
    },

    switchToHomeView:function() {
        $('#rosterLists').show();
        $('#currentEmail').show();
        $('#rosterView').hide();
        $('#emailView').hide();
        $('#individualView').hide();
        $('#helpView').hide();
        $('#allRostersList').val("default");
    },

    switchToIndividualView:function(){
        //removes previous entrants
        $('#indivTable tr').not(function(){if ($(this).has('th').length){return true}})
        .remove();

        //build the table row data
        //gotta grab this so we can rebuild image without the same class -- least hacky way to do so
        var pidm = $(this).closest("tr")
        .attr("data");

        //just a url
        var studIMG = courseRosters.getStudentIMG(pidm);

        var studName = $(this).closest("tr")
        .find(".studName")
        .html();

        var bannerID = $(this).closest("tr")
        .find(".bannerID")
        .html();

        var classDesc = $(this).closest("tr")
        .find(".class")
        .html();

        var dept = $(this).closest("tr")
        .find(".dept")
        .html();

        var major = $(this).closest("tr")
        .find(".major")
        .html();

        var studEmail = $(this).closest("tr")
        .find(".studEmail")
        .html();

        var studEmailBox = $(this).closest("tr")
        .find(".email-box")
        .is(":checked");

        $("#indiIMG").html("<img class='indiIMG' src="+studIMG+">");

        $("#indiLabel").text(studName);

        $('#indivTable').append(
            '<tr>' +
                    '<td class="indiTD">Name</td>' +
                    '<td>' + studName + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">BannerID</td>' +
                    '<td class="bannerID">' + bannerID + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">Class</td>' +
                    '<td>' + classDesc + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">Dept</td>' +
                    '<td>' + dept + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">Major</td>' +
                    '<td>' + major + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">Email</td>' +
                    '<td>' + studEmail + '</td>' +
                '</tr><tr>' +
                    '<td class="indiTD">Send To</td>' +
                    '<td> <input type="checkbox" id="indiBox" class="indi-box" onclick="courseRosters.indiCheck()" value="'+studEmail+'"> </td></tr>'
        );

        $('#indiBox').prop('checked', studEmailBox);
        $('#rosterLists').hide();
        $('#currentEmail').hide();
        $('#rosterView').hide();
        $('#emailView').hide();
        $('#individualView').show();
    },

    nextIndividual:function() {
        var currentID = $('#indivTable').find('.bannerID')
        .html();

        $('#rosterTable .bannerID').each(function(){
            if($(this).html() === currentID){
                $(this).closest("tr")
                .next("tr")
                .find(".trow")
                .click();
            }
        });

    },

    prevIndividual:function() {
        var currentID = $('#indivTable').find('.bannerID')
        .html();
        $('#rosterTable .bannerID').each(function(){
            if($(this).html() === currentID){
                $(this).closest("tr")
                .prev("tr")
                .find(".trow")
                .click();
            }
        });

    },

    firstIndividual:function() {
        //nth-child(2) is 2 because 1 is the table headers (th)
        $('#rosterTable>tbody tr:nth-child(2)')
        .find(".trow")
        .click();
    },

    lastIndividual:function() {
        $('#rosterTable>tbody tr:last-child')
        .find(".trow")
        .click();
    },

    switchToHelpView:function() {
        $('#rosterLists').hide();
        $('#currentEmail').hide();
        $('#individualView').hide();
        $('#rosterView').hide();
        $('#emailView').hide();
        $('#helpView').show();
    },

    switchToRosterView:function(CRN, termCode) {
        //removes previous entrants
        $('#rosterTable tr').not(function(){if ($(this).has('th').length){return true}})
        .remove();

        $('#allRostersRosterList > option').each(function(){
            //avoids duplicates by forcing a match on both.
            //These claim to be numbers.  Don't believe their lies.
            if((Number($(this).val()) === Number(CRN)) && (Number($(this).data().termcode) === Number(termCode))) {
                $(this).prop('selected',true);
            }
        });

        $('#rosterLists').hide();
        $('#currentEmail').hide();
        $('#individualView').hide();
        $('#rosterView').show();
        $('#emailView').hide();
    },

    backToRosterView:function() {
        $('#rosterLists').hide();
        $('#currentEmail').hide();
        $('#individualView').hide();
        $('#rosterView').show();
        $('#emailView').hide();

    }
};
