# Description
PreFlight is a code-free automated UI testing tool. This package allows you to run your PreFlight tests.

## Usage
### Prerequisite
Before you start, you need to get a client id and client secret from [Account Settings > API](https://app.preflight.com/account/api) under your PreFlight account.

### Install
Download package with below command.   
`npm install preflight-cli`

### Run
Run the PreFlight application with below command.  
`npm run preflight`

### Run Test on PreFlight
Client id and client secret are required parameters. This is the example run command.    
`preflight run --clientId="<client-id>" --clientSecret="<client-secret>" --testId="<test-id>"`    

These are other parameters.

`-i, --clientId`          PreFlight client id.   
`-s, --clientSecret`      PreFlight client secret.  
`-t, --testId`            PreFlight test id.   
`-g, --groupId`           PreFlight group id.   
`-e, --environmentId`     PreFlight environment id.   
`-b, --browsers`          Platforms and browsers. (Ex:`-b "win-ie,win-firefox"`) (Options:`win-chrome` `win-ie` `win-firefox` `win-edge`).   
`-x, --sizes`             Sizes. (Ex: `-x "1920x1080,1440x900"`) (Options:`1920x1080` `1440x900` `1024x768` `480x640`).  
`-c, --noScreenshot`      Don't capture screenshots.      
`-w, --noWaitResult`      Don't wait tests results.   

 
