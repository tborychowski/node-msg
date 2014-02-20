node-msg
========

Node message formatter


Install
-------

	npm install node-msg

	
Usage
-----

**test.js**
````javascript
	var Msg = require('node-msg');

	Msg.beep(2);
	Msg.log('This is a double beep!\n');

	Msg.error('This is error');
	Msg.success('This is success message');

	Msg.log(
		Msg.blue('\nThis is blue text') + ', ' +
		Msg.cyan('\nThis is cyan text') + ', ' +
		Msg.green('\nThis is green text') + ', ' +
		Msg.grey('\nThis is grey text') + ', ' +
		Msg.magenta('\nThis is magenta text') + ', ' +
		Msg.red('\nThis is red text') + ', ' +
		Msg.yellow('\nThis is yellow text') + ', ' +
		Msg.white('\nThis is white text') + ', ' +

		Msg.paint('\n\nThis is bold blue text', 'bold blue') + ', ' +
		Msg.paint('\nThis is bold cyan text', 'bold cyan') + ', ' +
		Msg.paint('\nThis is bold green text', 'bold green') + ', ' +
		Msg.paint('\nThis is bold grey text', 'bold grey') + ', ' +
		Msg.paint('\nThis is bold magenta text', 'bold magenta') + ', ' +
		Msg.paint('\nThis is bold red text', 'bold red') + ', ' +
		Msg.paint('\nThis is bold yellow text', 'bold yellow') + ', ' +
		Msg.paint('\nThis is bold white text', 'bold white')
	);

	Msg.log('\n\nAnd this is a table:\n');

	Msg.table([
		[ 'ID', 'String', 'Size' ],
		[ '1', 'String 1', '10 KB' ],
		[ '2', 'String 2', '20 KB' ],
		[ '3', 'String 3', '30 KB' ],
		[ '4', 'String 4', '40 KB' ],
		[ '5', 'String 5', '50 KB' ],
		[ '6', 'String 6', '60 KB' ],
		[ '7', 'String 7', '70 KB' ],
		[ '8', 'String 8', '80 KB' ],
		[ '9', 'String 9', '90 KB' ],
		[ '10', 'String 10 is the longest', '100 KB' ],
	]);

	var loader = new Msg.loading('Loading');
	setTimeout(function () { loader.stop('....OK'); }, 2000);
````


**Output**

![sample-output](https://github.com/tborychowski/node-msg/raw/master/sample-output.png "Sample output")
