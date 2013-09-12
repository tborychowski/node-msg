/*global module, console, process */

var MSG = {
	black   : function (msg) { return '\x1B[30m' + msg + '\x1B[39m';  },
	blue    : function (msg) { return '\x1B[34m' + msg + '\x1B[39m';  },
	bold    : function (msg) { return '\x1B[1m'  + msg + '\x1B[22m';  },
	cyan    : function (msg) { return '\x1B[36m' + msg + '\x1B[39m';  },
	green   : function (msg) { return '\x1B[32m' + msg + '\x1B[39m';  },
	grey    : function (msg) { return '\x1B[90m' + msg + '\x1B[39m';  },
	magenta : function (msg) { return '\x1B[35m' + msg + '\x1B[39m';  },
	red     : function (msg) { return '\x1B[31m' + msg + '\x1B[39m';  },
	yellow  : function (msg) { return '\x1B[33m' + msg + '\x1B[39m';  },
	white   : function (msg) { return '\x1B[37m' + msg + '\x1B[39m';  },

	log     : function (msg) { console.log('' + msg);                 },
	success : function (msg) { console.error(MSG.magenta('' + msg)); },
	error   : function (msg) {
		if (typeof msg === 'object') msg = msg.message || msg.msg || msg.toString();
		console.error(MSG.red('' + msg));
	},

	paint   : function (msg, colors) {
		msg = '' + msg;
		colors.split(' ').forEach(function (col) { if (typeof MSG[col] === 'function') msg = MSG[col](msg); });
		return msg;
	},

	print   : function (msg, colors) { return console.log(MSG.paint(msg, colors)); },

	beep    : function (times) {
		times = times || 1;
		while (times--) process.stdout.write('\x07');
	},


	/**
	 * Format array data as ascii table
	 * @param  {array} data 2d array of strings/numbers
	 * @param {number} sort column index to sort by
	 * @param {string} order sort order [ASC|DESC]
	 */
	table : function (data, sort, order, limit) {
		if (Object.prototype.toString.call(data) !== '[object Array]') return '';

		limit = limit || 0;

		var
		_colPadding = 5,
		_columnLengths = [],
		_ascSort = (order !== 'DESC'),

		_spaces = function (n, chr) {
			if (n < 0) return '';
			return new Array(n || 1).join(chr || ' ');
		},

		_isNumber = function (v) {
			if (typeof v === 'number') return true;
			if (typeof v !== 'string') return false;
			return (/^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?(\s?\w{1,4})?$/).test(v);
		};


		// SORT
		if (typeof sort !== 'undefined') {
			// compare as int
			if (_isNumber(data[1][sort])) {
				if (_ascSort) data.sort(function (a, b) { return parseFloat(a[sort]) - parseFloat(b[sort]); });
				else data.sort(function (a, b) { return parseFloat(b[sort]) - parseFloat(a[sort]); });
			}
			// compare as strings
			else {
				if (_ascSort) {
					data.sort(function (a, b) {
						return ('' + a[sort]).toLowerCase().localeCompare(('' + b[sort]).toLowerCase());
					});
				}
				else {
					data.sort(function (a, b) {
						return ('' + b[sort]).toLowerCase().localeCompare(('' + a[sort]).toLowerCase());
					});
				}
			}
		}

		if (limit) data.splice(limit);

		// calc column widths
		data.forEach(function (row) {
			row.forEach(function (cell, idx) {
				if (!_columnLengths[idx]) _columnLengths[idx] = _colPadding;
				// column padding is ~30% greater than the widest cell
				var cellLen = cell.toString().length;
				_columnLengths[idx] = Math.max(_columnLengths[idx], cellLen + Math.ceil(0.3 * cellLen));
			});
		});

		// update cells with spaces
		data.forEach(function (row) {
			row.forEach(function (cell, idx) {
				var cellLen = cell.toString().length;
				if (_isNumber(cell)) row[idx] = _spaces(_columnLengths[idx] - cellLen) + cell;
				else row[idx] = cell + _spaces(_columnLengths[idx] - cellLen);
			});
		});

		// write
		data.forEach(function (row, rowIdx) {
			console.log(row.join(' '));
			if (rowIdx === 0) {
				for (var i = 0, l, srow = []; l = _columnLengths[i++] ;) srow.push(_spaces(l, '-'));
				console.log(srow.join(' '));
			}
		});
	}
};

module.exports = MSG;