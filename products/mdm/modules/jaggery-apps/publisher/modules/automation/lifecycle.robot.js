/*
Description: The class is used to find a path to reach a given state
 */
var robot = function () {

    var utility = require('/modules/utility.js').rxt_utility();
    var datastructuresModule = require('/modules/common/datastructures.js').datastructuresModule();
    var log = new Log();

    function LifeCycleRobot() {
        this.endState = '';
        this.lifecycle = '';
        this.lcMap = {};
        this.directionMap = {};
    }

    LifeCycleRobot.prototype.init = function (options) {
        utility.config(options, this);
        loadLifeCycle(this.lifecycle, this.lcMap);
        processLifeCycle(this.lifecycle, this.lcMap, this.directionMap);
    };

    /*
     The function attempts to move the robot to the provided end state
     */
    LifeCycleRobot.prototype.move = function (lifecycle, fromState, endState) {
        var dirMap = this.directionMap[lifecycle];
        var stack=new datastructuresModule.Stack();
        var path;
        var directions = [];
        var pathArray;
        var from;
        var to;

        path= this.recursiveTravel(fromState, endState, dirMap,stack);

        if (path != null) {

            pathArray = path.toArray();


            for (var index = pathArray.length-1; index > 0; index--) {
                from = pathArray[index];
                to = pathArray[index - 1];
                directions.push({state: pathArray[index], action: chooseAction(from, to, dirMap)});
            }

            directions.push({state:to,action:chooseAction(to,endState,dirMap)});

        }

        return directions;

    };

    /*
     The function recursively travels the direction map looking for a path to achieve the endState
     @fromState: The state in which traversal starts
     @endState: The desired state
     @dirMap: A map describing the paths from state to state
     @pathStack: The path from state to end state
     */
    LifeCycleRobot.prototype.recursiveTravel = function (fromState, endState, dirMap, pathStack) {

        //Check if it is a loop
        if (isPresent(fromState, pathStack)) {
            pathStack.pop();
            return pathStack;
        }
        //We have found the path
        else if (fromState == endState) {
            return pathStack;
        }
        else {
            pathStack.push(fromState);

            //Go through all the nodes to which from is connected
            var connected = getConnectedStates(fromState, dirMap);
            var recursivePath;

            for (var index in connected) {

                recursivePath = this.recursiveTravel(connected[index], endState, dirMap, pathStack);

                //Return the path if the path is not empty
                if ((recursivePath != null) && (pathStack.toArray().length != 0)) {
                    return recursivePath;
                }

            }

            return null;

        }

    };

    /*
     The function processes the lifecycle scxml into a direction map which indicates
     which actions should be executed to reach a given state
     */
    function processLifeCycle(lifecycle, lcMap, directionMap) {
        var raw = lcMap[lifecycle];
        var dirMap = {};
        var ptr = raw.configuration[0].lifecycle[0].scxml[0].state;
        var state;

        for (var index in ptr) {
            state = ptr[index];

            var transitions = state.transition;

            dirMap[state.id] = {};

            for (var transitionIndex in transitions) {

                var transition = transitions[transitionIndex];
                dirMap[state.id][transition.target] = transition.event;
            }

        }

        directionMap[lifecycle] = dirMap;

    }


    /*
     The function loads a lifecycle from the lifecycle directory
     */
    function loadLifeCycle(lifecycleName, map) {
        var file = new File('/config/lifecycles/' + lifecycleName + '.xml');
        file.open('r');
        var data = file.readAll();
        file.close();

        //Convert to an xml
        data = '<?xml version="1.0" encoding="ISO-8859-1"?>' + data;
        var xml = new XML(data);

        //Convert to a json
        data = data.replace('<?xml version="1.0" encoding="ISO-8859-1"?>', '');
        var lcJSON = utility.xml.convertE4XtoJSON(xml);

        map[lifecycleName] = lcJSON;
    }

    /*
     The function checks if two states are connected
     */
    function checkIfStatesConnect(a, b, dirMap) {
        if (!dirMap.hasOwnProperty(a)) {
            return false;
        }

        if (!dirMap[a].hasOwnProperty(b)) {
            return false;
        }

        return dirMap[a][b];
    }

    /*
     The function checks if the state is present in the stack
     */
    function isPresent(state, stack) {
        var array = stack.toArray();

        if (array.indexOf(state) == -1) {
            return false;
        }

        return true;
    }

    /*
     The function returns the connected states to te fromState
     */
    function getConnectedStates(fromState, dirMap) {
        var items = [];
        var map = dirMap;

        if (map.hasOwnProperty(fromState)) {

            for (var index in map[fromState]) {
                if (map[fromState].hasOwnProperty(index)) {
                    items.push(index);
                }

            }

            return items;
        }

        return items;
    }

    /*
     The function determines which action needs to be executed in order to reach a given state
     */
    function chooseAction(fromState, toState, dirMap) {

        if (!dirMap.hasOwnProperty(fromState)) {
            return null;
        }

        if (!dirMap[fromState].hasOwnProperty(toState)) {
            return null;
        }

        return dirMap[fromState][toState];
    }

    return{
        LifeCycleRobot: LifeCycleRobot
    }
};