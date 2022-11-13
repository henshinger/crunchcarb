var param = window.location.hash.substr(1);

// if (typeof param === 'string' && param.length !== 0) 
document.getElementById('input-text').value = decodeURI(param);
