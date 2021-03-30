/**artist.js
@author: Zac Mason
Last modified: 5/11/20
This script is used to add an artist to an exhibit.
Adapted from code provided by Dr. Sigman and zybooks
*/

function addArtist() {
    
    // function to access home page
    function displayHome() {
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
    };
    
    // function to access exhibit home page
    function displayEx() {
        let pageNo = "6599";
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
            loadExImages();
            return false;
        });
    };
    
    // add artist to exhibit and store info in database
    $("#addBtn").click(function() {

        // get JWT from local storage
        var token = window.localStorage.getItem("token");
        
        // get exhibitId from local storage
        var exId = window.localStorage.getItem("exId");
        
        // get the form data to send
        var form = $("#artistForm").serialize();
        
        // POST to api/artists with JWT in x-auth header and exhibitId in x-id header
        $.ajax({
            url: "/api/artists",
            type: "POST",
            headers: {
                "X-Auth": token,
                "X-Id": exId
            },
            data: form,
            success: function() {
                // access exhibit home page to load thumbnail
                displayEx();
            }
        });
        
    });
    
    // access home page
    $('#homeBtnEx').click(function() {
        displayHome();
    });
    
    // access exhibit home page
    $('#exHomeBtnEx').click(function() {
        displayEx();
    });
    
    // sign out of account
    $('#logoutBtnEx').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};