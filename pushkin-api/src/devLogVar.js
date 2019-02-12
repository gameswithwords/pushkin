const valString = o => {
	return Object.keys(o).reduce( (str, key) => {
		try {
			const val = JSON.stringify(o[key]);
			console.log(val); // eslint-disable-line
			return str + `${key}: ${val}\n`;
		} catch (e) {
			console.error(`failed to log value for ${key}`);
		}
	}, '');
};

const varLog = o => {
	console.log(valString(o));
};

module.exports = { valString, varLog };
