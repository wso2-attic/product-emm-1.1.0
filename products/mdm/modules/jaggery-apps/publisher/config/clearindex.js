(function(){
    var sso_sessions = application.get('sso_sessions'),
        l = new Log();
    l.debug("session deleting :: " + session.getId() + " :: " + sso_sessions[session.getId()]);
    delete sso_sessions[session.getId()];
    //l.debug("sessions :: " + stringify(sso_sessions));
}());