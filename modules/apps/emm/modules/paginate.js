/**
 * Creates a new `Paginate` form a givin `Array`,
 * optionally with a specific `Number` of items per page.
 *
 * @param {Array} data
 * @param {Number} [perPage=10]
 * @constructor
 * @api public
 */
 
function Paginate (data, perPage) {
	
	if (!data) throw new Error('Required Argument Missing')
	if (!(data instanceof Array)) throw new Error('Invalid Argument Type')

	this.data = data
	this.perPage = perPage || 10
	this.currentPage = 0
	this.totalPages = Math.ceil(this.data.length / this.perPage)
}

/**
 * Calculates the offset.
 *
 * @return {Number}
 * @api private
 */
 
Paginate.prototype.offset = function () {
	
	return ((this.currentPage - 1) * this.perPage);
}

/**
 * Returns the specified `page`.
 *
 * @param {Number} pageNum
 * @return {Array}
 * @api public
 */
 
Paginate.prototype.page = function (pageNum) {
	
	if (pageNum < 1) pageNum = 1
	if (pageNum > this.totalPages) pageNum = this.totalPages
	
	this.currentPage = pageNum
	
	var start = this.offset()
	  , end = start + this.perPage

	return this.data.slice(start, end);
}

/**
 * Returns the next `page`.
 *
 * @return {Array}
 * @api public
 */
 
Paginate.prototype.next = function () {

	return this.page(this.currentPage + 1);
}

/**
 * Returns the previous `page`.
 *
 * @return {Array}
 * @api public
 */
 
Paginate.prototype.prev = function () {
	
	return this.page(this.currentPage - 1);
}

/**
 * Checks if there is a next `page`.
 *
 * @return {Boolean}
 * @api public
 */
 
Paginate.prototype.hasNext = function () {
	
	return (this.currentPage < this.totalPages)
}

/**
 * Expose `Paginate`
 */
 
if (typeof module !== 'undefined') module.exports = Paginate
