import { SwitchNavigator, DrawerNavigator } from 'react-navigation';
import StackNavigator from './common/StackNavigator';
import Main from './Main';
import CheckLock from './auth/CheckLock';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import FindPwd from './auth/FindPwd';
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
import ContactDetail from './work/contact/ContactDetail';
import About from './mine/about';
import Help from './mine/help';
import Feedback from './mine/help/Feedback';
import Instruction from './mine/help/Instruction';
import Set from './mine/set';
import UpdateTel from './mine/set/UpdateTel';
import UpdatePassword from './mine/set/UpdatePassword';
import Lock from './mine/set/Lock';
import Service from './mine/service';

const AppStack = StackNavigator({
    Main,
    About,
    Help,
    Feedback,
    Instruction,
    Set,
    UpdateTel,
    UpdatePassword,
    Lock,
    Service,
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
        SignUp,
        FindPwd,
        CheckLock,
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