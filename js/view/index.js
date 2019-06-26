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
import BillHistory from './work/bill/History';
import BillTotal from './work/bill/Total';
import BillForm from './work/bill/BillForm';
import BillDetail from './work/bill/Detail';
import BillLabel from './work/bill/label';
import BillSort from './work/bill/sort';
import BillSortDetail from './work/bill/sort/Detail';
import BillLabelAddForm from './work/bill/label/AddForm';
import BillLabelUpdateForm from './work/bill/label/UpdateForm';
import BillSortAddForm from './work/bill/sort/AddForm';
import BillSortUpdateForm from './work/bill/sort/UpdateForm';
import Contact from './work/contact';
import ContactDetail from './work/contact/ContactDetail'

const AppStack = StackNavigator({
    Main,
    Bill,
    BillHistory,
    BillTotal,
    BillForm,
    BillDetail,
    BillLabel,
    BillSort,
    BillSortDetail,
    BillLabelAddForm,
    BillLabelUpdateForm,
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