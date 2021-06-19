// exports.movieTags = ["Action", "Fiction", "Love", "Fantasy", "Comedy", "Horror", "Adventure","Disaster","Realistic", "Samurai", "West"]
// exports.animationTags=["Fiction","Robot","Theatrical","Harem","Funny","WarmBlood","Daily","Battle","Reasoning","Cure","CauseDepression","Campus","Original","Adaptation"]
// exports.tvTags=["Chinese","US_EU","Korean"]
let movieTagsCN={ 
    "Action": "动作", 
    "Fiction":"科幻",
    "Love":"爱情",
    "Fantasy": "奇幻",
    "Comedy": "喜剧",
    "Horror": "恐怖",
    "Adventure": "冒险", 
    "Disaster":"灾难",
    "Realistic":"现实", 
    "Samurai":"武士", 
    "West":"西部"
}

let animationTagsCN={
    "Fiction":"科幻",
    "Robot":"机战",
    "Theatrical":"剧场",
    "Harem":"后宫",
    "Funny":"搞笑",
    "WarmBlood":"热血",
    "Daily":"日常",
    "Battle":"战斗",
    "Reasoning":"推理",
    "Cure":"治愈",
    "CauseDepression":"致郁",
    "Campus":"校园",
    // "Workplace":"职场",,"Workplace"
    // "Music":"音乐",
    // "DeliciousFood":"美食","Music","DeliciousFood",
    "Original":"原创",
    "Adaptation":"改编", 
}

let tvTagsCN={
    "Chinese":"国产",
    "US_EU":"欧美",
    "Korean":"日韩",
}

exports.movieTagsCN=movieTagsCN
exports.movieTags=Object.keys(movieTagsCN)
exports.animationTagsCN=animationTagsCN
exports.animationTags=Object.keys(animationTagsCN)
exports.tvTagsCN=tvTagsCN
exports.tvTags=Object.keys(tvTagsCN)