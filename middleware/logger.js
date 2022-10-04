const logger = (request, response, next) => {
    console.log(request.method,' | ',request.path, ' | ',request.body)
    next()
}

module.exports = logger