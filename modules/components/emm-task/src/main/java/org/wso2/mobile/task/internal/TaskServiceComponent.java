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

package org.wso2.mobile.task.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.service.component.ComponentContext;
import org.wso2.carbon.ntask.core.service.TaskService;
import org.wso2.carbon.ntask.core.TaskManager;
import org.wso2.carbon.ntask.core.TaskInfo.TriggerInfo;
import org.wso2.carbon.ntask.core.TaskInfo;
import org.wso2.mobile.task.utils.EMMTaskConfig;
import java.util.HashMap;

/**
 * @scr.component name="mobile.task.taskservicecomponent" immediate="true"
 * @scr.reference name="ntask.component" interface="org.wso2.carbon.ntask.core.service.TaskService"
 * cardinality="1..1" policy="dynamic" bind="setTaskService" unbind="unsetTaskService"
 **/

public class TaskServiceComponent {
    private static final Log log = LogFactory.getLog(TaskServiceComponent.class);
    private static TaskService taskService;

    /*
      This function creates the Device monitor task
    */
    protected void activate(ComponentContext ctxt) {
        try {

            /* register the data service task type */
            getTaskService().registerTaskType(EMMTaskConfig.TASK_MANAGER_NAME);
            if (log.isDebugEnabled()) {
                log.debug("Task Schedule bundle is activated ");
            }
            TaskManager taskManager = getTaskService().getTaskManager(EMMTaskConfig.TASK_MANAGER_NAME);
            //String deviceMonitorFreq = EMMTaskConfig.getConfigEntry(EMMTaskConfig.DEVICE_MONITOR_FREQUENCY);
            int monitorFreq = Integer.parseInt(EMMTaskConfig.getConfigEntry(EMMTaskConfig.DEVICE_MONITOR_FREQUENCY));
            if (monitorFreq != 0) {

                TriggerInfo triggerInfo = new TriggerInfo();
                triggerInfo.setIntervalMillis(monitorFreq);
                triggerInfo.setRepeatCount(-1);
                TaskInfo taskInfo = new TaskInfo();
                taskInfo.setName(EMMTaskConfig.TASK_NAME);
                taskInfo.setTaskClass(EMMTaskConfig.TASK_MONITOR_CLASS);
                taskInfo.setTriggerInfo(triggerInfo);

                taskManager.registerTask(taskInfo);
                taskManager.rescheduleTask(taskInfo.getName());
            } else {
                taskManager.deleteTask(EMMTaskConfig.TASK_NAME);
            }
        } catch (Throwable e) {
            log.error(e.getMessage(), e);
            /* don't throw exception */
        }

    }

    protected void deactivate(ComponentContext ctxt) {
        log.debug("Task Schedule bundle is deactivated ");
    }

    protected void setTaskService(TaskService taskService) {
        if (log.isDebugEnabled()) {
            log.debug("Setting the Task Service");
        }
        TaskServiceComponent.taskService = taskService;
    }

    protected void unsetTaskService(TaskService taskService) {
        if (log.isDebugEnabled()) {
            log.debug("Unsetting the Task Service");
        }
        TaskServiceComponent.taskService = null;
    }

    public static TaskService getTaskService() {
        return TaskServiceComponent.taskService;
    }
}
