const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('node:path')
const bitcoin = require('bitcoinjs-lib');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'bitcoin.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow();

    const menuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        const aboutWindow = new BrowserWindow({
                            width: 500,
                            height: 400,
                            icon: path.join(__dirname, 'bitcoin.ico'),
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false
                            }
                        });
                        aboutWindow.loadFile('about.html');
                        aboutWindow.setMenu(null);
                    }
                },
                {
                    label: 'Exit',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('check-address', (event, address) => {
    const isValid = isValidBitcoinAddress(address);
    event.reply('check-result', isValid);
});

function isValidBitcoinAddress(address) {
    try {
        bitcoin.address.toOutputScript(address);
        return true;
    } catch (e) {
        return false;
    }
}
