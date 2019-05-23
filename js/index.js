// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import {Slider,SafeAreaView, StatusBar,YellowBox,Platform,View,Text} from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import App from './view';
const { store, persistor } = configureStore();
import codePush from "react-native-code-push";
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

class Root extends Component{

    constructor(props) {
        super(props);
        this.state={
            androidProductKey:'Aus8CeuMxgcWD1qgGFQLJIC5C7atbb4e7683-5580-469f-a5a0-40bf50164d84',
            androidStagKey:'qDeY9AxI79r6Yjkj3e3xu78BA2X1bb4e7683-5580-469f-a5a0-40bf50164d84',
            iosProductKey:'FGJaG1xuG6xYp9JVlsvQV_w0bbymbb4e7683-5580-469f-a5a0-40bf50164d84',
            iosStagKey:'VoyWCzzMUlWKf3Fkt7vIr6ysgxHkbb4e7683-5580-469f-a5a0-40bf50164d84',
            isUpdate:false,
            updateValue:0,
        }
    }

    _checkUpdate = (key:string) => {
        codePush.checkForUpdate(key).then((update) => {
            if (!update) {
            } else {
                codePush.sync({
                        deploymentKey: key,
                        // updateDialog: {
                        //   optionalIgnoreButtonLabel: '稍后',
                        //   optionalInstallButtonLabel: '立即更新',
                        //   optionalUpdateMessage: '有新版本了，是否更新？',
                        //   title: '更新提示'
                        // },
                        installMode: codePush.InstallMode.IMMEDIATE,
                    },
                    (status) => {
                        switch (status) {
                            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                                break;
                            case codePush.SyncStatus.INSTALLING_UPDATE:
                                break;
                        }
                    },
                    (progress) => {
                        progress.receivedBytes < progress.totalBytes ?
                            this.setState({
                                isUpdate:true,
                                updateValue:progress.receivedBytes/progress.totalBytes*690
                            }):this.setState({
                                isUpdate:false
                            })
                    }
                );
            }
        });
    }

    componentDidMount() {
        this._checkUpdate(this.state.iosStagKey);
    }

    render() {
        let view = null;

        if(this.state.isUpdate){
            view = (
                <View style={{flex:1,backgroundColor:'#fff',justifyContent: 'center',alignItems:'center'}}>
                    <Text style={{}}>
                        {
                            this.state.updateValue>0?'正在更新数据':'更新完成'
                        }
                    </Text>
                    <Slider
                        disabled={true}
                        maximumValue={690}
                        value={this.state.updateValue}
                    />
                </View>
            )
        }else{
            view = (
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <StatusBar
                            animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
                            hidden={false}  //是否隐藏状态栏。
                            backgroundColor={'#00000000'}
                            translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
                            barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')
                        />
                        <App />
                    </PersistGate>
                </Provider>
            );
        }
        return view;
    }
}

const app = codePush(codePushOptions)(Root);

export default app