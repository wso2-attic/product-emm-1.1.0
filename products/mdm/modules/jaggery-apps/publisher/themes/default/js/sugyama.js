var sugyamaModule = function () {

    function Matrix(map) {
        this.matrix = map || {};
    }

    function Level(index) {
        this.index = index;
        this.vertices = [];
    }

    function LevelMap() {
        this.map = {};
    }


    /*
     The function adds a given a vertex to a provided depth
     */
    LevelMap.prototype.add = function (vertex, level) {
        //Construct the key which will be used to retrieve the level
        var level = getLevel(level);

        //Create a new depth for it
        if (!this.map.hasOwnProperty([level])) {
            this.map[level] = [];
        }

        //this.map['l' + depth].push(vertex);
        this.map[level].push(new Node(vertex));


        return this.map;
    }

    /*
     The function returns the depth key based on the provided depth
     @depth: The depth of the level
     @return: The id
     */
    function getLevel(level) {
        return 'l' + level;
    }

    /*
     The function returns a list of nodes present in a given level
     @level: The level to be inspected
     @return: An array of nodes in a given level
     */
    LevelMap.prototype.get = function (level) {

        level = getLevel(level);
        var nodes

        //Check if a level exists
        if (this.map.hasOwnProperty(level)) {
            nodes = this.map[level];
            return getNodeIds(nodes);
        }
        return [];
    }

    /*
     The function returns all of the node ids in a given node list
     stored by the level map
     */
    function getNodeIds(nodes) {
        var nodeIds = [];

        //Go through each index in the nodes
        for (var index in nodes) {

            nodeIds.push(nodes[index].label);
        }

        return nodeIds;
    }

    /*
     The function returns all of the nodes in a given level
     */
    LevelMap.prototype.getNodesInLevel = function (level) {
        var level = getLevel(level);
        var nodes = [];

        if (this.map.hasOwnProperty(level)) {
            nodes = this.map[level];
        }

        return nodes;
    };

    LevelMap.prototype.count = function () {
        var counter = 0;

        for (var key in this.map) {
            counter++;
        }

        return counter;
    }

    LevelMap.prototype.show = function () {
        for (var key in this.map) {
           // console.log(key + ' ' + JSON.stringify(this.map[key]));
        }
    };

    /*
     The function is used to create pseudo paths between nodes
     which are not in opposite levels
     */
    LevelMap.prototype.createPseudoPaths = function (matrix) {
        var from;
        var to;

        for (var index in matrix) {
            from = index;

            for (var indexTwo in matrix[from]) {

                to = indexTwo;

                if (matrix[from][indexTwo] == 1) {

                    this.addPseudoPath(from, to);

                }
            }
        }
    };

    /*
     The function is used to add fake nodes to the level map to create
     paths between nodes that are not opposite one another
     */
    LevelMap.prototype.addPseudoPath = function (start, end) {
        var nodes;
        var distance = 0;
        var startLevel = this.getLevelOfNode(start);
        var endLevel = this.getLevelOfNode(end);
        var level;

        //Go through each level starting from the start to the end
        //The starting value is higher than the end
        //e.g. L5 ---> L0 , the first nodes are in L5
        for (var index = startLevel - 1; index >= endLevel; index--) {

            level = getLevel(index);
            nodes = this.map[level];

            //Stop the processing if the current level has the end
            if (isNodePresent(end, nodes)) {
                return;
            }
            else {
                nodes.push(new Node(start, true, index));
            }

            distance++;
        }

    };

    /*
     The function returns the level to which a given node belongs
     */
    LevelMap.prototype.getLevelOfNode = function (id) {

        var levelCounter = this.count() - 1;
        var nodes = [];

        for (var index in this.map) {
            nodes = this.map[index];

            if (isNodePresent(id, nodes)) {
                return levelCounter;
            }

            levelCounter--;
        }

        return levelCounter;
    };

    /*
     The function sorts the nodes in each level based on the distance value to the connected node
     */
    LevelMap.prototype.sort = function () {

        for (var index in this.map) {
            //Sort the current level
            sortLevel(index, this.map);
        }

    };

    /*
     The function performs a simple bubble sort based on the distance value of each node.
     @level: The level of the nodes to be sorted
     */
    function sortLevel(level, map) {

        var nodes;
        var node;

        //Check if the map has the indicated level
        if (!map.hasOwnProperty(level)) {
            return;
        }

        //Get the nodes in the indicated level
        nodes = map[level];

        //Go through each node
        for (var index = 0; index < nodes.length; index++) {

            node = nodes[index];

            //Go through the rest of the node starting from the index
            for (var indexCompare = 0; indexCompare < nodes.length ; indexCompare++) {

                //Sort the levels in descending order
                if (node.distance > nodes[indexCompare].distance) {
                    swap(index,indexCompare,nodes);
                }
            }

        }
    }

    /*
     The function swaps the position of the two elements in the given array
     a is moved to b, and the value at b is moved to a
     */
    function swap(a, b, array) {
        var temp = array[a];
        array[a] = array[b];
        array[b] = temp;

    }

    /*
     The function checks whether a given node with the provided id is present in an array of nodes
     @id: The id of the node to be checked
     @nodes: The list of nodes to be checked against
     @return: True if the node is present else false
     */
    function isNodePresent(label, nodes) {

        var node;

        for (var index in nodes) {
            node = nodes[index];

            if (node.label == label) {
                return true;
            }
        }

        return false;
    }

    function Node(label, isFake, distance) {
        this.label = label;
        this.isFake = isFake || false;
        this.distance = distance || 0;
        this.x = 0;
        this.y = 0;
    }

    function createCoordinateMap(levelMap, level, length, startX, startY) {
        //Get the residents for the level
        var residents = levelMap.getNodesInLevel(level);
        var mapping = [];
        var node;

        //Calculate the spacing
        var spacing = length / residents.length;

        for (var index in residents) {
            node = residents[index];
            node.x = startX;
            node.y = startY;
            mapping.push({label: node.label, x: startX, y: startY, isFake: node.isFake});
            startY += spacing;


        }

        return mapping;
    }

    var START_X = 20;
    var START_Y = 500;
    var LEVEL_SPACE = 200;
    var VERTEX_RADIUS = 10;
    var LEVEL_SEP = 100;


    function getPoints(levelMap) {
        var points = [];
        var startX = START_X;
        var startY = START_Y;

        for (var index = levelMap.count(); index >= 0; index--) {

            var coords = createCoordinateMap(levelMap, index, LEVEL_SPACE, startX, startY);

            //Draw the items in the coords
            for (var key in coords) {
                var element = coords[key];
                points.push(element);
            }

            startX += LEVEL_SEP;
        }

        return points;
    }
	
	function bindClickEvent(label){
		return function(){
			window.changeState(label);
		}
	}

    function drawChart(levelMap, paper, state) {

        var points = [];
        var startX = START_X;
        var startY = START_Y;

        for (var index = levelMap.count(); index >= 0; index--) {
            var coords = createCoordinateMap(levelMap, index, LEVEL_SPACE, startX, startY);


            //Draw the items in the coords
            for (var key in coords) {

                if (!coords[key].isFake) {
                    var element = coords[key];
                    var circle = paper.circle(element.x, element.y, VERTEX_RADIUS);
                    if(state == element.label){
                    	 circle.attr('fill', '#FFBE6B');
                    } else {
                    	 circle.attr('fill', '#6EC87F');
                    }
                   
                    circle.attr('stroke-width', '3px');
                    circle.attr('stroke', '#647E9A');
                    circle.attr('r', VERTEX_RADIUS);
                    //circle.node.setAttribute('class', element.label);
                    circle.node.id = element.label;
                    circle.node.onclick = bindClickEvent(element.label);
                  /*
                   circle.node.onclick = function(){
                                                                                              window.changeState(circle.node.id);
                                         }*/
                  
                   	//
                   //  console.log( circle.node)   ;                
                   // alert(circle.node.setAttribute("class",""));
                    //circle.node.setAttribute('class', element.label);
                    paper.text(element.x, element.y + VERTEX_RADIUS + 10, element.label);
                    points.push(element);
                }
            }

            startX += LEVEL_SEP;
        }

        return points;
    }



    /*
     The function checks whether two edges are connected
     @a: The starting point of the connection
     @b: The ending point of the connection
     @matrix: The matrix recording the relationship between the nodes
     @return: True if the nodes are connected,else False
     */
    function isConnected(a, b, matrix) {

        if(!matrix.hasOwnProperty(a.label)){
            return false;
        }

        if (matrix[a.label].hasOwnProperty(b.label)) {

            if (matrix[a.label][b.label] == 1) {
                return true;
            }
        }

        return false;

    }


    /*
     The function is used to draw arrowheads
     */
    function drawArrowHead(a,b,paper,matrix){

        var angle;
        var arrow;

        //Check if there is an arrow from a-> b
        if(checkDoubleArrow(a,b,matrix)){

            angle = Math.atan2(b.y - a.y, b.x - a.x);
            angle = angle * (180 / Math.PI);

            drawArrow({x: (b.x+ a.x)/2, y: (b.y+ a.y)/2, angle: angle}, paper);
        }

        //Check if there is an arrow from b -> a
        if(checkDoubleArrow(b,a,matrix)){

            angle = Math.atan2(a.y - b.y, a.x - b.x);
            angle = angle * (180 / Math.PI);

            drawArrow({x: (a.x+ b.x)/2, y: (a.y+ b.y)/2, angle: angle}, paper);
        }
    }

    /*
     The function checks if there is an arrow head between point a and b
     */
    function checkDoubleArrow(a,b,matrix){
        if(!matrix.hasOwnProperty(a.label)){
            return false;
        }

        if(matrix[a.label].hasOwnProperty(b.label)) {
            return true;
        }

        return false;
    }

    function drawEdges(matrix, paper, points,rawMap) {
        var matrix = matrix.matrix;
        for (var index in matrix) {

            //Find the point of the matrix
            var fromPoint = findPoint(index, points);

            var connected = getAllConnectedEdges(matrix, index);

            for (var to in connected) {

                if (fromPoint) {

                    var toPoint = findPoint(connected[to], points);

                    if (toPoint) {
                        var path = [];

                        path.push('M')
                        path.push(fromPoint.x);
                        path.push(fromPoint.y);


                        path.push('L');
                        path.push(toPoint.x);
                        path.push(toPoint.y);
                        var edge=paper.path(path.join(','));
                        edge.attr('stroke', '#647E9A');
                        edge.attr('stroke-width', '3px');


                        var angle = Math.atan2(toPoint.y - fromPoint.y, toPoint.x - fromPoint.x);

                        angle = angle * (180 / Math.PI);

                        drawArrowHead(fromPoint,toPoint,paper,rawMap);
                    }
                }
            }
        }
    }

    function findPoint(label, points) {
        for (var index in points) {
            var point = points[index];

            if (point.label == label) {
                return point;
            }
        }

        return null;
    }


    /*
     The function creates a path object for an arrow at point
     */
    function drawArrow(options, paper) {
        var x = options.x;
        var y = options.y;
        var width = options.width || 4;
        var height = options.height || 8;
        var angle = options.angle || null;
        var attributes = options.attributes || {fill: '#647E9A', stroke:'#647E9A'};
        var rotateX = x;
        var rotateY = y;


        var path = [];
        path.push('M');
        path.push(x);
        path.push(y);
        path.push('L');
        path.push(x - height);
        path.push(y - width);
        path.push('L');
        path.push(x - height);
        path.push(y + width);
        path.push('L');
        path.push(x);
        path.push(y);

        var pathString = path.join(',');

        var pathInstance = paper.path(pathString);

        //Attempt to apply all the attributes
        for (var index in attributes) {
            pathInstance.attr(index, attributes[index]);
        }

        //Rotate the arrow by the provided angle
        if (angle) {
            pathInstance.rotate(angle, rotateX, rotateY);
        }

    }



    function findHighestSinks(master) {

        var matrix = master.matrix;

        var sinks = [];

        var edgeCounter = 0;
        var highest = 0;
        var highestVertex = '';

        //Go through each vertex
        for (var vertex in master.matrix) {

            edgeCounter = 0;

            for (var connected in keys) {
                var item = keys[connected];
                if (master.matrix[item][vertex]) {
                    edgeCounter++;
                }

            }

            if (edgeCounter > highest) {
                highest = edgeCounter;
                highestVertex = vertex;
            }

            if (edgeCounter > 1) {
                //console.log(vertex + ' edge counter: ' + edgeCounter);
                sinks.push(vertex);
            }
        }

        //console.log('sinks: ' + JSON.stringify(sinks));

        return highestVertex;
    }

    /*
     The function calculates the distance of the path from
     to
     */
    function calculatePath(matrix, from, to) {
        return recursivePath(0, from, to, matrix.matrix);
    }

    function getAllConnectedEdges(map, from) {
        var items = [];

        if (map.hasOwnProperty(from)) {

            for (var index in map[from]) {

                if (map[from][index] == 1) {
                    items.push(index);
                }

            }

            return items;
        }

        return items;
    }

    function recursivePath(length, from, to, matrix) {
        if ((matrix.hasOwnProperty(from)) && (matrix[from][to])) {
            return length;
        }
        else {
            length++;
            var result;
            var connections = getAllConnectedEdges(matrix, from);
            //Travel all posssible paths
            for (var key in connections) {

                result = recursivePath(length, connections[key], to, matrix);

                if (result > 0) {
                    return result;
                }
            }

            return -1;
        }
    }

    /*
     The function is used to layout the matrix
     */
    function layout(matrix, levels) {

        var sink = findHighestSinks(matrix);

        var connected = keys;

        for (var key in connected) {
            //Calculate the path distance for each connection
            var path = calculatePath(matrix, sink, connected[key]);

            if (path < 0) {
                path = calculatePath(matrix, connected[key], sink);
            }

            levels.add(connected[key], path + 1);
        }

        return levels;
    }

    function Sugyama(data, paper) {
        this.paper = paper;
        this.data = data;
    }

    Sugyama.prototype.init=function(data,paper){
        this.paper=paper;
        this.data=data;
    }

    Sugyama.prototype.draw = function (startX, startY, vertexRadius, levelSpace, levelSep, state) {
        START_X = startX;
        START_Y = startY;
        VERTEX_RADIUS = vertexRadius;
        LEVEL_SEP = levelSep;
        LEVEL_SPACE = levelSpace;

        var module = graphDataModule();

        var dataProvider = new module.DataProvider();

        dataProvider.prepareData(this.data);
		//console.log(dataProvider.rawMap);

        var matrix = new Matrix(dataProvider.map);
        keys = dataProvider.keys;

        var levels = new LevelMap();

        var instance = layout(matrix, levels);

        levels.show();

        levels.createPseudoPaths(matrix.matrix);
        levels.sort();

        var points = getPoints(levels);
        drawEdges(matrix, this.paper, points,dataProvider.rawMap);
        drawChart(levels, this.paper, state);

    } ;

	Sugyama.prototype.getRawMap = function(){
		var module = graphDataModule();

        var dataProvider = new module.DataProvider();

        dataProvider.prepareData(this.data);
		return dataProvider.rawMap;
	}
	
	Sugyama.prototype.getKeys = function(){
		var module = graphDataModule();

        var dataProvider = new module.DataProvider();

        dataProvider.prepareData(this.data);
		return dataProvider.keys;
	}
	
	

    return{
        Sugyama:Sugyama
    }

};

