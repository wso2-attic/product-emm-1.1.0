/*
 * Copyright (c) 2010, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.wso2.mobile.utils.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.apache.xmlbeans.SystemProperties;
import org.wso2.carbon.ndatasource.core.DataSourceService;
import org.wso2.mobile.utils.persistence.JDBCPersistenceManager;


/**
 * @scr.component name="emm.utils.service.component" immediate="true"
 * @scr.reference name="datasources.service" interface="org.wso2.carbon.ndatasource.core.DataSourceService"
 * cardinality="1..1" policy="dynamic" bind="setDataSourceService" unbind="unsetDataSourceService"
 **/

/**
 * 
 * This class is the osgi service class for EMMUtilsService. It will checks whether the user has provided
 *  -Dsetup argument during startup and if so it initialize to create the EMM db.
 *  
 */

public class EMMUtilsServiceComponent {

    public static final String DSETUP_PATTERN = ".*-Dsetup.*";
    public static final String SUN_JAVA_CMD = "sun.java.command";
    public static final String EMM_DB_NAME = "WSO2_EMM_DB";

    private static final Log log = LogFactory.getLog(EMMUtilsServiceComponent.class);

    protected void activate(ComponentContext ctx) {
        try {
            String cmd = SystemProperties.getProperty(SUN_JAVA_CMD);
            if(isDatabaseSetupActivated(cmd)){
            	log.info("Creating EMM DB setup ...");
                JDBCPersistenceManager jdbcPersistenceManager = JDBCPersistenceManager.getInstance();
                jdbcPersistenceManager.initializeDatabase();                
            }
        } catch (Throwable e) {
            log.error(e.getMessage(), e);
        }
    }

    protected void deactivate(ComponentContext ctx) {
        log.debug("EMM-Util bundle is deactivated ");
    }

    private boolean isDatabaseSetupActivated(String cmd){
        return cmd.matches(DSETUP_PATTERN);
    }

    protected void setDataSourceService(DataSourceService dataSourceService) {
        if (log.isDebugEnabled()) {
            log.debug("Setting the DataSourceService");
        }
        JDBCPersistenceManager.setCarbonDataSourceService(dataSourceService);
    }

    protected void unsetDataSourceService(DataSourceService dataSourceService) {
        if (log.isDebugEnabled()) {
            log.debug("Unsetting the DataSourceService");
        }
        JDBCPersistenceManager.setCarbonDataSourceService(null);
    }

}
