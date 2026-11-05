// Единая точка доступа к базе данных.
module.exports = {
    ...require("./postgres"),
    ...require("./schema"),
    ...require("./users"),
    ...require("./profiles"),
    ...require("./posts"),
    ...require("./messages"),
    ...require("./music"),
    ...require("./auth"),
};
