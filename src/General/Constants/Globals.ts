import moment from 'moment';
import AppConfig from './AppConfig';
import { Search } from 'lucide-react-native';

// Global variables
const Globals = {
    gDefaultPagination: 30,

    gFilterRecipeList: {
        page: 1,
        per: AppConfig.defaultPageLimit,
        search: '',
    },

    gFilterFoodGroupList: {
        search: '',
    },

};

export default Globals;
