module.exports = function(req, res, next) {
    //Set Server Root For Non Express Calls
    req.session.server = req.protocol + "://" + req.host;
    req.verified = (req.host.split(".").slice(-2).join(".") == config.general.security);

    if(!config.general.production || !config.random) {
        config.random = Math.floor((Math.random()*1000000)+1);
    }

    //Header Config
    res.header("Server", config.general.company);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.host);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    //Device Info
    var device = req.device.type.toLowerCase();
    req.mobile = ["phone", "tablet"].indexOf(device) != -1;
    req.robot = (device == "bot");
    req.tv = (device == "tv");

    //Session Save
    req.session.save();

    //Locals
    res.locals.csrf = (req.csrfToken) ? req.csrfToken() : "";
    res.locals.production = config.general.production;
    res.locals.host = req.session.server;
    res.locals.site_title = config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.description = config.general.description.join("");
    res.locals.company = config.general.company;
    res.locals.logo = config.general.logo;
    res.locals.config = {};
    res.locals.icons = config.icons;
    res.locals.user = req.session.user;
    res.locals.title_first = true;
    res.locals.random = "?rand=" + config.random;
    res.locals.type = "website";
    res.locals.logos = {
        "logo":  res.locals.host + "/img/logo.png",
        "graph": res.locals.host + "/favicon/196.png",
        "1000":  res.locals.host + "/favicon/1000.png",
        "500":   res.locals.host + "/favicon/500.png",
        "196":   res.locals.host + "/favicon/196.png",
        "160":   res.locals.host + "/favicon/160.png",
        "114":   res.locals.host + "/favicon/114.png",
        "72":    res.locals.host + "/favicon/72.png",
        "57":    res.locals.host + "/favicon/57.png",
        "32":    res.locals.host + "/favicon/32.png"
    };

    //Redirect
    if(req.subdomains.indexOf('www') === -1) {
        next();
    } else {
        res.redirect(req.protocol + "://" + req.host.split(".").slice(1).join(".") + req.path);
    }
}
