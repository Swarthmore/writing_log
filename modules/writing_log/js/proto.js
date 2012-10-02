jQuery(document).ready(function(){
	var calGrid = jQuery('#writing-events');
	var newdateObj = new Date();
	var bodyClass = jQuery('body').attr('class');
	var currNid = parseInt('0' + bodyClass.replace(/^.*page\-node\-([0-9]+).*$/, "$1"), 10);
	function calBuilder(){
		this.dateToString = function(dateObj){
			var thisMonth = (dateObj.getMonth() + 1 < 10) ? '0' + (dateObj.getMonth() + 1 ).toString() : (dateObj.getMonth() + 1 ).toString();
			var thisDay = (dateObj.getDate() < 10) ? '0' + dateObj.getDate().toString() : dateObj.getDate().toString();
			return dateObj.getFullYear().toString() + thisMonth + thisDay;
		};
		this.dateToObj = function(dateStr, dayOffset, monthOffset){ //use to generate new date (add and subtract days)
			if (dayOffset == null){
				dayOffset = 0;
			}
			if (monthOffset == null){
				monthOffset = 0;
			}
			var dateParts = dateStr.match(/^([0-9]{4})\-?([0-9]{2})\-?([0-9]{2}).*$/);
			return new Date(parseInt(dateParts[1], 10), (parseInt(dateParts[2], 10) - 1 + monthOffset), (parseInt(dateParts[3], 10) + dayOffset)); 
		};
		this.feedDateToString = function(feedDate){
			var dateParts = feedDate.match(/^([0-9]{4})\-([0-9]{2})\-([0-9]{2}).*$/);
			return dateParts[1] + dateParts[2] + dateParts[3];
		};
		this.setGridStart = function(){
			this.gridStart = this.first.replace(/^([0-9]{6}).+$/, "$1" + '01');
		};
		this.setGridEnd = function(){
			return this.dateToString(this.dateToObj(this.today.replace(/^([0-9]{6}).+$/, "$1" + '01'), 0, 1));
		};
		this.incDay = function(dateStr){
			return this.dateToString(this.dateToObj(dateStr, 1));
		};
		this.gridMonthHTML = function(){
			var currMonth = parseInt(this.gridStart.replace(/^[0-9]{4}([0-9]{2})[0-9]{2}$/, "$1"), 10) - 1;
			//var currHeader = this.monthNames[currMonth];
			var buildHTML = '<tr class="monthRow">';
			var colCount = 0;
			var currDate = this.gridStart;
			while (currDate < this.gridEnd) {
				if (currMonth != parseInt(currDate.replace(/^[0-9]{4}([0-9]{2})[0-9]{2}$/, "$1"), 10) - 1){
					buildHTML += '<td colspan="' + colCount + '"><div>' + this.monthNames[currMonth] + "</div></td>\n";
					currMonth = parseInt(currDate.replace(/^[0-9]{4}([0-9]{2})[0-9]{2}$/, "$1"), 10) - 1;
					colCount = 0;
				}
				colCount++;
				currDate = this.incDay(currDate);
			}
			return buildHTML + '<td colspan="' + colCount + '"><div>' + this.monthNames[currMonth] + "</div></td></tr>\n";
		};
		this.gridDayHTML = function(){ 
			var dayHTML = '<tr class="dayRow">';
			var currDate = this.gridStart;
			var classes, dayNum;
			while (currDate < this.gridEnd) {
				classes = '';
				if (this.today == currDate){
					classes += 'today';
				}
				dayNum = parseInt(currDate.replace(/^[0-9]{4}[0-9]{2}([0-9]{2})$/, "$1"), 10);
				if (dayNum == 1){
					classes += ' first';
				}
				dayHTML += '<td' + ((classes.length) ? ' class="' + jQuery.trim(classes) + '"': '') + '><div>' + dayNum + "</div></td>\n";
				currDate = this.incDay(currDate);
			}
			return dayHTML + "</tr>\n";
		};
		this.gridUserDataHTML = function(userId, className){
			var buildHTML = '<tr class="' + className + ' userRow userRow-' + userId + '">';
			var currDate = this.gridStart;
			while (currDate < this.gridEnd) {
				buildHTML += '<td class="' + ((this.today == currDate) ? 'today ': '') + 'event-' + userId + '-' + currDate + '"><div>' + "</div></td>\n";
				currDate = this.incDay(currDate);
			}
			return buildHTML + "</tr>\n";
		};
		this.gridUserHTML = function(){
			var buildHTML = '<div id="userGrid"><table><tbody><tr class="monthRow"><td><div>&nbsp;</div></td></tr><tr class="dayRow"><td><div>Participants</div></td></tr>';
			var i = 0;
			for ( index in this.userOrder ){
				buildHTML += '<tr class="' + ((i % 2 == 0) ? 'even' : 'odd') + '"><td><div><a href="' + Drupal.settings.basePath + 'view-entries/' + this.userOrder[index].uid + '" title="View All Entries">' + this.users[this.userOrder[index].uid].username + "</a></div></td></tr>\n"
				i++;
			}
			return buildHTML + "</tbody></table></div>\n";
		};
		this.gridHTML = function(){
			var buildHTML = this.gridUserHTML() + '<div id="userDataGrid"><table><tbody>' + this.gridMonthHTML() + this.gridDayHTML();
			var i = 0;
			for ( index in this.userOrder ){
				buildHTML += this.gridUserDataHTML(this.userOrder[index].uid, ((i % 2 == 0) ? 'even' : 'odd'));
				i++;
			}
			
			return buildHTML + "</tbody></table></div>\n";
		};
		this.setEvents = function(gridContainer) {
			var commentClass, commentNum; 
			for (userId in this.users){
				for (dateStr in this.users[userId].data){
					jQuery('.event-' + userId + '-' + dateStr + ' div', gridContainer).html('<a href="' + this.users[userId].data[dateStr].url + '" title="' + this.users[userId].data[dateStr].title + '" class="user-entry"><span>View Entry</span></a>');
					if (parseInt(this.users[userId].data[dateStr].comments, 10) > 0){
						if (parseInt(this.users[userId].data[dateStr].newComments, 10) > 0){
							commentClass = 'new-comments';
							commentNum = this.users[userId].data[dateStr].newComments;
						} else {
							commentClass = 'comments';
							commentNum = this.users[userId].data[dateStr].comments;
						}
						jQuery('.event-' + userId + '-' + dateStr + ' div a', gridContainer).addClass(commentClass).html('<span>' + commentNum + "</span>");
					}
					if (this.users[userId].data[dateStr].nid == currNid){
						jQuery('.event-' + userId + '-' + dateStr, gridContainer).addClass("current");
					}
				}
				if (userId == this.loggedIn){
					var dateParam, today = this.today;
					jQuery('.userRow-' + userId + ' td div').each(function(){
						if (!jQuery(this).html().length){
						    dateParam = jQuery(this).parent().attr('class').replace(/^.+\-([0-9]+)$/, "$1");
							if (dateParam <= today){
								jQuery(this).html('<a href="' + Drupal.settings.basePath + 'node/add/writing-event/' + dateParam + '" title="Add Entry" class="add-new-entry"><span>Add</span></a>');
							}
						}
					});
				}
			}
		};
		this.first = this.dateToString(new Date());
		this.today = this.dateToString(new Date());
		this.gridStart = this.first;
		this.gridEnd = this.setGridEnd();
		this.users = {};
		this.userOrder = [];
		this.loggedIn = Drupal.settings.writing_log.uid;
		this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	}
	
	function calUserSort(s, t){
		var a = s.username.replace(/^[^\s]+ (.+)$/, "$1"); 
		var b = t.username.replace(/^[^\s]+ (.+)$/, "$1"); 
		if (a < b) return -1; 
		if (a > b) return 1; 
		return 0;
	}
	
	if (calGrid.length){
		var calData = new calBuilder();
		//jQuery.getJSON(Drupal.settings.basePath + 'json_data_feed', function(data){ 
		//js now included in the page, faster!
		if (window.gridEntryData !== undefined){
			var nodeIndex = 0;
			var thisNode;
			for (nodeIndex in gridEntryData.nodes){
				thisNode = gridEntryData.nodes[nodeIndex].node;
				var postDate = calData.feedDateToString(thisNode.field_date);
				if (postDate < calData.first){
					calData.first = postDate;
				}
				var postTitle = thisNode.title;
				var postUrl = Drupal.settings.basePath + 'node/' + thisNode.nid;
				var postUser = (thisNode["Display Name"].length) ? thisNode["Display Name"] : thisNode.name;
				if (calData.users[thisNode.uid] == undefined){
					calData.users[thisNode.uid] = {
						data: {},
						username: postUser,
						uid: thisNode.uid
					};
					calData.userOrder.push(calData.users[thisNode.uid]);
				}
				if (calData.users[thisNode.uid].data[postDate] == undefined){
					calData.users[thisNode.uid].data[postDate] = {
						'title': postTitle,
						'url': postUrl,
						'nid' : thisNode.nid,
						'username': postUser,
						'uid': thisNode.uid,
						'comments': thisNode.comment_count,
						'newComments': thisNode.new_comments
					};
				}
			}
			if (window.gridUserData !== undefined){ //sort by last name & add users
				var userObj;
				for (index in gridUserData.users){
					userObj = gridUserData.users[index].user;
					if (calData.users[userObj.uid] == undefined){
						calData.users[userObj.uid] = {
							data: {},
							username: userObj.name,
							uid: userObj.uid
						};
						calData.userOrder.push(calData.users[userObj.uid]);
					}
				}
				calData.userOrder = calData.userOrder.sort(calUserSort);
			}
			calData.setGridStart();
			calGrid.html(calData.gridHTML());
			calData.setEvents(calGrid);
			//scroll today into view
			var firstVisTd = 0;
			if (jQuery('#userDataGrid td.current').length){
				var rowCheck = jQuery('#userDataGrid td.current:first').parent();
				var classCheck = 'current';
				var cellOffest = 12;
			} else {
				var rowCheck = jQuery('#userDataGrid .dayRow');
				var classCheck = 'today';
				var cellOffest = 22;
			}
			rowCheck.find('td').each(function(index){
				if (jQuery(this).hasClass(classCheck) ){
					if (index > cellOffest) {
						firstVisTd = index - cellOffest;
					}
				}
			});
			var scrollPos = rowCheck.find('td:eq(' + firstVisTd + ')').offset().left - jQuery('#userDataGrid').offset().left;
			jQuery('#userDataGrid').scrollLeft(scrollPos);
		} else {
			//remove the Grid, no data
			calGrid.parent().remove();
		}
	}
});