/**exhibit.js
@author: Zac Mason
Last modified: 5/10/20
This script posts exhibits to the exhibit
home page by retrieving the information from 
the database. The loadExImages function is called when a user
logs into their account, posting the fragment
of the home page to the original index.html
Adapted from code provided by Dr. Sigman
*/

function loadExhibits() {
    
    // format the date
    function formatDate(myAttr) {
        var rawDate = new Date(myAttr);
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = rawDate.getDate();
        var month = months[rawDate.getMonth()];
        var year = rawDate.getFullYear();
        return month + ' ' + day + ', ' + year;
    };
    
    // get JWT from local storage
    var token = window.localStorage.getItem("token");
    
    // load the exhibit information from the database
    $.get('api/exhibits?u=' + token, (data)=>{
        
        let html = '';
        
        //build a card for each exhibit
        for (var i=data.length - 1; i>=0; i--) {
            
            // create a new row to hold 4 cards
            if(i % data.length == data.length - 1) {
                html += '<div class="row">'
            }
            
            for (var j=data[i].length - 1; j >= 0; j--) {
                // store the exhibitId when creating the exhibit button
                html += '<div class="card border mt-3 col-3">\n ' +
                    '<div class="card-body" align="center">\n' +
                    '<h5 class="card-title">' +
                    data[i][j].description + '</h5>\n' +
                    '<p class="card-text">' +
                    formatDate(data[i][j].start_date) + '</p>\n'+
                    '<p class="card-text">' +
                    formatDate(data[i][j].end_date) + '</p>\n'+
                    '<input id="usrExBtn-' + data[i][j].exhibitId + '" class="btn" type="button" value="View exhibit">\n' +
                    '</div>\n</div>'; 
            }

            // close row if filled with 4 cards
            if(i % data.length == 0) {
                html += '</div>'
            }
        }
        $('#exhibitArea').html(html);
    });
    
    // access home page
    $('#homeBtnExHm').click(function() {
        let pageNo = "4962";
        let token = window.localStorage.getItem("token");
        $.ajax({
            url: "/api/page?pageid=" + pageNo,
            type: "GET",
            headers: { "X-Auth": token },
            statusCode: {
                401: (resObj, textStatus, jqXHR) => {
                    alert("Not authorized to access page");
                },
                404: (resObj, textStatus, jqXHR) => {
                    alert("Page not found");
                }
            }
        })
        .fail((jqXHR) => {
            if ((jqXHR.status != 401) || jqXHR.status != 404) {
                alert("Server error");
            }
        })
        .done((data) => {
            data = data.trim();
            $("#main").html(data);
            loadImages();
            return false;
        });
    });
    
    // access create exhibit page
    $('#exBtnExHm').click(function() {
        let pageNo = "7228";
        let token = window.localStorage.getItem("token");
        $.ajax({
            url: "/api/page?pageid=" + pageNo,
            type: "GET",
            headers: { "X-Auth": token },
            statusCode: {
                401: (resObj, textStatus, jqXHR) => {
                    alert("Not authorized to access page");
                },
                404: (resObj, textStatus, jqXHR) => {
                    alert("Page not found");
                }
            }
        })
        .fail((jqXHR) => {
            if ((jqXHR.status != 401) || jqXHR.status != 404) {
                alert("Server error");
            }
        })
        .done((data) => {
            data = data.trim();
            $("#main").html(data);
            createExhibit();
            return false;
        });
    });
    
    // access user exhibit
    $(document).on("click", "[id^='usrExBtn']", function() {
        // get id of selected exhibit to pass in header
        var exId = this.id.split('-')[1];
        window.localStorage.setItem("exId", exId);

        let pageNo = "6599";
        let token = window.localStorage.getItem("token");
        $.ajax({
            url: "/api/page?pageid=" + pageNo,
            type: "GET",
            headers: { 
                "X-Auth": token,
                "X-Id": exId
            },
            statusCode: {
                401: (resObj, textStatus, jqXHR) => {
                    alert("Not authorized to access page");
                },
                404: (resObj, textStatus, jqXHR) => {
                    alert("Page not found");
                }
            }
        })
        .fail((jqXHR) => {
            if ((jqXHR.status != 401) || jqXHR.status != 404) {
                alert("Server error");
            }
        })
        .done((data) => {
            data = data.trim();
            $("#main").html(data);
            loadExImages();
            return false;
        });
    });
    
    // sign out of account
    $('#logoutBtnExHm').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};