function getUrlParameter(paramName) {
    var url = window.location.search.substring(1);
    let params = url.split('&');

    for (let i = 0; i < params.length; i++) {
        let nameValue = params[i].split('=');

        if (nameValue[0] === paramName) {
            return nameValue[1] === undefined ? true : decodeURIComponent(nameValue[1]);
        }
    }
};

function getUrlParameters() {
    let url = window.location.search.substring(1)
    let kvPairs = url.split('&');
    let params = {};
    
    kvPairs.forEach(pair => {
        let keyValue = pair.split('=');
        params[keyValue[0]]= keyValue[1];
    });

    return params;
}