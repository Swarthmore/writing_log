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
			var buildHTML = '<tr class="' + className + ' userRow">';
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
			for ( userId in this.users ){
				buildHTML += '<tr class="' + ((i % 2 == 0) ? 'even' : 'odd') + '"><td><div>' + this.users[userId].username + "</div></td></tr>\n"
				i++;
			}
			return buildHTML + "</tbody></table></div>\n";
		};
		this.gridHTML = function(){
			var buildHTML = this.gridUserHTML() + '<div id="userDataGrid"><table><tbody>' + this.gridMonthHTML() + this.gridDayHTML();
			var i = 0;
			for ( userId in this.users ){
				buildHTML += this.gridUserDataHTML(userId, ((i % 2 == 0) ? 'even' : 'odd'));
				i++;
			}
			
			return buildHTML + "</tbody></table></div>\n";
		};
		this.setEvents = function(gridContainer) {
			var commentClass, commentNum; 
			for (userId in this.users){
				for (dateStr in this.users[userId].data){
					jQuery('.event-' + userId + '-' + dateStr + ' div', gridContainer).html('<a href="' + this.users[userId].data[dateStr].url + '" title="' + this.users[userId].data[dateStr].title + '"><span class="user-posting">X</span></a>');
					if (parseInt(this.users[userId].data[dateStr].comments, 10) > 0){
						if (parseInt(this.users[userId].data[dateStr].newComments, 10) > 0){
							commentClass = 'new-comments';
							commentNum = this.users[userId].data[dateStr].newComments;
						} else {
							commentClass = 'comments';
							commentNum = this.users[userId].data[dateStr].comments;
						}
						jQuery('.event-' + userId + '-' + dateStr + ' div a', gridContainer).html('<span class="' + commentClass + '">' + commentNum + "</span>");
					}
					if (this.users[userId].data[dateStr].nid == currNid){
						jQuery('.event-' + userId + '-' + dateStr, gridContainer).addClass("current");
					}
				}
			}
		};
		this.first = this.dateToString(new Date());
		this.today = this.dateToString(new Date());
		this.gridStart = this.first;
		this.gridEnd = this.setGridEnd();
		this.users = {};
		this.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	}
	if (calGrid.length){
		var calData = new calBuilder();
		jQuery.getJSON(Drupal.settings.basePath + 'json_data_feed', function(data){
			var nodeIndex = 0;
			var thisNode;
			for (nodeIndex in data.nodes){
				thisNode = data.nodes[nodeIndex].node;
				var postDate = calData.feedDateToString(thisNode.field_date);
				if (postDate < calData.first){
					calData.first = postDate;
				}
				var postTitle = thisNode.title;
				var postUrl = Drupal.settings.basePath + 'node/' + thisNode.nid;
				var postUser = (thisNode["Display Name"].length) ? thisNode["Display Name"] : thisNode.name;
				if (calData.users[thisNode.uid] == undefined){
					calData.users[thisNode.uid] = {};
					calData.users[thisNode.uid].data = {};
				}
				calData.users[thisNode.uid].username = postUser;
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
			calData.setGridStart();
			calGrid.html(calData.gridHTML());
			calData.setEvents(calGrid);
			//scroll today into view
			var firstVisTd = 0;
			if (jQuery('#userDataGrid td.current').length){
				var rowCheck = jQuery('#userDataGrid td.current:first').parent();
				var classCheck = 'current';
				var cellOffest = 13;
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
		});
	}
});