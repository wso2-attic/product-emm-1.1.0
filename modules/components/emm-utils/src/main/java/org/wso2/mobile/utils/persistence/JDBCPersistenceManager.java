/*
*Copyright (c) 2005-2010, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
*WSO2 Inc. licenses this file to you under the Apache License,
*Version 2.0 (the "License"); you may not use this file except
*in compliance with the License.
*You may obtain a copy of the License at
*
*http://www.apache.org/licenses/LICENSE-2.0
*
*Unless required by applicable law or agreed to in writing,
*software distributed under the License is distributed on an
*"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
*KIND, either express or implied.  See the License for the
*specific language governing permissions and limitations
*under the License.
*/

package org.wso2.mobile.utils.persistence;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.ndatasource.core.DataSourceService;
import org.wso2.carbon.ndatasource.core.CarbonDataSource;
import org.wso2.mobile.utils.internal.EMMUtilsServiceComponent;

/**
 * This class is used for creating EMM database. During
 * the server start-up, it checks whether the user has provided -Dsetup argument and if so it creates the db.
 * This is implemented as a singleton. An instance of this class can be obtained through
 * JDBCPersistenceManager.getInstance() method.
 */
public class JDBCPersistenceManager {

    private static Log log = LogFactory.getLog(JDBCPersistenceManager.class);
    private static JDBCPersistenceManager instance;
    private static DataSourceService carbonDataSourceService;

    private JDBCPersistenceManager() {

    }

    public static DataSourceService getCarbonDataSourceService() {
        return carbonDataSourceService;
    }

    public static void setCarbonDataSourceService(
            DataSourceService dataSourceService) {
        carbonDataSourceService = dataSourceService;
    }

	public static JDBCPersistenceManager getInstance() throws Exception {
		if (instance == null) {
			synchronized (JDBCPersistenceManager.class) {
				if (instance == null) {
					instance = new JDBCPersistenceManager();
				}
			}
		}
		return instance;
	}

    public void initializeDatabase() throws Exception {
        CarbonDataSource cds = carbonDataSourceService.getDataSource(EMMUtilsServiceComponent.EMM_DB_NAME);
        DataSource dataSource = (DataSource) cds.getDSObject();
        EMMDBInitializer dbInitializer = new EMMDBInitializer(dataSource);
        try {
           dbInitializer.createEMMDatabase();
        } catch (Exception e) {
            String msg = "Error when creating the EMM database";
            log.debug(msg);
            throw new Exception(msg, e);
        }
    }
}
