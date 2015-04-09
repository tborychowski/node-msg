/*global module, console, process */
// jshint -W084
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
	success : function (msg) { console.log(MSG.cyan('' + msg)); },
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

	beep    : function (times) { times = times || 1; while (times--) process.stdout.write('\x07'); },

	stripColors: function (str) {
		return str.toString().replace(/\x1B\[\d+m/g, '');
	},

	/**
	 * Show progres indicator
	 * @param  {String} msg      Message to show before the indicator (must be provided as the line is cleared)
	 * @param  {object} options  additional settings for the inficator (anim type & speed)
	 */
	loading : function (msg, options) {
		var self = this;

		this.running = false;
		this.dots = 0;
		this.dotsDir = 1;			// going up or down

		this.config = {
			msg: msg || '',
			animType: 'up',			// [up | updown | swirl]
			animSpeed: 200
		};

		if (typeof options === 'object') {
			if (options.animType) this.config.animType = options.animType;
			if (options.animSpeed) this.config.animSpeed = options.animSpeed;
		}

		this.getDots = function () {
			if (this.config.animType === 'swirl') return ['|', '/', '-', '\\'][this.dots++ % 4];
			else if (this.config.animType === 'up') this.dots = (this.dots + 1) % 4;
			else if (this.config.animType === 'updown') {
				if (this.dotsDir > 0 && this.dots >= 3) this.dotsDir = -1;
				else if (this.dotsDir < 0 && this.dots <= 0) this.dotsDir = 1;
				this.dots += this.dotsDir;
			}
			return new Array(this.dots + 1).join('.');
		};

		this.run = function () {
			if (!this.running) return;
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(this.config.msg + this.getDots());
			setTimeout(function () { self.run.call(self); }, this.config.animSpeed);
			return this;
		};
		this.stop = function (msg) {
			this.running = false;
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			//process.stdout.write(this.config.msg + (msg || ''));
			if (this.config.msg || msg) console.log(this.config.msg + (msg || ''));
			return this;
		};

		this.running = true;
		return this.run();
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
		_columnTypes = [],					// array of nums, [ -2, 0, 4 ]; negative = number, 0+ = string
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
			if (sort < 0) sort = 0;
			if (sort > data[1].length - 1) sort = data[1].length - 1;

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

		// calc column widths & types
		data.forEach(function (row) {
			row.forEach(function (cell, idx) {
				if (!_columnLengths[idx]) _columnLengths[idx] = _colPadding;
				// column padding is ~30% greater than the widest cell (but max 4 spaces)
				var cellLen = MSG.stripColors(cell).length, pad = Math.min(4, Math.ceil(0.3 * cellLen));
				_columnLengths[idx] = Math.max(_columnLengths[idx], cellLen + pad);

				_columnTypes[idx] = _columnTypes[idx] || 0;
				_columnTypes[idx] += (_isNumber(cell) ? -1 : 1);
			});
		});

		// update cells with spaces
		data.forEach(function (row) {
			row.forEach(function (cell, idx) {
				var cellLen = MSG.stripColors(cell).length;
				if (_columnTypes[idx] < 0) row[idx] = _spaces(_columnLengths[idx] - cellLen) + cell;
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
