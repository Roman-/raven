// constrain x between min and max. Return value is in the interval [min, max]
export const clamp = (x, min, max) => {
    return Math.min(max, Math.max(x, min))
}

// download file with plain text in it
export const downloadPlainText = (text, fileName) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// shuffles array in place
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// converts file size in bytes to human-readable string
function humanFileSize(bytes, si = true) {
    let thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    let units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

// @returns current date in format DDMMYYYY
function getCurrentDateString() {
    let t = (new Date());
    return '' + t.getDate() + '-' + t.getMonth() + '-' + t.getFullYear();
}

// @returns name of the file from full path
// @param path - path to file
function filenameFromPath(path) {
    let parts = path.split(/[\/\\\.]/);
    // return a thing second to last
    return (parts.length > 1) ? parts[parts.length - 2] : parts[0];
}