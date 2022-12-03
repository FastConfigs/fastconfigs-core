# FastConfigs
Fastconfigs as the name implies is a chrome extension that simple makes it easier to modify environment variables of applications hosted on platforms like heroku, netlify and so on.

It allows you to add unlimited amount of environment variables using, json, txt of .env files.

### Installation
**The extension is not currently available on chrome store, so you have to install it manually by following the steps below.**

1. Clone the respository by running `git clone https://github.com/talibackend/fastconfigs-core`.
2. Head to your browser setting and extension.
3. Click on "Load unpacked" button in the top bar.
4. Select the folder that you cloned earlier.
5. You can pin the extension to your browsers bar - **optional**.
6. Enjoy using fastconfigs.

### How it works
- Fastconfigs **does not store or process your environment variables on any server, all execution are done on the user's browser**
#####
- The extension requires that you are logged in to the platform on your browser before you try to configure the apps hosted on that platform.
#####
- If you are not logged in to the platform, fastconfigs automatically opens the platforms login page in a new tab.
#####
- After successful login you can configure the apps hosted on that platform seamlessly.


### Supported Formats
1. **JSON** : Fastconfigs supports JSON files given that all keys and values are string, below is an example.
```json
{
    "key" : "value",
    "hello" : "world",
    "BASE_URL" : "https://example.com/"
}
```
2. **TEXT** : It also supports text file with the **.txt** extension, every variable should be on seperate lines and keys/values should be seperated with **=**, below is an example.
```
key=value
hellow=world
BASE_URL=https://example.com/
```
3. **ENV** : All files with **.env** extension are also supported, the file should be in the proper env format, below is an example.
```
key=value
hellow=world
BASE_URL=https://example.com/
```

### Suppoted Platforms
##### 1. Heroku
##### 2. Netlify
