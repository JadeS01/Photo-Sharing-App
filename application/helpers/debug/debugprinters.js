const colors = require('colors');

colors.setTheme({
    error: ['black', 'bgRed'],
    success: ['black', 'bgBlue'],
    request: ['black', 'bgYellow']
})

const printers = {
    errorPrint: (message) => {
        console.log(colors.error(message));
    },

    successPrint: (message) => {
        console.log(colors.success(message));
    },

    requestPrint: (message) => {
        console.log(colors.request(message));
    }
}

module.exports = printers;