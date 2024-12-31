const fs = require('fs');
const path = require('path');

// Define the directory to search
const directoryPath = './dist/assets';

const userScriptConfigPath = './dev_scripts/userScriptConfig.js';

// Regular expressions to match files
const cssPattern = /^index-[a-zA-Z0-9\-_]+\.css$/;
const jsPattern = /^index-[a-zA-Z0-9\-_]+\.js$/;

// Find files in the directory
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading the directory:', err);
        return;
    }

    // Find the CSS and JS files matching the pattern
    const cssFile = files.find(file => cssPattern.test(file));
    const jsFile = files.find(file => jsPattern.test(file));

    if (!cssFile) {
        console.error('No CSS file matching the pattern found.');
        return;
    }

    if (!jsFile) {
        console.error('No JS file matching the pattern found.');
        return;
    }

    // Read userScriptConfig content
    fs.readFile(userScriptConfigPath, 'utf8', (err, configContent) => {
        if (err) {
            console.error('Error reading the userScriptConfig file:', err);
            return;
        }

        // Read the CSS file content
        const cssFilePath = path.join(directoryPath, cssFile);
        const jsFilePath = path.join(directoryPath, jsFile);

        fs.readFile(cssFilePath, 'utf8', (err, cssContent) => {
            if (err) {
                console.error('Error reading the CSS file:', err);
                return;
            }

            // Read the JS file content
            fs.readFile(jsFilePath, 'utf8', (err, jsContent) => {
                if (err) {
                    console.error('Error reading the JS file:', err);
                    return;
                }

                // Append CSS content to the JS file
                const preparedCSS = injectStyleCSS(cssContent);
                const updatedJsContent = `${jsContent}\n\n/* Injected CSS */\n${preparedCSS}`;
                // Update Userscript config header with version
                const version = process.env.npm_package_version;
                configContent = configContent.replace("${_VERSION}" , version);
                // Append Userscript config header
                const userScriptBody = `${configContent}\n\n${createUserScriptCode(updatedJsContent)}`;

                // Get the current date and time
                const now = new Date();
                const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
                const currentTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
                
                // Updated output file name
                const outputFileName = `WebPainter_${currentDate}_${version}.user.js`;
                const outputPath = path.join(directoryPath, outputFileName);

                fs.writeFile(outputPath, userScriptBody, 'utf8', (err) => {
                    if (err) {
                        console.error('Error saving the user script file:', err);
                    } else {
                        console.log(`User script saved successfully as ${outputPath}`);
                    }
                });
            });
        });
    });
});

function injectStyleCSS(css) {
    return (
        `const styleToInject = document.createElement('style');
        styleToInject.textContent = \`${css.replace(/`/g, '\\`')}\`; // Escape backticks
        document.head.appendChild(styleToInject);`
    );
}

function createUserScriptCode(code) {
    return (
        `(function() {
            ${code}
        })();`
    );
}
