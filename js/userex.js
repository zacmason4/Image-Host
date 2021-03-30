/**userex.js
@author: Zac Mason
Last modified: 5/9/20
This script loads a user's exhibit
Adapted from code provided by Dr. Sigman
*/

function loadExImages() {
    
    // format the date
    function formatDate(data, i, j) {
        var rawDate = new Date(data[i][j].upload_date);
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day = rawDate.getDate();
        var month = months[rawDate.getMonth()];
        var year = rawDate.getFullYear();
        return month + ' ' + day + ', ' + year;
    };
    
    // get JWT from local storage
    var token = window.localStorage.getItem("token");
    
    // get exhibitId from local storage
    var exId = window.localStorage.getItem("exId");
    
    // load the exhibit information from the database
    $.get('api/eximages?u=' + token + '&id=' + exId, (data)=>{
        
        let html = '';
        
        //build a card for each image
        for (var i=data.length - 1; i>=0; i--) {
            
            // create a new row to hold 4 pictures
            if(i % data.length == data.length - 1) {
                html += '<div class="row">'
            }
            for (var j=data[i].length - 1; j >= 0; j--) {
                html += '<div class="card border mt-3 col-3">\n ' +
                    '<img class="img-fluid img-thumbnail" src="../' + 
                    data[i][j].path + "/thumbs/" +
                    data[i][j].filename + '"> \n' + 
                    '<div class="card-body">\n' +
                    '<h5 class="card-title">' +
                    data[i][j].photo_name + '</h5>\n' +
                    '<p class="card-text">' +
                    formatDate(data, i, j) + '</p>\n'+
                    '</div>\n</div>'; 
            }
            
            // close row if filled with 4 pictures
            if(i % data.length == 0) {
                html += '</div>'
            }
        }
        $('#imageArea').html(html);
    });
    
    // access home page
    $('#homeBtnExUsr').click(function() {
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
    
    // access exhibit home page
    $('#exBtnExUsr').click(function() {
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
    
    // access add artist page
    $('#artBtnExUsr').click(function() {
        let pageNo = "4447";
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
            addArtist();
            return false;
        });
    });
    
    // access add photo page
    $('#imgBtnExUsr').click(function() {
        let pageNo = "9233";
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
            addPhoto();
            return false;
        });
    });
    
    // sign out of account
    $('#logoutBtnExHm').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};