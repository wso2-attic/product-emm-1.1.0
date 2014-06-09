WSO2 Enterprise Mobility Manager (EMM)
----------------------
Welcome to the WSO2 Enterprise Mobility Manager (EMM) 1.1.0 release
=======

Key Features
------------

1.  Self-service device enrollment and management with end-user MDM console
2.  Policy-driven device management for security, data, and device features (Camera, Password Policy)
3.  Deploy policies over-the-air 
4.  Compliance monitoring for reporting, alerting, and device deprovisioning
5.  Role based permissions for device management
6.  Provisioning and deprovisioning applications to enrolled devices
7.  Blacklisting of applications for Android
8.  Supports App management
9.  App approval process through a lifecycle
10. App approval process through a lifecycle
11. Discover mobile apps through an Enterprise App Store
12. Self-provisioning of mobile apps to devices


Installation & Running
----------------------
1. extract the downloaded zip file
2. Run the wso2server.sh or wso2server.bat file in the bin directory
3. Once the server starts, point your Web browser to
   https://localhost:9443/

For more details, see the Installation Guide

System Requirements
-------------------

1. Minimum memory - 2GB
2. Portal app requires full Javascript enablement of the Web browser

For more details see
https://docs.wso2.org/display/EMM110/Prerequisites

Known Issues
------------
EMM Known issues can be found at <a href="https://wso2.org/jira/issues/?filter=11894">https://wso2.org/jira/issues/?filter=11894</a>


WSO2 Enterprise Mobility Manager (EMM) Binary Distribution Directory Structure
-----------------------------------------------------

	EMM_HOME
        .
        ├── bin              //executables
        ├── dbscripts        //DBScripts
        ├── INSTALL.txt
        ├── lib
        ├── LICENSE.txt
        ├── modules          //Jaggery Modules
        ├── README.txt
        ├── release-notes.html
        ├── repository       // repository
        ├── tmp
        ├── webapp-mode


    - bin
      Contains various scripts .sh & .bat scripts.

    - dbscripts
      Contains the database creation & seed data population SQL scripts for
      various supported databases.

    - lib
      Contains the basic set of libraries required to startup Application Server
      in standalone mode

    - repository
      The repository where Carbon artifacts & Axis2 services and
      modules deployed in WSO2 Carbon are stored.
      In addition to this other custom deployers such as
      dataservices and axis1services are also stored.

        - carbonapps
          Carbon Application hot deployment directory.

    	- components
          Contains all OSGi related libraries and configurations.

        - conf
          Contains server configuration files. Ex: axis2.xml, carbon.xml

        - data
          Contains internal LDAP related data.

        - database
          Contains the WSO2 Registry & User Manager database.

        - deployment
          Contains server side and client side Axis2 repositories.
	      All deployment artifacts should go into this directory.

        - logs
          Contains all log files created during execution.

        - resources
          Contains additional resources that may be required.

	- tenants
	  Directory will contain relevant tenant artifacts
	  in the case of a multitenant deployment.

    - tmp
      Used for storing temporary files, and is pointed to by the
      java.io.tmpdir System property.

    - webapp-mode
      The user has the option of running WSO2 Carbon in webapp mode (hosted as a web-app in an application server).
      This directory contains files required to run Carbon in webapp mode.

    - LICENSE.txt
      Apache License 2.0 under which WSO2 Carbon is distributed.

    - README.txt
      This document.

    - INSTALL.txt
      This document contains information on installing WSO2 EMM.
      
    - release-notes.html
      Release information for WSO2 EMM 1.1.0


Support
-------

We are committed to ensuring that your enterprise middleware deployment is completely supported
from evaluation to production. Our unique approach ensures that all support leverages our open
development methodology and is provided by the very same engineers who build the technology.

For additional support information please refer to http://wso2.com/support/

---------------------------------------------------------------------------
(c) Copyright 2014 WSO2 Inc.
