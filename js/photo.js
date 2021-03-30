/**photo.js
@author: Zac Mason
Last modified: 5/7/20
This script posts images to the home page
by retrieving the uploads from the database.
The loadImages function is called when a user
logs into their account, posting the fragment
of the home page to the original index.html
Adapted from code provided by Dr. Sigman
*/

function loadImages() {
    
    // format the date
    function formatDate(data, i) {
        var rawDate = new Date(data[i].upload_date);
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = rawDate.getDate();
        var month = months[rawDate.getMonth()];
        var year = rawDate.getFullYear();
        return month + ' ' + day + ', ' + year;
    };
    
    // get JWT from local storage
    var token = window.localStorage.getItem("token");
    
    // load the image information from the database
    $.get('api/images?u=' + token, (data)=>{
        
        let html = '';
        
        //build a card for each image
        for (var i=data.length - 1; i>=0; i--) {
            
            // create a new row to hold 4 pictures
            if(i % data.length == data.length - 1) {
                html += '<div class="row">'
            }

            html += '<div class="card border mt-3 col-3">\n ' +
                '<img class="img-fluid img-thumbnail" src="../' + 
                data[i].path + "/thumbs/" +
                data[i].filename + '"> \n' + 
                '<div class="card-body">\n' +
                '<h5 class="card-title">' +
                data[i].photo_name + '</h5>\n' +
                '<p class="card-text">' +
                formatDate(data, i) + '</p>\n'+
                '</div>\n</div>'; 

            // close row if filled with 4 pictures
            if(i % data.length == 0) {
                html += '</div>'
            }
        }
        $('#imageArea').html(html);
    });
    
    // access upload page
    $('#uploadBtnHm').click(function() {
        let pageNo = "0814";
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
            uploadImages();
            return false;
        });
    });
    
    // access exhibit page
    $('#exBtnHm').click(function() {
        let pageNo = "1439";
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
            loadExhibits();
            return false;
        });
    });
    
    // sign out of account
    $('#logoutBtnHm').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};