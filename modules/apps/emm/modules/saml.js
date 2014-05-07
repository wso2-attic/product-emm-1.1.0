var saml = saml || {};
(function () {
    var SAML_RESPONSE_TOKEN_SESSION_KEY = "SAML_TOKEN";
    var SAML_ASSERTION_TOKEN_SESSION_KEY = "SAML_ASSERTION_TOKEN";
    var SSO_NAME = "SSORelyingParty.Name";

    var getToken = function (){
        if(session.get(SAML_RESPONSE_TOKEN_SESSION_KEY)){
            return session.get(SAML_RESPONSE_TOKEN_SESSION_KEY);
        } else if(session.get(SAML_ASSERTION_TOKEN_SESSION_KEY)){
            return session.get(SAML_ASSERTION_TOKEN_SESSION_KEY);
        } else {
            return null;
        }
    };

    saml.getBackendCookie = function (samlToken) {
        var token = getToken();
        var token = null;
        var encodedToken = token && token.replace(/>/g, '&gt;').replace(/</g,'&lt;');
        var xhr = new XMLHttpRequest();
        xhr.setRequestHeader('SOAPAction', 'urn:login');
        xhr.setRequestHeader('Content-Type', 'application/soap+xml');
        var endPoint = "https://localhost:9443/admin/services/"+"SAML2SSOAuthenticationService";
        xhr.open("POST", endPoint);
        var payload = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:sso="http://sso.saml2.authenticator.identity.carbon.wso2.org" xmlns:xsd="http://dto.sso.saml2.authenticator.identity.carbon.wso2.org/xsd"><soap:Header/><soap:Body><sso:login><sso:authDto><xsd:response>'+samlToken+'</xsd:response></sso:authDto></sso:login></soap:Body></soap:Envelope>';
        xhr.send(payload);
        var cookieString = xhr.getResponseHeader("Set-Cookie");
        return cookieString;
    };
}());

