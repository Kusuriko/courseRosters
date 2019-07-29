<cfoutput>


	<script language="javascript" src="view/v_os_courseRosters/assets/js/main.js?cacheFingerprint=#application.cacheFingerprint#"></script>
	<link rel="stylesheet" type="text/css" href="view/v_os_courseRosters/assets/css/main.css?cacheFingerprint=#application.cacheFingerprint#"/>
	<!--- FONT AWESOME--->
	<link type="text/css" rel="stylesheet" href="_assets/css/Font-Awesome-4.1.0/css/font-awesome.min.css" />



	<script type="text/javascript">
		$(document).ready(function()
		{
			courseRosters.init();

		});

	</script>

	<div style="height:100%;overflow-y:auto;">
		<div style="margin:0 auto;padding:10px 30px;">
			<div id="currentRow" class="row">
				<div id="rosterLists" class="col-xs-12 col-sm-10 col-md-9 col-lg-6">

					<fieldset class="current-border">
						<legend class="current-border">Current Courses</legend>
						 <table id="currentCourses" class="table table-striped">
						 	<tbody>

							 	<tr>
							 		<th>Course Identifiers</th>
							 		<th>Email Course</th>
							 	</tr>
						 	</tbody>
						 </table>
					</fieldset>

					<div>
						<label  id="allRosterLabel" class="control-label allRosterLabel">All Courses</label>
					</div>

					 <div class="input-group">
						<select class="input-lg form-control" id="allRostersList" name="allRostersList">
							<option value="default">Select A Course</option>
						</select>

					</div>


				</div>
				<div class="col-xs-12 col-sm-3 col-lg-2" id="currentEmail">
					<button class="btn btn-default" type="button" id="currentBtn" onclick="courseRosters.email()"><i class="fa fa-envelope fa-2x"></i><br><b>Email</b></button>
					<button class="btn btn-default" type="button" id="helpBtn" onclick="courseRosters.switchToHelpView()"><i class="fa fa-question-circle fa-2x"></i><br><b>Help</b></button>

				</div>


			</div>

			<div id="rosterView">
				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-10">
					<div class="input-group" id="rosterOptions">

							<div>

								<button class="btn btn-default courseRosterBtn" type="button" id="homeButtonRosterView" onclick="courseRosters.switchToHomeView()"><i class="fa fa-home fa-2x"></i><br><b>Home</b></button>

								<button class="btn btn-default courseRosterBtn" type="button" id="pdfButton" onclick="courseRosters.printPDF()"><i class="fa fa-download fa-2x"></i><br><b>PDF</b></button>

								<button class="btn btn-default courseRosterBtn" type="button" id="emailButton" onclick="courseRosters.email()"><i class="fa fa-envelope fa-2x"></i><br><b>Email</b></button>

								<button class="btn btn-default courseRosterBtn" type="button" id="csvButton" onclick="courseRosters.exportCSV()"><i class="fa fa-table fa-2x"></i><br><b>CSV</b></button>

							</div>


							<div>
								<select class="input form-control" id="allRostersRosterList"></select>
							</div>

							<div>

							</div>

					</div>
					<label id="numStudents"></label>
					<div class="table-responsive">
					  <div id="loading">
					  </div>
					  <table id="rosterTable" class="table table-striped">
					  	<tbody id="rosterTableBody">
						    <tr>
						    	<th>
						    		Picture
						    	</th>
						    	<th>
						    		Name
						    	</th>
						    	<th class="bannerID">
						    		Banner ID
						    	</th>
						    	<th class="class">
						    		Class
						    	</th>
						    	<th class="dept">
						    		Dept
						    	</th>
						    	<th class="major">
						    		Major
						    	</th>
						    	<th>
						    		Email
						    	</th>
						    	<th>

						    		<input type="checkbox" id="allEmails" class="email-box" name="allEmails" value="All" onclick="courseRosters.checkAllEmails()">

						    	</th>
						    </tr>


					    </tbody>
					  </table>
					</div>
				</div>

			</div>

			<div id="individualView">
				<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
						<div>
								<button class="btn btn-default courseRosterBtn" type="button" id="indiHomeButton" onclick="courseRosters.backToRosterView()"><i class="fa fa-arrow-left fa-2x"></i><br><b>Back</b></button>
								<button class="btn btn-default courseRosterBtn" type="button" id="indiBtn" onclick="courseRosters.email()"><i class="fa fa-envelope fa-2x"></i><br><b>Email</b></button>
						</div>
				</div>
				<div id="individualSubView">

					<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
						<label id="indiLabel"> </label>
					</div>
					<!--- image div goes on top--->
					<div id="indiIMG" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

					</div>
					<!--- student info div--->
					<div class="col-xs-1 col-sm-1 col-md-1 col-lg-12">
						<table id="indivTable" class="table responsive">
						  	<tbody>



						    </tbody>
						  </table>
					</div>

					<!--- nav buttons--->
					<div id="indiNav" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
						<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xs-offset-1 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
							<button type="button" class="btn btn-default courseRosterBtn" onclick="courseRosters.firstIndividual()"><i class="fa fa-angle-double-left fa-lg"></i></button>
						</div>

						<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
							<button type="button" class="btn btn-default courseRosterBtn" onclick="courseRosters.prevIndividual()"><i class="fa fa-chevron-left fa-lg"></i></button>
						</div>

						<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
							<button type="button" class="btn btn-default courseRosterBtn" onclick="courseRosters.nextIndividual()"><i class="fa fa-chevron-right fa-lg"></i></button>
						</div>

						<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
							<button type="button" class="btn btn-default courseRosterBtn" onclick="courseRosters.lastIndividual()"><i class="fa fa-angle-double-right fa-lg"></i></button>
						</div>

					</div>
				</div>
			</div>

			<div id="emailView">
				<div class="col-xs-1 col-sm-1 col-lg-1">
					<div>
							<button class="btn btn-default courseRosterBtn" type="button" id="homeButton" onclick="courseRosters.switchToHomeView()"><i class="fa fa-home fa-2x"></i><br><b>Home</b></button>
					</div>
				</div>

				<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
					<form class="form-horizontal">
 						 <div class="form-group">
							<div class="row emailElement">
								<label class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">From</label>
								<div class="col-xs-8 col-sm-4 col-md-2 col-lg-2">
									<label id="instructorEmail" class="control-label" ></label>
								</div>
							</div>

							<div class="row emailElement">
								<label class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">Add Course</label>
								<div class="col-xs-8 col-md-8 col-md-8 col-lg-8">
									<select class="input-sm form-control" id="allRostersEmailList"></select>
								</div>
								<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
									<button type="button" class="btn btn-default emailBtn" id="addCourseEmailButton" onclick="courseRosters.addCourseEmail()"><i class="fa fa-plus-circle fa-lg"></i></button>
								</div>

							</div>

							<div id="toDiv">
								<div class="row emailElement">
									<label  class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">Add Email</label>
									<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
										<input type="email" class="form-control" id="emailIndividualField" placeholder="Add specific email address to send to">
									</div>
									<div id="inivEmailDiv" class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
										<button type="button" class="btn btn-default emailBtn" id="addIndividualEmail" onclick="courseRosters.addIndividualEmail()"><i class="fa fa-plus fa-lg"></i></button>
									</div>
								</div>

								<div class="row emailElement">
									<label class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">To</label>
									<div id="toField" class="col-xs-10 col-sm-10 col-md-10 col-lg-10"></div>
								</div>

								<div class="row emailElement">
									<label class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">Subject</label>
									<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
										<input type="text" class="form-control" id="subjectField" placeholder="Subject">
									</div>
								</div>

								<div class="row emailElement">
									<label class="col-xs-2 col-sm-2 col-md-2 col-lg-2 control-label">Body</label>
									<div class="col-xs-10 col-sm-10 col-md-10 col-lg-8">
										<textarea class="input-sm form-control" rows="4" id="emailBody"></textarea>
									</div>
								</div>
								<div class="row">
									<div class="col-xs-2 col-sm-2 col-md-2 col-lg-1 col-xs-offset-10 col-sm-offset-10 col-md-offset-10 col-lg-offset-9">
										<button type="button" class="btn btn-success" id="sendButton" onclick="courseRosters.emailValidation()"> Send </button>
									</div>
								</div>

							</div>
						 </div>
					</form>


				</div>

			</div>

			<div id="helpView">
				<div class="col-xs-1 col-sm-1 col-lg-1">
					<div>
							<button class="btn btn-default courseRosterBtn" type="button" id="homeButton" onclick="courseRosters.switchToHomeView()"><i class="fa fa-home fa-2x"></i><br><b>Home</b></button>
					</div>
				</div>
				<div id="helpContainer">
					<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<label id="helpTitle">Course Rosters Help </label>
					</div>

					<div class="col-xs-12 col-sm-12 col-md-12 col-lg-offset-1 col-lg-12 helpPara">
						<p>Course Rosters is an application designed to help instructors view student data for rosters both past and present as well as enable instructors to easily send emails to all or part of students within these rosters.</p>
						<p>It has several pages to help accomplish this such as:</p>
						<p><label class="helpSubTitle">Current Courses</label></p>
						<p>This view shows a table with links to all of an instructors current courses.  From here courses may be emailed in their entirety by checking the corresponding box in the table to the right of the respective course(s).</p>
						<p>Checking any boxes here and clicking the email button will take you to the email page and populate those courses in the send to field.</p>
						<p>Lastly at the bottom of the Current Courses page is a drop down for all courses, should you need to access anything older than current courses.</p>
						<p><label class="helpSubTitle">Roster Page</label></p>
						<p>The Roster Page contains all the information of students of a class in a table.  At the far right of this table is a checkbox used to email students.  Selecting the top right most box will select all students' emails.
							Once you have finalized your selection of email addresses, click the email button to have all of them imported to the send to field.</p>
						<p>This page also allows you to click on any student to get an individual page where you can view a larger photo of the person and a more prominent display of their individual information.  Alternatively, you can use the dropdown at the top of the page to navigate to a different roster.  Please note this will remove any email selections you have made.</p>
						<p>Lastly this page features two buttons that you may use to export roster data depending on your needs.  For more information on how these buttons work, please look at the button section below.</p>
						<p><label class="helpSubTitle">Email Page</label></p>
						<p>This page works much like an email client would with a few notes.  Firstly you will always be listed as the sender and a copy of any email you send will also be sent to you.  Furthermore selections you made on checkboxes from previous pages will be automatically populated in the send to field.  You may additionally add more individual recipients or specify more entire courses to be added using the respective field/dropdown and their buttons to the right.</p>
						<p>To remove any recipient simply click the X to the right of their entry in the to field.</p>
						<p><label class="helpSubTitle">Buttons Appendix</label></p>
						<table id="helpBtnTable">
						  	<tbody>
							    <tr>
							    	<td>
							    		<button class="btn btn-default courseRosterBtn" type="button" ><i class="fa fa-download fa-2x"></i><br><b>PDF</b></button>
							    	</td>
							    	<td>
							    		This button generates a pdf and opens it within your browser.  Use this button when you want to print a roster.  Use your browser's back button to leave the pdf and return to the portal.</p>
							    	</td>
							    </tr>
							     <tr>
							    	<td>
							    		<button class="btn btn-default courseRosterBtn" type="button" ><i class="fa fa-envelope fa-2x"></i><br><b>Email</b></button>
							    	</td>
							    	<td>
							    		This button takes you to the Email page and populates any email checkboxes you have selected in the send to field.
							    	</td>
							    </tr>
							     <tr>
							    	<td>
							    		<button class="btn btn-default courseRosterBtn" type="button"><i class="fa fa-table fa-2x"></i><br><b>CSV</b></button>
							    	</td>
							    	<td>
							    		This button generates a csv (excel document) and prompts a download.  Use this button when you need to easily export data for use outside course rosters.
							    	</td>
							    </tr>
							     <tr>
							    	<td>
							    		<button type="button" class="btn btn-default courseRosterBtn"><i class="fa fa-plus-circle fa-lg"></i></button>
							    	</td>
							    	<td>
							    		Use this button to add all students in this roster to the email list.  It will display as the course in the send to field.
							    	</td>
							    </tr>
							    <tr>
							    	<td>
							    		<button type="button" class="btn btn-default courseRosterBtn"><i class="fa fa-plus fa-lg"></i></button>
							    	</td>
							    	<td>
							    		Use this button to add any individual email to the list, whether it be a student, TA, or otherwise.  You cannot add the same email more than once.
							    	</td>
							    </tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>


		</div>
	</div>
</cfoutput>
