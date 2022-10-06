function download(url, callback) {
    setTimeout(() => {
        // script to download the picture here
        console.log(`Downloading ${url} ...`);
    }, 3* 1000);
    picture_data = "image data:XOXOXO";
    callback(picture_data);
}

function process(picture) {
    console.log(`Processing ${picture}`);
}

let url = 'https://www.example.comt/big_pic.jpg';
download(url, process);