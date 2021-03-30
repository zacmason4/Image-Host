/**exupload.js
@author: Zac Mason
Last modified: 5/11/20
This script is used to add a photo to an exhibit
Adapted from code provided by Dr. Sigman and zybooks
*/

function addPhoto() {

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
    
    // add image and store info in database
    $("#addImgBtn").click(function() {

        // get JWT from local storage
        var token = window.localStorage.getItem("token");
        
        // get exhibitId from local storage
        var exId = window.localStorage.getItem("exId");
        
        // get the form data to send
        var form = $("#exImageForm").serialize();
        
        // POST to api/exImages with JWT in x-auth header
        $.ajax({
            url: "/api/eximages",
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
    $('#homeBtnExUp').click(function() {
        displayHome();
    });
    
    // access exhibit home page
    $('#exHomeBtnExUp').click(function() {
        displayEx();
    });
    
    // sign out of account
    $('#logoutBtnExUp').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};