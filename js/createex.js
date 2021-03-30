/**createex.js
@author: Zac Mason
Last modified: 5/9/20
This script is used to create a new exhibit
Adapted from code provided by Dr. Sigman and zybooks
*/

function createExhibit() {

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
    };
    
    // create exhibit and store info in database
    $("#uploadBtnEx").click(function() {
        
        // get JWT from local storage
        var token = window.localStorage.getItem("token");
        
        // get the form data to send
        var form = $("#createExForm").serialize();
        
        // POST to api/exhibits with JWT in x-auth header
        $.ajax({
            url: "/api/exhibits",
            type: "POST",
            headers: { "X-Auth": token },
            data: form,
            success: function() {
                // access exhibit home page
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