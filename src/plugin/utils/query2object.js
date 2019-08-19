const string2object = (_string = "", _split) => {
    let _obj = {};

    _string.split(_split).forEach(item => {
        let _brr = item.split('=');
        if (!_brr || !_brr.length) return;
        let _key = _brr.shift();
        if (!_key) return;
        _obj[decodeURIComponent(_key)] =
            decodeURIComponent(_brr.join('='));
    })

    return _obj;
};


export const query2object = (query) => {
    return string2object(query, '&')
}