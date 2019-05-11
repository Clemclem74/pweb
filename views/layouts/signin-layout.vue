{% extends "layout.html" %}
{% block content %}

<template>
<div id="login-form">
<h2>Bienvenue dans le formulaire de connexion, il n'est pas encore prêt : </h2>


<form method="POST" action="/user/login" >
        <div class="form-group">
                        <label for="title">Pseudo</label>
                        <input type="text" id="username" name="username" class="form-control">
        </div>

        <div class="form-group">
                <label for="title">Mot de passe</label>
                <input type="password" id="password" name="password" class="form-control">
        </div>
        <hr>
        <input type="submit" class="btn btn-success" value="Save">

</form>

</div>
</template>





{% endblock }