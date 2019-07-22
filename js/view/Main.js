/* eslint-disable no-param-reassign */
// @flow
import React from 'react';
import { Image } from 'react-native';
import TabNavigator from './common/TabNavigator';
import DrawerButton from './DrawerButton';
import MessageButton from './MessageButton';
import Home from './home';
import Work from './work';
import Mine from './mine';


const TAB_ICONS = {
    Home: {
        default: require('../img/tab/tab_button_1_nor.png'),
        active: require('../img/tab/tab_button_1_selected.png'),
    },
    Work: {
        default: require('../img/tab/tab_button_3_nor.png'),
        active: require('../img/tab/tab_button_3_selected.png'),
    },
    Mine: {
      default: require('../img/tab/tab_button_4_nor.png'),
      active: require('../img/tab/tab_button_4_selected.png'),
    },
};

const TAB_CONFIG_MAP = [
    // { title: '首页', routeName: 'Home', screen: Home },
    // { title: '工作', routeName: 'Work', screen: Work },
    { title: '我的', routeName: 'Mine', screen: Mine },
];

const createTabIconForRouteName = (routeName) => ({ focused }) => {
    const icons = TAB_ICONS[routeName];
    return <Image source={focused ? icons.active : icons.default} />;
};

export default TabNavigator(
    TAB_CONFIG_MAP.reduce((routeConfigMap, { title, routeName, screen }) => {
        routeConfigMap[routeName] = {
            screen,
            navigationOptions: {
                tabBarLabel:title,
                tabBarIcon: createTabIconForRouteName(routeName),
                headerLeft: <DrawerButton />,
                headerRight:<MessageButton />,
            },
        };
        return routeConfigMap;
    }, {}),
);
