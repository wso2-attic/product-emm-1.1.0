var graph = (function ($, Raphael) {

    var globalConfigs = {
        CANVAS_WIDTH: 100,
        CANVAS_HEIGHT: 200
    };

    var CONNECTION_TYPE = {
        "PROMOTE": 0,
        "DEMOTE": 1
    }


    var utility = {

        find: function (array, predicate) {

            for (var item in array) {
                if (predicate(array[item])) {
                    return array[item];
                }
            }
            return null;
        },
        findInArray: function (array, predicate) {
            for (var item in array) {
                if (predicate(item)) {
                    return item;
                }
            }
        }
    }

    //var element=$('#canvas');

    function Node(id) {
        this.id = id;
        this.isSelect = false;
        this.style = new Style();
    }

    Node.prototype.setStyleProperty = function (key, value) {
        this.style[key] = value;
    }

    function Edge(fromNode, toNode, type) {
        this.type = type;
        this.fromNode = fromNode;
        this.toNode = toNode;

        this.style = new Style();
    }

    function Style() {
        this.props = {};
        this.props['x'] = 0;
        this.props['y'] = 0;
    }

    Style.prototype.set = function (key, value) {
        this.props[key] = value;
    }

    Style.prototype.get = function (key) {
        if (this.props.hasOwnProperty((key))) {
            return this.props[key];
        }

        return null;
    }

    function NodeMap() {
        this.nodes = [];
        this.edges = [];
    }

    NodeMap.prototype.addNode = function (node) {
        this.nodes.push(node);
    }

    NodeMap.prototype.findNode = function (id) {
        var node = utility.find(this.nodes, function (item) {
            return (item.id == id) ? true : false;
        });

        return node;
    }

    /*
     The method is used to create a node map from a map object.
     */
    NodeMap.prototype.init = function (map) {

        var node;

        //Go through all properties in the map
        for (var property in map) {

            node = new Node(property);

            var object = map[property];

            for (var key in object) {
                var array = object[key];

                for (var index in array) {

                    var item = array[index];

                    this.edges.push(new Edge(node.id, item, key));
                }

            }

            this.addNode(node);

        }
    }

    NodeMap.prototype.listEdges = function () {
        for (var edgeIndex in this.edges) {
            var edge = this.edges[edgeIndex];
            //console.log(edge.fromNode + ' -> ' + edge.toNode + ' ' + edge.type);
        }
    }


    function Renderer(options) {

        this.config = {
            canvas: {
                width: options.canvas.width,
                height: options.canvas.height,
                canvasElement: options.canvas.canvasElement
            }
        };
        this.raphaelContext = null;
        this.nMap = null;
        this.selectNode = null;
        this.selectNodeImage = null;
    };

    Renderer.prototype.initRaphael=function(){
        //Create a Raphael instance which will handle
        //all of the drawing for us.
        this.raphaelContext = new Raphael('canvas');
    }
    Renderer.prototype.init = function (nMap) {

        this.nMap = nMap;
        var startX = 50;
        var startY = 100;
        var xOffset = 79;
        var nodeRadius = 20;
        var selectedNodeRadius = 10;
        var backwardOffset=nodeRadius*2;

        var node;
        var edge;
        var currentX = startX;
        this.selectedNode = new Node();

        //Go through all nodes and map where they should appear
        for (var nodeIndex in nMap.nodes) {
            node = nMap.nodes[nodeIndex];

            node.style.set('x', currentX);
            node.style.set('y', startY);
            node.style.set('radius', nodeRadius);
            node.style.set('text', node.id);

            currentX = currentX + nodeRadius + xOffset;

            if (node.isSelected) {
                selectedNode.style.set('x', currentX);
                selectedNode.style.set('y', startY);
                selectedNode.style.set('radius', nodeRadius + selectedNodeRadius);
            }
        }

        //Go through all of the edges
        for (var edgeIndex in nMap.edges) {

            edge = nMap.edges[edgeIndex];
            var fromNodeId = edge.fromNode;
            var toNodeId = edge.toNode;

            var fromNode = nMap.findNode(fromNodeId);
            var toNode = nMap.findNode(toNodeId);
            var fromX = fromNode.style.get('x');
            var fromY = fromNode.style.get('y');
            var toX = toNode.style.get('x');
            var toY = toNode.style.get('y');
            var path = '';
            var coord = ['M', fromX, fromY];

            //If it is a demote operation we will
            //be going backwards.
            if (edge.type == 'demote') {

                //Do an offset upwards
                var topRightX = fromX;
                var topRightY = fromY -backwardOffset;
                var topLeftX = toX;
                var topLeftY = fromY -backwardOffset;

                coord.push('L');
                coord.push(topRightX);
                coord.push(topRightY);
                coord.push('L');
                coord.push(topLeftX);
                coord.push(topLeftY);
            }
            coord.push('L');
            coord.push(toX);
            coord.push(toY);

            path=coord.join(',');

            edge.style.set('path', path);

        }
    };

    Renderer.prototype.render = function (nMap) {
        var edge;
        var node;

        //Go through the edges
        for (var edgeIndex in nMap.edges) {
            edge = nMap.edges[edgeIndex];
            var path = edge.style.get('path');

            this.raphaelContext.path(path);
        }


        //Go through the nodes
        for (var nodeIndex in nMap.nodes) {
            node = nMap.nodes[nodeIndex];
            var x = node.style.get('x');
            var y = node.style.get('y');
            var radius = node.style.get('radius');

            var image=this.raphaelContext.circle(x, y, radius);
            image.attr('fill','#BDDDCA');
            var text=node.style.get('text');
            this.raphaelContext.text(x,y+50,text);
        }

    }


    /*
     The function is used to configure properties of the renderer
     */
    Renderer.prototype.set = function (key, value) {
        if (this.config.hasOwnProperty(key)) {
            this.config[key] = value;
        }
    };

    /*
     Sets the selected node.
     */
    Renderer.prototype.setSelected = function (id) {

        var node = this.nMap.findNode(id);

        this.selectedNode = node;

        //Render the selected node
        var sx = this.selectedNode.style.get('x');
        var sy = this.selectedNode.style.get('y');
        var sradius = this.selectedNode.style.get('radius');

        if (!this.selectNodeImage) {
            var image=this.selectNodeImage = this.raphaelContext.circle(sx, sy, sradius+3);
            image.attr('stroke-width',8);
            //selectedImage.attr('fill','#3299BB');
            image.attr('stroke','#27AE60');
            this.selectNodeImage=image;
        }else{
            var animationTimePeriod=1000;

            this.selectNodeImage.animate({
                cx:sx,
                ey:1000
            },animationTimePeriod,'<>');
        }

    }


    var map = {
        "Created": {
            "promote": ["In-Review"]
        },
        "In-Review": {
            "promote": ["Published"]
        },
        "Published": {
            "promote": ["Unpublished"]
        },
        "Unpublished": {
            "demote": ["In-Review"]
        }
    }


    /*$(document).ready(function () {

        //var nMap = new NodeMap();

        //nMap.init(map);
        //nMap.listEdges();

        var element=$('#canvas');
        var renderer = new Renderer({
            canvas: {
                width: 10,
                height: 1000,
                canvasElement:element
            }
        });

        renderer.init(nMap);
        renderer.render(nMap);
        renderer.setSelected('Created');


        //renderer.setSelected('In-Review');
        //renderer.setSelected('Published');
        //renderer.setSelected('Unpublished');
        //renderer.setSelected('In-Review');

    }); */

    var nMap=new NodeMap();
    nMap.init(map);

    var renderer=new Renderer({
        canvas: {
            canvasElement:null
        }
    });

    renderer.init(nMap);

    // renderer.render(nMap);
    //renderer.setSelected('Created');
    return{
        Renderer:renderer,
        NMap:nMap
    }

}($, Raphael));
