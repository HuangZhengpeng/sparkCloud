
module.exports = (res) => {
    return (err, files) => {
        if (err) {
            res.writeHead(404, { "Conten-Type": "text/html;charset=utf-8" })
            res.end(404)
        } else {
            res.writeHead(200, { "Conten-Type": "application/json;charset=utf-8" })
            const list = files.map(file => file.toObject())
            res.end(JSON.stringify(list))
        }

    }
}