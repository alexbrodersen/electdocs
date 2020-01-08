const {dialog,app, BrowserWindow, remote} = require('electron');
const url = require('url');
const path = require('path');
const DecompressZip = require('decompress-zip');
const {ipcMain}=require('electron')
const fs = require('fs'); 
let win;

function createWindow() { 
    win = new BrowserWindow({
	webPreferences: {
            nodeIntegration: true,
	    webviewTag: true
	}})

    win.loadURL('file://' + __dirname + '/load.html');
    
    ipcMain.on('openFile',(event,arg)=>{
	const {dialog} = require('electron');
	const url = require('url');
	const path = require('path');
	const DecompressZip = require('decompress-zip');
	var decompressed_path;

	var temp = require('temp');
	temp.track();

	ipcMain.on('click-button',(event,arg)=>{
	  	if(arg=='true'){
		    dialog.showOpenDialog(win, {
    			properties: ['openFile']
		    }).then(result => {
    			console.log(result.filePaths);
    			var unzipper = new DecompressZip(result.filePaths[0]);
			
    			unzipper.on('error', function (err) {
    			    console.log('Caught an error', err);
    			});

    			temp.mkdir('book_data', function(err, dirPath) {
			    
    			    decompressed_path = dirPath;
    			    console.log(dirPath);
    			    unzipper.extract({
    				path: dirPath
    				// You can filter the files that you want to unpack using the filter option
    				//filter: function (file) {
    				//console.log(file);
    				//return file.type !== "SymbolicLink";
    				//}
    			    });
    			});

    			unzipper.on('extract', function (log) {
			    
    			    console.log("LOGGING HERE");
    			    console.log(log);
			    decompressed_path
    			    var data_path = path.join(decompressed_path, 'index.html');
    			    console.log(data_path);
    			    var url_formated = url.format ({ 
    				pathname: data_path,
    				protocol: 'file:', 
    				slashes: true 
    			    });
			    
			    event.sender.send('locationData',{url: url_formated,
							      fname: path.basename(result.filePaths[0])})
    			});

		    }).catch(err => {
    			console.log(err)
		    })
		}
	})
    })
    
}

app.on('ready', createWindow) 
