const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
	eslintConfigPrettier,
	{
		languageOptions: {ecmaVersion: 'latest', sourceType: 'module'},
		rules: {'no-unused-vars': 'off'},
	},
];
