import handlebars from 'express-handlebars'
import path from 'path'

const handlebarsConfig = (app,dir) =>{
    app.engine(
    "hbs",
    handlebars.engine({
            extname: ".hbs",
            defaultLayout: "main",
            layoutsDir: path.join(dir, "views/layout"),
        })
    );

    app.set("view engine", "hbs");
    app.set("views", path.join(dir, "views"));
}

export default handlebarsConfig;