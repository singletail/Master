<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel='stylesheet' href='/s/css/main.css' />
        <title>Cyberpunk.nyc</title>
    </head>

    <body>
        <div class="main_bk">
            &nbsp;
        </div>
        <div class="topbox">
            <span class="msg"><%- data.msg %></span>
        </div>
        <div class="bigbox">
        <form action="/user/update" method="POST">
            <label for="displayName">Name</label>
            <input type="text" id="displayName" name="displayName" value="<%= user.displayName %>">

            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="<%= user.email %>">
            
            <label for="country">Location</label> 
            <input type="text" id="country" name="country" value="<%= user.country %>">

            <button type="submit">Update Profile</button>
        </form>
        </div>  

        <%- include('header') -%>
        <%- include('footer') -%>
    </body>
</html>