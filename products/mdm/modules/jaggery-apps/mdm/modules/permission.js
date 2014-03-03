
var permission = (function () {

    var userModule = require('user.js').user;
    var user;

    var groupModule = require('group.js').group;
    var group;

    var configs = {
        CONTEXT: "/"
    };
    var routes = new Array();
    var log = new Log();
    var db;

    var module = function (dbs) {
        db = dbs;
        user = new userModule(db);
        group = new groupModule(db);
        //mergeRecursive(configs, conf);
    };


    function mergeRecursive(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor == Object) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

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

    var getBackendCookie = function (samlToken) {
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


    function init(pid){
        xacml = <Policy xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17"  PolicyId={pid} RuleCombiningAlgId="urn:oasis:names:tc:xacml:1.0:rule-combining-algorithm:first-applicable" Version="1.0">
            <Target></Target></Policy>;
        return xacml;
    }

    function getRule(resource,action,subject,ruleId){
        var xacml=
            <Rule Effect="Permit" RuleId={ruleId}>
                <Target>
                    <AnyOf>
                        <AllOf>
                            <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-regexp-match">
                                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{resource}</AttributeValue>
                                <AttributeDesignator AttributeId="urn:oasis:names:tc:xacml:1.0:resource:resource-id" Category="urn:oasis:names:tc:xacml:3.0:attribute-category:resource" DataType="http://www.w3.org/2001/XMLSchema#string" MustBePresent="true"></AttributeDesignator>
                            </Match>
                            <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-equal">
                                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{action}</AttributeValue>
                                <AttributeDesignator AttributeId="urn:oasis:names:tc:xacml:1.0:action:action-id" Category="urn:oasis:names:tc:xacml:3.0:attribute-category:action" DataType="http://www.w3.org/2001/XMLSchema#string" MustBePresent="true"></AttributeDesignator>
                            </Match>
                            <Match MatchId="urn:oasis:names:tc:xacml:1.0:function:string-equal">
                                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">{subject}</AttributeValue>
                                <AttributeDesignator AttributeId="urn:oasis:names:tc:xacml:1.0:subject:subject-id" Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject" DataType="http://www.w3.org/2001/XMLSchema#string" MustBePresent="true"></AttributeDesignator>
                            </Match>
                        </AllOf>
                    </AnyOf>
                </Target>
            </Rule>;
        return xacml;
    }


    // prototype
    module.prototype = {
        constructor: module,

        assignPermissionToGroup: function(ctx){
            var log = new Log();
            var group = ctx.selectedGroup;
            if(group.indexOf("Internal")!==-1){
                group = group.substring(9);
            }
            var featureList = ctx.featureList;
            var xacml = null;
            xacml = init(group);
            var featureConcat = "("+featureList[0];
            for(var i = 1; i < featureList.length ; i++){
                featureConcat = featureConcat+"|"+featureList[i];
            }
            featureConcat = featureConcat+")";
            var action = 'POST';
            var subject = group;
            var resource =featureConcat;
            xacml.add = getRule(resource, action, subject,'rule1');

            var file = new File("policy.txt");
            file.open("w+");
            file.write(xacml);
            var xacmlFile = file.readAll();
            file.close();
            var entitlement = require('policy').entitlement;
            try{
                var samlResponse = session.get("samlresponse");
                /*if(typeof samlResponse == 'undefined' || samlResponse == null || samlResponse ==""){
                    return "error";
                }*/
                var saml = require("/modules/saml.js").saml;
                var backEndCookie = saml.getBackendCookie(samlResponse);
                entitlement.setAuthCookie(backEndCookie);
                var entitlementPolicyAdminService = entitlement.setEntitlementPolicyAdminServiceParameters();
                entitlement.removePolicy(group,entitlementPolicyAdminService);
                entitlement.addPolicy(xacmlFile,entitlementPolicyAdminService,group);
            }catch(e){
                log.debug("ERROR :"+e);
            }
            return "success";
        },
        deletePolicy:function(ctx){

        }
    };
    // return module
    return module;
})();