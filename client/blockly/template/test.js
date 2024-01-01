function getFiles(dir, extensions, files_){
    const fs = require('fs');
    const path = require('path');
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let i in files){
        let name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, extensions, files_);
        } else {
            let ext = path.extname(name);
            if(extensions.includes(ext)) {
                files_.push(name);
            }
        }
    }
    return files_;
}
