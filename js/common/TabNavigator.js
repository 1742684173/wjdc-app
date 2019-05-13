// @flow
import merge from 'lodash/merge';
import { TabNavigator as ReactTabNavigator, TabBarBottom } from 'react-navigation';
import type {
    NavigationRouteConfigMap,
    TabNavigatorConfig,
    NavigationContainer,
} from 'react-navigation';
import Theme from './Theme';

const defaultDrawConfig = {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    backBehavior:'none ',
    tabBarOptions: {
        activeTintColor: Theme.primaryColor,
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
