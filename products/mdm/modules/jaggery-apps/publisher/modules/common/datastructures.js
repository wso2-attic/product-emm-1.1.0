/*
 Description: The module contains commonly used data structures
 Filename:datastructures.js
 Created Date: 22/10/2013
 */
var datastructuresModule = function () {

    var log = new Log();

    /*
     The class implements a double linked list
     */
    function LinkedList() {
        this.head = null;
    }

    LinkedList.prototype.add = function (data) {
        var node = new Node(data);

        if (!this.head) {
            this.head = node;
        }
        else {
            node.next = this.head;
            this.head.previous = node;
            this.head = node;
        }
    };

    LinkedList.prototype.remove = function (predicate) {

        var temp = this.head;

        while (temp) {

            //Check if the current node should be deleted
            if (predicate(temp.data)) {
                deleteNode(temp, this);
                return;
            }

            temp = temp.next;
        }
    };

    /*
    The function removes the head from the linked list
     */
    LinkedList.prototype.removeHead=function(){
        var item=this.head;
        deleteHeadNode(this);
        //log.info(node.data);
        return item.data;
    };

    /*
     The function converts the linked list to an array
     */
    LinkedList.prototype.toArray = function () {
        var temp = this.head;
        var results = [];

        while (temp) {
            results.push(temp.data);
            temp = temp.next;
        }

        return results;
    };

    /*
     The class describes a node in a linked list with two connections
     */
    function Node(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }

    /*
    The class implements a simple stack which add data at the head
    and removes it from the same location
     */
    function Stack(){
        this.ll=new LinkedList();
    }

    /*
    The function puts a data item to the top of the stack
    @data: The data item to be placed in the stack
     */
    Stack.prototype.push=function(data){
        this.ll.add(data);
    };

    /*
    The function removes a data item from the top of the stack
    @return: The data item at the top of the stack
     */
    Stack.prototype.pop=function(){
        return this.ll.removeHead();
    };

    Stack.prototype.toArray=function(){
        return this.ll.toArray();
    };

    /*
    The function deletes the provided node from the given linked list
    @currentNode: The node to be deleted from the linked list
    @ll: The linked list from which the provided nodes is deleted
     */
    function deleteNode(currentNode, ll) {

        //Removing the head
        if (currentNode.previous == null) {

            //Empty list
            if(currentNode.next!=null){
                currentNode.next.previous = null;
            }

            ll.head = currentNode.next;

        }
        //Removing the tail
        else if (currentNode.next == null) {

            //Empty list
            if(currentNode.previous!=null){
                currentNode.previous.next = null;
            }

            currentNode.previous = null;
        }
        else {
            currentNode.previous.next = currentNode.next;
            currentNode.next.previous = currentNode.previous;
        }
    }

    function deleteHeadNode(ll){
        var head=ll.head;

        if(head.next==null){
            ll.head=null;
        }
        else {
            ll.head=head.next;

        }
    }




    return{
        LinkedList: LinkedList,
        Stack:Stack
    }
};