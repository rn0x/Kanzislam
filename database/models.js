import Users from './models/Users.js';
import Categories from './models/Categories.js';
import Topics from './models/Topics.js';
import Comments from './models/Comments.js';
import Tags from './models/Tags.js';
import Likes from './models/Likes.js';
import Favorites from './models/Favorites.js';
import Reports from './models/Reports.js';
import Views from './models/Views.js';
import Notifications from './models/Notifications.js';
import Images from './models/Images.js';
import Videos from './models/Videos.js';
import Audios from './models/Audios.js';
import Statistics from './models/Statistics.js';

/**
 * تستورد النماذج وتنشئ العلاقات بينها.
 * @param {Sequelize} sequelize - كائن Sequelize.
 * @returns {Object} - كائن يحتوي على النماذج المستوردة والعلاقات بينها.
 */

function model(sequelize) {
    const UsersModel = Users(sequelize);
    const CategoriesModel = Categories(sequelize);
    const TopicsModel = Topics(sequelize);
    const CommentsModel = Comments(sequelize);
    const TagsModel = Tags(sequelize);
    const LikesModel = Likes(sequelize);
    const FavoritesModel = Favorites(sequelize);
    const ReportsModel = Reports(sequelize);
    const ViewsModel = Views(sequelize);
    const NotificationsModel = Notifications(sequelize);
    const ImagesModel = Images(sequelize);
    const VideosModel = Videos(sequelize);
    const AudiosModel = Audios(sequelize);
    const StatisticsModel = Statistics(sequelize);

    UsersModel.belongsTo(CategoriesModel, { foreignKey: 'category_id' });
    TopicsModel.belongsTo(UsersModel, { as: 'user', foreignKey: 'user_id' });
    TopicsModel.hasMany(CommentsModel, { foreignKey: 'topic_id', as: 'comments' });
    CommentsModel.belongsTo(TopicsModel, { foreignKey: 'topic_id', as: 'topic' });

    return {
        Users: UsersModel,
        Categories: CategoriesModel,
        Topics: TopicsModel,
        Comments: CommentsModel,
        Tags: TagsModel,
        Likes: LikesModel,
        Favorites: FavoritesModel,
        Reports: ReportsModel,
        Views: ViewsModel,
        Notifications: NotificationsModel,
        Images: ImagesModel,
        Videos: VideosModel,
        Audios: AudiosModel,
        Statistics: StatisticsModel
    };
}

export default model;