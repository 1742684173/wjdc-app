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
import BillAnalyse from './work/bill/BillAnalyse';
import BillEditForm from './work/bill/BillEditForm';
import BillAddForm from './work/bill/BillAddForm';
import BillDetail from './work/bill/BillDetail';
import BillLabel from './work/bill/label';
import BillLabelDetail from './work/bill/label/BillLabelDetail';
import BillLabelAddForm from './work/bill/label/BillLabelAddForm';
import BillLabelEditForm from './work/bill/label/BillLabelEditForm';
import BillSort from './work/bill/sort';
import BillSortDetail from './work/bill/sort/BillSortDetail';
import BillSortAddForm from './work/bill/sort/BillSortAddForm';
import BillSortUpdateForm from './work/bill/sort/BillSortEditForm';
import Contact from './work/contact';
import ContactDetail from './work/contact/ContactDetail'

const AppStack = StackNavigator({
    Main,
    Bill,
    BillHistory,
    BillTotal,
    BillAnalyse,
    BillAddForm,
    BillEditForm,
    BillDetail,
    BillLabel,
    BillLabelDetail,
    BillLabelAddForm,
    BillLabelEditForm,
    BillSort,
    BillSortDetail,
    BillSortAddForm,
    BillSortUpdateForm,
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