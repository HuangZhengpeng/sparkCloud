const Crawler = require('crawler');

const c = new Crawler({
    maxConnections: 10,
    rateLimit: 2000, // `maxConnections` will be forced to 1
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            console.log((res.body));

        }
        done();
    }
});

c.queue({
    uri:`https://movie.douban.com/top250`,
    name:"???"
})