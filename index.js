console.log("Content script running....");
chrome.runtime.onMessage.addListener((message) => {
    if (message.action == "import-app-config") {
        const config = message.config;
        const configKeys = Object.keys(config);
        const app_id = message.id;
        const platform = message.platform;
        let access_token;

        if(!platform.auth){
            access_token = true;
        }else{      
            switch(platform.auth.type){
                case 'local_storage':
                    access_token = ObjectTraverser(localStorage, platform.auth.path)
                    break;
                default:
                    break;
            }
        }

        if (!access_token) {
            chrome.runtime.sendMessage({ status: 0, msg: `You're not logged in to ${platform.name}` });
        } else {
            for (let i = 0; i < configKeys.length; i++) {
                let currentKey = configKeys[i];
                let currentValue = config[`${currentKey}`];
                let currentPayload = {}
                currentPayload[`${currentKey}`] = currentValue;
                chrome.runtime.sendMessage({ status: 2, msg: `Importing ${currentKey}...` });
                let payload2 = {
                    method: platform.configure_app_env_payload.method,
                    body: platform.configure_app_env_payload.body.replaceAll("fastconfigs-env-key", currentKey).replaceAll("fastconfigs-env-value", currentValue)
                }
                if(platform.configure_app_env_payload.headers){
                    payload2.headers = ReplaceObjectValues(platform.configure_app_env_payload.headers, { "fastconfigs-auth-token" : access_token });
                }
                setTimeout(async () => {
                    return await fetch(`${platform.configure_app_env_payload.url.replaceAll('fastconfigs-app-id', app_id)}`, payload2).then((res) => {
                        if (res.status != 200) {
                            chrome.runtime.sendMessage({ status: 0, msg: `Failed to import ${currentKey}` });
                            i -= i;
                        } else {
                            let new_percent= parseFloat(parseFloat(i + 1) / configKeys.length) * 100
                            chrome.runtime.sendMessage({ status: 2, msg: `${currentKey} imported`, new_percent });

                            if (i == configKeys.length - 1) {
                                chrome.runtime.sendMessage({ status: 1, msg: `Importation completed, refreshing page.` });
                                setTimeout(() => {
                                    window.location = platform.configure_app_env_payload.success_redirect_url.replaceAll('fastconfigs-app-id', app_id);
                                }, 1000);
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                        chrome.runtime.sendMessage({ status: 0, msg: `Failed to import ${currentKey}` });
                        i -= i;
                    })
                }, 10000);
            }         
        }

    }
    if (message.action == "load-apps") {
        const platform = message.platform;
        let access_token;
        
        if(!platform.auth){
            access_token = true;
        }else{
            switch(platform.auth.type){
                case 'local_storage':
                    access_token = ObjectTraverser(localStorage, platform.auth.path)
                    break;
                default:
                    break;
            }
        }

        if (!access_token) {
            chrome.runtime.sendMessage({ status: 0, msg: `You're not logged in to ${platform.name}` });
        } else {
            const payload = {
                method: platform.fetch_apps_payload.method
            }
            if(platform.fetch_apps_payload.headers){
                payload.headers = ReplaceObjectValues(platform.fetch_apps_payload.headers, { "fastconfigs-auth-token" : access_token });
            }
            fetch(platform.fetch_apps_payload.url, payload).then((res) => {
                res.json().then((json) => {
                    chrome.runtime.sendMessage({ type: 'loaded-apps', apps: ObjectTraverser(json, platform.fetch_app_response.path) });
                }).catch(err => {
                    console.log(err)
                    chrome.runtime.sendMessage({ status: 0, msg: "Unable to retrieve apps" });
                })
            }).catch(err => {
                console.log(err)
                chrome.runtime.sendMessage({ status: 0, msg: "Unable to retrieve apps" });
            })
        }
        if(message.action == "get-helper-functions"){
            chrome.runtime.sendMessage([ObjectTraverser, ReplaceObjectValues]);
        }
    }
});