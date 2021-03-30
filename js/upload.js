/**upload.js
@author: Zac Mason
Last modified: 4/5/20
This script makes a POST request with a
JWT in the X-Auth header
Adapted from code provided by Dr. Sigman and zybooks
*/

function uploadImages() {
    
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
    
    // upload image and store info in database
    $("#uploadBtnUp").click(function() {
        
        // get JWT from local storage
        var token = window.localStorage.getItem("token");
        
        // create FormData object from uploadForm
        var form = new FormData($("#uploadForm")[0]);
        
        // POST to api/images with JWT in x-auth header
        $.ajax({
            url: "/api/images",
            type: "POST",
            headers: { "X-Auth": token },
            data: form,
            processData: false,
            contentType: false,
            success: function() {
                // access home page after 1s to load thumbnail
                setTimeout(function() { displayHome() }, 1000);
            }
        });
        
    });
    
    // access home page
    $('#homeBtnUp').click(function() {
        displayHome();
    });
    
    // sign out of account
    $('#logoutBtnUp').click(function() {
        localStorage.clear();
        location.reload();
    });
    
};