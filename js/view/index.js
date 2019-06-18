import { SwitchNavigator, DrawerNavigator } from 'react-navigation';
import StackNavigator from './common/StackNavigator';
import Main from './Main';
import SignIn from './auth/SignIn';
// import SignUp from './auth/SignUp';
// import FindPwd from './auth/FindPwd';
import AuthLoading from './auth';
import Publish from './publish';
import DrawerSideBar from './DrawerSideBar';
import Bill from './work/bill';
import BillHistory from './work/bill/BillHistory';
import BillTotal from './work/bill/BillTotal';
import BillForm from './work/bill/BillForm';
import BillDetail from './work/bill/BillDetail';
import BillLabel from './work/bill/label';
import BillLabelForm from './work/bill/label/BillLabelForm';
import BillSortForm from './work/bill/sort/BillSortForm';
import Contact from './work/contact';
import ContactDetail from './work/contact/ContactDetail'

const AppStack = StackNavigator({
    // BillHistory,
    Main,
    Bill,
    BillHistory,
    BillTotal,
    BillForm,
    BillDetail,
    BillLabel,
    BillLabelForm,
    BillSortForm,
    Publish,
    Contact,
    ContactDetail,
},);


const AuthStack = StackNavigator(
    {
        SignIn,
        // SignUp,
        // FindPwd,
    },
);

export default SwitchNavigator(
    {
        AuthLoading,
        Auth: AuthStack,
        // App:AppStack
        App: DrawerNavigator({
            AppStack,
        }, {
            contentComponent: DrawerSideBar,
        }),
    },
);