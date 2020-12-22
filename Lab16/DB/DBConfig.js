const config = {
    driver: 'msnodesqlv8',
    connectionString:'Driver={SQL Server Native Client 11.0};' +
        'Server={Defender-SD};' +
        'Database={NodeJS_University};' +
        'Trusted_Connection={yes};'
};

module.exports = config;
