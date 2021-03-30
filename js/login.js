/**login.js
@author: Zac Mason
Last modified: 4/5/20
This script verifies login information and
saves a corresponding JWT
The JWT is used to grant access to the site
Adapted from code provided by Dr. Sigman and zybooks
*/

// POST to api/auth with user submitted uid and password
$(function() {
    
    function login(uid, password) {
        var requestData = { uid: uid,
                           password: password };
        $.post("/api/auth", requestData, function(data) {
            if (data.token) {
                
                // save the JWT in local storage
                window.localStorage.setItem("token", 
                data.token);
                
                // reveal button to access home page
                $("#hideHome").show();
            };
        });
    };
    
    // call login with uid and password fields
    $("#loginButton").click(function() {
        login($("#uid").val(), $("#password").val());
        $("#sem-login").modal("toggle"); // close modal after submit
    });

    // enter site after successful login
    $("#homeBtnIn").click(function() {
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
});