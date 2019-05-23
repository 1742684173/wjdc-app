// @flow
import merge from 'lodash/merge';
import { TabNavigator as ReactTabNavigator, TabBarBottom } from 'react-navigation';
import type {
    NavigationRouteConfigMap,
    TabNavigatorConfig,
    NavigationContainer,
} from 'react-navigation';

const defaultDrawConfig = {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    backBehavior:'none ',
    tabBarOptions: {
        activeTintColor: '#21c3ff',
    },
};

const TabNavigator = (
    routeConfigMap: NavigationRouteConfigMap,
    drawConfig?: TabNavigatorConfig,
): NavigationContainer<*, *, *> => {
    return ReactTabNavigator(
        routeConfigMap,
        merge({}, defaultDrawConfig, drawConfig),
    );
};

export default TabNavigator;
